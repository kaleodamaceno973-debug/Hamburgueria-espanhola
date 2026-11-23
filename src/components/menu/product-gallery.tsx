"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Galeria com zoom por lupa (desktop) e tela cheia (toque). */
export function ProductGallery({ images, name }: { images: { url: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <Dialog>
        <div
          ref={frame}
          className="group relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-[#120e0b] [cursor:zoom-in]"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onPointerLeave={() => setZoom(null)}
        >
          <Image
            key={img.url}
            src={img.url}
            alt={img.alt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 ease-out animate-in fade-in-0"
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-primary hover:text-black"
              aria-label="Ver imagem em tela cheia"
            >
              <Expand className="size-5" />
            </button>
          </DialogTrigger>
        </div>
        <DialogContent className="max-w-4xl p-2 sm:p-3">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <div className="relative aspect-square w-full overflow-auto rounded-xl" data-lenis-prevent>
            <Image src={img.url} alt={img.alt} fill sizes="90vw" quality={85} className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="flex gap-3" role="tablist" aria-label="Fotos do produto">
          {images.map((im, i) => (
            <button
              key={im.url + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Foto ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-20 overflow-hidden rounded-2xl border-2 transition sm:size-24",
                i === active ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={im.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
