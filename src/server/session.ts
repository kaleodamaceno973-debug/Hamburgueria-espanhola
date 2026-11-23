import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/** Data Access Layer: toda checagem de sessão passa por aqui. */
export async function getSessionUser() {
  // Marca a renderização como dinâmica antes do Auth.js (que usa crypto).
  await connection();
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireUser(callbackUrl = "/conta") {
  const user = await getSessionUser();
  if (!user) redirect(`/entrar?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/** Confere o papel direto no banco (o JWT pode estar desatualizado). */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?callbackUrl=/admin");
  const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (dbUser?.role !== "ADMIN") redirect("/conta?erro=acesso");
  return user;
}

/** Variante para server actions: lança erro em vez de redirecionar. */
export async function assertAdmin() {
  const user = await getSessionUser();
  if (!user) throw new Error("Não autenticado");
  const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (dbUser?.role !== "ADMIN") throw new Error("Acesso negado");
  return user;
}
