const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

test('restored iPod theme shares soft surfaces and motion tokens', () => {
  const css = read('assets/css/ceramic.css');
  for (const token of ['--housing-face:', '--screen-face:', '--key-rest:', '--key-pressed:', '--motion-release:']) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /--cream: #e0e0e0;/);
  assert.match(css, /--shadow-dark: #bebebe;/);
  assert.match(css, /--shadow-light: #fff;/);
  assert.doesNotMatch(css, /#efede5|#f8f6ef|#e8e6dd/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('personal information retains the profile and contact links', () => {
  const sidebar = read('_includes/sidebar.html');
  assert.match(sidebar, /profile-display/);
  assert.match(sidebar, /site.author.name/);
  assert.match(sidebar, /Wang Yao CV.pdf/);
  assert.match(sidebar, /id="author-contact-links"/);
});

test('avatar uses a soft white accent without changing the grey housing', () => {
  const css = read('assets/css/ceramic.css');
  assert.match(css, /\.ceramic-theme \.author__avatar \{[^}]*background: #f8f8f8;/);
  assert.match(css, /\.ceramic-theme \.author__avatar::after \{[^}]*border: 2px solid #f8f8f8;/);
  assert.match(css, /\.ceramic-theme \.sidebar \{[^}]*background: var\(--housing-face\);/);
});

test('the identity screen shares pixel typography and a classic green LCD', () => {
  const css = read('assets/css/ceramic.css');
  const screen = css.match(/\.hero-display \{([^}]+)\}/)[1];
  assert.match(screen, /--font-eink: "Pixelify Sans"/);
  assert.match(screen, /--font-sans: "Manrope"/);
  assert.match(screen, /--font-serif: var\(--font-sans\)/);
  assert.match(screen, /--text-strong: #263323/);
  assert.match(screen, /#b9cba5/);
  assert.match(screen, /radial-gradient/);
  assert.match(css, /\.hero-display-bar[^}]*var\(--font-eink\)/);
  assert.match(css, /\.research-motto em\s*\{\s*font-style: normal/);
});

test('project instrument housing shares the same neutral material', () => {
  const css = read('assets/css/project-instruments.css');
  assert.match(css, /var\(--housing-face[,)]/);
  assert.match(css, /var\(--surface-soft\)/);
});

test('project index adds restrained metal and signal details scoped to its housing', () => {
  const css = read('assets/css/project-instruments.css');
  assert.match(css, /\.project-instruments \{[^}]*--instrument-signal:/);
  assert.match(css, /\.project-frame-header \{[^}]*repeating-linear-gradient/);
  assert.match(css, /\.project-selector-knob \{[^}]*repeating-conic-gradient/);
  assert.match(css, /\.project-selector-pointer::before \{[^}]*var\(--instrument-signal\)/);
  assert.match(css, /\.project-frame-index a\[aria-current\] \{[^}]*var\(--instrument-ink\)/);
  assert.doesNotMatch(css, /url\(|backdrop-filter/);
});

test('soft keys interpolate matching raised and inset layers through every state', () => {
  const css = read('assets/css/ceramic.css');
  for (const token of ['key-rest', 'key-hover', 'key-pressed']) {
    const value = css.match(new RegExp(`--${token}: ([^;]+);`))[1];
    const layers = value.split(',');
    assert.equal(layers.length, 4, `${token} needs matching shadow layers`);
    assert.ok(layers.slice(0, 2).every((layer) => !layer.includes('inset')));
    assert.ok(layers.slice(2).every((layer) => layer.includes('inset')));
  }
  assert.match(css, /\[aria-expanded="true"\][^{]*\{[^}]*var\(--key-pressed\)/);
  assert.match(css, /\.author__avatar\[aria-pressed="true"\]::after/);
  assert.match(css, /\.wheel-center:active\s*\{[^}]*var\(--key-pressed\)/);
});
