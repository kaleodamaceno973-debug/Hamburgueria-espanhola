import "server-only";
import { db } from "@/lib/db";

const SP = -3 * 60 * 60_000;
/** Chave AAAA-MM-DD no fuso de São Paulo. */
const spDay = (d: Date) => new Date(d.getTime() + SP).toISOString().slice(0, 10);

export async function getDashboardStats() {
  const now = new Date();
  const since = new Date(now.getTime() - 30 * 86400_000);
  const orders = await db.order.findMany({
    where: { createdAt: { gte: since } },
    select: { totalCents: true, paymentStatus: true, status: true, createdAt: true },
  });

  const days: { date: string; label: string; revenueCents: number; orders: number }[] = [];
  const idx = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const key = spDay(new Date(now.getTime() - i * 86400_000));
    idx.set(key, days.length);
    days.push({ date: key, label: `${key.slice(8, 10)}/${key.slice(5, 7)}`, revenueCents: 0, orders: 0 });
  }
  for (const o of orders) {
    if (o.paymentStatus !== "PAID") continue;
    const i = idx.get(spDay(o.createdAt));
    if (i === undefined) continue;
    days[i].revenueCents += o.totalCents;
    days[i].orders += 1;
  }

  const today = days[days.length - 1];
  const yesterday = days[days.length - 2];
  const revenue30 = days.reduce((s, d) => s + d.revenueCents, 0);
  const orders30 = days.reduce((s, d) => s + d.orders, 0);
  const todayKey = spDay(now);
  const pendingToday = orders.filter((o) => spDay(o.createdAt) === todayKey && o.status === "PENDING_PAYMENT").length;
  const inKitchen = await db.order.count({ where: { status: { in: ["PAID", "PREPARING", "READY", "OUT_FOR_DELIVERY"] } } });

  const top = await db.orderItem.groupBy({
    by: ["name"],
    where: { order: { paymentStatus: "PAID", createdAt: { gte: since } } },
    _sum: { quantity: true, totalCents: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  return {
    days,
    today,
    yesterday,
    revenue30,
    orders30,
    avgTicket: orders30 ? Math.round(revenue30 / orders30) : 0,
    pendingToday,
    inKitchen,
    top: top.map((t) => ({ name: t.name, quantity: t._sum.quantity ?? 0, revenueCents: t._sum.totalCents ?? 0 })),
  };
}

export function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400_000);
}
