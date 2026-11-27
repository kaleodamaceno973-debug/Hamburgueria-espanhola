import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { CARTA_ITEMS, ProductoCarta } from '../data/carta';
import { formatEuro } from '../data/negocio';
import { useCart } from './CartContext';
import { EstrellaDorada, TentacleCorner } from './JeymaBrand';

const IMPRESCINDIBLES_IDS = ['rabas', 'torreznos', 'baserritarras'] as const;

const TiltCard: React.FC<{
  item: ProductoCarta;
  onSelect: (p: ProductoCarta) => void;
  onQuickAdd: (p: ProductoCarta, el: HTMLElement) => void;
  justAdded: boolean;
}> = ({ item, onSelect, onQuickAdd, justAdded }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -7, ry: px * 7 });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <article
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
      }}
      className="group flex flex-col justify-between bg-[#FAF5EC] text-[#1F4A2E] border border-[#A8873A]/50 rounded-2xl overflow-hidden transition-transform duration-200 ease-out"
    >
      <div>
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="relative w-full aspect-[4/3] overflow-hidden bg-[#0e120f] block text-left cursor-pointer"
          aria-label={`Ver detalles de ${item.nombre}`}
        >
          <img
            src={item.imagen}
            alt={item.nombre}
            width={item.width}
            height={item.height}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#F3EADC]">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide">
              <EstrellaDorada className="w-3.5 h-3.5 text-[#A8873A]" />
              <span>{item.fraseDestacado || 'Destacado de la casa'}</span>
            </span>
          </div>
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#1F4A2E]">
              {item.nombre}
            </h3>
            <span className="font-display font-bold text-lg sm:text-xl text-[#1F4A2E] tabular-nums shrink-0">
              {formatEuro(item.precio)}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#5C4930] leading-relaxed">
            {item.descripcion}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="min-h-[42px] text-xs sm:text-sm font-semibold text-[#5C4930] hover:text-[#1F4A2E] underline underline-offset-4 cursor-pointer"
        >
          Ver ficha
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (item.eligeBase) {
              onSelect(item);
            } else {
              onQuickAdd(item, e.currentTarget);
            }
          }}
          className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-[#A8873A]" aria-hidden="true" />
              <span>Añadido</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>{item.eligeBase ? 'Elegir base' : 'Añadir'}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export const LosImprescindibles: React.FC = () => {
  const { addItem, openProductModal } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const items = IMPRESCINDIBLES_IDS.map((id) => CARTA_ITEMS.find((p) => p.id === id)!).filter(
    Boolean
  );

  const handleQuickAdd = (p: ProductoCarta, el: HTMLElement) => {
    addItem(p, 1, {}, undefined, el);
    setAddedId(p.id);
    window.setTimeout(() => setAddedId(null), 1100);
  };

  return (
    <section
      id="imprescindibles"
      className="relative overflow-hidden paper-cream text-[#1F4A2E] border-b border-[#A8873A]/45 py-16 sm:py-24"
    >
      <TentacleCorner
        className="pointer-events-none absolute -top-6 -right-8 w-44 sm:w-56 h-auto opacity-30 rotate-90"
        color="#1F4A2E"
        glowColor="rgba(168,135,58,0.18)"
      />

      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5C4930]">
            <EstrellaDorada className="w-3.5 h-3.5 text-[#A8873A]" />
            <span>De las de toda la vida</span>
          </p>
          <h2 className="mt-2 font-display font-extrabold text-[clamp(2rem,4.5vw,3.15rem)] leading-[1.05] text-[#1F4A2E] [text-wrap:balance]">
            Los tres imprescindibles del JEYMA.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => (
            <TiltCard
              key={item.id}
              item={item}
              onSelect={(p) => openProductModal(p)}
              onQuickAdd={handleQuickAdd}
              justAdded={addedId === item.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
