const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const output = path.join(__dirname, '../_site/verification');
const fixtures = [
  { title: 'CHI', year: 2027, full_name: 'Human Factors in Computing Systems', sub: ['HCI'], deadline: '2026-10-03 23:59:59', timezone: 'UTC-12', place: 'Yokohama, Japan', link: 'https://example.com/chi', abstract_deadline: '2026-10-02 23:59:59' },
  { title: 'IMWUT (Ubicomp/ISWC)', year: 2027, full_name: 'Interactive, Mobile, Wearable and Ubiquitous Technologies', sub: ['DES'], deadline: '2027-01-15 23:59:59', timezone: 'UTC+05:30', place: 'Hong Kong' },
  { title: 'UIST', year: 2026, sub: ['HCI'], deadline: '2026-04-01 23:59:59', timezone: 'UTC-12' },
  { title: 'IEEE VR', year: 2027, sub: ['XR'], deadline: 'TBA', place: 'Location to be announced' }
];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    await page.clock.install({ time: new Date('2026-10-02T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-02T00:00:01Z'));
    let fallback = false;
    let unavailable = false;
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('raw.githubusercontent.com')) return fallback ? route.abort() : route.fulfill({ body: JSON.stringify(fixtures) });
      if (url.includes('/assets/data/hci-deadlines.json')) return unavailable ? route.abort() : route.fulfill({ json: { retrieved_at: '2026-10-01', conferences: fixtures } });
      return new URL(url).hostname === '127.0.0.1' ? route.continue() : route.abort();
    });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('http://127.0.0.1:4173/deadlines/');
      await page.waitForFunction(() => document.querySelectorAll('.deadline-row').length === 3);
      const clock = page.locator('.deadline-clock').first();
      assert.equal(await clock.getAttribute('aria-label'), '2 days, 11 hours, 59 minutes, 58 seconds remaining');
      assert.equal(await clock.locator('.deadline-flap').count(), 9);
      assert.equal(await page.locator('.deadline-row p').first().evaluate(el => getComputedStyle(el).color), 'rgb(48, 58, 50)', 'conference name remains readable on light board');
      const title = page.locator('.deadline-title').first();
      await title.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.deadline-title .deadline-flap')].some(cell => /\p{Extended_Pictographic}/u.test(cell.dataset.value)));
      assert.equal(await page.getByRole('link', { name: 'CHI 2027', exact: true }).count(), 1, 'accessible title stays readable during scramble');
      await clock.scrollIntoViewIfNeeded();
      await page.clock.runFor(1100);
      assert.match(await clock.getAttribute('aria-label'), /57 seconds remaining$/);
      assert.ok(await clock.evaluate(el => el.getAnimations({ subtree: true }).length > 0), 'changed digits animate');
      await page.clock.runFor(400);
      assert.equal(await clock.evaluate(el => el.getAnimations({ subtree: true }).length), 0, 'animations finish');
      assert.equal(await title.evaluate(el => [...el.children].map(cell => cell.dataset.value).join('')), 'CHI 2027', 'random characters settle to exact title');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}`);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `deadlines-flap-${width}.png`), fullPage: true });
      for (const display of await page.locator('.deadline-title').all()) {
        await display.scrollIntoViewIfNeeded();
        await page.clock.runFor(4000);
        assert.ok(await display.evaluate(el => [...el.children].every(cell => cell.dataset.value === cell.dataset.target)), 'long titles settle completely');
        assert.ok(await display.evaluate(el => [...el.children].every(cell => cell.getBoundingClientRect().right <= el.getBoundingClientRect().right + 1)), 'title cells stay inside their column');
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `deadlines-titles-settled-${width}.png`), fullPage: true });
      await page.selectOption('#deadline-field', 'XR');
      assert.equal(await page.locator('.deadline-row').count(), 1);
      assert.equal(await page.locator('.deadline-clock').getAttribute('aria-label'), 'To be announced');
      await page.selectOption('#deadline-field', '');
      await page.selectOption('#deadline-status', 'past');
      assert.equal(await page.locator('.deadline-state').innerText(), 'CLOSED');
      await page.selectOption('#deadline-status', 'all');
      await page.fill('#deadline-search', 'Hong Kong');
      assert.equal(await page.locator('.deadline-row').count(), 1);
      assert.ok(await page.locator('.deadline-clock').getAttribute('aria-label'));
      await page.fill('#deadline-search', 'no-such-conference');
      assert.equal(await page.locator('.deadline-empty').count(), 1);
      console.log(`PASS filters, clock animation and layout at ${width}px`);
      await page.clock.setSystemTime(new Date('2026-10-02T00:00:01Z'));
    }
    fallback = true;
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4173/deadlines/');
    await page.waitForFunction(() => document.querySelector('#deadline-source').textContent.includes('Saved data'));
    await page.locator('.deadline-clock').first().scrollIntoViewIfNeeded();
    assert.ok(await page.locator('.deadline-title').first().evaluate(el => [...el.children].every(cell => cell.dataset.value === cell.dataset.target)), 'reduced motion skips title scramble');
    await page.clock.runFor(1100);
    assert.equal(await page.locator('.deadline-clock').first().evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    await page.clock.setSystemTime(new Date('2026-10-04T12:00:01Z'));
    await page.clock.runFor(1000);
    assert.equal(await page.locator('.deadline-row').count(), 2, 'expired conference leaves upcoming list');
    await page.selectOption('#deadline-status', 'all');
    assert.equal(await page.locator('.is-past').count(), 2);
    unavailable = true;
    await page.reload();
    await page.waitForFunction(() => document.querySelector('#deadline-source').textContent.includes('could not be loaded'));
    assert.deepEqual(errors, []);
    console.log('PASS snapshot fallback, reduced motion, expiration and unavailable data');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
