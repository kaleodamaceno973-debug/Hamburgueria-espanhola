import "server-only";
import { db } from "@/lib/db";
import { formatBRL, formatDateTime, siteUrl } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

type Mail = { to: string; subject: string; html: string };

/**
 * Envia via Resend se RESEND_API_KEY existir; caso contrário registra
 * no banco (visível em Admin → Mensagens) — perfeito para demonstração.
 */
export async function sendEmail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  let provider = "log";
  let status = "registrado (modo demo)";
  if (key) {
    provider = "resend";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [mail.to], subject: mail.subject, html: mail.html }),
      });
      status = res.ok ? "enviado" : `erro ${res.status}`;
    } catch {
      status = "erro de rede";
    }
  }
  await db.emailLog.create({ data: { ...mail, provider, status } }).catch(() => null);
  return status;
}

function shell(title: string, body: string) {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#0b0b0b;font-family:Arial,sans-serif;color:#f5efe6">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:32px 20px">
<tr><td style="font-size:26px;font-weight:900;color:#ff7a1a;letter-spacing:1px">${BRAND.name.toUpperCase()}</td></tr>
<tr><td style="padding-top:20px;font-size:22px;font-weight:700">${title}</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#d8d0c4">${body}</td></tr>
<tr><td style="padding-top:28px;font-size:12px;color:#8a8278">${BRAND.name} · ${BRAND.tagline}</td></tr>
</table></body></html>`;
}

type OrderForMail = {
  code: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  fulfillment: "DELIVERY" | "PICKUP";
  scheduledFor: Date | null;
  items: { name: string; quantity: number; totalCents: number }[];
};

export async function sendOrderConfirmation(order: OrderForMail) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.quantity}× ${escapeHtml(i.name)}</td><td align="right">${formatBRL(i.totalCents)}</td></tr>`,
    )
    .join("");
  const when = order.scheduledFor ? `Agendado para <b>${formatDateTime(order.scheduledFor)}</b>.` : "Já estamos preparando tudo.";
  const html = shell(
    `Pedido ${order.code} confirmado! 🍔`,
    `Olá, ${escapeHtml(order.customerName)}! Recebemos o pagamento do seu pedido (${
      order.fulfillment === "DELIVERY" ? "entrega" : "retirada"
    }). ${when}
<table width="100%" style="margin-top:16px;border-top:1px solid #333;color:#f5efe6">${rows}
<tr><td style="padding-top:10px;font-weight:700">Total</td><td align="right" style="padding-top:10px;font-weight:700">${formatBRL(order.totalCents)}</td></tr></table>
<p style="margin-top:20px"><a href="${siteUrl(`/pedido/${order.code}`)}" style="background:#ff7a1a;color:#111;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Acompanhar pedido</a></p>`,
  );
  await sendEmail({ to: order.customerEmail, subject: `Pedido ${order.code} confirmado — ${BRAND.name}`, html });
  if (process.env.ADMIN_NOTIFY_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `Novo pedido ${order.code} — ${formatBRL(order.totalCents)}`,
      html: shell(`Novo pedido ${order.code}`, `${escapeHtml(order.customerName)} · ${formatBRL(order.totalCents)}`),
    });
  }
}

export async function sendStatusEmail(order: { code: string; customerName: string; customerEmail: string }, label: string) {
  await sendEmail({
    to: order.customerEmail,
    subject: `Pedido ${order.code}: ${label}`,
    html: shell(
      `Atualização do pedido ${order.code}`,
      `Olá, ${escapeHtml(order.customerName)}! Status atual: <b>${escapeHtml(label)}</b>.<br/><br/><a style="color:#ff7a1a" href="${siteUrl(
        `/pedido/${order.code}`,
      )}">Ver pedido</a>`,
    ),
  });
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
