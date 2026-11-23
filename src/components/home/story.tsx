import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { ParallaxImage } from "./parallax-image";

const STATS = [
  { to: 12000, suffix: "+", label: "burgers por mês" },
  { to: 4.9, decimals: 1, suffix: "★", label: "nota média" },
  { to: 8, label: "anos de chapa" },
  { to: 100, suffix: "%", label: "carne fresca" },
];

export function Story({ title, text }: { title: string; text: string }) {
  return (
    <section aria-labelledby="story-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <Reveal variant="mask" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/5]">
            <ParallaxImage src="/images/chef.webp" alt="Chef prensando burgers na chapa" />
          </Reveal>
          <Reveal variant="right" delay={0.3} className="absolute -bottom-8 right-4 w-[46%] overflow-hidden rounded-3xl border-4 border-[#0a0806] shadow-2xl sm:-right-6">
            <div className="relative aspect-square">
              <Image src="/images/interior-1.webp" alt="Salão da Smash House" fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-cover" />
            </div>
          </Reveal>
          <div aria-hidden className="font-script absolute -left-2 -top-6 -rotate-12 text-4xl text-primary sm:text-5xl">since 2018</div>
        </div>

        <div>
          <SectionHeading id="story-title" eyebrow="Nossa história" title={title} text={text} />
          <Reveal stagger={0.1} className="mt-10 grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="font-display text-4xl text-gold sm:text-5xl">
                  <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre">Conheça a Smash House <ArrowRight className="size-4" /></Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
