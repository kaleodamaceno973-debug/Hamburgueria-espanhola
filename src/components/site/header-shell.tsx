"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Header que fica sólido ao rolar e se esconde ao descer (aparece ao subir). */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 400 && y > last + 4);
        if (y < last - 4 || y < 400) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-white/10 bg-[#0a0806]/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
        hidden && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
