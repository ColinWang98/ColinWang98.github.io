const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/hero-device.js'), 'utf8');

function controller({ rejectPlay = false } = {}) {
  const element = (dataset = {}) => ({
    dataset, events: {}, attributes: {}, hidden: false, textContent: '',
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; },
    addEventListener(key, callback) { this.events[key] = callback; },
    dispatchEvent(event) { this.events[event.type]?.(event); },
    focus() {}, scrollIntoView() {}, classList: { add() {} }
  });
  const entries = ['profile', 'research', 'projects', 'contact', 'video'].map(devicePage => element({ devicePage }));
  const directions = ['up', 'right', 'down', 'left'].map(deviceDirection => element({ deviceDirection }));
  const selectors = Object.fromEntries(['.device-pages', '[data-device-start]', '[data-device-caption]', '[data-device-help]', '[data-device-announcement]', '[data-device-video]', '[data-video-status]', '[data-video-exit]', '.device-controls', '.hero-device-grid'].map(key => [key, element()]));
  selectors['.device-pages'].querySelectorAll = () => entries;
  const video = selectors['[data-device-video]'];
  Object.assign(video, {
    dataset: { src: '/assets/videos/jizura.mp4' }, paused: true, ended: false, currentTime: 0, plays: 0,
    pause() { this.paused = true; this.events.pause?.(); },
    play() {
      this.plays += 1;
      if (rejectPlay) return Promise.reject(new Error('Playback blocked'));
      this.paused = false; this.events.play?.(); return Promise.resolve();
    }
  });
  const device = element();
  device.querySelector = key => selectors[key];
  device.querySelectorAll = () => directions;
  const document = { hidden: false, events: {}, querySelector: () => device, addEventListener(key, callback) { this.events[key] = callback; } };
  let intersection;
  const window = { matchMedia: () => ({ matches: false }), IntersectionObserver: class {
    constructor(callback) { intersection = callback; } observe() {}
  } };
  vm.runInNewContext(source, { document, window, Event });
  return { device, video, document, entries, start: selectors['[data-device-start]'], status: selectors['[data-video-status]'],
    click: () => selectors['[data-device-start]'].events.click(),
    direction: value => directions.find(button => button.dataset.deviceDirection === value).events.click(),
    exit: () => selectors['[data-video-exit]'].events.click(),
    intersect: visible => intersection([{ isIntersecting: visible }]) };
}

test('video is not requested on initial load and START plays it on demand', async () => {
  const page = controller();
  assert.equal(page.video.src, undefined);
  assert.equal(page.video.plays, 0);
  await page.click();
  assert.equal(page.video.src, '/assets/videos/jizura.mp4');
  assert.equal(page.video.plays, 1);
  assert.equal(page.start.textContent, 'PAUSE');
  assert.equal(page.entries[4].inert, false);
  assert.equal(page.entries[0].inert, true);
});
test('center pauses and resumes, and ended playback offers replay', async () => {
  const page = controller();
  await page.click(); await page.click();
  assert.equal(page.video.paused, true);
  assert.equal(page.start.textContent, 'PLAY');
  await page.click();
  assert.equal(page.video.paused, false);
  page.video.ended = true; page.video.paused = true; page.video.events.ended();
  assert.equal(page.start.textContent, 'REPLAY');
});
test('directions and exit stop playback and keep screen selection accessible', async () => {
  const page = controller();
  await page.click(); page.direction('right');
  assert.equal(page.video.paused, true);
  assert.equal(page.entries[1].inert, false);
  assert.equal(page.start.textContent, 'START');
  await page.click(); page.exit();
  assert.equal(page.video.paused, true);
  assert.equal(page.entries[0].inert, false);
});
test('hidden document and out-of-view device pause without automatic resume', async () => {
  const page = controller();
  await page.click(); page.intersect(false); page.intersect(true);
  assert.equal(page.video.paused, true);
  await page.click(); page.document.hidden = true; page.document.events.visibilitychange();
  assert.equal(page.video.paused, true);
});
test('blocked playback is handled with a readable retry message', async () => {
  const page = controller({ rejectPlay: true });
  await page.click();
  assert.match(page.status.textContent, /Play/);
  assert.equal(page.start.textContent, 'PLAY');
});
