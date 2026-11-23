"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, FileText, Mail, ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/conteudo", label: "Textos & banners", icon: FileText },
  { href: "/admin/mensagens", label: "Mensagens & e-mails", icon: Mail },
];

export function AdminNav() {
  return (
    <Suspense fallback={<AdminNavView pathname="" />}>
      <AdminNavLive />
    </Suspense>
  );
}
function AdminNavLive() {
  return <AdminNavView pathname={usePathname()} />;
}
function AdminNavView({ pathname }: { pathname: string }) {
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col">
      {ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={active(href) ? "page" : undefined}
          className={cn(
            "flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
            active(href) ? "bg-primary text-black" : "text-foreground/70 hover:bg-white/5 hover:text-foreground",
          )}
        >
          <Icon className="size-4" /> {label}
        </Link>
      ))}
      <div className="hidden lg:mt-6 lg:block lg:border-t lg:border-white/10 lg:pt-4" />
      <Link href="/" className="flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm text-foreground/60 hover:bg-white/5 hover:text-foreground">
        <ExternalLink className="size-4" /> Ver site
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="flex h-10 w-full shrink-0 items-center gap-3 rounded-xl px-3 text-sm text-foreground/60 hover:bg-red-500/10 hover:text-red-300">
          <LogOut className="size-4" /> Sair
        </button>
      </form>
    </nav>
  );
}
