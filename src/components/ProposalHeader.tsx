import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NEGOCIO } from '../data/negocio';

interface ProposalHeaderProps {
  onOpenOrder: () => void;
  onNavigateAnchor: (href: string, fromMobileMenu?: boolean) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: (open: boolean) => void;
}

const NAV_LINKS = [
  { label: 'La Brasa', href: '#la-brasa' },
  { label: 'Hazla tuya', href: '#hazla-tuya' },
  { label: 'Burgers', href: '#vuelta-al-mundo' },
  { label: 'Locales', href: '#el-local' },
  { label: 'FAQ', href: '#faq' },
];

export default function ProposalHeader({
  onOpenOrder,
  onNavigateAnchor,
  mobileMenuOpen,
  onToggleMobileMenu,
}: ProposalHeaderProps) {
  const [showProposalBar, setShowProposalBar] = useState(true);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/95 border-b border-white/10">
      {showProposalBar && (
        <div className="flex items-center justify-between gap-3 border-b border-[#E9632D]/25 bg-[#E9632D]/12 px-4 py-1.5 text-xs text-[#F5EFE6]/90 sm:px-6">
          <p className="truncate">
            Propuesta de rediseño para <strong className="text-[#F5EFE6]">Bilbo Burger</strong> · por{' '}
            <span className="text-[#E9632D] font-medium">{NEGOCIO.agenciaPropuesta}</span>
          </p>
          <button
            type="button"
            onClick={() => setShowProposalBar(false)}
            aria-label="Cerrar aviso de propuesta"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#F5EFE6]/70 transition-colors hover:bg-white/10 hover:text-[#F5EFE6] focus-visible:outline-2 focus-visible:outline-[#E9632D]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 3-zone Top Bar Contract */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand mark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor('#inicio', false);
          }}
          className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[#E9632D] rounded"
          aria-label="Bilbo Burger · Ir al inicio"
        >
          <img
            src="/images/logo-bilboburger.webp"
            alt="Logo oficial de Bilbo Burger"
            width={752}
            height={344}
            className="h-8 w-auto sm:h-9"
          />
        </a>

        {/* Zone 2: 5 concise single-line links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F5EFE6]/80"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigateAnchor(link.href, false);
              }}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA (+ mobile menu button) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenOrder}
            className="min-h-[40px] rounded-full bg-[#E9632D] px-5 py-2 text-xs font-bold tracking-wide text-[#0B0B0B] uppercase transition-transform duration-150 hover:scale-[1.03] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
          >
            Pide online
          </button>

          <button
            type="button"
            onClick={() => onToggleMobileMenu(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#F5EFE6] transition-colors hover:border-[#E9632D] md:hidden focus-visible:outline-2 focus-visible:outline-[#E9632D]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer (closes before anchor scroll to keep offsets accurate) */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menú móvil"
          className="border-t border-white/10 bg-[#0B0B0B] px-5 py-5 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateAnchor(link.href, true);
                  }}
                  className="flex min-h-[44px] items-center justify-between border-b border-white/10 py-2.5 text-base font-semibold text-[#F5EFE6] transition-colors hover:text-[#E9632D]"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-[#E9632D]">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={NEGOCIO.enlaces.reservas}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6]"
            >
              Reserva mesa
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
