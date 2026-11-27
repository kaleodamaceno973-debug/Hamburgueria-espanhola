import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { NEGOCIO } from '../data/negocio';

gsap.registerPlugin(ScrollTrigger);

interface HistoriaLocalSectionProps {
  reducedMotion: boolean;
}

const HITOS = [
  {
    anio: '2014',
    lugar: 'Irala',
    detalle:
      'Empezamos en Irala con una pequeña plancha sobre el fuego y una sartén para freír huevos. Con eso empezó todo.',
  },
  {
    anio: 'Hoy',
    lugar: 'Ibarrekolanda (Deusto)',
    detalle:
      'Celestino María del Arenal Plaza, 4 (encima del BM), junto al metro de Sarriko. Brasa de encina, murales y neón.',
  },
  {
    anio: 'Hoy',
    lugar: 'Santutxu',
    detalle:
      'Nuestra segunda tienda en Bilbao. Mismo producto, fuego real y cero cuentos.',
  },
];

export default function HistoriaLocalSection({ reducedMotion }: HistoriaLocalSectionProps) {
  const historiaRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const localRef = useRef<HTMLElement | null>(null);
  const localImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const hEl = historiaRef.current;
    const lLine = lineRef.current;
    const locEl = localRef.current;
    const locImg = localImgRef.current;

    const ctx = gsap.context(() => {
      if (hEl && lLine) {
        gsap.fromTo(
          lLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: hEl,
              start: 'top 65%',
              end: 'bottom 70%',
              scrub: 0.5,
            },
          }
        );
      }

      if (locEl && locImg) {
        gsap.fromTo(
          locImg,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: locEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      {/* 8. Historia (2014 -> hoy) */}
      <section
        id="historia"
        ref={historiaRef}
        aria-labelledby="historia-title"
        className="relative border-t border-white/10 bg-[#0B0B0B] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
                Desde 2014
              </span>
              <h2
                id="historia-title"
                className="font-display mt-2 text-4xl leading-tight text-[#F5EFE6] sm:text-5xl"
              >
                Nacido en Bilbao, <span className="text-[#E9632D]">criado entre brasas.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#F5EFE6]/80">
                {NEGOCIO.textos.historia}
              </p>

              {/* Counters */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-2xl text-[#E9632D] tabular-nums sm:text-3xl">
                    2014
                  </p>
                  <p className="mt-1 text-xs text-[#F5EFE6]/65">En Bilbao desde</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-[#F5EFE6] tabular-nums sm:text-3xl">
                    2
                  </p>
                  <p className="mt-1 text-xs text-[#F5EFE6]/65">Locales en la villa</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-[#FFB23F] tabular-nums sm:text-3xl">
                    100%
                  </p>
                  <p className="mt-1 text-xs text-[#F5EFE6]/65">Carbón de encina</p>
                </div>
              </div>
            </div>

            {/* Animated ember timeline */}
            <div className="relative pl-8 sm:pl-10 lg:col-span-7">
              <div
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-3 w-0.5 bg-white/10"
              />
              <div
                ref={lineRef}
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-3 w-0.5 bg-gradient-to-b from-[#FFB23F] via-[#E9632D] to-[#FF3B2E]"
              />

              <div className="space-y-8">
                {HITOS.map((hito) => (
                  <div
                    key={hito.lugar}
                    className="relative rounded-2xl border border-white/10 bg-[#121212] p-6"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-7 -left-[29px] h-3.5 w-3.5 rounded-full border-2 border-[#0B0B0B] bg-[#E9632D] sm:-left-[37px]"
                    />
                    <div className="flex items-center gap-3 text-xs font-bold tracking-wider text-[#E9632D] uppercase tabular-nums">
                      <span>{hito.anio}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#F5EFE6]">{hito.lugar}</span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#F5EFE6]/80 sm:text-base">
                      {hito.detalle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. El local */}
      <section
        id="el-local"
        ref={localRef}
        aria-labelledby="el-local-title"
        className="relative border-t border-white/10 bg-[#0E0E0E] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Real interior photo with parallax */}
            <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 lg:col-span-5 lg:min-h-[540px]">
              <img
                ref={localImgRef}
                src="/images/local-ibarrekolanda.webp"
                alt="Interior del local de Bilbo Burger en Ibarrekolanda con neón de la marca y mesas"
                width={739}
                height={1600}
                loading="lazy"
                decoding="async"
                className="h-[112%] w-full object-cover object-center"
                style={{ willChange: 'transform' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent"
              />
              <p className="absolute bottom-4 left-4 right-4 text-xs font-medium tracking-wider text-[#F5EFE6]/90 uppercase">
                Ibarrekolanda · Junto al metro de Sarriko
              </p>
            </div>

            {/* Locations info */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
                El local
              </span>
              <h2
                id="el-local-title"
                className="font-display mt-2 text-4xl leading-tight text-[#F5EFE6] sm:text-5xl"
              >
                Esto pasa en <span className="text-[#E9632D]">Ibarrekolanda.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#F5EFE6]/80 sm:text-lg">
                {NEGOCIO.textos.localTexto}
              </p>

              {/* Ibarrekolanda Card */}
              <div className="mt-8 rounded-2xl border border-[#E9632D]/35 bg-[#141414] p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-2xl text-[#F5EFE6]">
                    {NEGOCIO.locales[0].nombre}
                  </h3>
                  <span className="text-xs font-semibold text-[#FFB23F]">
                    {NEGOCIO.locales[0].referenciaMetro}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#F5EFE6]/80">
                  {NEGOCIO.locales[0].direccion}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={NEGOCIO.enlaces.googleMapsIbarrekolanda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E9632D] px-6 py-2 text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>Cómo llegar</span>
                  </a>

                  <a
                    href={NEGOCIO.enlaces.reservas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-6 py-2 text-sm font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                  >
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>Reserva mesa</span>
                  </a>

                  <a
                    href={NEGOCIO.enlaces.googleMapsIbarrekolanda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-[#F5EFE6]/85 transition-colors hover:border-[#FFB23F] hover:text-[#FFB23F] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                  >
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>Ver horario en Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Santutxu Card (TODO address) */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#121212] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl text-[#F5EFE6]">
                    {NEGOCIO.locales[1].nombre}
                  </h3>
                  <span className="text-xs text-[#F5EFE6]/55">
                    Segundo local en Bilbao
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[#F5EFE6]/70">
                  {NEGOCIO.locales[1].direccion}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-[#E9632D]">
                  <a href={NEGOCIO.telefonoHref} className="hover:underline">
                    Tel: {NEGOCIO.telefono}
                  </a>
                  <a
                    href={NEGOCIO.enlaces.reservas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Reservar mesa →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
