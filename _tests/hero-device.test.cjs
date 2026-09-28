const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('wheel uses four directional buttons and a video start, not overflowing text links', () => {
  const home = read('index.md');
  assert.equal((home.match(/data-device-direction=/g) || []).length, 4);
  assert.match(home, /<button[^>]*class="wheel-center"[^>]*data-device-start/);
  assert.doesNotMatch(home, /<a class="wheel-link/);
  for (const panel of ['profile', 'research', 'projects', 'contact', 'video']) {
    assert.match(home, new RegExp(`data-device-page="${panel}"`));
  }
  assert.match(home, /data-video-exit/);
  assert.match(home, /<video[^>]*controls[^>]*playsinline[^>]*preload="none"/);
  assert.match(home, /data-src="[^\n]*jizura.mp4/);
  assert.doesNotMatch(home, /data-game|word snake|autoplay/i);
  assert.match(home, /id="phd-interests"/);
});

test('device script loads only on home without the retired snake engine', () => {
  const scripts = read('_includes/scripts.html');
  for (const file of ['hero-device']) {
    assert.match(scripts, new RegExp(`if page.classes == 'homepage'[^\\n]+assets/js/${file}\\.js`));
  }
  assert.doesNotMatch(scripts, /word-snake/);
});

test('video controls stay scoped and playback pauses when obscured', () => {
  const js = read('assets/js/hero-device.js');
  assert.match(js, /device.addEventListener\("keydown"/);
  assert.doesNotMatch(js, /(?:document|window).addEventListener\("keydown"/);
  assert.doesNotMatch(js, /setInterval|WordSnake/);
  assert.match(js, /video.pause\(\)/);
  assert.match(js, /visibilitychange/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /Escape/);
  assert.match(js, /entry.inert/);
});
