const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const direction of ['right', 'down', 'left', 'up']) {
        const transition = await page.evaluate(direction => {
          const pages = document.querySelector('.device-pages');
          const before = pages.getBoundingClientRect().height;
          document.querySelector(`[data-device-direction="${direction}"]`).click();
          const animation = pages.getAnimations()[0];
          if (!animation) return { missing: true };
          animation.pause();
          animation.currentTime = 0;
          const start = pages.getBoundingClientRect().height;
          animation.currentTime = 180;
          const middle = pages.getBoundingClientRect().height;
          animation.finish();
          const end = pages.getBoundingClientRect().height;
          return { before, start, middle, end };
        }, direction);
        assert.ok(!transition.missing, `animation at ${width}/${direction}`);
        assert.ok(Math.abs(transition.start - transition.before) < 1, JSON.stringify(transition));
        assert.ok(transition.middle >= Math.min(transition.start, transition.end) - 1 && transition.middle <= Math.max(transition.start, transition.end) + 1);
        await page.waitForFunction(() => !document.querySelector('.device-pages').classList.contains('is-switching'));
        assert.equal(await page.locator('.device-pages').evaluate(el => el.style.height), '', 'natural height restored');
      }
    }
    const rapid = await page.evaluate(() => {
      const pages = document.querySelector('.device-pages');
      document.querySelector('[data-device-direction="right"]').click();
      const old = pages.getAnimations()[0];
      old.pause(); old.currentTime = 100;
      const before = pages.getBoundingClientRect().height;
      document.querySelector('[data-device-direction="left"]').click();
      const next = pages.getAnimations()[0];
      next.pause(); next.currentTime = 0;
      return { before, after: pages.getBoundingClientRect().height, old: old.playState };
    });
    assert.ok(Math.abs(rapid.before - rapid.after) < 1, 'rapid reversal starts at visible height');
    assert.equal(rapid.old, 'idle');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('.device-pages').getAnimations().length === 0);
    await page.getByRole('button', { name: 'Show profile', exact: true }).click();
    assert.equal(await page.locator('.device-pages').evaluate(el => el.getAnimations().length), 0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.getByRole('button', { name: 'Show research', exact: true }).click();
    await page.setViewportSize({ width: 768, height: 900 });
    await page.waitForFunction(() => !document.querySelector('.device-pages').classList.contains('is-switching'));
    assert.deepEqual(errors, []);
    console.log('PASS screen height interpolation, all directions at 1440/390/320px, rapid reversal, reduced motion and resize');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
