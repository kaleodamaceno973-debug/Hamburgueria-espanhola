# Inventario de activos visuales y TODOs — Baka Vieja Burger Shop

## 1. Activos reales del cliente (integrados desde `/public/assets/aistudio/`)

### Logotipos e identidad
- `logo-bakavieja-blanco_0f97298f.png` — Logotipo oficial blanco (vaca + texto) sobre fondo oscuro.
- `logo-bakavieja-texto_55164c61.png` — Logotipo tipográfico sin icono.
- `icono-vaca_b19d153f.png` — Cabeza de vaca estilizada para favicon y cursor.

### Carta — Clásicos (7)
- `burger-cheese-burger_a5981471.jpg` → Cheese Burger
- `burger-cheddar-melt_066eed6a.jpg` → Cheddar Melt
- `burger-emmylia-pig_51409b91.jpg` → Emmylia Pig
- `burger-bendita-bacon-jelly_535308a8.jpg` → Bendita Bacon Jelly
- `burger-cheddar-booomb_787c0136.jpg` → Cheddar Booomb
- `burger-bacon-arce_ef069d40.jpg` → Bacon Arce 2.0
- `burger-antzarrak-72_736b276b.jpg` → Antzarrak 72

### Carta — Limited Edition (4)
- `burger-juicy-beef_d18415dc.jpg` → Juicy Beef
- `burger-random_03da92ee.jpg` → Random
- **The Frank** → Sin fotografía real disponible. Se muestra la silueta oficial de la vaca en neón dorado con el aviso `"Foto próximamente"`.
- `burger-yakiniku_e60a5926.jpg` → Yakiniku

### Carta — Vegana
- `burger-vegana-cheese_01fab898.jpg` → Cheese Burger Vegan

### Carta — Entrantes (8)
- `entrante-nachos_4dcad6a8.jpg` → Nachos (y Nachos Veganos)
- `entrante-pulled-nachos_d5ec0f75.jpg` → Pulled Nachos
- `entrante-patatas-especiadas_e04a29d3.jpg` → Patatas Especiadas (y Patatas Especiadas Vegan)
- `entrante-patatas-belgas_f03ca5b9.jpg` → Patatas Belgas
- `entrante-sweet-bufalo-chicken_2d817e48.jpg` → Sweet Búfalo Chicken
- `entrante-txerris-fries_509a7590.jpg` → Txerris Fries

### Carta — Postres (3)
- `postre-spetaculos_df3c6224.jpg` → ¡Spetaculos!
- `postre-pleasetacho_a8eda8b1.jpg` → Pleasetacho
- `postre-lady-paloma-sunday_e454cc16.jpg` → Lady Paloma Sunday

### Hero, ambiente, locales y eventos
- `hero-burger-macro_a5880d83.jpg` → Hero principal
- `banner-queso-fundido_51cb5f3d.jpg` · `banner-parrilla_a03f9c92.jpg` → Fondos de historia/proceso
- `galeria-burger-neon-1_6ae9cc63.jpg` · `galeria-burger-neon-2_aa76c7ee.jpg` · `galeria-burger-neon-3_2d705f16.jpg` · `galeria-burger-4_cc099d68.jpg` · `galeria-burger-crispy_f9de3d69.jpg` · `galeria-mano-burger_1451b4c8.jpg` · `galeria-shake_df29fdf3.jpg` · `ambiente-cerveza-tirador_8519af99.jpg` · `ambiente-mesa-compartir_7c72b8d4.jpg` → Galería parallax
- `local-neon-1_859f632f.jpg` · `local-salon_40832b25.jpg` · `local-neon-2_9bc835e3.jpg` → Tarjetas de locales (Bilbao, Zaragoza, Burgos)
- `eventos-food-truck_a14673f4.jpg` → Sección Eventos

### Imagen generada con Gemini (solo Open Graph)
- `/src/assets/images/og_bakavieja_1795788097500.jpg` — Tarjeta Open Graph 16:9 combinando `burger-cheddar-booomb` sobre fondo negro con el logotipo blanco y las tres ciudades.

---

## 2. Lista de TODOs para confirmar con Baka Vieja antes de publicar
1. **Precios definitivos (`PRECIOS_DEMO`)**: El sitio web actual no publica precios. Los importes actuales en `src/data/menu.ts` son orientativos para España y muestran la etiqueta `"Precio orientativo"`. Confirmar PVP exacto de Ambigu / local.
2. **Horarios y teléfonos de los 3 locales**: Pendiente confirmar horario de apertura/cierre y teléfono público de Bilbao, Zaragoza y Burgos (por ahora ocultos).
3. **Fotografía de "The Frank"**: Realizar foto de estudio con reflejo de neón dorado para reemplazar el marcador `"Foto próximamente"`.
4. **Alérgenos por producto**: Completar ficha oficial de alérgenos (gluten, lácteos, huevo, frutos secos, soja, sésamo, mostaza).
5. **Suplementos y pan sin gluten**: La estructura en el modal de producto está preparada y comentada (`TODO`); confirmar coste de carne extra, bacon extra y pan sin gluten.
6. **Fuente oficial Bambino Light (`fuente-Bambino-Light.ttf`)**: No se incluyó el archivo TTF en los adjuntos; actualmente se sustituye tipográficamente con DM Sans Light Italic. Añadir `@font-face` al recibir el archivo con licencia.
7. **Número de WhatsApp comercial y agencia**: Reemplazar `WHATSAPP_NUMBER` y `AGENCY_NAME` en `src/data/brand.ts` antes de pasar a producción y retirar `<meta name="robots" content="noindex, nofollow">`.
