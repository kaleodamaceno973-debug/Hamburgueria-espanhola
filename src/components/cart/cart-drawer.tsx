"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Store, Bike } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cart, cartCount, cartSubtotal, useCart } from "@/lib/client/cart-store";
import { PRICING } from "@/lib/constants";
import { cn, formatBRL } from "@/lib/utils";

export function CartDrawer() {
  const state = useCart();
  const router = useRouter();
  const count = cartCount(state.lines);
  const subtotal = cartSubtotal(state.lines);
  const missingForFree = PRICING.freeDeliveryFromCents - subtotal;
  const progress = Math.min(100, (subtotal / PRICING.freeDeliveryFromCents) * 100);

  return (
    <Sheet open={state.open} onOpenChange={cart.setOpen}>
      <SheetContent side="right" className="p-0">
        <LazyMotion features={domAnimation} strict>
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5 pr-16">
            <ShoppingBag className="size-5 text-primary" />
            <SheetTitle className="text-lg font-bold">Seu carrinho ({count})</SheetTitle>
          </div>
          <SheetDescription className="sr-only">Itens adicionados ao pedido</SheetDescription>

          {state.lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <m.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid size-20 place-items-center rounded-full bg-white/5">
                <ShoppingBag className="size-8 text-primary" />
              </m.div>
              <p className="text-lg font-semibold">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground">Que tal começar pelo nosso Classic Smash?</p>
              <Button asChild onClick={() => cart.setOpen(false)}>
                <Link href="/cardapio">Ver cardápio</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="px-6 pt-4">
                <div className="grid grid-cols-2 gap-1 rounded-full bg-white/5 p-1" role="radiogroup" aria-label="Tipo de pedido">
                  {(
                    [
                      { v: "DELIVERY", label: "Entrega", icon: Bike },
                      { v: "PICKUP", label: "Retirada", icon: Store },
                    ] as const
                  ).map(({ v, label, icon: Icon }) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={state.fulfillment === v}
                      onClick={() => cart.setFulfillment(v)}
                      className={cn(
                        "relative flex h-9 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
                        state.fulfillment === v ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {state.fulfillment === v && (
                        <m.span layoutId="fulfillment-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                      )}
                      <Icon className="relative size-4" />
                      <span className="relative">{label}</span>
                    </button>
                  ))}
                </div>
                {state.fulfillment === "DELIVERY" && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    {missingForFree > 0 ? (
                      <p>Faltam <b className="text-foreground">{formatBRL(missingForFree)}</b> para entrega grátis</p>
                    ) : (
                      <p className="font-semibold text-success">Você ganhou entrega grátis! 🎉</p>
                    )}
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <m.div className="h-full rounded-full bg-gradient-to-r from-gold to-flame" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                    </div>
                  </div>
                )}
              </div>

              <ul className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 py-5" data-lenis-prevent>
                <AnimatePresence initial={false}>
                  {state.lines.map((line) => (
                    <m.li
                      key={line.productId}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <Link href={`/cardapio/${line.slug}`} onClick={() => cart.setOpen(false)} className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        <Image src={line.image} alt={line.name} fill sizes="72px" className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold">{line.name}</p>
                          <button
                            type="button"
                            onClick={() => cart.remove(line.productId)}
                            className="grid size-8 shrink-0 place-items-center rounded-full text-foreground/50 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remover ${line.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary">{formatBRL(line.priceCents)}</p>
                        <div className="mt-auto flex items-center gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.productId, line.quantity - 1)}
                            className="grid size-8 place-items-center rounded-full border border-white/15 transition hover:border-primary"
                            aria-label={`Diminuir ${line.name}`}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.productId, line.quantity + 1)}
                            disabled={line.quantity >= 20}
                            className="grid size-8 place-items-center rounded-full border border-white/15 transition hover:border-primary disabled:opacity-40"
                            aria-label={`Aumentar ${line.name}`}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="space-y-4 border-t border-white/10 bg-black/30 px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-extrabold tabular-nums">{formatBRL(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxas e descontos são calculados com segurança no checkout.</p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    cart.setOpen(false);
                    router.push("/checkout");
                  }}
                >
                  Finalizar pedido · {formatBRL(subtotal)}
                </Button>
              </div>
            </>
          )}
        </LazyMotion>
      </SheetContent>
    </Sheet>
  );
}
