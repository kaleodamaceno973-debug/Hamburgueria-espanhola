"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { MenuProduct } from "@/server/catalog";
import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function MenuBrowser({ products, categories }: { products: MenuProduct[]; categories: { id: string; slug: string; name: string }[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("todos");
  const deferred = useDeferredValue(query);
  const input = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#busca") input.current?.focus({ preventScroll: true });
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(deferred.trim());
    return products.filter((p) => {
      if (cat !== "todos" && p.category.slug !== cat) return false;
      if (!q) return true;
      return normalize(`${p.name} ${p.description} ${p.tags.join(" ")} ${p.category.name}`).includes(q);
    });
  }, [products, cat, deferred]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { todos: products.length };
    for (const p of products) map[p.category.slug] = (map[p.category.slug] ?? 0) + 1;
    return map;
  }, [products]);

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-b border-white/10 bg-[#0a0806]/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 md:top-[6.75rem] lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm" id="busca">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="menu-search" className="sr-only">Buscar no cardápio</label>
            <input
              ref={input}
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => { setTouched(true); setQuery(e.target.value); }}
              placeholder="Buscar burger, bacon, shake…"
              autoComplete="off"
              className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] pl-11 pr-11 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-white/10" aria-label="Limpar busca">
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Categorias">
            {[{ slug: "todos", name: "Todos" }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={cat === c.slug}
                onClick={() => { setTouched(true); setCat(c.slug); }}
                className={cn(
                  "relative flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                  cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-white/15 text-foreground/80 hover:border-white/30",
                )}
              >
                <span className="relative">{c.name}</span>
                <span className={cn("relative text-xs", cat === c.slug ? "text-black/60" : "text-muted-foreground")}>{counts[c.slug] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{filtered.length} produtos encontrados</p>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<Search className="size-6" />}
          title="Nada encontrado"
          description={`Não achamos resultados para “${query}”. Tente outro termo ou categoria.`}
          action={<Button variant="outline" onClick={() => { setQuery(""); setCat("todos"); }}>Limpar filtros</Button>}
        />
      ) : (
        <ul key={touched ? `${cat}|${deferred}` : "ssr"} className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <li
              key={p.id}
              className={touched ? "animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both duration-500" : undefined}
              style={touched ? { animationDelay: `${Math.min(i, 8) * 35}ms` } : undefined}
            >
              <ProductCard product={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
