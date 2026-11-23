"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/client/gsap";
import type { BurgerScene } from "./burger-scene";
import { useReducedMotion } from "@/lib/client/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Pão brioche", text: "Selado na manteiga até dourar. Macio por dentro, crocante por fora, com gergelim tostado.", tag: "Padaria parceira" },
  { title: "Molho da casa", text: "Receita secreta com páprica defumada, picles e um toque de mostarda. Feito todo dia.", tag: "Receita própria" },
  { title: "Blend smash", text: "Costela + acém moídos na hora. Prensado a 230 °C para criar a crosta caramelizada.", tag: "120 g · 100% bovino" },
  { title: "Cheddar derretido", text: "Duas fatias que derretem direto na chapa e escorrem pela carne.", tag: "Queijo de verdade" },
  { title: "Cebola & picles", text: "Cebola fresca em anéis e picles fermentado na casa para equilibrar a gordura.", tag: "Crocância" },
  { title: "Alface & tomate", text: "Alface americana e tomate maduro, cortados no momento da montagem.", tag: "Frescor" },
];

type Status = "idle" | "loading" | "ready" | "fallback";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AnatomySection({ title, text }: { title: string; text: string }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BurgerScene | null>(null);
  const progressRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();

  /* Carrega o Three.js só quando a seção se aproxima (economiza ~150 KB no carregamento inicial). */
  useEffect(() => {
    const wrap = canvasWrap.current;
    const section = root.current;
    if (!wrap || !section) return;
    const isReduced = prefersReducedMotion();

    let disposed = false;
    let scene: BurgerScene | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let visibleIO: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const onLost = (e: Event) => {
      e.preventDefault();
      scene?.stop();
      setStatus("fallback");
    };

    const init = async () => {
      if (!webglAvailable()) {
        setStatus("fallback");
        return;
      }
      setStatus("loading");
      try {
        const mod = await import("./burger-scene");
        if (disposed) return;
        // canvas criado aqui: um contexto WebGL novo a cada montagem (seguro no StrictMode).
        canvas = document.createElement("canvas");
        canvas.className = "absolute inset-0 h-full w-full";
        canvas.setAttribute("aria-hidden", "true");
        canvas.addEventListener("webglcontextlost", onLost);
        wrap.appendChild(canvas);
        scene = mod.createBurgerScene(canvas, { mobile: window.innerWidth < 768 });
        sceneRef.current = scene;
        scene.setProgress(isReduced ? 0.5 : progressRef.current);
        if (isReduced) {
          scene.renderOnce();
        } else {
          visibleIO = new IntersectionObserver(([entry]) => (entry.isIntersecting ? scene?.start() : scene?.stop()));
          visibleIO.observe(section);
        }
        ro = new ResizeObserver(() => {
          scene?.resize();
          if (isReduced) scene?.renderOnce();
        });
        ro.observe(wrap);
        setStatus("ready");
      } catch {
        if (!disposed) setStatus("fallback");
      }
    };

    const nearIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nearIO.disconnect();
          void init();
        }
      },
      { rootMargin: "900px 0px" },
    );
    nearIO.observe(section);

    const onVis = () => (document.hidden ? scene?.stop() : null);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      nearIO.disconnect();
      visibleIO?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene?.dispose();
      sceneRef.current = null;
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.remove();
      }
    };
  }, []);

  /* Pin + scrub: o progresso do scroll comanda a cena 3D e os textos. */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" }, (ctx) => {
        const mobile = ctx.conditions?.mobile;
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top top",
          end: mobile ? "+=320%" : "+=420%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            progressRef.current = p;
            sceneRef.current?.setProgress(p);
            if (bar.current) bar.current.style.transform = `scaleX(${p})`;
            const inner = Math.min(0.999, Math.max(0, (p - 0.14) / 0.72));
            const s = Math.floor(inner * STEPS.length);
            sceneRef.current?.setActive(p > 0.12 && p < 0.88 ? s : -1);
            setStep((prev) => (prev === s ? prev : s));
          },
        });
        gsap.fromTo("[data-anatomy-word]", { xPercent: 10 }, {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: stage.current, start: "top top", end: mobile ? "+=320%" : "+=420%", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = STEPS[step];

  return (
    <section ref={root} id="anatomia" aria-labelledby="anatomia-title" className="relative bg-[#0a0806]">
      <div ref={stage} className={cn("grain relative overflow-hidden", reduced ? "py-20" : "h-[100svh] min-h-[600px]")}>
        {/* fundo */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.22),transparent_62%)] md:left-[62%]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
            <defs>
              <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M56 0H0V56" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <p data-anatomy-word className="font-display text-outline absolute bottom-[6%] left-0 whitespace-nowrap text-[28vw] leading-none md:bottom-[2%] md:text-[18vw]">
            Anatomia do smash
          </p>
        </div>

        <div className={cn("container-x relative grid h-full", reduced ? "gap-10 md:grid-cols-2" : "grid-rows-[auto_1fr_auto] pt-24 pb-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1 md:items-center md:pt-20")}>
          {/* Texto */}
          <div className="relative z-10 md:max-w-md">
            <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-8 bg-primary" /> Role para desmontar
            </p>
            <h2 id="anatomia-title" className="font-display text-[clamp(2.2rem,min(6vw,7svh),3.8rem)]">
              <span className="slant">{title}</span>
            </h2>
            <p className="mt-3 hidden text-sm text-muted-foreground md:block">{text}</p>

            {/* lista de passos (desktop / reduced) */}
            <ol className={cn("mt-6 space-y-0.5", reduced ? "block" : "hidden md:block")}>
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <div
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-500",
                      !reduced && i === step ? "border-primary/40 bg-primary/[0.07]" : "border-transparent",
                    )}
                  >
                    <span className={cn("font-display mt-0.5 text-lg tabular-nums transition-colors", !reduced && i === step ? "text-primary" : "text-foreground/30")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={cn("font-bold transition-colors", !reduced && i !== step && "text-foreground/55")}>{s.title}</p>
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500",
                          reduced || i === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <p className="overflow-hidden text-sm text-muted-foreground">{s.text}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {!reduced && (
              <Link href="/cardapio/classic-smash" className="group mt-5 hidden items-center gap-2 text-sm font-bold text-primary md:inline-flex">
                Quero esse burger <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Palco 3D */}
          <div className={cn("relative min-h-0", reduced ? "aspect-square" : "h-full")}>
            <div ref={canvasWrap} className="absolute inset-0" />
            {(status === "idle" || status === "loading") && (
              <div className="absolute inset-0 grid place-items-center" role="status">
                <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                  <span className="relative grid size-14 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                    <span className="size-3 rounded-full bg-primary" />
                  </span>
                  Montando o burger…
                </div>
              </div>
            )}
            {status === "fallback" && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative aspect-square w-[min(80%,420px)] overflow-hidden rounded-full border border-white/10">
                  <Image
                    src="/images/smash-supremo.webp"
                    alt="Smash burger em camadas"
                    fill
                    sizes="420px"
                    className="object-cover transition-transform duration-700"
                    style={{ transform: `scale(${1 + step * 0.05})` }}
                  />
                </div>
              </div>
            )}
            {/* etiqueta flutuante do passo ativo (desktop) */}
            {!reduced && (
              <div className="pointer-events-none absolute bottom-[8%] right-0 hidden md:block">
                <div key={step} className="rounded-2xl border border-primary/30 bg-[#120e0b]/90 px-5 py-3 shadow-2xl backdrop-blur animate-in fade-in-0 slide-in-from-right-4 duration-500">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{current.tag}</p>
                  <p className="font-display text-2xl">{current.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Card do passo (mobile) */}
          {!reduced && (
            <div className="relative z-10 md:hidden">
              <div key={step} className="glass rounded-2xl border border-white/10 p-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" aria-live="polite">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{current.tag}</p>
                  <p className="font-display text-sm text-foreground/50">{String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</p>
                </div>
                <p className="font-display mt-1 text-2xl">{current.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{current.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* progresso + CTA */}
        {!reduced && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="h-[3px] w-full bg-white/5">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold via-primary to-flame" />
            </div>
          </div>
        )}
        {reduced && (
          <div className="container-x mt-8">
            <Button asChild size="lg">
              <Link href="/cardapio/classic-smash">Quero esse burger <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
