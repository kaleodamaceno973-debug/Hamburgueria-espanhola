import Image from "next/image";
import { MapPin, Store, CalendarClock, MessageCircle, Receipt } from "lucide-react";
import type { Order, OrderItem, OrderEvent } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CUSTOMER_EDITABLE } from "@/lib/constants";
import { availableSlots } from "@/lib/schedule";
import { formatBRL, formatDateTime } from "@/lib/utils";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { paymentProvider } from "@/server/payments";
import { OrderLive } from "./order-live";
import { OrderActions } from "./order-actions";
import { PaymentBadge, StatusBadge } from "./status-badge";

type Full = Order & { items: OrderItem[]; events: OrderEvent[] };

export function OrderDetail({ order, justPaid }: { order: Full; justPaid?: boolean }) {
  const canEdit = CUSTOMER_EDITABLE.includes(order.status);
  return (
    <div className="space-y-6">
      {justPaid && order.status !== "CANCELLED" && (
        <div role="status" className="rounded-3xl border border-success/30 bg-success/10 p-5 animate-in fade-in-0 slide-in-from-top-2">
          <p className="text-lg font-extrabold text-success">Pedido recebido! 🎉</p>
          <p className="text-sm text-foreground/80">
            {order.status === "PENDING_PAYMENT" ? "Estamos confirmando seu pagamento — esta página atualiza sozinha." : "Pagamento confirmado. Enviamos os detalhes para o seu e-mail."}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={order.status} />
        <PaymentBadge status={order.paymentStatus} />
        <span className="text-sm text-muted-foreground">Feito em {formatDateTime(order.createdAt)}</span>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
            <OrderLive
              code={order.code}
              fulfillment={order.fulfillment}
              initial={{
                status: order.status,
                paymentStatus: order.paymentStatus,
                events: order.events.map((e) => ({ status: e.status, note: e.note, createdAt: e.createdAt.toISOString() })),
              }}
            />
          </section>
          <OrderActions
            code={order.code}
            canEdit={canEdit}
            pendingPayment={order.status === "PENDING_PAYMENT"}
            provider={paymentProvider()}
            scheduled={!!order.scheduledFor}
            slots={canEdit ? availableSlots() : []}
          />
        </div>

        <section className="rounded-3xl border border-white/10 bg-[#120e0b] p-5 sm:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Receipt className="size-5 text-primary" /> Resumo</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white/5">
                  {i.imageUrl && <Image src={i.imageUrl} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <p className="min-w-0 flex-1 text-sm"><b>{i.quantity}×</b> {i.name}</p>
                <p className="text-sm font-semibold tabular-nums">{formatBRL(i.totalCents)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(order.subtotalCents)}</dd></div>
            {order.discountCents > 0 && <div className="flex justify-between text-success"><dt>Desconto {order.couponCode && `(${order.couponCode})`}</dt><dd>− {formatBRL(order.discountCents)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>{order.deliveryFeeCents ? formatBRL(order.deliveryFeeCents) : "Grátis"}</dd></div>
            <div className="flex justify-between pt-2 text-base font-extrabold"><dt>Total</dt><dd className="text-gold">{formatBRL(order.totalCents)}</dd></div>
          </dl>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-foreground/80">
            {order.fulfillment === "DELIVERY" ? (
              <p className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{order.addressStreet}, {order.addressNumber} — {order.addressDistrict}, {order.addressCity}{order.addressExtra ? ` (${order.addressExtra})` : ""}</p>
            ) : (
              <p className="flex gap-2"><Store className="mt-0.5 size-4 shrink-0 text-primary" />Retirada no balcão</p>
            )}
            {order.scheduledFor && <p className="flex gap-2"><CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" />Agendado para {formatDateTime(order.scheduledFor)}</p>}
            {order.notes && <p className="text-muted-foreground">Obs.: {order.notes}</p>}
          </div>
          <Button asChild variant="outline" className="mt-5 w-full border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:text-[#25D366]">
            <a href={whatsappOrderLink(order)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" /> Enviar resumo no WhatsApp
            </a>
          </Button>
        </section>
      </div>
    </div>
  );
}
