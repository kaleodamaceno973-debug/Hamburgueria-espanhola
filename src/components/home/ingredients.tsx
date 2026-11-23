"use client";

import { useRef } from "react";
import { Beef, Carrot, Wheat, Milk } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";

const ITEMS = [
  { icon: Beef, title: "100% bovino", text: "Costela + acém moídos todos os dias." },
  { icon: Carrot, title: "Vegetais frescos", text: "Hortifrúti local entregue toda manhã." },
  { icon: Wheat, title: "Pão artesanal", text: "Brioche de fermentação natural." },
  { icon: Milk, title: "Queijo de verdade", text: "Cheddar e prato de laticínios parceiros." },
];

/** Linha SVG que se desenha com o scroll conectando os ingredientes. */
export function Ingredients() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const path = ref.current?.querySelector<SVGPathElement>("[data-draw]");
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: true },
        });
      }
      gsap.from("[data-ing]", {
        y: 60,
        autoAlpha: 0,
        rotate: (i) => (i % 2 ? 6 : -6),
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="ing-title" className="relative overflow-hidden border-y border-white/10 bg-[#0e0b08] py-20 sm:py-24">
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">Ingredientes de qualidade</p>
          <h2 id="ing-title" className="font-display text-[clamp(2.2rem,6vw,4rem)]">
            <span className="slant">Fresco. Local. <span className="text-gradient-ember">Premium.</span></span>
          </h2>
          <p className="mt-4 text-muted-foreground">Usamos ingredientes frescos de produtores locais sempre que possível. Sem congelados, sem atalhos.</p>
        </div>

        <div className="relative mt-14">
          <svg aria-hidden viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 top-10 hidden h-28 w-full lg:block">
            <path data-draw d="M40 60 C 200 -10, 340 130, 500 60 S 800 -10, 960 60 S 1120 120, 1160 60" fill="none" stroke="url(#ing-grad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10" />
            <defs>
              <linearGradient id="ing-grad" x1="0" x2="1">
                <stop offset="0" stopColor="#ffb020" />
                <stop offset="1" stopColor="#ff4d00" />
              </linearGradient>
            </defs>
          </svg>
          <ul className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {ITEMS.map(({ icon: Icon, title, text }) => (
              <li key={title} data-ing className="group flex flex-col items-center rounded-3xl border border-white/10 bg-[#130f0b] p-5 text-center transition-colors hover:border-primary/40 sm:p-7">
                <span className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-gold to-flame text-black shadow-[0_10px_40px_-10px_rgba(255,122,26,0.8)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:size-20">
                  <Icon className="size-7 sm:size-8" />
                </span>
                <p className="mt-4 font-extrabold uppercase tracking-wide">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
