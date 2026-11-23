"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { changePasswordSchema, fieldErrors, profileSchema } from "@/lib/validation";
import { getSessionUser } from "@/server/session";

export type AccountState = { ok: boolean; message?: string; errors?: Record<string, string> };

export async function updateProfileAction(_p: AccountState, fd: FormData): Promise<AccountState> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "Entre novamente." };
  const parsed = profileSchema.safeParse({ name: fd.get("name"), phone: fd.get("phone") ?? "" });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  await db.user.update({ where: { id: user.id }, data: { name: parsed.data.name, phone: parsed.data.phone || null } });
  revalidatePath("/conta/perfil");
  return { ok: true, message: "Perfil atualizado." };
}

export async function changePasswordAction(_p: AccountState, fd: FormData): Promise<AccountState> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "Entre novamente." };
  const parsed = changePasswordSchema.safeParse({ current: fd.get("current") ?? "", password: fd.get("password"), confirm: fd.get("confirm") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return { ok: false, message: "Conta não encontrada." };
  if (dbUser.passwordHash && !(await bcrypt.compare(parsed.data.current, dbUser.passwordHash))) {
    return { ok: false, errors: { current: "Senha atual incorreta" } };
  }
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } });
  return { ok: true, message: dbUser.passwordHash ? "Senha alterada." : "Senha criada — agora você também pode entrar com e-mail." };
}
