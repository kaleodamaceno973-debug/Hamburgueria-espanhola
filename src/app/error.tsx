"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[clamp(5rem,22vw,12rem)] leading-none"><span className="slant text-gradient-ember">500</span></p>
      <h1 className="mt-2 text-2xl font-extrabold">A chapa esquentou demais</h1>
      <p className="mt-2 max-w-md text-muted-foreground">Tivemos um problema inesperado. Tente novamente — se persistir, fale com a gente.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">Código: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={() => retry()}><RotateCcw className="size-4" /> Tentar novamente</Button>
        <Button asChild size="lg" variant="outline"><Link href="/">Voltar ao início</Link></Button>
      </div>
    </main>
  );
}
