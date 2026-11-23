"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cart, cartCount, useCart } from "@/lib/client/cart-store";

/** Ícone do carrinho: animação em CSS puro (sem JS de animação no carregamento inicial). */
export function CartButton() {
  const state = useCart();
  const count = cartCount(state.lines);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => cart.setOpen(true)}
      aria-label={`Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})`}
      className="relative"
    >
      <span key={state.bump} className={state.bump ? "animate-[cart-bump_0.5s_cubic-bezier(.3,1.6,.5,1)]" : undefined}>
        <ShoppingBag className="size-5" />
      </span>
      {count > 0 && (
        <span
          key={`b${state.bump}`}
          className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground animate-in zoom-in-50 duration-300"
        >
          {count}
        </span>
      )}
    </Button>
  );
}
