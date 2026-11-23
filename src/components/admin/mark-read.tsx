"use client";

import { useTransition } from "react";
import { markMessageReadAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function MarkRead({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <Button size="sm" variant="secondary" disabled={pending} onClick={() => start(async () => { await markMessageReadAction(id); })}>
      Marcar como lida
    </Button>
  );
}
