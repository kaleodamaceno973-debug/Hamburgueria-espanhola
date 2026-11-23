"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { changePasswordAction, updateProfileAction, type AccountState } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [s, action, pending] = useActionState<AccountState, FormData>(updateProfileAction, { ok: false });
  return (
    <form action={action} className="space-y-4" noValidate>
      <Field label="E-mail" htmlFor="email" hint="O e-mail de login não pode ser alterado.">
        <Input id="email" value={email} disabled readOnly />
      </Field>
      <Field label="Nome" htmlFor="name" error={s.errors?.name}>
        <Input id="name" name="name" defaultValue={name} autoComplete="name" aria-invalid={!!s.errors?.name} />
      </Field>
      <Field label="Celular" htmlFor="phone" error={s.errors?.phone}>
        <Input id="phone" name="phone" defaultValue={phone} type="tel" autoComplete="tel" aria-invalid={!!s.errors?.phone} />
      </Field>
      <p aria-live="polite" className={s.ok ? "text-sm text-success" : "text-sm text-red-400"}>{s.message}</p>
      <Button type="submit" disabled={pending}>{pending && <Loader2 className="size-4 animate-spin" />} Salvar perfil</Button>
    </form>
  );
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [s, action, pending] = useActionState<AccountState, FormData>(changePasswordAction, { ok: false });
  return (
    <form action={action} className="space-y-4" noValidate>
      {hasPassword && (
        <Field label="Senha atual" htmlFor="current" error={s.errors?.current}>
          <Input id="current" name="current" type="password" autoComplete="current-password" aria-invalid={!!s.errors?.current} />
        </Field>
      )}
      <Field label="Nova senha" htmlFor="password" error={s.errors?.password} hint="Mín. 8 caracteres, letras e números">
        <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={!!s.errors?.password} />
      </Field>
      <Field label="Confirmar nova senha" htmlFor="confirm" error={s.errors?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-invalid={!!s.errors?.confirm} />
      </Field>
      <p aria-live="polite" className={s.ok ? "text-sm text-success" : "text-sm text-red-400"}>{s.message}</p>
      <Button type="submit" variant="secondary" disabled={pending}>{pending && <Loader2 className="size-4 animate-spin" />} {hasPassword ? "Alterar senha" : "Criar senha"}</Button>
    </form>
  );
}
