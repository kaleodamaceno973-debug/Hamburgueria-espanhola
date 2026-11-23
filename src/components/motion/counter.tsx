"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";

/** Contador animado ao entrar na tela (pt-BR). */
export function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    prefix + n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => (el.textContent = fmt(obj.v)),
        scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(to)}
    </span>
  );
}
