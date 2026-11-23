"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, registerAction, googleSignInAction, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

function PasswordInput({ id, name, autoComplete, invalid }: { id: string; name: string; autoComplete: string; invalid?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} className="pr-12" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground" aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  return (
    <form action={googleSignInAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Button type="submit" variant="outline" className="w-full" size="lg">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12Z" />
        </svg>
        Continuar com Google
      </Button>
    </form>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
      <span className="h-px flex-1 bg-white/10" /> ou <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export function LoginForm({ callbackUrl, google, notice }: { callbackUrl: string; google: boolean; notice?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, { ok: false });
  return (
    <div className="space-y-6">
      {notice && <p role="status" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">{notice}</p>}
      {google && (
        <>
          <GoogleButton callbackUrl={callbackUrl} />
          <Divider />
        </>
      )}
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Field label="E-mail" htmlFor="email" error={state.errors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!state.errors?.email} />
        </Field>
        <Field label="Senha" htmlFor="password" error={state.errors?.password}>
          <PasswordInput id="password" name="password" autoComplete="current-password" invalid={!!state.errors?.password} />
        </Field>
        {state.message && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{state.message}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} Entrar
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href={`/cadastro?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-primary hover:underline">Criar conta grátis</Link>
      </p>
    </div>
  );
}

export function RegisterForm({ callbackUrl, google }: { callbackUrl: string; google: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, { ok: false });
  const e = state.errors ?? {};
  return (
    <div className="space-y-6">
      {google && (
        <>
          <GoogleButton callbackUrl={callbackUrl} />
          <Divider />
        </>
      )}
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Field label="Nome" htmlFor="name" error={e.name}>
          <Input id="name" name="name" autoComplete="name" required aria-invalid={!!e.name} />
        </Field>
        <Field label="E-mail" htmlFor="email" error={e.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Senha" htmlFor="password" error={e.password} hint="Mín. 8 caracteres, letras e números">
            <PasswordInput id="password" name="password" autoComplete="new-password" invalid={!!e.password} />
          </Field>
          <Field label="Confirmar senha" htmlFor="confirm" error={e.confirm}>
            <PasswordInput id="confirm" name="confirm" autoComplete="new-password" invalid={!!e.confirm} />
          </Field>
        </div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" name="acceptTerms" className="mt-0.5 size-5 shrink-0 accent-[#ff7a1a]" />
          <span>
            Li e aceito os <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link> e a{" "}
            <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
          </span>
        </label>
        {e.acceptTerms && <p role="alert" className="text-xs text-red-400">{e.acceptTerms}</p>}
        {state.message && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{state.message}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} Criar conta
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href={`/entrar?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-primary hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
