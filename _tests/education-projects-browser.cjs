const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const output = path.join(__dirname, '../_site/verification');
  fs.mkdirSync(output, { recursive: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('http://127.0.0.1:4173/education/');
      for (const logo of await page.locator('.education-logo').all()) {
        await logo.scrollIntoViewIfNeeded();
        await logo.locator('img').evaluate(img => img.decode());
        const fits = await logo.evaluate(el => {
          const img = el.querySelector('img');
          const box = el.getBoundingClientRect();
          const image = img.getBoundingClientRect();
          return img.naturalWidth > 0 && getComputedStyle(img).objectFit === 'contain' &&
            image.top >= box.top && image.bottom <= box.bottom && image.left >= box.left && image.right <= box.right;
        });
        assert.ok(fits, `complete logo at ${width}px`);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `education-logos-${width}.png`), fullPage: true });
      await page.goto('http://127.0.0.1:4173/');
      const cards = page.locator('.project-gallery-card');
      assert.equal(await cards.count(), 6);
      await cards.first().click();
      assert.equal(await page.getByRole('dialog').locator('h3').innerText(), 'Spatial Hong Kong');
      await page.locator('#project-neonhk img').evaluate(img => img.decode());
      assert.equal(await page.locator('#project-neonhk .btn').getAttribute('href'), 'https://neonhk.vercel.app/');
      await page.keyboard.press('Escape');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal overflow at ${width}px`);
      await page.screenshot({ path: path.join(output, `projects-with-spatial-hong-kong-${width}.png`), fullPage: true });
      console.log(`PASS education logos and project gallery at ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
