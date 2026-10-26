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
    assert.equal(await page.locator('.project-gallery-card').count(), 6);
    for (const card of await page.locator('.project-gallery-card').all()) {
      await card.click();
      assert.ok(await page.getByRole('dialog').isVisible());
      await page.keyboard.press('Escape');
      assert.ok(await card.evaluate(el => document.activeElement === el));
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/#project-moderator`);
    assert.ok(await page.getByRole('dialog').isVisible());
    await page.keyboard.press('Escape');
    console.log('PASS gallery dialogs, keyboard focus and mobile deep link');
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
    console.log('PASS mobile: Escape, Contact and keyboard avatar');

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
    assert.equal(await fallback.locator('[data-project]:visible').count(), 6);
    await fallback.goto(`${base}/#project-farm`);
    assert.ok(await fallback.locator('#project-farm').isVisible());
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
