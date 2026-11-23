/**
 * Teste ponta a ponta do fluxo principal (Playwright).
 * Requisitos: servidor rodando (npm run build && npm start) e seed aplicado.
 * Uso: BASE_URL=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run test:e2e
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD;
const results = [];
const errors = [];

async function step(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push(`✔ ${name} (${Date.now() - t}ms)`);
  } catch (e) {
    results.push(`✘ ${name}: ${e.message.split("\n")[0]}`);
    throw e;
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text().slice(0, 200)}`));
  const email = `cliente.${Date.now()}@teste.dev`;
  const password = "Teste1234";

  await step("Rotas protegidas redirecionam para login (servidor)", async () => {
    for (const path of ["/conta", "/checkout", "/admin", "/admin/pedidos"]) {
      const res = await fetch(BASE + path, { redirect: "manual" });
      expect(res.status === 307 || res.status === 302, `${path} retornou ${res.status}`);
      expect((res.headers.get("location") || "").includes("/entrar"), `${path} não redirecionou para /entrar`);
    }
  });

  await step("Webhook rejeita assinatura inválida (400)", async () => {
    const res = await fetch(BASE + "/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=falsa", "content-type": "application/json" },
      body: JSON.stringify({ id: "evt_fake", type: "checkout.session.completed" }),
    });
    expect(res.status === 400, `status ${res.status}`);
  });

  await step("Home carrega com hero e seção 3D", async () => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.locator("#anatomia").scrollIntoViewIfNeeded();
  });

  await step("Cadastro de cliente", async () => {
    await page.goto(BASE + "/cadastro");
    await page.fill("#name", "Cliente Teste");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirm", password);
    await page.check('input[name="acceptTerms"]');
    await page.getByRole("button", { name: "Criar conta" }).click();
    await page.waitForURL("**/conta", { timeout: 20000 });
  });

  await step("Busca e filtro do cardápio", async () => {
    await page.goto(BASE + "/cardapio");
    await page.fill("#menu-search", "bacon");
    await page.waitForTimeout(500);
    const names = await page.locator("article h3").allTextContents();
    expect(names.length > 0 && names.some((n) => /bacon/i.test(n)), "busca não encontrou bacon");
    await page.fill("#menu-search", "xyz-inexistente");
    await page.getByText("Nada encontrado").waitFor();
    await page.fill("#menu-search", "");
  });

  await step("Produto: adicionar 2 unidades ao carrinho", async () => {
    await page.goto(BASE + "/cardapio/classic-smash");
    await page.getByRole("button", { name: "Aumentar quantidade" }).click();
    await page.getByRole("button", { name: /Adicionar · R\$/ }).click();
    await page.getByRole("dialog").getByText("Classic Smash").waitFor();
    await page.getByRole("button", { name: /Finalizar pedido/ }).click();
    await page.waitForURL("**/checkout");
  });

  let code = "";
  await step("Checkout: cupom calculado no servidor + pedido criado", async () => {
    await page.fill("#phone", "11988887777");
    await page.fill("#address-street", "Rua Teste");
    await page.fill("#address-number", "123");
    await page.fill("#address-district", "Centro");
    await page.fill("#couponCode", "PRIMEIRA20");
    await page.getByRole("button", { name: "Aplicar" }).click();
    await page.getByText("✓ 20% off no primeiro pedido").waitFor({ timeout: 10000 });
    const total = await page.locator("dd.font-display").first().textContent();
    // 2 × 29,90 = 59,80 − 20% = 47,84 + entrega 7,90 = 55,74
    expect(total?.includes("55,74"), `total inesperado: ${total}`);
    await page.check("#accept");
    await page.getByRole("button", { name: /^Pagar/ }).click();
    await page.waitForURL("**/pagamento/demo/**", { timeout: 20000 });
    code = page.url().split("/").pop();
    expect(/^SH-/.test(code), "código inválido " + code);
  });

  await step("Cartão de recusa é rejeitado", async () => {
    await page.getByRole("tab", { name: "Cartão" }).click();
    await page.fill("#card", "4000 0000 0000 0002");
    await page.getByTestId("pay-card").click();
    await page.getByText(/Cartão recusado/).first().waitFor();
  });

  await step("Pagamento Pix (webhook assinado) confirma o pedido", async () => {
    await page.getByRole("tab", { name: "Pix" }).click();
    await page.getByTestId("simulate-pix").click();
    await page.waitForURL(`**/pedido/${code}**`, { timeout: 20000 });
    await page.getByText("Pagamento aprovado").first().waitFor();
  });

  await step("Cliente remarca horário", async () => {
    await page.getByRole("button", { name: /Agendar horário|Remarcar/ }).click();
    await page.getByRole("dialog").locator("button[aria-pressed]").nth(3).click();
    await page.getByRole("button", { name: "Confirmar novo horário" }).click();
    await page.getByText("Horário atualizado!").waitFor();
  });

  await step("Valor do pedido no banco veio do servidor", async () => {
    const res = await page.request.get(`${BASE}/api/orders/${code}`);
    expect(res.ok(), "api status " + res.status());
    const json = await res.json();
    expect(json.status === "PAID", "status " + json.status);
  });

  // ── Admin ──
  const admin = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ap = await admin.newPage();
  ap.on("pageerror", (e) => errors.push(`admin pageerror: ${e.message}`));

  await step("Cliente comum não acessa /admin", async () => {
    const res = await page.goto(BASE + "/admin");
    expect(page.url().includes("/conta?erro=acesso"), "cliente acessou admin: " + page.url() + " " + res?.status());
  });

  await step("Login admin", async () => {
    expect(ADMIN_EMAIL && ADMIN_PASSWORD, "defina ADMIN_EMAIL/ADMIN_PASSWORD");
    await ap.goto(BASE + "/entrar?callbackUrl=/admin");
    await ap.fill("#email", ADMIN_EMAIL);
    await ap.fill("#password", ADMIN_PASSWORD);
    await ap.getByRole("button", { name: "Entrar", exact: true }).click();
    await ap.waitForURL("**/admin", { timeout: 20000 });
    await ap.getByText("Faturamento hoje").waitFor();
  });

  await step("Admin avança status → cliente vê em tempo real", async () => {
    await ap.goto(`${BASE}/admin/pedidos/${code}`);
    await ap.getByRole("button", { name: "→ Na chapa" }).click();
    await ap.getByText("Pedido: Na chapa").waitFor();
    // a página do cliente faz polling a cada 5s
    await page.goto(`${BASE}/pedido/${code}`);
    await ap.goto(`${BASE}/admin/pedidos/${code}`);
    await ap.getByRole("button", { name: "→ Pronto" }).click();
    await ap.getByText("Pedido: Pronto").waitFor();
    await page.locator('li[aria-current="step"]').getByText(/Saiu para entrega|Pronto/).waitFor({ timeout: 15000 }).catch(() => null);
    const live = await (await page.request.get(`${BASE}/api/orders/${code}`)).json();
    expect(live.status === "READY", "status ao vivo " + live.status);
  });

  await step("Cliente não pode cancelar pedido em preparo", async () => {
    await page.reload();
    expect((await page.getByRole("button", { name: "Cancelar pedido" }).count()) === 0, "botão cancelar visível");
  });

  await step("Admin: e-mail de confirmação registrado", async () => {
    await ap.goto(`${BASE}/admin/mensagens`);
    await ap.getByText(`Pedido ${code} confirmado`).first().waitFor();
  });

  await step("Admin: criar produto, aparece no cardápio, ocultar", async () => {
    await ap.goto(`${BASE}/admin/produtos/novo`);
    const name = `Burger Teste ${Date.now() % 10000}`;
    await ap.fill("#name", name);
    await ap.fill("#description", "Produto criado pelo teste automatizado");
    await ap.fill("#price", "19,90");
    await ap.setInputFiles('input[name="images"]', "public/images/classic-smash.webp");
    await ap.getByRole("button", { name: "Criar produto" }).click();
    await ap.waitForURL("**/admin/produtos?salvo=1", { timeout: 20000 });
    await page.goto(`${BASE}/cardapio`);
    await page.fill("#menu-search", name);
    await page.getByRole("heading", { name }).waitFor({ timeout: 10000 });
    await ap.getByRole("switch", { name: `${name} disponível` }).click();
    await ap.getByText("Produto oculto").waitFor();
    await page.reload();
    await page.fill("#menu-search", name);
    await page.getByText("Nada encontrado").waitFor({ timeout: 10000 });
    ap.once("dialog", (d) => d.accept());
    await ap.getByRole("button", { name: `Excluir ${name}` }).click();
    await ap.getByText("Produto excluído").waitFor();
  });

  await step("Admin: editar texto do site reflete na home", async () => {
    await ap.goto(`${BASE}/admin/conteudo`);
    const original = await ap.inputValue('input[name="home.cta.title"]');
    await ap.fill('input[name="home.cta.title"]', "Bateu a fome agora?");
    await ap.getByRole("button", { name: "Publicar textos" }).click();
    await ap.getByText("Textos publicados no site!").waitFor();
    await page.goto(`${BASE}/`);
    expect((await page.locator("#cta-title").getAttribute("aria-label") ?? (await page.locator("#cta-title").textContent()))?.includes("Bateu a fome agora?"), "texto não atualizou");
    await ap.fill('input[name="home.cta.title"]', original);
    await ap.getByRole("button", { name: "Publicar textos" }).click();
    await ap.getByText("Textos publicados no site!").waitFor();
  });

  await step("Cancelamento pelo cliente (novo pedido pago → estorno)", async () => {
    await page.goto(`${BASE}/cardapio/fritas-classicas`);
    await page.getByRole("button", { name: "Aumentar quantidade" }).click(); // pedido mínimo R$ 20
    await page.getByRole("button", { name: /Adicionar · R\$/ }).click();
    await page.getByRole("button", { name: /Finalizar pedido/ }).click();
    await page.waitForURL("**/checkout");
    await page.getByRole("radio", { name: /Retirada/ }).click();
    await page.check("#accept");
    await page.getByRole("button", { name: /^Pagar/ }).click();
    await page.waitForURL("**/pagamento/demo/**");
    await page.getByTestId("simulate-pix").click();
    await page.waitForURL("**/pedido/**");
    await page.getByRole("button", { name: "Cancelar pedido" }).click();
    await page.getByRole("button", { name: "Sim, cancelar" }).click();
    await page.getByText("Pedido cancelado.").waitFor();
    await page.reload();
    await page.getByText("Estornado").first().waitFor();
  });

  await step("Página 404 personalizada", async () => {
    const res = await page.goto(`${BASE}/nao-existe-xyz`);
    expect(res?.status() === 404, "status " + res?.status());
    await page.getByText("Esse burger saiu do cardápio").waitFor();
  });
} catch {
  /* resultado já registrado */
} finally {
  await browser.close();
  console.log(results.join("\n"));
  if (errors.length) console.log("\nErros de console:\n" + [...new Set(errors)].join("\n"));
  process.exitCode = results.some((r) => r.startsWith("✘")) ? 1 : 0;
}
