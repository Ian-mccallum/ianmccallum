import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseURL = 'http://127.0.0.1:4321';
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const launchOptions = existsSync(chrome) ? { headless: true, executablePath: chrome } : { headless: true };
const routes = ['/', '/about', '/portfolio', '/portfolio/clockwork', '/cv', '/photos', '/testimonials', '/contact', '/thank-you', '/blog', '/blog/2007-thought-the-future-would-be-beautiful'];
const widths = [360, 390, 768, 1024, 1440];
const reviewDir = '.impeccable/review';
mkdirSync(reviewDir, { recursive: true });

const browser = await chromium.launch(launchOptions);
const failures = [];
const findings = { routes: [], axe: [], interactions: [], consoleErrors: [], screenshots: [] };

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: width < 760 ? 844 : 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') findings.consoleErrors.push(`${width}: ${message.text()}`); });
  page.on('pageerror', (error) => findings.consoleErrors.push(`${width}: ${error.message}`));
  page.on('requestfailed', (request) => findings.consoleErrors.push(`${width}: request failed ${request.url()} ${request.failure()?.errorText}`));
  await page.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));

  for (const route of routes) {
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) failures.push(`${route} @ ${width}: HTTP ${response?.status()}`);
    const counts = await page.evaluate(() => ({
      main: document.querySelectorAll('main').length,
      h1: document.querySelectorAll('h1').length,
      windows: document.querySelectorAll('[data-window-frame]').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      frameMaximized: document.querySelector('[data-window-frame]')?.classList.contains('is-maximized'),
    }));
    if (counts.main !== 1 || counts.h1 !== 1 || counts.windows !== 1 || counts.overflow || !counts.frameMaximized) failures.push(`${route} @ ${width}: ${JSON.stringify(counts)}`);
    findings.routes.push({ route, width, ...counts });
    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '--');
    const screenshot = `${reviewDir}/${name}-${width}.png`;
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    findings.screenshots.push(screenshot);
  }
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
const page = await context.newPage();
await page.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));
await page.goto(`${baseURL}/about`, { waitUntil: 'networkidle' });
await page.click('[data-window-maximize]');
if (!(await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-restored')))) failures.push('maximize control did not restore');
await page.click('[data-window-maximize]');
await page.click('[data-window-minimize]');
if (!(await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-minimized')))) failures.push('minimize control did not hide window');
await page.click('[data-taskbar-restore]');
if (await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-minimized'))) failures.push('taskbar did not restore window');
await page.click('[data-start-button]');
if (await page.locator('#start-menu').getAttribute('hidden') !== null) failures.push('Start menu did not open');
await page.keyboard.press('Escape');
if (await page.locator('#start-menu').getAttribute('hidden') === null) failures.push('Escape did not dismiss Start menu');
await page.locator('.desktop-icon[href="/portfolio"]').click();
await page.waitForURL('**/portfolio');
await page.goBack();
await page.waitForURL('**/about');
await page.click('[data-window-frame] .window-control--close');
await page.waitForURL(`${baseURL}/`);
findings.interactions.push('window restore/minimize/restore, Start/Escape, real-link navigation, Back, close-to-home');

for (const route of routes) {
  await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  const material = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''));
  findings.axe.push({ route, violations: material.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })) });
  if (material.length) failures.push(`${route}: axe ${JSON.stringify(findings.axe.at(-1).violations)}`);
}

let contactAttempts = 0;
await page.route('**/api/contact', (route) => {
  contactAttempts += 1;
  return route.fulfill({
    status: contactAttempts === 1 ? 500 : 200,
    contentType: 'application/json',
    body: JSON.stringify(contactAttempts === 1 ? { ok: false, error: 'Mocked failure' } : { ok: true }),
  });
});
await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' });
await page.fill('#contact-name', 'Automated QA');
await page.fill('#contact-email', 'qa@example.com');
await page.fill('#contact-message', 'This request is intercepted and never leaves the browser.');
await page.click('button[type="submit"]');
await page.getByText('That did not send. Use the protected email option below and I’ll still get it.').waitFor();
if (!(await page.locator('[data-email-shield]').isVisible())) failures.push('contact failure did not retain protected-email recovery');
await page.click('button[type="submit"]');
await page.getByText('Got it. I’ll get back to you.').waitFor();
findings.interactions.push('mocked contact failure/recovery and retry success');

await page.goto(`${baseURL}/photos`, { waitUntil: 'networkidle' });
const firstPhoto = page.locator('[data-gallery-item]').first();
await firstPhoto.focus();
await firstPhoto.click();
if (await page.locator('[data-lightbox]').getAttribute('hidden') !== null) failures.push('photo lightbox did not open');
if (!(await page.locator('[data-lightbox-close]').evaluate((element) => element === document.activeElement))) failures.push('photo lightbox did not move focus to close control');
await page.keyboard.press('Escape');
if (await page.locator('[data-lightbox]').getAttribute('hidden') === null) failures.push('Escape did not dismiss photo lightbox');
if (!(await firstPhoto.evaluate((element) => element === document.activeElement))) failures.push('photo lightbox did not restore trigger focus');
findings.interactions.push('photo lightbox open/Escape/focus restoration');

const missingResponse = await page.goto(`${baseURL}/definitely-missing-route`, { waitUntil: 'networkidle' });
if (missingResponse?.status() !== 404) failures.push(`unknown route returned ${missingResponse?.status()} instead of 404`);
await page.getByRole('heading', { name: 'That window could not be opened.' }).waitFor();
findings.interactions.push('unknown URL returns Aero 404');

await page.goto(`${baseURL}/cv`, { waitUntil: 'networkidle' });
await page.pdf({ path: `${reviewDir}/cv-print.pdf`, format: 'Letter', printBackground: false });
await context.close();

const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reduced.newPage();
await reducedPage.goto(baseURL, { waitUntil: 'networkidle' });
if (await reducedPage.locator('[data-boot-overlay]').count()) failures.push('reduced-motion root retained boot overlay');
await reducedPage.screenshot({ path: `${reviewDir}/home-reduced-motion-390.png`, fullPage: true, animations: 'disabled' });
await reduced.close();
await browser.close();

writeFileSync(`${reviewDir}/browser-qa.json`, JSON.stringify({ failures, findings }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Browser QA passed: ${routes.length} routes × ${widths.length} widths, ${findings.axe.length} axe scans, ${findings.consoleErrors.length} console/network errors.`);
