import React, { useMemo } from 'react';
import { MapPin, Phone, Calendar, ExternalLink } from 'lucide-react';
import {
  HORARIO_SEMANAL,
  NEGOCIO,
  getEstadoHorarioMadrid,
} from '../data/negocio';
import { TentacleCorner } from './JeymaBrand';

const ServiceIcon: React.FC<{ id: string }> = ({ id }) => {
  // Íconos de trazo con pequeño detalle de tentáculo / ventosa
  switch (id) {
    case 'terraza':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#1F4A2E]" aria-hidden="true">
          <path d="M10 20c4-8 24-8 28 0H10Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M24 20v19M15 39h18M12 29h9M27 29h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M36 14c3-2 6 0 5 4" stroke="#A8873A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'llevar':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#1F4A2E]" aria-hidden="true">
          <path d="M13 18h22l-2 21H15l-2-21Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M19 18v-3a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M20 29c3-4 6 4 9 0" stroke="#A8873A" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'wifi':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#1F4A2E]" aria-hidden="true">
          <path d="M9 20c8-7 22-7 30 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 26c5-5 15-5 20 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M19 32c3-2.5 7-2.5 10 0" stroke="#A8873A" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="37" r="2.2" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#1F4A2E]" aria-hidden="true">
          <circle cx="17" cy="18" r="3" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="31" cy="18" r="3" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="12" cy="26" r="2.5" stroke="#A8873A" strokeWidth="2" />
          <circle cx="36" cy="26" r="2.5" stroke="#A8873A" strokeWidth="2" />
          <path d="M17 33c0-4 3.2-7 7-7s7 3 7 7c0 3-3 5-7 5s-7-2-7-5Z" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      );
  }
};

export const ElBarYEncuentranos: React.FC = () => {
  const estado = useMemo(() => getEstadoHorarioMadrid(), []);

  return (
    <>
      {/* SECCIÓN 11: EL BAR (crema) */}
      <section className="relative overflow-hidden paper-cream text-[#1F4A2E] border-b border-[#A8873A]/45 py-16 sm:py-22">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C4930]">
                El bar · Bilbao
              </p>
              <h2 className="mt-2 font-display font-extrabold text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.06] text-[#1F4A2E] [text-wrap:balance]">
                Barra, terraza y cuadrilla.
              </h2>
              <p className="mt-4 font-display italic text-lg text-[#5C4930] leading-relaxed">
                «{NEGOCIO.fraseCuadrilla}»
              </p>

              <div className="mt-6 pt-5 border-t border-[#5C4930]/20">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5C4930] mb-2">
                  Pagos en el local
                </p>
                <p className="text-sm text-[#1F4A2E] font-medium">
                  {NEGOCIO.pagos.join(' · ')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {NEGOCIO.servicios.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-[#FAF5EC] border border-[#A8873A]/45 flex items-start gap-4"
                >
                  <div className="shrink-0 p-2 rounded-xl bg-[#1F4A2E]/8">
                    <ServiceIcon id={srv.id} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#1F4A2E]">
                      {srv.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-[#5C4930] leading-snug">
                      {srv.detalle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 12: ENCUÉNTRANOS (verde botella) */}
      <section
        id="encuentranos"
        className="relative overflow-hidden paper-green text-[#F3EADC] border-b border-[#A8873A]/40 py-16 sm:py-24"
      >
        <TentacleCorner
          className="pointer-events-none absolute -bottom-6 -left-6 w-48 sm:w-64 h-auto opacity-30"
          color="#A8873A"
          glowColor="rgba(243,234,220,0.1)"
        />

        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Mapa ilustrado SVG del barrio de Indautxu */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#A8873A]/50 bg-[#14321F] p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8873A]">
                    Indautxu · Bilbao
                  </p>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F3EADC]">
                    {NEGOCIO.calle}
                  </h2>
                </div>
                <span className="text-xs text-[#F3EADC]/80 tabular-nums">
                  {NEGOCIO.cpCiudad}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-[#A8873A]/35 bg-[#10291A]">
                <svg
                  viewBox="0 0 540 340"
                  className="w-full h-auto block"
                  role="img"
                  aria-label="Mapa ilustrado de la ubicación de JEYMA en Calle Pérez Galdós 33, Indautxu, Bilbao"
                >
                  {/* Manzanas del barrio */}
                  <rect width="540" height="340" fill="#10291A" />
                  <g fill="#173824" stroke="#28583B" strokeWidth="1.2">
                    <rect x="28" y="26" width="120" height="86" rx="6" />
                    <rect x="176" y="26" width="160" height="86" rx="6" />
                    <rect x="364" y="26" width="146" height="86" rx="6" />
                    <rect x="28" y="138" width="120" height="90" rx="6" />
                    <rect x="176" y="138" width="160" height="90" rx="6" />
                    <rect x="364" y="138" width="146" height="90" rx="6" />
                    <rect x="28" y="254" width="120" height="64" rx="6" />
                    <rect x="176" y="254" width="160" height="64" rx="6" />
                    <rect x="364" y="254" width="146" height="64" rx="6" />
                  </g>

                  {/* Calles principales */}
                  <g stroke="#2E6443" strokeWidth="14" strokeLinecap="round">
                    <line x1="0" y1="125" x2="540" y2="125" />
                    <line x1="0" y1="241" x2="540" y2="241" />
                    <line x1="162" y1="0" x2="162" y2="340" />
                    <line x1="350" y1="0" x2="350" y2="340" />
                  </g>

                  {/* Nombres reales de calles de Indautxu */}
                  <text x="256" y="129" fill="#A8873A" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="1.6">
                    C. PÉREZ GALDÓS
                  </text>
                  <text x="256" y="245" fill="#F3EADC" fillOpacity="0.6" fontSize="10" textAnchor="middle" letterSpacing="1.4">
                    ALAMEDA DE URQUIJO
                  </text>
                  <text
                    x="166"
                    y="192"
                    fill="#F3EADC"
                    fillOpacity="0.6"
                    fontSize="10"
                    textAnchor="middle"
                    transform="rotate(-90 166 192)"
                    letterSpacing="1.2"
                  >
                    AV. SABINO ARANA
                  </text>
                  <text
                    x="354"
                    y="192"
                    fill="#F3EADC"
                    fillOpacity="0.6"
                    fontSize="10"
                    textAnchor="middle"
                    transform="rotate(-90 354 192)"
                    letterSpacing="1.2"
                  >
                    DOCTOR AREILZA
                  </text>

                  {/* Metro Indautxu / San Mamés referencia */}
                  <circle cx="436" cy="241" r="10" fill="#1F4A2E" stroke="#F3EADC" strokeWidth="1.5" />
                  <text x="436" y="245" fill="#F3EADC" fontSize="9.5" fontWeight="700" textAnchor="middle">
                    M
                  </text>
                  <text x="436" y="264" fill="#F3EADC" fillOpacity="0.7" fontSize="9" textAnchor="middle">
                    Indautxu
                  </text>

                  {/* Tentáculo señalando el pin de JEYMA */}
                  <path
                    d="M 88 225 C 122 204, 150 172, 198 156 C 218 150, 232 142, 244 134"
                    stroke="#A8873A"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="145" cy="184" r="2.2" fill="#A8873A" />
                  <circle cx="172" cy="168" r="2.5" fill="#A8873A" />
                  <circle cx="202" cy="154" r="2.2" fill="#A8873A" />

                  {/* Pin oficial JEYMA en Pérez Galdós 33 */}
                  <g transform="translate(262, 122)">
                    <circle cx="0" cy="0" r="26" fill="#A8873A" fillOpacity="0.22" />
                    <path
                      d="M0 -34 C 13 -34, 22 -24, 22 -12 C 22 4, 0 22, 0 22 C 0 22, -22 4, -22 -12 C -22 -24, -13 -34, 0 -34 Z"
                      fill="#F3EADC"
                      stroke="#1F4A2E"
                      strokeWidth="2.5"
                    />
                    <text
                      x="0"
                      y="-9"
                      textAnchor="middle"
                      fill="#1F4A2E"
                      style={{ fontFamily: '"Fraunces", serif', fontWeight: 900, fontSize: '12px' }}
                    >
                      jeyma
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={NEGOCIO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#F3EADC] text-[#1F4A2E] hover:bg-[#FAF5EC] text-sm font-semibold transition-colors"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Cómo llegar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                </a>

                <a
                  href={NEGOCIO.telefonoHref}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#A8873A] text-[#F3EADC] hover:bg-[#A8873A]/15 text-sm font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#A8873A]" aria-hidden="true" />
                  <span>Llamar</span>
                </a>

                <a
                  href={NEGOCIO.reservasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#F3EADC]/30 text-[#F3EADC] hover:bg-[#F3EADC]/10 text-sm font-semibold transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#A8873A]" aria-hidden="true" />
                  <span>Reservar</span>
                </a>
              </div>
            </div>

            {/* Horario semanal con el día de hoy destacado y estado en tiempo real */}
            <div className="lg:col-span-6 rounded-2xl border border-[#A8873A]/50 bg-[#14321F] p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#A8873A]/30">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8873A]">
                      Horario · Europe/Madrid
                    </p>
                    <h3 className="font-display font-extrabold text-2xl text-[#F3EADC] mt-0.5">
                      Cuándo pasarte por aquí
                    </h3>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                        estado.abiertoAhora
                          ? 'bg-[#F3EADC] text-[#1F4A2E] border-[#F3EADC]'
                          : 'bg-[#C8382A]/20 text-[#F3EADC] border-[#C8382A]/70'
                      }`}
                    >
                      {estado.etiqueta}
                    </span>
                    <p className="text-[11px] text-[#F3EADC]/70 mt-1 tabular-nums">
                      Ahora en Bilbao: {estado.horaMadrid}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-[#A8873A]/20">
                  {HORARIO_SEMANAL.map((dia) => {
                    const esHoy = dia.dayIndex === estado.hoyIndex;
                    return (
                      <li
                        key={dia.dia}
                        className={`py-2.5 px-3 rounded-lg flex items-center justify-between text-sm ${
                          esHoy
                            ? 'bg-[#F3EADC]/12 border border-[#A8873A]/55 font-semibold text-[#F3EADC]'
                            : 'text-[#F3EADC]/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{dia.dia}</span>
                          {esHoy && (
                            <span className="text-[11px] uppercase tracking-wider text-[#A8873A] font-bold">
                              · Hoy
                            </span>
                          )}
                        </span>
                        <span
                          className={`tabular-nums ${
                            !dia.abierto ? 'text-[#C8382A] font-semibold' : ''
                          }`}
                        >
                          {dia.texto}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#A8873A]/30 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <span className="text-[#F3EADC]/70">Teléfono: </span>
                  <a
                    href={NEGOCIO.telefonoHref}
                    className="font-semibold text-[#F3EADC] hover:underline tabular-nums"
                  >
                    {NEGOCIO.telefono}
                  </a>
                </div>
                <a
                  href={NEGOCIO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#A8873A] hover:text-[#F3EADC] transition-colors"
                >
                  Instagram {NEGOCIO.instagramHandle} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
