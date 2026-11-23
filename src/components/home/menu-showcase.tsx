import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MenuProduct } from "@/server/catalog";
import { ProductCard } from "@/components/menu/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { MenuCarousel } from "./menu-carousel";

export function MenuShowcase({ products, eyebrow, title, text }: { products: MenuProduct[]; eyebrow: string; title: string; text: string }) {
  return (
    <section aria-labelledby="menu-title" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="menu-title" eyebrow={eyebrow} title={title} text={text} />
          <Reveal className="flex items-center gap-4">
            <span className="font-script hidden -rotate-6 text-3xl text-primary/80 lg:block">Smash House</span>
            <Button asChild variant="outline" size="lg">
              <Link href="/cardapio">Ver cardápio completo <ArrowRight className="size-4" /></Link>
            </Button>
          </Reveal>
        </div>
        <Reveal className="mt-10">
          <MenuCarousel label="Burgers em destaque">
            {products.map((p) => (
              <div key={p.id} data-slide-item className="w-[78%] shrink-0 sm:w-[46%] lg:w-[31%] xl:w-[23.5%]">
                <ProductCard product={p} />
              </div>
            ))}
          </MenuCarousel>
        </Reveal>
      </div>
    </section>
  );
}
