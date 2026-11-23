import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { CONTENT_FIELDS } from "@/lib/content-defaults";
import { ContentForm } from "@/components/admin/content-form";
import { BannerForm } from "@/components/admin/banner-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Textos & banners" };

async function Content() {
  await requireAdmin();
  const [rows, banners] = await Promise.all([db.siteContent.findMany(), db.banner.findMany({ orderBy: { sortOrder: "asc" } })]);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const fields = CONTENT_FIELDS.map((f) => ({ key: f.key, label: f.label, group: f.group, value: map.get(f.key) ?? f.default }));
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-1 text-xl font-extrabold">Banners do topo (hero)</h2>
        <p className="mb-4 text-sm text-muted-foreground">Os slides do hero da home. A primeira imagem ativa é a que carrega primeiro — use fotos com fundo escuro.</p>
        <div className="space-y-4">
          {banners.map((b) => <BannerForm key={b.id} banner={b} />)}
          <details className="rounded-2xl border border-dashed border-white/15 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">+ Novo banner</summary>
            <div className="mt-4"><BannerForm /></div>
          </details>
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-xl font-extrabold">Textos do site</h2>
        <p className="mb-4 text-sm text-muted-foreground">Alterações aparecem no site imediatamente após publicar.</p>
        <ContentForm fields={fields} />
      </section>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <>
      <h1 className="font-display mb-6 text-4xl sm:text-5xl"><span className="slant">Textos & banners</span></h1>
      <Suspense fallback={<Skeleton className="h-[600px]" />}><Content /></Suspense>
    </>
  );
}
