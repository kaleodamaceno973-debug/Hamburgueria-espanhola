import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EmberLoader from './components/EmberLoader';
import EmberCursor from './components/EmberCursor';
import ProposalHeader from './components/ProposalHeader';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import ManifestoSection from './components/ManifestoSection';
import HazlaTuyaConfigurator from './components/HazlaTuyaConfigurator';
import WorldTourCarousel from './components/WorldTourCarousel';
import PicoteoGrid from './components/PicoteoGrid';
import HistoriaLocalSection from './components/HistoriaLocalSection';
import CommunityFaqFooter from './components/CommunityFaqFooter';
import DeliveryNoticeModal from './components/DeliveryNoticeModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [loaderDone, setLoaderDone] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Watch prefers-reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Configure Lenis (desktop fine-pointer only) + ScrollTrigger sync
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

    if (reducedMotion || isTouchDevice) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Refresh ScrollTrigger after fonts and initial layout settle
  useEffect(() => {
    if (reducedMotion) return;
    let active = true;

    const refreshAll = () => {
      if (active) ScrollTrigger.refresh();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshAll);
    }
    window.addEventListener('load', refreshAll);
    // Lazy images / late content change the page height after load: re-measure pins when that happens
    let lastH = document.documentElement.scrollHeight;
    let t: number | undefined;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      window.clearTimeout(t);
      t = window.setTimeout(refreshAll, 150);
    });
    ro.observe(document.body);
    const timer = window.setTimeout(refreshAll, 500);

    return () => {
      ro.disconnect();
      window.clearTimeout(t);
      active = false;
      window.removeEventListener('load', refreshAll);
      window.clearTimeout(timer);
    };
  }, [reducedMotion, loaderDone]);

  // Stop/start Lenis when modal or mobile menu opens
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (orderModalOpen || mobileMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [orderModalOpen, mobileMenuOpen]);

  const handleOpenOrder = useCallback((summary?: string) => {
    setOrderSummary(summary ?? null);
    setOrderModalOpen(true);
  }, []);

  const handleCloseOrder = useCallback(() => {
    setOrderModalOpen(false);
  }, []);

  const scrollToY = useCallback(
    (y: number) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(y);
      } else {
        window.scrollTo({
          top: y,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [reducedMotion]
  );

  const handleNavigateAnchor = useCallback(
    (href: string, fromMobileMenu = false) => {
      const performScroll = () => {
        const el = document.querySelector(href);
        if (!el) return;
        const headerEl = document.querySelector('header');
        const headerOffset = headerEl ? headerEl.getBoundingClientRect().height : 72;

        if (lenisRef.current) {
          lenisRef.current.scrollTo(el as HTMLElement, { offset: -headerOffset });
        } else {
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({
            top: Math.max(0, top),
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
      };

      if (fromMobileMenu) {
        setMobileMenuOpen(false);
        // Double rAF so sticky header height collapses before measuring target offset
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(performScroll);
        });
      } else {
        performScroll();
      }
    },
    [reducedMotion]
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5EFE6]">
      {!loaderDone && (
        <EmberLoader
          reducedMotion={reducedMotion}
          onDone={() => setLoaderDone(true)}
        />
      )}

      <EmberCursor reducedMotion={reducedMotion} />

      <ProposalHeader
        onOpenOrder={() => handleOpenOrder()}
        onNavigateAnchor={handleNavigateAnchor}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={setMobileMenuOpen}
      />

      <main id="main-content">
        <HeroSection
          reducedMotion={reducedMotion}
          onOpenOrder={() => handleOpenOrder()}
        />

        <MarqueeSection reducedMotion={reducedMotion} />

        <ManifestoSection reducedMotion={reducedMotion} />

        <HazlaTuyaConfigurator
          reducedMotion={reducedMotion}
          onOrderCustomBurger={(resumen) => handleOpenOrder(resumen)}
          scrollToTarget={scrollToY}
        />

        <WorldTourCarousel
          reducedMotion={reducedMotion}
          onOrderBurger={(burgerName) => handleOpenOrder(`Burger de la casa: ${burgerName}`)}
        />

        <PicoteoGrid
          reducedMotion={reducedMotion}
          onOpenOrder={() => handleOpenOrder()}
        />

        <HistoriaLocalSection reducedMotion={reducedMotion} />

        <CommunityFaqFooter onOpenOrder={() => handleOpenOrder()} />
      </main>

      <DeliveryNoticeModal
        open={orderModalOpen}
        onClose={handleCloseOrder}
        burgerResumen={orderSummary}
      />
    </div>
  );
}
