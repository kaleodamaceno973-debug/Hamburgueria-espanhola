/** Textos editáveis pelo painel (Admin → Conteúdo). Valores padrão. */
export const CONTENT_FIELDS = [
  { key: "topbar.address", label: "Barra superior · endereço", group: "Geral", default: "Rua Augusta, 1200 · São Paulo, SP" },
  { key: "topbar.hours", label: "Barra superior · horário", group: "Geral", default: "Todos os dias · 11h às 23h" },
  { key: "topbar.promo", label: "Barra superior · promoção", group: "Geral", default: "Entrega grátis acima de R$ 80" },
  { key: "contact.phone", label: "Telefone", group: "Geral", default: "(11) 99999-9999" },
  { key: "contact.email", label: "E-mail", group: "Geral", default: "ola@smashhouse.com.br" },
  { key: "contact.address", label: "Endereço completo", group: "Geral", default: "Rua Augusta, 1200 — Consolação, São Paulo/SP" },

  { key: "home.menu.eyebrow", label: "Cardápio · chamada", group: "Home", default: "Nosso cardápio" },
  { key: "home.menu.title", label: "Cardápio · título", group: "Home", default: "Burgers que são diferentes" },
  { key: "home.menu.text", label: "Cardápio · texto", group: "Home", default: "Dos clássicos às criações da casa: cada burger é prensado na chapa na hora, com paixão." },
  { key: "home.anatomy.title", label: "Anatomia · título", group: "Home", default: "Anatomia de um smash perfeito" },
  { key: "home.anatomy.text", label: "Anatomia · texto", group: "Home", default: "Role a página e desmonte o nosso clássico, camada por camada." },
  { key: "home.story.title", label: "História · título", group: "Home", default: "Uma paixão por burgers" },
  { key: "home.story.text", label: "História · texto", group: "Home", default: "A Smash House nasceu de uma ideia simples: fazer o melhor burger da cidade com ingredientes de verdade, técnica de chapa e muito carinho em cada detalhe." },
  { key: "home.promo.title", label: "Promo · título", group: "Home", default: "Ganhe 20% off" },
  { key: "home.promo.subtitle", label: "Promo · subtítulo", group: "Home", default: "no seu primeiro pedido" },
  { key: "home.promo.code", label: "Promo · cupom exibido", group: "Home", default: "PRIMEIRA20" },
  { key: "home.cta.title", label: "CTA final · título", group: "Home", default: "Bateu a fome?" },
  { key: "home.cta.text", label: "CTA final · texto", group: "Home", default: "Peça agora e receba quentinho em casa — ou retire no balcão sem fila." },

  { key: "about.title", label: "Sobre · título", group: "Sobre", default: "Feito na chapa, com alma de bairro" },
  { key: "about.text", label: "Sobre · texto", group: "Sobre", default: "Começamos em 2018 com uma chapa de ferro, um blend de carne escolhido a dedo e a vontade de fazer o burger que a gente queria comer. Hoje são milhares de smashes por mês — e a receita continua a mesma: carne fresca moída todo dia, pão brioche da padaria parceira e queijo de verdade." },
] as const;

export type ContentKey = (typeof CONTENT_FIELDS)[number]["key"];
export type SiteContentMap = Record<ContentKey, string>;
