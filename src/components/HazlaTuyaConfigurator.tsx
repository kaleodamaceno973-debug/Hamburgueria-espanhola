import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Copy, Flame } from 'lucide-react';
import {
  CONFIG_CARNES,
  CONFIG_EXTRAS,
  CONFIG_PANES,
  CONFIG_PASOS,
  CONFIG_QUESOS,
  CONFIG_SALSAS,
  CONFIG_VEGETALES,
  type ConfigOpcion,
} from '../data/carta';
import { NEGOCIO } from '../data/negocio';

gsap.registerPlugin(ScrollTrigger);

interface HazlaTuyaConfiguratorProps {
  reducedMotion: boolean;
  onOrderCustomBurger: (resumen: string) => void;
  scrollToTarget: (y: number) => void;
}

export default function HazlaTuyaConfigurator({
  reducedMotion,
  onOrderCustomBurger,
  scrollToTarget,
}: HazlaTuyaConfiguratorProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [panId, setPanId] = useState('brioche');
  const [carneId, setCarneId] = useState('txuleta');
  const [quesoId, setQuesoId] = useState('cheddar');
  const [vegIds, setVegIds] = useState<string[]>(['lechuga', 'tomate']);
  const [extraIds, setExtraIds] = useState<string[]>(['bacon']);
  const [salsaId, setSalsaId] = useState('brava');
  const [copied, setCopied] = useState(false);

  // Preload all configurator transparent WebP images with img.decode()
  useEffect(() => {
    const urls = new Set<string>();
    [...CONFIG_PANES, ...CONFIG_CARNES, ...CONFIG_QUESOS, ...CONFIG_VEGETALES, ...CONFIG_EXTRAS, ...CONFIG_SALSAS].forEach(
      (opt) => {
        if (opt.imagen) urls.add(opt.imagen);
        if (opt.imagenBottom) urls.add(opt.imagenBottom);
      }
    );
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // ScrollTrigger scrubbed over plain state object { step: 0..5 }
  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const state = { step: 0 };
    let lastRounded = 0;

    const ctx = gsap.context(() => {
      const tween = gsap.to(state, {
        step: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => '+=2200',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const nextStep = Math.min(5, Math.max(0, Math.round(state.step)));
            if (nextStep !== lastRounded) {
              lastRounded = nextStep;
              setActiveStep(nextStep);
            }
          },
        },
      });
      triggerRef.current = tween.scrollTrigger ?? null;
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  const jumpToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);
    if (reducedMotion || !triggerRef.current) return;
    const st = triggerRef.current;
    const targetY = st.start + ((st.end - st.start) * stepIndex) / 5;
    scrollToTarget(targetY);
  };

  const toggleMulti = (id: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(id)) {
      setter(list.filter((item) => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  const selectedPan = CONFIG_PANES.find((p) => p.id === panId) ?? CONFIG_PANES[0];
  const selectedCarne = CONFIG_CARNES.find((c) => c.id === carneId) ?? CONFIG_CARNES[0];
  const selectedQueso = CONFIG_QUESOS.find((q) => q.id === quesoId) ?? CONFIG_QUESOS[0];
  const selectedVegs = CONFIG_VEGETALES.filter((v) => vegIds.includes(v.id));
  const selectedExtras = CONFIG_EXTRAS.filter((e) => extraIds.includes(e.id));
  const selectedSalsa = CONFIG_SALSAS.find((s) => s.id === salsaId) ?? CONFIG_SALSAS[0];

  const resumenPartes = [
    selectedPan.nombre,
    selectedCarne.nombre,
    selectedQueso.nombre,
    selectedVegs.length > 0 ? selectedVegs.map((v) => v.nombre).join(' + ') : 'Sin vegetales',
    selectedExtras.length > 0 ? selectedExtras.map((e) => e.nombre).join(' + ') : 'Sin extras',
    selectedSalsa.nombre,
  ];
  const resumenTexto = `Tu burger: ${resumenPartes.join(' · ')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumenTexto);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Visibility threshold per layer so scrolling up cleanly reverses assembly
  const showAllStatic = reducedMotion;
  const showCarne = showAllStatic || activeStep >= 1;
  const showQueso = (showAllStatic || activeStep >= 2) && Boolean(selectedQueso.imagen);
  const showVegetales = (showAllStatic || activeStep >= 3) && selectedVegs.length > 0;
  const showExtras = (showAllStatic || activeStep >= 4) && selectedExtras.length > 0;
  const showSalsa = (showAllStatic || activeStep >= 5) && Boolean(selectedSalsa.imagen);

  const renderStepOptions = (stepIdx: number) => {
    let options: ConfigOpcion[] = [];
    let isMulti = false;
    let selectedList: string[] = [];
    let onPick: (id: string) => void = () => {};

    switch (stepIdx) {
      case 0:
        options = CONFIG_PANES;
        selectedList = [panId];
        onPick = setPanId;
        break;
      case 1:
        options = CONFIG_CARNES;
        selectedList = [carneId];
        onPick = setCarneId;
        break;
      case 2:
        options = CONFIG_QUESOS;
        selectedList = [quesoId];
        onPick = setQuesoId;
        break;
      case 3:
        options = CONFIG_VEGETALES;
        isMulti = true;
        selectedList = vegIds;
        onPick = (id) => toggleMulti(id, vegIds, setVegIds);
        break;
      case 4:
        options = CONFIG_EXTRAS;
        isMulti = true;
        selectedList = extraIds;
        onPick = (id) => toggleMulti(id, extraIds, setExtraIds);
        break;
      case 5:
      default:
        options = CONFIG_SALSAS;
        selectedList = [salsaId];
        onPick = setSalsaId;
        break;
    }

    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Opciones de ${CONFIG_PASOS[stepIdx].titulo}`}>
        {options.map((opt) => {
          const active = selectedList.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => onPick(opt.id)}
              className={`min-h-[42px] rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0 ${
                active
                  ? 'border-[#E9632D] bg-[#E9632D] text-[#0B0B0B] shadow-md'
                  : 'border-white/15 bg-[#151515] text-[#F5EFE6]/85 hover:border-[#E9632D]/60 hover:text-[#F5EFE6]'
              }`}
            >
              <span>{opt.nombre}</span>
              {isMulti && active && <span className="ml-1.5" aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section
      id="hazla-tuya"
      ref={sectionRef}
      aria-labelledby="hazla-tuya-title"
      className={`relative w-full bg-[#0B0B0B] border-y border-white/10 ${
        reducedMotion ? 'py-16 sm:py-24' : 'min-h-[100svh] flex items-center py-6 sm:py-10 pb-20 lg:pb-10'
      }`}
    >
      {/* Subtle static ambient ember behind burger stage */}
      <div
        aria-hidden="true"
        className="ember-glow-static pointer-events-none absolute top-1/2 left-1/4 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-50"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-10">
          {/* Burger Layer Visual Assembly Stage */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative flex h-[215px] w-full max-w-[320px] flex-col items-center justify-center sm:h-[300px] sm:max-w-[390px] lg:h-[430px] lg:max-w-[440px]">
              {/* Top Bun Crown */}
              <div
                className="relative z-[60] w-[74%] transition-transform duration-300 ease-out"
                style={{
                  transform: `translateY(${showSalsa ? '18%' : showExtras ? '8%' : showQueso ? '0%' : '-12%'})`,
                }}
              >
                <img
                  key={selectedPan.id + '-top'}
                  src={selectedPan.imagen}
                  alt={`Parte superior de ${selectedPan.nombre}`}
                  width={selectedPan.width}
                  height={selectedPan.height}
                  className="mx-auto h-auto max-h-[68px] sm:max-h-[95px] lg:max-h-[125px] w-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.75)]"
                />
              </div>

              {/* 06 Salsa */}
              <div
                className={`relative z-[55] -my-3 w-[68%] transition-all duration-300 ease-out ${
                  showSalsa ? 'opacity-100 scale-100' : 'pointer-events-none h-0 overflow-hidden opacity-0 scale-90'
                }`}
              >
                {selectedSalsa.imagen && (
                  <img
                    key={selectedSalsa.id}
                    src={selectedSalsa.imagen}
                    alt={selectedSalsa.nombre}
                    width={selectedSalsa.width}
                    height={selectedSalsa.height}
                    className="mx-auto h-auto max-h-[38px] sm:max-h-[48px] lg:max-h-[60px] w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]"
                  />
                )}
              </div>

              {/* 05 Extras */}
              <div
                className={`relative z-50 -my-2.5 flex w-[72%] flex-col items-center transition-all duration-300 ease-out ${
                  showExtras ? 'opacity-100 translate-y-0' : 'pointer-events-none h-0 overflow-hidden opacity-0 -translate-y-4'
                }`}
              >
                {selectedExtras.map((extra, idx) => (
                  <img
                    key={extra.id}
                    src={extra.imagen}
                    alt={extra.nombre}
                    width={extra.width}
                    height={extra.height}
                    className={`mx-auto h-auto max-h-[36px] sm:max-h-[46px] lg:max-h-[58px] w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)] ${
                      idx > 0 ? '-mt-4' : ''
                    }`}
                  />
                ))}
              </div>

              {/* 04 Vegetales */}
              <div
                className={`relative z-40 -my-2.5 flex w-[74%] flex-col items-center transition-all duration-300 ease-out ${
                  showVegetales ? 'opacity-100 translate-y-0' : 'pointer-events-none h-0 overflow-hidden opacity-0 -translate-y-4'
                }`}
              >
                {selectedVegs.slice(0, 3).map((veg, idx) => (
                  <img
                    key={veg.id}
                    src={veg.imagen}
                    alt={veg.nombre}
                    width={veg.width}
                    height={veg.height}
                    className={`mx-auto h-auto max-h-[30px] sm:max-h-[40px] lg:max-h-[50px] w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)] ${
                      idx > 0 ? '-mt-3.5' : ''
                    }`}
                  />
                ))}
              </div>

              {/* 03 Queso */}
              <div
                className={`relative z-30 -mb-6 sm:-mb-8 w-[72%] transition-all duration-300 ease-out ${
                  showQueso ? 'opacity-100 translate-y-0 scale-100' : 'pointer-events-none h-0 overflow-hidden opacity-0 -translate-y-5 scale-95'
                }`}
              >
                {selectedQueso.imagen && (
                  <img
                    key={selectedQueso.id}
                    src={selectedQueso.imagen}
                    alt={selectedQueso.nombre}
                    width={selectedQueso.width}
                    height={selectedQueso.height}
                    className="mx-auto h-auto max-h-[48px] sm:max-h-[65px] lg:max-h-[82px] w-auto object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.75)]"
                  />
                )}
              </div>

              {/* 02 Carne */}
              <div
                className={`relative z-20 -my-2 w-[76%] transition-all duration-300 ease-out ${
                  showCarne ? 'opacity-100 translate-y-0 scale-100' : 'pointer-events-none h-0 overflow-hidden opacity-0 -translate-y-6 scale-95'
                }`}
              >
                <img
                  key={selectedCarne.id}
                  src={selectedCarne.imagen}
                  alt={`Medallón de ${selectedCarne.nombre}`}
                  width={selectedCarne.width}
                  height={selectedCarne.height}
                  className="mx-auto h-auto max-h-[54px] sm:max-h-[72px] lg:max-h-[92px] w-auto object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.85)]"
                />
              </div>

              {/* 01 Pan Bottom */}
              <div className="relative z-10 -mt-1 w-[74%] transition-transform duration-300 ease-out">
                <img
                  key={selectedPan.id + '-bottom'}
                  src={selectedPan.imagenBottom}
                  alt={`Base de ${selectedPan.nombre}`}
                  width={selectedPan.bottomWidth}
                  height={selectedPan.bottomHeight}
                  className="mx-auto h-auto max-h-[48px] sm:max-h-[64px] lg:max-h-[82px] w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            <p className="mt-1 hidden text-center text-[11px] tracking-wider text-[#F5EFE6]/45 uppercase lg:block">
              Imágenes ilustrativas · {reducedMotion ? 'Selección por pasos' : 'Sigue bajando para montar capa a capa'}
            </p>
          </div>

          {/* Right Column: Official Copy + Double-Ellipse Step Progress + Interactive Controls */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
                Configurador a la brasa
              </span>
              <span className="text-xs font-semibold text-[#F5EFE6]/60 tabular-nums">
                Paso 0{activeStep + 1} / 06
              </span>
            </div>

            <h2
              id="hazla-tuya-title"
              className="font-display mt-1.5 text-2xl leading-none text-[#F5EFE6] sm:text-4xl lg:text-5xl"
            >
              Tu burger. <span className="text-[#E9632D]">Tus reglas.</span>
            </h2>

            <p className="mt-2.5 text-xs leading-relaxed text-[#F5EFE6]/75 sm:text-sm lg:text-base">
              {NEGOCIO.textos.personalizacionTexto}
            </p>

            {/* Double-ellipse progress bar */}
            <div
              className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2"
              role="tablist"
              aria-label="Pasos del configurador"
            >
              {CONFIG_PASOS.map((paso, idx) => {
                const isCurrent = activeStep === idx;
                const isPassed = activeStep > idx;
                return (
                  <button
                    key={paso.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => jumpToStep(idx)}
                    className={`min-h-[38px] rounded-full px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 tabular-nums focus-visible:outline-2 focus-visible:outline-[#E9632D] ${
                      isCurrent
                        ? 'seal-ellipse bg-[#E9632D]/15 text-[#E9632D]'
                        : isPassed
                          ? 'border border-[#E9632D]/40 bg-[#171717] text-[#F5EFE6]'
                          : 'border border-white/15 bg-[#121212] text-[#F5EFE6]/55 hover:text-[#F5EFE6]'
                    }`}
                  >
                    {paso.numero} {paso.titulo}
                  </button>
                );
              })}
            </div>

            {/* Active step control area OR full static list on reducedMotion */}
            {reducedMotion ? (
              <div className="mt-5 space-y-4">
                {CONFIG_PASOS.map((paso, idx) => (
                  <div key={paso.id} className="rounded-xl border border-white/10 bg-[#121212] p-3.5">
                    <p className="mb-2 text-xs font-bold tracking-wider text-[#E9632D] uppercase">
                      {paso.numero} · {paso.titulo} — <span className="text-[#F5EFE6]/70 normal-case font-normal">{paso.instruccion}</span>
                    </p>
                    {renderStepOptions(idx)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-white/12 bg-[#121212] p-4 sm:p-5">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg text-[#F5EFE6] sm:text-xl">
                    <span className="text-[#E9632D] tabular-nums">{CONFIG_PASOS[activeStep].numero}</span>{' '}
                    {CONFIG_PASOS[activeStep].titulo}
                  </h3>
                  <span className="text-xs text-[#F5EFE6]/60">
                    {CONFIG_PASOS[activeStep].instruccion}
                  </span>
                </div>
                {renderStepOptions(activeStep)}
              </div>
            )}

            {/* Live summary & Order CTAs */}
            <div className="mt-4 rounded-2xl border border-[#E9632D]/30 bg-[#141414] p-3.5 sm:p-4">
              <p className="text-xs leading-relaxed text-[#F5EFE6]/90 sm:text-sm">
                <span className="font-bold text-[#E9632D]">Resumen: </span>
                {resumenPartes.join(' · ')}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOrderCustomBurger(resumenPartes.join(' · '))}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E9632D] px-6 py-2 text-xs sm:text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                >
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  <span>Pídela así</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs sm:text-sm font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#FFB23F]" aria-hidden="true" />
                      <span>¡Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Copiar mi burger</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
