"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "smash-cookie-consent";

/** Banner LGPD: guarda a escolha do usuário (essenciais x todos). */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      /* modo privado */
    }
    if (stored) return;
    const id = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ value, at: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl sm:left-5 sm:right-auto sm:mx-0 sm:max-w-md rounded-2xl border border-white/10 bg-[#15110d]/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-6 duration-500 sm:bottom-5 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-foreground/80">
          Usamos cookies essenciais para login e carrinho e, com sua permissão, cookies de desempenho. Saiba mais na{" "}
          <Link href="/privacidade" className="font-semibold text-primary underline-offset-2 hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" size="sm" onClick={() => choose("essential")}>Só essenciais</Button>
        <Button size="sm" onClick={() => choose("all")}>Aceitar todos</Button>
      </div>
    </div>
  );
}
