"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Historico de erros — alimenta a area "Revisar erros" e o card de pontos
 * fracos da Home.
 *
 * O modelo e uma repeticao espacada simples: cada erro entra na fila e sai
 * dela apos `ACERTOS_PARA_DOMINAR` acertos consecutivos na mesma questao.
 * Assim a questao errada volta a aparecer ate ser realmente dominada, que e
 * a promessa central do produto.
 */
export const ACERTOS_PARA_DOMINAR = 2;

export type RegistroErro = {
  questaoId: string;
  moduloId: string;
  licaoId: string;
  tags: string[];
  /**
   * Enunciado guardado junto com o erro. Redundante em relacao ao banco de
   * questoes, e de proposito: permite a tela /revisar listar a fila sem
   * importar o banco (~90 kB gzip) para o cliente.
   */
  enunciado: string;
  /** Ultima resposta errada dada (id da alternativa, texto ou serializacao). */
  ultimaResposta: string;
  tentativas: number;
  /** Acertos consecutivos desde o ultimo erro. */
  acertosSeguidos: number;
  primeiroErroEm: number;
  ultimoErroEm: number;
};

type ErrorsState = {
  registros: Record<string, RegistroErro>;
};

type ErrorsActions = {
  registrarErro: (dados: {
    questaoId: string;
    moduloId: string;
    licaoId: string;
    tags: string[];
    enunciado: string;
    resposta: string;
  }) => void;
  registrarAcerto: (questaoId: string) => void;
  esquecer: (questaoId: string) => void;
  limpar: () => void;
};

export const useErrorsStore = create<ErrorsState & ErrorsActions>()(
  persist(
    (set) => ({
      registros: {},

      registrarErro: ({
        questaoId,
        moduloId,
        licaoId,
        tags,
        enunciado,
        resposta,
      }) =>
        set((s) => {
          const anterior = s.registros[questaoId];
          const agora = Date.now();
          return {
            registros: {
              ...s.registros,
              [questaoId]: {
                questaoId,
                moduloId,
                licaoId,
                tags,
                enunciado,
                ultimaResposta: resposta,
                tentativas: (anterior?.tentativas ?? 0) + 1,
                // Errar zera o progresso de dominio.
                acertosSeguidos: 0,
                primeiroErroEm: anterior?.primeiroErroEm ?? agora,
                ultimoErroEm: agora,
              },
            },
          };
        }),

      registrarAcerto: (questaoId) =>
        set((s) => {
          const r = s.registros[questaoId];
          if (!r) return s;
          const acertos = r.acertosSeguidos + 1;
          if (acertos >= ACERTOS_PARA_DOMINAR) {
            // Dominada: sai da fila de revisao.
            const resto = { ...s.registros };
            delete resto[questaoId];
            return { registros: resto };
          }
          return {
            registros: {
              ...s.registros,
              [questaoId]: { ...r, acertosSeguidos: acertos },
            },
          };
        }),

      esquecer: (questaoId) =>
        set((s) => {
          const resto = { ...s.registros };
          delete resto[questaoId];
          return { registros: resto };
        }),

      limpar: () => set({ registros: {} }),
    }),
    {
      name: "sankhya-quiz:erros",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/* ===========================================================================
 * Seletores
 * ======================================================================== */

/**
 * ATENCAO: as funcoes desta secao que devolvem array/objeto recebem
 * `registros` como parametro, NAO o state.
 *
 * O selector do Zustand v5 e comparado com `Object.is`. Passar uma dessas
 * funcoes direto como selector devolveria uma referencia nova a cada leitura e
 * o `useSyncExternalStore` re-renderizaria sem parar — React #185, "Maximum
 * update depth exceeded". Use-as dentro de `useMemo`, selecionando
 * `s.registros` (que e uma referencia estavel do state).
 */
type Registros = Record<string, RegistroErro>;

/** Questoes pendentes de revisao, das mais erradas para as menos. */
export function filaDeRevisao(registros: Registros): RegistroErro[] {
  return Object.values(registros).sort(
    (a, b) => b.tentativas - a.tentativas || b.ultimoErroEm - a.ultimoErroEm,
  );
}

/** Devolve number: seguro como selector direto. */
export function totalPendente(s: ErrorsState): number {
  return Object.keys(s.registros).length;
}

/**
 * Pontos fracos: as tags mais recorrentes na fila de erros. E o que preenche
 * "Seus pontos fracos: TOP, DRE e parâmetros de estoque" no card da Home.
 */
export function pontosFracos(registros: Registros, limite = 3): string[] {
  const contagem = new Map<string, number>();
  for (const r of Object.values(registros)) {
    for (const tag of r.tags) {
      contagem.set(tag, (contagem.get(tag) ?? 0) + r.tentativas);
    }
  }
  return [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([tag]) => tag);
}

export function errosPorModulo(registros: Registros): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of Object.values(registros)) {
    out[r.moduloId] = (out[r.moduloId] ?? 0) + 1;
  }
  return out;
}
