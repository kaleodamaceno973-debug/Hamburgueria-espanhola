import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { PROPUESTA_CONFIG } from '../data/negocio';
import { useCart } from './CartContext';

interface ProposalHeaderProps {
  onNavigateAnchor: (id: string) => void;
  onMobileMenuChange?: (open: boolean) => void;
}

const NAV_LINKS = [
  { id: 'elige-tu-base', label: 'Elige tu base' },
  { id: 'carta', label: 'La carta' },
  { id: 'smash-burgers', label: 'Burgers' },
  { id: 'encuentranos', label: 'Encuéntranos' },
] as const;

export const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  onNavigateAnchor,
  onMobileMenuChange,
}) => {
  const [bannerVisible, setBannerVisible] = useState<boolean>(PROPUESTA_CONFIG.mostrarBannerPropuesta);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart, cartPulseKey } = useCart();

  const toggleMobile = (next: boolean) => {
    setMobileOpen(next);
    onMobileMenuChange?.(next);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (mobileOpen) {
      toggleMobile(false);
      // Doble requestAnimationFrame para calcular el destino del scroll después de cerrar el menú móvil
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onNavigateAnchor(id);
        });
      });
    } else {
      onNavigateAnchor(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1F4A2E]/95 border-b border-[#A8873A]/30">
      {bannerVisible && (
        <div className="bg-[#14321F] text-[#F3EADC] border-b border-[#A8873A]/25 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <p className="truncate">
            Propuesta de rediseño para <strong className="font-semibold text-[#F3EADC]">JEYMA</strong>
            <span className="mx-1.5 text-[#A8873A]" aria-hidden="true">·</span>
            <span className="text-[#F3EADC]/80">por {PROPUESTA_CONFIG.agenciaNombre}</span>
          </p>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="shrink-0 p-1 rounded hover:bg-[#F3EADC]/10 text-[#F3EADC]/80 hover:text-[#F3EADC] transition-colors cursor-pointer"
            aria-label="Cerrar aviso de propuesta"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Contrato de barra superior de 3 zonas */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zona 1: Wordmark de una línea */}
        <a
          href="#inicio"
          onClick={(e) => handleLinkClick(e, 'inicio')}
          className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#F3EADC] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8873A]"
        >
          jeyma
        </a>

        {/* Zona 2: 4 enlaces concisos de una sola línea */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F3EADC]/85"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#A8873A] hover:text-[#F3EADC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8873A]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zona 3: 1 acción principal + botón menú móvil */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="header-cart-button"
            type="button"
            onClick={openCart}
            className="inline-flex items-center gap-2 min-h-[40px] sm:min-h-[42px] px-4 py-2 rounded-lg bg-[#F3EADC] text-[#1F4A2E] hover:bg-[#FAF5EC] text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-transform active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8873A]"
            aria-label={`Abrir tu pedido (${totalItems} productos)`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tu pedido</span>
            <span
              key={cartPulseKey}
              className={`tabular-nums font-bold px-1.5 py-0.5 rounded bg-[#1F4A2E] text-[#F3EADC] text-[11px] leading-none ${
                cartPulseKey > 0 ? 'cart-pop' : ''
              }`}
            >
              {totalItems}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleMobile(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#F3EADC]/25 text-[#F3EADC] hover:bg-[#F3EADC]/10 transition-colors cursor-pointer"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Navegación móvil"
          className="md:hidden bg-[#14321F] border-t border-[#A8873A]/30 px-4 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className="min-h-[44px] flex items-center justify-between px-3 rounded-lg text-base font-medium text-[#F3EADC] hover:bg-[#1F4A2E] transition-colors"
            >
              <span>{link.label}</span>
              <span className="text-[#A8873A]" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
