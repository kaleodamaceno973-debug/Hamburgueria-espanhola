import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Flame, ShieldCheck, Timer, Truck } from "lucide-react";
import { getMenu, getProductBySlug, getProductSlugs } from "@/server/catalog";
import { ProductGallery } from "@/components/menu/product-gallery";
import { ProductPurchase } from "@/components/menu/product-purchase";
import { ProductCard } from "@/components/menu/product-card";
import { Reveal } from "@/components/motion/reveal";
import { formatBRL, siteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "classic-smash" }];
}

export async function generateMetadata({ params }: PageProps<"/cardapio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produto não encontrado" };
  return {
    title: p.name,
    description: `${p.description} ${formatBRL(p.priceCents)}.`,
    alternates: { canonical: `/cardapio/${p.slug}` },
    openGraph: { images: [{ url: p.images[0].url }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/cardapio/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const { products } = await getMenu();
  const related = products.filter((p) => p.category.slug === product.category.slug && p.slug !== product.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription || product.description,
    image: product.images.map((i) => siteUrl(i.url)),
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-x pb-20 pt-28 md:pt-36">
        <nav aria-label="Trilha" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/cardapio" className="hover:text-primary">Cardápio</Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{product.category.name}</span>
              {product.badge && (
                <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-primary-foreground">
                  <Flame className="size-3" /> {product.badge}
                </span>
              )}
            </div>
            <h1 className="font-display mt-3 text-[clamp(2.8rem,7vw,5rem)]"><span className="slant">{product.name}</span></h1>
            <div className="mt-4 flex items-end gap-3">
              <p className="font-display text-4xl text-gold">{formatBRL(product.priceCents)}</p>
              {product.compareAtCents && product.compareAtCents > product.priceCents && (
                <p className="pb-1 text-lg text-muted-foreground line-through">{formatBRL(product.compareAtCents)}</p>
              )}
            </div>
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">{product.longDescription || product.description}</p>

            {(product.tags.length > 0 || product.calories) && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs capitalize text-foreground/75">{t}</li>
                ))}
                {product.calories && <li className="rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/75">{product.calories} kcal</li>}
              </ul>
            )}

            <div className="mt-8">
              <ProductPurchase item={{ productId: product.id, slug: product.slug, name: product.name, image: product.images[0].url, priceCents: product.priceCents }} />
            </div>

            <ul className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-5 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2"><Timer className="size-4 text-primary" /> Pronto em ~20 min</li>
              <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Entrega ou retirada</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Pagamento seguro</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-24">
            <h2 id="related-title" className="font-display text-4xl sm:text-5xl"><span className="slant">Combina com</span></h2>
            <Reveal stagger={0.08} className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </>
  );
}
