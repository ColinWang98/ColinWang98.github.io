const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  fs.mkdirSync('_site/verification', { recursive: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    for (const width of [320, 390, 768, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1400 });
      await page.goto('http://127.0.0.1:4173/');
      const covers = page.locator('.project-cover');
      assert.equal(await covers.count(), 6);
      for (const cover of await covers.all()) {
        await cover.scrollIntoViewIfNeeded();
        await cover.locator('img').evaluate(img => img.decode());
        assert.ok(await cover.evaluate(el => {
          const art = el.querySelector('.project-cover-art').getBoundingClientRect();
          const text = el.querySelector('.project-cover-copy').getBoundingClientRect();
          return text.left >= art.left && text.right <= art.right && text.bottom <= art.bottom;
        }), `cover text fits at ${width}`);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const demo of await page.locator('.project-demo').all()) {
        await demo.locator('summary').click();
        assert.ok(await demo.locator('iframe').isVisible());
        await demo.locator('summary').click();
        assert.equal(await demo.getAttribute('open'), null);
      }
      if (width === 1440 || width === 390) {
        await page.locator('#project-neonhk').screenshot({ path: `_site/verification/project-cover-${width}.png` });
        for (const name of ['breathing', 'intercultural', 'moderator', 'metachamber', 'farm']) {
          await page.locator(`#project-${name} .project-cover`).evaluate(el => el.scrollIntoView({ block: 'center' }));
          await page.locator(`#project-${name} .project-cover`).screenshot({ path: `_site/verification/cover-${name}-${width}.png` });
        }
      }
      console.log(`PASS covers, media disclosures and reflow at ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
