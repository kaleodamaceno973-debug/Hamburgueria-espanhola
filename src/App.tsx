import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CartProvider } from './components/CartContext';
import { Loader } from './components/Loader';
import { ProposalHeader } from './components/ProposalHeader';
import { Hero } from './components/Hero';
import { DoubleMarquee } from './components/DoubleMarquee';
import { EligeTuBase } from './components/EligeTuBase';
import { LosImprescindibles } from './components/LosImprescindibles';
import { CartaCompleta } from './components/CartaCompleta';
import { SmashBurgersSection } from './components/SmashBurgersSection';
import { ElBarYEncuentranos } from './components/ElBarYEncuentranos';
import { FlyToCartLayer } from './components/FlyToCartLayer';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';

const ProductoDialog = lazy(() =>
  import('./components/ProductoDialog').then((m) => ({ default: m.ProductoDialog }))
);
const CartDrawer = lazy(() =>
  import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouch =
      window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    ScrollTrigger.config({ ignoreMobileResize: true });

    let lenis: Lenis | null = null;
    let rafCallback: ((t: number) => void) | null = null;

    // Lenis sólo en escritorio sin reduced motion; en táctil se usa scroll nativo
    if (!isTouch && !reduced) {
      lenis = new Lenis({
        lerp: 0.1,
        autoRaf: false,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      rafCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    }

    const refreshAll = () => {
      ScrollTrigger.refresh();
    };

    const onLoad = () => refreshAll();
    window.addEventListener('load', onLoad, { once: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshAll);
    }

    return () => {
      window.removeEventListener('load', onLoad);
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const handlePauseLenis = useCallback((paused: boolean) => {
    if (!lenisRef.current) return;
    if (paused) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, []);

  const handleNavigateAnchor = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true);
    ScrollTrigger.refresh();
  }, []);

  return (
    <CartProvider>
      <Loader onDone={handleLoaderDone} />
      <CustomCursor />
      <FlyToCartLayer />

      <div className="min-h-screen flex flex-col bg-[#1F4A2E] text-[#F3EADC]">
        <ProposalHeader
          onNavigateAnchor={handleNavigateAnchor}
          onMobileMenuChange={handlePauseLenis}
        />

        <main className="flex-1">
          <Hero ready={loaderDone} />
          <DoubleMarquee />
          <EligeTuBase />
          <LosImprescindibles />
          <CartaCompleta />
          <SmashBurgersSection />
          <ElBarYEncuentranos />
        </main>

        <Footer onDialogToggle={handlePauseLenis} />
      </div>

      <Suspense fallback={null}>
        <ProductoDialog onDialogToggle={handlePauseLenis} />
        <CartDrawer onDialogToggle={handlePauseLenis} />
      </Suspense>
    </CartProvider>
  );
}
