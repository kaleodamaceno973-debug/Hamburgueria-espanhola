export type MenuCategory = 'burgers' | 'entrantes' | 'postres';
export type MenuSubGroup = 'clasicos' | 'limited' | 'vegana' | 'entrantes' | 'postres';

export interface MenuItem {
  id: string;
  name: string;
  ingredients: string;
  category: MenuCategory;
  subGroup: MenuSubGroup;
  price: number;
  image: string | null;
  isVegan?: boolean;
  isLimited?: boolean;
  isDemoPrice: boolean;
}

/**
 * TODO: confirmar con Baka Vieja — Precios orientativos realistas para España
 * hasta recibir la tarifa oficial de Ambigu / local.
 */
export const PRECIOS_DEMO: Record<string, number> = {
  'cheese-burger': 11.9,
  'cheddar-melt': 12.5,
  'emmylia-pig': 14.5,
  'bendita-bacon-jelly': 14.5,
  'cheddar-booomb': 14.9,
  'bacon-arce-20': 14.9,
  'antzarrak-72': 15.5,
  'juicy-beef': 15.9,
  'random': 15.5,
  'the-frank': 15.5,
  'yakiniku': 15.5,
  'cheese-burger-vegan': 12.5,
  'nachos': 11.9,
  'pulled-nachos': 13.5,
  'nachos-veganos': 12.5,
  'patatas-especiadas': 6.9,
  'patatas-especiadas-vegan': 6.9,
  'patatas-belgas': 5.5,
  'sweet-bufalo-chicken': 9.9,
  'txerris-fries': 9.9,
  'spetaculos': 6.9,
  'pleasetacho': 7.5,
  'lady-paloma-sunday': 6.9,
};

export const MENU_ITEMS: MenuItem[] = [
  // CLÁSICOS (7)
  {
    id: 'cheese-burger',
    name: 'Cheese Burger',
    ingredients:
      'Bun brioche, burger Baka Vieja, queso fundido, mayonesa, cebolla dulce, pickles, kétchup y mostaza.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['cheese-burger'],
    image: '/assets/aistudio/burger-cheese-burger_a5981471.jpg',
    isDemoPrice: true,
  },
  {
    id: 'cheddar-melt',
    name: 'Cheddar Melt',
    ingredients:
      'Bun brioche, burger Baka Vieja, nuestra crema cheddar, cebolla caramelizada y mayonesa.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['cheddar-melt'],
    image: '/assets/aistudio/burger-cheddar-melt_066eed6a.jpg',
    isDemoPrice: true,
  },
  {
    id: 'emmylia-pig',
    name: 'Emmylia Pig',
    ingredients:
      'Bun brioche, smoke mayo, doble burger Baka Vieja, queso cheddar, cebolla confitada, pétalos de bacon y salsa Emmy.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['emmylia-pig'],
    image: '/assets/aistudio/burger-emmylia-pig_51409b91.jpg',
    isDemoPrice: true,
  },
  {
    id: 'bendita-bacon-jelly',
    name: 'Bendita Bacon Jelly',
    ingredients:
      'Bun brioche, doble burger Baka Vieja, nuestra crema cheddar, mermelada de bacon y mayonesa smoke.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['bendita-bacon-jelly'],
    image: '/assets/aistudio/burger-bendita-bacon-jelly_535308a8.jpg',
    isDemoPrice: true,
  },
  {
    id: 'cheddar-booomb',
    name: 'Cheddar Booomb',
    ingredients:
      'Bun brioche, Baka Vieja, queso cheddar inglés, panceta crujiente, mayonesa de pimienta verde y muchíiiiisima crema cheddar melt.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['cheddar-booomb'],
    image: '/assets/aistudio/burger-cheddar-booomb_787c0136.jpg',
    isDemoPrice: true,
  },
  {
    id: 'bacon-arce-20',
    name: 'Bacon Arce 2.0',
    ingredients:
      'Bun brioche, doble Baka Vieja, doble cheddar, bacon caramelizado en jarabe de arce, bacon crujiente, smokey mayo y Baka BBQ.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['bacon-arce-20'],
    image: '/assets/aistudio/burger-bacon-arce_ef069d40.jpg',
    isDemoPrice: true,
  },
  {
    id: 'antzarrak-72',
    name: 'Antzarrak 72',
    ingredients:
      'Bun brioche, mayonesa de trufa, Baka Vieja, foie fresco a la plancha y reducción de kalimotxo.',
    category: 'burgers',
    subGroup: 'clasicos',
    price: PRECIOS_DEMO['antzarrak-72'],
    image: '/assets/aistudio/burger-antzarrak-72_736b276b.jpg',
    isDemoPrice: true,
  },

  // LIMITED EDITION (4)
  {
    id: 'juicy-beef',
    name: 'Juicy Beef',
    ingredients:
      'Bun brioche, burger Baka Vieja, queso cheddar derretido, carrilleras deshilachadas a baja temperatura, queso Grana Padano rallado y mucho jugo de cocción para mojar el pan… ¡y los dedos!',
    category: 'burgers',
    subGroup: 'limited',
    price: PRECIOS_DEMO['juicy-beef'],
    image: '/assets/aistudio/burger-juicy-beef_d18415dc.jpg',
    isLimited: true,
    isDemoPrice: true,
  },
  {
    id: 'random',
    name: 'Random',
    ingredients:
      'Bun brioche de espiral rojo, petado de sabor con peta zeta y polvo de Tijuana, burger Baka Vieja, cheddar inglés, bacon crujiente, pulled pork, crispy de cebolla y Tasty Sauce.',
    category: 'burgers',
    subGroup: 'limited',
    price: PRECIOS_DEMO['random'],
    image: '/assets/aistudio/burger-random_03da92ee.jpg',
    isLimited: true,
    isDemoPrice: true,
  },
  {
    id: 'the-frank',
    name: 'The Frank',
    ingredients:
      'New York roll, doble burger Baka Vieja, American cheese, cebolla dulce, pepinillos, mayonesa Tasty y lechuguita finita.',
    category: 'burgers',
    subGroup: 'limited',
    price: PRECIOS_DEMO['the-frank'],
    image: null, // TODO: foto oficial pendiente — mostrar silueta neón "Foto próximamente"
    isLimited: true,
    isDemoPrice: true,
  },
  {
    id: 'yakiniku',
    name: 'Yakiniku',
    ingredients:
      'Bun brioche espolvoreado con furikake, burger Baka Vieja, mix de setas orientales salteadas con salsa yakiniku, queso emmental y mayonesa de wasabi.',
    category: 'burgers',
    subGroup: 'limited',
    price: PRECIOS_DEMO['yakiniku'],
    image: '/assets/aistudio/burger-yakiniku_e60a5926.jpg',
    isLimited: true,
    isDemoPrice: true,
  },

  // VEGANA
  {
    id: 'cheese-burger-vegan',
    name: 'Cheese Burger Vegan',
    ingredients:
      'Bun brioche vegan, burger patty vegan, queso cheddar vegan, mayonesa vegan, cebolla dulce, pickles, kétchup y mostaza.',
    category: 'burgers',
    subGroup: 'vegana',
    price: PRECIOS_DEMO['cheese-burger-vegan'],
    image: '/assets/aistudio/burger-vegana-cheese_01fab898.jpg',
    isVegan: true,
    isDemoPrice: true,
  },

  // ENTRANTES (8)
  {
    id: 'nachos',
    name: 'Nachos',
    ingredients:
      'Totopos caseros, chili con carne, queso cheddar gratinado, guacamole y sour cream (crema agria).',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['nachos'],
    image: '/assets/aistudio/entrante-nachos_4dcad6a8.jpg',
    isDemoPrice: true,
  },
  {
    id: 'pulled-nachos',
    name: 'Pulled Nachos',
    ingredients:
      'Totopos caseros, pulled pork, queso cheddar gratinado, guacamole y sour cream.',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['pulled-nachos'],
    image: '/assets/aistudio/entrante-pulled-nachos_d5ec0f75.jpg',
    isDemoPrice: true,
  },
  {
    id: 'nachos-veganos',
    name: 'Nachos Veganos',
    ingredients:
      'Totopos caseros, chili con carne vegana, mayonesa vegana, queso vegano gratinado, guacamole y sour cream.',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['nachos-veganos'],
    image: '/assets/aistudio/entrante-nachos_4dcad6a8.jpg',
    isVegan: true,
    isDemoPrice: true,
  },
  {
    id: 'patatas-especiadas',
    name: 'Patatas Especiadas',
    ingredients:
      'Patatas belgas condimentadas con tomillo, perejil, pimentón y romero, con 3 salsas (alioli, barbacoa y sriracha ahumada).',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['patatas-especiadas'],
    image: '/assets/aistudio/entrante-patatas-especiadas_e04a29d3.jpg',
    isDemoPrice: true,
  },
  {
    id: 'patatas-especiadas-vegan',
    name: 'Patatas Especiadas Vegan',
    ingredients:
      'Patatas belgas condimentadas con tomillo, perejil, pimentón y romero, con 3 salsas veganas (alioli, barbacoa y sriracha ahumada).',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['patatas-especiadas-vegan'],
    image: '/assets/aistudio/entrante-patatas-especiadas_e04a29d3.jpg',
    isVegan: true,
    isDemoPrice: true,
  },
  {
    id: 'patatas-belgas',
    name: 'Patatas Belgas',
    ingredients: 'Patatas belgas fritas al punto, crujientes por fuera y tiernas por dentro.',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['patatas-belgas'],
    image: '/assets/aistudio/entrante-patatas-belgas_f03ca5b9.jpg',
    isDemoPrice: true,
  },
  {
    id: 'sweet-bufalo-chicken',
    name: 'Sweet Búfalo Chicken',
    ingredients:
      'Contramuslos de pollo rebozados, glaseados en salsa sweet búfalo, con sésamo y cebollino.',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['sweet-bufalo-chicken'],
    image: '/assets/aistudio/entrante-sweet-bufalo-chicken_2d817e48.jpg',
    isDemoPrice: true,
  },
  {
    id: 'txerris-fries',
    name: 'Txerris Fries',
    ingredients: 'Patatas belgas, crema cheddar, salsa especial, queso gratinado y bacon.',
    category: 'entrantes',
    subGroup: 'entrantes',
    price: PRECIOS_DEMO['txerris-fries'],
    image: '/assets/aistudio/entrante-txerris-fries_509a7590.jpg',
    isDemoPrice: true,
  },

  // POSTRES (3)
  {
    id: 'spetaculos',
    name: '¡Spetaculos!',
    ingredients:
      'Crema Biscoff con nuestro inigualable brownie con nueces, helado de vainilla, nata, crumble de galleta Lotus y mucha nata.',
    category: 'postres',
    subGroup: 'postres',
    price: PRECIOS_DEMO['spetaculos'],
    image: '/assets/aistudio/postre-spetaculos_df3c6224.jpg',
    isDemoPrice: true,
  },
  {
    id: 'pleasetacho',
    name: 'Pleasetacho',
    ingredients:
      'Torrijas de brioche caramelizadas y bañadas en crema de pistacho, con helado de vainilla y crujiente de pistacho.',
    category: 'postres',
    subGroup: 'postres',
    price: PRECIOS_DEMO['pleasetacho'],
    image: '/assets/aistudio/postre-pleasetacho_a8eda8b1.jpg',
    isDemoPrice: true,
  },
  {
    id: 'lady-paloma-sunday',
    name: 'Lady Paloma Sunday',
    ingredients: 'Helado de vainilla, caramelo salado, palomitas caramelizadas y barquillos.',
    category: 'postres',
    subGroup: 'postres',
    price: PRECIOS_DEMO['lady-paloma-sunday'],
    image: '/assets/aistudio/postre-lady-paloma-sunday_e454cc16.jpg',
    isDemoPrice: true,
  },
];

export const CLASICOS_ITEMS = MENU_ITEMS.filter((item) => item.subGroup === 'clasicos');
export const LIMITED_ITEMS = MENU_ITEMS.filter((item) => item.subGroup === 'limited');

const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

export function formatEuro(amount: number): string {
  return eurFormatter.format(amount);
}

export function normalizeSpanishSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
