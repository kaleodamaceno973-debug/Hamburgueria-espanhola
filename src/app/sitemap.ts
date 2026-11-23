import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/server/catalog";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductSlugs();
  const pages = ["", "/cardapio", "/sobre", "/contato", "/privacidade", "/termos"].map((p) => ({
    url: siteUrl(p),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  return [...pages, ...slugs.map((s) => ({ url: siteUrl(`/cardapio/${s}`), changeFrequency: "weekly" as const, priority: 0.6 }))];
}
