import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import { CLASICOS_ITEMS, formatEuro } from '../data/menu';
import { useOrder } from '../context/OrderContext';
import { NeonCowSvg } from './NeonCowSvg';

gsap.registerPlugin(ScrollTrigger);

export function VitrinaNeon() {
  const { addToCart, setActiveProduct } = useOrder();
  const sectionRef = useRef<HTMLElement>(null);
  const cowRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Preload & decode all 7 Clásicos studio photos for instant scrub switching
  useEffect(() => {
    CLASICOS_ITEMS.forEach((item) => {
      if (!item.image) return;
      const img = new Image();
      img.src = item.image;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // ScrollTrigger pinned showcase (desktop & mobile, disabled on reduced motion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const state = { index: 0 };
    let lastIndex = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 5}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(state, {
        index: CLASICOS_ITEMS.length - 1,
        ease: 'none',
        onUpdate: () => {
          const nextIdx = Math.min(
            CLASICOS_ITEMS.length - 1,
            Math.max(0, Math.round(state.index))
          );
          if (progressRef.current) {
            const pct = state.index / (CLASICOS_ITEMS.length - 1);
            progressRef.current.style.transform = `scaleX(${Math.max(0.06, pct)})`;
          }
          if (nextIdx !== lastIndex) {
            lastIndex = nextIdx;
            setActiveIndex(nextIdx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Neon flicker & smooth image zoom whenever activeIndex changes
  useEffect(() => {
    if (reducedMotion) return;
    const cow = cowRef.current;
    const imgWrap = imageWrapRef.current;
    const textWrap = textWrapRef.current;
    if (!cow || !imgWrap || !textWrap) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(cow, { opacity: 0.35, duration: 0.05 })
        .to(cow, { opacity: 0.95, duration: 0.06 })
        .to(cow, { opacity: 0.5, duration: 0.05 })
        .to(cow, { opacity: 0.9, duration: 0.08 });

      gsap.fromTo(
        imgWrap,
        { opacity: 0.35, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.38, ease: 'power2.out' }
      );

      gsap.fromTo(
        textWrap.querySelectorAll('.vitrina-stagger'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [activeIndex, reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="vitrina"
        className="relative border-b border-white/10 bg-black py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              La vitrina de neón · 7 Clásicos
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Los 7 Clásicos de <span className="neon-text-gold">Baka Vieja</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CLASICOS_ITEMS.map((item, i) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b0b0c] p-5"
              >
                <div>
                  <div className="aspect-square overflow-hidden rounded-lg bg-black">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        width={600}
                        height={600}
                        className="studio-mask h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-xs tabular-nums text-white/45">
                    0{i + 1} / 0{CLASICOS_ITEMS.length}
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-black uppercase text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.ingredients}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="tabular-nums text-lg font-bold text-[#FFB547]">
                      {formatEuro(item.price)}
                    </p>
                    <p className="text-[11px] text-white/45">Precio orientativo</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) =>
                      addToCart(item, 1, '', { x: e.clientX, y: e.clientY })
                    }
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#FFB547] px-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#FFBC7D]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Añadir</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const current = CLASICOS_ITEMS[activeIndex] ?? CLASICOS_ITEMS[0];
  const ingredientTokens = current.ingredients
    .replace(/\.$/, '')
    .split(/,\s*|\s+y\s+/)
    .filter(Boolean);

  return (
    <section
      id="vitrina"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden border-b border-white/10 bg-black pt-28 pb-24 sm:py-16 lg:py-20"
      aria-label="La vitrina de neón — Clásicos Baka Vieja"
    >
      {/* Giant neon cow silhouette in background */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
        aria-hidden="true"
      >
        <NeonCowSvg
          ref={cowRef}
          idPrefix="vitrina-cow"
          strokeWidth={3.2}
          className="w-[82vw] max-w-[680px]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar of showcase */}
        <div className="mb-3 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-b border-white/10 pb-2 sm:pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              La vitrina de neón · Clásicos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display tabular-nums text-sm sm:text-base font-bold text-white">
              0{activeIndex + 1} <span className="text-white/35">/ 0{CLASICOS_ITEMS.length}</span>
            </span>
            <div className="h-[2px] w-28 sm:w-44 overflow-hidden bg-white/15">
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-[#FFB547] transition-transform duration-150"
                style={{ transform: `scaleX(${Math.max(0.08, activeIndex / (CLASICOS_ITEMS.length - 1))})` }}
              />
            </div>
          </div>
        </div>

        {/* Main 2-col stage: image top/left + details bottom/right */}
        <div className="grid items-center gap-3 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div
              ref={imageWrapRef}
              className="relative mx-auto aspect-square w-full max-w-[min(340px,30svh)] sm:max-w-[420px] lg:max-w-[500px]"
            >
              {current.image && (
                <img
                  src={current.image}
                  alt={`${current.name} — Burger clásica de Baka Vieja`}
                  width={900}
                  height={900}
                  className="studio-mask h-full w-full object-contain"
                />
              )}
            </div>
          </div>

          <div ref={textWrapRef} className="lg:col-span-6">
            <p className="vitrina-stagger text-xs font-medium uppercase tracking-[0.22em] text-[#FFBC7D]">
              Clásico 0{activeIndex + 1} · Receta oficial
            </p>

            <h2 className="vitrina-stagger font-display mt-2 text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.96] tracking-tight text-white">
              {current.name}
            </h2>

            {/* Ingredients revealed token by token */}
            <ul className="vitrina-stagger mt-2 sm:mt-5 flex flex-wrap gap-x-2 gap-y-1 text-[13px] sm:text-base text-white/80">
              {ingredientTokens.map((token, idx) => (
                <li key={`${current.id}-${idx}`} className="inline-flex items-center gap-2">
                  <span>{token}</span>
                  {idx < ingredientTokens.length - 1 && (
                    <span aria-hidden="true" className="text-[#FFB547]/60">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="vitrina-stagger mt-3 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-6 border-t border-white/10 pt-3 sm:pt-6">
              <div>
                <p className="font-display tabular-nums text-3xl font-black text-[#FFB547]">
                  {formatEuro(current.price)}
                </p>
                <p className="text-[11px] text-white/45">Precio orientativo</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) =>
                    addToCart(current, 1, '', { x: e.clientX, y: e.clientY })
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#FFB547] px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-colors duration-150 hover:bg-[#FFBC7D] active:scale-95 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProduct(current)}
                  className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 text-xs sm:text-sm font-semibold text-white transition-colors hover:border-[#FFB547] hover:text-[#FFB547] whitespace-nowrap"
                >
                  Ver ficha
                </button>
              </div>
            </div>

            {/* Interactive step selector */}
            <div className="mt-6 hidden sm:flex flex-wrap items-center gap-2">
              {CLASICOS_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-9 min-w-[2.25rem] rounded-md px-2.5 text-xs font-bold tabular-nums transition-colors ${
                    idx === activeIndex
                      ? 'bg-[#FFB547] text-black'
                      : 'border border-white/15 bg-white/[0.03] text-white/65 hover:border-white/35 hover:text-white'
                  }`}
                  aria-label={`Ver ${item.name}`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
