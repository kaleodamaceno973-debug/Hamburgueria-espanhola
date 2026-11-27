import { useState } from 'react';
import { ChevronDown, ExternalLink, Flame, Instagram, Phone, Star } from 'lucide-react';
import { NEGOCIO } from '../data/negocio';

interface CommunityFaqFooterProps {
  onOpenOrder: () => void;
}

export default function CommunityFaqFooter({ onOpenOrder }: CommunityFaqFooterProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(NEGOCIO.faqs[0].id);

  return (
    <>
      {/* 10. Pedidos */}
      <section
        id="pedidos"
        aria-labelledby="pedidos-title"
        className="relative overflow-hidden border-t border-white/10 bg-[#111111] py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="ember-glow-static pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 opacity-75"
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="text-xs font-semibold tracking-[0.22em] text-[#FFB23F] uppercase">
            {NEGOCIO.textos.pedidosSubtitulo}
          </span>
          <h2
            id="pedidos-title"
            className="font-display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.02] text-[#F5EFE6]"
          >
            Tienes hambre. <span className="text-[#E9632D]">Nosotros tenemos fuego.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F5EFE6]/75 sm:text-base">
            Haz tu pedido directamente sin comisiones de intermediarios. Carbón de encina directo a tu mesa.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onOpenOrder}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#E9632D] px-9 py-3 text-sm font-bold tracking-wide text-[#0B0B0B] uppercase transition-transform duration-150 hover:scale-[1.03] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span>Pide online</span>
            </button>

            <a
              href={NEGOCIO.enlaces.cartaOnline}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
            >
              <span>Ver carta completa</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 11. Reseñas */}
      <section
        id="resenas"
        aria-labelledby="resenas-title"
        className="border-t border-white/10 bg-[#0B0B0B] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
                Lo que dice Bilbao
              </span>
              <h2
                id="resenas-title"
                className="font-display mt-2 text-3xl text-[#F5EFE6] sm:text-5xl"
              >
                Reseña real en <span className="text-[#E9632D]">Google.</span>
              </h2>
            </div>
            <a
              href={NEGOCIO.enlaces.googleMapsIbarrekolanda}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] whitespace-nowrap shrink-0"
            >
              <span>Ver más en Google</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <blockquote className="mt-8 rounded-2xl border border-white/12 bg-[#121212] p-6 sm:p-10">
            <div className="flex items-center gap-1 text-[#FFB23F]" aria-label="5 de 5 estrellas">
              {Array.from({ length: NEGOCIO.resenaDestacada.estrellas }).map((_, idx) => (
                <Star key={idx} className="h-5 w-5 fill-current" aria-hidden="true" />
              ))}
            </div>
            <p className="mt-5 text-lg leading-relaxed text-[#F5EFE6] sm:text-2xl">
              “{NEGOCIO.resenaDestacada.texto}”
            </p>
            <footer className="mt-6 flex items-center gap-2 text-sm text-[#F5EFE6]/70">
              <strong className="text-[#F5EFE6]">{NEGOCIO.resenaDestacada.autor}</strong>
              <span aria-hidden="true">·</span>
              <span>{NEGOCIO.resenaDestacada.fecha}</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 12. Instagram */}
      <section
        id="instagram"
        aria-labelledby="instagram-title"
        className="border-t border-white/10 bg-[#0F0F0F] py-16 sm:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
              @bilboburger
            </span>
            <h2
              id="instagram-title"
              className="font-display mt-2 text-2xl text-[#F5EFE6] sm:text-4xl"
            >
              {NEGOCIO.textos.instagramCallout}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={NEGOCIO.enlaces.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#E9632D] px-7 py-2.5 text-sm font-bold text-[#0B0B0B] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#ff723b] focus-visible:outline-2 focus-visible:outline-[#E9632D] whitespace-nowrap shrink-0"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              <span>Síguenos</span>
            </a>

            <a
              href={NEGOCIO.enlaces.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-[#F5EFE6] transition-colors hover:border-[#E9632D] hover:text-[#E9632D] whitespace-nowrap shrink-0"
            >
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-title"
        className="border-t border-white/10 bg-[#0B0B0B] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E9632D] uppercase">
            Dudas rápidas
          </span>
          <h2
            id="faq-title"
            className="font-display mt-2 text-3xl text-[#F5EFE6] sm:text-5xl"
          >
            Preguntas frecuentes
          </h2>

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {NEGOCIO.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${faq.id}-panel`}
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-[#F5EFE6] transition-colors hover:text-[#E9632D] focus-visible:outline-2 focus-visible:outline-[#E9632D] sm:text-lg"
                    >
                      <span>{faq.pregunta}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#E9632D] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={`${faq.id}-panel`}
                    hidden={!isOpen}
                    className="pb-5 text-sm leading-relaxed text-[#F5EFE6]/75 sm:text-base"
                  >
                    {faq.respuesta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. Footer */}
      <footer className="border-t border-white/10 bg-[#080808] pt-14 pb-24 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <img
                src="/images/logo-bilboburger.webp"
                alt="Bilbo Burger"
                width={752}
                height={344}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto"
              />
              <p className="font-display mt-4 text-xl text-[#F5EFE6]">
                Nacido en Bilbao, criado entre brasas.
              </p>
              <p className="mt-2 text-sm text-[#F5EFE6]/65">
                Burgers con carácter. Sabor sin filtros.
              </p>
            </div>

            <div className="space-y-2.5 text-sm text-[#F5EFE6]/80 md:col-span-4">
              <p className="text-xs font-bold tracking-[0.18em] text-[#E9632D] uppercase">
                Contacto
              </p>
              <p>
                <a
                  href={NEGOCIO.telefonoHref}
                  className="inline-flex items-center gap-2 hover:text-[#E9632D]"
                >
                  <Phone className="h-4 w-4 text-[#E9632D]" aria-hidden="true" />
                  <span>{NEGOCIO.telefono}</span>
                </a>
              </p>
              <p>
                <a href={NEGOCIO.emailHref} className="hover:text-[#E9632D]">
                  {NEGOCIO.email}
                </a>
              </p>
              <p className="text-xs text-[#F5EFE6]/60">
                {NEGOCIO.locales[0].direccion}
              </p>
            </div>

            <div className="space-y-2.5 text-sm text-[#F5EFE6]/80 md:col-span-3">
              <p className="text-xs font-bold tracking-[0.18em] text-[#E9632D] uppercase">
                Enlaces y legal
              </p>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href={NEGOCIO.enlaces.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E9632D]"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={NEGOCIO.enlaces.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E9632D]"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={NEGOCIO.enlaces.avisoLegal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E9632D]"
                  >
                    Aviso legal
                  </a>
                </li>
                <li>
                  <a
                    href={NEGOCIO.enlaces.privacidad}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E9632D]"
                  >
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a
                    href={NEGOCIO.enlaces.cookies}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E9632D]"
                  >
                    Política de cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#F5EFE6]/55 sm:flex-row sm:items-center">
            <p>{NEGOCIO.razonSocial} · Bilbao</p>
            <p>
              Propuesta de rediseño · <span className="text-[#E9632D]">{NEGOCIO.agenciaPropuesta}</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile fixed bottom bar (<= 56px tall, well under 15% cap) */}
      <div className="fixed right-0 bottom-0 left-0 z-30 flex h-14 items-center gap-2 border-t border-white/15 bg-[#0B0B0B]/95 px-3 md:hidden">
        <button
          type="button"
          onClick={onOpenOrder}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#E9632D] text-xs font-bold tracking-wide text-[#0B0B0B] uppercase"
        >
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pide online</span>
        </button>
        <a
          href={NEGOCIO.enlaces.reservas}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 flex-1 items-center justify-center rounded-full border border-white/25 text-xs font-semibold text-[#F5EFE6]"
        >
          Reserva
        </a>
      </div>
    </>
  );
}
