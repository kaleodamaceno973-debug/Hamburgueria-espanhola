import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onDone: () => void;
}

/**
 * Loader de <= 1,5 s con progreso real (fuentes + imágenes clave) y failsafe de 8 s.
 * Los tentáculos del logotipo se dibujan en trazo crema sobre verde botella y se recogen al salir.
 */
export const Loader: React.FC<LoaderProps> = ({ onDone }) => {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(12);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const leftTentacleRef = useRef<SVGPathElement | null>(null);
  const rightTentacleRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    let finished = false;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setHidden(true);
      onDone();
      return;
    }

    const ctx = gsap.context(() => {
      const paths = [leftTentacleRef.current, rightTentacleRef.current].filter(
        (p): p is SVGPathElement => Boolean(p)
      );

      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.72,
        ease: 'power2.out',
        stagger: 0.08,
      });

      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, delay: 0.2, ease: 'power3.out' }
        );
      }
    }, rootRef);

    const exitLoader = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      const paths = [leftTentacleRef.current, rightTentacleRef.current].filter(
        (p): p is SVGPathElement => Boolean(p)
      );

      const tl = gsap.timeline({
        onComplete: () => {
          setHidden(true);
          onDone();
        },
      });

      paths.forEach((p) => {
        const len = p.getTotalLength();
        tl.to(
          p,
          {
            strokeDashoffset: len,
            duration: 0.36,
            ease: 'power2.in',
          },
          0
        );
      });

      if (rootRef.current) {
        tl.to(
          rootRef.current,
          {
            yPercent: -100,
            duration: 0.45,
            ease: 'power3.inOut',
          },
          0.12
        );
      }
    };

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        if (typeof img.decode === 'function') {
          img.decode().then(resolve).catch(resolve);
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });

    const minTimer = new Promise<void>((resolve) => window.setTimeout(resolve, 820));
    const maxTimer = window.setTimeout(exitLoader, 1450);
    const failsafeTimer = window.setTimeout(exitLoader, 8000);

    const fontsReady = document.fonts ? document.fonts.ready.then(() => setProgress((p) => Math.max(p, 58))) : Promise.resolve();
    const heroImgReady = preloadImage('/images/racion-rabas.webp').then(() =>
      setProgress((p) => Math.max(p, 88))
    );

    Promise.all([minTimer, fontsReady, heroImgReady]).then(() => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(failsafeTimer);
      exitLoader();
    });

    return () => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(failsafeTimer);
      ctx.revert();
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1F4A2E] text-[#F3EADC] select-none"
      aria-live="polite"
      aria-label="Cargando JEYMA Bilbao"
    >
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 280 120"
          className="w-60 sm:w-72 h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Rostro y txapela en trazo crema */}
          <path
            d="M112 40c4-12 16-22 30-22 15 0 27 8 28 19-12-3-38-3-58 3Z"
            stroke="#F3EADC"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M116 42c-2 15 0 31 5 40h38c5-9 7-25 5-40"
            stroke="#F3EADC"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="130" cy="65" r="2.5" fill="#F3EADC" />
          <circle cx="150" cy="65" r="2.5" fill="#F3EADC" />

          {/* Tentáculo izquierdo animado */}
          <path
            ref={leftTentacleRef}
            d="M118 82 C 95 85, 76 74, 66 60 C 56 46, 36 48, 30 62 C 24 76, 40 94, 58 88"
            stroke="#F3EADC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Tentáculo derecho animado */}
          <path
            ref={rightTentacleRef}
            d="M162 82 C 185 85, 204 74, 214 60 C 224 46, 244 48, 250 62 C 256 76, 240 94, 222 88"
            stroke="#F3EADC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        <div ref={wordmarkRef} className="-mt-4 text-center opacity-0">
          <span className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-[#F3EADC]">
            jeyma
          </span>
          <p className="mt-2 text-xs tracking-[0.22em] uppercase text-[#A8873A] tabular-nums">
            Bilbao · {progress}%
          </p>
        </div>
      </div>
    </div>
  );
};
