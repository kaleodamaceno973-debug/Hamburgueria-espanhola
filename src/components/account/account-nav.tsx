"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Package, UserRound } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function AccountNav() {
  return (
    <Suspense fallback={<AccountNavView pathname="" />}>
      <AccountNavLive />
    </Suspense>
  );
}
function AccountNavLive() {
  return <AccountNavView pathname={usePathname()} />;
}
function AccountNavView({ pathname }: { pathname: string }) {
  const items = [
    { href: "/conta", label: "Meus pedidos", icon: Package },
    { href: "/conta/perfil", label: "Perfil", icon: UserRound },
  ];
  return (
    <nav aria-label="Conta" className="no-scrollbar flex gap-2 overflow-x-auto">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={cn(
            "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
            pathname === href ? "border-primary bg-primary text-black" : "border-white/15 hover:border-white/30",
          )}
        >
          <Icon className="size-4" /> {label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button type="submit" className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-foreground/70 transition hover:border-red-500/50 hover:text-red-300">
          <LogOut className="size-4" /> Sair
        </button>
      </form>
    </nav>
  );
}
