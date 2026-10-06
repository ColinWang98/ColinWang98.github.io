const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = path.join(root, 'assets/js/project-instruments.js');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('project controller exposes the same positioning logic used in the browser', () => {
  assert.ok(fs.existsSync(script), 'project instrument controller is missing');
});

test('reading line selects a project in both scrolling directions and across gaps', () => {
  if (!fs.existsSync(script)) return;
  const { projectAt } = require(script);
  const starts = [100, 600, 1200, 1800, 2400, 3000];
  for (const [line, index] of [[0, 0], [599, 0], [600, 1], [3050, 5], [1250, 2], [100, 0]]) {
    assert.equal(projectAt(starts, line), index);
  }
});

test('reading line is one third into the frame aperture, not the viewport', () => {
  const { readingLine } = require(script);
  assert.equal(typeof readingLine, 'function');
  assert.equal(readingLine(80, 800, 140, 900, false), 440);
  assert.equal(readingLine(-20, 800, 140, 900, false), 340);
  assert.equal(readingLine(80, 120, 120, 800, true), 400);
});

test('visible aperture reaches the last project while the frame exits under the masthead', () => {
  const { readingLine, projectAt } = require(script);
  const starts = [1522.140625, 1957.8125, 2347.8125, 2707.8125, 3159.40625, 3574.203125];
  const line = readingLine(-58, 895, 120.046875, 1000, false, 89);
  assert.ok(line > 322.203125, `last project starts at 322.20px, reading line is ${line}`);
  assert.equal(projectAt(starts, 3252 + line), 5);
  for (const scrollY of [3105, 3252, 3300, 3252, 3105]) {
    const top = Math.min(89, 4089 - scrollY - 895);
    const selected = projectAt(starts, scrollY + readingLine(top, 895, 120.046875, 1000, false, 89));
    assert.equal(selected, scrollY >= 3252 ? 5 : 4, `selection at scrollY ${scrollY}`);
  }
});

test('reading line excludes aperture portions outside the viewport', () => {
  const { readingLine } = require(script);
  assert.equal(readingLine(700, 895, 120, 1000, false, 89), 880);
  assert.equal(readingLine(-150, 895, 120, 1000, false, 89), 89 + (745 - 89) / 3);
  assert.equal(readingLine(73, 120, 120, 844, true, 73), 193 + (844 - 193) / 3);
});

const ids = ['project-neonhk', 'project-breathing', 'project-intercultural', 'project-moderator', 'project-metachamber', 'project-farm'];

test('frame contains six real, ordered links and a progressive disclosure button', () => {
  const html = read('_includes/project-instruments.html');
  assert.match(html, /class="[^"]*project-frame-header/);
  assert.match(html, /class="[^"]*project-frame-window[^\"]*"[^>]*aria-hidden="true"/);
  assert.deepEqual([...html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)].map((match) => match[1]), ids);
  assert.match(html, /<nav\b[^>]*id="project-navigation"[^>]*>/);
  assert.doesNotMatch(html.match(/<nav\b[^>]*>/)[0], /\bhidden\b/);
  assert.match(html, /<button\b[^>]*aria-expanded="false"[^>]*aria-controls="project-navigation"[^>]*hidden/);
  for (const name of ['count', 'title']) assert.match(html, new RegExp(`data-project-${name}`));
  for (const name of ['period', 'category']) assert.match(html, new RegExp(`data-${name}-readout`));
});

test('frame uses section-bounded sticky positioning without scroll capture code', () => {
  const css = read('assets/css/project-instruments.css');
  const js = read('assets/js/project-instruments.js');
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /grid-area:\s*1\s*\/\s*1/);
  assert.match(css, /project-frame-window/);
  assert.match(css, /max-width:\s*1099px/);
  assert.match(css, /max-height:\s*699px/);
  assert.match(js, /max-height: 699px/);
  assert.doesNotMatch(css, /position:\s*fixed|scroll-snap/);
  assert.match(css, /\.project-instruments\.is-enhanced \.project-frame-index\s*\{[^}]*max-height:[^}]*overflow-y:\s*auto/s);
  assert.match(css, /var\(--housing-face/);
  assert.match(css, /var\(--surface-soft/);
  assert.doesNotMatch(js, /addEventListener\(["'](?:wheel|touchmove)["']|preventDefault\(|scrollTo\(|scrollIntoView\(/);
  for (const observer of ['IntersectionObserver', 'ResizeObserver', 'requestAnimationFrame']) assert.ok(js.includes(observer));
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /scroll-behavior:\s*auto/);
});

test('selector takes the shortest rotation between six calibrated stops', () => {
  const { selectorAngle } = require(script);
  assert.equal(selectorAngle(0, 0), -135);
  assert.equal(selectorAngle(-135, 1), -81);
  assert.equal(selectorAngle(135, 0), 225);
  assert.equal(selectorAngle(-135, 5), -225);
  let angle = 0;
  for (const index of [0, 5, 1, 4, 2, 3, 0]) {
    const next = selectorAngle(angle, index);
    assert.ok(Math.abs(next - angle) <= 180);
    assert.equal(((next % 360) + 360) % 360, ((-135 + index * 54) + 360) % 360);
    angle = next;
  }
});

test('selector is a real button with progressive enhancement and a decorative pointer', () => {
  const html = read('_includes/project-instruments.html');
  assert.match(html, /<button[^>]*data-project-next[^>]*hidden/);
  assert.match(html, /class="project-selector-pointer" aria-hidden="true"/);
  assert.match(read('assets/js/project-instruments.js'), /--project-angle/);
});

test('all six projects carry unique anchors and readable metadata', () => {
  const html = read('index.md');
  const projects = [...html.matchAll(/<div class="paper-box" id="([^"]+)" data-project[^>]*>/g)];
  assert.equal(projects.length, 6);
  assert.deepEqual(projects.map((match) => match[1]), ids);
  assert.equal(new Set(projects.map((match) => match[1])).size, 6);
  for (const [markup] of projects) {
    assert.match(markup, /data-category="(AI|XR|Heritage|UI-UX)"/);
    assert.match(markup, /data-period="[^"]+"/);
  }
  assert.match(html, /data-year="2025" data-period="06\/2025 - 09\/2025"/);
});

// Optional real-browser checks; the normal node:test suite has no dependencies.
test('viewing frame browser behavior', { skip: !process.env.PROJECT_FRAME_BROWSER }, async (t) => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  t.after(() => browser.close());
  const explorer = read('index.md').match(/<section class="project-explorer"[\s\S]*?<\/section>/)[0]
    .replace('{% include project-instruments.html %}', read('_includes/project-instruments.html'));
  const html = `<!doctype html><html><head><style>
    :root { --header-height: 72px; --nav-height: 72px; --font-instrument: monospace;
      --text-strong: #30363e; --text-muted: #65727e; --accent: #526b7e;
      --accent-strong: #334c60; --surface: #f6f8fa; --border: #cbd2d9; }
    * { box-sizing: border-box; } body { margin: 0; font: 16px sans-serif; }
    .masthead { position: fixed; inset: 0 0 auto; height: 72px; z-index: 50; background: white; }
    .page__content { max-width: 1100px; margin: auto; padding: 0 16px; }
    .before, .after { height: 1000px; } .paper-box { min-height: 640px; }
    img, iframe { max-width: 100%; } button, a { font: inherit; }
    ${read('assets/css/project-instruments.css')}
    </style></head><body class="ceramic-theme"><div class="masthead"></div>
    <main class="page__content"><div class="before"><button id="outside">Outside</button></div>
    ${explorer}<div class="after"></div></main></body></html>`;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.abort());
  await page.setContent(html);
  await page.addScriptTag({ content: read('assets/js/project-instruments.js') });
  const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const panel = page.locator('.project-instruments');
  const menu = page.locator('#project-navigation');
  const toggle = page.locator('.instrument-menu-toggle');
  const current = page.locator('[data-project].is-current-project');
  await settle();

  await t.test('desktop header stays compact and all visible frame labels are at least 13px', async () => {
    const height = await panel.locator('.project-frame-header').evaluate((el) => el.getBoundingClientRect().height);
    assert.ok(height >= 180 && height <= 210, `desktop header height: ${height}`);
    for (const size of [{ width: 1440, height: 1000 }, { width: 320, height: 640 }]) {
      await page.setViewportSize(size);
      await settle();
      const small = await panel.evaluate((el) => [...el.querySelectorAll('span, strong, a, button')]
        .filter((item) => item.getClientRects().length && getComputedStyle(item).fontSize && parseFloat(getComputedStyle(item).fontSize) < 13)
        .map((item) => `${item.className}: ${getComputedStyle(item).fontSize}`));
      assert.deepEqual(small, [], `small frame text at ${size.width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await settle();
  });

  await t.test('cold-load deep links land below the index after enhancement', async (subtest) => {
    const initial = await context.newPage();
    subtest.after(() => initial.close());
    await initial.route('**/*', (route) => route.request().isNavigationRequest() && route.request().frame() === initial.mainFrame()
      ? route.fulfill({ contentType: 'text/html', body: html.replace('<style>', `<style>${read('assets/css/ceramic.css')}`).replace('</body>', `<script>${read('assets/js/project-instruments.js')}</script></body>`) })
      : route.abort());
    for (const size of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await initial.setViewportSize(size);
      await initial.goto('http://project-frame.test/#project-breathing');
      await initial.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const heading = await initial.locator('#project-breathing h3').boundingBox();
      const header = await initial.locator('.project-frame-header').boundingBox();
      assert.ok(heading.y >= header.y + header.height, `cold anchor is covered at ${size.width}px: ${heading.y} < ${header.y + header.height}`);
      assert.equal(await initial.locator('[data-project].is-current-project').getAttribute('id'), 'project-breathing');
    }
  });

  await t.test('desktop readout height is stable when long project titles wrap', async (subtest) => {
    const content = page.locator('.page__content');
    subtest.after(() => content.evaluate((el) => { el.style.maxWidth = ''; }));
    await content.evaluate((el) => { el.style.maxWidth = '600px'; });
    await settle();
    const heights = [];
    for (const id of ids) {
      await menu.locator(`a[href="#${id}"]`).click();
      await settle();
      heights.push(await panel.locator('.project-frame-header').evaluate((el) => el.getBoundingClientRect().height));
    }
    assert.ok(Math.max(...heights) - Math.min(...heights) < 1, `readout changes the reading line: ${heights.join(', ')}`);
  });

  await t.test('desktop aperture stays in place while the document stream moves', async () => {
    assert.equal(await panel.evaluate((el) => getComputedStyle(el).position), 'sticky');
    await page.evaluate(() => window.scrollTo(0, document.querySelector('.project-explorer').offsetTop + 200));
    await settle();
    const before = await panel.boundingBox();
    const projectBefore = await page.locator('[data-project]').first().boundingBox();
    await page.evaluate(() => window.scrollBy(0, 120));
    await settle();
    const after = await panel.boundingBox();
    const projectAfter = await page.locator('[data-project]').first().boundingBox();
    assert.ok(before.height > 700, 'desktop frame spans the viewport');
    assert.ok(Math.abs(before.y - after.y) < 1);
    assert.ok(Math.abs(projectBefore.y - projectAfter.y - 120) < 1);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('.project-explorer').getBoundingClientRect().bottom + scrollY + 50));
    await settle();
    const ended = await panel.boundingBox();
    assert.ok(ended.y + ended.height < 1, 'frame must leave with its section');
  });

  await t.test('short final project becomes current at a section-clamped frame without forcing scroll', async (subtest) => {
    const ending = await context.newPage();
    subtest.after(() => ending.close());
    await ending.route('**/*', (route) => route.abort());
    await ending.setContent(html.replace('</style>', '.paper-box:last-child { min-height: 0; height: 420px; }</style>'));
    await ending.addScriptTag({ content: read('assets/js/project-instruments.js') });
    const settleEnding = () => ending.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await settleEnding();
    await ending.locator('.project-frame-index a[href="#project-farm"]').click();
    await settleEnding();
    const geometry = await ending.evaluate(() => ({
      scrollY,
      top: document.querySelector('.project-instruments').getBoundingClientRect().top,
      farmTop: document.querySelector('#project-farm').getBoundingClientRect().top,
      current: document.querySelector('[data-project].is-current-project')?.id
    }));
    assert.ok(geometry.top < 0, `fixture must exercise the frame exit: ${JSON.stringify(geometry)}`);
    assert.equal(geometry.current, 'project-farm', JSON.stringify(geometry));
    await ending.locator('.project-frame-index a[href="#project-metachamber"]').click();
    await settleEnding();
    assert.equal(await ending.locator('[data-project].is-current-project').getAttribute('id'), 'project-metachamber');
    await ending.evaluate((y) => window.scrollTo(0, y), geometry.scrollY);
    await settleEnding();
    assert.equal(new URL(ending.url()).hash, '#project-metachamber', 'natural selection must not depend on the hash');
    assert.equal(await ending.locator('[data-project].is-current-project').getAttribute('id'), 'project-farm');
    await ending.evaluate(() => window.scrollBy(0, 120));
    await settleEnding();
    assert.equal(await ending.locator('[data-project].is-current-project').getAttribute('id'), 'project-farm');
  });

  await t.test('all six native anchors update title, period, category and focus', async () => {
    for (const id of [...ids, ids[2], ids[0]]) {
      await menu.locator(`a[href="#${id}"]`).click();
      await settle();
      const project = page.locator(`#${id}`);
      assert.equal(await current.getAttribute('id'), id);
      assert.equal(await panel.locator('[data-project-title]').textContent(), await project.locator('h3').textContent());
      assert.equal(await panel.locator('[data-period-readout]').textContent(), await project.getAttribute('data-period'));
      assert.equal(await panel.locator('[data-category-readout]').textContent(), await project.getAttribute('data-category'));
      assert.equal(await page.evaluate(() => document.activeElement.id), id);
      assert.equal(await menu.locator('[aria-current="location"]').count(), 1);
      assert.equal(await page.evaluate(() => location.hash), `#${id}`);
      const heading = await project.locator('h3').boundingBox();
      const header = await panel.locator('.project-frame-header').boundingBox();
      assert.ok(heading.y >= header.y + header.height, 'target is below the frame header');
    }
  });

  await t.test('scroll uses cached geometry and layout changes invalidate it', async () => {
    await page.evaluate(() => {
      window.projectReads = 0;
      document.querySelectorAll('[data-project]').forEach((project) => {
        const original = project.getBoundingClientRect.bind(project);
        project.getBoundingClientRect = () => { window.projectReads += 1; return original(); };
      });
    });
    await page.evaluate(() => window.scrollBy(0, 12));
    await settle();
    assert.equal(await page.evaluate(() => window.projectReads), 0, 'no project layout reads on ordinary scroll');
    await page.locator('[data-project]').first().evaluate((el) => { el.style.minHeight = '900px'; });
    await settle();
    await settle();
    assert.ok(await page.evaluate(() => window.projectReads >= 5), 'resize refreshes cached project positions');
  });

  await t.test('compact dropdown closes safely on Escape, outside click, Tab and navigation', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await settle();
    assert.ok(await toggle.isVisible());
    assert.ok(await menu.isHidden());
    await toggle.click();
    await menu.locator('a').first().focus();
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.ok(await toggle.evaluate((el) => el === document.activeElement));
    await toggle.click();
    await menu.locator('a').first().focus();
    await page.locator('.masthead').click();
    assert.ok(await menu.isHidden());
    assert.ok(await toggle.evaluate((el) => el === document.activeElement), await page.evaluate(() => `outside click focus: ${document.activeElement.outerHTML.slice(0, 200)}`));
    await toggle.click();
    await menu.locator('a').last().focus();
    await page.keyboard.press('Tab');
    assert.ok(await menu.isHidden());
    assert.ok(await page.evaluate(() => !document.querySelector('#project-navigation').contains(document.activeElement)));
    await toggle.click();
    await menu.locator('a[href="#project-farm"]').click();
    await settle();
    assert.equal(await current.getAttribute('id'), 'project-farm');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'project-farm');
    assert.ok(await menu.isHidden());
  });

  await t.test('breakpoint changes never leave focus inside hidden UI', async () => {
    await toggle.focus();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await settle();
    assert.ok(await toggle.isHidden());
    assert.ok(await menu.locator('[aria-current]').evaluate((el) => el === document.activeElement), await page.evaluate(() => `breakpoint focus: ${document.activeElement.outerHTML.slice(0, 200)}`));
    await page.setViewportSize({ width: 1440, height: 699 });
    await settle();
    assert.ok(await toggle.isVisible());
    assert.ok(await menu.isHidden());
    assert.ok(await toggle.evaluate((el) => el === document.activeElement));
    await page.setViewportSize({ width: 1100, height: 700 });
    await settle();
    assert.ok(await toggle.isHidden());
    await page.setViewportSize({ width: 1099, height: 700 });
    await settle();
    assert.ok(await toggle.isVisible());
  });

  await t.test('short viewport dropdown scrolls within available space, not the project stream', async () => {
    await page.setViewportSize({ width: 390, height: 400 });
    await settle();
    await toggle.click();
    const bounds = await menu.boundingBox();
    assert.ok(bounds.y + bounds.height <= 400, 'dropdown remains inside the viewport');
    assert.equal(await menu.evaluate((el) => getComputedStyle(el).overflowY), 'auto');
    await menu.locator('a').last().click();
    await settle();
    assert.equal(await current.getAttribute('id'), 'project-farm');
    assert.equal(await page.locator('.project-stream').evaluate((el) => getComputedStyle(el).overflowY), 'visible');
  });

  await t.test('no-JS anchors and all projects remain readable at desktop and mobile sizes', async () => {
    const fallbackContext = await browser.newContext({ javaScriptEnabled: false });
    const fallback = await fallbackContext.newPage();
    await fallback.route('**/*', (route) => route.abort());
    await fallback.setContent(html);
    for (const size of [{ width: 1440, height: 900 }, { width: 320, height: 640 }]) {
      await fallback.setViewportSize(size);
      assert.equal(await fallback.locator('#project-navigation a:visible').count(), 6);
      assert.equal(await fallback.locator('[data-project]:visible').count(), 6);
      assert.ok(await fallback.locator('.instrument-menu-toggle').isHidden());
      await fallback.locator('#project-navigation a').last().click();
      assert.ok(fallback.url().endsWith('#project-farm'));
    }
    await fallbackContext.close();
  });

  await t.test('reduced motion and responsive widths preserve natural document scrolling', async () => {
    for (const size of [{ width: 320, height: 640 }, { width: 768, height: 500 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(size);
      await settle();
      const metrics = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        motion: getComputedStyle(document.documentElement).scrollBehavior,
        overflow: getComputedStyle(document.querySelector('.project-stream')).overflowY
      }));
      assert.ok(metrics.scrollWidth <= metrics.width);
      assert.equal(metrics.motion, 'auto');
      assert.equal(metrics.overflow, 'visible');
    }
    assert.deepEqual(errors, []);
  });
});

test('shared theme loads unconditionally and project script is homepage-only', () => {
  const head = read('_includes/head.html');
  assert.ok(!head.includes('home-neumorphic.css'));
  assert.match(head, /ceramic.css/);
  assert.match(read('_includes/scripts.html'), /if page.classes == 'homepage'[\s\S]*project-instruments.js[\s\S]*endif/);
  assert.ok(!read('_layouts/default.html').includes('page-orb'));
});

test('skills overview fills its row before the full-width tools card', () => {
  assert.match(read('awards.md'), /<div class="skills-grid">\s*<div class="skill-category skill-category--wide">/);
});

test('project media, external-link safety and published CHI DOI remain intact', () => {
  const index = read('index.md');
  const others = read('others.md');
  assert.match(index, /https:\/\/dl.acm.org\/doi\/10.1145\/3772318.3791653/);
  assert.match(index, /06\/2025 - 09\/2025/);
  assert.match(others, /https:\/\/app.tapnow.ai\//);
  assert.ok(fs.existsSync(path.join(root, 'assets/Wang Yao CV.pdf')));
  for (const source of [index, others, read('_includes/sidebar.html')]) {
    assert.ok(!source.includes('\ufffd'), 'replacement character in UTF-8 content');
    for (const [link] of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      assert.match(link, /rel="noopener noreferrer"/);
    }
    for (const [frame] of source.matchAll(/<iframe\b[^>]*>/g)) {
      assert.match(frame, /loading="lazy"/);
      assert.match(frame, /title="[^"]+"/);
    }
  }
  assert.ok(!index.includes('style='), 'new inline styles in project markup');
});
