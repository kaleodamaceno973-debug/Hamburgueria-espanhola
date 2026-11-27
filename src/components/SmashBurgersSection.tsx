import React from 'react';
import { Plus } from 'lucide-react';
import { CARTA_ITEMS } from '../data/carta';
import { formatEuro } from '../data/negocio';
import { useCart } from './CartContext';

export const SmashBurgersSection: React.FC = () => {
  const { openProductModal } = useCart();
  const burgers = CARTA_ITEMS.filter((p) => p.categoria === 'hamburguesas');

  return (
    <section
      id="smash-burgers"
      className="relative overflow-hidden bg-[#0D1A12] text-[#F3EADC] border-b border-[#A8873A]/40 py-16 sm:py-24"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Bloque editorial + frase oficial */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8873A]">
              Nuestras Hamburguesas · {formatEuro(12.5)} cada una
            </p>
            <h2 className="mt-2 font-display font-extrabold text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.04] text-[#F3EADC] [text-wrap:balance]">
              Smash Fat Burgers.
            </h2>
            <blockquote className="mt-4 font-display italic text-lg sm:text-xl text-[#F3EADC]/90 leading-snug">
              «En nuestras Smash Fat Burger, la carne es la que manda y eso se nota.»
            </blockquote>
            <p className="mt-4 text-sm sm:text-base text-[#F3EADC]/75 leading-relaxed">
              Doble carne de 90 g sellada a la plancha para sacar el borde crujiente. Por{' '}
              <strong className="text-[#F3EADC] font-semibold">+1,00 €</strong> agrega patatas
              crujientes a cualquiera de las dos.
            </p>
          </div>

          {/* Las 2 Smash Fat Burgers */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {burgers.map((burger) => (
              <article
                key={burger.id}
                onClick={() => openProductModal(burger)}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#14271B] border border-[#A8873A]/40 hover:border-[#F3EADC]/60 transition-colors cursor-pointer"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img
                      src={burger.imagen}
                      alt={burger.nombre}
                      width={burger.width}
                      height={burger.height}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display font-extrabold text-xl text-[#F3EADC]">
                        {burger.nombre}
                      </h3>
                      <span className="font-display font-bold text-lg text-[#A8873A] tabular-nums shrink-0">
                        {formatEuro(burger.precio)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#F3EADC]/80 leading-relaxed">
                      {burger.descripcion}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-[#A8873A]">+1 € patatas crujientes</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductModal(burger);
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-1.5 rounded-lg bg-[#F3EADC] text-[#1F4A2E] hover:bg-[#FAF5EC] text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pedir</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
