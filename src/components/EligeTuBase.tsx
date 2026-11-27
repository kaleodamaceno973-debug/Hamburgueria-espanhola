import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Check } from 'lucide-react';
import { BaseCuadrilla, ITEMS_ELIGE_TU_BASE } from '../data/carta';
import { formatEuro } from '../data/negocio';
import { useCart } from './CartContext';
import { EstrellaDorada } from './JeymaBrand';

gsap.registerPlugin(ScrollTrigger);

export const EligeTuBase: React.FC = () => {
  const { addItem, openProductModal } = useCart();
  const [selectedBase, setSelectedBase] = useState<BaseCuadrilla>('Patatas');
  const [activeIndex, setActiveIndex] = useState(0); // 0: Baserritarras, 1: Gamberras, 2: Canallas
  const [revealedIngredients, setRevealedIngredients] = useState(4);
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const tentacleBarRef = useRef<SVGPathElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Precargar imágenes con img.decode() para transiciones sin parpadeos
  useEffect(() => {
    ITEMS_ELIGE_TU_BASE.forEach((item) => {
      const img = new Image();
      img.src = item.imagen;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => undefined);
      }
    });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealedIngredients(5);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const state = { step: 0 };
    let lastIndex = -1;
    let lastIngCount = -1;

    const ctx = gsap.context(() => {
      const barPath = tentacleBarRef.current;
      const barLen = barPath ? barPath.getTotalLength() : 0;
      if (barPath && barLen) {
        barPath.style.strokeDasharray = `${barLen}`;
        barPath.style.strokeDashoffset = `${barLen}`;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barPath && barLen) {
              barPath.style.strokeDashoffset = `${(barLen * (1 - self.progress)).toFixed(1)}`;
            }
          },
        },
      });

      stRef.current = tl.scrollTrigger || null;

      tl.to(state, {
        step: 3,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
          // step 0..0.4 -> intro base + Baserritarras; 0.4..1.4 -> Baserritarras; 1.4..2.2 -> Gamberras; 2.2..3.0 -> Canallas
          const s = state.step;
          let idx = 0;
          let localFrac = 0;

          if (s < 1.15) {
            idx = 0;
            localFrac = Math.min(1, s / 0.85);
          } else if (s < 2.08) {
            idx = 1;
            localFrac = Math.min(1, (s - 1.15) / 0.72);
          } else {
            idx = 2;
            localFrac = Math.min(1, (s - 2.08) / 0.72);
          }

          const ingCount = Math.max(1, Math.min(4, Math.ceil(localFrac * 4 + 0.15)));

          if (idx !== lastIndex) {
            lastIndex = idx;
            setActiveIndex(idx);
          }
          if (ingCount !== lastIngCount) {
            lastIngCount = ingCount;
            setRevealedIngredients(ingCount);
          }
        },
      });
    }, sectionRef);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, []);

  const currentItem = ITEMS_ELIGE_TU_BASE[activeIndex] ?? ITEMS_ELIGE_TU_BASE[0];

  const handleStepClick = (idx: number) => {
    const st = stRef.current;
    if (!st) {
      setActiveIndex(idx);
      setRevealedIngredients(5);
      return;
    }
    const targetFracs = [0.22, 0.56, 0.88];
    const targetScroll = st.start + (st.end - st.start) * (targetFracs[idx] ?? 0.22);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(currentItem, 1, { base: selectedBase }, undefined, e.currentTarget);
    setAddedFeedbackId(currentItem.id);
    window.setTimeout(() => setAddedFeedbackId(null), 1100);
  };

  return (
    <section
      id="elige-tu-base"
      ref={sectionRef}
      className="relative overflow-hidden paper-cream text-[#1F4A2E] border-b border-[#A8873A]/45 min-h-[100svh] flex flex-col justify-center"
    >
      {/* Marco fino dorado */}
      <div
        className="pointer-events-none absolute inset-2.5 sm:inset-5 border border-[#A8873A]/45"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1180px] mx-auto w-full px-5 sm:px-10 pt-5 pb-20 md:py-10">
        {/* Cabecera + Toggle de Base Patatas / Totopos */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#5C4930]/20 pb-4">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#5C4930]">
              Especialidad de cuadrilla · Paso {activeIndex + 1} de 3
            </p>
            <h2 className="font-display font-extrabold text-[clamp(1.65rem,4vw,2.75rem)] leading-[1.05] text-[#1F4A2E] mt-1 [text-wrap:balance]">
              Elige tu base y remata encima.
            </h2>
          </div>

          {/* Toggle Patatas ↔ Totopos */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-semibold text-[#5C4930] whitespace-nowrap">
              Tu base:
            </span>
            <div
              role="group"
              aria-label="Elegir base de patatas o totopos"
              className="inline-flex p-1 rounded-lg bg-[#1F4A2E]/10 border border-[#1F4A2E]/20"
            >
              {(['Patatas', 'Totopos'] as const).map((base) => {
                const active = selectedBase === base;
                return (
                  <button
                    key={base}
                    type="button"
                    onClick={() => setSelectedBase(base)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1F4A2E] text-[#F3EADC] shadow-xs'
                        : 'text-[#1F4A2E]/80 hover:text-[#1F4A2E]'
                    }`}
                  >
                    {base}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de progreso en forma de tentáculo dorado */}
        <div className="mt-3 flex items-center gap-3" aria-hidden="true">
          <svg viewBox="0 0 600 22" className="w-full h-5 overflow-visible" fill="none">
            <path
              d="M 4 12 Q 150 4, 300 12 T 596 12"
              stroke="rgba(168,135,58,0.22)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              ref={tentacleBarRef}
              d="M 4 12 Q 150 4, 300 12 T 596 12"
              stroke="#A8873A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Selector de pasos directo */}
        <div className="mt-2 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
          {ITEMS_ELIGE_TU_BASE.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleStepClick(idx)}
                className={`min-h-[36px] px-3 py-1 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                    : 'bg-transparent text-[#5C4930] border-[#5C4930]/25 hover:border-[#1F4A2E]/50 hover:text-[#1F4A2E]'
                }`}
              >
                0{idx + 1}. {item.nombre}
              </button>
            );
          })}
        </div>

        {/* Contenido principal: Foto arriba en móvil / izquierda en escritorio, ficha abajo/derecha */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
          {/* Foto del plato */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#5C4930]/25 bg-[#0c0d0c] h-[25svh] sm:h-[34svh] lg:h-[400px]">
            {ITEMS_ELIGE_TU_BASE.map((item, idx) => (
              <img
                key={item.id}
                src={item.imagen}
                alt={`${item.nombre} con base de ${selectedBase} en JEYMA Bilbao`}
                width={item.width}
                height={item.height}
                decoding="async"
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  idx === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#F3EADC] text-xs sm:text-sm">
              <span className="font-medium">
                Base elegida: <strong className="text-[#FAF5EC]">{selectedBase}</strong>
              </span>
              <span className="tabular-nums font-semibold">
                {formatEuro(currentItem.precio)}
              </span>
            </div>
          </div>

          {/* Tarjeta de descripción + ingredientes uno a uno + botón Añadir */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#FAF5EC] border border-[#A8873A]/45 rounded-2xl p-4 sm:p-7">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {currentItem.destacado && (
                      <EstrellaDorada className="w-4 h-4 text-[#A8873A] shrink-0" />
                    )}
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F4A2E]">
                      {currentItem.nombre}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm sm:text-base text-[#5C4930] leading-snug">
                    {currentItem.descripcion}
                  </p>
                </div>
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F4A2E] tabular-nums shrink-0">
                  {formatEuro(currentItem.precio)}
                </span>
              </div>

              {/* Ingredientes apareciendo uno a uno con el scroll */}
              <div className="mt-4 pt-4 border-t border-[#5C4930]/15">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C4930] mb-2.5">
                  Qué lleva encima
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(currentItem.ingredientes || []).map((ing, i) => {
                    const visible = i < revealedIngredients;
                    const displayLabel =
                      i === 0 ? `Base de ${selectedBase.toLowerCase()}` : ing;
                    return (
                      <li
                        key={`${currentItem.id}-${ing}`}
                        className={`flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F4A2E] transition-all duration-300 ${
                          visible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-25 translate-y-1.5'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#A8873A] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{displayLabel}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#5C4930]/15 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => openProductModal(currentItem, selectedBase)}
                className="min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold text-[#5C4930] hover:text-[#1F4A2E] underline underline-offset-4 cursor-pointer"
              >
                Personalizar nota
              </button>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-lg bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {addedFeedbackId === currentItem.id ? (
                  <>
                    <Check className="w-4 h-4 text-[#A8873A]" aria-hidden="true" />
                    <span>Añadido ({selectedBase})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Añadir · {selectedBase}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
