"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";

/** Imagem com parallax vertical suave durante o scroll. */
export function ParallaxImage({ src, alt, sizes = "(max-width: 1024px) 100vw, 50vw", amount = 12 }: { src: string; alt: string; sizes?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current.querySelector("img"),
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={src} alt={alt} fill sizes={sizes} className="scale-[1.3] object-cover" />
    </div>
  );
}
