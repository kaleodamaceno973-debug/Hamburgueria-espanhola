import { createRequire } from 'module';
const require = createRequire((process.env.NODE_PATH || '').split(':')[0] + '/');
const { chromium, devices } = require('playwright');
const url = process.argv[2] || 'http://localhost:4190/';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ok = (c, m) => console.log((c ? '  ✓ ' : '  ✗ FAIL ') + m);
for (const [name, cfg] of [['DESKTOP', { viewport: { width: 1440, height: 900 } }], ['MOBILE', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }]]) {
  console.log(name);
  const ctx = await b.newContext({ ...cfg, deviceScaleFactor: 1 }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (x) => errs.push(x.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(5000);
  ok((await p.evaluate(() => document.querySelectorAll('.pin-spacer').length)) <= 3, 'no duplicated pins');
  const add = p.locator('button:has-text("Añadir"):visible');
  ok((await add.count()) > 0, 'add buttons: ' + (await add.count()));
  for (const i of [0, 1]) { await add.nth(i).evaluate((e) => e.scrollIntoView({ block: "center" })); await p.waitForTimeout(400); await add.nth(i).click(); await p.waitForTimeout(700);
    const d = p.locator('dialog[open] button:has-text("Añadir")'); if (await d.count()) { await d.last().click(); await p.waitForTimeout(500); }
    if (await p.locator('dialog[open]').count()) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); } }
  { const d = p.locator('[aria-label="Abrir tu pedido"]'); if (await d.isVisible()) await d.click(); else await p.locator('div.fixed.bottom-0 button').first().click(); } await p.waitForTimeout(800);
  const go = p.locator('dialog[open] button:visible, aside button:visible, [role=dialog] button:visible').filter({ hasText: /^\s*Pedir por WhatsApp\s*$/i });
  if (await go.count()) { await go.first().click(); await p.waitForTimeout(600); }
  await p.locator('[form=bv-checkout-form], #bv-checkout-form [type=submit]').first().click(); await p.waitForTimeout(400);
  ok(/obligatori|introduce|válid|necesit|indica/i.test(await p.locator('#bv-checkout-form').innerText()), 'Spanish validation');
  await p.fill('#chk-name', 'Mikel Etxebarria'); await p.fill('#chk-phone', '611222333');
  await p.locator('[form=bv-checkout-form], #bv-checkout-form [type=submit]').first().click(); await p.waitForTimeout(800);
  const a = p.locator('a[href*="wa.me"][href*="PEDIDO"]');
  if (await a.count()) { const msg = decodeURIComponent((await a.first().getAttribute('href')).split('text=')[1] || ''); console.log('    ' + msg.replace(/\n/g, '\n    ')); ok(true, 'WhatsApp link'); }
  else ok(false, 'WhatsApp link');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  if (name === 'MOBILE') { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
    const bt = p.locator('button[aria-label*="menú" i]').first(); await bt.click(); await p.waitForTimeout(700);
    const l = p.locator('[aria-label="Menú móvil"] a, [aria-label="Menú móvil"] button').filter({ hasText: /locales|ubicaci|encu/i }).first();
    if (await l.count()) { const href = await l.getAttribute('href'); await l.click(); await p.waitForTimeout(2500);
      const id = (href || '').replace('#', ''); const t = id ? await p.evaluate((id) => document.getElementById(id)?.getBoundingClientRect().top, id) : null; ok(t != null && t > -20 && t < 140, 'menu link lands on section (top=' + Math.round(t) + ')'); } else ok(false, 'menu link found'); }
  ok((await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, 'no horizontal scroll');
  ok(errs.length === 0, 'console clean ' + JSON.stringify(errs).slice(0, 200)); await ctx.close();
}
await b.close();
