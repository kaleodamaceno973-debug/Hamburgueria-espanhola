"use client";

/** Toasts carregados sob demanda (sonner fora do bundle inicial). */
type Opts = { description?: string; duration?: number; action?: { label: string; onClick: () => void } };

export const notify = {
  success: (msg: string, opts?: Opts) => void import("sonner").then((m) => m.toast.success(msg, opts)),
  error: (msg: string | undefined, opts?: Opts) => void import("sonner").then((m) => m.toast.error(msg ?? "Algo deu errado", opts)),
  warning: (msg: string, opts?: Opts) => void import("sonner").then((m) => m.toast.warning(msg, opts)),
};
