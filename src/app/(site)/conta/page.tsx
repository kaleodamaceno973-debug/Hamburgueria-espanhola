import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/server/session";
import { StatusBadge } from "@/components/orders/status-badge";
import { EmptyState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatBRL, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Meus pedidos", robots: { index: false } };

async function Orders({ searchParams }: { searchParams: PageProps<"/conta">["searchParams"] }) {
  const user = await requireUser("/conta");
  const sp = await searchParams;
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: { take: 3 } },
  });
  const active = orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
  return (
    <div className="space-y-6">
      {sp.erro === "acesso" && (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">Você não tem permissão para acessar a área administrativa.</p>
      )}
      <p className="text-muted-foreground">Olá, <b className="text-foreground">{user.name ?? user.email}</b>! {active.length > 0 ? `Você tem ${active.length} pedido(s) em andamento.` : ""}</p>
      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="Nenhum pedido ainda"
          description="Seu primeiro smash está a poucos cliques — e com 20% off usando PRIMEIRA20."
          action={<Button asChild><Link href="/cardapio">Ver cardápio</Link></Button>}
        />
      ) : (
        <ul className="grid gap-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/pedido/${o.code}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-primary/40 sm:p-5">
                <div className="hidden -space-x-3 sm:flex">
                  {o.items.map((i) => (
                    <div key={i.id} className="relative size-12 overflow-hidden rounded-full border-2 border-[#0a0806] bg-white/5">
                      {i.imageUrl && <Image src={i.imageUrl} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold">{o.code}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{formatDateTime(o.createdAt)} · {o.items.map((i) => i.name).join(", ")}</p>
                </div>
                <p className="font-bold tabular-nums">{formatBRL(o.totalCents)}</p>
                <ChevronRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AccountPage({ searchParams }: PageProps<"/conta">) {
  return (
    <Suspense fallback={<div className="grid gap-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-20" />)}</div>}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}
