import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARNES_BASE } from '../data/carta';

gsap.registerPlugin(ScrollTrigger);

interface ManifestoSectionProps {
  reducedMotion: boolean;
}

const FRASES = [
  { texto: 'Aquí no hacemos smash.', acento: true },
  { texto: 'Hacemos burgers con cuerpo. Medallón, punto y mordida.', acento: false },
  { texto: 'Txuleta, wagyu, pollo crispy o vegetal. Tú eliges la carne.', acento: false },
  {
    texto: 'Nosotros la tratamos como merece: al calor del carbón de encina. Sabor a brasa de verdad. Sin filtros.',
    acento: false,
  },
];

export default function ManifestoSection({ reducedMotion }: ManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [litMeats, setLitMeats] = useState(reducedMotion ? CARNES_BASE.length : 1);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let lastLit = 1;

    const ctx = gsap.context(() => {
      const phrases = section.querySelectorAll('.manifesto-phrase');
      gsap.fromTo(
        phrases,
        { opacity: 0.2, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'center center',
            scrub: 0.5,
          },
        }
      );

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 60%',
        onUpdate: (self) => {
          const count = Math.min(
            CARNES_BASE.length,
            Math.max(1, Math.ceil(self.progress * CARNES_BASE.length))
          );
          if (count !== lastLit) {
            lastLit = count;
            setLitMeats(count);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="la-brasa"
      ref={sectionRef}
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32"
    >
      {/* Full-bleed oak charcoal embers */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/brasas-carbon-encina.webp"
          alt="Brasas incandescentes de carbón de encina de Bilbo Burger"
          width={1200}
          height={586}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/65 to-[#0B0B0B]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <span className="text-xs font-semibold tracking-[0.22em] text-[#FFB23F] uppercase">
          Carbón de encina · Sin postureo
        </span>

        <h2 id="manifesto-title" className="sr-only">
          Aquí no hacemos smash
        </h2>

        <div className="mt-6 space-y-4 sm:space-y-5">
          {FRASES.map((item, idx) => (
            <p
              key={idx}
              className={`manifesto-phrase font-display leading-[1.08] ${
                item.acento
                  ? 'text-[clamp(2rem,5.5vw,4.25rem)] text-[#E9632D]'
                  : 'text-[clamp(1.35rem,3.3vw,2.6rem)] text-[#F5EFE6]'
              }`}
            >
              {item.texto}
            </p>
          ))}
        </div>

        {/* 4 Meats as double-ellipse seals lighting up sequentially */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {CARNES_BASE.map((carne, idx) => {
            const isLit = idx < litMeats;
            return (
              <div
                key={carne.id}
                className={`seal-ellipse flex flex-col items-center justify-center px-4 py-5 text-center transition-all duration-300 ${
                  isLit
                    ? 'bg-[#E9632D]/15 opacity-100 scale-100'
                    : 'border-white/20 bg-[#111111]/80 opacity-45 scale-[0.97]'
                }`}
              >
                <span
                  className={`font-display text-lg sm:text-xl ${
                    isLit ? 'text-[#F5EFE6]' : 'text-[#F5EFE6]/65'
                  }`}
                >
                  {carne.nombre}
                </span>
                <span className="mt-1 text-xs text-[#F5EFE6]/70">
                  {carne.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
