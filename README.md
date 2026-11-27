# Bilbo Burger — Propuesta de Rediseño

Projeto desenvolvido em **Vite + React + TypeScript + Tailwind CSS**, com animações em **GSAP 3 + ScrollTrigger + Lenis** e partículas de brasa em **Three.js** (carregadas dinamicamente após o primeiro paint).

---

## Como personalizar e editar os dados

Toda a gestão de marca, textos, links e carta está centralizada em dois arquivos:

### 1. Dados da marca, links, locais e textos (`src/data/negocio.ts`)
- **Nome da agência na faixa de proposta:** altere `NEGOCIO.agenciaPropuesta`.
- **Links externos (Delitbee, Last.app, Google Maps, redes sociais):** edite o objeto `NEGOCIO.enlaces`.
  - Todos os botões de **"Pide online"** abrem primeiro o modal obrigatório de aviso de entrega (`DeliveryNoticeModal`) antes de encaminhar para `NEGOCIO.enlaces.pedidoOnline`.
- **Endereços dos locais (incluindo Santutxu):** atualize `NEGOCIO.locales`.
- **Textos institucionais, aviso de entrega, reseña e FAQ:** edite `NEGOCIO.textos`, `NEGOCIO.resenaDestacada` e `NEGOCIO.faqs`.

### 2. Carta, picoteo e configurador "Hazla tuya" (`src/data/carta.ts`)
- **Burgers da casa ("La vuelta al mundo a la brasa"):** edite o array `BURGERS_CASA` (nome, ingredientes, cor de destaque `acentoHex` e foto). Quando tiver os preços oficiais, adicione o campo de preço e exiba-o nos cards de `src/components/WorldTourCarousel.tsx`.
- **Picoteo:** edite `PICOTEO_ITEMS`.
- **Opções do configurador "Hazla tuya":** edite `CONFIG_PANES`, `CONFIG_CARNES`, `CONFIG_QUESOS`, `CONFIG_VEGETALES`, `CONFIG_EXTRAS` e `CONFIG_SALSAS`.
  - Itens marcados com `todoConfirmar: true` representam opções ilustrativas que devem ser validadas com o cliente.

### 3. Imagens (`public/images/` e `public/og.jpg`)
- **Fotos reais oficiais (em `.webp` qualidade ~82):** ficam diretamente em `public/images/` (`hero-burger.webp`, `burger-tokio.webp`, `picoteo-*.webp`, `brasas-carbon-encina.webp`, `local-ibarrekolanda.webp`, `logo-bilboburger.webp`, `icono-bilboburger.png`).
- **Camadas do configurador:** ficam em `public/images/config/*.webp` (fundo transparente). Para trocar qualquer ingrediente, basta substituir o arquivo `.webp` mantendo proporção e transparência, ou atualizar o caminho e dimensões (`width`/`height`) em `src/data/carta.ts`.
- **Card de compartilhamento (`og.jpg`):** substitua `public/og.jpg` (1200×630) e atualize a URL absoluta em `index.html` quando publicar no domínio final (lembrando de remover `<meta name="robots" content="noindex, nofollow">` ao aprovar a publicação em produção).

---

## Scripts disponíveis

```bash
npm install
npm run dev      # Servidor local na porta 3000
npm run lint     # Verificação de tipos TypeScript
npm run build    # Gera a pasta dist/ para produção (Vercel / static hosting)
```
