import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { ProductForm } from "@/components/admin/product-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Novo produto" };

async function Form() {
  await requireAdmin();
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return <ProductForm categories={categories} />;
}

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/produtos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Produtos</Link>
      <h1 className="font-display mb-6 text-4xl sm:text-5xl"><span className="slant">Novo produto</span></h1>
      <Suspense fallback={<Skeleton className="h-[520px]" />}><Form /></Suspense>
    </>
  );
}
