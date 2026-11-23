import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { CartDrawerLazy } from "@/components/cart/cart-drawer-lazy";
import { CookieBanner } from "@/components/site/cookie-banner";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#conteudo" className="sr-only z-[100] rounded-full bg-primary px-4 py-2 font-bold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o conteúdo
      </a>
      <SmoothScroll />
      <Header />
      <main id="conteudo" className="relative">{children}</main>
      <Footer />
      <CartDrawerLazy />
      <CookieBanner />
    </>
  );
}
