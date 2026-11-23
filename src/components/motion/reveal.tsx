"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** fade-up (padrão), mask (cortina), scale */
  variant?: "fade-up" | "mask" | "scale" | "left" | "right";
  delay?: number;
  /** anima filhos diretos em sequência */
  stagger?: number;
  as?: "div" | "section" | "ul" | "li" | "figure";
};

/** Revela conteúdo ao entrar na tela — reversível ao rolar para cima. */
export function Reveal({ children, className, variant = "fade-up", delay = 0, stagger, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.children) : [el];
      const from: gsap.TweenVars =
        variant === "mask"
          ? { clipPath: "inset(100% 0% 0% 0%)", y: 40 }
          : variant === "scale"
            ? { scale: 0.9, autoAlpha: 0 }
            : variant === "left"
              ? { x: -60, autoAlpha: 0 }
              : variant === "right"
                ? { x: 60, autoAlpha: 0 }
                : { y: 50, autoAlpha: 0 };
      const to: gsap.TweenVars =
        variant === "mask"
          ? { clipPath: "inset(0% 0% 0% 0%)", y: 0 }
          : { x: 0, y: 0, scale: 1, autoAlpha: 1 };

      gsap.fromTo(targets, from, {
        ...to,
        duration: variant === "mask" ? 1.2 : 0.9,
        ease: variant === "mask" ? "expo.out" : "power3.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={cn(className)}>
      {children}
    </Tag>
  );
}

export { ScrollTrigger };
