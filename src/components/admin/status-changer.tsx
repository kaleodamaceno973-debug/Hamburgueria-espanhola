"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/actions/admin";
import { ADMIN_TRANSITIONS, ORDER_STATUS_LABEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Botões com as próximas etapas permitidas (evita transições inválidas). */
export function StatusChanger({ orderId, status, compact = false }: { orderId: string; status: OrderStatus; compact?: boolean }) {
  const [pending, start] = useTransition();
  const next = ADMIN_TRANSITIONS[status];
  if (next.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
      {next.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={s === "CANCELLED" ? "ghost" : "secondary"}
          className={cn(s === "CANCELLED" && "text-red-400 hover:bg-red-500/10", compact && "h-8 px-3")}
          disabled={pending}
          onClick={() => {
            if (s === "CANCELLED" && !window.confirm("Cancelar este pedido? Se estiver pago, o valor será estornado.")) return;
            start(async () => {
              const r = await updateOrderStatusAction(orderId, s);
              if (r.ok) toast.success(`Pedido: ${ORDER_STATUS_LABEL[s]}`);
              else toast.error(r.message ?? "Não foi possível atualizar");
            });
          }}
        >
          {pending && <Loader2 className="size-3 animate-spin" />}
          {s === "CANCELLED" ? "Cancelar" : `→ ${ORDER_STATUS_LABEL[s]}`}
        </Button>
      ))}
    </div>
  );
}
