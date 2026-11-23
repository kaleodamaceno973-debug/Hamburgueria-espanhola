"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveContentAction, type AdminState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

type F = { key: string; label: string; group: string; value: string };

export function ContentForm({ fields }: { fields: F[] }) {
  const [s, action, pending] = useActionState<AdminState, FormData>(saveContentAction, { ok: false });
  const groups = [...new Set(fields.map((f) => f.group))];
  return (
    <form action={action} className="space-y-6" noValidate>
      {groups.map((g) => (
        <fieldset key={g} className="rounded-2xl border border-white/10 bg-[#15110d] p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-widest text-primary">{g}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.filter((f) => f.group === g).map((f) => (
              <Field key={f.key} label={f.label} htmlFor={f.key} error={s.errors?.[f.key]} className={f.value.length > 80 ? "md:col-span-2" : ""}>
                {f.value.length > 80 ? (
                  <Textarea id={f.key} name={f.key} defaultValue={f.value} rows={3} aria-invalid={!!s.errors?.[f.key]} />
                ) : (
                  <Input id={f.key} name={f.key} defaultValue={f.value} aria-invalid={!!s.errors?.[f.key]} />
                )}
              </Field>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="sticky bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1d1712]/95 p-3 backdrop-blur">
        <Button type="submit" disabled={pending}>{pending && <Loader2 className="size-4 animate-spin" />} Publicar textos</Button>
        <p aria-live="polite" className={s.ok ? "text-sm text-success" : "text-sm text-red-400"}>{s.message}</p>
      </div>
    </form>
  );
}
