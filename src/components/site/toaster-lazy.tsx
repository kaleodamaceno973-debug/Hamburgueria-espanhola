"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), { ssr: false });

export function ToasterLazy() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      toastOptions={{ classNames: { toast: "!bg-[#1a140f] !border-white/10 !text-foreground !rounded-2xl" } }}
    />
  );
}
