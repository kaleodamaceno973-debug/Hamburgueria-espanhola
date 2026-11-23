"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";
import { cn } from "@/lib/utils";

/**
 * Título com revelação por linha (máscara) ao entrar na viewport.
 * Usa SplitText com autoSplit — re-divide ao redimensionar sem quebrar.
 */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
  by = "lines",
  id,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  by?: "lines" | "words" | "chars";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | null = null;
      const run = () => {
        split = SplitText.create(el, {
          type: by === "chars" ? "words,chars" : by === "words" ? "words" : "lines",
          mask: by === "chars" ? "words" : by,
          autoSplit: true,
          linesClass: "split-line",
          wordsClass: "split-word",
          onSplit(self) {
            const parts = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            return gsap.from(parts, {
              yPercent: 110,
              rotate: by === "lines" ? 2 : 0,
              duration: 1,
              ease: "expo.out",
              stagger: by === "chars" ? 0.025 : 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
            });
          },
        });
      };
      // Aguarda as fontes para medir linhas corretamente.
      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}
