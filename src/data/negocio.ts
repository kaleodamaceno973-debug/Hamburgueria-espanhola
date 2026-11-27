export const PROPUESTA_CONFIG = {
  /** Nombre de la agencia que presenta esta propuesta (editable aquí) */
  agenciaNombre: 'Kal Digital Solutions',
  mostrarBannerPropuesta: true,
} as const;

/**
 * NÚMERO DE WHATSAPP DE DEMO PARA RECIBIR PEDIDOS DE PRUEBA.
 * Importante: nunca usar el teléfono real del bar (+34 688 923 513) para pedidos de demo.
 */
export const WHATSAPP_NUMBER = '34600000000';
export const WHATSAPP_DISPLAY = '+34 600 000 000';

export interface DiaHorario {
  /** 0 = Domingo, 1 = Lunes, ... 6 = Sábado (estándar JS Date.getDay) */
  dayIndex: number;
  dia: string;
  corto: string;
  abierto: boolean;
  /** Minutos desde 00:00 */
  aperturaMin?: number;
  cierreMin?: number;
  texto: string;
}

export const HORARIO_SEMANAL: DiaHorario[] = [
  { dayIndex: 1, dia: 'Lunes', corto: 'Lun', abierto: true, aperturaMin: 9 * 60, cierreMin: 22 * 60, texto: '9:00 – 22:00' },
  { dayIndex: 2, dia: 'Martes', corto: 'Mar', abierto: false, texto: 'CERRADO' },
  { dayIndex: 3, dia: 'Miércoles', corto: 'Mié', abierto: true, aperturaMin: 9 * 60, cierreMin: 22 * 60, texto: '9:00 – 22:00' },
  { dayIndex: 4, dia: 'Jueves', corto: 'Jue', abierto: true, aperturaMin: 9 * 60, cierreMin: 22 * 60, texto: '9:00 – 22:00' },
  { dayIndex: 5, dia: 'Viernes', corto: 'Vie', abierto: true, aperturaMin: 9 * 60, cierreMin: 22 * 60, texto: '9:00 – 22:00' },
  { dayIndex: 6, dia: 'Sábado', corto: 'Sáb', abierto: true, aperturaMin: 12 * 60, cierreMin: 24 * 60, texto: '12:00 – 24:00' },
  { dayIndex: 0, dia: 'Domingo', corto: 'Dom', abierto: true, aperturaMin: 12 * 60, cierreMin: 17 * 60, texto: '12:00 – 17:00' },
];

export const NEGOCIO = {
  nombre: 'jeyma',
  nombreDisplay: 'JEYMA',
  slogan: 'Las mejores rabas y patatas fritas de Bilbao.',
  subtituloHero: "Raciones, patatas pa' la cuadrilla y Smash Fat Burgers en Pérez Galdós 33.",
  direccion: 'Pérez Galdós 33, 48010 Bilbao',
  calle: 'Pérez Galdós 33',
  cpCiudad: '48010 Bilbao · Indautxu',
  geo: {
    lat: 43.2597481,
    lng: -2.9458667,
  },
  telefono: '+34 688 923 513',
  telefonoHref: 'tel:+34688923513',
  email: 'jeymabar@gmail.com',
  emailHref: 'mailto:jeymabar@gmail.com',
  instagramUrl: 'https://www.instagram.com/muyjeyma',
  instagramHandle: '@muyjeyma',
  reservasUrl: 'https://reservation.dish.co/widget/hydra-2f39a98e-1d78-45ab-b831-064867813d04',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Perez%20Galdos%2033%2C%2048010%20Bilbao',
  servicios: [
    { id: 'terraza', nombre: 'Terraza', detalle: 'Pa’ tomar el sol o el txikito fuera' },
    { id: 'llevar', nombre: 'Para llevar', detalle: 'Recoge tu pedido recién hecho en barra' },
    { id: 'wifi', nombre: 'Wifi gratis', detalle: 'Para la cuadrilla o un café tranquilo' },
    { id: 'mascotas', nombre: 'Se permiten mascotas', detalle: 'Tu perro también es bienvenido' },
  ],
  pagos: ['Efectivo', 'Tarjeta', 'Contactless (Visa, Mastercard, Amex, Maestro)'],
  fraseCuadrilla: 'En Bilbao no se queda a tomar algo: se queda en el Jeyma pa’ empezar bien la ronda.',
} as const;

export const TODOS_CLIENTE = [
  'Pedir el logotipo original en formato vectorial (.svg / .ai / .pdf) para sustituir la vectorización.',
  'Confirmar con el cliente la descripción real de la «Tabla de Queso» (la carta original repite por error la descripción de los Pimientos de País).',
  'Confirmar carta de bebidas, postres y alérgenos oficiales (no informados en la carta actual).',
  'Sustituir el número de WhatsApp de demo (+34 600 000 000) por el definitivo si deciden activar pedidos por WhatsApp.',
  'Sustituir las 8 fotografías de platos generadas por IA (y og.jpg) por fotografías reales de sesión en el bar (ver PROMPTS-FOTOS.md).',
] as const;

const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuro(value: number): string {
  return eurFormatter.format(value);
}

export interface EstadoHorario {
  abiertoAhora: boolean;
  etiqueta: 'Abierto ahora' | 'Cerrado';
  hoyIndex: number;
  hoyNombre: string;
  detalleHoy: string;
  horaMadrid: string;
  minutosAhora: number;
}

const WEEKDAY_MAP: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6,
};

export function getEstadoHorarioMadrid(date: Date = new Date()): EstadoHorario {
  const parts = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const weekdayStr = (parts.find((p) => p.type === 'weekday')?.value || 'lunes').toLowerCase();
  const hourStr = parts.find((p) => p.type === 'hour')?.value || '12';
  const minuteStr = parts.find((p) => p.type === 'minute')?.value || '00';

  const hoyIndex = WEEKDAY_MAP[weekdayStr] ?? 1;
  const hour = Number(hourStr) === 24 ? 0 : Number(hourStr);
  const minute = Number(minuteStr);
  const minutosAhora = hour * 60 + minute;

  const infoHoy = HORARIO_SEMANAL.find((d) => d.dayIndex === hoyIndex) ?? HORARIO_SEMANAL[0];

  const abiertoAhora = Boolean(
    infoHoy.abierto &&
      infoHoy.aperturaMin !== undefined &&
      infoHoy.cierreMin !== undefined &&
      minutosAhora >= infoHoy.aperturaMin &&
      minutosAhora < infoHoy.cierreMin
  );

  return {
    abiertoAhora,
    etiqueta: abiertoAhora ? 'Abierto ahora' : 'Cerrado',
    hoyIndex,
    hoyNombre: infoHoy.dia,
    detalleHoy: infoHoy.abierto ? `Hoy ${infoHoy.texto}` : 'Hoy martes cerrado',
    horaMadrid: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    minutosAhora,
  };
}

export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
