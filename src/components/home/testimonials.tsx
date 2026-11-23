import { Quote, Star } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";
import { SectionHeading } from "./section-heading";

type T = { id: string; name: string; role: string; text: string; rating: number };

function Card({ t }: { t: T }) {
  return (
    <figure className="mx-2.5 w-[300px] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a140f] to-[#120e0b] p-6 sm:w-[380px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" role="img" aria-label={`${t.rating} de 5 estrelas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={i < t.rating ? "size-4 fill-gold text-gold" : "size-4 text-white/20"} aria-hidden />
          ))}
        </div>
        <Quote className="size-6 text-primary/40" aria-hidden />
      </div>
      <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/85">“{t.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-gold to-flame font-extrabold text-black">{t.name.charAt(0)}</span>
        <span>
          <span className="block text-sm font-bold">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: T[] }) {
  if (items.length === 0) return null;
  const half = Math.ceil(items.length / 2);
  return (
    <section aria-labelledby="test-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading id="test-title" align="center" eyebrow="Quem prova, volta" title="O que dizem por aí" text="Avaliação média 4,9 em mais de 3.000 pedidos." />
      </div>
      <div className="mt-12 space-y-5">
        <Marquee duration={55}>{items.slice(0, half).map((t) => <Card key={t.id} t={t} />)}</Marquee>
        <Marquee duration={60} reverse>{items.slice(half).map((t) => <Card key={t.id} t={t} />)}</Marquee>
      </div>
    </section>
  );
}
