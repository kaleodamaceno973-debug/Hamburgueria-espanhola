"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true somente no cliente após a hidratação (sem setState em effect). */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
