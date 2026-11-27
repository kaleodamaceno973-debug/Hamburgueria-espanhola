import React, { useEffect, useRef, useState } from 'react';

/**
 * Cursor personalizado (pequeño tentáculo) activo únicamente en dispositivos
 * con puntero fino y hover real, desactivado automáticamente con prefers-reduced-motion.
 */
export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fineHover = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fineHover || reduced) return;

    setEnabled(true);

    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isInteractive = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      if (cursorRef.current) {
        const scale = isInteractive ? 1.25 : 1;
        cursorRef.current.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${scale})`;
      }
      if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const el = e.target as HTMLElement | null;
      isInteractive = Boolean(el?.closest('a, button, input, label, [role="button"]'));
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = -100;
      targetY = -100;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[120] pointer-events-none -ml-2 -mt-2 will-change-transform hidden md:block"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
        <path
          d="M5 4 C 8 11, 14 14, 21 15 C 24 15.5, 25 19, 21 21 C 17 22.5, 13 18, 15 14"
          stroke="#A8873A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="11" r="1.3" fill="#F3EADC" />
        <circle cx="13.5" cy="14" r="1.2" fill="#F3EADC" />
      </svg>
    </div>
  );
};
