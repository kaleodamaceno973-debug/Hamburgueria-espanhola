"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/utils";

type Point = { date: string; label: string; revenueCents: number; orders: number };

/**
 * Faturamento diário (série única → sem legenda; o título nomeia).
 * Barras finas com topo arredondado, grade discreta, tooltip por barra
 * (mouse e teclado) e tabela acessível como alternativa.
 */
export function RevenueChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const W = 720;
  const H = 240;
  const pad = { l: 56, r: 8, t: 12, b: 28 };
  const max = Math.max(1, ...data.map((d) => d.revenueCents));
  const step = niceStep(max / 4);
  const top = Math.ceil(max / step) * step;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bw = iw / data.length;
  const barW = Math.max(3, bw - 4);
  const y = (v: number) => pad.t + ih - (v / top) * ih;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const h = hover !== null ? data[hover] : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-bold">Faturamento — últimos 30 dias</h2>
        <button type="button" onClick={() => setTable((t) => !t)} className="text-xs font-semibold text-primary hover:underline">
          {table ? "Ver gráfico" : "Ver tabela"}
        </button>
      </div>
      {table ? (
        <div className="max-h-72 overflow-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#15110d] text-left text-xs text-muted-foreground">
              <tr><th className="px-3 py-2">Dia</th><th className="px-3 py-2 text-right">Pedidos</th><th className="px-3 py-2 text-right">Faturamento</th></tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-white/5">
                  <td className="px-3 py-1.5">{d.label}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{d.orders}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatBRL(d.revenueCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Gráfico de barras do faturamento diário dos últimos 30 dias">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.07)" />
                <text x={pad.l - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#a99f92">
                  {t >= 100000 ? `${Math.round(t / 100000)}k` : Math.round(t / 100)}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const x = pad.l + i * bw + (bw - barW) / 2;
              const bh = Math.max(0, pad.t + ih - y(d.revenueCents));
              const r = Math.min(4, barW / 2, bh);
              const yy = pad.t + ih - bh;
              return (
                <g key={d.date}>
                  {bh > 0 && (
                    <path
                      d={`M${x},${pad.t + ih} V${yy + r} Q${x},${yy} ${x + r},${yy} H${x + barW - r} Q${x + barW},${yy} ${x + barW},${yy + r} V${pad.t + ih} Z`}
                      fill={hover === i ? "#ff7a1a" : "#e8640f"}
                      opacity={hover === null || hover === i ? 1 : 0.55}
                    />
                  )}
                  {/* área de toque maior que a barra */}
                  <rect
                    x={pad.l + i * bw}
                    y={pad.t}
                    width={bw}
                    height={ih}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${d.label}: ${formatBRL(d.revenueCents)}, ${d.orders} pedidos`}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className="outline-none"
                  />
                  {(i % 5 === 0 || i === data.length - 1) && (
                    <text x={pad.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#a99f92">{d.label}</text>
                  )}
                </g>
              );
            })}
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke="rgba(255,255,255,0.18)" />
          </svg>
          {h && hover !== null && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl border border-white/10 bg-[#1d1712] px-3 py-2 text-xs shadow-xl"
              style={{ left: `${((pad.l + hover * bw + bw / 2) / W) * 100}%` }}
            >
              <p className="text-sm font-bold tabular-nums">{formatBRL(h.revenueCents)}</p>
              <p className="text-muted-foreground">{h.label} · {h.orders} pedidos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function niceStep(raw: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}
