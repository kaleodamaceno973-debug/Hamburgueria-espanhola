import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { MenuProduct } from "@/server/catalog";
import { Tilt } from "@/components/motion/tilt";
import { formatBRL, cn } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart";

export function ProductCard({ product, className, priority = false }: { product: MenuProduct; className?: string; priority?: boolean }) {
  return (
    <Tilt className={cn("h-full", className)}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b1510] to-[#120e0b] card-glow transition-colors duration-500 hover:border-primary/50">
        {/* brilho que segue o mouse */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,122,26,0.14), transparent 45%)" }}
        />
        <Link href={`/cardapio/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden" aria-label={`Ver ${product.name}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            preload={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-transparent to-transparent" />
          {product.badge && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground">
              <Flame className="size-3" /> {product.badge}
            </span>
          )}
        </Link>
        <div className="relative z-20 flex flex-1 flex-col p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">{product.category.name}</p>
          <h3 className="mt-1 text-xl font-extrabold leading-tight">
            <Link href={`/cardapio/${product.slug}`} className="transition-colors hover:text-primary">{product.name}</Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              {product.compareAtCents && product.compareAtCents > product.priceCents && (
                <p className="text-xs text-muted-foreground line-through">{formatBRL(product.compareAtCents)}</p>
              )}
              <p className="font-display text-2xl text-gold">{formatBRL(product.priceCents)}</p>
            </div>
            <AddToCartButton
              item={{ productId: product.id, slug: product.slug, name: product.name, image: product.image, priceCents: product.priceCents }}
            />
          </div>
        </div>
      </article>
    </Tilt>
  );
}
