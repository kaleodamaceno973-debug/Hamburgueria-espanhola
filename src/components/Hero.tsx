import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, ArrowRight } from 'lucide-react';
import { NEGOCIO, getEstadoHorarioMadrid } from '../data/negocio';
import { useCart } from './CartContext';
import { TentacleCorner } from './JeymaBrand';

interface HeroProps {
  ready: boolean;
}

export const Hero: React.FC<HeroProps> = ({ ready }) => {
  const { openCart } = useCart();
  const sectionRef = useRef<HTMLElement | null>(null);
  const photoWrapRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const leftTentaclePathRef = useRef<SVGPathElement | null>(null);
  const rightTentaclePathRef = useRef<SVGPathElement | null>(null);

  const estado = useMemo(() => getEstadoHorarioMadrid(), []);

  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Títulos revelados por máscara: yPercent 110 -> 0 siempre con y: 0
      const lines = [line1Ref.current, line2Ref.current].filter(Boolean);
      gsap.fromTo(
        lines,
        { yPercent: 110, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.85,
          stagger: 0.11,
          ease: 'power3.out',
        }
      );

      // Dos tentáculos SVG desenrollándose desde las esquinas
      const paths = [leftTentaclePathRef.current, rightTentaclePathRef.current].filter(
        (p): p is SVGPathElement => Boolean(p)
      );
      paths.forEach((p, idx) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            delay: 0.15 + idx * 0.12,
            ease: 'power2.out',
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Parallax GPU por mouse y toque sobre la fotografía principal
  useEffect(() => {
    const section = sectionRef.current;
    const target = photoWrapRef.current;
    if (!section || !target) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      target.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(1.04)`;
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * -18;
      targetY = ny * -14;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    section.addEventListener('pointermove', handlePointerMove, { passive: true });
    section.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative overflow-hidden paper-green border-b border-[#A8873A]/35 min-h-[calc(100svh-5rem)] flex items-center"
    >
      {/* Marco fino dorado inspirado en la carta oficial */}
      <div
        className="pointer-events-none absolute inset-3 sm:inset-5 border border-[#A8873A]/40"
        aria-hidden="true"
      />

      {/* Dos tentáculos SVG desde los bordes */}
      <TentacleCorner
        pathRef={leftTentaclePathRef}
        className="pointer-events-none absolute -top-4 -left-4 w-44 sm:w-64 h-auto opacity-85"
        color="#F3EADC"
        glowColor="rgba(168,135,58,0.22)"
      />
      <TentacleCorner
        pathRef={rightTentaclePathRef}
        flip
        className="pointer-events-none absolute -bottom-4 -right-4 w-44 sm:w-64 h-auto opacity-85 rotate-180"
        color="#A8873A"
        glowColor="rgba(243,234,220,0.16)"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Columna izquierda: Titular editorial + CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <p className="text-xs sm:text-sm tracking-[0.14em] uppercase text-[#A8873A] font-semibold mb-4">
            Pérez Galdós 33 · Indautxu, Bilbao
          </p>

          <h1 className="font-display font-extrabold text-[#F3EADC] leading-[0.98] tracking-[-0.02em] text-[clamp(2.35rem,7.2vw,4.75rem)] max-w-2xl [text-wrap:balance]">
            <span className="line-mask">
              <span ref={line1Ref} className="line-inner">
                Las mejores rabas
              </span>
            </span>
            <span className="line-mask text-[#F3EADC]/95">
              <span ref={line2Ref} className="line-inner">
                y patatas de Bilbao.
              </span>
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#F3EADC]/85 max-w-[54ch] leading-relaxed">
            {NEGOCIO.subtituloHero}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-lg bg-[#F3EADC] text-[#1F4A2E] hover:bg-[#FAF5EC] font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8873A]"
            >
              <span>Pide ahora</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href={NEGOCIO.reservasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg border border-[#A8873A] text-[#F3EADC] hover:bg-[#A8873A]/15 font-medium text-sm sm:text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8873A]"
            >
              <Calendar className="w-4 h-4 text-[#A8873A]" aria-hidden="true" />
              <span>Reserva mesa</span>
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#F3EADC]/75">
            <span>Terraza</span>
            <span aria-hidden="true" className="text-[#A8873A]">·</span>
            <span>Para llevar</span>
            <span aria-hidden="true" className="text-[#A8873A]">·</span>
            <span>Se permiten mascotas</span>
          </div>
        </div>

        {/* Columna derecha: Fotografía gigante de racion-rabas.webp con parallax y sello giratorio */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[2/3] rounded-2xl overflow-hidden border border-[#A8873A]/50 bg-[#0b130e]">
            <div
              ref={photoWrapRef}
              className="w-full h-full will-change-transform"
              style={{ transform: 'translate3d(0px, 0px, 0) scale(1.04)' }}
            >
              <img
                src="/images/racion-rabas.webp"
                alt="Ración de rabas crujientes al estilo del norte con limón fresco en JEYMA Bilbao"
                width={400}
                height={600}
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gradiente medido en el borde inferior para la leyenda */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#F3EADC]">
              <div>
                <p className="font-display text-lg font-bold leading-tight">Rabas del norte</p>
                <p className="text-xs text-[#F3EADC]/80">Estrella de la casa</p>
              </div>
              <span className="font-display text-lg font-bold text-[#F3EADC] tabular-nums">
                9,00 €
              </span>
            </div>
          </div>

          {/* Sello giratorio Abierto ahora / Cerrado (horario real Madrid) */}
          <div
            className="absolute -bottom-4 -left-2 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#14321F] border border-[#A8873A] flex items-center justify-center shadow-lg select-none"
            aria-label={`Estado actual del local: ${estado.etiqueta}. ${estado.detalleHoy}`}
          >
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full animate-spin-seal"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="jeyma-seal-circle"
                  d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                />
              </defs>
              <text
                fill="#F3EADC"
                fontSize="10.2"
                fontWeight="600"
                letterSpacing="2.2"
              >
                <textPath href="#jeyma-seal-circle" startOffset="0%">
                  {estado.abiertoAhora
                    ? 'ABIERTO AHORA · BILBAO · '
                    : 'CERRADO AHORA · BILBAO · '}
                  {estado.abiertoAhora ? 'ABIERTO · ' : 'CERRADO · '}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider leading-tight ${
                  estado.abiertoAhora ? 'text-[#F3EADC]' : 'text-[#A8873A]'
                }`}
              >
                {estado.abiertoAhora ? 'Abierto' : 'Cerrado'}
              </span>
              <span className="text-[10px] text-[#F3EADC]/75 tabular-nums mt-0.5">
                {estado.horaMadrid}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
