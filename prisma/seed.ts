/* Seed de demonstração — rode com `npm run db:seed`.
 * Credenciais do admin vêm de SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (.env). */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const categories = [
  { slug: "burgers", name: "Burgers", sortOrder: 1 },
  { slug: "combos", name: "Combos", sortOrder: 2 },
  { slug: "especiais", name: "Especiais", sortOrder: 3 },
  { slug: "porcoes", name: "Porções", sortOrder: 4 },
  { slug: "bebidas", name: "Bebidas & Shakes", sortOrder: 5 },
];

type SeedProduct = {
  slug: string; name: string; category: string; price: number; compareAt?: number; badge?: string;
  description: string; long: string; tags: string; calories?: number; featured?: boolean; images: string[];
};

const products: SeedProduct[] = [
  { slug: "classic-smash", name: "Classic Smash", category: "burgers", price: 2990, featured: true, calories: 720,
    description: "Blend 120g, cheddar americano e molho especial.", tags: "carne,cheddar,clássico",
    long: "O burger que começou tudo. Blend bovino de 120g prensado na chapa bem quente até formar a crosta caramelizada, cheddar americano derretido, picles, cebola e o nosso molho especial no pão brioche selado na manteiga.",
    images: ["classic-smash", "plate", "combo-fries"] },
  { slug: "double-cheddar", name: "Double Cheddar", category: "burgers", price: 3690, badge: "Mais pedido", featured: true, calories: 980,
    description: "Dois smashes, cheddar em dobro e picles da casa.", tags: "carne,cheddar,duplo",
    long: "Duas carnes smash de 90g, quatro fatias de cheddar, picles fermentado da casa e molho especial. Para quem leva o queijo a sério.",
    images: ["double-cheddar", "cheese-lava"] },
  { slug: "bbq-bacon", name: "BBQ Bacon", category: "burgers", price: 3490, featured: true, calories: 910,
    description: "Smash duplo, bacon crocante e barbecue defumado.", tags: "carne,bacon,barbecue",
    long: "Duas carnes smash, bacon artesanal crocante, cheddar, cebola caramelizada e barbecue defumado da casa.",
    images: ["bbq-bacon", "bacon-melt"] },
  { slug: "smash-supremo", name: "Smash Supremo", category: "burgers", price: 4490, badge: "Monstro", featured: true, calories: 1290,
    description: "Triplo smash, cheddar, bacon e molho da casa.", tags: "carne,triplo,bacon",
    long: "Três carnes smash, cheddar em cada camada, bacon, alface americana, tomate e molho da casa. Um desafio delicioso.",
    images: ["smash-supremo", "hero-1"] },
  { slug: "bacon-melt", name: "Bacon Melt", category: "burgers", price: 3790, calories: 940,
    description: "Smash, bacon, queijo prato derretido e maionese de alho.", tags: "carne,bacon",
    long: "Blend 120g, queijo prato derretido, bacon em tiras, picles e maionese de alho assado no brioche.",
    images: ["bacon-melt"] },
  { slug: "garden-smash", name: "Garden Smash", category: "burgers", price: 3190, calories: 760,
    description: "Smash, queijo, alface, tomate e cebola roxa.", tags: "carne,salada",
    long: "Um clássico fresco: carne smash, queijo, alface americana, tomate, cebola roxa e maionese verde.",
    images: ["garden-smash"] },
  { slug: "crispy-chicken", name: "Crispy Chicken", category: "burgers", price: 3290, badge: "Frango", calories: 820,
    description: "Sobrecoxa empanada, slaw cremoso e picles.", tags: "frango,crocante",
    long: "Sobrecoxa marinada no buttermilk e empanada crocante, coleslaw cremoso, picles e maionese picante.",
    images: ["crispy-chicken"] },
  { slug: "cheese-lava", name: "Cheese Lava", category: "burgers", price: 3890, badge: "Novo", featured: true, calories: 1050,
    description: "Smash coberto por cascata de queijo cremoso.", tags: "carne,queijo,novo",
    long: "Dois smashes, presunto de parma crocante e uma cascata de fondue de queijos servida na hora.",
    images: ["cheese-lava", "double-cheddar"] },
  { slug: "house-burger", name: "House Burger", category: "burgers", price: 3590, calories: 890,
    description: "Smash, bacon, cheddar, salada e molho da casa.", tags: "carne,bacon,salada",
    long: "O completo da casa: carne smash, cheddar, bacon, alface, tomate, cebola e o molho secreto.",
    images: ["house-burger"] },
  { slug: "combo-classic", name: "Combo Classic", category: "combos", price: 4490, compareAt: 5270, badge: "Economize", featured: true,
    description: "Classic Smash + fritas + bebida da casa.", tags: "combo",
    long: "Classic Smash, fritas clássicas e uma bebida da casa (limonada, chá gelado ou soda). O combo perfeito.",
    images: ["combo-classic", "combo-fries"] },
  { slug: "combo-duo", name: "Combo Duo", category: "combos", price: 7990, compareAt: 9180, badge: "Para dividir",
    description: "2 burgers à escolha da casa + fritas grandes.", tags: "combo,dividir",
    long: "Dois burgers (Classic Smash e BBQ Bacon), fritas da casa e duas bebidas. Ideal para dividir.",
    images: ["duo-smash", "duo-sticks"] },
  { slug: "combo-tabua", name: "Combo Tábua", category: "combos", price: 5490, compareAt: 6170,
    description: "Double Cheddar + fritas rústicas + shake pequeno.", tags: "combo",
    long: "Double Cheddar, porção de fritas rústicas e um shake pequeno de cookies.",
    images: ["combo-board"] },
  { slug: "mini-smash", name: "Mini Smash", category: "especiais", price: 1990, badge: "Kids",
    description: "Smash de 80g com queijo. Ideal para os pequenos.", tags: "kids",
    long: "Versão menor do nosso clássico: carne de 80g, queijo e ketchup no pão brioche.",
    images: ["mini-smash"] },
  { slug: "smash-dog", name: "Smash Dog", category: "especiais", price: 2490,
    description: "Salsicha artesanal, vinagrete e batata palha.", tags: "hot dog",
    long: "Salsicha artesanal defumada, vinagrete, cheddar cremoso e batata palha no pão macio.",
    images: ["hot-dog"] },
  { slug: "fritas-classicas", name: "Fritas Clássicas", category: "porcoes", price: 1490,
    description: "Fritas sequinhas com sal de ervas.", tags: "vegetariano",
    long: "Batatas cortadas na casa, fritas duas vezes e finalizadas com sal de ervas.",
    images: ["fries-classic"] },
  { slug: "fritas-da-casa", name: "Fritas da Casa", category: "porcoes", price: 2290,
    description: "Fritas rústicas com cheddar e bacon.", tags: "bacon,cheddar",
    long: "Fritas rústicas com cheddar cremoso, bacon crocante e cebolinha.",
    images: ["fries-big"] },
  { slug: "onion-rings", name: "Onion Rings", category: "porcoes", price: 1890,
    description: "Anéis de cebola empanados e crocantes.", tags: "vegetariano",
    long: "Cebola empanada na cerveja, servida com maionese defumada.",
    images: ["onion-rings"] },
  { slug: "shake-cookies", name: "Shake de Cookies", category: "bebidas", price: 2290, featured: true,
    description: "Sorvete de baunilha, cookies e calda de chocolate.", tags: "shake,doce",
    long: "Milkshake cremoso de baunilha batido com cookies e calda de chocolate belga.",
    images: ["shake-oreo"] },
  { slug: "shake-morango", name: "Shake de Morango", category: "bebidas", price: 2190,
    description: "Morangos frescos e sorvete de creme.", tags: "shake,doce",
    long: "Morangos frescos batidos com sorvete de creme e chantilly.",
    images: ["shake-strawberry"] },
  { slug: "limonada-suica", name: "Limonada Suíça", category: "bebidas", price: 1290,
    description: "Limão, leite condensado e gelo.", tags: "bebida",
    long: "Limonada cremosa feita na hora. 500ml.", images: ["lemonade"] },
  { slug: "cha-gelado", name: "Chá Gelado da Casa", category: "bebidas", price: 1190,
    description: "Chá preto, limão e hortelã.", tags: "bebida",
    long: "Chá preto gelado com limão tahiti e hortelã. 500ml.", images: ["iced-tea"] },
  { slug: "soda-limao", name: "Soda Limão & Hortelã", category: "bebidas", price: 1290,
    description: "Água com gás, limão e hortelã fresca.", tags: "bebida",
    long: "Refrescante e sem açúcar: água com gás, limão e hortelã. 400ml.", images: ["mojito-lime"] },
];

const banners = [
  { eyebrow: "Smash burgers artesanais", title: "Sabor gigante.", highlight: "Sem atalhos.", subtitle: "Burgers prensados na chapa, ingredientes frescos e um sabor que você não esquece.", ctaLabel: "Pedir agora", ctaHref: "/cardapio", imageUrl: "/images/hero-1.webp", sortOrder: 1 },
  { eyebrow: "Novo no cardápio", title: "Cheese", highlight: "Lava.", subtitle: "Dois smashes e uma cascata de queijo servida na hora. Coragem é opcional.", ctaLabel: "Quero o meu", ctaHref: "/cardapio/cheese-lava", imageUrl: "/images/hero-3.webp", sortOrder: 2 },
  { eyebrow: "Bacon de verdade", title: "BBQ", highlight: "Bacon.", subtitle: "Bacon artesanal crocante, barbecue defumado e cebola caramelizada.", ctaLabel: "Ver burger", ctaHref: "/cardapio/bbq-bacon", imageUrl: "/images/hero-2.webp", sortOrder: 3 },
];

const testimonials = [
  { name: "Mariana Costa", role: "Cliente desde 2021", text: "Melhor smash de São Paulo, sem exagero. A crosta da carne é perfeita e chega quentinho em casa.", rating: 5 },
  { name: "Rafael Lima", role: "Pedido via app", text: "Pedi pelo site, paguei no Pix e em 30 minutos estava aqui. O Double Cheddar é absurdo.", rating: 5 },
  { name: "Juliana Alves", role: "Fã do Cheese Lava", text: "O Cheese Lava é uma experiência. Atendimento impecável e embalagem que mantém tudo crocante.", rating: 5 },
  { name: "Pedro Henrique", role: "Retira no balcão", text: "Agendo a retirada e chego com tudo pronto. Prático demais e o sabor é sempre o mesmo: excelente.", rating: 5 },
  { name: "Camila Rocha", role: "Cliente fiel", text: "As fritas da casa com cheddar e bacon são viciantes. Shake de cookies obrigatório!", rating: 5 },
  { name: "Lucas Martins", role: "Primeiro pedido", text: "Usei o cupom de 20% no primeiro pedido e virei cliente. Preço justo pela qualidade.", rating: 4 },
];

const faqs = [
  { question: "Qual o tempo médio de entrega?", answer: "Entre 30 e 45 minutos, dependendo da distância e do horário. Você acompanha cada etapa em tempo real na sua conta." },
  { question: "Quais formas de pagamento vocês aceitam?", answer: "Pix e cartão de crédito, com pagamento 100% online e seguro. O pedido só vai para a chapa após a confirmação do pagamento." },
  { question: "Posso agendar meu pedido?", answer: "Sim! No checkout escolha um horário para entrega ou retirada. Até o pedido entrar em preparo você pode remarcar ou cancelar pela sua conta." },
  { question: "A taxa de entrega é fixa?", answer: "A taxa é de R$ 7,90 e é grátis para pedidos acima de R$ 80. Retirada no balcão não tem taxa." },
  { question: "Vocês têm opções sem carne?", answer: "Temos porções vegetarianas, shakes e bebidas. Em breve um smash 100% vegetal no cardápio." },
  { question: "Como funciona o cupom de primeiro pedido?", answer: "Use o cupom PRIMEIRA20 no checkout da sua primeira compra para ganhar 20% de desconto nos produtos." },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    throw new Error("Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD (mín. 8 caracteres) no .env antes do seed.");
  }

  for (const c of categories) {
    await db.category.upsert({ where: { slug: c.slug }, update: { name: c.name, sortOrder: c.sortOrder }, create: c });
  }
  const cats = Object.fromEntries((await db.category.findMany()).map((c) => [c.slug, c.id]));

  for (const [i, p] of products.entries()) {
    const data = {
      name: p.name, description: p.description, longDescription: p.long, priceCents: p.price,
      compareAtCents: p.compareAt ?? null, badge: p.badge ?? null, tags: p.tags, calories: p.calories ?? null,
      featured: p.featured ?? false, available: true, sortOrder: i, categoryId: cats[p.category],
    };
    const product = await db.product.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
    await db.productImage.deleteMany({ where: { productId: product.id } });
    await db.productImage.createMany({
      data: p.images.map((img, idx) => ({ productId: product.id, url: `/images/${img}.webp`, alt: p.name, sortOrder: idx })),
    });
  }

  if ((await db.banner.count()) === 0) await db.banner.createMany({ data: banners });
  if ((await db.testimonial.count()) === 0) await db.testimonial.createMany({ data: testimonials.map((t, i) => ({ ...t, sortOrder: i })) });
  if ((await db.faq.count()) === 0) await db.faq.createMany({ data: faqs.map((f, i) => ({ ...f, sortOrder: i })) });

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash },
    create: { email: adminEmail, name: "Admin Smash House", role: "ADMIN", passwordHash },
  });

  // Histórico de vendas fictício para o dashboard (últimos 30 dias).
  if ((await db.order.count()) === 0) {
    const demoCustomer = await db.user.upsert({
      where: { email: "cliente.demo@smashhouse.dev" },
      update: {},
      create: { email: "cliente.demo@smashhouse.dev", name: "Cliente Demonstração" },
    });
    const all = await db.product.findMany({ include: { images: { take: 1 } } });
    let seq = 0;
    for (let day = 29; day >= 0; day--) {
      const count = 3 + ((day * 7) % 6);
      for (let k = 0; k < count; k++) {
        seq++;
        const created = new Date(Date.now() - day * 86400_000 - ((k * 53) % 600) * 60_000);
        const picks = [all[(seq * 3) % all.length], all[(seq * 5 + 1) % all.length]];
        const items = picks.map((p, idx) => ({ productId: p.id, name: p.name, imageUrl: p.images[0]?.url ?? null, unitPriceCents: p.priceCents, quantity: 1 + ((seq + idx) % 2), totalCents: 0 }));
        items.forEach((it) => (it.totalCents = it.unitPriceCents * it.quantity));
        const subtotal = items.reduce((s, it) => s + it.totalCents, 0);
        const delivery = seq % 3 === 0 ? 0 : subtotal >= 8000 ? 0 : 790;
        const status = day === 0 ? (["PAID", "PREPARING", "READY"] as const)[k % 3] : seq % 17 === 0 ? "CANCELLED" : "COMPLETED";
        await db.order.create({
          data: {
            code: `SH-D${String(seq).padStart(5, "0")}`,
            userId: demoCustomer.id,
            status,
            paymentStatus: status === "CANCELLED" ? "REFUNDED" : "PAID",
            paymentMethod: seq % 2 ? "PIX" : "CARD",
            paymentProvider: "demo",
            fulfillment: seq % 3 === 0 ? "PICKUP" : "DELIVERY",
            subtotalCents: subtotal, deliveryFeeCents: delivery, totalCents: subtotal + delivery,
            customerName: ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio"][seq % 6] + " (demo)",
            customerEmail: "cliente.demo@smashhouse.dev",
            customerPhone: "11999990000",
            addressStreet: seq % 3 === 0 ? null : "Rua Exemplo", addressNumber: seq % 3 === 0 ? null : String(100 + seq),
            addressDistrict: seq % 3 === 0 ? null : "Centro", addressCity: seq % 3 === 0 ? null : "São Paulo",
            createdAt: created, paidAt: created,
            items: { create: items },
            events: { create: [{ status: "PAID" as const, createdAt: created }, ...(status !== "PAID" ? [{ status: status as "PAID", createdAt: created }] : [])] },
          },
        });
      }
    }
  }

  console.log(`✔ Seed concluído: ${products.length} produtos, ${banners.length} banners, admin ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
