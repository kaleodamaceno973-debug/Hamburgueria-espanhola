import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin, Store, CalendarClock } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { StatusBadge, PaymentBadge } from "@/components/orders/status-badge";
import { StatusChanger } from "@/components/admin/status-changer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatBRL, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Pedido" };

async function Detail({ params }: { params: PageProps<"/admin/pedidos/[code]">["params"] }) {
  await requireAdmin();
  const { code } = await params;
  const o = await db.order.findUnique({ where: { code }, include: { items: true, events: { orderBy: { createdAt: "desc" } } } });
  if (!o) notFound();
  const phone = o.customerPhone.replace(/\D/g, "");
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl sm:text-5xl"><span className="slant">{o.code}</span></h1>
        <StatusBadge status={o.status} />
        <PaymentBadge status={o.paymentStatus} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Criado em {formatDateTime(o.createdAt)} · {o.paymentMethod === "PIX" ? "Pix" : "Cartão"} · {o.paymentProvider}</p>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <p className="mb-3 text-sm font-semibold">Avançar pedido</p>
        <StatusChanger orderId={o.id} status={o.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
          <h2 className="font-bold">Itens</h2>
          <ul className="mt-4 space-y-3">
            {o.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-lg bg-white/5">{i.imageUrl && <Image src={i.imageUrl} alt="" fill sizes="48px" className="object-cover" />}</div>
                <p className="flex-1 text-sm"><b>{i.quantity}×</b> {i.name} <span className="text-muted-foreground">({formatBRL(i.unitPriceCents)})</span></p>
                <p className="text-sm font-semibold tabular-nums">{formatBRL(i.totalCents)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatBRL(o.subtotalCents)}</dd></div>
            {o.discountCents > 0 && <div className="flex justify-between text-success"><dt>Desconto ({o.couponCode})</dt><dd>− {formatBRL(o.discountCents)}</dd></div>}
            <div className="flex justify-between"><dt>Entrega</dt><dd>{formatBRL(o.deliveryFeeCents)}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="text-gold">{formatBRL(o.totalCents)}</dd></div>
          </dl>
          {o.notes && <p className="mt-4 rounded-xl bg-accent/10 p-3 text-sm"><b>Obs.:</b> {o.notes}</p>}
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#15110d] p-5 text-sm">
            <h2 className="font-bold">Cliente</h2>
            <p className="mt-3 font-semibold">{o.customerName}</p>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground"><Mail className="size-4" />{o.customerEmail}</p>
            <p className="mt-1 flex items-center gap-2 text-muted-foreground"><Phone className="size-4" />{o.customerPhone}</p>
            {o.fulfillment === "DELIVERY" ? (
              <p className="mt-3 flex gap-2"><MapPin className="mt-0.5 size-4 text-primary" />{o.addressStreet}, {o.addressNumber} — {o.addressDistrict}, {o.addressCity} {o.addressExtra && `(${o.addressExtra})`}</p>
            ) : (
              <p className="mt-3 flex gap-2"><Store className="size-4 text-primary" />Retirada no balcão</p>
            )}
            {o.scheduledFor && <p className="mt-2 flex gap-2 text-primary"><CalendarClock className="size-4" />Agendado: {formatDateTime(o.scheduledFor)}</p>}
            <Button asChild variant="outline" size="sm" className="mt-4 border-[#25D366]/40 text-[#25D366]">
              <a href={whatsappOrderLink(o, `55${phone.replace(/^55/, "")}`, `Olá, ${o.customerName}! Aqui é a Smash House sobre o seu pedido:`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Falar com o cliente
              </a>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
            <h2 className="font-bold">Histórico</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {o.events.map((e) => (
                <li key={e.id} className="flex justify-between gap-3">
                  <span>{ORDER_STATUS_LABEL[e.status]}{e.note && <span className="text-muted-foreground"> · {e.note}</span>}</span>
                  <span className="shrink-0 text-muted-foreground">{formatDateTime(e.createdAt)}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}

export default function AdminOrderPage({ params }: PageProps<"/admin/pedidos/[code]">) {
  return (
    <>
      <Link href="/admin/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Pedidos</Link>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <Detail params={params} />
      </Suspense>
    </>
  );
}
