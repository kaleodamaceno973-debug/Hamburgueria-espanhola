export const NEGOCIO = {
  marca: 'Bilbo Burger',
  razonSocial: 'BILBOBURGER S.L.',
  agenciaPropuesta: 'Kal Digital Solutions',
  telefono: '+34 946 57 57 45',
  telefonoHref: 'tel:+34946575745',
  email: 'bilboburger@bilboburger.com',
  emailHref: 'mailto:bilboburger@bilboburger.com',
  enlaces: {
    pedidoOnline: 'https://pedidos.delitbee.shop/bilboburger',
    cartaOnline:
      'https://carta.delitbee.shop/bilboburger?store=debc1846-ce66-4ea7-a343-cf32f6203f71',
    reservas:
      'https://bookings.last.app/ac2c5e84-6ba7-4b08-ba2f-714a635be4e0/booking',
    googleMapsIbarrekolanda:
      'https://www.google.com/maps?cid=16774921788404279622',
    instagram: 'https://www.instagram.com/bilboburger/',
    facebook: 'https://www.facebook.com/bilboburger/',
    webActual: 'https://bilboburger.com/',
    avisoLegal: 'https://bilboburger.com/aviso-legal/',
    privacidad: 'https://bilboburger.com/politica-de-privacidad/',
    cookies: 'https://bilboburger.com/politica-de-cookies/',
  },
  textos: {
    heroEyebrow: 'Burgers a la brasa en Bilbao · Sin postureo.',
    heroLinea1: 'Bilbao huele mejor',
    heroLinea2: 'desde que existimos.',
    heroSubtitulo:
      'Aquí no hacemos smash: hacemos burgers con cuerpo, punto y mordida. Carne de verdad, carbón de encina y todo el sabor que cabe entre dos panes.',
    historia:
      'Bilbao, 2014. Empezamos en Irala con una pequeña plancha sobre el fuego y una sartén para freír huevos. Con eso empezó todo. Hoy estamos en Ibarrekolanda y Santutxu, pero seguimos cocinando con la misma idea: buen producto, brasa real y cero cuentos.',
    diferencia:
      'Aquí no hacemos smash. Hacemos burgers con cuerpo. Medallón, punto y mordida. Txuleta, wagyu, pollo crispy o vegetal. Tú eliges la carne. Nosotros la tratamos como merece: al calor del carbón de encina. Sabor a brasa de verdad. Sin filtros.',
    personalizacionTitulo: 'Tu burger. Tus reglas.',
    personalizacionTexto:
      'Elige el pan, la carne, el queso, los vegetales, los extras y la salsa. La montamos desde cero. No tiene que llevar de todo. Tiene que llevar lo que tú quieres.',
    picoteoTexto:
      'No todo va entre panes. Patatas solas o cargadas, nachos, tequeños, fingers, aros de cebolla y croquetas. Y si todavía te queda sitio, prueba nuestros postres. Si no te queda, tendrás que volver.',
    localTexto:
      'Esto pasa en Ibarrekolanda. Brasa, burgers, música y un local al que se viene con hambre. El postureo lo dejamos fuera.',
    pedidosTitulo: 'Tienes hambre. Nosotros tenemos fuego.',
    pedidosSubtitulo: 'Misma hambre. Camino más directo.',
    lemas: [
      'No burger · No party',
      'Nacido en Bilbao, criado entre brasas.',
      'Burgers con carácter. Sabor sin filtros.',
    ],
    instagramCallout: 'Lo que sale de nuestra cocina no se esconde.',
    avisoReparto:
      'El repartidor, una vez llegado al destino, esperará 5 minutos, tocará el timbre y llamará al teléfono aportado por el cliente. Pasado ese tiempo devolverá el pedido al local. Para volver a enviar el pedido deberás pagar de nuevo el envío (6,50 €). Si no deseas un nuevo envío, tendrás que venir a recogerlo al local. No se hará ninguna devolución en caso de no venir a por el pedido.',
  },
  locales: [
    {
      id: 'ibarrekolanda',
      nombre: 'Ibarrekolanda (Deusto)',
      direccion:
        'Celestino María del Arenal Plaza, 4 (encima del supermercado BM), 48015 Bilbao',
      referenciaMetro: 'Junto al metro de Sarriko',
      mapsUrl: 'https://www.google.com/maps?cid=16774921788404279622',
      confirmado: true,
    },
    {
      id: 'santutxu',
      nombre: 'Santutxu',
      // TODO: Confirmar dirección exacta y enlace de Google Maps de Santutxu con el cliente
      direccion: 'Segundo local en Bilbao · Dirección exacta disponible por teléfono o en carta online',
      referenciaMetro: 'Zona Santutxu, Bilbao',
      mapsUrl: null,
      confirmado: false,
    },
  ],
  resenaDestacada: {
    autor: 'Ane Robles',
    fecha: 'marzo de 2024',
    estrellas: 5,
    texto:
      'Me lo habían recomendado y la experiencia ha sido del 200%. Buen ambiente, buena música, calidad extraordinaria con una buena variedad de carnes, cocinado a las brasas con carbón. Probamos tres hamburguesas diferentes y a cada cual más rica. Los nachos caseros de quitarse el sombrero y las croquetas de txipirón espectaculares. Y el remate final fue la tarta de queso al horno, todo un espectáculo.',
  },
  faqs: [
    {
      id: 'faq-smash',
      pregunta: '¿Por qué no hacéis burgers smash?',
      respuesta:
        'Aquí no hacemos smash. Hacemos burgers con cuerpo: medallón grueso, punto exacto y mordida real, cocinadas al calor del carbón de encina para conseguir sabor a brasa de verdad, sin filtros.',
    },
    {
      id: 'faq-carnes',
      pregunta: '¿Qué tipos de carne puedo elegir?',
      respuesta:
        'Trabajamos con cuatro bases: txuleta, wagyu, pollo crispy o burger vegetal. Puedes pedir nuestras burgers de la casa o montar la tuya desde cero en Hazla tuya.',
    },
    {
      id: 'faq-locales',
      pregunta: '¿Dónde están los locales y cuál es el horario?',
      respuesta:
        'Nuestro local de Ibarrekolanda (Deusto) está en Celestino María del Arenal Plaza, 4 (encima del supermercado BM), 48015 Bilbao, junto al metro de Sarriko. También tenemos segundo local en Santutxu. Para ver el horario actualizado, pulsa "Ver horario en Google Maps".',
    },
    {
      id: 'faq-pedido',
      pregunta: '¿Cómo funciona el pedido online y el reparto?',
      respuesta:
        'Pides directo en nuestra tienda online sin comisiones de terceros. Al llegar, el repartidor espera 5 minutos tocando el timbre y llamando al teléfono indicado; pasado ese tiempo el pedido vuelve al local (un segundo envío tiene un coste de 6,50 € o puedes recogerlo en el local).',
    },
    {
      id: 'faq-reservas',
      pregunta: '¿Se puede reservar mesa?',
      respuesta:
        'Sí. Puedes reservar mesa directamente desde el botón "Reserva mesa" (Last.app) o llamándonos al +34 946 57 57 45 para venir con tu cuadrilla.',
    },
    {
      id: 'faq-picoteo',
      pregunta: '¿Qué tenéis de picoteo y postres?',
      respuesta:
        'Patatas solas o cargadas (como las Pata Pork con pulled pork), nachos caseros, tequeños, fingers de pollo, aros de cebolla y croquetas. Y si te queda hueco, tarta de queso al horno.',
    },
  ],
} as const;
