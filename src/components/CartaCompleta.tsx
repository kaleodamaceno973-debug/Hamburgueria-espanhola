import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Plus, X } from 'lucide-react';
import { CARTA_ITEMS, CATEGORIAS_META, CategoriaId, ProductoCarta } from '../data/carta';
import { formatEuro, normalizeSearch } from '../data/negocio';
import { useCart } from './CartContext';
import { EstrellaDorada, TentacleCorner } from './JeymaBrand';

gsap.registerPlugin(ScrollTrigger);

const TABS: { id: CategoriaId; label: string }[] = [
  { id: 'raciones', label: 'Raciones' },
  { id: 'cuadrilla', label: 'Cuadrilla' },
  { id: 'hamburguesas', label: 'Hamburguesas' },
];

export const CartaCompleta: React.FC = () => {
  const { openProductModal, addItem } = useCart();
  const [activeTab, setActiveTab] = useState<CategoriaId>('raciones');
  const [query, setQuery] = useState('');

  const sectionRef = useRef<HTMLElement | null>(null);
  const topLeftTentacleRef = useRef<SVGPathElement | null>(null);
  const bottomRightTentacleRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const paths = [topLeftTentacleRef.current, bottomRightTentacleRef.current].filter(
        (p): p is SVGPathElement => Boolean(p)
      );
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.7,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const normalizedQuery = normalizeSearch(query);

  const visibleItems = useMemo(() => {
    if (normalizedQuery.length > 0) {
      return CARTA_ITEMS.filter((item) => {
        const haystack = normalizeSearch(
          [
            item.nombre,
            item.descripcion,
            CATEGORIAS_META[item.categoria].titulo,
            ...(item.sabores || []),
            ...(item.ingredientes || []),
          ].join(' ')
        );
        return haystack.includes(normalizedQuery);
      });
    }
    return CARTA_ITEMS.filter((item) => item.categoria === activeTab);
  }, [activeTab, normalizedQuery]);

  const handleCardAction = (e: React.MouseEvent<HTMLButtonElement>, item: ProductoCarta) => {
    e.stopPropagation();
    if (item.eligeBase || item.sabores || item.extraPatatasPrecio) {
      openProductModal(item);
    } else {
      addItem(item, 1, {}, undefined, e.currentTarget);
    }
  };

  return (
    <section
      id="carta"
      ref={sectionRef}
      className="relative overflow-hidden paper-green text-[#F3EADC] border-b border-[#A8873A]/40 py-16 sm:py-24"
    >
      {/* Doble marco de carta física (crema exterior + dorado interior) */}
      <div
        className="pointer-events-none absolute inset-3 sm:inset-6 border-2 border-[#F3EADC]/80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-5 sm:inset-8 border border-[#A8873A]/60"
        aria-hidden="true"
      />

      {/* Tentáculos que se dibujan con el scroll abrazando la carta */}
      <TentacleCorner
        pathRef={topLeftTentacleRef}
        className="pointer-events-none absolute top-2 left-2 w-40 sm:w-56 h-auto opacity-80"
        color="#F3EADC"
        glowColor="rgba(168,135,58,0.2)"
      />
      <TentacleCorner
        pathRef={bottomRightTentacleRef}
        flip
        className="pointer-events-none absolute bottom-2 right-2 w-40 sm:w-56 h-auto opacity-80 rotate-180"
        color="#F3EADC"
        glowColor="rgba(168,135,58,0.2)"
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-7 sm:px-14">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8873A]">
            Carta oficial · IVA incluido
          </p>
          <h2 className="mt-2 font-display font-extrabold text-[clamp(2rem,4.8vw,3.35rem)] leading-[1.04] text-[#F3EADC] [text-wrap:balance]">
            La carta completa.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F3EADC]/80">
            {normalizedQuery
              ? `Mostrando resultados en toda la carta para «${query.trim()}»`
              : CATEGORIAS_META[activeTab].subtitulo}
          </p>
        </div>

        {/* Pestañas de categoría + Buscador sin acentos */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Categorías de la carta"
            className="inline-flex p-1 rounded-xl bg-[#14321F] border border-[#A8873A]/40 self-center md:self-auto"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.id && normalizedQuery.length === 0;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveTab(tab.id);
                  }}
                  className={`min-h-[42px] px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#F3EADC] text-[#1F4A2E]'
                      : 'text-[#F3EADC]/80 hover:text-[#F3EADC]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="w-4 h-4 text-[#A8873A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar (ej. croquetas txipiron)"
              aria-label="Buscar en la carta"
              className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl bg-[#14321F] border border-[#A8873A]/45 text-base sm:text-sm text-[#F3EADC] placeholder:text-[#F3EADC]/50 focus:outline-none focus:border-[#F3EADC]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#F3EADC]/70 hover:text-[#F3EADC] cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lista / Rejilla de platos */}
        {visibleItems.length === 0 ? (
          <div className="mt-10 py-14 text-center border border-[#A8873A]/30 rounded-2xl bg-[#14321F]/60">
            <p className="font-display text-xl text-[#F3EADC]">
              No encontramos ningún plato con «{query}».
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 min-h-[44px] px-5 py-2 rounded-lg bg-[#F3EADC] text-[#1F4A2E] text-sm font-semibold cursor-pointer"
            >
              Ver toda la carta
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {visibleItems.map((item) => {
              const requiresConfig = Boolean(
                item.eligeBase || item.sabores || item.extraPatatasPrecio
              );
              return (
                <article
                  key={item.id}
                  onClick={() => openProductModal(item)}
                  className="group relative flex items-stretch gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-[#14321F]/80 border border-[#A8873A]/35 hover:border-[#F3EADC]/60 transition-colors cursor-pointer"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-[#0b130e] shrink-0 border border-[#A8873A]/25">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-[#F3EADC] leading-snug flex items-center gap-1.5">
                          {item.destacado && (
                            <EstrellaDorada className="w-4 h-4 text-[#A8873A] shrink-0" />
                          )}
                          <span className="truncate">{item.nombre}</span>
                        </h3>
                        <span className="font-display font-bold text-base sm:text-lg text-[#F3EADC] tabular-nums shrink-0">
                          {formatEuro(item.precio)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs sm:text-sm text-[#F3EADC]/80 line-clamp-2 leading-relaxed">
                        {item.descripcion}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-[#A8873A] truncate">
                        {normalizedQuery
                          ? CATEGORIAS_META[item.categoria].titulo
                          : item.eligeBase
                          ? 'Base: Patatas o Totopos'
                          : item.sabores
                          ? '4 sabores a elegir'
                          : item.extraPatatasPrecio
                          ? '+1 € patatas crujientes'
                          : 'Para compartir'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleCardAction(e, item)}
                        className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F3EADC] text-[#1F4A2E] hover:bg-[#FAF5EC] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                        aria-label={
                          requiresConfig
                            ? `Elegir opciones para ${item.nombre}`
                            : `Añadir ${item.nombre} al pedido`
                        }
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{requiresConfig ? 'Elegir' : 'Añadir'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
