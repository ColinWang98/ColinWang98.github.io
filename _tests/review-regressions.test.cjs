const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function events() {
  const listeners = {};
  return {
    addEventListener(name, callback) { (listeners[name] ||= []).push(callback); },
    fire(name, event = {}) { for (const callback of listeners[name] || []) callback(event); }
  };
}

// Only double the DOM surface used by the real navigation/contact controllers.
function controls(kind, deniedStorage) {
  const document = { ...events(), readyState: 'complete', querySelectorAll: () => [] };
  const node = (children = []) => {
    const attributes = {};
    const classes = new Set();
    return {
      ...events(), hidden: false, children,
      contains(target) { return this === target || children.some((child) => child.contains(target)); },
      focus() { document.activeElement = this; },
      setAttribute(name, value) { attributes[name] = value; },
      getAttribute(name) { return attributes[name]; },
      classList: {
        add(name) { classes.add(name); },
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
        contains(name) { return classes.has(name); }
      }
    };
  };
  const outside = node();
  const firstLink = node();
  const summary = node();
  const experience = node([summary]);
  experience.querySelector = () => summary;
  const links = node([firstLink, experience]);
  links.querySelector = () => firstLink;
  const panel = node([links]);
  links.closest = () => panel;
  const toggle = node();
  const nav = node([toggle, links]);
  nav.querySelector = (selector) => ({ '.nav-toggle': toggle, '#primary-links': links, '.nav-experience': experience })[selector];
  const count = { textContent: 'Loading...' };
  const compact = { ...events(), matches: true };
  document.activeElement = outside;
  document.getElementById = (id) => kind === 'navigation'
    ? (id === 'site-nav' ? nav : null)
    : ({ 'visitor-count-num': count, 'author-contact-links': links })[id] || null;
  document.querySelector = (selector) => selector === '.author__menu-toggle' ? toggle : null;
  const storage = (name) => Object.fromEntries(['getItem', 'setItem'].map((method) => [method, () => {
    if (deniedStorage === `${name}.${method}`) throw new Error('Storage denied');
    return method === 'getItem' && name === 'localStorage' ? '4' : null;
  }]));
  const context = {
    document,
    window: { matchMedia: (query) => query.includes('reduced-motion') ? { matches: true } : compact },
    localStorage: storage('localStorage'), sessionStorage: storage('sessionStorage')
  };
  vm.runInNewContext(read(`assets/js/${kind === 'navigation' ? 'navigation' : 'site'}.js`), context);
  return { document, outside, firstLink, summary, experience, links, panel, toggle, nav, count, compact };
}

for (const denied of ['localStorage.getItem', 'sessionStorage.getItem', 'localStorage.setItem', 'sessionStorage.setItem']) {
  test(`contact remains usable when ${denied} throws`, () => {
    let ui;
    assert.doesNotThrow(() => { ui = controls('contact', denied); });
    assert.equal(ui.links.inert, true);
    ui.toggle.fire('click');
    assert.equal(ui.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(ui.links.inert, false);
    assert.equal(ui.panel.classList.contains('is-open'), true);
  });
}

test('visitor count and contact Escape behavior remain unchanged with usable storage', () => {
  const ui = controls('contact');
  assert.equal(ui.count.textContent, '5');
  ui.toggle.fire('click');
  ui.firstLink.focus();
  ui.document.fire('keydown', { key: 'Escape' });
  assert.equal(ui.document.activeElement, ui.toggle);
  assert.equal(ui.links.inert, true);
});

test('Tab leaving mobile navigation closes it without stealing destination focus', () => {
  const ui = controls('navigation');
  ui.toggle.fire('click');
  ui.experience.open = true;
  ui.firstLink.focus();
  ui.nav.fire('focusout', { relatedTarget: ui.summary });
  assert.equal(ui.links.hidden, false);
  assert.equal(ui.experience.open, true);
  // The outgoing link may still be active while focusout is dispatched.
  ui.nav.fire('focusout', { relatedTarget: ui.outside });
  assert.equal(ui.links.hidden, true);
  assert.equal(ui.toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(ui.experience.open, false);
  assert.notEqual(ui.document.activeElement, ui.toggle);
});

test('navigation keeps Escape and outside-click dismissal', () => {
  const ui = controls('navigation');
  ui.toggle.fire('click');
  ui.experience.open = true;
  ui.document.fire('keydown', { key: 'Escape' });
  assert.equal(ui.document.activeElement, ui.summary);
  assert.equal(ui.links.hidden, false);
  ui.document.fire('keydown', { key: 'Escape' });
  assert.equal(ui.document.activeElement, ui.toggle);
  assert.equal(ui.links.hidden, true);
  ui.toggle.fire('click');
  ui.document.fire('click', { target: ui.outside });
  assert.equal(ui.links.hidden, true);
});

for (const kind of ['navigation', 'contact']) {
  test(`${kind} moves focus off the toggle when entering desktop mode`, () => {
    const ui = controls(kind);
    ui.toggle.focus();
    ui.compact.matches = false;
    ui.compact.fire('change');
    assert.equal(ui.document.activeElement, ui.firstLink);
    ui.compact.matches = true;
    ui.compact.fire('change');
    assert.equal(ui.document.activeElement, ui.toggle);
    ui.outside.focus();
    ui.compact.matches = false;
    ui.compact.fire('change');
    assert.equal(ui.document.activeElement, ui.outside);
  });
}

const activityIds = [
  'president-taihang-local-culture-research-society',
  // Kramdown GFM removes '&' but preserves both surrounding spaces as hyphens.
  'surveyor-ancient-buildings-mapping--protection-in-yuanqu-village-handan',
  'surveyor-mapping-and-research-project-related-to-baoding-industrial-heritage'
];

test('raw activity headings retain their original Jekyll fragment IDs', () => {
  assert.deepEqual([...read('activities.md').matchAll(/<h3 id="([^"]+)"/g)].map((match) => match[1]), activityIds);
});

function preview() {
  const fixture = '---\ntitle: Review fixture\n---\n\n# Markdown *heading*\n\n<h2>Raw heading</h2>\n\n<section>\n<h3>Nested raw heading</h3>\n<h3 id="kept">Explicit heading</h3>\n</section>\n';
  const context = vm.createContext({
    __dirname: path.join(root, '_tools'),
    console,
    require(name) {
      if (name === 'node:http') return { createServer: () => ({ listen() {} }) };
      if (name === 'node:fs') return {
        ...fs,
        readFileSync(file, encoding) { return path.basename(file) === 'review-fixture.md' ? fixture : fs.readFileSync(file, encoding); }
      };
      return require(name);
    }
  });
  vm.runInContext(read('_tools/preview.cjs'), context);
  return (file) => vm.runInContext(`pageHtml(${JSON.stringify(file)})`, context);
}

test('preview assigns IDs only to Markdown headings, not raw HTML', () => {
  const html = preview()('review-fixture.md');
  assert.ok(html.includes('<h1 id="markdown-heading">Markdown <em>heading</em></h1>'));
  assert.ok(html.includes('<h2>Raw heading</h2>'));
  assert.ok(html.includes('<h3>Nested raw heading</h3>'));
  assert.ok(html.includes('<h3 id="kept">Explicit heading</h3>'));
});

test('preview preserves real Markdown and explicit activity IDs', () => {
  const html = preview()('activities.md');
  assert.ok(html.includes('<h1 id="activities">Activities</h1>'));
  for (const id of activityIds) assert.ok(html.includes(`<h3 id="${id}">`));
});
