"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { sendContactMessage, type FormState } from "@/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

export function ContactForm() {
  const [s, action, pending] = useActionState<FormState, FormData>(sendContactMessage, { ok: false });
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (s.ok) form.current?.reset();
  }, [s]);
  return (
    <form ref={form} action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Field label="Nome" htmlFor="c-name" error={s.errors?.name}>
        <Input id="c-name" name="name" autoComplete="name" aria-invalid={!!s.errors?.name} />
      </Field>
      <Field label="E-mail" htmlFor="c-email" error={s.errors?.email}>
        <Input id="c-email" name="email" type="email" autoComplete="email" aria-invalid={!!s.errors?.email} />
      </Field>
      <Field label="Telefone (opcional)" htmlFor="c-phone" className="sm:col-span-2">
        <Input id="c-phone" name="phone" type="tel" autoComplete="tel" />
      </Field>
      <Field label="Mensagem" htmlFor="c-message" error={s.errors?.message} className="sm:col-span-2">
        <Textarea id="c-message" name="message" rows={5} aria-invalid={!!s.errors?.message} />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Enviar mensagem
        </Button>
        <p aria-live="polite" className={s.ok ? "text-sm text-success" : "text-sm text-red-400"}>{s.message}</p>
      </div>
    </form>
  );
}
