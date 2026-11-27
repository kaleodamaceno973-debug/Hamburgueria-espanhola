import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import { LIMITED_ITEMS, formatEuro } from '../data/menu';
import { useOrder } from '../context/OrderContext';
import { NeonCowSvg } from './NeonCowSvg';

export function LimitedDrop() {
  const { addToCart, setActiveProduct } = useOrder();
  const tagRef = useRef<HTMLSpanElement>(null);

  // Realistic neon flicker on LIMITED tag (opacity only)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = tagRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ repeat: -1, repeatDelay: 3.8 })
        .to(el, { opacity: 0.25, duration: 0.06 })
        .to(el, { opacity: 1, duration: 0.06 })
        .to(el, { opacity: 0.45, duration: 0.06 })
        .to(el, { opacity: 1, duration: 0.1 });
    });

    return () => ctx.revert();
  }, []);

  const handleTilt = (e: React.PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-2px)`;
  };

  const resetTilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section
      id="limited"
      className="relative overflow-hidden border-b border-white/10 bg-[#050506] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span
                ref={tagRef}
                className="font-display text-xs font-black uppercase tracking-[0.28em] neon-text-yellow"
              >
                LIMITED EDITION
              </span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/55">
                Drop actual en plancha
              </span>
            </div>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Ediciones <span className="neon-text-gold">Limitadas</span>
            </h2>
          </div>

          <p className="font-bambino max-w-sm text-sm sm:text-base text-white/75">
            Recetas brutales por tiempo limitado. Cuando se acaban, vuelan.
          </p>
        </div>

        {/* Touch-friendly horizontal snap carousel on mobile, 4-col stage on lg */}
        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {LIMITED_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
              className="group relative flex w-[82vw] max-w-[330px] shrink-0 snap-start flex-col justify-between rounded-xl border border-white/10 bg-black p-5 transition-transform duration-200 will-change-transform lg:w-auto lg:max-w-none"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="tabular-nums font-semibold">DROP 0{idx + 1}</span>
                  <span className="font-bold uppercase tracking-wider text-[#F2E23A]">
                    Limited
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProduct(item)}
                  className="mt-3 block w-full aspect-square overflow-hidden rounded-lg bg-black focus-visible:outline-none"
                  aria-label={`Ver detalles de ${item.name}`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={`${item.name} — Limited Edition Baka Vieja`}
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="studio-mask h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-[#FFB547]/25 bg-[#0b0b0c] p-6 text-center">
                      <NeonCowSvg idPrefix={`lim-${item.id}`} className="w-28 opacity-85" />
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB547]">
                        Foto próximamente
                      </p>
                    </div>
                  )}
                </button>

                <h3 className="font-display mt-4 text-2xl font-black uppercase tracking-tight text-white">
                  {item.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">
                  {item.ingredients}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-display tabular-nums text-xl font-black text-[#FFB547]">
                    {formatEuro(item.price)}
                  </p>
                  <p className="text-[11px] text-white/45">Precio orientativo</p>
                </div>

                <button
                  type="button"
                  onClick={(e) =>
                    addToCart(item, 1, '', { x: e.clientX, y: e.clientY })
                  }
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#FFB547] px-4 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D] active:scale-95 whitespace-nowrap"
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
