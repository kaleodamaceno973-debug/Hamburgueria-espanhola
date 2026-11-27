import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROW_1 = 'RABAS · TORREZNOS · BASERRITARRAS · GAMBERRAS · CANALLAS · ';
const ROW_2 = 'PÉREZ GALDÓS 33 · BILBAO · TERRAZA · PARA LLEVAR · ';

export const DoubleMarquee: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const track1Ref = useRef<HTMLDivElement | null>(null);
  const track2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      if (!track1Ref.current || !track2Ref.current) return;

      const tween1 = gsap.to(track1Ref.current, {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });

      const tween2 = gsap.fromTo(
        track2Ref.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: 26,
          ease: 'none',
          repeat: -1,
        }
      );

      let resetTimer: number | null = null;

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const vel = self.getVelocity();
          const dir = self.direction || 1;
          // Cero asignaciones ni gsap.to() dentro de onUpdate; sólo ajuste directo de timeScale
          const boost = Math.min(3.5, 1 + Math.abs(vel) / 900);
          tween1.timeScale(dir * boost);
          tween2.timeScale(dir * boost);

          if (resetTimer) window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            tween1.timeScale(1);
            tween2.timeScale(1);
          }, 180);
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden py-7 sm:py-9 bg-[#14321F] border-b border-[#A8873A]/30 select-none"
      aria-hidden="true"
    >
      {/* Banda 1 */}
      <div className="-rotate-1 bg-[#F3EADC] text-[#1F4A2E] border-y border-[#A8873A] py-2.5 overflow-hidden">
        <div
          ref={track1Ref}
          className="flex w-max whitespace-nowrap will-change-transform font-display font-extrabold text-base sm:text-xl tracking-wide"
        >
          <span>{ROW_1.repeat(4)}</span>
          <span>{ROW_1.repeat(4)}</span>
        </div>
      </div>

      {/* Banda 2 cruzada */}
      <div className="rotate-1 -mt-1.5 bg-[#1F4A2E] text-[#F3EADC] border-y border-[#A8873A]/60 py-2.5 overflow-hidden">
        <div
          ref={track2Ref}
          className="flex w-max whitespace-nowrap will-change-transform text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#F3EADC]/90"
        >
          <span>{ROW_2.repeat(4)}</span>
          <span>{ROW_2.repeat(4)}</span>
        </div>
      </div>
    </div>
  );
};
