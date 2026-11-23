"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Carrossel com scroll-snap nativo (toque perfeito no iOS), setas e
 * barra de progresso. Arrastar com o mouse também funciona.
 */
export function MenuCarousel({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // Arrastar com mouse (desktop)
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.scrollLeft = startLeft - dx;
      }
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide-item]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        role="region"
        aria-roledescription="carrossel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") scrollByCard(1);
          if (e.key === "ArrowLeft") scrollByCard(-1);
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-6 pt-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-10 lg:scroll-px-10 lg:px-10 [&>*]:snap-start"
        data-lenis-prevent-horizontal
      >
        {children}
      </div>
      <div className="mt-2 flex items-center gap-5">
        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <div
            className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-gradient-to-r from-gold to-flame transition-transform duration-150"
            style={{ transform: `translateX(${progress * 300}%)` }}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scrollByCard(-1)} disabled={edges.start} aria-label="Anterior">
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scrollByCard(1)} disabled={edges.end} aria-label="Próximo">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
