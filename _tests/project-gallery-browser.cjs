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
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('http://127.0.0.1:4173/');
      assert.equal(await page.locator('.project-instruments').count(), 0);
      const cards = page.locator('.project-gallery-card');
      assert.equal(await cards.count(), 6);
      for (let index = 0; index < 6; index++) {
        await cards.nth(index).click();
        const dialog = page.getByRole('dialog');
        assert.ok(await dialog.isVisible());
        assert.equal(await dialog.locator('[data-project]').count(), 1);
        assert.ok(await dialog.locator('h3').isVisible());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.keyboard.press('Escape');
        assert.equal(await dialog.isVisible(), false);
        assert.ok(await cards.nth(index).evaluate(el => el === document.activeElement));
      }
      await page.goto('http://127.0.0.1:4173/#project-breathing');
      assert.ok(await page.getByRole('dialog').isVisible());
      await page.getByRole('dialog').locator('.project-demo summary').click();
      assert.ok(await page.locator('#project-breathing iframe').getAttribute('src'));
      await page.getByRole('button', { name: 'Close project' }).click();
      assert.equal(await page.locator('#project-breathing iframe').getAttribute('src'), null);
      if (width === 1440 || width === 390) {
        await page.locator('.project-explorer').screenshot({ path: `_site/verification/gallery-${width}.png` });
        await cards.first().click();
        await page.screenshot({ path: `_site/verification/gallery-dialog-${width}.png` });
        await page.keyboard.press('Escape');
      }
      console.log(`PASS gallery, all dialogs, focus, media and deep links at ${width}px`);
    }
    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto('http://127.0.0.1:4173/');
    assert.equal(await noJs.locator('[data-project]:visible').count(), 6);
    console.log('PASS no-JS project content remains readable');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
