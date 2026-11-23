"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Bike, CalendarClock, CreditCard, Loader2, Lock, QrCode, ShoppingBag, Store, Tag, Zap } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { cart, useCart } from "@/lib/client/cart-store";
import { useHydrated } from "@/lib/client/hooks";
import { checkoutSchema, fieldErrors } from "@/lib/validation";
import { placeOrderAction, quoteAction } from "@/actions/checkout";
import type { Quote } from "@/server/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatBRL } from "@/lib/utils";
import { PRICING } from "@/lib/constants";

type Defaults = {
  name: string;
  phone: string;
  address: { street: string; number: string; district: string; city: string; extra: string };
};
type Slot = { iso: string; label: string; day: string };

function Choice({
  active,
  onClick,
  icon: Icon,
  title,
  text,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
        active ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/25",
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", active ? "bg-primary text-black" : "bg-white/5 text-foreground/70")}>
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-xs text-muted-foreground">{text}</span>
      </span>
    </button>
  );
}

export function CheckoutForm({ defaults, slots, provider }: { defaults: Defaults; slots: Slot[]; provider: "demo" | "stripe" }) {
  const state = useCart();
  const router = useRouter();
  const hydrated = useHydrated();
  const [name, setName] = useState(defaults.name);
  const [phone, setPhone] = useState(defaults.phone);
  const [address, setAddress] = useState(defaults.address);
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"PIX" | "CARD">("PIX");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [slot, setSlot] = useState(slots[0]?.iso ?? "");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | undefined>();
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoting, startQuote] = useTransition();
  const [submitting, startSubmit] = useTransition();

  const items = useMemo(() => state.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })), [state.lines]);
  const itemsKey = JSON.stringify(items);

  // Cotação SEMPRE vinda do servidor.
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    const id = window.setTimeout(() => {
      startQuote(async () => {
        const res = await quoteAction({ items, fulfillment: state.fulfillment, couponCode: coupon });
        if (res.ok) {
          setQuote(res.quote);
          setQuoteError(null);
          if (res.quote.unavailable.length) {
            res.quote.unavailable.forEach((id) => cart.remove(id));
            toast.warning("Removemos itens que ficaram indisponíveis.");
          }
        } else setQuoteError(res.error);
      });
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, itemsKey, state.fulfillment, coupon]);

  const groupedSlots = useMemo(() => {
    const g: Record<string, Slot[]> = {};
    for (const s of slots) (g[s.day] ??= []).push(s);
    return g;
  }, [slots]);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (state.lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-6" />}
        title="Seu carrinho está vazio"
        description="Escolha seus burgers favoritos e volte aqui para finalizar."
        action={<Button asChild><Link href="/cardapio">Ver cardápio</Link></Button>}
      />
    );
  }

  const submit = () => {
    const payload = {
      items,
      fulfillment: state.fulfillment,
      paymentMethod: payment,
      couponCode: coupon,
      name,
      phone,
      address: state.fulfillment === "DELIVERY" ? address : undefined,
      notes,
      scheduledFor: when === "later" ? slot : "",
      acceptTerms: accept as true,
    };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      toast.error("Revise os campos destacados.");
      const first = Object.keys(errs)[0];
      document.getElementById(first === "acceptTerms" ? "accept" : first.replace(".", "-"))?.focus();
      return;
    }
    setErrors({});
    startSubmit(async () => {
      const res = await placeOrderAction(payload);
      if (!res.ok) {
        if (res.errors) setErrors(res.errors);
        if (res.errors?.couponCode) setCoupon(undefined);
        toast.error(res.error ?? res.errors?.couponCode ?? "Não foi possível finalizar.");
        return;
      }
      cart.clear();
      if (res.external) window.location.assign(res.redirectUrl);
      else router.push(res.redirectUrl);
    });
  };

  const err = (k: string) => errors[k];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
      <div className="space-y-8">
        {/* 1. Recebimento */}
        <section aria-labelledby="s1" className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
          <h2 id="s1" className="text-lg font-extrabold"><span className="mr-2 text-primary">01</span>Como você quer receber?</h2>
          <div role="radiogroup" className="mt-4 grid gap-3 sm:grid-cols-2">
            <Choice active={state.fulfillment === "DELIVERY"} onClick={() => cart.setFulfillment("DELIVERY")} icon={Bike} title="Entrega" text="30–45 min · grátis acima de R$ 80" />
            <Choice active={state.fulfillment === "PICKUP"} onClick={() => cart.setFulfillment("PICKUP")} icon={Store} title="Retirada" text="Sem taxa · pronto em ~20 min" />
          </div>

          <div role="radiogroup" aria-label="Quando" className="mt-5 grid gap-3 sm:grid-cols-2">
            <Choice active={when === "now"} onClick={() => setWhen("now")} icon={Zap} title="O quanto antes" text="Começamos assim que o pagamento cair" />
            <Choice active={when === "later"} onClick={() => setWhen("later")} icon={CalendarClock} title="Agendar" text="Escolha dia e horário" />
          </div>
          {when === "later" && (
            <div className="mt-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2">
              {slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem horários disponíveis no momento.</p>
              ) : (
                Object.entries(groupedSlots).map(([day, list]) => (
                  <div key={day}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{day}</p>
                    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" id="scheduledFor">
                      {list.map((s) => (
                        <button
                          key={s.iso}
                          type="button"
                          onClick={() => setSlot(s.iso)}
                          aria-pressed={slot === s.iso}
                          className={cn(
                            "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold tabular-nums transition",
                            slot === s.iso ? "border-primary bg-primary text-black" : "border-white/15 hover:border-white/35",
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
              {err("scheduledFor") && <p role="alert" className="text-xs text-red-400">{err("scheduledFor")}</p>}
            </div>
          )}
        </section>

        {/* 2. Dados */}
        <section aria-labelledby="s2" className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
          <h2 id="s2" className="text-lg font-extrabold"><span className="mr-2 text-primary">02</span>Seus dados</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nome" htmlFor="name" error={err("name")}>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!err("name")} />
            </Field>
            <Field label="Celular (WhatsApp)" htmlFor="phone" error={err("phone")}>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" aria-invalid={!!err("phone")} />
            </Field>
          </div>
          {state.fulfillment === "DELIVERY" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-6 animate-in fade-in-0">
              <Field label="Rua" htmlFor="address-street" error={err("address.street") ?? err("address")} className="sm:col-span-4">
                <Input id="address-street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} autoComplete="address-line1" aria-invalid={!!err("address.street")} />
              </Field>
              <Field label="Número" htmlFor="address-number" error={err("address.number")} className="sm:col-span-2">
                <Input id="address-number" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} inputMode="numeric" aria-invalid={!!err("address.number")} />
              </Field>
              <Field label="Bairro" htmlFor="address-district" error={err("address.district")} className="sm:col-span-3">
                <Input id="address-district" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} aria-invalid={!!err("address.district")} />
              </Field>
              <Field label="Cidade" htmlFor="address-city" error={err("address.city")} className="sm:col-span-3">
                <Input id="address-city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} autoComplete="address-level2" aria-invalid={!!err("address.city")} />
              </Field>
              <Field label="Complemento (opcional)" htmlFor="address-extra" className="sm:col-span-6">
                <Input id="address-extra" value={address.extra} onChange={(e) => setAddress({ ...address, extra: e.target.value })} autoComplete="address-line2" />
              </Field>
            </div>
          )}
          <Field label="Observações (opcional)" htmlFor="notes" className="mt-4">
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} placeholder="Ex.: sem cebola, ponto da carne, interfone…" />
          </Field>
        </section>

        {/* 3. Pagamento */}
        <section aria-labelledby="s3" className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
          <h2 id="s3" className="text-lg font-extrabold"><span className="mr-2 text-primary">03</span>Pagamento</h2>
          <div role="radiogroup" className="mt-4 grid gap-3 sm:grid-cols-2">
            <Choice active={payment === "PIX"} onClick={() => setPayment("PIX")} icon={QrCode} title="Pix" text="Aprovação na hora" />
            <Choice active={payment === "CARD"} onClick={() => setPayment("CARD")} icon={CreditCard} title="Cartão de crédito" text="Visa, Master, Elo, Amex" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-success" />
            {provider === "stripe" ? "Pagamento processado com segurança pelo Stripe." : "Ambiente de demonstração: nenhuma cobrança real será feita."}
          </p>
        </section>
      </div>

      {/* Resumo */}
      <aside aria-labelledby="summary" className="rounded-3xl border border-white/10 bg-[#120e0b] p-5 sm:p-7 lg:sticky lg:top-32">
        <h2 id="summary" className="text-lg font-extrabold">Resumo do pedido</h2>
        <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
          {state.lines.map((l) => {
            const ql = quote?.lines.find((x) => x.productId === l.productId);
            return (
              <li key={l.productId} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                  <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                  <span className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-black">{l.quantity}</span>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold">{l.name}</p>
                <p className="text-sm font-bold tabular-nums">{ql ? formatBRL(ql.totalCents) : <Skeleton className="h-4 w-14" />}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 border-t border-white/10 pt-5">
          <label htmlFor="couponCode" className="text-sm font-medium">Cupom de desconto</label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="couponCode" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="PRIMEIRA20" className="pl-9 uppercase" aria-invalid={!!err("couponCode")} />
            </div>
            <Button type="button" variant="secondary" onClick={() => { setErrors((e) => ({ ...e, couponCode: "" })); setCoupon(couponInput.trim() || undefined); }} disabled={quoting}>
              Aplicar
            </Button>
          </div>
          {quote?.coupon && (
            <p role="status" className={cn("mt-2 text-xs font-semibold", quote.coupon.valid ? "text-success" : "text-red-400")}>
              {quote.coupon.valid ? `✓ ${quote.coupon.message}` : quote.coupon.message}
            </p>
          )}
          {err("couponCode") && <p className="mt-2 text-xs text-red-400">{err("couponCode")}</p>}
        </div>

        <dl className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm" aria-busy={quoting}>
          {quoteError && <p className="text-red-400">{quoteError}</p>}
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{quote ? formatBRL(quote.subtotalCents) : "—"}</dd></div>
          {!!quote?.discountCents && (
            <div className="flex justify-between text-success"><dt>Desconto</dt><dd className="tabular-nums">− {formatBRL(quote.discountCents)}</dd></div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{state.fulfillment === "DELIVERY" ? "Entrega" : "Retirada"}</dt>
            <dd className="tabular-nums">{quote ? (quote.deliveryFeeCents ? formatBRL(quote.deliveryFeeCents) : "Grátis") : "—"}</dd>
          </div>
          <div className="flex items-end justify-between border-t border-white/10 pt-3">
            <dt className="font-bold">Total</dt>
            <dd className="font-display text-3xl text-gold tabular-nums">
              {quote ? formatBRL(quote.totalCents) : "—"}
              {quoting && <Loader2 className="ml-2 inline size-4 animate-spin text-muted-foreground" />}
            </dd>
          </div>
        </dl>

        <label className="mt-5 flex items-start gap-3 text-xs text-muted-foreground">
          <input id="accept" type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#ff7a1a]" aria-invalid={!!err("acceptTerms")} />
          <span>
            Concordo com os <Link href="/termos" className="text-primary hover:underline">Termos</Link> e a{" "}
            <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
          </span>
        </label>
        {err("acceptTerms") && <p role="alert" className="mt-1 text-xs text-red-400">{err("acceptTerms")}</p>}

        {quote && quote.subtotalCents < PRICING.minOrderCents && (
          <p role="status" className="mt-4 rounded-xl bg-accent/10 px-3 py-2 text-xs text-accent">
            Pedido mínimo de {formatBRL(PRICING.minOrderCents)} — faltam {formatBRL(PRICING.minOrderCents - quote.subtotalCents)}.
          </p>
        )}
        <Button size="lg" className="mt-5 w-full" onClick={submit} disabled={submitting || quoting || !quote || quote.subtotalCents < PRICING.minOrderCents}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          {submitting ? "Processando…" : `Pagar ${quote ? formatBRL(quote.totalCents) : ""}`}
        </Button>
      </aside>
    </div>
  );
}
