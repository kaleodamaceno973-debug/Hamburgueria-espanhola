import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BurgerMark } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <BurgerMark className="relative h-16 w-20 animate-bounce text-primary motion-reduce:animate-none" />
      <p className="font-display relative mt-6 text-[clamp(6rem,25vw,14rem)] leading-none"><span className="slant text-gradient-ember">404</span></p>
      <h1 className="relative mt-2 text-2xl font-extrabold">Esse burger saiu do cardápio</h1>
      <p className="relative mt-2 max-w-md text-muted-foreground">A página que você procura não existe ou mudou de endereço.</p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link href="/"><ArrowLeft className="size-4" /> Voltar ao início</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/cardapio">Ver cardápio</Link></Button>
      </div>
    </main>
  );
}
