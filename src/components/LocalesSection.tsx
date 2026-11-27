import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarCheck, ExternalLink, MapPin } from 'lucide-react';
import { LOCATIONS } from '../data/brand';
import { useOrder } from '../context/OrderContext';

gsap.registerPlugin(ScrollTrigger);

export function LocalesSection() {
  const { selectedCity, setSelectedCity } = useOrder();
  const sectionRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const path = routeRef.current;
    if (!path) return;

    const ctx = gsap.context(() => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.bv-north-map',
          start: 'top 80%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeLocation = LOCATIONS.find((l) => l.id === selectedCity) ?? LOCATIONS[0];

  return (
    <section
      id="locales"
      ref={sectionRef}
      className="relative border-b border-white/10 bg-[#050506] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top selector */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              Nuestros locales
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Bilbao · Zaragoza · <span className="neon-text-gold">Burgos</span>
            </h2>
          </div>

          {/* Global City Selector */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black p-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedCity(loc.id)}
                className={`h-10 rounded-md px-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCity === loc.id
                    ? 'bg-[#FFB547] text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {loc.city}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Location Cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {LOCATIONS.map((loc) => {
            const isSelected = loc.id === selectedCity;
            return (
              <article
                key={loc.id}
                onClick={() => setSelectedCity(loc.id)}
                className={`group cursor-pointer overflow-hidden rounded-xl border transition-colors duration-150 ${
                  isSelected
                    ? 'border-[#FFB547] bg-[#0e0d0a]'
                    : 'border-white/10 bg-black hover:border-white/25'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={loc.image}
                    alt={loc.imageAlt}
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{loc.badge}</span>
                    {isSelected && (
                      <span className="font-bold uppercase tracking-wider text-[#FFB547]">
                        Seleccionado
                      </span>
                    )}
                  </div>

                  <h3 className="font-display mt-2 text-2xl font-black uppercase text-white">
                    Baka Vieja {loc.city}
                  </h3>

                  <p className="mt-2 flex items-start gap-2 text-sm text-white/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB547]" />
                    <span>
                      {loc.address} · {loc.postalAndCity}
                    </span>
                  </p>

                  {/* TODO: confirmar con Baka Vieja horarios y teléfonos de cada local */}

                  <div
                    className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={loc.reservationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-4 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D] whitespace-nowrap"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      <span>Reservar</span>
                    </a>

                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-white/20 px-4 text-xs font-semibold text-white transition-colors hover:border-[#FFB547] hover:text-[#FFB547] whitespace-nowrap"
                    >
                      <span>Cómo llegar</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Illustrated SVG Map of Northern Spain connecting Bilbao · Burgos · Zaragoza */}
        <div className="bv-north-map mt-12 rounded-xl border border-white/10 bg-black p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#FFB547]">
                Ruta norte Baka Vieja
              </p>
              <h3 className="font-display mt-2 text-2xl sm:text-3xl font-black uppercase text-white">
                Local activo: <span className="text-[#FFB547]">{activeLocation.city}</span>
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {activeLocation.address} · {activeLocation.postalAndCity}
              </p>
              <p className="mt-3 text-xs text-white/45">
                Tu ciudad seleccionada se sincroniza automáticamente con las reservas y el pedido directo por WhatsApp.
              </p>
            </div>

            <div className="lg:col-span-7">
              <svg
                viewBox="0 0 600 300"
                className="w-full h-auto"
                role="img"
                aria-label="Mapa ilustrado del norte de España conectando Bilbao, Burgos y Zaragoza"
              >
                {/* Stylized Northern Iberia coast & Ebro corridor silhouette */}
                <path
                  d="M40 95 Q115 88 180 96 Q245 104 310 98 Q390 112 465 130 Q525 148 565 180 L555 268 L45 268 Z"
                  fill="#0b0b0c"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                />
                {/* Subtle grid lines */}
                <line x1="45" y1="160" x2="555" y2="160" stroke="rgba(255,255,255,0.05)" />
                <line x1="200" y1="90" x2="200" y2="268" stroke="rgba(255,255,255,0.05)" />
                <line x1="380" y1="100" x2="380" y2="268" stroke="rgba(255,255,255,0.05)" />

                {/* Base muted path Bilbao -> Burgos -> Zaragoza */}
                <path
                  d="M235 120 L185 205 L405 215"
                  fill="none"
                  stroke="rgba(255, 181, 71, 0.2)"
                  strokeWidth="2.5"
                  strokeDasharray="4 6"
                />

                {/* Neon path animated on scroll */}
                <path
                  ref={routeRef}
                  d="M235 120 L185 205 L405 215"
                  fill="none"
                  stroke="#FFB547"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="neon-svg-gold"
                />

                {/* City markers */}
                {LOCATIONS.map((loc) => {
                  const active = loc.id === selectedCity;
                  return (
                    <g
                      key={loc.id}
                      onClick={() => setSelectedCity(loc.id)}
                      className="cursor-pointer"
                    >
                      {active && (
                        <circle
                          cx={loc.svgCoords.x}
                          cy={loc.svgCoords.y}
                          r="18"
                          fill="rgba(255, 181, 71, 0.16)"
                          stroke="#FFB547"
                          strokeWidth="1.2"
                        />
                      )}
                      <circle
                        cx={loc.svgCoords.x}
                        cy={loc.svgCoords.y}
                        r={active ? 7 : 5}
                        fill={active ? '#F2E23A' : '#FFB547'}
                      />
                      <text
                        x={loc.svgCoords.x + 14}
                        y={loc.svgCoords.y + 5}
                        fill={active ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                        fontSize="14"
                        fontWeight={active ? '800' : '600'}
                        fontFamily="Rubik, sans-serif"
                      >
                        {loc.city.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
