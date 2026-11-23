"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { notify as toast } from "@/lib/client/notify";
import { cart } from "@/lib/client/cart-store";
import { cn } from "@/lib/utils";

type Item = { productId: string; slug: string; name: string; image: string; priceCents: number };

export function AddToCartButton({
  item,
  quantity = 1,
  className,
  label = "Adicionar",
  size = "sm",
  openDrawer = false,
}: {
  item: Item;
  quantity?: number;
  className?: string;
  label?: string;
  size?: "sm" | "lg";
  openDrawer?: boolean;
}) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        cart.add(item, quantity, openDrawer);
        setAdded(true);
        if (!openDrawer) {
          toast.success(`${item.name} no carrinho`, {
            action: { label: "Ver carrinho", onClick: () => cart.setOpen(true) },
            duration: 2500,
          });
        }
        window.setTimeout(() => setAdded(false), 1400);
      }}
      aria-label={`${label}: ${item.name}`}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full font-bold transition-[background-color,transform,box-shadow] active:scale-95",
        size === "sm" ? "h-9 px-4 text-xs" : "h-13 px-8 text-base",
        added ? "bg-success text-black" : "bg-primary text-primary-foreground hover:bg-[#ff8c3a] hover:shadow-[0_8px_24px_-8px_rgb(255_122_26/0.8)]",
        className,
      )}
    >
      <span className={cn("flex items-center gap-1.5 transition-transform duration-300", added && "-translate-y-[150%]")}>
        {label} <Plus className="size-4" />
      </span>
      <span className={cn("absolute inset-0 flex items-center justify-center gap-1.5 transition-transform duration-300", added ? "translate-y-0" : "translate-y-[150%]")}>
        <Check className="size-4" /> Adicionado
      </span>
    </button>
  );
}
