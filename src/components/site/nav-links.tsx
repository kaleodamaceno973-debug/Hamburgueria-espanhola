"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, Phone, MapPin, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export const NAV = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/sobre", label: "Nossa história" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function DesktopNav() {
  return (
    <Suspense fallback={<DesktopNavView pathname="" />}>
      <DesktopNavLive />
    </Suspense>
  );
}
function DesktopNavLive() {
  return <DesktopNavView pathname={usePathname()} />;
}
function DesktopNavView({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
              active ? "text-primary" : "text-foreground/80 hover:text-foreground",
            )}
          >
            {item.label}
            <span
              className={cn(
                "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300",
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

type MobileProps = { phone: string; address: string; hours: string; defaultOpen?: boolean };
export function MobileNav(props: MobileProps) {
  return (
    <Suspense fallback={<MobileNavView {...props} pathname="" />}>
      <MobileNavLive {...props} />
    </Suspense>
  );
}
function MobileNavLive(props: MobileProps) {
  return <MobileNavView {...props} pathname={usePathname()} />;
}
function MobileNavView({ phone, address, hours, pathname, defaultOpen = false }: MobileProps & { pathname: string }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-6">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navegação do site</SheetDescription>
        <Logo onClick={() => setOpen(false)} />
        <nav aria-label="Menu mobile" className="mt-10 flex flex-col">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "font-display border-b border-white/10 py-4 text-4xl transition-colors animate-in fade-in-0 slide-in-from-left-4 fill-mode-both",
                isActive(pathname, item.href) ? "text-primary" : "text-foreground hover:text-primary",
              )}
              style={{ animationDelay: `${80 + i * 60}ms`, animationDuration: "400ms" }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/conta" onClick={() => setOpen(false)} className="font-display py-4 text-4xl text-foreground/70 hover:text-primary">
            Minha conta
          </Link>
        </nav>
        <div className="mt-auto space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{address}</p>
          <p className="flex items-center gap-2"><Clock className="size-4 text-primary" />{hours}</p>
          <p className="flex items-center gap-2"><Phone className="size-4 text-primary" />{phone}</p>
          <Button asChild className="mt-2 w-full" size="lg">
            <Link href="/cardapio" onClick={() => setOpen(false)}>Pedir agora</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
