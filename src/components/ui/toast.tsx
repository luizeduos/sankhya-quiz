"use client";

import { AnimatePresence, m } from "motion/react";
import { create } from "zustand";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Toast minimo, no lugar do `sonner`.
 *
 * Motivo: o app usa toast em dois lugares (confirmacoes em /configuracoes).
 * O sonner custava ~15 kB gzip em TODAS as rotas do app, porque o `<Toaster />`
 * vive no layout. Aqui sao ~1 kB reaproveitando o Motion e o Zustand que ja
 * estao carregados, com o visual do toast escuro do artboard 1a
 * ("⚡ Toast: +10 XP, sequência de 5").
 */
type Tipo = "sucesso" | "erro" | "info";

type Item = { id: number; texto: string; tipo: Tipo };

type ToastState = {
  itens: Item[];
  mostrar: (texto: string, tipo?: Tipo) => void;
  remover: (id: number) => void;
};

let proximoId = 1;

const useToastStore = create<ToastState>((set) => ({
  itens: [],
  mostrar: (texto, tipo = "info") => {
    const id = proximoId++;
    set((s) => ({ itens: [...s.itens, { id, texto, tipo }] }));
    window.setTimeout(
      () => set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),
      3200,
    );
  },
  remover: (id) =>
    set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),
}));

/** Dispara um toast de qualquer lugar, sem precisar de hook. */
export const toast = {
  sucesso: (texto: string) => useToastStore.getState().mostrar(texto, "sucesso"),
  erro: (texto: string) => useToastStore.getState().mostrar(texto, "erro"),
  info: (texto: string) => useToastStore.getState().mostrar(texto, "info"),
};

const ICONE: Record<Tipo, string> = {
  sucesso: "⚡",
  erro: "✕",
  info: "•",
};

/** Montado uma vez, no layout da area autenticada. */
export function Toaster() {
  const itens = useToastStore((s) => s.itens);
  const remover = useToastStore((s) => s.remover);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed top-4 left-1/2 z-100 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <AnimatePresence initial={false}>
        {itens.map((i) => (
          <m.button
            key={i.id}
            type="button"
            onClick={() => remover(i.id)}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-card px-4 py-3 text-[13px] font-bold text-white shadow-lg",
              i.tipo === "erro" ? "bg-coral-deep" : "bg-ink",
            )}
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={spring.bouncy}
          >
            <span aria-hidden>{ICONE[i.tipo]}</span>
            {i.texto}
          </m.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
