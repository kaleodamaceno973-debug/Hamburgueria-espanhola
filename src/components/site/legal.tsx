export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="container-x max-w-3xl pb-24 pt-32 md:pt-44">
      <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)]"><span className="slant">{title}</span></h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {updated}</p>
      <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-foreground/80 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
