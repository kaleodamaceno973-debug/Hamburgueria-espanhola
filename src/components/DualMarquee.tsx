import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function DualMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const t1 = gsap.to(track1Ref.current, {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });

      const t2 = gsap.fromTo(
        track2Ref.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: 28,
          ease: 'none',
          repeat: -1,
        }
      );

      let resetTimer = 0;
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const dir = self.direction || 1;
          const speedBoost = Math.min(3.2, 1 + Math.abs(velocity) / 900);
          t1.timeScale(dir * speedBoost);
          t2.timeScale(dir * speedBoost);
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            t1.timeScale(dir);
            t2.timeScale(dir);
          }, 160);
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const line1 = 'BURGERS BRUTALES · PATATAS BRUTALES · NACHOS MÍTICOS · ';
  const line2 = 'BILBAO · ZARAGOZA · BURGOS · DESDE 2019 · ';

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden border-y border-white/10 bg-[#070708] py-6 select-none"
      aria-label="Manifiesto Baka Vieja"
    >
      <div className="overflow-hidden whitespace-nowrap">
        <div
          ref={track1Ref}
          className="inline-flex will-change-transform font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
        >
          <span className="pr-4">{line1.repeat(4)}</span>
          <span className="pr-4">{line1.repeat(4)}</span>
        </div>
      </div>

      <div className="mt-2 overflow-hidden whitespace-nowrap">
        <div
          ref={track2Ref}
          className="inline-flex will-change-transform font-display text-lg sm:text-2xl font-bold uppercase tracking-[0.18em] text-[#FFB547]"
        >
          <span className="pr-4">{line2.repeat(4)}</span>
          <span className="pr-4">{line2.repeat(4)}</span>
        </div>
      </div>
    </section>
  );
}
