// QA: node tools/qa.mjs [url] [outdir] [desk|mob]
import { createRequire } from 'module';
const require = createRequire((process.env.NODE_PATH || '').split(':')[0] + '/');
const { chromium, devices } = require('playwright');
const url = process.argv[2] || 'http://localhost:4180/';
const out = process.argv[3] || '/tmp/claude-0/tab';
const only = process.argv[4];
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const configs = [['desk', { viewport: { width: 1440, height: 900 } }], ['mob', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }]];
for (const [name, cfg] of configs) {
  if (only && only !== name) continue;
  const ctx = await b.newContext({ ...cfg, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && !/GL Driver|GPU stall/.test(m.text()) && errs.push(m.type() + ': ' + m.text().slice(0, 200)));
  p.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  p.on('requestfailed', (r) => errs.push('REQFAIL ' + r.url().slice(0, 120)));
  p.on('response', (r) => r.status() >= 400 && errs.push('HTTP ' + r.status() + ' ' + r.url().slice(0, 120)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(6000);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const vh = cfg.viewport.height;
  const hs = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, 'height', H, 'horizontal overflow px:', hs);
  const stops = (process.env.STOPS || '0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1').split(',').map(Number);
  for (const f of stops) {
    await p.evaluate((y) => window.scrollTo(0, y), Math.round(f * (H - vh)));
    await p.waitForTimeout(1100);
    await p.screenshot({ path: `${out}/${name}-${String(Math.round(f * 100)).padStart(3, '0')}.png` });
  }
  console.log(name, 'console:', errs.length ? errs : 'clean');
  await ctx.close();
}
await b.close();
