"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useCart } from "@/lib/client/cart-store";

const CartDrawer = dynamic(() => import("./cart-drawer").then((m) => m.CartDrawer), { ssr: false });

/** Só baixa o carrinho (Radix + Framer Motion) quando ele é aberto pela primeira vez. */
export function CartDrawerLazy() {
  const { open } = useCart();
  const [opened, setOpened] = useState(false);
  if (open && !opened) setOpened(true);
  return opened ? <CartDrawer /> : null;
}
