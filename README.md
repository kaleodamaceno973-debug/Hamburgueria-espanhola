# Smash House — site + sistema de pedidos (demo premium)

Site cinematográfico de hamburgueria com **cardápio, carrinho, checkout (Pix/cartão), área do cliente com status em tempo real e painel administrativo**. Funciona 100% **sem nenhuma chave** (modo demonstração) e vira produção trocando variáveis de ambiente.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router, Cache Components / PPR) · TypeScript estrito · Tailwind CSS 4 · componentes no padrão shadcn/ui (Radix) |
| **Animação** | GSAP + ScrollTrigger + SplitText · Lenis (scroll suave) · Three.js (burger 3D procedural) · Framer Motion (carrinho) |
| **Dados & login** | Prisma + SQLite (local) / PostgreSQL (produção) · Auth.js v5 (e-mail/senha + Google) |
| **Pagamento** | Stripe Checkout em **modo teste** (cartão + Pix) ou **modo demo** sem chaves — ambos passam pelo mesmo webhook com assinatura verificada |
| **Validação** | Zod no cliente e no servidor · preços sempre recalculados no servidor |

---

## 1. Instalar e rodar (5 minutos)

Requisitos: **Node.js 20+** e npm.

```bash
npm install
```

```bash
cp .env.example .env
```

Edite o `.env` e preencha no mínimo:

| Variável | Como obter |
|---|---|
| `AUTH_SECRET` | `npx auth secret` (ou `openssl rand -base64 32`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | o login do administrador que o seed vai criar (senha com 8+ caracteres) |

Crie o banco e os dados de exemplo (22 produtos, 3 banners, depoimentos, FAQ, admin e 30 dias de vendas fictícias para o dashboard):

```bash
npm run setup
```

```bash
npm run dev
```

Abra http://localhost:3000.

### Credenciais de teste

O usuário admin é o que você definir em `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` no `.env` antes do `npm run setup`. Para a demonstração use:

```
SEED_ADMIN_EMAIL="admin@smashhouse.dev"
SEED_ADMIN_PASSWORD="SmashAdmin#2026"
```

- **Admin:** `admin@smashhouse.dev` / `SmashAdmin#2026` → painel em `/admin`
- **Cliente:** crie uma conta em `/cadastro` (cupom `PRIMEIRA20` = 20% off no primeiro pedido)

> As credenciais existem só aqui e no `.env` — nunca no código. Troque-as antes de publicar.

---

## 2. Testar o pagamento

### Modo demo (padrão, sem chaves)
`PAYMENT_PROVIDER="demo"`. No checkout você é levado a `/pagamento/demo/<pedido>`:
- **Pix:** “Simular Pix recebido”.
- **Cartão:** `4242 4242 4242 4242` aprova · `4000 0000 0000 0002` recusa.

A aprovação gera um evento no formato Stripe, **assina com o segredo do webhook e passa pela mesma verificação de assinatura** do endpoint real — o status do pedido muda sozinho, o e-mail de confirmação é registrado e a tela do cliente atualiza em tempo real.

### Stripe (modo teste)
1. Crie uma conta em https://dashboard.stripe.com e ative o **modo de teste**.
2. No `.env`:
   ```
   PAYMENT_PROVIDER="stripe"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PAYMENT_METHODS="card,pix"   # Pix exige conta Stripe Brasil; senão use "card"
   ```
3. Encaminhe os webhooks para sua máquina com a Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copie o `whsec_...` exibido para `STRIPE_WEBHOOK_SECRET` e reinicie o `npm run dev`.
4. Faça um pedido e pague com `4242 4242 4242 4242` (qualquer validade futura/CVC).

Eventos tratados: `checkout.session.completed`, `checkout.session.async_payment_succeeded` (Pix), `checkout.session.async_payment_failed`, `checkout.session.expired`. Processamento idempotente por `event.id`. Cancelamentos de pedidos pagos geram **estorno** automático.

---

## 3. Deploy na Vercel

### 3a. Demo rápida (sem banco externo — ideal para mostrar a clientes)
O `vercel.json` já usa `npm run build:vercel-demo`: o build cria um SQLite populado que vai junto no deploy e é copiado para `/tmp` em execução. Tudo funciona (cadastro, pedidos, pagamento demo, admin), mas **os dados voltam ao estado inicial quando a Vercel recicla a instância** — perfeito para demonstração, não para loja real.

1. Suba a pasta para um repositório no GitHub e importe em https://vercel.com/new.
2. Em *Environment Variables* adicione:
   ```
   DATABASE_URL=file:./demo.db
   AUTH_SECRET=<gere com: npx auth secret>
   AUTH_TRUST_HOST=true
   PAYMENT_PROVIDER=demo
   SEED_ADMIN_EMAIL=admin@smashhouse.dev
   SEED_ADMIN_PASSWORD=SmashAdmin#2026
   NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
   ```
3. Deploy. Depois de saber o domínio, adicione `NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app` e faça *Redeploy*.
4. (Opcional) Em *Storage → Blob* crie um store e conecte ao projeto para o upload de imagens do admin funcionar.

### 3b. Produção (dados permanentes)
Remova o `vercel.json` (ou troque o build para `npm run build`) e siga os passos abaixo.

SQLite não funciona em ambiente serverless, então em produção use PostgreSQL (Neon, Supabase ou Vercel Postgres — todos têm plano grátis).

1. Crie o banco e copie a connection string.
2. Troque o provider do Prisma para PostgreSQL e faça commit:
   ```bash
   npm run db:use-postgres
   ```
3. Crie as tabelas e o seed apontando para o banco de produção (uma vez, da sua máquina):
   ```bash
   DATABASE_URL="postgresql://..." npx prisma db push
   ```
   ```bash
   DATABASE_URL="postgresql://..." npm run db:seed
   ```
4. Suba o repositório no GitHub e importe em https://vercel.com/new.
5. Em **Settings → Environment Variables** cadastre tudo do `.env.example` (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` com o domínio final, etc.).
6. **Upload de imagens:** em **Storage** crie um *Blob store* e conecte ao projeto (cria `BLOB_READ_WRITE_TOKEN`).
7. Stripe: em *Developers → Webhooks* aponte para `https://SEU-DOMINIO/api/webhooks/stripe`, selecione os 4 eventos acima e copie o segredo para `STRIPE_WEBHOOK_SECRET`.
8. Google (opcional): em https://console.cloud.google.com crie um OAuth Client (Web) com redirect `https://SEU-DOMINIO/api/auth/callback/google` e preencha `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`. O botão “Continuar com Google” aparece automaticamente.
9. E-mail real (opcional): crie uma chave em https://resend.com, preencha `RESEND_API_KEY` e `EMAIL_FROM` (domínio verificado). Sem chave, os e-mails ficam em **Admin → Mensagens**.

O comando de build (`prisma generate && next build`) já está configurado.

---

## 4. Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | gera tipos de rota e roda `tsc` estrito |
| `npm run setup` | cria o banco e roda o seed |
| `npm run db:seed` | (re)aplica o seed — idempotente |
| `npm run db:reset` | apaga e recria o banco local |
| `npm run db:use-postgres` | troca o Prisma para PostgreSQL |
| `npm run test:e2e` | teste ponta a ponta (ver abaixo) |

### Teste ponta a ponta
Com o servidor de produção rodando (`npm run build && npm start`):
```bash
ADMIN_EMAIL=admin@smashhouse.dev ADMIN_PASSWORD='SmashAdmin#2026' npm run test:e2e
```
Requer o Playwright: `npm i -D playwright` e `npx playwright install chromium` (uma vez). Cobre: rotas protegidas no servidor, webhook com assinatura inválida, cadastro, busca/filtro, carrinho, cupom calculado no servidor, cartão recusado, Pix aprovado via webhook, remarcação, bloqueio do admin para cliente, login admin, mudança de status refletida em tempo real, e-mail registrado, CRUD de produto refletindo no cardápio, edição de texto refletindo na home, cancelamento com estorno e página 404.

---

## 5. O que tem no sistema

**Site público** — home cinematográfica (hero com slider de banners editáveis, brasas em canvas, parallax por mouse/toque e scroll; marquee; carrossel touch com cards em tilt 3D; **seção fixada onde o burger 3D se desmonta camada por camada conforme o scroll**; reveals com máscara, títulos linha a linha, contadores, linha SVG desenhada no scroll; promo com cupom copiável; depoimentos; FAQ em acordeão; CTA), cardápio com busca instantânea e filtros, página de produto com galeria + zoom, carrinho lateral animado, checkout com entrega/retirada e agendamento, Sobre, Contato (formulário + WhatsApp), Privacidade e Termos (LGPD), banner de cookies, 404 e 500 personalizadas, sitemap, robots, JSON-LD.

**Área do cliente** — meus pedidos, status em tempo real (linha do tempo atualizada a cada 5 s), cancelar (com estorno) e remarcar enquanto o pedido não entrou na chapa, enviar resumo pelo WhatsApp, editar perfil e senha.

**Painel admin** (papel `ADMIN`) — dashboard (faturamento, pedidos do dia, ticket médio, gráfico de 30 dias com tabela acessível, mais vendidos), pedidos com filtros e mudança de status (só transições válidas), detalhe com WhatsApp do cliente, CRUD de produtos com upload de imagens, edição de **textos e banners do site sem código**, mensagens de contato e log de e-mails. Atualiza sozinho a cada 15–20 s.

**Segurança** — `src/proxy.ts` bloqueia `/admin`, `/conta`, `/checkout`, `/pagamento`, `/pedido` no servidor; cada página e server action confere de novo (papel lido do banco); senhas com bcrypt; webhook com verificação de assinatura e idempotência; nenhuma chave secreta no front (`NEXT_PUBLIC_*` só tem URL do site e número do WhatsApp); headers de segurança; redirects pós-login só para o próprio domínio; honeypot no formulário de contato.

**Movimento & acessibilidade** — tudo respeita `prefers-reduced-motion` (sem pin, sem autoplay, 3D estático); 3D com DPR ≤ 2, pausa fora da tela/aba oculta, libera memória ao sair, fallback de imagem se WebGL falhar e loader leve; navegação por teclado, foco visível, labels e mensagens de erro ligadas aos campos.

---

## 6. Personalizar para outro cliente

- **Marca:** cores em `src/app/globals.css` (`:root`), fontes em `src/app/layout.tsx`, logo em `src/components/site/logo.tsx`.
- **Textos/banners:** pelo painel (**Admin → Textos & banners**) ou valores padrão em `src/lib/content-defaults.ts`.
- **Produtos e fotos:** pelo painel, ou edite `prisma/seed.ts` e as imagens em `public/images/`.
- **Regras:** taxa de entrega, pedido mínimo, cupons e horários em `src/lib/constants.ts`.

Fotos de demonstração: Unsplash (licença livre). Substitua pelas fotos reais do cliente antes de publicar.
