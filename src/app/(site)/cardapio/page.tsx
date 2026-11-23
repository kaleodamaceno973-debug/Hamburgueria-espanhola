import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/ui/states";
import { getMenu } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Smash burgers, combos, porções e shakes. Peça online com Pix ou cartão.",
  alternates: { canonical: "/cardapio" },
};

export default async function MenuPage() {
  const { products, categories } = await getMenu();
  return (
    <>
      <PageHero eyebrow="Cardápio" title="Escolha seu smash" text="Tudo feito na hora, na chapa. Use a busca ou filtre por categoria." />
      <div className="container-x pb-24">
        {products.length === 0 ? (
          <EmptyState className="mt-10" title="Cardápio em atualização" description="Volte em alguns minutos — estamos preparando novidades." />
        ) : (
          <MenuBrowser products={products} categories={categories} />
        )}
      </div>
    </>
  );
}
