import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, CalendarCheck, ShoppingBag } from 'lucide-react';
import { BRAND_ASSETS } from '../data/brand';
import { useOrder } from '../context/OrderContext';
import { EmbersCanvas } from './EmbersCanvas';

const HERO_CITIES = ['BILBAO', 'ZARAGOZA', 'BURGOS'];

interface HeroSectionProps {
  loaderDone: boolean;
  onScrollToVitrina: () => void;
}

export function HeroSection({ loaderDone, onScrollToVitrina }: HeroSectionProps) {
  const { setIsCartOpen, setIsReserveOpen } = useOrder();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const cityRef = useRef<HTMLSpanElement>(null);
  const [cityIndex, setCityIndex] = useState(0);

  // Subtle mouse/touch parallax on background image (transform only)
  useEffect(() => {
    const el = sectionRef.current;
    const img = bgRef.current;
    if (!el || !img) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      targetX = nx * -18;
      targetY = ny * -14;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      img.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(1.08)`;
      rafId = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  // Masked line reveal once loader finishes
  useEffect(() => {
    if (!loaderDone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line-inner',
        { yPercent: 110, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loaderDone]);

  // City marquee switcher (BILBAO -> ZARAGOZA -> BURGOS)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      if (!cityRef.current) {
        setCityIndex((i) => (i + 1) % HERO_CITIES.length);
        return;
      }
      gsap.to(cityRef.current, {
        yPercent: -80,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setCityIndex((i) => (i + 1) % HERO_CITIES.length);
          if (cityRef.current) {
            gsap.fromTo(
              cityRef.current,
              { yPercent: 80, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power3.out' }
            );
          }
        },
      });
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[88svh] items-end overflow-hidden bg-black pb-16 pt-20 sm:pb-24"
    >
      {/* Background macro burger photography */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src={BRAND_ASSETS.heroMacro}
          alt="Hamburguesa gourmet de Baka Vieja recién salida de la plancha con cheddar fundido"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center opacity-75 will-change-transform"
          style={{ transform: 'scale(1.08)' }}
        />
        {/* Measured scrim for crisp 4.5:1+ contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35" />
        <div className="film-grain absolute inset-0 opacity-80" />
      </div>

      {/* Three.js lazy-loaded embers & subtle grill smoke */}
      <EmbersCanvas className="absolute inset-0 z-10" />

      {/* Main Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-4 text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#FFBC7D]">
            Bilbao · Zaragoza · Burgos · Desde 2019
          </p>

          <h1 className="font-display font-black uppercase leading-[0.94] tracking-tight text-white text-[clamp(2.4rem,6.5vw,5.4rem)]">
            <span className="line-mask">
              <span className="hero-line-inner line-inner">THE BEST</span>
            </span>
            <span className="line-mask">
              <span className="hero-line-inner line-inner">BURGER IN</span>
            </span>
            <span className="line-mask mt-1">
              <span
                ref={cityRef}
                className="hero-line-inner line-inner neon-text-gold inline-block"
              >
                {HERO_CITIES[cityIndex]}
              </span>
            </span>
          </h1>

          <p className="font-bambino mt-6 max-w-xl text-lg sm:text-2xl text-white/90">
            Especialistas en carne. Hamburguesas sin tonterías.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="magnetic-btn inline-flex h-12 items-center gap-2.5 rounded-lg bg-[#FFB547] px-7 text-sm font-bold uppercase tracking-wider text-black transition-colors duration-150 hover:bg-[#FFBC7D] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pide ahora</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReserveOpen(true)}
              className="magnetic-btn inline-flex h-12 items-center gap-2.5 rounded-lg border border-white/25 bg-black/55 px-7 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-150 hover:border-[#FFB547] hover:text-[#FFB547] whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Reserva mesa</span>
            </button>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onScrollToVitrina}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-[#FFB547]"
          >
            <ArrowDown className="h-4 w-4 text-[#FFB547]" />
            <span>Desliza</span>
          </button>
          <span className="hidden sm:inline text-xs text-white/50">
            Carne de primera · Patatas brutales · Nachos míticos
          </span>
        </div>
      </div>
    </section>
  );
}
