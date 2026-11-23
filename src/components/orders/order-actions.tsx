"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CalendarClock, CreditCard, Loader2, XCircle } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { cancelOrderAction, rescheduleOrderAction, retryPaymentAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Slot = { iso: string; label: string; day: string };

export function OrderActions({
  code,
  canEdit,
  pendingPayment,
  provider,
  scheduled,
  slots,
}: {
  code: string;
  canEdit: boolean;
  pendingPayment: boolean;
  provider: "demo" | "stripe";
  scheduled: boolean;
  slots: Slot[];
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState<"cancel" | "reschedule" | null>(null);
  const [slot, setSlot] = useState("");

  if (!canEdit) return null;

  const days = slots.reduce<Record<string, Slot[]>>((acc, s) => ((acc[s.day] ??= []).push(s), acc), {});

  return (
    <div className="flex flex-wrap gap-3">
      {pendingPayment &&
        (provider === "demo" ? (
          <Button asChild size="lg">
            <Link href={`/pagamento/demo/${code}`}><CreditCard className="size-4" /> Pagar agora</Link>
          </Button>
        ) : (
          <Button size="lg" disabled={pending} onClick={() => start(async () => { const r = await retryPaymentAction(code); if (r && !r.ok) toast.error(r.error); })}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />} Pagar agora
          </Button>
        ))}

      <Dialog open={open === "reschedule"} onOpenChange={(o) => setOpen(o ? "reschedule" : null)}>
        <DialogTrigger asChild>
          <Button variant="outline"><CalendarClock className="size-4" /> {scheduled ? "Remarcar" : "Agendar horário"}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Escolha um novo horário</DialogTitle>
          <DialogDescription>Você pode remarcar até o pedido entrar em preparo.</DialogDescription>
          <div className="mt-5 max-h-[50vh] space-y-4 overflow-y-auto" data-lenis-prevent>
            {Object.entries(days).map(([day, list]) => (
              <div key={day}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{day}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <button
                      key={s.iso}
                      type="button"
                      onClick={() => setSlot(s.iso)}
                      aria-pressed={slot === s.iso}
                      className={cn("h-9 rounded-full border px-3 text-sm font-semibold tabular-nums", slot === s.iso ? "border-primary bg-primary text-black" : "border-white/15")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-6 w-full"
            disabled={!slot || pending}
            onClick={() =>
              start(async () => {
                const r = await rescheduleOrderAction(code, slot);
                if (r.ok) {
                  toast.success("Horário atualizado!");
                  setOpen(null);
                } else toast.error(r.error);
              })
            }
          >
            {pending && <Loader2 className="size-4 animate-spin" />} Confirmar novo horário
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "cancel"} onOpenChange={(o) => setOpen(o ? "cancel" : null)}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300"><XCircle className="size-4" /> Cancelar pedido</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Cancelar este pedido?</DialogTitle>
          <DialogDescription>
            {pendingPayment ? "Nenhuma cobrança foi feita." : "O valor pago será estornado integralmente para o mesmo meio de pagamento."}
          </DialogDescription>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Manter pedido</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await cancelOrderAction(code);
                  if (r.ok) {
                    toast.success("Pedido cancelado.");
                    setOpen(null);
                  } else toast.error(r.error);
                })
              }
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Sim, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
