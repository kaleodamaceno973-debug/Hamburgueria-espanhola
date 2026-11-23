import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { CONTENT_FIELDS, type SiteContentMap } from "@/lib/content-defaults";

/** Tags de cache invalidadas pelo painel admin. */
export const TAGS = { menu: "menu", content: "content" } as const;

export type MenuProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  badge: string | null;
  tags: string[];
  featured: boolean;
  image: string;
  category: { slug: string; name: string };
};

const FALLBACK_IMAGE = "/images/classic-smash.webp";

export async function getMenu() {
  "use cache";
  cacheTag(TAGS.menu);
  cacheLife("hours");
  const [categories, products] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      where: { available: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { category: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);
  const items: MenuProduct[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    badge: p.badge,
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    featured: p.featured,
    image: p.images[0]?.url ?? FALLBACK_IMAGE,
    category: { slug: p.category.slug, name: p.category.name },
  }));
  return {
    categories: categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })).filter((c) => items.some((i) => i.category.slug === c.slug)),
    products: items,
  };
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag(TAGS.menu);
  cacheLife("hours");
  const p = await db.product.findUnique({
    where: { slug },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!p || !p.available) return null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    longDescription: p.longDescription,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    badge: p.badge,
    calories: p.calories,
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    images: p.images.length ? p.images.map((i) => ({ url: i.url, alt: i.alt || p.name })) : [{ url: FALLBACK_IMAGE, alt: p.name }],
    category: { slug: p.category.slug, name: p.category.name },
  };
}

export async function getProductSlugs() {
  "use cache";
  cacheTag(TAGS.menu);
  const rows = await db.product.findMany({ where: { available: true }, select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getSiteContent(): Promise<SiteContentMap> {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("hours");
  const rows = await db.siteContent.findMany();
  const map = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default])) as SiteContentMap;
  for (const r of rows) if (r.key in map) map[r.key as keyof SiteContentMap] = r.value;
  return map;
}

export async function getBanners() {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("hours");
  return db.banner.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getTestimonials() {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("hours");
  return db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFaqs() {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("hours");
  return db.faq.findMany({ orderBy: { sortOrder: "asc" } });
}
