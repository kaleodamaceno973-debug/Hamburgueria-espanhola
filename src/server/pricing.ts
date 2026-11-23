import "server-only";
import { db } from "@/lib/db";
import { COUPONS, PRICING, type CouponCode } from "@/lib/constants";

export type QuoteLine = {
  productId: string;
  name: string;
  imageUrl: string | null;
  unitPriceCents: number;
  quantity: number;
  totalCents: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  totalCents: number;
  coupon: { code: string; valid: boolean; message: string } | null;
  unavailable: string[];
};

/**
 * Calcula o pedido SEMPRE no servidor a partir dos preços do banco.
 * O cliente só envia IDs e quantidades.
 */
export async function computeQuote(input: {
  items: { productId: string; quantity: number }[];
  fulfillment: "DELIVERY" | "PICKUP";
  couponCode?: string;
  userId?: string;
}): Promise<Quote> {
  // Agrupa itens repetidos.
  const merged = new Map<string, number>();
  for (const i of input.items) {
    merged.set(i.productId, Math.min(PRICING.maxItemQuantity, (merged.get(i.productId) ?? 0) + i.quantity));
  }

  const products = await db.product.findMany({
    where: { id: { in: [...merged.keys()] } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines: QuoteLine[] = [];
  const unavailable: string[] = [];
  for (const [productId, quantity] of merged) {
    const p = byId.get(productId);
    if (!p || !p.available) {
      unavailable.push(productId);
      continue;
    }
    lines.push({
      productId,
      name: p.name,
      imageUrl: p.images[0]?.url ?? null,
      unitPriceCents: p.priceCents,
      quantity,
      totalCents: p.priceCents * quantity,
    });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.totalCents, 0);

  let discountCents = 0;
  let coupon: Quote["coupon"] = null;
  if (input.couponCode) {
    const code = input.couponCode.toUpperCase();
    const def = (COUPONS as Record<string, (typeof COUPONS)[CouponCode]>)[code];
    if (!def) {
      coupon = { code, valid: false, message: "Cupom inválido" };
    } else if (def.firstOrderOnly && !input.userId) {
      coupon = { code, valid: false, message: "Entre na sua conta para usar este cupom" };
    } else {
      const previous = def.firstOrderOnly
        ? await db.order.count({ where: { userId: input.userId, paymentStatus: { in: ["PAID", "REFUNDED"] } } })
        : 0;
      if (previous > 0) {
        coupon = { code, valid: false, message: "Cupom válido apenas no primeiro pedido" };
      } else {
        discountCents = Math.round((subtotalCents * def.percent) / 100);
        coupon = { code, valid: true, message: def.label };
      }
    }
  }

  const afterDiscount = subtotalCents - discountCents;
  const deliveryFeeCents =
    input.fulfillment === "DELIVERY" && subtotalCents > 0 && afterDiscount < PRICING.freeDeliveryFromCents
      ? PRICING.deliveryFeeCents
      : 0;

  return {
    lines,
    subtotalCents,
    deliveryFeeCents,
    discountCents,
    totalCents: afterDiscount + deliveryFeeCents,
    coupon,
    unavailable,
  };
}
