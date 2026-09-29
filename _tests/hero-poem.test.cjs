const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const { nextPoemIndex } = require('../assets/js/hero-poem.js');

function browser({ reduced = false, animated = false, maskSupported = true, hidden = false, inView = true, deviceHidden = false, hovered = false, focused = false, loading = false, absent = false, random = 0 } = {}) {
  const animations = [];
  const entries = [0, 1, 2].map(() => {
    const verse = {
      style: { removeProperty(key) { delete this[key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]; } },
      animate: animated ? (frames, options) => {
        let complete, fail;
        const finished = new Promise((resolve, reject) => { complete = resolve; fail = reject; });
        const animation = { frames, options, verse, finished, complete, fail,
          cancel() { this.cancelled = true; fail(new Error('Cancelled')); } };
        animations.push(animation);
        return animation;
      } : undefined
    };
    return { verse, querySelector: () => verse, setAttribute(key, value) { this[key] = value; } };
  });
  const events = {}, panelEvents = {}, deviceEvents = {}, timers = new Map();
  let timerId = 0, intersectionChanged, motionChanged, calls = 0;
  const screen = { getAttribute: () => String(deviceHidden), parentElement: { addEventListener(key, callback) { deviceEvents[key] = callback; } } };
  const panel = {
    dataset: {}, querySelectorAll: () => entries, closest: () => screen,
    matches: () => hovered, contains: node => node === panel,
    addEventListener(key, callback) { panelEvents[key] = callback; }
  };
  const motion = { matches: reduced, addEventListener(key, callback) { motionChanged = callback; } };
  const document = {
    hidden, activeElement: focused ? panel : null, readyState: loading ? 'loading' : 'complete',
    querySelectorAll: () => absent ? [] : [panel], addEventListener(key, callback) { events[key] = callback; }
  };
  const context = vm.createContext({ document, window: {
    matchMedia: () => motion, CSS: { supports: () => maskSupported },
    setInterval(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
    clearInterval: id => timers.delete(id),
    IntersectionObserver: class {
      constructor(callback) { intersectionChanged = callback; }
      observe() { intersectionChanged([{ isIntersecting: inView }]); }
    }
  }, Math: Object.assign(Object.create(Math), { random: () => { calls++; return typeof random === 'function' ? random() : random; } }) });
  const run = () => vm.runInContext(read('assets/js/hero-poem.js'), context);
  run();
  return {
    entries, panel, events, timers, animations, run, calls: () => calls,
    active: () => entries.findIndex(entry => entry['aria-hidden'] === 'false'),
    tick: () => [...timers.values()].forEach(({ callback }) => callback()),
    hover: value => panelEvents[value ? 'mouseenter' : 'mouseleave'](),
    focus: (value, relatedTarget = null) => panelEvents[value ? 'focusin' : 'focusout']({ relatedTarget }),
    visibility: value => { document.hidden = !value; events.visibilitychange(); },
    intersection: value => intersectionChanged([{ isIntersecting: value }]),
    reducedMotion: value => { motion.matches = value; motionChanged(); },
    deviceVisibility: value => { deviceHidden = !value; deviceEvents['hero-device:change'](); }
  };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const unmasked = page => {
  for (const { verse } of page.entries) for (const key of ['maskImage', 'maskPosition', 'maskSize', 'maskRepeat']) assert.ok(!verse.style[key]);
  assert.equal(page.entries.filter(entry => entry['aria-hidden'] === 'false' && !entry.inert).length, 1);
};

test('random selection covers all poems without immediate repeats', () => {
  for (const [value, expected] of [[0, 0], [.34, 1], [.9999, 2]]) assert.equal(nextPoemIndex(3, -1, value), expected);
  for (let current = 0; current < 3; current++) {
    const results = new Set();
    for (let i = 0; i < 100; i++) { const next = nextPoemIndex(3, current, i / 100); assert.notEqual(next, current); results.add(next); }
    assert.equal(results.size, 2);
  }
  assert.equal(nextPoemIndex(0, -1, 0), -1);
  assert.equal(nextPoemIndex(1, 0, 0), 0);
});
test('markup keeps original excerpts and a no-JS default without buttons or live announcements', () => {
  const html = read('_includes/hero-poem.html');
  const figures = [...html.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length, 3);
  assert.equal(figures.filter(([, attributes]) => !/\bhidden\b/.test(attributes.replace(/aria-hidden="[^"]*"/, ''))).length, 1);
  for (const title of ['空悬', '低语', '一场游戏']) assert.ok(html.includes(`aria-label="${title}"`));
  assert.doesNotMatch(html, /<button|<figcaption|From |aria-live|draft|translation/i);
  assert.match(html, /tabindex="0"/);
  for (const quote of ['We hang a little wind out on the balcony.', 'A forest of steel;', 'Neon gathers, then dissolves;']) assert.ok(html.includes(quote));
});
test('initial selection runs once and is safe before DOM ready or without the component', () => {
  const page = browser({ loading: true, random: .99 });
  assert.equal(page.calls(), 0);
  page.events.DOMContentLoaded();
  assert.equal(page.active(), 2);
  page.run(); page.events.DOMContentLoaded();
  assert.equal(page.calls(), 1);
  assert.equal(browser({ absent: true }).calls(), 0);
  assert.doesNotMatch(read('assets/js/hero-poem.js'), /setTimeout|requestAnimationFrame|fetch\(|innerHTML/);
});
test('one 15-second interval rotates only the active accessible verse', () => {
  const page = browser();
  assert.equal([...page.timers.values()][0].delay, 15000);
  for (let i = 0; i < 12; i++) {
    const previous = page.active(); page.tick(); assert.notEqual(page.active(), previous);
    assert.equal(page.panel.dataset.poemIndex, String(page.active()));
    page.entries.forEach((entry, index) => { assert.equal(entry.hidden, false); assert.equal(entry.inert, index !== page.active()); });
    assert.equal(page.timers.size, 1);
  }
});
test('hover, keyboard focus, visibility and device selection jointly suspend rotation', () => {
  const page = browser();
  page.hover(true); page.focus(true); page.hover(false);
  assert.equal(page.timers.size, 0);
  page.focus(false, page.panel); assert.equal(page.timers.size, 0);
  page.visibility(false); page.focus(false); page.intersection(false); page.visibility(true);
  assert.equal(page.timers.size, 0);
  page.intersection(true); page.intersection(true); assert.equal(page.timers.size, 1);
  page.deviceVisibility(false); assert.equal(page.timers.size, 0);
  page.deviceVisibility(true); assert.equal(page.timers.size, 1);
});
test('reduced motion stays static and reacts to preference changes without controls', () => {
  const page = browser({ reduced: true });
  const before = page.active(); page.tick();
  assert.equal(page.timers.size, 0); assert.equal(page.active(), before);
  page.reducedMotion(false); assert.equal(page.timers.size, 1);
  page.reducedMotion(true); assert.equal(page.timers.size, 0);
  for (const options of [{ hidden: true }, { inView: false }, { deviceHidden: true }, { hovered: true }, { focused: true }]) assert.equal(browser(options).timers.size, 0);
});
test('bounded pixel masks hide then reveal text and clean up after completion', async () => {
  const page = browser({ animated: true });
  const before = page.active(); page.tick();
  const hide = page.animations[0];
  assert.equal(page.active(), before);
  assert.equal((hide.verse.style.maskImage.match(/linear-gradient/g) || []).length, 64);
  assert.equal(hide.frames.length, 9);
  assert.ok(hide.frames.at(-1).maskSize.split(',').every(size => size.trim() === '0 0'));
  assert.ok(hide.options.duration <= 400);
  hide.complete(); await flush();
  assert.notEqual(page.active(), before);
  const reveal = page.animations[1];
  assert.ok(reveal.frames.at(-1).maskSize.split(',').every(size => size.trim() !== '0 0'));
  reveal.complete(); await flush(); unmasked(page);
});
test('each pixel disappearance and reveal uses a fresh random order', async () => {
  let seed = 42;
  const page = browser({ animated: true, random: () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646 });
  for (let i = 0; i < 3; i++) {
    page.tick(); page.animations.at(-1).complete(); await flush();
    page.animations.at(-1).complete(); await flush(); unmasked(page);
  }
  assert.equal(new Set(page.animations.map(({ frames }) => frames[4].maskSize)).size, 6);
});
test('a delayed prior animation cannot overwrite the next rotation', async () => {
  const page = browser({ animated: true });
  page.tick(); const stale = page.animations[0]; page.tick();
  assert.equal(stale.cancelled, true); await flush();
  page.animations.at(-1).complete(); await flush();
  page.animations.at(-1).complete(); await flush(); unmasked(page);
});
test('visibility, screen, focus, hover and motion changes cancel both animation phases', async () => {
  for (const stop of [p => p.visibility(false), p => p.intersection(false), p => p.deviceVisibility(false), p => p.focus(true), p => p.hover(true), p => p.reducedMotion(true)]) {
    for (const reveal of [false, true]) {
      const page = browser({ animated: true }); page.tick();
      if (reveal) { page.animations[0].complete(); await flush(); }
      stop(page); await flush(); unmasked(page);
      assert.equal(page.timers.size, 0); assert.equal(page.animations.at(-1).cancelled, true);
    }
  }
});
test('unsupported masks or failed animation always leave a readable verse', async () => {
  for (const settings of [{ animated: false }, { animated: true, maskSupported: false }]) {
    const page = browser(settings); page.tick(); assert.equal(page.animations.length, 0); unmasked(page);
  }
  const page = browser({ animated: true }); page.tick(); page.animations[0].fail(new Error('Failed')); await flush(); unmasked(page);
});
test('verse heights remain intrinsic, text wraps, and decorative patterns remain distinct', () => {
  const css = read('assets/css/hero-poem.css');
  assert.match(css, /grid-area: 1 \/ 1/);
  assert.match(css, /aria-hidden="true"\] \{ visibility: hidden/);
  assert.match(css, /font-size: 18px/);
  assert.match(css, /line-height: 1\.6/);
  assert.match(css, /:focus-visible/);
  assert.equal([...css.matchAll(/data-poem-index="[0-2]"/g)].length, 3);
  assert.doesNotMatch(css, /max-height:|line-clamp|white-space: nowrap|hero-poem__pause|hero-poem__next/);
});
test('translation source notes and original Chinese poems remain intact', () => {
  const doc = read('docs/poetry-translations.md');
  for (const line of ['我们取一些风晾晒在阳台', '钢铁森林 迷雾笼罩着金属的声音', '霓虹聚又散 世界化作一场狂欢']) {
    assert.ok(doc.includes(line)); assert.ok(read('assets/js/site.js').includes(line));
  }
});
