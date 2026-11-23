import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Plus, Package } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Produtos" };

async function List({ searchParams }: { searchParams: PageProps<"/admin/produtos">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const products = await db.product.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });
  return (
    <>
      {sp.salvo && <p role="status" className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm">Produto criado e publicado no cardápio.</p>}
      {products.length === 0 ? (
        <EmptyState className="mt-6" icon={<Package className="size-6" />} title="Nenhum produto" action={<Button asChild><Link href="/admin/produtos/novo">Criar produto</Link></Button>} />
      ) : (
        <ul className="mt-6 grid gap-2">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#15110d] p-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/produtos/${p.id}`} className="font-bold hover:text-primary">{p.name}</Link>
                  {p.featured && <Badge variant="warning">Destaque</Badge>}
                  {!p.available && <Badge variant="muted">Oculto</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{p.category.name} · /{p.slug}</p>
              </div>
              <p className="hidden font-semibold tabular-nums sm:block">{formatBRL(p.priceCents)}</p>
              <ProductRowActions id={p.id} name={p.name} available={p.available} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AdminProductsPage({ searchParams }: PageProps<"/admin/produtos">) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl"><span className="slant">Produtos</span></h1>
        <Button asChild><Link href="/admin/produtos/novo"><Plus className="size-4" /> Novo produto</Link></Button>
      </div>
      <Suspense fallback={<div className="mt-6 grid gap-2">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-20" />)}</div>}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}
