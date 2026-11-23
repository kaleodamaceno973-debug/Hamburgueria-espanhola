import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta({ title, text, address, hours }: { title: string; text: string; address: string; hours: string }) {
  return (
    <section aria-labelledby="cta-title" className="grain relative isolate overflow-hidden py-24 sm:py-32">
      <Image src="/images/combo-board.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a0806] via-[#0a0806]/70 to-[#0a0806]" />
      <div className="container-x text-center">
        <SplitHeading id="cta-title" by="chars" className="font-display text-[clamp(3.2rem,12vw,9rem)] text-primary">
          {title}
        </SplitHeading>
        <Reveal>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">{text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/cardapio">Fazer meu pedido <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contato">Como chegar</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-foreground/70 sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{address}</span>
            <span className="flex items-center gap-2"><Clock className="size-4 text-primary" />{hours}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
