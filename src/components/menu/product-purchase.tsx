"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "./add-to-cart";
import { formatBRL } from "@/lib/utils";

export function ProductPurchase({ item }: { item: { productId: string; slug: string; name: string; image: string; priceCents: number } }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-13 items-center justify-between gap-2 rounded-full border border-white/15 px-2 sm:justify-start">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center rounded-full transition hover:bg-white/10" aria-label="Diminuir quantidade">
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center text-lg font-bold tabular-nums" aria-live="polite" aria-label={`Quantidade: ${qty}`}>{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid size-10 place-items-center rounded-full transition hover:bg-white/10" aria-label="Aumentar quantidade">
          <Plus className="size-4" />
        </button>
      </div>
      <AddToCartButton item={item} quantity={qty} size="lg" openDrawer label={`Adicionar · ${formatBRL(item.priceCents * qty)}`} className="flex-1" />
    </div>
  );
}
