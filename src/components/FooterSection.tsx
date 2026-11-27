import { ArrowUpRight, Instagram } from 'lucide-react';
import {
  AGENCY_NAME,
  BRAND_ASSETS,
  INSTAGRAM_URL,
  JOBS_URL,
  LOCATIONS,
} from '../data/brand';

interface FooterSectionProps {
  onNavigate: (id: string) => void;
}

export function FooterSection({ onNavigate }: FooterSectionProps) {
  return (
    <>
      {/* 14. Trabaja con nosotros */}
      <section className="border-b border-white/10 bg-black py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#FFB547]">
              Equipo Baka Vieja
            </p>
            <h2 className="font-display mt-1.5 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              ¿Te vienes a la plancha?
            </h2>
            <p className="mt-1.5 text-sm text-white/65">
              Buscamos gente con ganas en Bilbao, Zaragoza y Burgos.
            </p>
          </div>
          <a
            href={JOBS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-[#FFB547] px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFB547] transition-colors hover:bg-[#FFB547] hover:text-black whitespace-nowrap"
          >
            <span>Trabaja con nosotros</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 15. Footer */}
      <footer className="bg-[#050506] pb-24 pt-16 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <img
                src={BRAND_ASSETS.logoWhite}
                alt="Baka Vieja Burger Shop"
                width={150}
                height={48}
                className="h-11 w-auto object-contain"
              />
              <p className="font-bambino mt-4 text-base text-white/75">
                Especialistas en carne desde 2019. Burgers brutales en Bilbao, Zaragoza y Burgos.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#FFB547] transition-colors hover:text-[#FFBC7D]"
              >
                <Instagram className="h-4 w-4" />
                <span>@bakaviejaburgershop</span>
              </a>
            </div>

            <div className="md:col-span-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                Nuestros locales
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                {LOCATIONS.map((loc) => (
                  <li key={loc.id}>
                    <span className="font-bold text-white">{loc.city}</span>
                    <span className="text-white/40"> · </span>
                    <span>
                      {loc.address}, {loc.postalAndCity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                Secciones
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                {[
                  { id: 'vitrina', label: 'La vitrina de neón' },
                  { id: 'limited', label: 'Limited Edition' },
                  { id: 'carta', label: 'La carta completa' },
                  { id: 'historia', label: 'Quiénes somos' },
                  { id: 'eventos', label: 'Eventos y food truck' },
                  { id: 'locales', label: 'Locales y reservas' },
                ].map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.id);
                      }}
                      className="transition-colors hover:text-[#FFB547]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Baka Vieja Burger Shop · Bilbao · Zaragoza · Burgos</p>
            <p>Propuesta de rediseño · {AGENCY_NAME}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
