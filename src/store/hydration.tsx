"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useErrorsStore } from "./errors";
import { useProgressStore } from "./progress";
import { useSessionStore } from "./session";

/**
 * Ponte de hidratacao dos stores persistidos.
 *
 * Os tres stores usam `skipHydration: true`. O servidor renderiza sempre o
 * estado inicial; o cliente le o localStorage num efeito, depois do primeiro
 * paint. Isso torna impossivel um mismatch de hidratacao — o preco e que
 * numeros persistidos ficam em skeleton por um frame, o que `useHydrated()`
 * permite tratar explicitamente em cada componente.
 */
const useHydrationStore = create<{ pronto: boolean; marcar: () => void }>(
  (set) => ({ pronto: false, marcar: () => set({ pronto: true }) }),
);

/** `true` depois de o localStorage ter sido lido. */
export function useHydrated() {
  return useHydrationStore((s) => s.pronto);
}

/** Montado uma unica vez, no layout da area autenticada. */
export function StoreHydration() {
  useEffect(() => {
    void Promise.all([
      useProgressStore.persist.rehydrate(),
      useErrorsStore.persist.rehydrate(),
      useSessionStore.persist.rehydrate(),
    ]).then(() => useHydrationStore.getState().marcar());
  }, []);

  return null;
}
