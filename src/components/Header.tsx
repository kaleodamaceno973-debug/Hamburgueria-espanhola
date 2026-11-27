import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AGENCY_NAME, BRAND_ASSETS } from '../data/brand';
import { useOrder } from '../context/OrderContext';

interface HeaderProps {
  onNavigate: (targetId: string) => void;
  onMenuOpenChange?: (open: boolean) => void;
}

const NAV_LINKS = [
  { id: 'vitrina', label: 'Vitrina' },
  { id: 'limited', label: 'Limited' },
  { id: 'carta', label: 'Carta' },
  { id: 'historia', label: 'Historia' },
  { id: 'locales', label: 'Locales' },
];

export function Header({ onNavigate, onMenuOpenChange }: HeaderProps) {
  const { totalCount, setIsCartOpen, cartBounceKey } = useOrder();
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (next: boolean) => {
    setMobileMenuOpen(next);
    onMenuOpenChange?.(next);
  };

  const handleNavClick = (id: string) => {
    if (mobileMenuOpen) {
      toggleMobileMenu(false);
      // Double rAF so sticky layout settles before Lenis calculates scroll target
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onNavigate(id);
        });
      });
    } else {
      onNavigate(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/92 border-b border-white/10">
      {showBanner && (
        <div className="flex h-8 items-center justify-between border-b border-[#FFB547]/20 bg-[#0b0b0c] px-4 text-[11px] sm:text-xs text-white/75">
          <div className="mx-auto flex items-center gap-2 truncate">
            <span className="text-[#FFB547] font-medium whitespace-nowrap">
              Propuesta de rediseño para Baka Vieja
            </span>
            <span aria-hidden="true" className="text-white/35">
              ·
            </span>
            <span className="truncate text-white/65">por {AGENCY_NAME}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/55 hover:text-white transition-colors"
            aria-label="Cerrar aviso de propuesta"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Clean 3-zone Top Bar Contract */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand mark only (single clean anchor, no subtitle/badge clutter) */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero');
          }}
          className="shrink-0 whitespace-nowrap focus-visible:outline-none"
          aria-label="Baka Vieja Burger Shop — Inicio"
        >
          <img
            src={BRAND_ASSETS.logoWhite}
            alt="Baka Vieja Burger Shop"
            width={132}
            height={42}
            className="h-9 w-auto object-contain sm:h-10"
          />
        </a>

        {/* Zone 2: 5 single-line navigation links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-white/80"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#FFB547] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#FFB547] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FFB547] px-4 text-xs sm:text-sm font-bold text-black transition-transform duration-150 hover:bg-[#FFBC7D] active:scale-95 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>Pide ahora</span>
            {totalCount > 0 && (
              <span
                key={cartBounceKey}
                className="tabular-nums font-black text-black/90"
              >
                · {totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleMobileMenu(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0b0b0c] px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4" aria-label="Menú móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className="font-display text-xl font-bold text-white transition-colors hover:text-[#FFB547]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
