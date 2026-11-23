"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Copy, CreditCard, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { simulatePaymentAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { cn, formatBRL } from "@/lib/utils";

/** QR "fake" determinístico (visual) — o pagamento demo não movimenta dinheiro. */
function FakeQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    const n = 25;
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < n * n; i++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      out.push((h >>> 16) % 2 === 0);
    }
    return { n, out };
  }, [seed]);
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= cells.n - 7 && y < 7) || (x < 7 && y >= cells.n - 7);
  return (
    <svg viewBox={`0 0 ${cells.n} ${cells.n}`} className="size-full" shapeRendering="crispEdges" role="img" aria-label="QR Code Pix (demonstração)">
      <rect width="100%" height="100%" fill="#fff" />
      {cells.out.map((on, i) => {
        const x = i % cells.n;
        const y = Math.floor(i / cells.n);
        if (finder(x, y)) return null;
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#0a0806" /> : null;
      })}
      {[
        [0, 0],
        [cells.n - 7, 0],
        [0, cells.n - 7],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#0a0806" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0a0806" />
        </g>
      ))}
    </svg>
  );
}

export function DemoPayment({ code, totalCents, method }: { code: string; totalCents: number; method: "PIX" | "CARD" }) {
  const [tab, setTab] = useState<"PIX" | "CARD">(method);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/30");
  const [cvc, setCvc] = useState("123");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136demo-smash-house-${code}5204000053039865406${(totalCents / 100).toFixed(2)}5802BR5911SMASH HOUSE6009SAO PAULO`;

  const pay = (withCard: boolean) =>
    start(async () => {
      setError(null);
      const res = await simulatePaymentAction(code, withCard ? card : undefined);
      if (res && !res.ok) {
        setError(res.error ?? "Pagamento não aprovado.");
        toast.error(res.error ?? "Pagamento não aprovado.");
      }
    });

  return (
    <div className="rounded-3xl border border-white/10 bg-[#120e0b] p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
        <span><b>Modo demonstração</b> — nenhuma cobrança real. O pagamento passa pelo mesmo webhook assinado do Stripe.</span>
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-white/5 p-1" role="tablist">
        {(["PIX", "CARD"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("flex h-10 items-center justify-center gap-2 rounded-full text-sm font-bold transition", tab === t ? "bg-primary text-black" : "text-foreground/70")}
          >
            {t === "PIX" ? <QrCode className="size-4" /> : <CreditCard className="size-4" />}
            {t === "PIX" ? "Pix" : "Cartão"}
          </button>
        ))}
      </div>

      {tab === "PIX" ? (
        <div className="mt-6 grid items-center gap-6 sm:grid-cols-[200px_1fr]">
          <div className="mx-auto size-48 overflow-hidden rounded-2xl border-4 border-white p-1 sm:size-full">
            <FakeQr seed={code} />
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código Pix. A confirmação é automática.</p>
            <div className="flex gap-2">
              <Input readOnly value={pixCode} aria-label="Pix copia e cola" className="font-mono text-xs" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Copiar código Pix"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(pixCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {
                    /* ignore */
                  }
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Button size="lg" className="w-full" onClick={() => pay(false)} disabled={pending} data-testid="simulate-pix">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Simular Pix recebido · {formatBRL(totalCents)}
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            pay(true);
          }}
        >
          <Field label="Número do cartão" htmlFor="card" className="sm:col-span-2" hint="Teste: 4242 4242 4242 4242 (aprova) · 4000 0000 0000 0002 (recusa)">
            <Input id="card" value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" autoComplete="cc-number" />
          </Field>
          <Field label="Validade" htmlFor="exp">
            <Input id="exp" value={exp} onChange={(e) => setExp(e.target.value)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" />
          </Field>
          <Field label="CVC" htmlFor="cvc">
            <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} inputMode="numeric" autoComplete="cc-csc" />
          </Field>
          <Button type="submit" size="lg" className="sm:col-span-2" disabled={pending} data-testid="pay-card">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Pagar {formatBRL(totalCents)}
          </Button>
        </form>
      )}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
