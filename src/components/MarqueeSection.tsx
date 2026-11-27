import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeSectionProps {
  reducedMotion: boolean;
}

const LINE_1 = 'BURGERS CON CUERPO · PUNTO · MORDIDA · CARBÓN DE ENCINA · ';
const LINE_2 = 'NO BURGER · NO PARTY · SIN POSTUREO · DESDE 2014 · ';

export default function MarqueeSection({ reducedMotion }: MarqueeSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const track1Ref = useRef<HTMLDivElement | null>(null);
  const track2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!section || !t1 || !t2) return;

    let pos1 = 0;
    let pos2 = -50;
    let velocityFactor = 1;
    let direction = 1;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const vel = self.getVelocity();
          direction = vel >= 0 ? 1 : -1;
          velocityFactor = 1 + Math.min(Math.abs(vel) / 450, 4.5);
        },
      });
    }, sectionRef);

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      velocityFactor += (1 - velocityFactor) * 0.08;
      const step = 4.2 * dt * velocityFactor * direction;

      pos1 -= step;
      pos2 += step;

      if (pos1 <= -50) pos1 += 50;
      if (pos1 > 0) pos1 -= 50;
      if (pos2 >= 0) pos2 -= 50;
      if (pos2 < -50) pos2 += 50;

      t1.style.transform = `translate3d(${pos1}%, 0, 0)`;
      t2.style.transform = `translate3d(${pos2}%, 0, 0)`;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Lemas de Bilbo Burger"
      className="relative overflow-hidden border-y border-white/10 bg-[#0B0B0B] py-8 sm:py-12"
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Ribbon 1 */}
        <div className="-rotate-1 bg-[#E9632D] py-2.5 text-[#0B0B0B]">
          <div
            ref={track1Ref}
            className="flex w-max whitespace-nowrap will-change-transform"
          >
            <span className="font-display text-lg tracking-wide sm:text-2xl">
              {LINE_1.repeat(4)}
            </span>
          </div>
        </div>

        {/* Ribbon 2 */}
        <div className="rotate-1 border-y border-[#E9632D]/40 bg-[#141414] py-2.5 text-[#F5EFE6]">
          <div
            ref={track2Ref}
            className="flex w-max whitespace-nowrap will-change-transform"
          >
            <span className="font-display text-lg tracking-wide sm:text-2xl">
              {LINE_2.repeat(4)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
