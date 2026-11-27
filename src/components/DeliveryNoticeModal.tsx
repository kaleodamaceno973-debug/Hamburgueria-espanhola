import { useEffect, useRef } from 'react';
import { Flame, ExternalLink, X } from 'lucide-react';
import { NEGOCIO } from '../data/negocio';

interface DeliveryNoticeModalProps {
  open: boolean;
  onClose: () => void;
  burgerResumen?: string | null;
}

export default function DeliveryNoticeModal({
  open,
  onClose,
  burgerResumen,
}: DeliveryNoticeModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="delivery-modal-title"
      className="bilbo-dialog m-auto w-[min(92vw,540px)] rounded-2xl border border-[#E9632D]/35 bg-[#121212] p-0 text-[#F5EFE6] shadow-2xl"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso de reparto"
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-[#F5EFE6]/70 transition-colors hover:bg-white/10 hover:text-[#F5EFE6] focus-visible:outline-2 focus-visible:outline-[#E9632D]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-[#E9632D] uppercase">
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>Aviso importante de reparto</span>
        </div>

        <h2
          id="delivery-modal-title"
          className="font-display mt-3 text-2xl leading-tight text-[#F5EFE6] sm:text-3xl"
        >
          Antes de pedir a domicilio
        </h2>

        {burgerResumen && (
          <div className="mt-4 rounded-xl border border-[#E9632D]/30 bg-[#E9632D]/10 px-4 py-3 text-sm text-[#F5EFE6]">
            <span className="font-semibold text-[#E9632D]">Tu selección: </span>
            <span>{burgerResumen}</span>
          </div>
        )}

        <p className="mt-4 text-sm leading-relaxed text-[#F5EFE6]/85 sm:text-base">
          {NEGOCIO.textos.avisoReparto}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-[#F5EFE6] transition-colors hover:border-white/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
          >
            Cancelar
          </button>
          <a
            href={NEGOCIO.enlaces.pedidoOnline}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#E9632D] px-7 py-2.5 text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
          >
            <span>Entendido, ir a pedir</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </dialog>
  );
}
