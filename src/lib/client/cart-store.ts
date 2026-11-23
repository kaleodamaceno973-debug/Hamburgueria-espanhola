"use client";

import { useSyncExternalStore } from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceCents: number; // apenas exibição — o servidor recalcula no checkout
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  fulfillment: "DELIVERY" | "PICKUP";
  open: boolean;
  bump: number; // incrementa a cada adição (microinteração do ícone)
};

const KEY = "smash-cart-v1";
const EMPTY: CartState = { lines: [], fulfillment: "DELIVERY", open: false, bump: 0 };

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CartState>;
      const lines = Array.isArray(parsed.lines)
        ? parsed.lines.filter(
            (l): l is CartLine =>
              !!l && typeof l.productId === "string" && typeof l.quantity === "number" && l.quantity > 0 && typeof l.priceCents === "number",
          )
        : [];
      state = { ...EMPTY, lines, fulfillment: parsed.fulfillment === "PICKUP" ? "PICKUP" : "DELIVERY" };
    }
  } catch {
    /* storage indisponível (modo privado) — segue sem persistir */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      hydrated = false;
      load();
      emit();
    }
  });
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ lines: state.lines, fulfillment: state.fulfillment }));
  } catch {
    /* ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

function set(next: Partial<CartState>, save = true) {
  state = { ...state, ...next };
  if (save) persist();
  emit();
}

export const cart = {
  add(item: Omit<CartLine, "quantity">, quantity = 1, openDrawer = true) {
    load();
    const existing = state.lines.find((l) => l.productId === item.productId);
    const lines = existing
      ? state.lines.map((l) => (l.productId === item.productId ? { ...l, ...item, quantity: Math.min(20, l.quantity + quantity) } : l))
      : [...state.lines, { ...item, quantity: Math.min(20, quantity) }];
    set({ lines, bump: state.bump + 1, open: openDrawer ? true : state.open });
  },
  setQuantity(productId: string, quantity: number) {
    load();
    const lines =
      quantity <= 0
        ? state.lines.filter((l) => l.productId !== productId)
        : state.lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(20, quantity) } : l));
    set({ lines });
  },
  remove(productId: string) {
    cart.setQuantity(productId, 0);
  },
  clear() {
    set({ lines: [] });
  },
  setFulfillment(fulfillment: CartState["fulfillment"]) {
    set({ fulfillment });
  },
  setOpen(open: boolean) {
    set({ open }, false);
  },
};

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((s, l) => s + l.quantity, 0);
}
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((s, l) => s + l.priceCents * l.quantity, 0);
}
