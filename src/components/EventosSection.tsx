import {
  Briefcase,
  MessageCircle,
  Music,
  PartyPopper,
  Trophy,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import { BRAND_ASSETS, EVENTS_DATA, WHATSAPP_NUMBER } from '../data/brand';

const EVENT_ICONS: Record<string, typeof Trophy> = {
  competiciones: Trophy,
  foodtrucks: Truck,
  festivales: Music,
  fiestas: PartyPopper,
  corporativos: Briefcase,
  catering: UtensilsCrossed,
};

export function EventosSection() {
  const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, '');
  const message =
    'Hola, quiero Baka Vieja para un evento. ¿Me pasáis disponibilidad y presupuesto?';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <section
      id="eventos"
      className="relative overflow-hidden border-b border-white/10 bg-black py-24 sm:py-32"
    >
      {/* Full-bleed food truck photography with strong contrast scrim */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={BRAND_ASSETS.eventsTruck}
          alt="Food truck de Baka Vieja encendido de noche para eventos y festivales"
          width={1400}
          height={933}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
            Eventos · Food Truck &amp; Catering
          </p>
          <h2 className="font-display mt-3 text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.96] tracking-tight text-white text-balance">
            {EVENTS_DATA.headline}
          </h2>
          <p className="font-bambino mt-5 text-lg sm:text-2xl text-white/90">
            {EVENTS_DATA.lead}
          </p>
        </div>

        {/* 6 event formats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS_DATA.types.map((ev) => {
            const Icon = EVENT_ICONS[ev.id] ?? Truck;
            return (
              <div
                key={ev.id}
                className="flex items-center gap-3.5 rounded-xl border border-white/15 bg-black/75 px-4 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FFB547]/40 bg-[#FFB547]/10 text-[#FFB547]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-white">{ev.label}</span>
              </div>
            );
          })}
        </div>

        {/* Operational pillars + CTA */}
        <div className="mt-10 flex flex-col gap-8 border-t border-white/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid gap-2.5 sm:grid-cols-2 text-sm text-white/80">
            {EVENTS_DATA.pillars.map((pillar) => (
              <li key={pillar} className="flex items-start gap-2">
                <span className="text-[#FFB547]" aria-hidden="true">
                  ·
                </span>
                <span>{pillar}</span>
              </li>
            ))}
          </ul>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-lg bg-[#FFB547] px-7 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D] whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Pide presupuesto</span>
          </a>
        </div>
      </div>
    </section>
  );
}
