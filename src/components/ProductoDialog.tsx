import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import {
  BaseCuadrilla,
  SaborCroqueta,
  calcularPrecioUnitario,
} from '../data/carta';
import { formatEuro } from '../data/negocio';
import { useCart } from './CartContext';
import { EstrellaDorada } from './JeymaBrand';

interface ProductoDialogProps {
  onDialogToggle?: (open: boolean) => void;
}

export const ProductoDialog: React.FC<ProductoDialogProps> = ({ onDialogToggle }) => {
  const { activeProduct, presetBaseForModal, closeProductModal, addItem } = useCart();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [base, setBase] = useState<BaseCuadrilla>('Patatas');
  const [sabor, setSabor] = useState<SaborCroqueta>('Jamón');
  const [conPatatas, setConPatatas] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (activeProduct) {
      setBase(presetBaseForModal || 'Patatas');
      setSabor(activeProduct.sabores?.[0] || 'Jamón');
      setConPatatas(false);
      setCantidad(1);
      setNota('');

      if (!dlg.open) {
        dlg.showModal();
        onDialogToggle?.(true);
      }
    } else if (dlg.open) {
      dlg.close();
      onDialogToggle?.(false);
    }
  }, [activeProduct, presetBaseForModal, onDialogToggle]);

  const handleClose = () => {
    closeProductModal();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!activeProduct) {
    return (
      <dialog
        ref={dialogRef}
        className="jeyma-dialog"
        onCancel={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onClick={handleBackdropClick}
      />
    );
  }

  const precioUnitario = calcularPrecioUnitario(activeProduct.id, {
    base,
    sabor,
    conPatatas,
  });
  const subtotal = precioUnitario * cantidad;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(
      activeProduct,
      cantidad,
      {
        base: activeProduct.eligeBase ? base : undefined,
        sabor: activeProduct.sabores ? sabor : undefined,
        conPatatas: activeProduct.extraPatatasPrecio ? conPatatas : undefined,
      },
      nota,
      e.currentTarget
    );
    handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="jeyma-dialog"
      aria-labelledby="producto-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
    >
      <div
        data-lenis-prevent
        className="bg-[#FAF5EC] text-[#1F4A2E] rounded-t-2xl md:rounded-2xl border border-[#A8873A] overflow-hidden shadow-2xl max-h-[90svh] flex flex-col"
      >
        {/* Imagen superior */}
        <div className="relative h-52 sm:h-64 bg-[#0b130e] shrink-0">
          <img
            src={activeProduct.imagen}
            alt={activeProduct.nombre}
            width={activeProduct.width}
            height={activeProduct.height}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#14321F]/90 text-[#F3EADC] border border-[#A8873A]/50 flex items-center justify-center hover:bg-[#1F4A2E] cursor-pointer"
            aria-label="Cerrar ficha del producto"
          >
            <X className="w-5 h-5" />
          </button>

          {activeProduct.destacado && (
            <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3EADC]">
              <EstrellaDorada className="w-4 h-4 text-[#A8873A]" />
              <span>{activeProduct.fraseDestacado || 'Destacado de la casa'}</span>
            </div>
          )}
        </div>

        {/* Contenido desplazable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="producto-dialog-title"
                className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F4A2E]"
              >
                {activeProduct.nombre}
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#5C4930] leading-relaxed">
                {activeProduct.descripcion}
              </p>
            </div>
            <span className="font-display font-extrabold text-2xl text-[#1F4A2E] tabular-nums shrink-0">
              {formatEuro(precioUnitario)}
            </span>
          </div>

          {activeProduct.ingredientes && activeProduct.ingredientes.length > 0 && (
            <div className="text-xs sm:text-sm text-[#5C4930] flex flex-wrap gap-x-3 gap-y-1">
              {activeProduct.ingredientes.map((ing, idx) => (
                <span key={ing}>
                  {idx > 0 && (
                    <span className="mr-3 text-[#A8873A]" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* Opción: Base Patatas / Totopos */}
          {activeProduct.eligeBase && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5C4930] mb-2">
                Elige tu base
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {(['Patatas', 'Totopos'] as const).map((op) => {
                  const selected = base === op;
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setBase(op)}
                      className={`min-h-[46px] px-4 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                          : 'bg-[#F3EADC]/60 text-[#1F4A2E] border-[#5C4930]/25 hover:border-[#1F4A2E]'
                      }`}
                    >
                      {op}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opción: Sabor de croquetas */}
          {activeProduct.sabores && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5C4930] mb-2">
                Elige el sabor (6 unidades)
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {activeProduct.sabores.map((s) => {
                  const selected = sabor === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSabor(s)}
                      className={`min-h-[46px] px-3 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                          : 'bg-[#F3EADC]/60 text-[#1F4A2E] border-[#5C4930]/25 hover:border-[#1F4A2E]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opción: Extra patatas crujientes en burgers */}
          {activeProduct.extraPatatasPrecio && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5C4930] mb-2">
                Acompañamiento
              </p>
              <label className="min-h-[50px] px-4 py-3 rounded-xl border border-[#5C4930]/30 bg-[#F3EADC]/70 flex items-center justify-between gap-3 cursor-pointer">
                <span className="flex items-center gap-3 text-sm font-semibold text-[#1F4A2E]">
                  <input
                    type="checkbox"
                    checked={conPatatas}
                    onChange={(e) => setConPatatas(e.target.checked)}
                    className="w-5 h-5 accent-[#1F4A2E] rounded cursor-pointer"
                  />
                  <span>Agrega patatas crujientes</span>
                </span>
                <span className="text-sm font-bold text-[#1F4A2E] tabular-nums">
                  +{formatEuro(activeProduct.extraPatatasPrecio)}
                </span>
              </label>
            </div>
          )}

          {/* Observación */}
          <div>
            <label
              htmlFor="producto-nota"
              className="block text-xs font-bold uppercase tracking-[0.14em] text-[#5C4930] mb-1.5"
            >
              Nota para cocina (opcional)
            </label>
            <input
              id="producto-nota"
              type="text"
              maxLength={120}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. Sin cebolla, salsa aparte..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white/80 border border-[#5C4930]/30 text-base text-[#1F4A2E] placeholder:text-[#5C4930]/55 focus:outline-none focus:border-[#1F4A2E]"
            />
          </div>
        </div>

        {/* Barra inferior fija de cantidad + añadir */}
        <div className="p-4 sm:px-6 bg-[#F3EADC] border-t border-[#A8873A]/45 flex items-center justify-between gap-3 shrink-0">
          <div className="inline-flex items-center border border-[#1F4A2E]/30 rounded-xl bg-[#FAF5EC]">
            <button
              type="button"
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="w-11 h-11 flex items-center justify-center text-[#1F4A2E] hover:bg-[#1F4A2E]/10 rounded-l-xl cursor-pointer"
              aria-label="Restar una unidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-base tabular-nums text-[#1F4A2E]">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidad((c) => Math.min(20, c + 1))}
              className="w-11 h-11 flex items-center justify-center text-[#1F4A2E] hover:bg-[#1F4A2E]/10 rounded-r-xl cursor-pointer"
              aria-label="Sumar una unidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Añadir al pedido</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-bold">{formatEuro(subtotal)}</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};
