import Link from "next/link";
import { Suspense } from "react";
import { MapPin, Clock, Truck, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/server/catalog";
import { Logo } from "./logo";
import { DesktopNav } from "./nav-links";
import { MobileNavLazy } from "./mobile-nav-lazy";
import { HeaderShell } from "./header-shell";
import { CartButton } from "@/components/cart/cart-button";
import { AccountButton } from "./account-button";

export async function Header() {
  const c = await getSiteContent();
  return (
    <HeaderShell>
      <div className="hidden border-b border-white/5 bg-black/40 text-xs text-foreground/70 md:block">
        <div className="container-x flex h-9 items-center justify-between gap-6">
          <p className="flex items-center gap-2"><MapPin className="size-3.5 text-primary" />{c["topbar.address"]}</p>
          <p className="flex items-center gap-2"><Clock className="size-3.5 text-primary" />{c["topbar.hours"]}</p>
          <p className="flex items-center gap-2"><Truck className="size-3.5 text-primary" />{c["topbar.promo"]}</p>
        </div>
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
        <div className="flex items-center gap-1">
          <MobileNavLazy phone={c["contact.phone"]} address={c["topbar.address"]} hours={c["topbar.hours"]} />
          <Logo />
        </div>
        <DesktopNav />
        <div className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link href="/cardapio#busca" aria-label="Buscar no cardápio"><Search className="size-5" /></Link>
          </Button>
          <Suspense
            fallback={
              <Button asChild variant="ghost" size="icon">
                <Link href="/conta" aria-label="Minha conta"><User className="size-5" /></Link>
              </Button>
            }
          >
            <AccountButton />
          </Suspense>
          <CartButton />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/cardapio">Pedir agora</Link>
          </Button>
        </div>
      </div>
    </HeaderShell>
  );
}
