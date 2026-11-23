"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { phone: string; address: string; hours: string };

const MobileNavSheet = dynamic(() => import("./nav-links").then((m) => m.MobileNav), { ssr: false });

/** Botão leve; o menu (Radix Dialog) só é baixado no primeiro toque. */
export function MobileNavLazy(props: Props) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) return <MobileNavSheet {...props} defaultOpen />;
  return (
    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setLoaded(true)} onPointerEnter={() => void import("./nav-links")}>
      <Menu className="size-6" />
    </Button>
  );
}
