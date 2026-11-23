"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import { safeCallbackUrl } from "@/lib/utils";

export type AuthState = { ok: boolean; message?: string; errors?: Record<string, string> };

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const redirectTo = safeCallbackUrl(formData.get("callbackUrl"));
  try {
    await signIn("credentials", { ...parsed.data, redirectTo });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, message: "E-mail ou senha incorretos." };
    throw error; // redirect de sucesso
  }
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    acceptTerms: formData.get("acceptTerms") === "on",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, errors: { email: "Este e-mail já tem conta. Faça login." } };

  await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  const redirectTo = safeCallbackUrl(formData.get("callbackUrl"));
  try {
    await signIn("credentials", { email, password, redirectTo });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, message: "Conta criada! Faça login para continuar." };
    throw error;
  }
}

export async function googleSignInAction(formData: FormData) {
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
