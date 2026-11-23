import { NextResponse } from "next/server";
import { handleStripeEvent, verifyWebhook } from "@/server/payments";

/**
 * Webhook de pagamento. Verifica a assinatura (Stripe-Signature) com o
 * corpo bruto antes de qualquer processamento. Idempotente por event.id.
 */
export async function POST(req: Request) {
  const payload = await req.text();
  let event;
  try {
    event = verifyWebhook(payload, req.headers.get("stripe-signature"));
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }
  try {
    const result = await handleStripeEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (e) {
    console.error("[webhook] falha ao processar", event.type, e);
    return NextResponse.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
