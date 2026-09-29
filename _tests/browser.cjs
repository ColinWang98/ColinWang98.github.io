// Run with the local visual preview on port 4173; Jekyll remains the release gate.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = 'http://127.0.0.1:4173';
  const output = path.resolve(__dirname, '../_site/verification');
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const route of ['', 'education/', 'publications/', 'work/', 'activities/', 'awards/', 'others/', 'deadlines/']) {
      await page.goto(`${base}/${route}`, { waitUntil: 'domcontentloaded' });
      await page.locator('.ceramic-theme').waitFor();
      await page.waitForFunction(() => document.querySelector('.author__avatar img').naturalWidth > 0);
      for (const width of [320, 390, 768, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(80);
        const metrics = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          text: document.body.innerText.length,
          current: document.querySelectorAll('#site-nav [aria-current="page"]').length,
          font: parseFloat(getComputedStyle(document.body).fontSize),
          bioFont: parseFloat(getComputedStyle(document.querySelector('.author__bio')).fontSize),
          navFont: parseFloat(getComputedStyle(document.querySelector('#site-nav a')).fontSize),
          buttonFont: parseFloat(getComputedStyle(document.querySelector('.btn--cv')).fontSize),
          header: document.querySelector('.masthead').getBoundingClientRect().height,
          overlap: [...document.querySelectorAll('.paper-box, .timeline-content, .research-card')].some((el) => el.scrollWidth > el.clientWidth + 2)
        }));
        assert.ok(metrics.scroll <= metrics.width + 1, `${route || 'home'} ${width}: horizontal overflow ${JSON.stringify(metrics)}`);
        assert.ok(!metrics.overlap, `${route || 'home'} ${width}: card content overflow`);
        assert.ok(metrics.text > 200 && metrics.current === 1 && metrics.font >= 18, `${route || 'home'} ${width}: content/nav/font`);
        assert.ok(metrics.bioFont >= 15 && metrics.navFont >= 16 && metrics.buttonFont >= 16, `${route || 'home'} ${width}: readable shared typography ${JSON.stringify(metrics)}`);
        assert.ok(metrics.header < 90, `${route || 'home'} ${width}: masthead grew to ${metrics.header}px`);
      }
      console.log(`PASS layout: /${route} at six widths`);
      if (['education/', 'publications/', 'awards/'].includes(route)) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: path.join(output, `${route.slice(0, -1)}-desktop.png`) });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator('.project-instruments.is-enhanced').waitFor();
    await page.waitForTimeout(1000);
    assert.ok(await page.locator('.masthead').evaluate((el) => el.getBoundingClientRect().height) < 90, 'stable masthead after observer updates');
    await page.screenshot({ path: path.join(output, 'ipod-eink-desktop.png') });
    const projects = await page.locator('[data-project]').evaluateAll((elements) => elements.map((el) => ({ id: el.id, title: el.querySelector('h3').textContent, category: el.dataset.category, period: el.dataset.period })));
    const projectIndex = page.locator('.project-frame-index');
    const frameHeader = page.locator('.project-frame-header');
    assert.deepEqual(projects.map((project) => project.id), ['project-neonhk', 'project-breathing', 'project-intercultural', 'project-moderator', 'project-metachamber', 'project-farm']);
    assert.equal(await projectIndex.locator('a').count(), 6);
    for (const index of [0, 1, 2, 3, 4, 5, 2, 0]) {
      const project = projects[index];
      await projectIndex.locator(`a[href="#${project.id}"]`).click();
      await page.waitForFunction((id) => document.querySelector('[data-project].is-current-project')?.id === id, project.id);
      assert.equal(await frameHeader.locator('[data-project-title]').textContent(), project.title);
      assert.equal(await frameHeader.locator('[data-project-count]').innerText(), `${String(index + 1).padStart(2, '0')} / 06`);
      assert.equal(await frameHeader.locator('[data-category-readout]').innerText(), project.category);
      assert.equal(await frameHeader.locator('[data-period-readout]').innerText(), project.period);
      assert.equal(await projectIndex.locator('[aria-current="location"]').count(), 1);
      assert.equal(await projectIndex.locator('[aria-current="location"]').getAttribute('href'), `#${project.id}`);
      assert.equal(await page.evaluate(() => document.activeElement.id), project.id);
      assert.equal(new URL(page.url()).hash, `#${project.id}`);
      const clearance = await page.locator(`#${project.id}`).evaluate((el) => ({
        projectTop: el.getBoundingClientRect().top,
        headerBottom: document.querySelector('.project-frame-header').getBoundingClientRect().bottom
      }));
      assert.ok(clearance.projectTop >= clearance.headerBottom - 1, `${project.id}: anchor covered by frame ${JSON.stringify(clearance)}`);
    }
    await projectIndex.locator('a[href="#project-moderator"]').click();
    await page.screenshot({ path: path.join(output, 'projects-desktop.png') });
    console.log('PASS project anchors: all six plus reverse jumps, metadata, focus and hash');

    for (const index of [4, 5, 0]) {
      await page.locator('[data-project-next]').click();
      await page.waitForFunction((id) => document.querySelector('[data-project].is-current-project')?.id === id, projects[index].id);
      assert.equal(new URL(page.url()).hash, `#${projects[index].id}`);
      const angle = await page.locator('.project-instruments').evaluate((el) => parseFloat(el.style.getPropertyValue('--project-angle')));
      assert.equal((angle % 360 + 360) % 360, (-135 + index * 54 + 360) % 360);
    }
    console.log('PASS selector press advances projects, wraps, and synchronizes its pointer');
    await projectIndex.locator('a[href="#project-moderator"]').click();

    for (const index of [1, 4, 2]) {
      await page.evaluate((id) => {
        const target = document.getElementById(id);
        const panel = document.querySelector('.project-instruments');
        const frame = panel.getBoundingClientRect();
        const header = document.querySelector('.project-frame-header').getBoundingClientRect();
        const compact = matchMedia('(max-width: 1099px), (max-height: 699px)').matches;
        const apertureTop = Math.max(header.bottom, parseFloat(getComputedStyle(panel).top));
        const apertureBottom = compact ? innerHeight : Math.min(frame.bottom, innerHeight);
        const readingLine = apertureTop + Math.max(0, apertureBottom - apertureTop) / 3;
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - readingLine + 10);
      }, projects[index].id);
      await page.waitForFunction((id) => document.querySelector('[data-project].is-current-project')?.id === id, projects[index].id);
    }
    assert.equal(await page.locator('.project-instruments').evaluate((el) => getComputedStyle(el).position), 'sticky');
    assert.equal(await page.locator('.project-stream').evaluate((el) => getComputedStyle(el).overflowY), 'visible');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert.equal(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior), 'smooth');
    await projectIndex.locator('a[href="#project-moderator"]').click();
    await page.waitForFunction(() => document.querySelector('[data-project].is-current-project')?.id === 'project-moderator');
    await page.waitForTimeout(800);
    await page.locator('[data-project-next]').click();
    await page.waitForFunction(() => document.querySelector('[data-project].is-current-project')?.id === 'project-metachamber');
    await projectIndex.locator('a[href="#project-moderator"]').click();
    await page.waitForFunction(() => document.querySelector('[data-project].is-current-project')?.id === 'project-moderator');
    assert.equal(await page.locator('[data-project].is-current-project').getAttribute('id'), 'project-moderator');
    assert.ok(await page.locator('.project-instruments, .project-frame-header, .project-frame-window').evaluateAll((elements) => elements.every((el) => getComputedStyle(el).animationName === 'none')), 'the viewing frame itself does not animate');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior), 'auto');
    assert.ok(await page.locator('.project-instruments, .project-instruments *').evaluateAll((elements) => elements.every((el) => {
      const style = getComputedStyle(el);
      return style.animationName === 'none' && style.transitionDuration.split(',').every((duration) => parseFloat(duration) === 0);
    })), 'reduced motion removes frame animations and transitions');
    await projectIndex.locator('a[href="#project-farm"]').click();
    await page.waitForFunction(() => document.querySelector('#project-farm').classList.contains('is-current-project'));
    console.log('PASS aperture-based natural scrolling, native smooth anchors and reduced motion');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/#project-moderator`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#project-moderator').classList.contains('is-current-project'));
    await page.locator('[data-project-next]').click();
    await page.waitForFunction(() => document.querySelector('#project-metachamber').classList.contains('is-current-project'));
    assert.equal(await page.locator('#project-navigation').isHidden(), true, 'compact knob works without opening the list');
    await page.screenshot({ path: path.join(output, 'projects-mobile.png') });
    const toggle = page.locator('.instrument-menu-toggle');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.ok(await toggle.evaluate((el) => document.activeElement === el));
    await toggle.click();
    await projectIndex.locator('a[href="#project-farm"]').click();
    await page.waitForFunction(() => document.querySelector('#project-farm').classList.contains('is-current-project'));
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'project-farm');
    await toggle.click();
    await page.locator('.masthead').click({ position: { x: 2, y: 2 } });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.ok(await projectIndex.isHidden());
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.author__menu-toggle').click();
    assert.equal(await page.locator('.author__menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.author__menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('.js-easter-egg-trigger').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.js-easter-egg-trigger').getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Enter');
    await page.mouse.click(380, 340);
    await page.screenshot({ path: path.join(output, 'ipod-eink-mobile.png') });
    console.log('PASS mobile: deep link, instrument menu, Escape, Contact and keyboard avatar');

    await page.goto(`${base}/others/`, { waitUntil: 'domcontentloaded' });
    // Poetry internals are verified by their own suite, not this page smoke test.
    await page.locator('.carousel-btn.next').click();
    assert.match(await page.locator('.carousel-slide.active img').getAttribute('src'), /photo2/);
    await page.locator('.portfolio-preview summary').click();
    assert.ok(await page.locator('.portfolio-preview').getAttribute('open') !== null);
    assert.ok(await page.locator('a[href*="app.tapnow.ai"]').count() > 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, 'others-desktop.png') });
    await page.goto(`${base}/deadlines/`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => /\d+ conferences/.test(document.querySelector('#deadline-count').textContent), null, { timeout: 45000 });
    await page.locator('#deadline-status').selectOption('all');
    await page.locator('.deadline-row').first().waitFor();
    await page.locator('#deadline-search').fill('not-a-conference-xyz');
    assert.equal(await page.locator('.deadline-row').count(), 0);
    console.log('PASS Others and Deadlines interactions');

    // A narrow CSS viewport is a reflow check, not actual browser zoom.
    await page.setViewportSize({ width: 720, height: 500 });
    for (const route of ['', 'publications/', 'others/', 'deadlines/']) {
      await page.goto(`${base}/${route}`, { waitUntil: 'domcontentloaded' });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
    }
    console.log('PASS narrow-viewport reflow (720 CSS px); actual zoom is not tested here');

    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const fallback = await nojs.newPage();
    await fallback.goto(base, { waitUntil: 'domcontentloaded' });
    assert.equal(await fallback.locator('[data-project]').count(), 6);
    assert.equal(await fallback.locator('.project-frame-index a:visible').count(), 6);
    await fallback.locator('.project-frame-index a[href="#project-farm"]').click();
    assert.equal(new URL(fallback.url()).hash, '#project-farm');
    await nojs.close();
    assert.deepEqual(errors, [], `uncaught page errors: ${errors.join('; ')}`);
    console.log('PASS no-JS navigation and no uncaught script errors');
    console.log(`Screenshots: ${output}`);
  } catch (error) {
    console.error('Browser failure state:', await page.evaluate(() => ({
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      scrollY,
      scrollPadding: getComputedStyle(document.documentElement).scrollPaddingTop,
      focus: document.activeElement.id || document.activeElement.className,
      currentProject: document.querySelector('[data-project].is-current-project')?.id,
      frame: document.querySelector('.project-instruments')?.getBoundingClientRect().toJSON(),
      frameHeader: document.querySelector('.project-frame-header')?.getBoundingClientRect().toJSON(),
      projects: [...document.querySelectorAll('[data-project]')].map((el) => ({
        id: el.id, top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom,
        scrollMargin: getComputedStyle(el).scrollMarginTop
      }))
    })), 'Page errors:', errors);
    throw error;
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
