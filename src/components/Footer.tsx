import React, { useRef, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { NEGOCIO, PROPUESTA_CONFIG, formatEuro } from '../data/negocio';
import { useCart } from './CartContext';
import { JeymaLogo } from './JeymaBrand';

interface FooterProps {
  onDialogToggle?: (open: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ onDialogToggle }) => {
  const { openCart, totalItems, totalPrecio } = useCart();
  const legalDialogRef = useRef<HTMLDialogElement | null>(null);
  const [legalTab, setLegalTab] = useState<'aviso' | 'privacidad'>('aviso');

  const openLegal = (tab: 'aviso' | 'privacidad') => {
    setLegalTab(tab);
    if (legalDialogRef.current && !legalDialogRef.current.open) {
      legalDialogRef.current.showModal();
      onDialogToggle?.(true);
    }
  };

  const closeLegal = () => {
    if (legalDialogRef.current?.open) {
      legalDialogRef.current.close();
      onDialogToggle?.(false);
    }
  };

  return (
    <>
      <footer className="bg-[#14321F] text-[#F3EADC] pt-14 pb-24 md:pb-12 border-t border-[#A8873A]/40">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#A8873A]/25 items-start">
            <div className="md:col-span-5">
              <JeymaLogo variant="cream" className="w-40 h-auto" />
              <p className="mt-4 text-sm text-[#F3EADC]/80 max-w-sm leading-relaxed">
                {NEGOCIO.slogan}
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8873A] mb-3">
                Contacto
              </p>
              <p className="text-[#F3EADC]/90">{NEGOCIO.direccion}</p>
              <p>
                <a
                  href={NEGOCIO.telefonoHref}
                  className="text-[#F3EADC]/90 hover:text-[#F3EADC] tabular-nums"
                >
                  {NEGOCIO.telefono}
                </a>
              </p>
              <p>
                <a href={NEGOCIO.emailHref} className="text-[#F3EADC]/90 hover:text-[#F3EADC]">
                  {NEGOCIO.email}
                </a>
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8873A] mb-3">
                Comunidad y reservas
              </p>
              <p>
                <a
                  href={NEGOCIO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3EADC]/90 hover:text-[#F3EADC]"
                >
                  Instagram {NEGOCIO.instagramHandle}
                </a>
              </p>
              <p>
                <a
                  href={NEGOCIO.reservasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3EADC]/90 hover:text-[#F3EADC]"
                >
                  Reservar mesa
                </a>
              </p>
              <p>
                <a
                  href={NEGOCIO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3EADC]/90 hover:text-[#F3EADC]"
                >
                  Ver en Google Maps
                </a>
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F3EADC]/70">
            <div className="flex flex-wrap items-center gap-4">
              <span>© {new Date().getFullYear()} JEYMA Bilbao</span>
              <button
                type="button"
                onClick={() => openLegal('aviso')}
                className="hover:text-[#F3EADC] underline underline-offset-4 cursor-pointer"
              >
                Aviso legal
              </button>
              <button
                type="button"
                onClick={() => openLegal('privacidad')}
                className="hover:text-[#F3EADC] underline underline-offset-4 cursor-pointer"
              >
                Privacidad
              </button>
            </div>

            <p className="text-[#A8873A]">
              Propuesta de rediseño · {PROPUESTA_CONFIG.agenciaNombre}
            </p>
          </div>
        </div>
      </footer>

      {/* Botón flotante móvil "Pide ahora" (respetando límite 15% altura y sin tapar botones) */}
      <div className="md:hidden fixed bottom-3 inset-x-4 z-30 pointer-events-none flex justify-center">
        <button
          type="button"
          onClick={openCart}
          className="pointer-events-auto w-full max-w-sm min-h-[48px] px-5 py-2.5 rounded-xl bg-[#F3EADC] text-[#1F4A2E] border border-[#A8873A] shadow-xl flex items-center justify-between gap-3 font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1F4A2E]" aria-hidden="true" />
            <span>Pide ahora</span>
          </span>
          <span className="tabular-nums font-bold">
            {totalItems > 0 ? `${totalItems} · ${formatEuro(totalPrecio)}` : 'Ver pedido'}
          </span>
        </button>
      </div>

      {/* Diálogo legal */}
      <dialog
        ref={legalDialogRef}
        className="jeyma-dialog"
        aria-labelledby="legal-dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          closeLegal();
        }}
        onClick={(e) => {
          if (e.target === legalDialogRef.current) closeLegal();
        }}
      >
        <div
          data-lenis-prevent
          className="bg-[#FAF5EC] text-[#1F4A2E] rounded-t-2xl md:rounded-2xl border border-[#A8873A] p-6 max-h-[82svh] overflow-y-auto"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#5C4930]/20">
            <h2 id="legal-dialog-title" className="font-display font-bold text-xl">
              {legalTab === 'aviso' ? 'Aviso legal' : 'Política de privacidad'}
            </h2>
            <button
              type="button"
              onClick={closeLegal}
              className="w-10 h-10 rounded-full hover:bg-[#1F4A2E]/10 flex items-center justify-center cursor-pointer"
              aria-label="Cerrar aviso legal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 text-sm text-[#5C4930] space-y-3 leading-relaxed">
            {legalTab === 'aviso' ? (
              <>
                <p>
                  Propuesta de rediseño web elaborada por{' '}
                  <strong>{PROPUESTA_CONFIG.agenciaNombre}</strong> para{' '}
                  <strong>JEYMA</strong> ({NEGOCIO.direccion}).
                </p>
                <p>
                  Los precios mostrados incluyen IVA vigente y corresponden a la carta oficial
                  del establecimiento. Los pedidos de demostración se envían al número de prueba
                  configurado en la propuesta.
                </p>
              </>
            ) : (
              <>
                <p>
                  Esta web no utiliza cookies publicitarias ni almacena datos personales en
                  servidores externos. Los artículos de tu pedido se guardan únicamente de forma
                  local en tu navegador.
                </p>
                <p>
                  Al enviar un pedido por WhatsApp, los datos introducidos (nombre, teléfono,
                  dirección en su caso y pedido) se transmiten directamente a través de tu propia
                  sesión de WhatsApp.
                </p>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};
