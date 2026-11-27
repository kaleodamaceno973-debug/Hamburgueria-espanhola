import { useMemo, useState } from 'react';
import { Plus, Search, Sprout, X } from 'lucide-react';
import {
  MENU_ITEMS,
  MenuCategory,
  formatEuro,
  normalizeSpanishSearch,
} from '../data/menu';
import { useOrder } from '../context/OrderContext';
import { NeonCowSvg } from './NeonCowSvg';

type FilterTab = 'all' | MenuCategory;

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Toda la carta' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'entrantes', label: 'Entrantes' },
  { id: 'postres', label: 'Postres' },
];

export function CartaCompleta() {
  const { addToCart, setActiveProduct } = useOrder();
  const [activeTab, setActiveTab] = useState<FilterTab>('burgers');
  const [onlyVegan, setOnlyVegan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = normalizeSpanishSearch(searchQuery.trim());
    return MENU_ITEMS.filter((item) => {
      if (activeTab !== 'all' && item.category !== activeTab) return false;
      if (onlyVegan && !item.isVegan) return false;
      if (q) {
        const hay = normalizeSpanishSearch(`${item.name} ${item.ingredients}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeTab, onlyVegan, searchQuery]);

  return (
    <section
      id="carta"
      className="relative border-b border-white/10 bg-black py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              La carta completa
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Sin tonterías. <span className="neon-text-gold">Todo el sabor.</span>
            </h2>
          </div>
          <p className="text-sm font-medium text-[#FFBC7D]">
            Opciones veganas, sin gluten y para peques.
          </p>
        </div>

        {/* Filter bar: Tabs + Vegan toggle + accent-insensitive search */}
        <div className="mt-10 flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#0b0b0c] p-1 border border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 rounded-md px-3.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#FFB547] text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOnlyVegan((v) => !v)}
              aria-pressed={onlyVegan}
              className={`inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                onlyVegan
                  ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/15 bg-[#0b0b0c] text-white/75 hover:border-white/30 hover:text-white'
              }`}
            >
              <Sprout className="h-4 w-4" />
              <span>Vegano</span>
            </button>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar burger, cheddar, nachos…"
              aria-label="Buscar en la carta"
              className="h-11 w-full rounded-lg border border-white/15 bg-[#0b0b0c] pl-10 pr-9 text-sm text-white placeholder:text-white/40 focus:border-[#FFB547] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="mt-12 rounded-xl border border-white/10 bg-[#0b0b0c] px-6 py-14 text-center">
            <p className="font-display text-xl font-bold text-white">
              No encontramos nada con «{searchQuery}»
            </p>
            <p className="mt-2 text-sm text-white/60">
              Prueba con otro ingrediente o limpia los filtros para ver toda la carta.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setOnlyVegan(false);
                setSearchQuery('');
              }}
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#FFB547] px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#FFBC7D]"
            >
              Ver toda la carta
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b0b0c] p-5 transition-colors duration-150 hover:border-[#FFB547]/45"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(item)}
                    className="block w-full aspect-square overflow-hidden rounded-lg bg-black text-left focus-visible:outline-none"
                    aria-label={`Ver ficha de ${item.name}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        width={600}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="studio-mask h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-[#FFB547]/20 bg-black p-6 text-center">
                        <NeonCowSvg idPrefix={`menu-${item.id}`} className="w-28 opacity-85" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB547]">
                          Foto próximamente
                        </p>
                      </div>
                    )}
                  </button>

                  {/* Unboxed quiet metadata line (Zero-Pill Discipline) */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                    <span className="uppercase tracking-wider">
                      {item.subGroup === 'clasicos'
                        ? 'Clásicos'
                        : item.subGroup === 'limited'
                          ? 'Limited Edition'
                          : item.subGroup === 'vegana'
                            ? 'Vegana'
                            : item.category === 'entrantes'
                              ? 'Entrantes'
                              : 'Postres'}
                    </span>
                    {item.isVegan && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-medium">🌱 Vegano</span>
                      </>
                    )}
                    {item.isLimited && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#F2E23A] font-medium">Limited</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display mt-1.5 text-xl font-black uppercase tracking-tight text-white">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(item)}
                      className="text-left transition-colors hover:text-[#FFB547]"
                    >
                      {item.name}
                    </button>
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.ingredients}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="font-display tabular-nums text-lg font-black text-[#FFB547]">
                      {formatEuro(item.price)}
                    </p>
                    <p className="text-[11px] text-white/45">Precio orientativo</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(item)}
                      className="inline-flex h-10 items-center rounded-lg border border-white/15 px-3 text-xs font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
                    >
                      Ficha
                    </button>
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
