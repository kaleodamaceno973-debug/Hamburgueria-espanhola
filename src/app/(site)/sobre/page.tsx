import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { ParallaxImage } from "@/components/home/parallax-image";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Nossa história",
  description: "Como uma chapa de ferro e um blend escolhido a dedo viraram a Smash House.",
  alternates: { canonical: "/sobre" },
};

const TIMELINE = [
  { year: "2018", title: "A primeira chapa", text: "Um food truck, uma chapa de ferro de 12 mm e o Classic Smash." },
  { year: "2020", title: "Delivery próprio", text: "Embalagens que mantêm a crocância e entregadores parceiros do bairro." },
  { year: "2022", title: "Loja na Augusta", text: "Salão com 60 lugares, cozinha aberta e chapa à vista." },
  { year: "Hoje", title: "+12 mil burgers/mês", text: "A mesma receita, os mesmos fornecedores e a mesma obsessão por crosta." },
];

const VALUES = [
  { title: "Ingrediente de verdade", text: "Carne moída no dia, pão de padaria parceira, queijo de laticínio." },
  { title: "Técnica acima de tudo", text: "Chapa a 230 °C, prensa no tempo certo, crosta caramelizada sempre." },
  { title: "Gente que cuida", text: "Equipe treinada, salários justos e hospitalidade de bairro." },
];

export default async function AboutPage() {
  const c = await getSiteContent();
  return (
    <>
      <PageHero eyebrow="Nossa história" title={c["about.title"]} />
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal variant="mask" className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <ParallaxImage src="/images/chef.webp" alt="Chef da Smash House na chapa" />
        </Reveal>
        <div>
          <Reveal><p className="text-lg leading-relaxed text-foreground/85">{c["about.text"]}</p></Reveal>
          <Reveal stagger={0.1} className="mt-10 grid grid-cols-2 gap-4">
            {[
              { to: 12000, suffix: "+", label: "burgers por mês" },
              { to: 4.9, decimals: 1, suffix: "★", label: "nota média" },
              { to: 60, label: "lugares no salão" },
              { to: 35, label: "pessoas no time" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="font-display text-4xl text-gold"><Counter to={s.to} decimals={s.decimals} suffix={s.suffix} /></p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="timeline" className="border-y border-white/10 bg-[#0e0b08] py-20">
        <div className="container-x">
          <h2 id="timeline" className="font-display text-5xl"><span className="slant">Linha do tempo</span></h2>
          <Reveal as="ul" stagger={0.12} className="mt-10 grid gap-5 md:grid-cols-4">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative rounded-3xl border border-white/10 bg-[#130f0b] p-6">
                <p className="font-display text-4xl text-primary">{t.year}</p>
                <p className="mt-3 font-extrabold">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <Reveal key={v.title} className="rounded-3xl border border-white/10 p-6">
              <p className="text-lg font-extrabold">{v.title}</p>
              <p className="mt-2 text-muted-foreground">{v.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="relative mt-16 grid gap-5 md:grid-cols-2">
          {["interior-1", "interior-2"].map((img) => (
            <Reveal key={img} variant="mask" className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={`/images/${img}.webp`} alt="Salão da Smash House" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button asChild size="lg"><Link href="/cardapio">Provar agora <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
