import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { LOCATIONS, ONLINE_ORDER_URL, WHATSAPP_NUMBER } from '../data/brand';
import { MENU_ITEMS, formatEuro } from '../data/menu';
import { useOrder } from '../context/OrderContext';

type DeliveryMode = 'recoger' | 'domicilio';
type PaymentMethod = 'Bizum' | 'Tarjeta' | 'Efectivo';

const MENU_MAP = new Map(MENU_ITEMS.map((i) => [i.id, i]));

export function CartDrawer() {
  const {
    cart,
    updateQty,
    removeEntry,
    clearCart,
    totalCount,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    selectedCity,
    setSelectedCity,
  } = useOrder();

  const [step, setStep] = useState<'cart' | 'checkout' | 'sent'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('recoger');
  const [address, setAddress] = useState('');
  const [floor, setFloor] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('Bizum');
  const [orderNote, setOrderNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderCode, setOrderCode] = useState('');

  const waLinkRef = useRef<HTMLAnchorElement>(null);

  const activeLocation = LOCATIONS.find((l) => l.id === selectedCity) ?? LOCATIONS[0];

  // Always recalculate itemized lines & total from canonical MENU_ITEMS
  const resolvedLines = useMemo(() => {
    return cart
      .map((entry) => {
        const item = MENU_MAP.get(entry.itemId);
        if (!item) return null;
        return {
          ...entry,
          item,
          lineTotal: Math.round(item.price * entry.quantity * 100) / 100,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart]);

  const recalculatedTotal = useMemo(() => {
    return (
      Math.round(resolvedLines.reduce((acc, l) => acc + l.lineTotal, 0) * 100) / 100
    );
  }, [resolvedLines]);

  const buildWhatsappMessage = (code: string) => {
    const linesText = resolvedLines
      .map((l) => {
        const noteStr = l.note ? ` (${l.note})` : '';
        return `${l.quantity}× ${l.item.name}${noteStr} — ${formatEuro(l.lineTotal)}`;
      })
      .join('\n');

    const deliveryLine =
      deliveryMode === 'recoger'
        ? `🏪 Recoger en: ${activeLocation.address}`
        : `🛵 A domicilio: ${address.trim()}${floor.trim() ? `, ${floor.trim()}` : ''}`;

    const parts = [
      `🐮 NUEVO PEDIDO #${code} · Baka Vieja ${activeLocation.city}`,
      '━━━━━━━━━━━━━━',
      linesText,
      '━━━━━━━━━━━━━━',
      `TOTAL: ${formatEuro(recalculatedTotal)}`,
      `👤 ${name.trim()} · 📞 ${phone.trim()}`,
      deliveryLine,
      `💳 Pago: ${payment}`,
    ];

    if (orderNote.trim()) {
      parts.push(`📝 Nota: ${orderNote.trim()}`);
    }

    return parts.join('\n');
  };

  const validateCheckout = () => {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Introduce tu nombre completo.';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      nextErrors.phone = 'Introduce un teléfono válido de al menos 9 dígitos.';
    }
    if (deliveryMode === 'domicilio' && address.trim().length < 5) {
      nextErrors.address = 'Indica la calle y el número para la entrega.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const cleanWaPhone = WHATSAPP_NUMBER.replace(/\D/g, '');
  const activeCode = orderCode || `BV${String(Math.floor(10 + Math.random() * 89))}`;
  const waUrl = `https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(
    buildWhatsappMessage(activeCode)
  )}`;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckout()) return;
    const code = `BV${String(Math.floor(10 + Math.random() * 89))}`;
    setOrderCode(code);
    setStep('sent');
    requestAnimationFrame(() => {
      waLinkRef.current?.click();
    });
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    if (step === 'sent') setStep('cart');
  };

  // Esc closes the drawer (it is a div role="dialog", not a native <dialog>)
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-white/15 bg-[#0b0b0c] text-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:border-[#FFB547]"
                aria-label="Volver al carrito"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-black uppercase tracking-wide text-white">
                {step === 'cart'
                  ? 'Tu pedido'
                  : step === 'checkout'
                    ? 'Pedido directo'
                    : 'Pedido listo'}
              </h2>
              <p className="text-xs text-white/50">
                Baka Vieja {activeLocation.city} · Sin comisiones
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/75 hover:border-[#FFB547] hover:text-white"
            aria-label="Cerrar carrito"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-5">
          {resolvedLines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-10 w-10 text-[#FFB547]/70" />
              <p className="font-display mt-4 text-xl font-bold uppercase text-white">
                Tu pedido está vacío
              </p>
              <p className="mt-2 max-w-xs text-sm text-white/60">
                Añade alguna burger, unos nachos míticos o un postre para empezar.
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#FFB547] px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#FFBC7D]"
              >
                Explorar la carta
              </button>
            </div>
          ) : step === 'cart' ? (
            <ul className="space-y-4">
              {resolvedLines.map((line, idx) => (
                <li
                  key={`${line.itemId}-${idx}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-black uppercase text-white">
                      {line.item.name}
                    </p>
                    {line.note && (
                      <p className="mt-1 text-xs text-[#FFBC7D]">Nota: {line.note}</p>
                    )}
                    <p className="mt-1 tabular-nums text-xs text-white/55">
                      {formatEuro(line.item.price)} / ud. · Precio orientativo
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-white/15 text-white/80 hover:border-[#FFB547]"
                        aria-label={`Restar ${line.item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center tabular-nums text-sm font-bold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-white/15 text-white/80 hover:border-[#FFB547]"
                        aria-label={`Sumar ${line.item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEntry(idx)}
                        className="ml-2 flex h-8 w-8 items-center justify-center rounded text-white/45 hover:text-red-400"
                        aria-label={`Eliminar ${line.item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-display tabular-nums text-sm font-black text-[#FFB547]">
                    {formatEuro(line.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
          ) : step === 'checkout' ? (
            <form id="bv-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* City Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Local Baka Vieja
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedCity(loc.id)}
                      className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                        selectedCity === loc.id
                          ? 'border-[#FFB547] bg-[#FFB547] text-black'
                          : 'border-white/15 bg-black text-white/75'
                      }`}
                    >
                      {loc.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery mode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Modo de entrega
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('recoger')}
                    className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                      deliveryMode === 'recoger'
                        ? 'border-[#FFB547] bg-[#FFB547] text-black'
                        : 'border-white/15 bg-black text-white/75'
                    }`}
                  >
                    Recoger en el local
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('domicilio')}
                    className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                      deliveryMode === 'domicilio'
                        ? 'border-[#FFB547] bg-[#FFB547] text-black'
                        : 'border-white/15 bg-black text-white/75'
                    }`}
                  >
                    A domicilio
                  </button>
                </div>
                {deliveryMode === 'recoger' && (
                  <p className="mt-2 text-xs text-white/60">
                    Recogida en: {activeLocation.address} ({activeLocation.city})
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="chk-name" className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Tu nombre
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((er) => ({ ...er, name: '' }));
                  }}
                  placeholder="Ej.: Mikel Etxebarria"
                  className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-black px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="chk-phone" className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Teléfono
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((er) => ({ ...er, phone: '' }));
                  }}
                  placeholder="Ej.: 600 123 456"
                  className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-black px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {/* Address if domicilio */}
              {deliveryMode === 'domicilio' && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="chk-addr" className="block text-xs font-bold uppercase tracking-wider text-white/65">
                      Dirección completa
                    </label>
                    <input
                      id="chk-addr"
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors((er) => ({ ...er, address: '' }));
                      }}
                      placeholder="Calle, número y portal"
                      className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-black px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="chk-floor" className="block text-xs font-bold uppercase tracking-wider text-white/65">
                      Piso / puerta (opcional)
                    </label>
                    <input
                      id="chk-floor"
                      type="text"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      placeholder="Ej.: 3º B"
                      className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-black px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Payment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Forma de pago
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['Bizum', 'Tarjeta', 'Efectivo'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPayment(method)}
                      className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                        payment === method
                          ? 'border-[#FFB547] bg-[#FFB547] text-black'
                          : 'border-white/15 bg-black text-white/75'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label htmlFor="chk-note" className="block text-xs font-bold uppercase tracking-wider text-white/65">
                  Nota adicional (opcional)
                </label>
                <textarea
                  id="chk-note"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Timbre, hora aproximada, alergias…"
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black px-3.5 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#FFB547] focus:outline-none"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 text-[#FFB547]">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <p className="font-display text-lg font-black uppercase text-white">
                  Ticket #{orderCode} generado
                </p>
              </div>
              <p className="text-sm text-white/75">
                Si WhatsApp no se ha abierto automáticamente, pulsa el botón inferior para enviarlo al local de{' '}
                <strong className="text-white">{activeLocation.city}</strong>.
              </p>
              <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black p-4 text-xs leading-relaxed text-white/80">
                {buildWhatsappMessage(orderCode)}
              </pre>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setStep('cart');
                  setIsCartOpen(false);
                }}
                className="w-full rounded-lg border border-white/15 py-2.5 text-xs font-semibold text-white/70 hover:text-white"
              >
                Vaciar pedido y volver a la carta
              </button>
            </div>
          )}
        </div>

        {/* Hidden anchor triggered on valid submit to avoid window.open */}
        <a
          ref={waLinkRef}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden"
          aria-hidden="true"
        >
          WhatsApp
        </a>

        {/* Drawer Footer */}
        {resolvedLines.length > 0 && (
          <div className="border-t border-white/10 bg-black px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Total ({totalCount} {totalCount === 1 ? 'artículo' : 'artículos'})
              </span>
              <span className="font-display tabular-nums text-2xl font-black text-[#FFB547]">
                {formatEuro(recalculatedTotal)}
              </span>
            </div>

            {step === 'cart' ? (
              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-5 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Pedir por WhatsApp</span>
                </button>
                <a
                  href={ONLINE_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 text-xs font-semibold text-white/75 transition-colors hover:border-white/35 hover:text-white"
                >
                  <span>Pedir en la web actual</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : step === 'checkout' ? (
              <div className="mt-4 space-y-2.5">
                <button
                  type="submit"
                  form="bv-checkout-form"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-5 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enviar pedido por WhatsApp</span>
                </button>
                <a
                  href={ONLINE_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 text-xs font-medium text-white/60 hover:text-white"
                >
                  <span>Pedir en la web actual (Ambigu)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <div className="mt-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FFB547] px-5 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBC7D]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Abrir WhatsApp ahora</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
