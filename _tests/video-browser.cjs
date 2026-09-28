const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const mediaRequests = [];
    const errors = [];
    page.on('request', request => { if (request.url().includes('/videos/')) mediaRequests.push(request.url()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
    assert.equal(mediaRequests.length, 0, 'no video bytes on initial load');
    const video = page.locator('[data-device-video]');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const profile = await page.evaluate(() => ({
        height: document.querySelector('.hero-display').getBoundingClientRect().height,
        fonts: [...document.querySelectorAll('.position-title, .research-motto, .hero-poem__text')].map(el => getComputedStyle(el).fontSize),
        buttons: document.querySelectorAll('.hero-poem button').length,
        hiddenVideo: getComputedStyle(document.querySelector('[data-device-page="video"]')).display
      }));
      assert.ok(profile.height <= (width === 1440 ? 360 : 500), `compact profile at ${width}px: ${profile.height}`);
      assert.ok(profile.fonts.every(size => size === '16px'));
      assert.equal(profile.buttons, 0);
      assert.equal(profile.hiddenVideo, 'none');
      await page.getByRole('button', { name: 'Play Jizura video', exact: true }).click();
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return !video.paused && video.currentTime > 0 && video.videoWidth > 0;
      }, null, { timeout: 20000 });
      const bounds = await video.boundingBox();
      assert.ok(bounds.width > 150 && bounds.x >= 0 && bounds.x + bounds.width <= width);
      await page.getByRole('button', { name: 'pause Jizura video', exact: true }).click();
      assert.equal(await video.evaluate(el => el.paused), true);
      if (width === 1440) {
        await video.evaluate(el => { el.currentTime = 60; });
        await page.waitForFunction(() => {
          const video = document.querySelector('video');
          return !video.seeking && video.currentTime >= 60 && video.readyState >= 2;
        });
      }
      await page.getByRole('button', { name: 'play Jizura video', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('video').paused);
      await page.getByRole('button', { name: 'Back to profile' }).click();
      assert.equal(await video.evaluate(el => el.paused), true);
      assert.equal(await page.locator('[data-device-page="profile"]').getAttribute('aria-hidden'), 'false');
    }
    const response = await page.request.get('http://127.0.0.1:4173/assets/videos/jizura.mp4', { headers: { Range: 'bytes=0-15' } });
    assert.equal(response.status(), 206);
    assert.match(response.headers()['content-type'], /video\/mp4/);
    assert.equal((await response.body()).length, 16);
    assert.deepEqual(errors, []);
    console.log('PASS on-demand video, decoding, seeking, play/pause/exit at 1440/390/320px, range requests, no script errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
