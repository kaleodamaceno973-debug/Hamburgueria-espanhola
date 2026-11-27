import { useState } from 'react';
import { PICOTEO_ITEMS } from '../data/carta';
import { NEGOCIO } from '../data/negocio';

interface PicoteoGridProps {
  reducedMotion: boolean;
  onOpenOrder: () => void;
}

export default function PicoteoGrid({ reducedMotion, onOpenOrder }: PicoteoGridProps) {
  const [tiltState, setTiltState] = useState<Record<string, { rx: number; ry: number }>>({});

  const handleMove = (id: string, e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltState((prev) => ({
      ...prev,
      [id]: { rx: -y * 9, ry: x * 9 },
    }));
  };

  const handleLeave = (id: string) => {
    setTiltState((prev) => ({
      ...prev,
      [id]: { rx: 0, ry: 0 },
    }));
  };

  return (
    <section
      id="picoteo"
      aria-labelledby="picoteo-title"
      className="relative bg-[#0B0B0B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
            Para empezar o compartir
          </span>
          <h2
            id="picoteo-title"
            className="font-display mt-2 text-4xl leading-tight text-[#F5EFE6] sm:text-6xl"
          >
            Picoteo <span className="text-[#E9632D]">sin filtros.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#F5EFE6]/80 sm:text-lg">
            {NEGOCIO.textos.picoteoTexto}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PICOTEO_ITEMS.map((item) => {
            const tilt = tiltState[item.id] ?? { rx: 0, ry: 0 };
            return (
              <article
                key={item.id}
                onMouseMove={(e) => handleMove(item.id, e)}
                onMouseLeave={() => handleLeave(item.id)}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#101010] p-6 transition-colors duration-200 hover:border-[#E9632D]/45"
                style={{
                  transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease',
                }}
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#0B0B0B]">
                  <img
                    src={item.imagen}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    className="picoteo-mask h-[86%] w-[86%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className="font-display mt-5 text-2xl text-[#F5EFE6]">
                  {item.nombre}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#F5EFE6]/70">
                  {item.detalle}
                </p>
              </article>
            );
          })}
        </div>

        {/* Dessert callout */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E9632D]/30 bg-[#141414] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] text-[#FFB23F] uppercase">
              El remate final
            </span>
            <p className="font-display mt-1 text-xl text-[#F5EFE6] sm:text-2xl">
              Y si todavía te queda sitio… tarta de queso al horno.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenOrder}
            className="min-h-[44px] rounded-full bg-[#E9632D] px-6 py-2.5 text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.03] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
          >
            Pedir picoteo y postre
          </button>
        </div>
      </div>
    </section>
  );
}
