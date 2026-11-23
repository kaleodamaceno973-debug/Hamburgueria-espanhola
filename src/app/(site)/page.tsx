import { Hero } from "@/components/home/hero";
import { FeaturesStrip } from "@/components/home/features-strip";
import { MenuShowcase } from "@/components/home/menu-showcase";
import { AnatomySection } from "@/components/home/anatomy/anatomy-section";
import { Story } from "@/components/home/story";
import { Ingredients } from "@/components/home/ingredients";
import { Promo } from "@/components/home/promo";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { getBanners, getFaqs, getMenu, getSiteContent, getTestimonials } from "@/server/catalog";
import { BRAND } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

export default async function HomePage() {
  const [banners, menu, c, testimonials, faqs] = await Promise.all([getBanners(), getMenu(), getSiteContent(), getTestimonials(), getFaqs()]);
  const featured = menu.products.filter((p) => p.featured);
  const showcase = (featured.length >= 4 ? featured : menu.products).slice(0, 8);
  const heroBanners =
    banners.length > 0
      ? banners
      : [{ id: "default", eyebrow: "Smash burgers artesanais", title: "Sabor gigante.", highlight: "Sem atalhos.", subtitle: "", ctaLabel: "Pedir agora", ctaHref: "/cardapio", imageUrl: "/images/hero-1.webp" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: BRAND.name,
    servesCuisine: "Hambúrguer",
    url: siteUrl(),
    image: siteUrl("/images/hero-1.webp"),
    address: { "@type": "PostalAddress", streetAddress: c["contact.address"], addressCountry: "BR" },
    telephone: c["contact.phone"],
    openingHours: "Mo-Su 11:00-23:00",
    priceRange: "R$",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "3000" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero banners={heroBanners} />
      <FeaturesStrip />
      <MenuShowcase products={showcase} eyebrow={c["home.menu.eyebrow"]} title={c["home.menu.title"]} text={c["home.menu.text"]} />
      <AnatomySection title={c["home.anatomy.title"]} text={c["home.anatomy.text"]} />
      <Story title={c["home.story.title"]} text={c["home.story.text"]} />
      <Ingredients />
      <Promo title={c["home.promo.title"]} subtitle={c["home.promo.subtitle"]} code={c["home.promo.code"]} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} />
      <FinalCta title={c["home.cta.title"]} text={c["home.cta.text"]} address={c["topbar.address"]} hours={c["topbar.hours"]} />
    </>
  );
}
