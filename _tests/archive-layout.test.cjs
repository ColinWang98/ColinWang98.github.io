const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('home puts research evidence before the project explorer and retains all deep links', () => {
  const home = read('index.md');
  assert.ok(home.indexOf('id="recent-publications"') < home.indexOf('class="project-explorer"'));
  assert.match(home, /include hero-poem.html/);
  assert.match(home, /class="hero-display"/);
  assert.match(home, /class="hero-wheel"/);
  assert.doesNotMatch(home, /data-phd-status/);
  assert.doesNotMatch(home, /neonhk|NeonHK/);
  for (const id of ['breathing', 'intercultural', 'moderator', 'metachamber', 'farm']) {
    assert.equal((home.match(new RegExp(`id="project-${id}"`, 'g')) || []).length, 1);
  }
});

test('navigation exposes a real mobile menu and grouped experience links', () => {
  const nav = read('_includes/masthead.html');
  assert.match(nav, /aria-controls="primary-links"/);
  assert.match(nav, /<details class="nav-experience"/);
  for (const route of ['education', 'work', 'activities', 'awards', 'publications', 'others', 'deadlines']) {
    assert.match(nav, new RegExp(`/${route}/`));
  }
});

test('profile retains accessible contact links without ornamental hardware', () => {
  const profile = read('_includes/sidebar.html');
  assert.match(profile, /profile-display/);
  assert.match(profile, /aria-label="Email Wang Yao"/);
  assert.doesNotMatch(profile, /device-fasteners|click-me-hint|mac-drive/);
});

test('publication chronology starts with the published CHI paper', () => {
  const publications = read('publications.md');
  assert.ok(publications.indexOf('CHI') < publications.indexOf('ICWL'));
  assert.match(publications, /id="edu-metaverse-cite"/);
});
