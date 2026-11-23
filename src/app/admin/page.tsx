import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, ChefHat, DollarSign, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { getDashboardStats } from "@/server/admin-stats";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { StatusBadge } from "@/components/orders/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { formatBRL, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

function Kpi({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums sm:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

async function Dashboard() {
  const admin = await requireAdmin();
  const [s, latest] = await Promise.all([
    getDashboardStats(),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const diff = s.yesterday.revenueCents ? Math.round(((s.today.revenueCents - s.yesterday.revenueCents) / s.yesterday.revenueCents) * 100) : null;
  return (
    <>
      <AutoRefresh seconds={20} />
      <p className="text-muted-foreground">Olá, {admin.name ?? "admin"}. Veja como está a chapa hoje.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Faturamento hoje" value={formatBRL(s.today.revenueCents)} sub={diff === null ? "—" : `${diff >= 0 ? "▲" : "▼"} ${Math.abs(diff)}% vs. ontem`} icon={DollarSign} />
        <Kpi label="Pedidos pagos hoje" value={String(s.today.orders)} sub={`${s.pendingToday} aguardando pagamento`} icon={ShoppingBag} />
        <Kpi label="Na cozinha / rua" value={String(s.inKitchen)} sub="pagos, em preparo ou a caminho" icon={ChefHat} />
        <Kpi label="Ticket médio (30d)" value={formatBRL(s.avgTicket)} sub={`${formatBRL(s.revenue30)} em ${s.orders30} pedidos`} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
          <RevenueChart data={s.days} />
        </section>
        <section className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
          <h2 className="font-bold">Mais vendidos (30d)</h2>
          {s.top.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Sem vendas no período.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {s.top.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-white/5 text-xs font-bold">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-[#e8640f]" style={{ width: `${(t.quantity / s.top[0].quantity) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{t.quantity} un.</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#15110d] p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Ver todos <ArrowUpRight className="size-4" /></Link>
        </div>
        {latest.length === 0 ? (
          <EmptyState className="mt-4" icon={<Receipt className="size-6" />} title="Nenhum pedido ainda" />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr><th className="pb-2">Pedido</th><th className="pb-2">Cliente</th><th className="pb-2">Status</th><th className="pb-2">Data</th><th className="pb-2 text-right">Total</th></tr>
              </thead>
              <tbody>
                {latest.map((o) => (
                  <tr key={o.id} className="border-t border-white/5">
                    <td className="py-2.5"><Link href={`/admin/pedidos/${o.code}`} className="font-semibold hover:text-primary">{o.code}</Link></td>
                    <td className="py-2.5">{o.customerName}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-muted-foreground">{formatDateTime(o.createdAt)}</td>
                    <td className="py-2.5 text-right font-semibold tabular-nums">{formatBRL(o.totalCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="font-display text-4xl sm:text-5xl"><span className="slant">Dashboard</span></h1>
      <div className="mt-2">
        <Suspense
          fallback={
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
              <Skeleton className="h-80" />
            </div>
          }
        >
          <Dashboard />
        </Suspense>
      </div>
    </>
  );
}
