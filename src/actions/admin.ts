"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { bannerSchema, fieldErrors, productSchema } from "@/lib/validation";
import { CONTENT_FIELDS } from "@/lib/content-defaults";
import { slugify } from "@/lib/utils";
import { assertAdmin } from "@/server/session";
import { changeStatusAsAdmin } from "@/server/orders";
import { saveImage } from "@/server/upload";
import { TAGS } from "@/server/catalog";

export type AdminState = { ok: boolean; message?: string; errors?: Record<string, string> };

const STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

/* ── Pedidos ── */
export async function updateOrderStatusAction(orderId: string, status: string): Promise<AdminState> {
  await assertAdmin();
  if (!STATUSES.includes(status as OrderStatus)) return { ok: false, message: "Status inválido" };
  const res = await changeStatusAsAdmin(String(orderId), status as OrderStatus);
  revalidatePath("/admin/pedidos");
  return res.ok ? { ok: true } : { ok: false, message: res.error };
}

/* ── Produtos ── */
export async function saveProductAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  await assertAdmin();
  const id = fd.get("id") ? String(fd.get("id")) : null;
  const parsed = productSchema.safeParse({
    name: fd.get("name"),
    slug: fd.get("slug") ?? "",
    description: fd.get("description"),
    longDescription: fd.get("longDescription") ?? "",
    price: String(fd.get("price") ?? "").replace(",", "."),
    compareAt: fd.get("compareAt") ? String(fd.get("compareAt")).replace(",", ".") : undefined,
    categoryId: fd.get("categoryId"),
    badge: fd.get("badge") ?? "",
    tags: fd.get("tags") ?? "",
    calories: fd.get("calories") || undefined,
    featured: fd.get("featured") === "on",
    available: fd.get("available") === "on",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Revise os campos." };
  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const clash = await db.product.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (clash) return { ok: false, errors: { slug: "Já existe um produto com este endereço (slug)" } };
  const category = await db.category.findUnique({ where: { id: d.categoryId } });
  if (!category) return { ok: false, errors: { categoryId: "Categoria inválida" } };

  const files = fd.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > 6) return { ok: false, errors: { images: "Máximo de 6 imagens por envio" } };
  let uploaded: string[] = [];
  try {
    uploaded = await Promise.all(files.map((f) => saveImage(f)));
  } catch (e) {
    return { ok: false, errors: { images: e instanceof Error ? e.message : "Falha no upload" } };
  }

  const data = {
    name: d.name,
    slug,
    description: d.description,
    longDescription: d.longDescription ?? "",
    priceCents: Math.round(d.price * 100),
    compareAtCents: d.compareAt ? Math.round(d.compareAt * 100) : null,
    categoryId: d.categoryId,
    badge: d.badge || null,
    tags: d.tags ?? "",
    calories: d.calories ?? null,
    featured: d.featured,
    available: d.available,
  };

  let productId = id;
  if (id) {
    const exists = await db.product.findUnique({ where: { id } });
    if (!exists) return { ok: false, message: "Produto não encontrado" };
    await db.product.update({ where: { id }, data });
  } else {
    if (uploaded.length === 0) return { ok: false, errors: { images: "Envie ao menos uma imagem" } };
    const created = await db.product.create({ data: { ...data, sortOrder: await db.product.count() } });
    productId = created.id;
  }

  // Remoção de imagens marcadas
  const remove = fd.getAll("removeImage").map(String);
  if (remove.length && productId) await db.productImage.deleteMany({ where: { productId, id: { in: remove } } });
  if (uploaded.length && productId) {
    const start = await db.productImage.count({ where: { productId } });
    await db.productImage.createMany({ data: uploaded.map((url, i) => ({ productId: productId!, url, alt: d.name, sortOrder: start + i })) });
  }

  updateTag(TAGS.menu);
  if (!id) redirect(`/admin/produtos?salvo=1`);
  return { ok: true, message: "Produto salvo!" };
}

export async function toggleProductAction(id: string, available: boolean): Promise<AdminState> {
  await assertAdmin();
  await db.product.update({ where: { id: String(id) }, data: { available: Boolean(available) } });
  updateTag(TAGS.menu);
  revalidatePath("/admin/produtos");
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<AdminState> {
  await assertAdmin();
  await db.product.delete({ where: { id: String(id) } }).catch(() => null);
  updateTag(TAGS.menu);
  revalidatePath("/admin/produtos");
  return { ok: true };
}

/* ── Conteúdo ── */
export async function saveContentAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  await assertAdmin();
  const errors: Record<string, string> = {};
  const updates: { key: string; value: string }[] = [];
  for (const f of CONTENT_FIELDS) {
    const raw = fd.get(f.key);
    if (raw === null) continue;
    const value = String(raw).trim();
    if (!value) errors[f.key] = "Obrigatório";
    else if (value.length > 600) errors[f.key] = "Máximo de 600 caracteres";
    else updates.push({ key: f.key, value });
  }
  if (Object.keys(errors).length) return { ok: false, errors, message: "Revise os campos." };
  await db.$transaction(updates.map((u) => db.siteContent.upsert({ where: { key: u.key }, update: { value: u.value }, create: u })));
  updateTag(TAGS.content);
  return { ok: true, message: "Textos publicados no site!" };
}

export async function saveBannerAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  await assertAdmin();
  const id = fd.get("id") ? String(fd.get("id")) : null;
  const parsed = bannerSchema.safeParse({
    eyebrow: fd.get("eyebrow") ?? "",
    title: fd.get("title"),
    highlight: fd.get("highlight") ?? "",
    subtitle: fd.get("subtitle") ?? "",
    ctaLabel: fd.get("ctaLabel"),
    ctaHref: fd.get("ctaHref"),
    active: fd.get("active") === "on",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Revise os campos." };
  const file = fd.get("image");
  let imageUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveImage(file, "banners");
    } catch (e) {
      return { ok: false, errors: { image: e instanceof Error ? e.message : "Falha no upload" } };
    }
  }
  if (id) {
    await db.banner.update({ where: { id }, data: { ...parsed.data, ...(imageUrl ? { imageUrl } : {}) } });
  } else {
    if (!imageUrl) return { ok: false, errors: { image: "Envie uma imagem para o banner" } };
    await db.banner.create({ data: { ...parsed.data, imageUrl, sortOrder: (await db.banner.count()) + 1 } });
  }
  updateTag(TAGS.content);
  revalidatePath("/admin/conteudo");
  return { ok: true, message: "Banner salvo!" };
}

export async function deleteBannerAction(id: string): Promise<AdminState> {
  await assertAdmin();
  await db.banner.delete({ where: { id: String(id) } }).catch(() => null);
  updateTag(TAGS.content);
  revalidatePath("/admin/conteudo");
  return { ok: true };
}

export async function markMessageReadAction(id: string): Promise<AdminState> {
  await assertAdmin();
  await db.contactMessage.update({ where: { id: String(id) }, data: { read: true } }).catch(() => null);
  revalidatePath("/admin/mensagens");
  return { ok: true };
}
