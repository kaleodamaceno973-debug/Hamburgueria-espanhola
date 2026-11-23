import "server-only";
import crypto from "node:crypto";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";
import { sendOrderConfirmation } from "@/server/email";

export type PaymentProvider = "demo" | "stripe";

export function paymentProvider(): PaymentProvider {
  return process.env.PAYMENT_PROVIDER === "stripe" && process.env.STRIPE_SECRET_KEY ? "stripe" : "demo";
}

let _stripe: Stripe | null = null;
function stripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY não configurada");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** Utilitário só de assinatura (não faz chamadas de rede). */
const signer = new Stripe("sk_test_signature_only");

/**
 * Segredo usado para verificar a assinatura do webhook.
 * Em modo demo, deriva um segredo do AUTH_SECRET (nada fixo no código).
 */
export function webhookSecret() {
  if (process.env.STRIPE_WEBHOOK_SECRET) return process.env.STRIPE_WEBHOOK_SECRET;
  if (paymentProvider() === "stripe") throw new Error("STRIPE_WEBHOOK_SECRET não configurada");
  const base = process.env.AUTH_SECRET;
  if (!base) throw new Error("AUTH_SECRET não configurada");
  return "whsec_" + crypto.createHmac("sha256", base).update("smash-house-demo-webhook").digest("hex");
}

export function verifyWebhook(payload: string, signature: string | null): Stripe.Event {
  if (!signature) throw new Error("Assinatura ausente");
  return signer.webhooks.constructEvent(payload, signature, webhookSecret());
}

type OrderForCheckout = {
  id: string;
  code: string;
  customerEmail: string;
  paymentMethod: "PIX" | "CARD";
  items: { name: string; unitPriceCents: number; quantity: number }[];
  deliveryFeeCents: number;
  discountCents: number;
  totalCents: number;
};

/** Cria a sessão de pagamento e devolve a URL para redirecionar o cliente. */
export async function createCheckout(order: OrderForCheckout): Promise<{ url: string; sessionId: string }> {
  if (paymentProvider() === "demo") {
    const sessionId = `cs_demo_${crypto.randomBytes(12).toString("hex")}`;
    return { url: `/pagamento/demo/${order.code}`, sessionId };
  }

  const allowed = (process.env.STRIPE_PAYMENT_METHODS || "card")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is "card" | "pix" => s === "card" || s === "pix");
  const methods: ("card" | "pix")[] = order.paymentMethod === "PIX" && allowed.includes("pix") ? ["pix"] : ["card"];

  // Uma única linha com o total calculado no servidor (inclui desconto e frete).
  const description = order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ").slice(0, 480);
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    allowed_payment_method_types: methods,
    customer_email: order.customerEmail,
    client_reference_id: order.id,
    metadata: { orderId: order.id, code: order.code },
    payment_intent_data: { metadata: { orderId: order.id, code: order.code } },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: order.totalCents,
          product_data: { name: `Pedido ${order.code} — Smash House`, description },
        },
      },
    ],
    success_url: siteUrl(`/pedido/${order.code}?pagamento=ok`),
    cancel_url: siteUrl(`/pedido/${order.code}?pagamento=cancelado`),
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });
  if (!session.url) throw new Error("Stripe não retornou URL de checkout");
  return { url: session.url, sessionId: session.id };
}

export async function refundPayment(order: { paymentProvider: string; paymentIntentId: string | null }) {
  if (order.paymentProvider === "stripe" && order.paymentIntentId) {
    await stripe().refunds.create({ payment_intent: order.paymentIntentId });
  }
}

async function markPaid(orderId: string, paymentIntentId: string | null) {
  const updated = await db.order.updateMany({
    where: { id: orderId, status: "PENDING_PAYMENT" },
    data: { status: "PAID", paymentStatus: "PAID", paidAt: new Date(), paymentIntentId },
  });
  if (updated.count === 0) return; // já processado ou cancelado
  await db.orderEvent.create({ data: { orderId, status: "PAID", note: "Pagamento confirmado via webhook" } });
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (order) await sendOrderConfirmation(order);
}

async function markFailed(orderId: string) {
  await db.order.updateMany({
    where: { id: orderId, status: "PENDING_PAYMENT" },
    data: { paymentStatus: "FAILED" },
  });
}

async function markExpired(orderId: string) {
  const updated = await db.order.updateMany({
    where: { id: orderId, status: "PENDING_PAYMENT" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
  if (updated.count) await db.orderEvent.create({ data: { orderId, status: "CANCELLED", note: "Pagamento expirou" } });
}

/** Processa um evento já verificado. Idempotente por event.id. */
export async function handleStripeEvent(event: Stripe.Event) {
  const already = await db.webhookEvent.findUnique({ where: { id: event.id } });
  if (already) return { duplicate: true };

  if (event.type.startsWith("checkout.session.")) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const order = orderId
      ? await db.order.findUnique({ where: { id: orderId }, select: { id: true, checkoutSessionId: true } })
      : null;
    // A sessão precisa ser exatamente a que criamos para o pedido.
    if (order && order.checkoutSessionId === session.id) {
      const pi = typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
      switch (event.type) {
        case "checkout.session.completed":
          if (session.payment_status === "paid") await markPaid(order.id, pi);
          break;
        case "checkout.session.async_payment_succeeded":
          await markPaid(order.id, pi);
          break;
        case "checkout.session.async_payment_failed":
          await markFailed(order.id);
          break;
        case "checkout.session.expired":
          await markExpired(order.id);
          break;
      }
    }
  }

  await db.webhookEvent.create({ data: { id: event.id, type: event.type } }).catch(() => null);
  return { duplicate: false };
}

/**
 * Modo demo: gera um evento no formato Stripe, assina com o segredo do
 * webhook e passa pela MESMA verificação de assinatura do endpoint real.
 */
export async function simulateDemoPayment(order: { id: string; checkoutSessionId: string | null }) {
  if (paymentProvider() !== "demo") throw new Error("Simulação disponível apenas em modo demo");
  const payload = JSON.stringify({
    id: `evt_demo_${crypto.randomBytes(10).toString("hex")}`,
    object: "event",
    type: "checkout.session.completed",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: order.checkoutSessionId,
        object: "checkout.session",
        payment_status: "paid",
        payment_intent: `pi_demo_${crypto.randomBytes(10).toString("hex")}`,
        metadata: { orderId: order.id },
      },
    },
  });
  const header = signer.webhooks.generateTestHeaderString({ payload, secret: webhookSecret() });
  const event = verifyWebhook(payload, header);
  return handleStripeEvent(event);
}
