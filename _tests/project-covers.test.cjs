const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.md'), 'utf8');

test('six covers preserve real source images and distinguish concept artwork', () => {
  assert.equal((home.match(/class="project-cover /g) || []).length, 6);
  assert.equal((home.match(/AI-generated concept illustration/g) || []).length, 4);
  for (const name of ['breathing', 'intercultural', 'moderator', 'farm']) {
    assert.ok(fs.existsSync(path.join(root, `assets/images/project-covers/${name}.webp`)));
  }
  assert.match(home, /assets\/spatial-hong-kong-2026-10\.png/);
  assert.ok(fs.existsSync(path.join(root, 'assets/spatial-hong-kong-2026-10.png')));
  assert.match(home, /images\/RedMeta.png/);
});

test('original demos remain available in accessible disclosures', () => {
  assert.equal((home.match(/<details class="project-demo">/g) || []).length, 3);
  assert.match(home, /1LDRFxU0sGxzm0ri0hFEfME6U3Egr_d7t/);
  assert.match(home, /1xEbWGYLEB5gONDsF0zcCc2zGLkpVm9xT/);
  assert.match(home, /FQzUH1De4VzhFHOtUhwqvi/);
});
