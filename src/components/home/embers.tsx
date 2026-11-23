"use client";

import { useEffect, useRef } from "react";

/**
 * Brasas subindo (canvas 2D leve). DPR ≤ 2, pausa fora da tela ou com
 * a aba oculta e não roda com prefers-reduced-motion.
 */
export function Embers({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    type P = { x: number; y: number; r: number; vy: number; vx: number; life: number; max: number; hue: number };
    let particles: P[] = [];

    const spawn = (initial = false): P => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 18 + Math.random() * 42,
      vx: -8 + Math.random() * 16,
      life: 0,
      max: 3 + Math.random() * 5,
      hue: 18 + Math.random() * 26,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w < 640 ? 22 : 48) * density);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt;
        p.y -= p.vy * dt;
        p.x += (p.vx + Math.sin((p.life + i) * 2) * 10) * dt;
        const t = p.life / p.max;
        if (t >= 1 || p.y < -10) {
          particles[i] = spawn();
          continue;
        }
        const alpha = Math.sin(Math.PI * t) * 0.9;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
