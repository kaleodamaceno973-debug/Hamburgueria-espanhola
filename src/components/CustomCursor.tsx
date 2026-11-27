import { useEffect, useRef } from 'react';
import { BRAND_ASSETS } from '../data/brand';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const el = cursorRef.current;
    if (!el) return;

    document.body.classList.add('custom-cursor-ready');

    let targetX = -100;
    let targetY = -100;
    let curX = -100;
    let curY = -100;
    let scale = 1;
    let targetScale = 1;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, input, select, textarea, [role="button"]');
      targetScale = interactive ? 1.35 : 1;
    };

    const onLeave = () => {
      targetX = -100;
      targetY = -100;
    };

    const loop = () => {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;
      scale += (targetScale - scale) * 0.2;
      el.style.transform = `translate3d(${curX - 16}px, ${curY - 16}px, 0) scale(${scale})`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-ready');
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[95] hidden h-8 w-8 items-center justify-center rounded-full border border-[#FFB547]/70 bg-black/50 [@media(hover:hover)_and_(pointer:fine)]:flex"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      aria-hidden="true"
    >
      <img
        src={BRAND_ASSETS.cowIcon}
        alt=""
        className="h-4 w-4 object-contain"
        draggable={false}
      />
    </div>
  );
}
