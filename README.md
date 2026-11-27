# JEYMA (Bilbao) · Proposta de Redesign

Proposta interativa desenvolvida em **React + TypeScript + Vite + Tailwind CSS + GSAP / Lenis** para o bar **JEYMA** (Pérez Galdós 33, Bilbao).

---

## Como rodar o projeto

```bash
npm install
npm run dev      # Servidor local em http://localhost:3000
npm run build    # Gera a versão de produção em dist/
```

---

## Onde alterar as configurações principais

### 1. WhatsApp de destino e nome da agência
Abra o arquivo `src/data/negocio.ts`:
- **`WHATSAPP_NUMBER`**: Altere `'34600000000'` pelo número real que receberá os pedidos (sem `+` nem espaços, apenas DDI + número).
- **`WHATSAPP_DISPLAY`**: Altere `'+34 600 000 000'` para exibição na tela de checkout.
- **`PROPUESTA_CONFIG.agenciaNombre`**: Substitua `'Estudio Norte'` pelo nome da sua agência, ou defina `mostrarBannerPropuesta: false` para ocultar a faixa superior de proposta ao publicar em produção.

### 2. Horário, endereço e links de reserva
Em `src/data/negocio.ts`:
- **`HORARIO_SEMANAL`**: Horários usados para calcular automaticamente **"Abierto ahora / Cerrado"** no fuso `Europe/Madrid` e validar os horários de entrega no checkout.
- **`NEGOCIO`**: Telefone, e-mail, Instagram, URL do widget de reserva e link do Google Maps.

### 3. Preços, pratos, descrições e opções
Abra o arquivo `src/data/carta.ts`:
- Todos os 14 itens estão listados em `CARTA_ITEMS` com preço, descrição, categoria (`raciones`, `cuadrilla`, `hamburguesas`), opções (`eligeBase`, `sabores`, `extraPatatasPrecio`) e caminho da foto.
- Ao alterar qualquer `precio` ou `extraPatatasPrecio`, o site, a ficha do produto, o carrinho e o total da mensagem do WhatsApp são recalculados automaticamente.

### 4. Fotos dos pratos
Todas as imagens finais estão em `public/images/` em formato `.webp` (e `public/images/og.jpg` em `1200×630` para compartilhamento).
- Consulte `PROMPTS-FOTOS.md` para ver a lista exata de quais fotos são reais do cliente e quais foram geradas para a proposta.
- Para trocar qualquer foto, basta substituir o arquivo correspondente em `public/images/` mantendo o mesmo nome (ou atualizar o campo `imagen` em `src/data/carta.ts`).

### 5. SEO e Open Graph (`og:image`)
Ao publicar em um domínio próprio (por exemplo, na Vercel), atualize a URL absoluta da tag `<meta property="og:image">` e `<meta name="twitter:image">` em `index.html`, e remova `<meta name="robots" content="noindex, nofollow" />` quando o site passar a ser o oficial.
