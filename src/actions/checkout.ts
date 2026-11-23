"use server";

import { db } from "@/lib/db";
import { checkoutSchema, fieldErrors, quoteSchema, type CheckoutInput } from "@/lib/validation";
import { PRICING } from "@/lib/constants";
import { isValidSlot } from "@/lib/schedule";
import { formatBRL } from "@/lib/utils";
import { computeQuote, type Quote } from "@/server/pricing";
import { createCheckout, paymentProvider } from "@/server/payments";
import { generateOrderCode } from "@/server/orders";
import { getSessionUser } from "@/server/session";

export async function quoteAction(input: unknown): Promise<{ ok: true; quote: Quote } | { ok: false; error: string }> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Carrinho inválido" };
  const user = await getSessionUser();
  const quote = await computeQuote({ ...parsed.data, userId: user?.id });
  return { ok: true, quote };
}

export type PlaceOrderResult =
  | { ok: true; redirectUrl: string; external: boolean; code: string }
  | { ok: false; error?: string; errors?: Record<string, string> };

export async function placeOrderAction(input: CheckoutInput): Promise<PlaceOrderResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sua sessão expirou. Entre novamente." };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), error: "Revise os campos destacados." };
  const data = parsed.data;

  const scheduledFor = data.scheduledFor ? data.scheduledFor : null;
  if (scheduledFor && !isValidSlot(scheduledFor)) {
    return { ok: false, errors: { scheduledFor: "Horário indisponível. Escolha outro." } };
  }

  // Preço calculado aqui, a partir do banco — nunca do cliente.
  const quote = await computeQuote({ items: data.items, fulfillment: data.fulfillment, couponCode: data.couponCode, userId: user.id });
  if (quote.unavailable.length) return { ok: false, error: "Alguns itens ficaram indisponíveis. Atualize o carrinho." };
  if (quote.lines.length === 0) return { ok: false, error: "Seu carrinho está vazio." };
  if (quote.subtotalCents < PRICING.minOrderCents) {
    return { ok: false, error: `Pedido mínimo de ${formatBRL(PRICING.minOrderCents)}.` };
  }
  if (data.couponCode && !quote.coupon?.valid) return { ok: false, errors: { couponCode: quote.coupon?.message ?? "Cupom inválido" } };

  const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { email: true } });
  if (!dbUser) return { ok: false, error: "Conta não encontrada." };

  let order = null;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    try {
      order = await db.order.create({
        data: {
          code: generateOrderCode(),
          userId: user.id,
          paymentMethod: data.paymentMethod,
          paymentProvider: paymentProvider(),
          fulfillment: data.fulfillment,
          subtotalCents: quote.subtotalCents,
          deliveryFeeCents: quote.deliveryFeeCents,
          discountCents: quote.discountCents,
          totalCents: quote.totalCents,
          couponCode: quote.coupon?.valid ? quote.coupon.code : null,
          customerName: data.name,
          customerEmail: dbUser.email,
          customerPhone: data.phone,
          addressStreet: data.fulfillment === "DELIVERY" ? data.address?.street : null,
          addressNumber: data.fulfillment === "DELIVERY" ? data.address?.number : null,
          addressDistrict: data.fulfillment === "DELIVERY" ? data.address?.district : null,
          addressCity: data.fulfillment === "DELIVERY" ? data.address?.city : null,
          addressExtra: data.fulfillment === "DELIVERY" ? data.address?.extra || null : null,
          notes: data.notes || null,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          items: {
            create: quote.lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              imageUrl: l.imageUrl,
              unitPriceCents: l.unitPriceCents,
              quantity: l.quantity,
              totalCents: l.totalCents,
            })),
          },
          events: { create: { status: "PENDING_PAYMENT", note: "Pedido criado" } },
        },
        include: { items: true },
      });
    } catch (e) {
      // colisão de código (unique) → tenta outro
      if (!(e instanceof Error && e.message.includes("Unique"))) throw e;
    }
  }
  if (!order) return { ok: false, error: "Não foi possível criar o pedido. Tente novamente." };

  // Salva telefone no perfil para próximas compras.
  await db.user.update({ where: { id: user.id }, data: { phone: data.phone, name: data.name } }).catch(() => null);

  try {
    const session = await createCheckout(order);
    await db.order.update({ where: { id: order.id }, data: { checkoutSessionId: session.sessionId } });
    return { ok: true, redirectUrl: session.url, external: session.url.startsWith("http"), code: order.code };
  } catch {
    await db.order.update({ where: { id: order.id }, data: { status: "CANCELLED", cancelledAt: new Date() } });
    return { ok: false, error: "O provedor de pagamento não respondeu. Nenhuma cobrança foi feita — tente de novo." };
  }
}
