const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('inactive device pages no longer inflate the profile screen', () => {
  assert.match(read('assets/css/hero-device.css'), /\.device-page\[aria-hidden="true"\] \{[^}]*display: none/);
  assert.match(read('assets/css/ceramic.css'), /\.hero-display \{[^}]*min-height: 0/);
});

test('poetry has no visible controls or obsolete button handlers', () => {
  const html = read('_includes/hero-poem.html');
  assert.doesNotMatch(html, /<button|data-poem-next|data-poem-pause|data-poem-announcement/);
  assert.match(html, /tabindex="0"/);
  assert.doesNotMatch(read('assets/js/hero-poem.js'), /pauseButton|button.addEventListener|announcement/);
});

test('screen body type has one scale while the name retains pixel lettering', () => {
  const css = read('assets/css/ceramic.css');
  assert.match(css, /\.ceramic-theme :is\(\.position-title, \.research-motto\) \{[^}]*font-size: 16px;[^}]*line-height: 1\.6/);
  assert.match(css, /\.ceramic-theme \.name-title \{[^}]*font-family: var\(--font-eink\)/);
  assert.match(read('assets/css/hero-poem.css'), /\.hero-poem \.hero-poem__text \{[^}]*font-size: 16px;[^}]*line-height: 1\.6/);
});
