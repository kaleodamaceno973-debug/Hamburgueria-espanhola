import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface EmberCursorProps {
  reducedMotion: boolean;
}

export default function EmberCursor({ reducedMotion }: EmberCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const el = cursorRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.16, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.16, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.18, ease: 'power2.out' });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.style.opacity = '1';
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, summary, [role="button"]')
      );
      scaleTo(isInteractive ? 2.1 : 1);
    };

    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFB23F]/90 bg-[#E9632D]/75 opacity-0 md:block"
      style={{ willChange: 'transform, opacity' }}
    />
  );
}
