import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { ProductForm } from "@/components/admin/product-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Editar produto" };

async function Form({ params }: { params: PageProps<"/admin/produtos/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true } } } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl sm:text-5xl"><span className="slant">{product.name}</span></h1>
        <Link href={`/cardapio/${product.slug}`} target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline">Ver no site <ExternalLink className="size-4" /></Link>
      </div>
      <ProductForm product={product} categories={categories} />
    </>
  );
}

export default function EditProductPage({ params }: PageProps<"/admin/produtos/[id]">) {
  return (
    <>
      <Link href="/admin/produtos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Produtos</Link>
      <Suspense fallback={<Skeleton className="h-[520px]" />}><Form params={params} /></Suspense>
    </>
  );
}
