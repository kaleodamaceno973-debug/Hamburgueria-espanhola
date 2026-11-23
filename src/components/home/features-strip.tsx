import { Award, Flame, Star, Timer } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";

const FEATURES = [
  { icon: Award, title: "Qualidade premium", text: "Só ingredientes selecionados" },
  { icon: Flame, title: "Smash perfeito", text: "Crosta caramelizada na chapa" },
  { icon: Star, title: "Sabor inesquecível", text: "Nota 4,9 dos nossos clientes" },
  { icon: Timer, title: "Rápido & confiável", text: "Entrega ou retirada sem fila" },
];

const WORDS = ["Smash burgers", "Carne fresca", "Pão brioche", "Cheddar de verdade", "Feito na chapa", "Desde 2018"];

export function FeaturesStrip() {
  return (
    <section aria-label="Diferenciais" className="relative border-y border-white/10 bg-[#0e0b08]">
      <Reveal stagger={0.08} className="container-x grid grid-cols-2 gap-x-4 gap-y-6 py-8 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="group flex items-center gap-3 sm:gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 sm:size-12">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold leading-tight sm:text-base">{title}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{text}</p>
            </div>
          </div>
        ))}
      </Reveal>
      <div className="border-t border-white/5 py-5" aria-hidden>
        <Marquee duration={40}>
          {WORDS.map((w) => (
            <span key={w} className="font-display flex items-center gap-8 px-4 text-4xl sm:text-6xl">
              <span className="slant text-outline">{w}</span>
              <span className="text-primary" aria-hidden>✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
