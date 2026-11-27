import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { calcularPrecioUnitario } from '../data/carta';
import {
  HORARIO_SEMANAL,
  NEGOCIO,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  formatEuro,
  getEstadoHorarioMadrid,
} from '../data/negocio';
import { CartItem, useCart } from './CartContext';

interface CartDrawerProps {
  onDialogToggle?: (open: boolean) => void;
}

type TipoEntrega = 'recoger' | 'comer' | 'domicilio';
type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Bizum';
type MomentoPedido = 'ahora' | 'programado';

interface FormErrors {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  horaProgramada?: string;
}

function generateOrderCode(): string {
  const num = Math.floor(10 + Math.random() * 89);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter = chars[Math.floor(Math.random() * chars.length)];
  return `JY${num}${letter}`;
}

function formatCartItemLine(item: CartItem): string {
  const unit = calcularPrecioUnitario(item.productoId, item.opciones);
  const lineTotal = formatEuro(unit * item.cantidad);
  const details: string[] = [];
  if (item.opciones.base) details.push(`base: ${item.opciones.base.toLowerCase()}`);
  if (item.opciones.sabor) details.push(`sabor: ${item.opciones.sabor.toLowerCase()}`);
  const extraPatatas = item.opciones.conPatatas ? ' + patatas crujientes' : '';
  const detailStr = details.length > 0 ? ` (${details.join(', ')})` : '';
  const notaStr = item.nota ? ` [Nota: ${item.nota}]` : '';
  return `${item.cantidad}× ${item.nombre}${extraPatatas}${detailStr} — ${lineTotal}${notaStr}`;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onDialogToggle }) => {
  const { items, totalPrecio, isCartOpen, closeCart, updateQty, removeItem, clearCart } =
    useCart();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [step, setStep] = useState<'cart' | 'checkout' | 'sent'>('cart');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('recoger');
  const [direccion, setDireccion] = useState('');
  const [pago, setPago] = useState<MetodoPago>('Bizum');
  const [momento, setMomento] = useState<MomentoPedido>('ahora');
  const [horaProgramada, setHoraProgramada] = useState('');
  const [notaGeneral, setNotaGeneral] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [preparedOrder, setPreparedOrder] = useState<{
    code: string;
    message: string;
    waUrl: string;
  } | null>(null);

  const estadoHorario = useMemo(() => getEstadoHorarioMadrid(), [isCartOpen]);
  const infoHoy = useMemo(
    () => HORARIO_SEMANAL.find((d) => d.dayIndex === estadoHorario.hoyIndex) ?? HORARIO_SEMANAL[0],
    [estadoHorario.hoyIndex]
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (isCartOpen) {
      if (items.length === 0 && step === 'checkout') {
        setStep('cart');
      }
      if (!dlg.open) {
        dlg.showModal();
        onDialogToggle?.(true);
      }
    } else if (dlg.open) {
      dlg.close();
      onDialogToggle?.(false);
    }
  }, [isCartOpen, items.length, step, onDialogToggle]);

  const handleClose = () => {
    if (step === 'sent') {
      setStep('cart');
      setPreparedOrder(null);
    }
    closeCart();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const recalcTotal = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + calcularPrecioUnitario(it.productoId, it.opciones) * it.cantidad,
        0
      ),
    [items]
  );

  const validateCheckout = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (nombre.trim().length < 2) {
      nextErrors.nombre = 'Introduce tu nombre para preparar el pedido.';
    }
    const digits = telefono.replace(/\D/g, '');
    if (digits.length < 9) {
      nextErrors.telefono = 'Introduce un teléfono de contacto válido (mínimo 9 dígitos).';
    }
    if (tipoEntrega === 'domicilio' && direccion.trim().length < 6) {
      nextErrors.direccion = 'Indica la calle, número y piso en Bilbao.';
    }

    if (momento === 'ahora' && !estadoHorario.abiertoAhora) {
      nextErrors.horaProgramada =
        estadoHorario.hoyIndex === 2
          ? 'Los martes cerramos por descanso. Elige «Más tarde» para otro día u horario.'
          : `Ahora estamos cerrados (${infoHoy.texto}). Selecciona «Más tarde» dentro de nuestro horario.`;
    }

    if (momento === 'programado') {
      if (!horaProgramada.trim()) {
        nextErrors.horaProgramada = 'Indica la hora a la que quieres tu pedido.';
      } else if (!/^\d{1,2}:\d{2}$/.test(horaProgramada.trim())) {
        nextErrors.horaProgramada = 'Usa formato 24 h (por ejemplo, 20:30).';
      } else {
        const [hh, mm] = horaProgramada.trim().split(':').map(Number);
        const mins = hh * 60 + mm;
        if (hh > 23 || mm > 59) {
          nextErrors.horaProgramada = 'Hora no válida.';
        } else if (!infoHoy.abierto) {
          nextErrors.horaProgramada =
            'Hoy martes el bar permanece cerrado. Indícanos en la nota para qué día lo quieres.';
        } else if (
          infoHoy.aperturaMin !== undefined &&
          infoHoy.cierreMin !== undefined &&
          (mins < infoHoy.aperturaMin || mins >= infoHoy.cierreMin)
        ) {
          nextErrors.horaProgramada = `Fuera de horario de hoy (${infoHoy.texto}).`;
        }
      }
    }

    return nextErrors;
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckout();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const code = generateOrderCode();
    const lines = items.map(formatCartItemLine);
    const totalVerified = formatEuro(recalcTotal);

    const deliveryLine =
      tipoEntrega === 'recoger'
        ? `🏪 Recoger en: ${NEGOCIO.calle}`
        : tipoEntrega === 'comer'
        ? `🍽️ Comer aquí: ${NEGOCIO.calle}`
        : `🛵 A domicilio: ${direccion.trim()} (Bilbao)`;

    const horaText =
      momento === 'ahora' ? 'lo antes posible' : `${horaProgramada.trim()} h`;

    const msgParts = [
      `🐙 NUEVO PEDIDO #${code} · JEYMA`,
      '━━━━━━━━━━━━━━',
      ...lines,
      '━━━━━━━━━━━━━━',
      `TOTAL: ${totalVerified}`,
      `👤 ${nombre.trim()} · 📞 ${telefono.trim()}`,
      deliveryLine,
      `🕘 Hora: ${horaText}`,
      `💳 Pago: ${pago}`,
    ];

    if (notaGeneral.trim()) {
      msgParts.push(`📝 Nota: ${notaGeneral.trim()}`);
    }

    const message = msgParts.join('\n');
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setPreparedOrder({ code, message, waUrl });
    setStep('sent');
  };

  return (
    <dialog
      ref={dialogRef}
      className="jeyma-dialog"
      aria-labelledby="cart-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
    >
      <div
        data-lenis-prevent
        className="bg-[#FAF5EC] text-[#1F4A2E] rounded-t-2xl md:rounded-2xl border border-[#A8873A] shadow-2xl max-h-[90svh] flex flex-col overflow-hidden"
      >
        {/* Cabecera */}
        <div className="px-5 py-4 bg-[#1F4A2E] text-[#F3EADC] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-[#F3EADC]/10 text-[#F3EADC] cursor-pointer"
                aria-label="Volver al resumen del pedido"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 id="cart-dialog-title" className="font-display font-bold text-xl leading-tight">
                {step === 'cart'
                  ? 'Tu pedido'
                  : step === 'checkout'
                  ? 'Pedido directo, sin comisiones'
                  : `Pedido #${preparedOrder?.code} listo`}
              </h2>
              <p className="text-xs text-[#F3EADC]/75">
                {step === 'checkout'
                  ? `Envío directo por WhatsApp demo (${WHATSAPP_DISPLAY})`
                  : `${NEGOCIO.calle} · Bilbao`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-[#F3EADC]/10 flex items-center justify-center text-[#F3EADC] cursor-pointer"
            aria-label="Cerrar tu pedido"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 overflow-y-auto flex-1">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#A8873A] mb-3" aria-hidden="true" />
                  <p className="font-display text-xl font-bold text-[#1F4A2E]">
                    Tu pedido está vacío
                  </p>
                  <p className="mt-1.5 text-sm text-[#5C4930] max-w-xs mx-auto">
                    Añade unas rabas, unas Baserritarras o una Smash Fat Burger de la carta.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1F4A2E] text-[#F3EADC] text-sm font-semibold cursor-pointer"
                  >
                    Ver la carta
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#5C4930]/15">
                  {items.map((item) => {
                    const unit = calcularPrecioUnitario(item.productoId, item.opciones);
                    return (
                      <li key={item.key} className="py-3.5 flex items-start gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg object-cover bg-[#0b130e] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display font-bold text-base text-[#1F4A2E] leading-snug">
                              {item.nombre}
                            </p>
                            <span className="font-bold text-sm tabular-nums text-[#1F4A2E] shrink-0">
                              {formatEuro(unit * item.cantidad)}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-[#5C4930] space-y-0.5">
                            {item.opciones.base && <p>Base: {item.opciones.base}</p>}
                            {item.opciones.sabor && <p>Sabor: {item.opciones.sabor}</p>}
                            {item.opciones.conPatatas && <p>+ Patatas crujientes (+1,00 €)</p>}
                            {item.nota && <p className="italic">Nota: {item.nota}</p>}
                          </div>

                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="inline-flex items-center border border-[#1F4A2E]/25 rounded-lg bg-[#F3EADC]/70">
                              <button
                                type="button"
                                onClick={() => updateQty(item.key, -1)}
                                className="w-9 h-9 flex items-center justify-center text-[#1F4A2E] cursor-pointer"
                                aria-label={`Quitar una unidad de ${item.nombre}`}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold tabular-nums">
                                {item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.key, 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#1F4A2E] cursor-pointer"
                                aria-label={`Añadir otra unidad de ${item.nombre}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              className="p-2 text-[#5C4930]/75 hover:text-[#C8382A] cursor-pointer"
                              aria-label={`Eliminar ${item.nombre}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="jeyma-checkout-form" onSubmit={handleSubmitWhatsApp} className="space-y-4">
              {estadoHorario.hoyIndex === 2 && (
                <div className="p-3 rounded-xl bg-[#C8382A]/10 border border-[#C8382A]/40 text-xs sm:text-sm text-[#7a1e15]">
                  Hoy martes el local está cerrado por descanso. Puedes dejar el pedido programado
                  indicando el día en la nota.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="ck-nombre" className="block text-xs font-bold text-[#5C4930] mb-1">
                    Nombre *
                  </label>
                  <input
                    id="ck-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#5C4930]/30 text-base text-[#1F4A2E] focus:outline-none focus:border-[#1F4A2E]"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-xs text-[#C8382A] font-medium">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ck-tel" className="block text-xs font-bold text-[#5C4930] mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="ck-tel"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="600 000 000"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#5C4930]/30 text-base text-[#1F4A2E] focus:outline-none focus:border-[#1F4A2E]"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-xs text-[#C8382A] font-medium">{errors.telefono}</p>
                  )}
                </div>
              </div>

              {/* Tipo de entrega */}
              <div>
                <p className="text-xs font-bold text-[#5C4930] mb-1.5">¿Cómo lo quieres?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'recoger', label: 'Recoger en el bar' },
                    { id: 'comer', label: 'Comer aquí' },
                    { id: 'domicilio', label: 'A domicilio' },
                  ].map((op) => {
                    const active = tipoEntrega === op.id;
                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setTipoEntrega(op.id as TipoEntrega)}
                        className={`min-h-[44px] px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                            : 'bg-white/80 text-[#1F4A2E] border-[#5C4930]/25'
                        }`}
                      >
                        {op.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {tipoEntrega === 'domicilio' && (
                <div>
                  <label htmlFor="ck-dir" className="block text-xs font-bold text-[#5C4930] mb-1">
                    Dirección en Bilbao *
                  </label>
                  <input
                    id="ck-dir"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle, portal y piso (solo Bilbao)"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#5C4930]/30 text-base text-[#1F4A2E] focus:outline-none focus:border-[#1F4A2E]"
                  />
                  {errors.direccion && (
                    <p className="mt-1 text-xs text-[#C8382A] font-medium">{errors.direccion}</p>
                  )}
                </div>
              )}

              {/* Hora */}
              <div>
                <p className="text-xs font-bold text-[#5C4930] mb-1.5">
                  Hora ({estadoHorario.detalleHoy})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ahora', label: 'Lo antes posible' },
                    { id: 'programado', label: 'Más tarde' },
                  ].map((op) => {
                    const active = momento === op.id;
                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => {
                          setMomento(op.id as MomentoPedido);
                          setErrors((prev) => ({ ...prev, horaProgramada: undefined }));
                        }}
                        className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
                          active
                            ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                            : 'bg-white/80 text-[#1F4A2E] border-[#5C4930]/25'
                        }`}
                      >
                        {op.label}
                      </button>
                    );
                  })}
                </div>

                {momento === 'programado' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={horaProgramada}
                      onChange={(e) => setHoraProgramada(e.target.value)}
                      placeholder="Ej. 20:30"
                      aria-label="Hora programada en formato 24 horas"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#5C4930]/30 text-base text-[#1F4A2E] focus:outline-none focus:border-[#1F4A2E]"
                    />
                  </div>
                )}

                {errors.horaProgramada && (
                  <p className="mt-1 text-xs text-[#C8382A] font-medium">{errors.horaProgramada}</p>
                )}
              </div>

              {/* Pago */}
              <div>
                <p className="text-xs font-bold text-[#5C4930] mb-1.5">Forma de pago</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['Bizum', 'Tarjeta', 'Efectivo'] as const).map((m) => {
                    const active = pago === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPago(m)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
                          active
                            ? 'bg-[#1F4A2E] text-[#F3EADC] border-[#1F4A2E]'
                            : 'bg-white/80 text-[#1F4A2E] border-[#5C4930]/25'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="ck-nota" className="block text-xs font-bold text-[#5C4930] mb-1">
                  Nota adicional (opcional)
                </label>
                <input
                  id="ck-nota"
                  type="text"
                  maxLength={140}
                  value={notaGeneral}
                  onChange={(e) => setNotaGeneral(e.target.value)}
                  placeholder="Cubiertos, alergias, portal..."
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#5C4930]/30 text-base text-[#1F4A2E] focus:outline-none focus:border-[#1F4A2E]"
                />
              </div>
            </form>
          )}

          {step === 'sent' && preparedOrder && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1F4A2E]/10 border border-[#1F4A2E]/25">
                <CheckCircle2 className="w-5 h-5 text-[#1F4A2E] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-[#1F4A2E]">
                  <p className="font-bold">Mensaje generado con total verificado</p>
                  <p className="text-xs text-[#5C4930] mt-0.5">
                    Pulsa el botón inferior para abrir WhatsApp (app o Web) con tu pedido listo.
                  </p>
                </div>
              </div>

              <pre className="p-3.5 rounded-xl bg-white border border-[#5C4930]/25 text-xs text-[#1F4A2E] whitespace-pre-wrap font-mono leading-relaxed">
                {preparedOrder.message}
              </pre>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={preparedOrder.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => clearCart()}
                  className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>Abrir WhatsApp y enviar</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="min-h-[48px] px-4 py-3 rounded-xl border border-[#5C4930]/35 text-[#1F4A2E] text-sm font-semibold cursor-pointer"
                >
                  Editar datos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pie del drawer */}
        {items.length > 0 && step !== 'sent' && (
          <div className="p-4 sm:px-5 bg-[#F3EADC] border-t border-[#A8873A]/45 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#5C4930]">Total (IVA incl.)</span>
              <span className="font-display font-extrabold text-2xl text-[#1F4A2E] tabular-nums">
                {formatEuro(totalPrecio)}
              </span>
            </div>

            {step === 'cart' ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={clearCart}
                  className="min-h-[46px] px-4 py-2 rounded-xl border border-[#5C4930]/30 text-xs sm:text-sm font-semibold text-[#5C4930] hover:text-[#1F4A2E] cursor-pointer"
                >
                  Vaciar
                </button>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] font-semibold text-sm sm:text-base cursor-pointer"
                >
                  Continuar por WhatsApp
                </button>
              </div>
            ) : (
              <button
                type="submit"
                form="jeyma-checkout-form"
                className="w-full min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1F4A2E] text-[#F3EADC] hover:bg-[#14321F] font-semibold text-sm sm:text-base cursor-pointer"
              >
                Generar pedido por WhatsApp · {formatEuro(recalcTotal)}
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};
