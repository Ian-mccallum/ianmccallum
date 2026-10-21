import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium, devices } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const launchOptions = existsSync(chrome) ? { headless: true, executablePath: chrome } : { headless: true };
const routes = ['/', '/about', '/portfolio', '/portfolio/clockwork', '/cv', '/cv?mode=corporate', '/photos', '/testimonials', '/contact', '/thank-you', '/blog', '/blog/2007-thought-the-future-would-be-beautiful'];
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
    const expectedWindowState = route === '/' ? !counts.frameMaximized : counts.frameMaximized;
    if (counts.main !== 1 || counts.h1 !== 1 || counts.windows !== 1 || counts.overflow || !expectedWindowState) failures.push(`${route} @ ${width}: ${JSON.stringify(counts)}`);
    findings.routes.push({ route, width, ...counts });
    if (width <= 760 && route === '/') {
      const backgroundVideoRequested = await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => entry.name.endsWith('/media/aero-bg.mp4')));
      if (backgroundVideoRequested) failures.push(`${route} @ ${width}: mobile requested hidden background video`);
    }
    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '--').replace(/[?=]/g, '-');
    const screenshot = `${reviewDir}/${name}-${width}.png`;
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    findings.screenshots.push(screenshot);
  }
  await context.close();
}

const bootContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const bootPage = await bootContext.newPage();
await bootPage.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
const bootOverlay = bootPage.locator('[data-boot-overlay]');
await bootOverlay.waitFor({ state: 'visible' });
await bootPage.waitForTimeout(1200);
if (!(await bootOverlay.isVisible())) failures.push('welcome sequence ended before its longer authored timing');
const bootPercent = Number.parseInt((await bootPage.locator('[data-boot-percent]').textContent()) || '0', 10);
if (bootPercent < 10 || bootPercent >= 100) failures.push(`welcome progress was not active after 1.2s (${bootPercent}%)`);
await bootPage.screenshot({ path: `${reviewDir}/welcome-sequence-1440.png` });
await bootPage.locator('[data-skip-boot]').click();
await bootOverlay.waitFor({ state: 'detached' });
if (await bootPage.evaluate(() => sessionStorage.getItem('aero-boot-seen')) !== '1') failures.push('welcome sequence did not remember dismissal');
await bootPage.reload({ waitUntil: 'networkidle' });
if (await bootPage.locator('[data-boot-overlay]').count()) failures.push('welcome sequence repeated within the same session');
findings.interactions.push('longer welcome sequence progress, visual capture, skip, and session memory');
await bootContext.close();

const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
const page = await context.newPage();
await page.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));
await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
const welcomeFrame = page.locator('[data-window-route="/"]');
if (!(await welcomeFrame.evaluate((element) => element.classList.contains('is-restored')))) failures.push('home did not open as the restored Welcome window');
await page.locator('.desktop-icon[href="/about"]').click();
await page.locator('[data-window-route="/about"]').waitFor();
await page.locator('.desktop-icon[href="/portfolio"]').click();
await page.locator('[data-window-route="/portfolio"]').waitFor();
if ((await page.locator('[data-window-frame]').count()) !== 3) failures.push('desktop did not keep multiple windows open');
if (new URL(page.url()).pathname !== '/') failures.push('opening a desktop window replaced the canonical home URL');

const portfolioFrame = page.locator('[data-window-route="/portfolio"]');
const beforeDrag = await portfolioFrame.boundingBox();
const titlebar = portfolioFrame.locator('.window-titlebar');
const titleBox = await titlebar.boundingBox();
if (beforeDrag && titleBox) {
  await page.mouse.move(titleBox.x + 110, titleBox.y + 18);
  await page.mouse.down();
  await page.mouse.move(titleBox.x + 165, titleBox.y + 70, { steps: 4 });
  await page.mouse.up();
  const afterDrag = await portfolioFrame.boundingBox();
  if (!afterDrag || (Math.abs(afterDrag.x - beforeDrag.x) < 20 && Math.abs(afterDrag.y - beforeDrag.y) < 20)) failures.push('restored window did not move when dragged');
}
await page.screenshot({ path: `${reviewDir}/multi-window-1024.png`, animations: 'disabled' });
await portfolioFrame.locator('[data-window-minimize]').click();
if (!(await portfolioFrame.evaluate((element) => element.classList.contains('is-minimized')))) failures.push('dynamic window did not minimize');
await page.locator('[data-taskbar-route="/portfolio"]').click();
if (await portfolioFrame.evaluate((element) => element.classList.contains('is-minimized'))) failures.push('taskbar did not restore dynamic window');
await portfolioFrame.locator('[data-window-maximize]').click();
if (!(await portfolioFrame.evaluate((element) => element.classList.contains('is-maximized')))) failures.push('dynamic window did not maximize');
await portfolioFrame.locator('.window-control--close').click();
if (await page.locator('[data-window-route="/portfolio"]').count()) failures.push('dynamic window did not close');

await page.locator('[data-taskbar-route="/contact"]').click();
const dynamicContact = page.locator('[data-window-route="/contact"]');
await dynamicContact.waitFor();
if (await dynamicContact.locator('[data-contact-form]').count()) failures.push('dynamic contact window retained the removed form');
await dynamicContact.locator('[data-email-reveal]').click();
if (await dynamicContact.locator('[data-email-challenge]').getAttribute('hidden') !== null) failures.push('dynamic protected-email challenge did not open');
await dynamicContact.locator('.window-control--close').click();

await page.locator('.desktop-icon[href="/photos"]').click();
const dynamicPhotos = page.locator('[data-window-route="/photos"]');
await dynamicPhotos.waitFor();
if (await dynamicPhotos.locator('[data-gallery]').getAttribute('data-gallery-enhanced') !== 'true') failures.push('dynamic photo gallery was not enhanced');
await dynamicPhotos.locator('[data-gallery-item]').first().click();
if (await dynamicPhotos.locator('[data-lightbox]').getAttribute('hidden') !== null) failures.push('dynamic photo lightbox did not open');
await page.keyboard.press('Escape');
await dynamicPhotos.locator('.window-control--close').click();

await page.click('[data-start-button]');
if (await page.locator('#start-menu').getAttribute('hidden') !== null) failures.push('Start menu did not open');
if ((await page.locator('#start-menu .start-menu__places a').count()) < 5) failures.push('Start menu did not restore Connect links');
await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
await page.screenshot({ path: `${reviewDir}/start-menu-1024.png`, animations: 'disabled' });
await page.keyboard.press('Escape');
if (await page.locator('#start-menu').getAttribute('hidden') === null) failures.push('Escape did not dismiss Start menu');

await page.goto(`${baseURL}/about`, { waitUntil: 'networkidle' });
await page.click('[data-window-maximize]');
if (!(await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-restored')))) failures.push('maximize control did not restore a direct-route window');
await page.click('[data-window-maximize]');
await page.click('[data-window-minimize]');
if (!(await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-minimized')))) failures.push('primary window did not minimize');
await page.locator('[data-taskbar-route="/about"]').click();
if (await page.locator('[data-window-frame]').evaluate((element) => element.classList.contains('is-minimized'))) failures.push('taskbar did not restore primary window');
await page.click('[data-window-frame] .window-control--close');
await page.waitForURL(`${baseURL}/`);
findings.interactions.push('multi-window open/focus/drag/minimize/restore/maximize/close, dynamic email/gallery hydration, Start/Escape, direct-route controls, close-to-home');

for (const route of routes) {
  await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  const material = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''));
  findings.axe.push({ route, violations: material.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })) });
  if (material.length) failures.push(`${route}: axe ${JSON.stringify(findings.axe.at(-1).violations)}`);
}

await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' });
if (await page.locator('form, [data-contact-form]').count()) failures.push('contact route retained a form');
await page.locator('[data-email-reveal]').click();
const emailQuestion = (await page.locator('[data-email-question]').textContent()) || '';
const operands = emailQuestion.match(/(\d+)\s*\+\s*(\d+)/);
if (!operands) failures.push(`protected email challenge was not readable: ${emailQuestion}`);
else {
  await page.locator('#email-answer').fill(String(Number(operands[1]) + Number(operands[2])));
  await page.locator('[data-email-verify]').click();
  const emailHref = await page.locator('[data-email-link]').getAttribute('href');
  if (!emailHref?.startsWith('mailto:')) failures.push('protected email did not reveal a mail link after verification');
}
findings.interactions.push('protected email reveal and verification without a contact form');

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
await page.locator('[data-cv-mode-switch]').click();
await page.waitForFunction(() => document.querySelector('[data-cv-viewer]')?.dataset.cvMode === 'corporate');
if (new URL(page.url()).search !== '?mode=corporate') failures.push('corporate mode did not update the shareable CV URL');
const corporatePdf = await page.pdf({ path: `${reviewDir}/cv-print-corporate.pdf`, format: 'Letter', printBackground: false });
const corporatePages = (corporatePdf.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
if (corporatePages !== 1) failures.push(`corporate CV printed ${corporatePages} pages instead of one Letter page`);
await page.goto(`${baseURL}/cv`, { waitUntil: 'networkidle' });
if (await page.locator('[data-cv-mode-switch]').getAttribute('aria-checked') !== 'true') failures.push('corporate mode choice did not persist');
findings.interactions.push('CV corporate mode switch, shareable URL, saved choice, and one-page Letter print');

const demoState = () => page.evaluate(() => {
  const video = document.querySelector('[data-project-video] video');
  return { paused: video.paused, controls: video.controls, label: document.querySelector('[data-video-toggle]').getAttribute('aria-label') };
});
await page.goto(`${baseURL}/portfolio/imanol-villagomez`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !document.querySelector('[data-project-video] video').paused);
let demo = await demoState();
if (demo.controls || demo.label !== 'Pause demo video') failures.push(`project demo did not play on its own without controls: ${JSON.stringify(demo)}`);
await page.click('[data-video-toggle]');
demo = await demoState();
if (!demo.paused || demo.label !== 'Play demo video') failures.push(`project demo toggle did not pause: ${JSON.stringify(demo)}`);
findings.interactions.push('project demo autoplay, no native controls, pause toggle');
await context.close();

// Compact (phone) contract: a labeled tab bar, a Start sheet, a screen-sized Welcome
// window that cannot be closed into a blank page, and a swipeable photo viewer.
const phone = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
await phone.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));
const phonePage = await phone.newPage();
await phonePage.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
const tabs = await phonePage.evaluate(() => Array.from(document.querySelectorAll('.taskbar-pins .taskbar-item')).filter((item) => getComputedStyle(item).display !== 'none').map((item) => {
  const rect = item.getBoundingClientRect();
  return { label: item.querySelector('span')?.textContent, labelShown: getComputedStyle(item.querySelector('span')).display !== 'none', width: rect.width, height: rect.height };
}));
if (tabs.map((tab) => tab.label).join() !== 'Home,About,Portfolio,CV,Contact') failures.push(`compact tab bar showed ${tabs.map((tab) => tab.label).join()}`);
if (tabs.some((tab) => !tab.labelShown || tab.width < 44 || tab.height < 44)) failures.push(`compact tabs were unlabeled or under 44px: ${JSON.stringify(tabs)}`);
if (await phonePage.locator('[data-window-primary] .window-control--close').isVisible()) failures.push('compact Welcome window offered a close control');
await phonePage.evaluate(() => window.scrollTo(0, 400));
await phonePage.tap('.taskbar-item[data-taskbar-route="/"]');
await phonePage.waitForFunction(() => window.scrollY === 0);
if (new URL(phonePage.url()).pathname !== '/') failures.push('tapping the current tab navigated away');
await phonePage.tap('[data-start-button]');
if (await phonePage.locator('[data-start-scrim]').getAttribute('hidden') !== null) failures.push('compact Start opened without its scrim');
if (await phonePage.evaluate(() => getComputedStyle(document.body).overflow) !== 'hidden') failures.push('compact Start sheet did not hold the page still');
if (await phonePage.locator('#start-menu [data-start-entry][aria-current="page"]').count() !== 1) failures.push('Start did not mark the current page');
await phonePage.tap('[data-start-scrim]', { position: { x: 180, y: 30 } });
if (await phonePage.locator('#start-menu').getAttribute('hidden') === null) failures.push('tapping the scrim did not close Start');
await phonePage.goto(`${baseURL}/portfolio/clockwork`, { waitUntil: 'networkidle' });
if (!(await phonePage.locator('.taskbar-item[data-taskbar-route="/portfolio"]').evaluate((item) => item.classList.contains('is-section')))) failures.push('nested project did not highlight its Portfolio tab');
if (!(await phonePage.locator('.back-link[href="/portfolio"]').isVisible())) failures.push('nested project lacked its back link');
await phonePage.goto(`${baseURL}/photos`, { waitUntil: 'networkidle' });
await phonePage.tap('[data-gallery-item="0"]');
const lightboxOnTop = await phonePage.evaluate(() => {
  const close = document.querySelector('[data-lightbox-close]').getBoundingClientRect();
  return document.elementFromPoint(close.x + close.width / 2, close.y + close.height / 2)?.closest('[data-lightbox]') !== null
    && document.elementFromPoint(innerWidth / 2, innerHeight - 10)?.closest('.taskbar') === null;
});
if (!lightboxOnTop) failures.push('compact photo viewer sat beneath the taskbar');
await phonePage.tap('[data-lightbox-next]');
if ((await phonePage.locator('[data-lightbox-count]').textContent()) !== '2 of 4') failures.push('photo viewer did not step forward');
await phonePage.keyboard.press('Escape');
for (const route of routes) {
  await phonePage.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page: phonePage }).analyze();
  const material = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''));
  if (material.length) failures.push(`${route} @ 360: axe ${JSON.stringify(material.map((violation) => violation.id))}`);
}
await phone.close();

const retina = await browser.newContext({ ...devices['iPhone 13'] });
await retina.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));
const retinaPage = await retina.newPage();
await retinaPage.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' });
// naturalWidth is normalized by srcset density, so read the chosen file's pixels from its name.
const softIcons = await retinaPage.evaluate(() => Array.from(document.querySelectorAll('img[srcset*="/icons/"]')).filter((icon) => icon.offsetWidth && icon.currentSrc)
  .map((icon) => ({ icon, pixels: Number(icon.currentSrc.match(/-(\d+)\.webp$/)?.[1] ?? 64) }))
  .filter(({ icon, pixels }) => pixels < icon.offsetWidth * devicePixelRatio).map(({ icon, pixels }) => `${icon.currentSrc} ${pixels}px for ${icon.offsetWidth}pt`));
if (softIcons.length) failures.push(`icons upscaled on a 3x screen: ${softIcons.join(', ')}`);
await retina.close();

const landscape = await browser.newContext({ ...devices['iPhone 14 Pro Max landscape'], deviceScaleFactor: 1 });
await landscape.addInitScript(() => sessionStorage.setItem('aero-boot-seen', '1'));
const landscapePage = await landscape.newPage();
await landscapePage.goto(`${baseURL}/about`, { waitUntil: 'networkidle' });
if (await landscapePage.locator('.desktop-icons').isVisible()) failures.push('landscape phone received the desktop layout');
await landscape.close();
findings.interactions.push('compact tab bar, Start sheet, current-tab scroll, nested section highlight, photo viewer stacking and stepping, 360px axe scans, landscape phone layout');

const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reduced.newPage();
await reducedPage.goto(baseURL, { waitUntil: 'networkidle' });
if (await reducedPage.locator('[data-boot-overlay]').count()) failures.push('reduced-motion root retained boot overlay');
await reducedPage.goto(`${baseURL}/portfolio/imanol-villagomez`, { waitUntil: 'networkidle' });
await reducedPage.waitForTimeout(600);
if (!(await reducedPage.locator('[data-project-video] video').evaluate((video) => video.paused))) failures.push('project demo moved for a reduced-motion visitor');
if (await reducedPage.locator('[data-video-toggle]').getAttribute('aria-label') !== 'Play demo video') failures.push('reduced-motion demo did not offer Play');
await reducedPage.goto(baseURL, { waitUntil: 'networkidle' });
await reducedPage.screenshot({ path: `${reviewDir}/home-reduced-motion-390.png`, fullPage: true, animations: 'disabled' });
await reduced.close();
await browser.close();

writeFileSync(`${reviewDir}/browser-qa.json`, JSON.stringify({ failures, findings }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Browser QA passed: ${routes.length} routes × ${widths.length} widths, ${findings.axe.length} axe scans, ${findings.consoleErrors.length} console/network errors.`);
