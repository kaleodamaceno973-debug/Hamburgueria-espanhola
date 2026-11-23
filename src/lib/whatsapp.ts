import { formatBRL, formatDateTime } from "./utils";

type O = {
  code: string;
  customerName: string;
  fulfillment: "DELIVERY" | "PICKUP";
  totalCents: number;
  scheduledFor: Date | string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressDistrict?: string | null;
  items: { name: string; quantity: number }[];
};

/** Link wa.me com o resumo do pedido. `to` = número da loja (ou do cliente, no admin). */
export function whatsappOrderLink(order: O, to?: string, intro = "Olá! Acabei de fazer um pedido na Smash House 🍔") {
  const number = (to ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const lines = [
    intro,
    "",
    `*Pedido ${order.code}*`,
    ...order.items.map((i) => `• ${i.quantity}× ${i.name}`),
    "",
    `*Total:* ${formatBRL(order.totalCents)}`,
    order.fulfillment === "DELIVERY"
      ? `*Entrega:* ${[order.addressStreet, order.addressNumber].filter(Boolean).join(", ")}${order.addressDistrict ? ` – ${order.addressDistrict}` : ""}`
      : "*Retirada no balcão*",
    order.scheduledFor ? `*Agendado:* ${formatDateTime(order.scheduledFor)}` : "",
    `*Nome:* ${order.customerName}`,
  ].filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}
