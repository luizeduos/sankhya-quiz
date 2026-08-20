"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Sessao de quiz em andamento.
 *
 * Persistida de proposito: e ela que sustenta o hero "Continuar de onde
 * parou" do artboard 1c ("Confirmação de nota · Lição 3 — 3 de 8 questões").
 * Se o usuario fecha o navegador no meio da licao, a sessao sobrevive.
 */
export type RespostaDada = {
  questaoId: string;
  /**
   * Enunciado guardado com a resposta, para a tela de resumo nao precisar
   * importar o banco de questoes no cliente.
   */
  enunciado: string;
  correta: boolean;
  /** Serializacao da resposta, para reexibir no resumo. */
  resposta: string;
  /** Milissegundos gastos na questao. */
  duracaoMs: number;
};

export type ModoSessao = "licao" | "prova" | "revisao";

type SessionState = {
  /** null = nenhuma sessao ativa. */
  licaoId: string | null;
  modo: ModoSessao;
  /** Ordem das questoes desta sessao (ids), fixada no inicio. */
  ordem: string[];
  indice: number;
  respostas: RespostaDada[];
  iniciadaEm: number | null;
  /** Ultima sessao concluida, para a tela de resumo sobreviver a um refresh. */
  ultimoResumo: {
    licaoId: string;
    modo: ModoSessao;
    respostas: RespostaDada[];
    xpGanho: number;
    concluidaEm: number;
  } | null;
};

type SessionActions = {
  iniciar: (args: { licaoId: string; modo: ModoSessao; ordem: string[] }) => void;
  responder: (resposta: RespostaDada) => void;
  avancar: () => void;
  encerrar: (xpGanho: number) => void;
  abandonar: () => void;
};

const vazio: SessionState = {
  licaoId: null,
  modo: "licao",
  ordem: [],
  indice: 0,
  respostas: [],
  iniciadaEm: null,
  ultimoResumo: null,
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      ...vazio,

      iniciar: ({ licaoId, modo, ordem }) =>
        set({
          licaoId,
          modo,
          ordem,
          indice: 0,
          respostas: [],
          iniciadaEm: Date.now(),
        }),

      responder: (resposta) =>
        set((s) => {
          // Idempotente: responder duas vezes a mesma questao nao duplica.
          if (s.respostas.some((r) => r.questaoId === resposta.questaoId)) return s;
          return { respostas: [...s.respostas, resposta] };
        }),

      avancar: () =>
        set((s) => ({ indice: Math.min(s.indice + 1, s.ordem.length) })),

      encerrar: (xpGanho) => {
        const s = get();
        set({
          ...vazio,
          ultimoResumo: s.licaoId
            ? {
                licaoId: s.licaoId,
                modo: s.modo,
                respostas: s.respostas,
                xpGanho,
                concluidaEm: Date.now(),
              }
            : s.ultimoResumo,
        });
      },

      abandonar: () => set({ ...vazio, ultimoResumo: get().ultimoResumo }),
    }),
    {
      name: "sankhya-quiz:sessao",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/* ===========================================================================
 * Seletores
 * ======================================================================== */

export function sessaoAtiva(s: SessionState) {
  return s.licaoId !== null && s.indice < s.ordem.length;
}

export function progressoSessao(s: SessionState) {
  const total = s.ordem.length;
  return {
    total,
    respondidas: s.respostas.length,
    indice: s.indice,
    fracao: total > 0 ? s.respostas.length / total : 0,
  };
}

export function acertosDaSessao(s: SessionState) {
  return s.respostas.filter((r) => r.correta).length;
}
