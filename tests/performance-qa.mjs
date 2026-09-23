import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseURL = 'http://127.0.0.1:4321';
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const launchOptions = existsSync(chrome) ? { headless: true, executablePath: chrome } : { headless: true };
const routes = ['/', '/portfolio/clockwork', '/blog/2007-thought-the-future-would-be-beautiful'];
const output = '.impeccable/review/performance-qa.json';

mkdirSync('.impeccable/review', { recursive: true });
const browser = await chromium.launch(launchOptions);
const results = [];

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await context.addInitScript(() => {
    window.__webVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__webVitals.lcp = entries.at(-1)?.startTime ?? 0;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__webVitals.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    sessionStorage.setItem('aero-boot-seen', '1');
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: 'cellular4g',
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const started = performance.now();
  await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    return {
      lcpMs: Math.round(window.__webVitals.lcp),
      cls: Number(window.__webVitals.cls.toFixed(4)),
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      transferredBytes: resources.reduce((sum, entry) => sum + entry.transferSize, navigation.transferSize),
      resourceCount: resources.length,
    };
  });
  results.push({ route, elapsedMs: Math.round(performance.now() - started), ...metrics });
  await context.close();
}

await browser.close();
writeFileSync(output, JSON.stringify({ profile: '390px, 4× CPU, 150ms RTT, 1.6Mbps down', results }, null, 2));
const failures = results.filter((result) => result.lcpMs === 0 || result.lcpMs > 2500 || result.cls > 0.1);
if (failures.length) {
  console.error(`Performance budget failed: ${JSON.stringify(failures)}`);
  process.exit(1);
}
console.log(`Performance QA passed: ${results.map((result) => `${result.route} LCP ${result.lcpMs}ms, CLS ${result.cls}`).join('; ')}`);
