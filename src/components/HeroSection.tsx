import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Flame } from 'lucide-react';
import { NEGOCIO } from '../data/negocio';

gsap.registerPlugin(ScrollTrigger);

const EmberParticlesCanvas = lazy(() => import('./EmberParticlesCanvas'));

interface HeroSectionProps {
  reducedMotion: boolean;
  onOpenOrder: () => void;
}

export default function HeroSection({ reducedMotion, onOpenOrder }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const titleLinesRef = useRef<HTMLDivElement | null>(null);
  const [mountParticles, setMountParticles] = useState(false);

  // Defer Three.js dynamic chunk until after first paint
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setTimeout(() => setMountParticles(true), 250);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  // Line mask reveal + scroll parallax + mouse/touch subtle parallax
  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgImgRef.current;
    const linesWrap = titleLinesRef.current;
    if (!hero || !bg || !linesWrap) return;

    if (reducedMotion) {
      gsap.set(linesWrap.querySelectorAll('.line-inner'), { yPercent: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const lines = linesWrap.querySelectorAll('.line-inner');
      gsap.fromTo(
        lines,
        { yPercent: 110, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
        }
      );

      gsap.fromTo(
        bg,
        { scale: 1.06, yPercent: 0 },
        {
          scale: 1.14,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, heroRef);

    // Subtle pointer / touch parallax via quickTo
    const xTo = gsap.quickTo(bg, 'x', { duration: 0.5, ease: 'power2.out' });
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * -18;
      xTo(nx);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0B0B0B] pb-16 pt-24 sm:items-center sm:pb-20 sm:pt-28"
    >
      {/* Background real hero burger photo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          ref={bgImgRef}
          src="/images/hero-burger.webp"
          alt="Hamburguesa artesanal a la brasa de Bilbo Burger con queso fundido y pan brioche"
          width={900}
          height={880}
          fetchPriority="high"
          className="h-full w-full object-cover object-center opacity-85"
          style={{ willChange: 'transform' }}
        />
        {/* Measured scrim for WCAG AA contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/65 to-[#0B0B0B]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/95 via-[#0B0B0B]/55 to-transparent"
        />
      </div>

      {/* Three.js rising ember sparks (dynamic chunk after paint) */}
      {mountParticles && !reducedMotion && (
        <Suspense fallback={null}>
          <EmberParticlesCanvas />
        </Suspense>
      )}

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#FFB23F] uppercase sm:text-sm">
              {NEGOCIO.textos.heroEyebrow}
            </p>

            <h1
              ref={titleLinesRef}
              className="font-display mt-4 text-[clamp(2.35rem,7.8vw,5.4rem)] leading-[0.95] text-[#F5EFE6]"
            >
              <span className="line-mask">
                <span className="line-inner">{NEGOCIO.textos.heroLinea1}</span>
              </span>
              <span className="line-mask mt-1">
                <span className="line-inner text-[#E9632D]">{NEGOCIO.textos.heroLinea2}</span>
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#F5EFE6]/85 sm:text-lg">
              {NEGOCIO.textos.heroSubtitulo}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenOrder}
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#E9632D] px-8 py-3 text-sm font-bold tracking-wide text-[#0B0B0B] uppercase transition-transform duration-150 hover:scale-[1.03] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                <span>Pide online</span>
              </button>

              <a
                href={NEGOCIO.enlaces.reservas}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-white/30 bg-[#0B0B0B]/70 px-7 py-3 text-sm font-semibold text-[#F5EFE6] transition-colors duration-150 hover:border-[#E9632D] hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Reserva mesa</span>
              </a>
            </div>
          </div>

          {/* Rotating double-ellipse seal stamp */}
          <div className="hidden lg:col-span-3 lg:flex lg:justify-end">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="animate-stamp-spin h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="stamp-circle-path"
                    d="M 80, 80 m -58, 0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
                  />
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="none"
                  stroke="#E9632D"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                />
                <text
                  fill="#F5EFE6"
                  fontSize="10.2"
                  fontWeight="700"
                  letterSpacing="3.1"
                >
                  <textPath href="#stamp-circle-path" startOffset="0%">
                    SIN SMASH · CARBÓN DE ENCINA · DESDE 2014 ·
                  </textPath>
                </text>
              </svg>
              <div className="seal-ellipse absolute flex h-16 w-16 items-center justify-center bg-[#0B0B0B]/85 text-center">
                <span className="font-display text-xs leading-tight text-[#E9632D]">
                  2014
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
