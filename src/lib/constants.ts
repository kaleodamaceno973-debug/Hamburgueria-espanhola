import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const BRAND = {
  name: "Smash House",
  tagline: "Burgers. Good Vibes. Great Times.",
} as const;

/** Regras de preço — usadas apenas no servidor para calcular totais. */
export const PRICING = {
  deliveryFeeCents: 790,
  freeDeliveryFromCents: 8000,
  minOrderCents: 2000,
  maxItemQuantity: 20,
} as const;

export const COUPONS = {
  PRIMEIRA20: { percent: 20, firstOrderOnly: true, label: "20% off no primeiro pedido" },
} as const;
export type CouponCode = keyof typeof COUPONS;

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pagamento aprovado",
  PREPARING: "Na chapa",
  READY: "Pronto",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  FAILED: "Falhou",
  REFUNDED: "Estornado",
};

/** Ordem da linha do tempo exibida ao cliente. */
export const ORDER_FLOW: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"];

/** Transições permitidas no painel admin. */
export const ADMIN_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["CANCELLED"],
  PAID: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "COMPLETED"],
  OUT_FOR_DELIVERY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

/** Cliente pode cancelar/remarcar enquanto o pedido não foi para a chapa. */
export const CUSTOMER_EDITABLE: OrderStatus[] = ["PENDING_PAYMENT", "PAID"];

export const OPENING_HOURS = { open: 11, close: 23 } as const; // 11h–23h, todos os dias
export const TIMEZONE = "America/Sao_Paulo";
