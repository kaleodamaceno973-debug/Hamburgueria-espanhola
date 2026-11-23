"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";
import { Button } from "@/components/ui/button";

export function Promo({ title, subtitle, code }: { title: string; subtitle: string; code: string }) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-promo-img]", { xPercent: 30, rotate: 12, scale: 0.85 }, {
        xPercent: 0,
        rotate: -4,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true },
      });
      gsap.fromTo("[data-promo-slab]", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }, {
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard bloqueado: o código continua visível */
    }
  };

  return (
    <section ref={ref} aria-labelledby="promo-title" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#120d09]">
          <div
            data-promo-slab
            className="stripes absolute inset-y-0 left-0 w-full bg-gradient-to-br from-[#ff8a1f] via-primary to-flame md:w-[64%]"
            style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
          />
          <div className="relative grid items-center gap-6 p-7 sm:p-12 md:grid-cols-[1.2fr_1fr]">
            <div className="text-black">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em]">Oferta de boas-vindas</p>
              <h2 id="promo-title" className="font-display mt-3 text-[clamp(3rem,9vw,6rem)]">
                <span className="slant">{title}</span>
              </h2>
              <p className="font-display text-[clamp(1.6rem,4vw,2.6rem)] text-white">
                <span className="slant">{subtitle}</span>
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copy}
                  className="flex h-12 items-center gap-3 rounded-full border-2 border-dashed border-black/60 bg-white/20 px-5 font-mono text-lg font-bold tracking-widest backdrop-blur transition hover:bg-white/35"
                  aria-label={`Copiar cupom ${code}`}
                >
                  {code}
                  {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
                </button>
                <span aria-live="polite" className="text-sm font-bold">{copied ? "Copiado!" : ""}</span>
              </div>
              <Button asChild size="lg" className="mt-6 bg-black text-white shadow-none hover:bg-black/85">
                <Link href="/cardapio">Pedir agora <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <div data-promo-img className="absolute inset-0">
                <div className="absolute inset-[8%] rounded-full bg-primary/30 blur-3xl" />
                <Image
                  src="/images/house-burger.webp"
                  alt="Burger completo da casa"
                  fill
                  sizes="(max-width: 768px) 80vw, 30vw"
                  className="rounded-full object-cover shadow-2xl [mask-image:radial-gradient(circle,#000_60%,transparent_71%)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
