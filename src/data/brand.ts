export const WHATSAPP_NUMBER = '+34600000000';
export const AGENCY_NAME = 'Kal Digital Solutions';

export const ONLINE_ORDER_URL = 'https://www.ambigumarket.com/client/baka-vieja';
export const INSTAGRAM_URL = 'https://www.instagram.com/bakaviejaburgershop/';
export const JOBS_URL = 'https://bakavieja.com/trabaja/';

export type CityId = 'bilbao' | 'zaragoza' | 'burgos';

export interface StoreLocation {
  id: CityId;
  city: string;
  badge: string;
  address: string;
  postalAndCity: string;
  reservationUrl: string;
  mapsUrl: string;
  image: string;
  imageAlt: string;
  svgCoords: { x: number; y: number };
  yearOpened: string;
  /* TODO: confirmar con Baka Vieja */
  hours?: string;
  phone?: string;
}

export const LOCATIONS: StoreLocation[] = [
  {
    id: 'bilbao',
    city: 'Bilbao',
    badge: 'La original · Desde 2019',
    address: 'C. María Díaz de Haro, 1',
    postalAndCity: 'Abando · 48013 Bilbao',
    reservationUrl: 'https://bakavieja.myrestoo.net/',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C.+Mar%C3%ADa+D%C3%ADaz+de+Haro+1+48013+Bilbao',
    image: '/assets/aistudio/local-neon-1_859f632f.jpg',
    imageAlt: 'Letrero de neón amarillo Butchered like Butter en el local de Baka Vieja Bilbao',
    svgCoords: { x: 235, y: 120 },
    yearOpened: '2019',
  },
  {
    id: 'zaragoza',
    city: 'Zaragoza',
    badge: 'Centro',
    address: 'C. de Eduardo Dato, 4',
    postalAndCity: '50005 Zaragoza',
    reservationUrl: 'https://bakavieja-zaragoza.myrestoo.net/',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C.+de+Eduardo+Dato+4+50005+Zaragoza',
    image: '/assets/aistudio/local-salon_40832b25.jpg',
    imageAlt: 'Salón interior y cocina vista de Baka Vieja Burger Shop en Zaragoza',
    svgCoords: { x: 405, y: 215 },
    yearOpened: '2022',
  },
  {
    id: 'burgos',
    city: 'Burgos',
    badge: 'Centro histórico',
    address: 'C. Puente Gasset, 4',
    postalAndCity: '09004 Burgos',
    reservationUrl: 'https://bakavieja-burgos.myrestoo.net/',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C.+Puente+Gasset+4+09004+Burgos',
    image: '/assets/aistudio/local-neon-2_9bc835e3.jpg',
    imageAlt: 'Detalle de neón amarillo en el local de Baka Vieja Burger Shop en Burgos',
    svgCoords: { x: 185, y: 205 },
    yearOpened: '2024',
  },
];

export const BRAND_ASSETS = {
  logoWhite: '/assets/aistudio/logo-bakavieja-blanco_0f97298f.png',
  logoText: '/assets/aistudio/logo-bakavieja-texto_55164c61.png',
  cowIcon: '/assets/aistudio/icono-vaca_b19d153f.png',
  heroMacro: '/assets/aistudio/hero-burger-macro_a5880d83.jpg',
  bannerCheese: '/assets/aistudio/banner-queso-fundido_51cb5f3d.jpg',
  bannerGrill: '/assets/aistudio/banner-parrilla_a03f9c92.jpg',
  eventsTruck: '/assets/aistudio/eventos-food-truck_a14673f4.jpg',
};

export const ABOUT_DATA = {
  headline: 'Especialistas en carne. Hamburguesas sin tonterías.',
  lead: 'Desde Bilbao (2019) hasta Zaragoza y Burgos, en Baka Vieja hacemos hamburguesas sin tonterías: carne de primera, recetas potentes y sabor que se recuerda.',
  body: 'Nos conocen por nuestras burgers gourmet, unas patatas brutales y unos nachos que ya son míticos. Trabajamos con ingredientes premium y opciones para todos: veganas, sin gluten y para peques. Si te flipan las hamburguesas de verdad, este es tu sitio.',
  metrics: [
    { value: '3', label: 'Ciudades · Bilbao, Zaragoza y Burgos' },
    { value: '2019', label: 'El año en que encendimos la plancha en Abando' },
    { value: '100%', label: 'Carne de primera picada cada día' },
  ],
};

export const EVENTS_DATA = {
  headline: 'Estar donde vibra la gente',
  lead: 'Llevamos nuestra energía, nuestro estilo y nuestras hamburguesas brutales a cualquier evento.',
  types: [
    { id: 'competiciones', label: 'Competiciones de hamburguesas' },
    { id: 'foodtrucks', label: 'Food trucks, food parks y ferias' },
    { id: 'festivales', label: 'Conciertos y festivales' },
    { id: 'fiestas', label: 'Fiestas populares' },
    { id: 'corporativos', label: 'Eventos corporativos' },
    { id: 'catering', label: 'Catering y experiencias privadas' },
  ],
  pillars: [
    'Formato versátil: stand, food truck o carpa profesional.',
    'Producción ágil con ingredientes frescos y cocina en vivo.',
    'Equipo profesional con experiencia en alta rotación.',
    'Apoyo en redes sociales para aumentar la visibilidad.',
  ],
};

export const GALLERY_ITEMS = [
  {
    src: '/assets/aistudio/galeria-burger-neon-1_6ae9cc63.jpg',
    alt: 'Burger de Baka Vieja bañada en cheddar fundido con la vaca de neón al fondo',
    caption: 'Cheddar fundido bajo el neón dorado',
  },
  {
    src: '/assets/aistudio/galeria-burger-neon-2_aa76c7ee.jpg',
    alt: 'Doble burger con bacon crujiente frente al neón de Baka Vieja',
    caption: 'Doble carne y plancha al rojo',
  },
  {
    src: '/assets/aistudio/galeria-mano-burger_1451b4c8.jpg',
    alt: 'Manos sujetando una burger jugosa de Baka Vieja con cheddar fundido',
    caption: 'Sin cubiertos. Sin tonterías.',
  },
  {
    src: '/assets/aistudio/ambiente-cerveza-tirador_8519af99.jpg',
    alt: 'Cerveza artesanal recién tirada de grifo en Baka Vieja',
    caption: 'Tirador bien frío para acompañar',
  },
  {
    src: '/assets/aistudio/ambiente-mesa-compartir_7c72b8d4.jpg',
    alt: 'Mesa compartida en Baka Vieja con burgers, nachos, pollo búfalo y patatas',
    caption: 'Mesa llena: nachos, alitas y burgers',
  },
  {
    src: '/assets/aistudio/galeria-shake_df29fdf3.jpg',
    alt: 'Postre helado de Baka Vieja con caramelo salado y barquillos',
    caption: 'Final dulce con marca de la casa',
  },
];
