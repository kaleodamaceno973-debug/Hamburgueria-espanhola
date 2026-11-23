"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribeNewsletter, type FormState } from "@/actions/public";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { ok: false });
  return (
    <form action={action} className="space-y-2" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
      <div className="flex items-center rounded-full border border-white/15 bg-white/[0.03] p-1 focus-within:border-primary">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Seu melhor e-mail"
          aria-invalid={!!state.errors?.email}
          className="min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-[#ff8c3a] disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : state.ok ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
          <span>Assinar</span>
        </button>
      </div>
      <p aria-live="polite" className={state.ok ? "text-xs text-success" : "text-xs text-red-400"}>
        {state.ok ? state.message : state.errors?.email}
      </p>
    </form>
  );
}
