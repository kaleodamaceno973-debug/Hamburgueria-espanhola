import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Flame } from 'lucide-react';
import { BURGERS_CASA } from '../data/carta';
import { NEGOCIO } from '../data/negocio';

gsap.registerPlugin(ScrollTrigger);

interface WorldTourCarouselProps {
  reducedMotion: boolean;
  onOrderBurger: (burgerName: string) => void;
}

export default function WorldTourCarousel({
  reducedMotion,
  onOrderBurger,
}: WorldTourCarouselProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const total = BURGERS_CASA.length;
    const state = { index: 0 };
    let lastIndex = 0;

    const ctx = gsap.context(() => {
      const getTrackWidth = () => Math.max(track.scrollWidth - window.innerWidth, window.innerWidth * (total - 1));

      gsap.to(track, {
        xPercent: -((total - 1) / total) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getTrackWidth()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            state.index = self.progress * (total - 1);
            const rounded = Math.min(total - 1, Math.max(0, Math.round(state.index)));
            if (rounded !== lastIndex) {
              lastIndex = rounded;
              setActiveIndex(rounded);
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="vuelta-al-mundo"
      ref={sectionRef}
      aria-labelledby="vuelta-mundo-title"
      className={`relative w-full overflow-hidden bg-[#0B0B0B] ${
        reducedMotion ? 'py-16 sm:py-24' : 'h-[100svh]'
      }`}
    >
      {/* Top overlay header inside pinned carousel */}
      <div
        className={`${
          reducedMotion ? 'mb-8' : 'absolute top-5 left-0 right-0 z-20 sm:top-8'
        } mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6`}
      >
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
            Burgers de la casa
          </span>
          <h2
            id="vuelta-mundo-title"
            className="font-display text-2xl text-[#F5EFE6] sm:text-4xl"
          >
            La vuelta al mundo <span className="text-[#E9632D]">a la brasa</span>
          </h2>
        </div>

        {!reducedMotion && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#F5EFE6]/80 tabular-nums">
            {BURGERS_CASA.map((b, i) => (
              <span
                key={b.id}
                className={`px-2.5 py-1 rounded-full border transition-colors ${
                  activeIndex === i
                    ? 'border-[#E9632D] text-[#E9632D]'
                    : 'border-white/15 text-[#F5EFE6]/50'
                }`}
              >
                0{i + 1} · {b.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Horizontal Track */}
      <div
        ref={trackRef}
        className={
          reducedMotion
            ? 'mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6'
            : 'flex h-full will-change-transform'
        }
        style={reducedMotion ? undefined : { width: `${BURGERS_CASA.length * 100}%` }}
      >
        {BURGERS_CASA.map((burger, idx) => (
          <article
            key={burger.id}
            className={`relative flex flex-col justify-end overflow-hidden ${
              reducedMotion
                ? 'min-h-[460px] rounded-2xl border border-white/15'
                : 'h-full w-screen shrink-0 pt-24 pb-20 sm:pb-12'
            }`}
          >
            {/* Real mural + burger photo */}
            <img
              src={burger.imagen}
              alt={burger.alt}
              width={burger.width}
              height={burger.height}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* Measured contrast scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/65 to-[#0B0B0B]/40"
            />

            {/* Accent top border line */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-1.5"
              style={
                burger.acentoSecundarioHex
                  ? {
                      background: `linear-gradient(90deg, ${burger.acentoHex} 0%, #F5EFE6 50%, ${burger.acentoSecundarioHex} 100%)`,
                    }
                  : { backgroundColor: burger.acentoHex }
              }
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
              <div className="max-w-2xl">
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: burger.acentoHex }}
                >
                  {burger.paisLabel}
                </p>

                <h3 className="font-display mt-2 text-5xl leading-none text-[#F5EFE6] sm:text-7xl lg:text-8xl">
                  {burger.nombre}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#F5EFE6]/85 sm:text-lg">
                  {burger.ingredientes}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOrderBurger(burger.nombre)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E9632D] px-6 py-2.5 text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.03] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                  >
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    <span>Pídela</span>
                  </button>

                  <a
                    href={NEGOCIO.enlaces.cartaOnline}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 bg-[#0B0B0B]/70 px-6 py-2.5 text-sm font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                  >
                    <span>Ver en la carta</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
