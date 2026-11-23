import Link from "next/link";
import { Suspense } from "react";
import { Search, Receipt } from "lucide-react";
import type { OrderStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { daysAgo } from "@/server/admin-stats";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { StatusBadge, PaymentBadge } from "@/components/orders/status-badge";
import { StatusChanger } from "@/components/admin/status-changer";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { EmptyState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn, formatBRL, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Pedidos" };

const STATUS_KEYS = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];
const PERIODS = { hoje: 1, "7d": 7, "30d": 30, todos: 0 } as const;

async function Orders({ searchParams }: { searchParams: PageProps<"/admin/pedidos">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && STATUS_KEYS.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 60) : "";
  const period = typeof sp.periodo === "string" && sp.periodo in PERIODS ? (sp.periodo as keyof typeof PERIODS) : "30d";
  const days = PERIODS[period];

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(days ? { createdAt: { gte: daysAgo(days) } } : {}),
    ...(q ? { OR: [{ code: { contains: q.toUpperCase() } }, { customerName: { contains: q } }, { customerEmail: { contains: q.toLowerCase() } }] } : {}),
  };
  const [orders, counts] = await Promise.all([
    db.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { items: true } } } }),
    db.order.groupBy({ by: ["status"], _count: true, where: days ? { createdAt: { gte: daysAgo(days) } } : {} }),
  ]);
  const countOf = (s: OrderStatus) => counts.find((c) => c.status === s)?._count ?? 0;
  const href = (p: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, q: q || undefined, periodo: period, ...p };
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v));
    return `/admin/pedidos?${params.toString()}`;
  };

  return (
    <>
      <AutoRefresh seconds={15} />
      <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/admin/pedidos">
        <input type="hidden" name="periodo" value={period} />
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="q" className="sr-only">Buscar pedidos</label>
          <input id="q" name="q" defaultValue={q} placeholder="Código, nome ou e-mail" className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] pl-9 pr-3 outline-none focus:border-primary" />
        </div>
        <div className="flex gap-1 rounded-xl border border-white/10 p-1">
          {(Object.keys(PERIODS) as (keyof typeof PERIODS)[]).map((p) => (
            <Link key={p} href={href({ periodo: p })} className={cn("rounded-lg px-3 py-2 text-sm font-semibold", period === p ? "bg-primary text-black" : "text-foreground/70 hover:bg-white/5")}>
              {p === "hoje" ? "Hoje" : p === "todos" ? "Tudo" : p}
            </Link>
          ))}
        </div>
        <Button type="submit" variant="secondary">Buscar</Button>
      </form>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        <Link href={href({ status: undefined })} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold", !status ? "border-primary bg-primary text-black" : "border-white/15")}>
          Todos
        </Link>
        {STATUS_KEYS.map((s) => (
          <Link key={s} href={href({ status: s })} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold", status === s ? "border-primary bg-primary text-black" : "border-white/15 text-foreground/80")}>
            {ORDER_STATUS_LABEL[s]} <span className="opacity-60">{countOf(s)}</span>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState className="mt-6" icon={<Receipt className="size-6" />} title="Nenhum pedido encontrado" description="Ajuste os filtros ou o período." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-white/[0.03] text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pedido</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Status</th><th className="px-4 py-3">Pagamento</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/5 align-middle">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${o.code}`} className="font-bold hover:text-primary">{o.code}</Link>
                    <p className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">{o.customerName}<p className="text-xs text-muted-foreground">{o._count.items} itens</p></td>
                  <td className="px-4 py-3">{o.fulfillment === "DELIVERY" ? "Entrega" : "Retirada"}{o.scheduledFor && <p className="text-xs text-primary">⏱ {formatDateTime(o.scheduledFor)}</p>}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={o.paymentStatus} /> <span className="text-xs text-muted-foreground">{o.paymentMethod === "PIX" ? "Pix" : "Cartão"}</span></td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatBRL(o.totalCents)}</td>
                  <td className="px-4 py-3"><StatusChanger orderId={o.id} status={o.status} compact /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminOrdersPage({ searchParams }: PageProps<"/admin/pedidos">) {
  return (
    <>
      <h1 className="font-display text-4xl sm:text-5xl"><span className="slant">Pedidos</span></h1>
      <Suspense fallback={<div className="mt-6 space-y-3"><Skeleton className="h-11" /><Skeleton className="h-96" /></div>}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </>
  );
}
