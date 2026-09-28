const test = require('node:test');
const assert = require('node:assert/strict');

test('local preview preserves the configured email despite preceding empty YAML fields', async () => {
  const html = await (await fetch('http://127.0.0.1:4173/')).text();
  assert.ok(html.includes('mailto:23064693g@connect.polyu.hk'), 'preview has a populated mailto from site.author.email');
  assert.ok(!html.includes('mailto:"'), 'preview does not produce empty email links');
});
