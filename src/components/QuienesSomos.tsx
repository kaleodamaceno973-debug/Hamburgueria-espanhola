import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT_DATA, BRAND_ASSETS, GALLERY_ITEMS, LOCATIONS } from '../data/brand';

gsap.registerPlugin(ScrollTrigger);

export function QuienesSomos() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Draw neon timeline line on scroll
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.bv-timeline',
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        });
      }

      // Light up timeline nodes
      gsap.from('.bv-timeline-node', {
        opacity: 0.25,
        y: 16,
        stagger: 0.15,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.bv-timeline',
          start: 'top 75%',
        },
      });

      // Subtle parallax on gallery columns (transform only)
      gsap.utils.toArray<HTMLElement>('.bv-gallery-parallax').forEach((el, idx) => {
        const offset = idx % 2 === 0 ? -24 : 24;
        gsap.fromTo(
          el,
          { y: -offset },
          {
            y: offset,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10 bg-[#050506] py-24 sm:py-32"
    >
      {/* Subtle atmospheric grill backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <img
          src={BRAND_ASSETS.bannerGrill}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/65 to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Story split */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              Quiénes somos
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl font-black uppercase leading-[0.98] tracking-tight text-white text-balance">
              Especialistas en carne.{' '}
              <span className="neon-text-gold">Sin tonterías.</span>
            </h2>
            <p className="font-bambino mt-6 text-lg sm:text-2xl leading-relaxed text-white/90">
              {ABOUT_DATA.lead}
            </p>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/70">
              {ABOUT_DATA.body}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
              <img
                src={BRAND_ASSETS.bannerCheese}
                alt="Cheddar fundido sobre carne de primera en Baka Vieja"
                width={960}
                height={540}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="mt-14 grid gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
          {ABOUT_DATA.metrics.map((m) => (
            <div key={m.value}>
              <p className="font-display tabular-nums text-3xl sm:text-4xl font-black text-[#FFB547]">
                {m.value}
              </p>
              <p className="mt-1.5 text-sm text-white/70">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Animated Neon Timeline: 2019 Bilbao -> Zaragoza -> Burgos */}
        <div className="bv-timeline relative mt-16">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-display text-lg sm:text-xl font-black uppercase tracking-wide text-white">
              De Abando al norte
            </h3>
            <span className="text-xs uppercase tracking-[0.2em] text-white/45">
              2019 — Actualidad
            </span>
          </div>

          <div className="relative">
            {/* Desktop horizontal neon line */}
            <svg
              className="pointer-events-none absolute top-4 left-0 hidden h-4 w-full md:block"
              viewBox="0 0 1000 16"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="40"
                y1="8"
                x2="960"
                y2="8"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
              />
              <line
                ref={lineRef}
                x1="40"
                y1="8"
                x2="960"
                y2="8"
                stroke="#FFB547"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="grid gap-8 md:grid-cols-3">
              {LOCATIONS.map((loc) => (
                <div key={loc.id} className="bv-timeline-node relative pt-0 md:pt-10">
                  <div
                    className="mb-3 hidden h-3 w-3 rounded-full border-2 border-[#FFB547] bg-black md:block md:absolute md:top-2.5 md:left-0"
                    aria-hidden="true"
                  />
                  <p className="font-display tabular-nums text-2xl font-black text-[#FFB547]">
                    {loc.yearOpened}
                  </p>
                  <p className="font-display mt-1 text-xl font-bold uppercase text-white">
                    {loc.city}
                  </p>
                  <p className="mt-1 text-sm text-white/65">
                    {loc.address} · {loc.postalAndCity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parallax Photo Gallery */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item, idx) => (
            <figure
              key={item.src}
              className={`bv-gallery-parallax group overflow-hidden rounded-xl border border-white/10 bg-black will-change-transform ${
                idx === 2 || idx === 5 ? 'sm:translate-y-4' : ''
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <figcaption className="border-t border-white/10 px-4 py-3 text-xs font-medium text-white/75">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
