"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/client/gsap";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Lenis sincronizado com o ticker do GSAP (um único loop de animação). */
export function SmoothScroll() {
  return (
    <Suspense fallback={null}>
      <SmoothScrollInner />
    </Suspense>
  );
}

function SmoothScrollInner() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -90 } });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Nova rota: recalcula os gatilhos de scroll (o Next cuida da posição).
  useEffect(() => {
    lenisInstance?.resize();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
