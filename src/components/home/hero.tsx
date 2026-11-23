"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";
import { Button } from "@/components/ui/button";
import { Embers } from "./embers";

export type HeroBanner = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
};

const AUTOPLAY_MS = 7000;

export function Hero({ banners }: { banners: HeroBanner[] }) {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const animating = useRef(false);
  const total = banners.length;

  /* ── Entrada inicial ── */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero-img='0']", { scale: 1.18 }, { scale: 1, duration: 2.2 }, 0)
        .fromTo("[data-hero-glow]", { opacity: 0 }, { opacity: 1, duration: 2 }, 0)
        .fromTo("[data-slide='0'] [data-line] > *", { yPercent: 115, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.1 }, 0.15)
        .fromTo("[data-slide='0'] [data-fade]", { y: 18 }, { y: 0, duration: 1, stagger: 0.08 }, 0.1)
        .fromTo("[data-hero-badge]", { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.4, ease: "back.out(1.6)" }, 0.7)
        .fromTo("[data-hero-ui]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.8);
      // A partir daqui o GSAP controla os estilos (desliga o CSS de pré-hidratação).
      root.current?.setAttribute("data-ready", "");

      /* Scroll: a cena "afunda" e o texto sobe (scrub, reversível). */
      gsap.to("[data-hero-media]", {
        yPercent: 18,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -30,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
    },
    { scope: root },
  );

  /* ── Parallax com mouse e toque ── */
  useGSAP(
    (_c, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe || prefersReducedMotion()) return;
      const mx = gsap.quickTo("[data-parallax]", "x", { duration: 1.2, ease: "power3.out" });
      const my = gsap.quickTo("[data-parallax]", "y", { duration: 1.2, ease: "power3.out" });
      const bx = gsap.quickTo("[data-parallax-back]", "x", { duration: 1.6, ease: "power3.out" });
      const by = gsap.quickTo("[data-parallax-back]", "y", { duration: 1.6, ease: "power3.out" });
      const onMove = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        mx(px * 28);
        my(py * 18);
        bx(px * -18);
        by(py * -12);
      });
      const onLeave = contextSafe(() => {
        mx(0);
        my(0);
        bx(0);
        by(0);
      });
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("touchend", onLeave, { passive: true });
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("touchend", onLeave);
      };
    },
    { scope: root },
  );

  /* ── Troca de slide ── */
  const { contextSafe } = useGSAP({ scope: root });
  const goTo = useCallback(
    (next: number) => {
      if (total < 2 || animating.current) return;
      const to = (next + total) % total;
      if (to === index) return;
      const reduce = prefersReducedMotion();
      animating.current = true;
      const run = contextSafe!(() => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          onComplete: () => {
            animating.current = false;
          },
        });
        if (reduce) {
          tl.set(`[data-slide='${index}']`, { autoAlpha: 0 })
            .set(`[data-slide='${to}']`, { autoAlpha: 1 })
            .set(`[data-hero-img='${index}']`, { autoAlpha: 0 })
            .set(`[data-hero-img='${to}']`, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          tl.to(`[data-slide='${index}'] [data-line] > *`, { yPercent: -115, duration: 0.7, stagger: 0.05, ease: "expo.in" }, 0)
            .to(`[data-slide='${index}'] [data-fade]`, { autoAlpha: 0, y: -16, duration: 0.4 }, 0)
            .set(`[data-slide='${index}']`, { autoAlpha: 0 }, 0.75)
            .set(`[data-slide='${to}']`, { autoAlpha: 1 }, 0.75)
            .fromTo(`[data-slide='${to}'] [data-line] > *`, { yPercent: 115, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.75)
            .fromTo(`[data-slide='${to}'] [data-fade]`, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.95)
            .set(`[data-hero-img='${to}']`, { autoAlpha: 1, zIndex: 2 }, 0)
            .set(`[data-hero-img='${index}']`, { zIndex: 1 }, 0)
            .fromTo(
              `[data-hero-img='${to}']`,
              { clipPath: "circle(0% at 62% 50%)", scale: 1.25 },
              { clipPath: "circle(150% at 62% 50%)", scale: 1, duration: 1.6 },
              0.1,
            )
            .set(`[data-hero-img='${index}']`, { autoAlpha: 0 }, 1.7);
        }
      });
      run();
      setIndex(to);
    },
    [contextSafe, index, total],
  );

  /* Autoplay com pausa: hover, foco, aba oculta, fora da tela, reduced-motion. */
  useEffect(() => {
    if (total < 2 || paused || prefersReducedMotion()) return;
    const el = root.current;
    let inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    if (el) io.observe(el);
    const id = window.setInterval(() => {
      if (inView && !document.hidden) goTo(index + 1);
    }, AUTOPLAY_MS);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [goTo, index, paused, total]);

  /* Swipe no celular */
  const touch = useRef<{ x: number; y: number } | null>(null);

  return (
    <section
      ref={root}
      data-hero
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="grain relative isolate flex min-h-[640px] items-end overflow-hidden bg-[#0a0806] pb-16 pt-28 h-[100svh] sm:items-center sm:pb-10 md:pt-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        const s = touch.current;
        touch.current = null;
        if (!s) return;
        const dx = e.changedTouches[0].clientX - s.x;
        const dy = e.changedTouches[0].clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(index + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Mídia */}
      <div data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        <div data-parallax-back className="absolute inset-[-4%]">
          <div data-hero-glow className="absolute right-[-10%] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.35),transparent_65%)] blur-2xl" />
        </div>
        <div data-parallax className="absolute inset-[-3%]">
          {banners.map((b, i) => (
            <div
              key={b.id}
              data-hero-img={i}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 1 }}
            >
              <Image
                src={b.imageUrl}
                alt=""
                fill
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                quality={75}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover object-[65%_40%] [mask-image:radial-gradient(ellipse_85%_80%_at_68%_45%,#000_35%,transparent_78%)] sm:object-center lg:[mask-image:radial-gradient(ellipse_60%_85%_at_70%_50%,#000_40%,transparent_80%)]"
              />
            </div>
          ))}
        </div>
        {/* gradientes cinematográficos */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] from-10% via-[#0a0806]/75 to-[#0a0806]/45 lg:bg-gradient-to-r lg:from-[#0a0806] lg:from-15% lg:via-[#0a0806]/70 lg:via-40% lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0806] to-transparent" />
        <Embers className="absolute inset-0 h-full w-full" />
      </div>

      {/* Selo giratório */}
      <div data-hero-badge className="pointer-events-none absolute right-4 top-24 z-10 size-24 sm:right-10 sm:top-32 sm:size-32 lg:right-[8%] lg:top-[22%] lg:size-36">
        <svg viewBox="0 0 120 120" className="size-full animate-spin-slow motion-reduce:animate-none" aria-hidden>
          <defs>
            <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <circle cx="60" cy="60" r="58" fill="#0a0806" fillOpacity="0.55" stroke="#ffb020" strokeWidth="1.5" strokeDasharray="2 4" />
          <text fill="#ffb020" fontSize="10.5" fontWeight="700">
            <textPath href="#badge-circle" textLength="282" lengthAdjust="spacing">CARNE FRESCA • SMASH PREMIUM •</textPath>
          </text>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <span className="font-display text-2xl text-gold sm:text-3xl">100%<span className="block text-[0.45em] tracking-[0.2em] text-foreground">premium</span></span>
        </div>
      </div>

      {/* Texto */}
      <div data-hero-copy className="container-x relative z-10 w-full">
        <div className="relative max-w-[40rem]">
          {banners.map((b, i) => (
            <div
              key={b.id}
              data-slide={i}
              aria-hidden={i !== index}
              className={i === 0 ? "relative" : "absolute inset-x-0 top-0"}
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <p data-fade className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary sm:text-sm">
                <span className="h-px w-8 bg-primary" />
                {b.eyebrow}
              </p>
              {i === 0 ? (
                <h1 className="font-display text-[clamp(3.2rem,min(12.5vw,11.5svh),8rem)]">
                  <HeroLines title={b.title} highlight={b.highlight} />
                </h1>
              ) : (
                <p className="font-display text-[clamp(3.2rem,min(12.5vw,11.5svh),8rem)]" role="heading" aria-level={2}>
                  <HeroLines title={b.title} highlight={b.highlight} />
                </p>
              )}
              <p data-fade className="mt-5 max-w-md text-base text-foreground/85 [text-shadow:0_1px_12px_rgb(0_0_0/0.8)] sm:text-lg">{b.subtitle}</p>
              <div data-fade className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" tabIndex={i === index ? 0 : -1}>
                  <Link href={b.ctaHref} tabIndex={i === index ? 0 : -1}>
                    {b.ctaLabel} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#anatomia" tabIndex={i === index ? 0 : -1}>
                    <Play className="size-4 fill-current" /> Ver o smash
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Controles */}
        {total > 1 && (
          <div className="mt-10 flex items-center gap-5 sm:mt-14">
            <div data-hero-ui className="font-display text-lg tabular-nums text-foreground/90" aria-live="polite">
              {String(index + 1).padStart(2, "0")} <span className="text-foreground/40">/ {String(total).padStart(2, "0")}</span>
            </div>
            <div data-hero-ui className="flex gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir para o destaque ${i + 1}`}
                  aria-current={i === index}
                  className="group relative h-6 w-10 sm:w-14"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                    <span
                      key={i === index ? `active-${index}-${paused}` : "idle"}
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={
                        i === index
                          ? { width: "100%", animation: paused ? "none" : `hero-progress ${AUTOPLAY_MS}ms linear`, transformOrigin: "left" }
                          : { width: 0 }
                      }
                    />
                  </span>
                </button>
              ))}
            </div>
            <div data-hero-ui className="ml-auto hidden gap-2 sm:flex">
              <Button variant="outline" size="icon" onClick={() => goTo(index - 1)} aria-label="Destaque anterior">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => goTo(index + 1)} aria-label="Próximo destaque">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de scroll */}
      <div data-hero-ui className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/50 md:flex">
        Role
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-primary motion-reduce:animate-none" />
        </span>
      </div>
    </section>
  );
}

function HeroLines({ title, highlight }: { title: string; highlight: string }) {
  return (
    <>
      <span data-line className="-mt-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.06em]">
        <span className="block will-change-transform">
          <span className="slant">{title}</span>
        </span>
      </span>
      {highlight && (
        <span data-line className="-mt-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.06em]">
          <span className="block will-change-transform">
            <span className="slant text-gradient-ember">{highlight}</span>
          </span>
        </span>
      )}
    </>
  );
}
