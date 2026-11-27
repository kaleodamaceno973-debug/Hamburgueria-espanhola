export type CategoriaId = 'raciones' | 'cuadrilla' | 'hamburguesas';

export type BaseCuadrilla = 'Patatas' | 'Totopos';
export type SaborCroqueta = 'Jamón' | 'Txipirón' | 'Calamar' | 'Txistorra';

export interface ProductoCarta {
  id: string;
  categoria: CategoriaId;
  nombre: string;
  descripcion: string;
  precio: number;
  destacado?: boolean;
  fraseDestacado?: string;
  imagen: string;
  width: number;
  height: number;
  imagenReal: boolean;
  /** Permite elegir entre Patatas y Totopos */
  eligeBase?: boolean;
  /** Sabores disponibles (Croquetas) */
  sabores?: readonly SaborCroqueta[];
  /** Extra de +1 € patatas crujientes (Hamburguesas) */
  extraPatatasPrecio?: number;
  /** Ingredientes desglosados para el recorrido interactivo y ficha */
  ingredientes?: string[];
  /** Nota interna para confirmar con el cliente */
  todoNota?: string;
}

export const CATEGORIAS_META: Record<
  CategoriaId,
  { id: CategoriaId; titulo: string; subtitulo: string }
> = {
  raciones: {
    id: 'raciones',
    titulo: 'Raciones',
    subtitulo: 'De barra bilbaína, recién fritas y al centro de la mesa.',
  },
  cuadrilla: {
    id: 'cuadrilla',
    titulo: 'Cuadrilla',
    subtitulo: "Pa' compartir con la cuadrilla. Elige base de patatas o totopos en nuestras especiales.",
  },
  hamburguesas: {
    id: 'hamburguesas',
    titulo: 'Hamburguesas',
    subtitulo: 'En nuestras Smash Fat Burger, la carne es la que manda y eso se nota.',
  },
};

export const CARTA_ITEMS: ProductoCarta[] = [
  // RACIONES
  {
    id: 'rabas',
    categoria: 'raciones',
    nombre: 'Rabas',
    descripcion: 'Calamares rebozados al estilo del norte, crujientes y ligeros.',
    precio: 9.0,
    destacado: true,
    fraseDestacado: 'Las estrellas de la casa',
    imagen: '/images/racion-rabas.webp',
    width: 400,
    height: 600,
    imagenReal: true,
    ingredientes: ['Calamar del norte', 'Rebozado crujiente y ligero', 'Limón fresco'],
  },
  {
    id: 'pimientos-pais',
    categoria: 'raciones',
    nombre: 'Pimientos de País (12 uni.)',
    descripcion: 'Los auténticos, fritos con mimo y al punto de sal.',
    precio: 5.5,
    imagen: '/images/racion-pimientos-pais.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    ingredientes: ['12 pimientos del país', 'Fritos al punto', 'Sal en escamas'],
  },
  {
    id: 'croquetas',
    categoria: 'raciones',
    nombre: 'Croquetas (6 uni.)',
    descripcion: 'Hechas a mano. Elige entre jamón, txipirón, calamar y txistorra.',
    precio: 6.0,
    imagen: '/images/racion-croquetas.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    sabores: ['Jamón', 'Txipirón', 'Calamar', 'Txistorra'],
    ingredientes: ['6 unidades artesanas', 'Bechamel cremosa', 'Rebozado dorado'],
  },
  {
    id: 'tabla-queso',
    categoria: 'raciones',
    nombre: 'Tabla de Queso',
    descripcion: 'Selección de quesos',
    precio: 15.0,
    imagen: '/images/racion-tabla-queso.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    todoNota: 'TODO: confirmar variedad y descripción exacta de quesos con el cliente.',
    ingredientes: ['Selección de quesos', 'Corte de taberna'],
  },

  // CUADRILLA (patatas para compartir)
  {
    id: 'baserritarras',
    categoria: 'cuadrilla',
    nombre: 'Baserritarras',
    descripcion: 'Cubierta de crema de queso Idiazabal con pimientos del país. Elige tu base: patatas o totopos.',
    precio: 8.0,
    destacado: true,
    fraseDestacado: 'Idiazabal y pimientos del país',
    imagen: '/images/patatas-baserritarras.webp',
    width: 400,
    height: 400,
    imagenReal: true,
    eligeBase: true,
    ingredientes: ['Base de patatas o totopos', 'Crema de queso Idiazabal', 'Pimientos del país'],
  },
  {
    id: 'gamberras',
    categoria: 'cuadrilla',
    nombre: 'Gamberras',
    descripcion: 'Baño de crema de queso cheddar con topping de bacon crujiente. Elige tu base: patatas o totopos.',
    precio: 8.0,
    imagen: '/images/patatas-gamberras.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    eligeBase: true,
    ingredientes: ['Base de patatas o totopos', 'Baño de crema de queso cheddar', 'Topping de bacon crujiente'],
  },
  {
    id: 'canallas',
    categoria: 'cuadrilla',
    nombre: 'Canallas',
    descripcion: 'Cubiertas de carne picada, guacamole con pico de gallo y nata agria. Elige tu base: patatas o totopos.',
    precio: 12.0,
    imagen: '/images/patatas-canallas.webp',
    width: 960,
    height: 640,
    imagenReal: true,
    eligeBase: true,
    ingredientes: ['Base de patatas o totopos', 'Carne picada', 'Guacamole con pico de gallo', 'Nata agria'],
  },
  {
    id: 'patatas-bravas',
    categoria: 'cuadrilla',
    nombre: 'Patatas Bravas',
    descripcion: 'Cubiertas de nuestra única salsa brava.',
    precio: 6.5,
    imagen: '/images/patatas-bravas.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    ingredientes: ['Patatas fritas al punto', 'Nuestra única salsa brava'],
  },
  {
    id: 'patatas-huevos-rotos',
    categoria: 'cuadrilla',
    nombre: 'Patatas Huevos Rotos',
    descripcion: 'Cubiertas de huevos rotos y jamón ibérico.',
    precio: 6.5,
    imagen: '/images/patatas-huevos-rotos.webp',
    width: 800,
    height: 800,
    imagenReal: true,
    ingredientes: ['Patatas fritas', 'Huevos rotos', 'Jamón ibérico'],
  },
  {
    id: 'patatas-alioli',
    categoria: 'cuadrilla',
    nombre: 'Patatas Fritas con Alioli',
    descripcion: 'Crujientes por fuera, tiernas por dentro. Acompañadas de salsa alioli.',
    precio: 5.5,
    imagen: '/images/patatas-alioli.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    ingredientes: ['Patatas fritas crujientes', 'Salsa alioli'],
  },
  {
    id: 'tequenos',
    categoria: 'cuadrilla',
    nombre: 'Tequeños (6 uni.)',
    descripcion: 'Palitos de masa de maíz rellenos con auténtico queso fresco.',
    precio: 8.5,
    imagen: '/images/racion-tequenos.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    ingredientes: ['6 palitos de masa de maíz', 'Auténtico queso fresco'],
  },
  {
    id: 'torreznos',
    categoria: 'cuadrilla',
    nombre: 'Torreznos (6 uni.)',
    descripcion: 'Cocinados 36 horas para lograr una textura tierna y sabrosa.',
    precio: 12.0,
    destacado: true,
    fraseDestacado: 'Cocinados 36 horas',
    imagen: '/images/racion-torreznos.webp',
    width: 800,
    height: 1200,
    imagenReal: true,
    ingredientes: ['6 torreznos', 'Cocción lenta de 36 horas', 'Corteza crujiente y centro tierno'],
  },

  // NUESTRAS HAMBURGUESAS
  {
    id: 'emmy-kutxi',
    categoria: 'hamburguesas',
    nombre: 'Emmy Kutxi',
    descripcion: 'Doble carne de 90 g, queso cheddar, panceta caramelizada y salsa Emmy (picante suave).',
    precio: 12.5,
    imagen: '/images/burger-emmy-kutxi.webp',
    width: 400,
    height: 400,
    imagenReal: true,
    extraPatatasPrecio: 1.0,
    ingredientes: ['Doble carne de 90 g', 'Queso cheddar', 'Panceta caramelizada', 'Salsa Emmy (picante suave)'],
  },
  {
    id: 'la-kruntxi',
    categoria: 'hamburguesas',
    nombre: 'La Kruntxi',
    descripcion: 'Doble carne de 90 g, crema de queso cheddar, bacon crujiente, cebolla encurtida y mayonesa.',
    precio: 12.5,
    imagen: '/images/burger-la-kruntxi.webp',
    width: 800,
    height: 800,
    imagenReal: false,
    extraPatatasPrecio: 1.0,
    ingredientes: ['Doble carne de 90 g', 'Crema de queso cheddar', 'Bacon crujiente', 'Cebolla encurtida', 'Mayonesa'],
  },
];

export interface OpcionesSeleccionadas {
  base?: BaseCuadrilla;
  sabor?: SaborCroqueta;
  conPatatas?: boolean;
}

export function getProductoById(id: string): ProductoCarta | undefined {
  return CARTA_ITEMS.find((p) => p.id === id);
}

/**
 * Recalcula el precio unitario directamente desde la carta oficial.
 */
export function calcularPrecioUnitario(
  productoId: string,
  opciones: OpcionesSeleccionadas = {}
): number {
  const producto = getProductoById(productoId);
  if (!producto) return 0;
  let total = producto.precio;
  if (producto.extraPatatasPrecio && opciones.conPatatas) {
    total += producto.extraPatatasPrecio;
  }
  return Math.round(total * 100) / 100;
}

export const ITEMS_ELIGE_TU_BASE = ['baserritarras', 'gamberras', 'canallas'].map((id) => {
  const item = getProductoById(id)!;
  return item;
});
