"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Atualiza a tela periodicamente (novos pedidos aparecem sozinhos). */
export function AutoRefresh({ seconds = 15 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) router.refresh();
    }, seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);
  return null;
}
