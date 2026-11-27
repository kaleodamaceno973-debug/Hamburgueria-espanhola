import { useEffect, useRef } from 'react';
import { CalendarCheck, MapPin, X } from 'lucide-react';
import { LOCATIONS } from '../data/brand';
import { useOrder } from '../context/OrderContext';

export function ReserveDialog() {
  const { isReserveOpen, setIsReserveOpen, selectedCity, setSelectedCity } = useOrder();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isReserveOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isReserveOpen]);

  if (!isReserveOpen) {
    return <dialog ref={dialogRef} className="hidden" />;
  }

  const active = LOCATIONS.find((l) => l.id === selectedCity) ?? LOCATIONS[0];

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setIsReserveOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) setIsReserveOpen(false);
      }}
      className="m-0 h-full max-h-full w-full max-w-full bg-transparent p-4 backdrop:bg-black/80 open:flex open:items-center open:justify-center"
      aria-labelledby="reserve-modal-title"
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0b0c] p-6 sm:p-8 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setIsReserveOpen(false)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black text-white/75 hover:border-[#FFB547] hover:text-white"
          aria-label="Cerrar selector de reserva"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#FFB547]">
          Reservar mesa
        </p>
        <h3
          id="reserve-modal-title"
          className="font-display mt-2 text-2xl sm:text-3xl font-black uppercase text-white"
        >
          ¿En qué ciudad te esperamos?
        </h3>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedCity(loc.id)}
              className={`h-11 rounded-lg border text-xs sm:text-sm font-bold transition-colors ${
                selectedCity === loc.id
                  ? 'border-[#FFB547] bg-[#FFB547] text-black'
                  : 'border-white/15 bg-black text-white/80 hover:border-white/35'
              }`}
            >
              {loc.city}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black p-5">
          <p className="font-display text-lg font-black uppercase text-white">
            Baka Vieja {active.city}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-white/75">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB547]" />
            <span>
              {active.address} · {active.postalAndCity}
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={active.reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-6 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D]"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Reservar en {active.city}</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
