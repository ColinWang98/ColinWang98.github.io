const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

test('the shared home link uses the Colin vector wordmark', () => {
  const header = read('_includes/masthead.html');
  assert.doesNotMatch(header, />WY</);
  assert.match(header, /aria-label="Wang Yao home"/);
  assert.match(header, /class="site-wordmark"[^>]*width="110"[^>]*height="40"/);
  assert.match(header, /aria-hidden="true"/);
  assert.match(read('assets/images/colin-wordmark.svg'), /<title[^>]*>Colin<\/title>/);
});

test('mobile hides only the tagline, not the wordmark', () => {
  const css = read('assets/css/ceramic.css');
  assert.match(css, /\.site-signature__tagline\s*\{\s*display:\s*none/);
  assert.match(css, /\.site-wordmark\s*\{[^}]*flex-shrink:\s*0/);
  assert.match(css, /\.site-signature\s*\{[^}]*min-height:\s*44px/);
});
