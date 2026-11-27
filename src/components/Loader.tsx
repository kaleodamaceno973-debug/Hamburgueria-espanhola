import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BRAND_ASSETS } from '../data/brand';
import { NeonCowSvg } from './NeonCowSvg';

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cowWrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      onDone();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      onDone();
    };

    // Real preload & decode for hero & logo
    const urlsToPreload = [BRAND_ASSETS.heroMacro, BRAND_ASSETS.logoWhite];
    let loaded = 0;
    const updateProgress = () => {
      loaded += 1;
      if (barRef.current) {
        const pct = Math.min(100, Math.round((loaded / urlsToPreload.length) * 100));
        barRef.current.style.transform = `scaleX(${pct / 100})`;
      }
    };

    urlsToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(updateProgress);
      } else {
        img.onload = updateProgress;
        img.onerror = updateProgress;
      }
    });

    const ctx = gsap.context(() => {
      const paths = rootRef.current?.querySelectorAll('path, ellipse, circle');
      if (paths) {
        paths.forEach((el) => {
          const geom = el as SVGGeometryElement;
          if (typeof geom.getTotalLength === 'function') {
            const len = geom.getTotalLength();
            gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len });
          }
        });
      }

      const tl = gsap.timeline({
        onComplete: finish,
      });

      if (paths) {
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power2.out',
        });
      }

      // Neon flicker (opacity only)
      tl.to(cowWrapRef.current, { opacity: 0.25, duration: 0.06 })
        .to(cowWrapRef.current, { opacity: 1, duration: 0.06 })
        .to(cowWrapRef.current, { opacity: 0.4, duration: 0.06 })
        .to(cowWrapRef.current, { opacity: 1, duration: 0.08 });

      tl.fromTo(
        wordRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
        '-=0.18'
      );

      // Exit with zoom + fade (total <= 1.45s)
      tl.to(rootRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.35,
        delay: 0.15,
        ease: 'power2.inOut',
      });
    }, rootRef);

    // Hard safety cap at 1.5s
    const hardCap = window.setTimeout(finish, 1500);

    return () => {
      window.clearTimeout(hardCap);
      ctx.revert();
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6"
      aria-label="Cargando Baka Vieja Burger Shop"
      role="status"
    >
      <div ref={cowWrapRef} className="w-40 sm:w-48">
        <NeonCowSvg idPrefix="loader-cow" strokeWidth={4.5} />
      </div>
      <div ref={wordRef} className="mt-4 text-center opacity-0">
        <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
          BAKA VIEJA
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#FFB547]">
          Burger Shop
        </p>
      </div>
      <div className="mt-6 h-[2px] w-40 overflow-hidden bg-white/15">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-25 bg-[#FFB547] transition-transform duration-300"
        />
      </div>
    </div>
  );
}
