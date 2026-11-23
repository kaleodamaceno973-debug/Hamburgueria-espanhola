import Link from "next/link";
import { LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/server/session";

export async function AccountButton() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon">
        <Link href="/entrar" aria-label="Entrar na sua conta"><User className="size-5" /></Link>
      </Button>
    );
  }
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-1">
      {user.role === "ADMIN" && (
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin" aria-label="Painel administrativo"><LayoutDashboard className="size-5" /></Link>
        </Button>
      )}
      <Link
        href="/conta"
        aria-label="Minha conta"
        className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-gold to-flame text-sm font-extrabold text-black ring-2 ring-white/10 transition hover:ring-primary"
      >
        {initial}
      </Link>
    </div>
  );
}
