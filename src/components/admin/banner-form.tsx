"use client";

import Image from "next/image";
import { useActionState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { deleteBannerAction, saveBannerAction, type AdminState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

type B = { id: string; eyebrow: string; title: string; highlight: string; subtitle: string; ctaLabel: string; ctaHref: string; imageUrl: string; active: boolean };

export function BannerForm({ banner }: { banner?: B }) {
  const [s, action, pending] = useActionState<AdminState, FormData>(saveBannerAction, { ok: false });
  const [deleting, start] = useTransition();
  const p = banner?.id ?? "new";
  const e = s.errors ?? {};
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-white/10 bg-[#15110d] p-5 lg:grid-cols-[220px_1fr]" noValidate>
      {banner && <input type="hidden" name="id" value={banner.id} />}
      <div className="space-y-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
          {banner?.imageUrl ? <Image src={banner.imageUrl} alt="" fill sizes="220px" className="object-cover" /> : <p className="grid h-full place-items-center text-xs text-muted-foreground">Sem imagem</p>}
        </div>
        <label htmlFor={`${p}-image`} className="text-xs font-medium">{banner ? "Trocar imagem" : "Imagem"}</label>
        <input id={`${p}-image`} name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-foreground" />
        {e.image && <p className="text-xs text-red-400">{e.image}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Chamada (acima do título)" htmlFor={`${p}-eyebrow`}><Input id={`${p}-eyebrow`} name="eyebrow" defaultValue={banner?.eyebrow} /></Field>
        <Field label="Título" htmlFor={`${p}-title`} error={e.title}><Input id={`${p}-title`} name="title" defaultValue={banner?.title} /></Field>
        <Field label="Destaque (laranja)" htmlFor={`${p}-highlight`}><Input id={`${p}-highlight`} name="highlight" defaultValue={banner?.highlight} /></Field>
        <Field label="Subtítulo" htmlFor={`${p}-subtitle`}><Input id={`${p}-subtitle`} name="subtitle" defaultValue={banner?.subtitle} /></Field>
        <Field label="Texto do botão" htmlFor={`${p}-ctaLabel`} error={e.ctaLabel}><Input id={`${p}-ctaLabel`} name="ctaLabel" defaultValue={banner?.ctaLabel ?? "Pedir agora"} /></Field>
        <Field label="Link do botão" htmlFor={`${p}-ctaHref`} error={e.ctaHref}><Input id={`${p}-ctaHref`} name="ctaHref" defaultValue={banner?.ctaHref ?? "/cardapio"} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={banner?.active ?? true} className="size-4 accent-[#ff7a1a]" /> Ativo no site</label>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <p aria-live="polite" className={s.ok ? "mr-auto text-sm text-success" : "mr-auto text-sm text-red-400"}>{s.message}</p>
          {banner && (
            <Button
              type="button"
              variant="ghost"
              className="text-red-400"
              disabled={deleting}
              onClick={() => window.confirm("Excluir este banner?") && start(async () => { await deleteBannerAction(banner.id); toast.success("Banner excluído"); })}
            >
              <Trash2 className="size-4" /> Excluir
            </Button>
          )}
          <Button type="submit" disabled={pending}>{pending && <Loader2 className="size-4 animate-spin" />} {banner ? "Salvar banner" : "Adicionar banner"}</Button>
        </div>
      </div>
    </form>
  );
}
