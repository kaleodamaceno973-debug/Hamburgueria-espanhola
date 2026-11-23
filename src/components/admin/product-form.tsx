"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { saveProductAction, type AdminState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  priceCents: number;
  compareAtCents: number | null;
  categoryId: string;
  badge: string | null;
  tags: string;
  calories: number | null;
  featured: boolean;
  available: boolean;
  images: { id: string; url: string }[];
};

export function ProductForm({ product, categories }: { product?: Product; categories: { id: string; name: string }[] }) {
  const [s, action, pending] = useActionState<AdminState, FormData>(saveProductAction, { ok: false });
  const [previews, setPreviews] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [available, setAvailable] = useState(product?.available ?? true);
  const e = s.errors ?? {};

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]" noValidate>
      {product && <input type="hidden" name="id" value={product.id} />}
      {removed.map((id) => <input key={id} type="hidden" name="removeImage" value={id} />)}
      <input type="hidden" name="featured" value={featured ? "on" : ""} />
      <input type="hidden" name="available" value={available ? "on" : ""} />

      <section className="space-y-4 rounded-2xl border border-white/10 bg-[#15110d] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" htmlFor="name" error={e.name}>
            <Input id="name" name="name" defaultValue={product?.name} aria-invalid={!!e.name} />
          </Field>
          <Field label="Endereço (slug)" htmlFor="slug" error={e.slug} hint="Deixe vazio para gerar automaticamente">
            <Input id="slug" name="slug" defaultValue={product?.slug} aria-invalid={!!e.slug} />
          </Field>
        </div>
        <Field label="Descrição curta" htmlFor="description" error={e.description}>
          <Input id="description" name="description" defaultValue={product?.description} maxLength={160} aria-invalid={!!e.description} />
        </Field>
        <Field label="Descrição completa" htmlFor="longDescription" error={e.longDescription}>
          <Textarea id="longDescription" name="longDescription" rows={5} defaultValue={product?.longDescription} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Preço (R$)" htmlFor="price" error={e.price}>
            <Input id="price" name="price" inputMode="decimal" defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""} aria-invalid={!!e.price} />
          </Field>
          <Field label="Preço “de” (opcional)" htmlFor="compareAt" error={e.compareAt}>
            <Input id="compareAt" name="compareAt" inputMode="decimal" defaultValue={product?.compareAtCents ? (product.compareAtCents / 100).toFixed(2) : ""} />
          </Field>
          <Field label="Calorias (opcional)" htmlFor="calories" error={e.calories}>
            <Input id="calories" name="calories" inputMode="numeric" defaultValue={product?.calories ?? ""} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Categoria" htmlFor="categoryId" error={e.categoryId}>
            <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className="h-11 rounded-xl border border-input bg-[#15110d] px-3 outline-none focus:border-primary">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Selo (opcional)" htmlFor="badge" error={e.badge}>
            <Input id="badge" name="badge" defaultValue={product?.badge ?? ""} placeholder="Novo, Mais pedido…" maxLength={24} />
          </Field>
          <Field label="Tags" htmlFor="tags" hint="Separadas por vírgula">
            <Input id="tags" name="tags" defaultValue={product?.tags} placeholder="carne,bacon" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-3 text-sm font-medium"><Switch checked={available} onCheckedChange={setAvailable} aria-label="Disponível" /> Disponível no cardápio</label>
          <label className="flex items-center gap-3 text-sm font-medium"><Switch checked={featured} onCheckedChange={setFeatured} aria-label="Destaque" /> Destaque na home</label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-[#15110d] p-5">
        <p className="font-bold">Imagens</p>
        <div className="grid grid-cols-3 gap-3">
          {product?.images.filter((i) => !removed.includes(i.id)).map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image src={img.url} alt="" fill sizes="150px" className="object-cover" />
              <button type="button" onClick={() => setRemoved((r) => [...r, img.id])} className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600" aria-label="Remover imagem">
                <X className="size-4" />
              </button>
            </div>
          ))}
          {previews.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-xl ring-2 ring-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Nova imagem" className="size-full object-cover" />
            </div>
          ))}
        </div>
        <label className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 p-6 text-center text-sm text-muted-foreground transition hover:border-primary", e.images && "border-red-500/60")}>
          <ImagePlus className="size-6 text-primary" />
          Clique para enviar (JPG, PNG, WEBP · até 4 MB)
          <input
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={(ev) => setPreviews(Array.from(ev.target.files ?? []).map((f) => URL.createObjectURL(f)))}
          />
        </label>
        {e.images && <p role="alert" className="text-xs text-red-400">{e.images}</p>}
        <div className="border-t border-white/10 pt-4">
          <p aria-live="polite" className={cn("mb-3 text-sm", s.ok ? "text-success" : "text-red-400")}>{s.message}</p>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />} {product ? "Salvar alterações" : "Criar produto"}
          </Button>
        </div>
      </section>
    </form>
  );
}
