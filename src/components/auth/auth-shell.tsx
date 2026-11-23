import Image from "next/image";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src="/images/smash-supremo.webp" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0806]/40 to-[#0a0806]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent" />
        <p className="font-display absolute bottom-16 left-12 max-w-md text-6xl">
          <span className="slant">Seu smash <span className="text-gradient-ember">te espera.</span></span>
        </p>
      </div>
      <div className="flex items-center justify-center px-4 pb-16 pt-28 sm:px-8 lg:pt-32">
        <div className="w-full max-w-md">
          <h1 className="font-display text-5xl"><span className="slant">{title}</span></h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
