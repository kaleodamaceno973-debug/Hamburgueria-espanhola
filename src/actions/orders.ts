"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CUSTOMER_EDITABLE } from "@/lib/constants";
import { isValidSlot } from "@/lib/schedule";
import { rescheduleSchema } from "@/lib/validation";
import { getSessionUser } from "@/server/session";
import { cancelOrderAsCustomer } from "@/server/orders";
import { createCheckout, paymentProvider, simulateDemoPayment } from "@/server/payments";

type Result = { ok: boolean; error?: string };

async function ownOrder(code: string) {
  const user = await getSessionUser();
  if (!user) return { user: null, order: null };
  const order = await db.order.findUnique({ where: { code }, include: { items: true } });
  if (!order || order.userId !== user.id) return { user, order: null };
  return { user, order };
}

export async function cancelOrderAction(code: string): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Entre novamente." };
  const res = await cancelOrderAsCustomer(String(code), user.id);
  revalidatePath(`/pedido/${code}`);
  return res;
}

export async function rescheduleOrderAction(code: string, scheduledFor: string): Promise<Result> {
  const parsed = rescheduleSchema.safeParse({ code, scheduledFor });
  if (!parsed.success) return { ok: false, error: "Horário inválido." };
  if (!isValidSlot(parsed.data.scheduledFor)) return { ok: false, error: "Horário indisponível." };
  const { order } = await ownOrder(parsed.data.code);
  if (!order) return { ok: false, error: "Pedido não encontrado." };
  if (!CUSTOMER_EDITABLE.includes(order.status)) return { ok: false, error: "O pedido já está em preparo." };
  const res = await db.order.updateMany({
    where: { id: order.id, status: { in: CUSTOMER_EDITABLE } },
    data: { scheduledFor: new Date(parsed.data.scheduledFor) },
  });
  if (!res.count) return { ok: false, error: "O pedido mudou de status." };
  await db.orderEvent.create({ data: { orderId: order.id, status: order.status, note: "Horário remarcado pelo cliente" } });
  revalidatePath(`/pedido/${code}`);
  return { ok: true };
}

/** Modo demo: dispara o mesmo fluxo de webhook assinado do Stripe. */
export async function simulatePaymentAction(code: string, card?: string): Promise<Result> {
  const { order } = await ownOrder(String(code));
  if (!order) return { ok: false, error: "Pedido não encontrado." };
  if (paymentProvider() !== "demo") return { ok: false, error: "Indisponível neste ambiente." };
  if (order.status !== "PENDING_PAYMENT") redirect(`/pedido/${order.code}`);
  if (card !== undefined) {
    const digits = card.replace(/\D/g, "");
    if (!luhn(digits)) return { ok: false, error: "Número de cartão inválido." };
    if (digits === "4000000000000002") {
      await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
      return { ok: false, error: "Cartão recusado pelo emissor (cartão de teste de recusa)." };
    }
  }
  await simulateDemoPayment(order);
  redirect(`/pedido/${order.code}?pagamento=ok`);
}

export async function retryPaymentAction(code: string): Promise<Result> {
  const { order } = await ownOrder(String(code));
  if (!order) return { ok: false, error: "Pedido não encontrado." };
  if (order.status !== "PENDING_PAYMENT") return { ok: false, error: "Este pedido não aguarda pagamento." };
  const session = await createCheckout(order);
  await db.order.update({ where: { id: order.id }, data: { checkoutSessionId: session.sessionId, paymentStatus: "PENDING" } });
  redirect(session.url);
}

function luhn(num: string) {
  if (num.length < 13 || num.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}
