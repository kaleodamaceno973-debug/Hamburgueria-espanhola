"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { deleteProductAction, toggleProductAction } from "@/actions/admin";
import { Switch } from "@/components/ui/switch";

export function ProductRowActions({ id, name, available }: { id: string; name: string; available: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={available}
        disabled={pending}
        aria-label={`${name} disponível`}
        onCheckedChange={(v) => start(async () => { await toggleProductAction(id, v); toast.success(v ? "Produto visível" : "Produto oculto"); })}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Excluir "${name}"? Pedidos antigos continuam com o histórico.`)) return;
          start(async () => { await deleteProductAction(id); toast.success("Produto excluído"); });
        }}
        className="grid size-8 place-items-center rounded-full text-foreground/50 hover:bg-red-500/10 hover:text-red-400"
        aria-label={`Excluir ${name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
