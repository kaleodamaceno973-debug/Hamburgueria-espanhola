"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChefHat, CreditCard, PackageCheck, Bike, Clock, XCircle, Store } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";

type Live = { status: OrderStatus; paymentStatus: string; events: { status: OrderStatus; note: string | null; createdAt: string }[] };

const ICONS: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  PENDING_PAYMENT: CreditCard,
  PAID: Check,
  PREPARING: ChefHat,
  READY: PackageCheck,
  OUT_FOR_DELIVERY: Bike,
  COMPLETED: Check,
  CANCELLED: XCircle,
};

/** Linha do tempo com atualização em tempo real (polling a cada 5s, pausa com aba oculta). */
export function OrderLive({ code, initial, fulfillment }: { code: string; initial: Live; fulfillment: "DELIVERY" | "PICKUP" }) {
  const [data, setData] = useState(initial);
  const [online, setOnline] = useState(true);
  const router = useRouter();
  const last = useRef(initial.status);

  useEffect(() => {
    if (data.status === "COMPLETED" || data.status === "CANCELLED") return;
    let timer = 0;
    let stopped = false;
    const tick = async () => {
      if (document.hidden) return schedule();
      try {
        const res = await fetch(`/api/orders/${code}`, { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as Live;
          setOnline(true);
          setData(json);
          if (json.status !== last.current) {
            last.current = json.status;
            router.refresh(); // atualiza ações disponíveis (cancelar, remarcar)
          }
        } else setOnline(false);
      } catch {
        setOnline(false);
      }
      schedule();
    };
    const schedule = () => {
      if (!stopped) timer = window.setTimeout(tick, 5000);
    };
    schedule();
    const onVis = () => !document.hidden && (window.clearTimeout(timer), tick());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [code, data.status, router]);

  const flow: OrderStatus[] =
    data.status === "CANCELLED"
      ? ["PENDING_PAYMENT", "CANCELLED"]
      : fulfillment === "DELIVERY"
        ? ["PENDING_PAYMENT", "PAID", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"]
        : ["PENDING_PAYMENT", "PAID", "PREPARING", "READY", "COMPLETED"];
  const currentIdx = flow.indexOf(data.status);
  const eventAt = (s: OrderStatus) => [...data.events].reverse().find((e) => e.status === s)?.createdAt;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Acompanhe seu pedido</h2>
        <span className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
          <span className={cn("size-2 rounded-full", online ? "animate-pulse bg-success" : "bg-red-500")} />
          {online ? "Ao vivo" : "Reconectando…"}
        </span>
      </div>
      <ol className="mt-6 space-y-0" aria-label="Status do pedido">
        {flow.map((s, i) => {
          const done = i < currentIdx || (i === currentIdx && (s === "COMPLETED" || s === "CANCELLED"));
          const current = i === currentIdx && !done;
          const Icon = s === "READY" && fulfillment === "PICKUP" ? Store : ICONS[s];
          const at = eventAt(s);
          return (
            <li key={s} className="relative flex gap-4 pb-6 last:pb-0" aria-current={current ? "step" : undefined}>
              {i < flow.length - 1 && (
                <span className={cn("absolute left-5 top-11 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 rounded", i < currentIdx ? "bg-primary" : "bg-white/10")} />
              )}
              <span
                className={cn(
                  "relative grid size-10 shrink-0 place-items-center rounded-full border-2 transition-colors duration-500",
                  s === "CANCELLED" && i === currentIdx
                    ? "border-red-500 bg-red-500/15 text-red-400"
                    : done
                      ? "border-primary bg-primary text-black"
                      : current
                        ? "border-primary text-primary"
                        : "border-white/15 text-foreground/30",
                )}
              >
                {current && <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary/50" />}
                <Icon className="size-4" />
              </span>
              <div className="pt-1.5">
                <p className={cn("font-bold", !done && !current && "text-foreground/40")}>
                  {s === "READY" && fulfillment === "PICKUP" ? "Pronto para retirada" : ORDER_STATUS_LABEL[s]}
                </p>
                {at ? (
                  <p className="text-xs text-muted-foreground">{formatDateTime(at)}</p>
                ) : current ? (
                  <p className="flex items-center gap-1 text-xs text-primary"><Clock className="size-3" /> em andamento</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
