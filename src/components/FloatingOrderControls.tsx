import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShoppingBag } from 'lucide-react';
import { formatEuro } from '../data/menu';
import { useOrder } from '../context/OrderContext';

export function FloatingOrderControls() {
  const { totalCount, totalPrice, setIsCartOpen, cartBounceKey } = useOrder();
  const badgeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cartBounceKey === 0 || !badgeRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      badgeRef.current,
      { scale: 1 },
      { scale: 1.09, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  }, [cartBounceKey]);

  return (
    <>
      {/* Desktop Floating Cart Pill */}
      <button
        ref={badgeRef}
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex h-12 items-center gap-3 rounded-xl border border-[#FFB547]/60 bg-black/95 px-5 text-sm font-bold text-white shadow-2xl transition-colors hover:border-[#FFB547] hover:bg-[#141416]"
        aria-label="Abrir tu pedido"
      >
        <ShoppingBag className="h-4 w-4 text-[#FFB547]" />
        <span className="uppercase tracking-wider">Tu pedido</span>
        <span className="tabular-nums rounded bg-[#FFB547] px-2 py-0.5 text-xs font-black text-black">
          {totalCount}
        </span>
        {totalCount > 0 && (
          <span className="tabular-nums text-xs font-semibold text-[#FFBC7D]">
            {formatEuro(totalPrice)}
          </span>
        )}
      </button>

      {/* Mobile Bottom Floating CTA Bar (compact <= 48px, non-overlapping) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-black/95 px-4 py-2 sm:hidden">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex h-11 w-full items-center justify-between rounded-lg bg-[#FFB547] px-4 text-xs font-black uppercase tracking-wider text-black"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Pide ahora</span>
          </span>
          <span className="tabular-nums">
            {totalCount > 0
              ? `${totalCount} ud. · ${formatEuro(totalPrice)}`
              : 'Ver tu pedido'}
          </span>
        </button>
      </div>
    </>
  );
}
