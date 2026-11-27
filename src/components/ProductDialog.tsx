import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatEuro } from '../data/menu';
import { NeonCowSvg } from './NeonCowSvg';

export function ProductDialog() {
  const { activeProduct, setActiveProduct, addToCart } = useOrder();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeProduct) {
      setQty(1);
      setNote('');
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [activeProduct]);

  const handleClose = () => {
    setActiveProduct(null);
  };

  if (!activeProduct) {
    return <dialog ref={dialogRef} className="hidden" />;
  }

  const liveTotal = activeProduct.price * qty;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
      className="m-0 h-full max-h-full w-full max-w-full bg-transparent p-0 backdrop:bg-black/80 open:flex open:items-end open:justify-center sm:open:items-center sm:p-6"
      aria-labelledby="product-modal-title"
    >
      <div
        data-lenis-prevent
        className="relative max-h-[90svh] w-full overflow-y-auto rounded-t-2xl border border-white/15 bg-[#0b0b0c] text-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/75 text-white/80 hover:border-[#FFB547] hover:text-white"
          aria-label="Cerrar ficha del producto"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid sm:grid-cols-12">
          <div className="bg-black p-6 sm:col-span-5 flex items-center justify-center">
            {activeProduct.image ? (
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                width={600}
                height={600}
                className="studio-mask aspect-square w-full max-w-[260px] object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full max-w-[240px] flex-col items-center justify-center rounded-xl border border-[#FFB547]/25 bg-[#0b0b0c] p-6 text-center">
                <NeonCowSvg idPrefix="modal-cow" className="w-28 opacity-85" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB547]">
                  Foto próximamente
                </p>
              </div>
            )}
          </div>

          <div className="p-6 sm:col-span-7 sm:p-7">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="uppercase tracking-wider">
                {activeProduct.subGroup === 'limited'
                  ? 'Limited Edition'
                  : activeProduct.subGroup === 'vegana'
                    ? 'Vegana'
                    : activeProduct.category === 'entrantes'
                      ? 'Entrantes'
                      : activeProduct.category === 'postres'
                        ? 'Postres'
                        : 'Clásicos'}
              </span>
              {activeProduct.isVegan && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">🌱 Vegano</span>
                </>
              )}
              {activeProduct.isLimited && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#F2E23A]">Limited</span>
                </>
              )}
            </div>

            <h3
              id="product-modal-title"
              className="font-display mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
            >
              {activeProduct.name}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {activeProduct.ingredients}
            </p>

            {/* TODO: confirmar con Baka Vieja suplementos y pan sin gluten (estructura lista, oculta hasta confirmación) */}
            {false && (
              <div className="mt-4 border-t border-white/10 pt-4 text-xs text-white/60">
                <p>Pan sin gluten / Extras pendientes de confirmar</p>
              </div>
            )}

            <div className="mt-5">
              <label
                htmlFor="product-note"
                className="block text-xs font-semibold uppercase tracking-wider text-white/65"
              >
                Observaciones para cocina (opcional)
              </label>
              <textarea
                id="product-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej.: Sin cebolla, carne bien hecha, salsa aparte…"
                className="mt-2 w-full rounded-lg border border-white/15 bg-black px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black p-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded text-white/80 hover:bg-white/10"
                  aria-label="Restar cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-display tabular-nums text-base font-bold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded text-white/80 hover:bg-white/10"
                  aria-label="Sumar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  addToCart(activeProduct, qty, note, { x: e.clientX, y: e.clientY });
                  handleClose();
                }}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D] whitespace-nowrap"
              >
                <span>Añadir</span>
                <span className="tabular-nums">· {formatEuro(liveTotal)}</span>
              </button>
            </div>
            <p className="mt-2 text-right text-[11px] text-white/45">Precio orientativo</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
