"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { inicioDaSemana } from "@/lib/ranking/semana";
import { useProgressStore, streakAtual } from "@/store/progress";
import { dayKey } from "@/lib/utils";

/**
 * Estado do cliente para o ranking.
 *
 * O progresso continua sendo do navegador (`store/progress.ts`); este store
 * cuida de duas coisas que o progresso nao deve conhecer:
 *
 *  1. a PREFERENCIA de participar do placar (persistida — e uma escolha, nao
 *     um dado derivado);
 *  2. o controle de ENVIO: o que ja foi publicado, para nao repetir requisicao
 *     identica a cada render.
 */

type RankingState = {
  /** Opt-out do placar, em /configuracoes. Participar e o padrao. */
  participar: boolean;
  /** Assinatura do ultimo payload publicado com sucesso (nao persistida). */
  ultimaAssinatura: string | null;
  publicando: boolean;
  /** Ultima falha de publicacao, para a tela do ranking poder avisar. */
  falhou: boolean;
};

type RankingActions = {
  definirParticipacao: (v: boolean) => void;
  /** Publica o resumo atual. Devolve `true` se algo foi enviado. */
  publicar: (opts?: { forcar?: boolean }) => Promise<boolean>;
};

export type ResumoLocal = {
  xpTotal: number;
  xpSemana: number;
  streak: number;
  licoes: number;
  minutos: number;
  visivel: boolean;
};

/** Le o progresso local e monta o payload da publicacao. */
export function resumoLocal(participar: boolean): ResumoLocal {
  const p = useProgressStore.getState();
  const inicio = inicioDaSemana();
  const hoje = dayKey();

  let xpSemana = 0;
  let minutos = 0;
  for (const [chave, dia] of Object.entries(p.historico)) {
    minutos += dia.minutos;
    // Compara por chave de dia local (a mesma que o progresso grava), sem
    // converter para Date/UTC — comparacao lexicografica de AAAA-MM-DD basta.
    if (chave >= dayKey(inicio) && chave <= hoje) xpSemana += dia.xp;
  }

  return {
    xpTotal: p.xp,
    xpSemana,
    streak: streakAtual(p),
    licoes: Object.keys(p.licoesConcluidas).length,
    minutos,
    visivel: participar,
  };
}

export const useRankingStore = create<RankingState & RankingActions>()(
  persist(
    (set, get) => ({
      participar: true,
      ultimaAssinatura: null,
      publicando: false,
      falhou: false,

      definirParticipacao: (v) => {
        set({ participar: v, ultimaAssinatura: null });
        // Sair do placar precisa chegar ao servidor na hora: o registro tem de
        // ser removido, nao apenas deixar de ser atualizado.
        void get().publicar({ forcar: true });
      },

      publicar: async ({ forcar = false } = {}) => {
        const { participar, ultimaAssinatura, publicando } = get();
        if (publicando) return false;

        const resumo = resumoLocal(participar);
        const assinatura = JSON.stringify(resumo);
        if (!forcar && assinatura === ultimaAssinatura) return false;

        set({ publicando: true });
        try {
          const res = await fetch("/api/ranking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: assinatura,
          });
          if (!res.ok) throw new Error(String(res.status));
          set({ ultimaAssinatura: assinatura, falhou: false });
          return true;
        } catch {
          // Silencioso de proposito: ficar sem placar por alguns minutos nao
          // e motivo para interromper quem esta estudando. A tela do ranking
          // mostra o aviso; aqui so registramos.
          set({ falhou: true });
          return false;
        } finally {
          set({ publicando: false });
        }
      },
    }),
    {
      name: "sankhya-quiz:ranking",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // So a preferencia e persistida: assinatura e flags de envio sao
      // estado de sessao e devem comecar limpos em cada carga.
      partialize: (s) => ({ participar: s.participar }),
    },
  ),
);
