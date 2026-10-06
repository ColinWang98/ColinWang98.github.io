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
      assert.equal(await page.locator('#project-neonhk h3').innerText(), 'Spatial Hong Kong');
      await page.locator('#project-neonhk img').scrollIntoViewIfNeeded();
      await page.locator('#project-neonhk img').evaluate(img => img.decode());
      assert.equal(await page.locator('#project-neonhk .btn').getAttribute('href'), 'https://neonhk.vercel.app/');
      assert.equal(await page.locator('[data-project]').count(), 6);
      const links = page.locator('#project-navigation a');
      assert.equal(await links.count(), 6);
      assert.deepEqual(await links.evaluateAll(els => els.map(el => el.hash)), await page.locator('[data-project]').evaluateAll(els => els.map(el => `#${el.id}`)));
      assert.equal(await page.locator('[data-project-title]').innerText(), 'Spatial Hong Kong');
      assert.equal(await page.locator('[data-project-count]').innerText(), '01 / 06');
      await page.locator('.project-instruments').scrollIntoViewIfNeeded();
      for (let i = 1; i <= 6; i++) {
        await page.locator('[data-project-next]').click();
        await page.waitForFunction(index => document.querySelector('[data-project-count]').textContent === `${String(index + 1).padStart(2, '0')} / 06`, i % 6);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal overflow at ${width}px`);
      await page.screenshot({ path: path.join(output, `projects-with-spatial-hong-kong-${width}.png`), fullPage: true });
      console.log(`PASS education logos and six-project navigation at ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
