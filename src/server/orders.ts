import "server-only";
import crypto from "node:crypto";
import type { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { ADMIN_TRANSITIONS, CUSTOMER_EDITABLE, ORDER_STATUS_LABEL } from "@/lib/constants";
import { refundPayment } from "@/server/payments";
import { sendStatusEmail } from "@/server/email";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderCode() {
  const bytes = crypto.randomBytes(6);
  let out = "SH-";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

/** Busca um pedido garantindo que pertence ao usuário (ou admin). */
export async function getOrderForUser(code: string, user: { id: string; role: string }) {
  const order = await db.order.findUnique({
    where: { code },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) return null;
  if (order.userId !== user.id && user.role !== "ADMIN") return null;
  return order;
}

export async function cancelOrderAsCustomer(code: string, userId: string) {
  const order = await db.order.findUnique({ where: { code } });
  if (!order || order.userId !== userId) return { ok: false as const, error: "Pedido não encontrado" };
  if (!CUSTOMER_EDITABLE.includes(order.status)) {
    return { ok: false as const, error: "Este pedido já está em preparo e não pode ser cancelado" };
  }
  if (order.paymentStatus === "PAID") {
    try {
      await refundPayment(order);
    } catch {
      return { ok: false as const, error: "Não foi possível estornar o pagamento. Fale com a loja." };
    }
  }
  const res = await db.order.updateMany({
    where: { id: order.id, status: { in: CUSTOMER_EDITABLE } },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : order.paymentStatus,
    },
  });
  if (!res.count) return { ok: false as const, error: "O pedido mudou de status. Atualize a página." };
  await db.orderEvent.create({
    data: { orderId: order.id, status: "CANCELLED", note: order.paymentStatus === "PAID" ? "Cancelado pelo cliente · estorno" : "Cancelado pelo cliente" },
  });
  return { ok: true as const };
}

export async function changeStatusAsAdmin(orderId: string, next: OrderStatus) {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, error: "Pedido não encontrado" };
  if (!ADMIN_TRANSITIONS[order.status].includes(next)) {
    return { ok: false as const, error: `Não é possível ir de "${ORDER_STATUS_LABEL[order.status]}" para "${ORDER_STATUS_LABEL[next]}"` };
  }
  let paymentStatus = order.paymentStatus;
  if (next === "CANCELLED" && order.paymentStatus === "PAID") {
    try {
      await refundPayment(order);
      paymentStatus = "REFUNDED";
    } catch {
      return { ok: false as const, error: "Falha ao estornar no provedor de pagamento" };
    }
  }
  const res = await db.order.updateMany({
    where: { id: orderId, status: order.status },
    data: { status: next, paymentStatus, cancelledAt: next === "CANCELLED" ? new Date() : undefined },
  });
  if (!res.count) return { ok: false as const, error: "O pedido foi alterado por outra pessoa. Atualize." };
  await db.orderEvent.create({ data: { orderId, status: next, note: "Atualizado pela loja" } });
  await sendStatusEmail(order, ORDER_STATUS_LABEL[next]);
  return { ok: true as const };
}
