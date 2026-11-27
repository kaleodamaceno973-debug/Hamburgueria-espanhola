export interface BurgerCasa {
  id: string;
  nombre: string;
  paisLabel: string;
  ingredientes: string;
  imagen: string;
  width: number;
  height: number;
  acentoHex: string;
  acentoSecundarioHex?: string;
  alt: string;
}

export interface PicoteoItem {
  id: string;
  nombre: string;
  detalle: string;
  imagen: string;
  width: number;
  height: number;
  alt: string;
}

export interface ConfigOpcion {
  id: string;
  nombre: string;
  nota?: string;
  todoConfirmar?: boolean;
  imagen?: string;
  width?: number;
  height?: number;
  imagenBottom?: string;
  bottomWidth?: number;
  bottomHeight?: number;
}

export const CARNES_BASE = [
  { id: 'txuleta', nombre: 'Txuleta', sub: 'Maduración y carácter vasco' },
  { id: 'wagyu', nombre: 'Wagyu', sub: 'Jugosidad extrema a la brasa' },
  { id: 'pollo', nombre: 'Pollo crispy', sub: 'Crujiente por fuera, jugoso dentro' },
  { id: 'vegetal', nombre: 'Vegetal', sub: '100% sabor a parrilla de encina' },
] as const;

// TODO: Completar con precios e ingredientes completos de carta cuando el cliente los facilite
export const BURGERS_CASA: BurgerCasa[] = [
  {
    id: 'tokio',
    nombre: 'Tokio',
    paisLabel: '01 · Japón a la brasa',
    ingredientes: 'Burger de wagyu a la brasa con cebolla crujiente.',
    imagen: '/images/burger-tokio.webp',
    width: 800,
    height: 1000,
    acentoHex: '#E62E2D',
    alt: 'Burger Tokio de Bilbo Burger de wagyu con cebolla crujiente frente a mural japonés rojo y negro',
  },
  {
    id: 'mexico',
    nombre: 'México',
    paisLabel: '02 · Fuego y picante',
    ingredientes: 'Medallón a la brasa con jalapeños.',
    imagen: '/images/burger-mexico.webp',
    width: 800,
    height: 1000,
    acentoHex: '#84CC16',
    alt: 'Burger México de Bilbo Burger con jalapeños frente a mural de lucha libre y calavera mexicana',
  },
  {
    id: 'mafia',
    nombre: 'Mafia',
    paisLabel: '03 · Clásico con autoridad',
    ingredientes: 'Medallón a la brasa con bacon, queso y pepinillo.',
    imagen: '/images/burger-mafia.webp',
    width: 900,
    height: 1147,
    acentoHex: '#EAB308',
    alt: 'Burger Mafia de Bilbo Burger con bacon, queso fundido y pepinillo frente a mural noir',
  },
  {
    id: 'italia',
    nombre: 'Italia',
    paisLabel: '04 · Trattoria callejera',
    ingredientes: 'Medallón a la brasa con mozzarella fundida.',
    imagen: '/images/burger-italia.webp',
    width: 800,
    height: 1000,
    acentoHex: '#22C55E',
    acentoSecundarioHex: '#EF4444',
    alt: 'Burger Italia de Bilbo Burger con mozzarella frente a mural tricolor verde, blanco y rojo',
  },
  {
    id: 'trufa',
    nombre: 'Trufa',
    paisLabel: '05 · Tierra y brasa',
    ingredientes: 'Medallón a la brasa con queso fundido y trufa.',
    imagen: '/images/burger-trufa.webp',
    width: 900,
    height: 1125,
    acentoHex: '#C27D38',
    alt: 'Burger Trufa de Bilbo Burger con queso fundido y crema de trufa sobre mural urbano',
  },
];

export const PICOTEO_ITEMS: PicoteoItem[] = [
  {
    id: 'pata-pork',
    nombre: 'Pata Pork',
    detalle: 'Patatas cargadas con pulled pork y jalapeños.',
    imagen: '/images/picoteo-pata-pork.webp',
    width: 600,
    height: 600,
    alt: 'Patatas Pata Pork de Bilbo Burger con pulled pork, salsa y jalapeños',
  },
  {
    id: 'nachos',
    nombre: 'Nachos',
    detalle: 'Nachos caseros con queso fundido, carne, jalapeños y guacamole.',
    imagen: '/images/picoteo-nachos.webp',
    width: 600,
    height: 600,
    alt: 'Nachos caseros de Bilbo Burger con queso fundido, jalapeños y guacamole',
  },
  {
    id: 'tequenos',
    nombre: 'Tequeños',
    detalle: 'Masa dorada crujiente rellena de queso fundido.',
    imagen: '/images/picoteo-tequenos.webp',
    width: 600,
    height: 600,
    alt: 'Tequeños crujientes rellenos de queso fundido de Bilbo Burger',
  },
  {
    id: 'fingers',
    nombre: 'Fingers de pollo',
    detalle: 'Tiras de pollo jugosas con rebozado crujiente.',
    imagen: '/images/picoteo-fingers.webp',
    width: 600,
    height: 600,
    alt: 'Fingers de pollo crujientes de Bilbo Burger',
  },
  {
    id: 'aros',
    nombre: 'Aros de cebolla',
    detalle: 'Crujientes por fuera, dulces y tiernos por dentro.',
    imagen: '/images/picoteo-aros.webp',
    width: 600,
    height: 600,
    alt: 'Aros de cebolla dorados de Bilbo Burger',
  },
  {
    id: 'croquetas',
    nombre: 'Croquetas',
    detalle: 'Cremosas de jamón (y también de txipirón en carta).',
    imagen: '/images/picoteo-croquetas.webp',
    width: 600,
    height: 600,
    alt: 'Croquetas caseras de jamón de Bilbo Burger',
  },
];

export const CONFIG_PASOS = [
  { id: 'pan', numero: '01', titulo: 'Pan', instruccion: 'Elige la base que lo aguanta todo' },
  { id: 'carne', numero: '02', titulo: 'Carne', instruccion: 'Al calor del carbón de encina' },
  { id: 'queso', numero: '03', titulo: 'Queso', instruccion: 'Fundido directo sobre la brasa' },
  { id: 'vegetales', numero: '04', titulo: 'Vegetales', instruccion: 'El contrapunto fresco (elige varios)' },
  { id: 'extras', numero: '05', titulo: 'Extras', instruccion: 'Sube el nivel si vienes con hambre' },
  { id: 'salsa', numero: '06', titulo: 'Salsa', instruccion: 'El remate final entre panes' },
] as const;

export const CONFIG_PANES: ConfigOpcion[] = [
  {
    id: 'brioche',
    nombre: 'Brioche',
    imagen: '/images/config/pan-brioche-top.webp',
    width: 560,
    height: 267,
    imagenBottom: '/images/config/pan-brioche-bottom.webp',
    bottomWidth: 560,
    bottomHeight: 183,
  },
  {
    id: 'patata',
    nombre: 'Pan de patata',
    todoConfirmar: true,
    imagen: '/images/config/pan-patata-top.webp',
    width: 560,
    height: 239,
    imagenBottom: '/images/config/pan-patata-bottom.webp',
    bottomWidth: 560,
    bottomHeight: 201,
  },
  {
    id: 'singluten',
    nombre: 'Sin gluten',
    todoConfirmar: true,
    imagen: '/images/config/pan-singluten-top.webp',
    width: 560,
    height: 253,
    imagenBottom: '/images/config/pan-singluten-bottom.webp',
    bottomWidth: 560,
    bottomHeight: 184,
  },
];

export const CONFIG_CARNES: ConfigOpcion[] = [
  {
    id: 'txuleta',
    nombre: 'Txuleta',
    imagen: '/images/config/carne-txuleta.webp',
    width: 560,
    height: 237,
  },
  {
    id: 'wagyu',
    nombre: 'Wagyu',
    imagen: '/images/config/carne-wagyu.webp',
    width: 560,
    height: 317,
  },
  {
    id: 'pollo',
    nombre: 'Pollo crispy',
    imagen: '/images/config/carne-pollo.webp',
    width: 560,
    height: 295,
  },
  {
    id: 'vegetal',
    nombre: 'Vegetal',
    imagen: '/images/config/carne-vegetal.webp',
    width: 560,
    height: 218,
  },
];

export const CONFIG_QUESOS: ConfigOpcion[] = [
  {
    id: 'cheddar',
    nombre: 'Cheddar',
    imagen: '/images/config/queso-cheddar.webp',
    width: 560,
    height: 497,
  },
  {
    id: 'mozzarella',
    nombre: 'Mozzarella',
    imagen: '/images/config/queso-mozzarella.webp',
    width: 560,
    height: 513,
  },
  {
    id: 'cabra',
    nombre: 'Queso de cabra',
    todoConfirmar: true,
    imagen: '/images/config/queso-cabra.webp',
    width: 560,
    height: 441,
  },
  {
    id: 'sin-queso',
    nombre: 'Sin queso',
  },
];

export const CONFIG_VEGETALES: ConfigOpcion[] = [
  {
    id: 'lechuga',
    nombre: 'Lechuga',
    imagen: '/images/config/veg-lechuga.webp',
    width: 560,
    height: 256,
  },
  {
    id: 'tomate',
    nombre: 'Tomate',
    imagen: '/images/config/veg-tomate.webp',
    width: 560,
    height: 232,
  },
  {
    id: 'cebolla',
    nombre: 'Cebolla roja',
    imagen: '/images/config/veg-cebolla.webp',
    width: 560,
    height: 258,
  },
  {
    id: 'pepinillo',
    nombre: 'Pepinillo',
    imagen: '/images/config/veg-pepinillo.webp',
    width: 560,
    height: 132,
  },
  {
    id: 'jalapeno',
    nombre: 'Jalapeño',
    imagen: '/images/config/veg-jalapeno.webp',
    width: 560,
    height: 484,
  },
];

export const CONFIG_EXTRAS: ConfigOpcion[] = [
  {
    id: 'bacon',
    nombre: 'Bacon',
    imagen: '/images/config/extra-bacon.webp',
    width: 560,
    height: 318,
  },
  {
    id: 'huevo',
    nombre: 'Huevo',
    imagen: '/images/config/extra-huevo.webp',
    width: 560,
    height: 310,
  },
  {
    id: 'cebolla-crujiente',
    nombre: 'Cebolla crujiente',
    imagen: '/images/config/extra-cebolla-crujiente.webp',
    width: 560,
    height: 275,
  },
];

export const CONFIG_SALSAS: ConfigOpcion[] = [
  {
    id: 'brava',
    nombre: 'Bilbo Brava',
    todoConfirmar: true,
    imagen: '/images/config/salsa-brava.webp',
    width: 560,
    height: 273,
  },
  {
    id: 'barbacoa',
    nombre: 'Barbacoa encina',
    todoConfirmar: true,
    imagen: '/images/config/salsa-barbacoa.webp',
    width: 560,
    height: 267,
  },
  {
    id: 'trufa',
    nombre: 'Crema de trufa',
    todoConfirmar: true,
    imagen: '/images/config/salsa-trufa.webp',
    width: 560,
    height: 343,
  },
  {
    id: 'sin-salsa',
    nombre: 'Sin salsa',
  },
];
