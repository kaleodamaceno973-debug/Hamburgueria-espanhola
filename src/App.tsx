import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { OrderProvider, useOrder } from './context/OrderContext';
import { Loader } from './components/Loader';
import { CustomCursor } from './components/CustomCursor';
import { FlyToCartLayer } from './components/FlyToCartLayer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DualMarquee } from './components/DualMarquee';
import { VitrinaNeon } from './components/VitrinaNeon';
import { LimitedDrop } from './components/LimitedDrop';
import { CartaCompleta } from './components/CartaCompleta';
import { QuienesSomos } from './components/QuienesSomos';
import { EventosSection } from './components/EventosSection';
import { LocalesSection } from './components/LocalesSection';
import { FooterSection } from './components/FooterSection';
import { ProductDialog } from './components/ProductDialog';
import { ReserveDialog } from './components/ReserveDialog';
import { CartDrawer } from './components/CartDrawer';
import { FloatingOrderControls } from './components/FloatingOrderControls';

gsap.registerPlugin(ScrollTrigger);

function BakaViejaApp() {
  const { isCartOpen, isReserveOpen, activeProduct } = useOrder();
  const [loaderDone, setLoaderDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll on desktop (non-touch, non-reduced-motion) & ScrollTrigger config
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!reducedMotion && !isTouch) {
      lenis = new Lenis({ lerp: 0.1, autoRaf: false });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t: number) => {
        lenis?.raf(t * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Refresh ScrollTrigger after web fonts & images settle
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener('load', refresh, { passive: true });
    const refreshTimeout = window.setTimeout(refresh, 900);

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener('load', refresh);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // Stop Lenis whenever a modal, cart drawer, or mobile menu is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isCartOpen || isReserveOpen || activeProduct !== null || mobileMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isCartOpen, isReserveOpen, activeProduct, mobileMenuOpen]);

  // Subtle magnetic CTA microinteraction on fine pointer devices
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const buttons = Array.from(document.querySelectorAll<HTMLElement>('.magnetic-btn'));
    const handlers: Array<{
      el: HTMLElement;
      move: (e: PointerEvent) => void;
      leave: () => void;
    }> = [];

    buttons.forEach((btn) => {
      const move = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.14;
        btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      };
      const leave = () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      };
      btn.addEventListener('pointermove', move, { passive: true });
      btn.addEventListener('pointerleave', leave);
      handlers.push({ el: btn, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    };
  }, [loaderDone]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: -64 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Loader onDone={handleLoaderDone} />
      <CustomCursor />
      <FlyToCartLayer />

      <Header onNavigate={scrollToSection} onMenuOpenChange={setMobileMenuOpen} />

      <main>
        <HeroSection
          loaderDone={loaderDone}
          onScrollToVitrina={() => scrollToSection('vitrina')}
        />
        <DualMarquee />
        <VitrinaNeon />
        <LimitedDrop />
        <CartaCompleta />
        <QuienesSomos />
        <EventosSection />
        <LocalesSection />
      </main>

      <FooterSection onNavigate={scrollToSection} />

      <FloatingOrderControls />
      <ProductDialog />
      <ReserveDialog />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <BakaViejaApp />
    </OrderProvider>
  );
}
