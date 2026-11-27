import { useEffect, useState } from 'react';

interface EmberLoaderProps {
  onDone: () => void;
  reducedMotion: boolean;
}

export default function EmberLoader({ onDone, reducedMotion }: EmberLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return;
    }

    let cancelled = false;
    const start = performance.now();
    const minDuration = 850;
    const maxDuration = 1450;

    // Failsafe in case asset loading stalls
    const failsafeTimer = window.setTimeout(() => {
      if (!cancelled) {
        setProgress(100);
        setClosing(true);
        window.setTimeout(onDone, 260);
      }
    }, 6500);

    const preloadHero = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = '/images/hero-burger.webp';
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    let rafId = 0;
    let assetsReady = false;

    Promise.all([preloadHero, fontsReady]).then(() => {
      assetsReady = true;
    });

    const update = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const naturalPct = Math.min(92, (elapsed / maxDuration) * 95);

      if (assetsReady && elapsed >= minDuration) {
        setProgress(100);
        setClosing(true);
        window.clearTimeout(failsafeTimer);
        window.setTimeout(() => {
          if (!cancelled) onDone();
        }, 280);
        return;
      }

      if (elapsed >= maxDuration) {
        setProgress(100);
        setClosing(true);
        window.clearTimeout(failsafeTimer);
        window.setTimeout(() => {
          if (!cancelled) onDone();
        }, 280);
        return;
      }

      setProgress(Math.round(naturalPct));
      rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(failsafeTimer);
    };
  }, [onDone, reducedMotion]);

  if (reducedMotion) return null;

  const perimeterOuter = 540;
  const perimeterInner = 460;
  const dashOffsetOuter = perimeterOuter * (1 - progress / 100);
  const dashOffsetInner = perimeterInner * (1 - progress / 100);

  return (
    <div
      aria-label="Cargando Bilbo Burger"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B] transition-opacity duration-300 ${
        closing ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Static ember radial glow at center */}
      <div
        aria-hidden="true"
        className="ember-glow-static pointer-events-none absolute h-72 w-72 rounded-full opacity-90"
      />

      {/* Double-ellipse logo outline drawing itself */}
      <div className="relative flex flex-col items-center">
        <svg
          width="240"
          height="112"
          viewBox="0 0 240 112"
          fill="none"
          aria-hidden="true"
          className="overflow-visible"
        >
          <ellipse
            cx="120"
            cy="56"
            rx="112"
            ry="48"
            stroke="#E9632D"
            strokeWidth="3"
            strokeDasharray={perimeterOuter}
            strokeDashoffset={dashOffsetOuter}
            strokeLinecap="round"
          />
          <ellipse
            cx="120"
            cy="56"
            rx="98"
            ry="38"
            stroke="#FFB23F"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeDasharray={perimeterInner}
            strokeDashoffset={dashOffsetInner}
            strokeLinecap="round"
          />
          <text
            x="120"
            y="53"
            textAnchor="middle"
            fill="#F5EFE6"
            className="font-display"
            fontSize="20"
            letterSpacing="1.5"
          >
            BILBO
          </text>
          <text
            x="120"
            y="74"
            textAnchor="middle"
            fill="#E9632D"
            className="font-display"
            fontSize="20"
            letterSpacing="1.5"
          >
            BURGER
          </text>
        </svg>

        <div className="mt-6 flex items-center gap-3 text-xs tracking-[0.22em] text-[#F5EFE6]/70 uppercase tabular-nums">
          <span>Encendiendo brasa</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#E9632D] font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
