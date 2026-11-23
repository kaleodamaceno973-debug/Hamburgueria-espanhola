"use server";

import { db } from "@/lib/db";
import { contactSchema, fieldErrors, newsletterSchema } from "@/lib/validation";

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string> };

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  await db.newsletterSubscriber.upsert({ where: { email: parsed.data.email }, update: {}, create: { email: parsed.data.email } });
  return { ok: true, message: "Pronto! Você vai receber nossas ofertas." };
}

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot anti-spam
  if (formData.get("website")) return { ok: true, message: "Mensagem enviada!" };
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  await db.contactMessage.create({ data: parsed.data });
  return { ok: true, message: "Mensagem enviada! Respondemos em até 1 dia útil." };
}
