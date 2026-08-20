"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clamp, dayKey, daysBetween } from "@/lib/utils";

/* ===========================================================================
 * Regras de gamificacao
 *
 * NAO existe sistema de vidas: errar nunca bloqueia o estudo. O protótipo
 * trazia um contador de vidas e um modal "Vidas esgotadas", mas o produto
 * existe para explicar o erro — interromper quem errou trabalha contra isso.
 * O unico custo de errar e a questao voltar na fila de revisao
 * (ver store/errors.ts).
 * ======================================================================== */
export const XP_POR_NIVEL = 200;
export const META_DIARIA_PADRAO = 10;

/** XP por acerto, conforme a dificuldade da questao. */
export const XP_POR_DIFICULDADE = { 1: 10, 2: 15, 3: 20 } as const;

export type DiaHistorico = {
  minutos: number;
  xp: number;
  questoes: number;
  acertos: number;
};

type ProgressState = {
  xp: number;
  metaDiariaMin: number;
  /** Historico por dia (AAAA-MM-DD). Mantido nos ultimos 120 dias. */
  historico: Record<string, DiaHistorico>;
  /** Licoes concluidas -> melhor pontuacao (0..1). */
  licoesConcluidas: Record<string, number>;
  /** Segundos acumulados que ainda nao completaram um minuto. */
  segundosResiduais: number;
  onboardingConcluido: boolean;
};

type ProgressActions = {
  registrarAcerto: (dificuldade: 1 | 2 | 3) => number;
  registrarErro: () => void;
  registrarTempo: (segundos: number) => void;
  concluirLicao: (licaoId: string, aproveitamento: number) => void;
  definirMeta: (minutos: number) => void;
  concluirOnboarding: () => void;
  resetar: () => void;
};

const estadoInicial: ProgressState = {
  xp: 0,
  metaDiariaMin: META_DIARIA_PADRAO,
  historico: {},
  licoesConcluidas: {},
  segundosResiduais: 0,
  onboardingConcluido: false,
};

function diaVazio(): DiaHistorico {
  return { minutos: 0, xp: 0, questoes: 0, acertos: 0 };
}

/** Poda o historico para os ultimos 120 dias, evitando crescer sem limite. */
function podar(historico: Record<string, DiaHistorico>) {
  const hoje = dayKey();
  const entradas = Object.entries(historico).filter(
    ([k]) => daysBetween(k, hoje) <= 120,
  );
  return Object.fromEntries(entradas);
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set) => ({
      ...estadoInicial,

      registrarAcerto: (dificuldade) => {
        const ganho = XP_POR_DIFICULDADE[dificuldade];
        const k = dayKey();
        set((s) => {
          const dia = s.historico[k] ?? diaVazio();
          return {
            xp: s.xp + ganho,
            historico: {
              ...s.historico,
              [k]: {
                ...dia,
                xp: dia.xp + ganho,
                questoes: dia.questoes + 1,
                acertos: dia.acertos + 1,
              },
            },
          };
        });
        return ganho;
      },

      /** Contabiliza a questao no dia. Errar nao custa nada alem disso. */
      registrarErro: () => {
        const k = dayKey();
        set((s) => {
          const dia = s.historico[k] ?? diaVazio();
          return {
            historico: {
              ...s.historico,
              [k]: { ...dia, questoes: dia.questoes + 1 },
            },
          };
        });
      },

      registrarTempo: (segundos) => {
        const k = dayKey();
        set((s) => {
          const total = s.segundosResiduais + segundos;
          const minutos = Math.floor(total / 60);
          if (minutos === 0) return { segundosResiduais: total };
          const dia = s.historico[k] ?? diaVazio();
          return {
            segundosResiduais: total % 60,
            historico: podar({
              ...s.historico,
              [k]: { ...dia, minutos: dia.minutos + minutos },
            }),
          };
        });
      },

      concluirLicao: (licaoId, aproveitamento) =>
        set((s) => ({
          licoesConcluidas: {
            ...s.licoesConcluidas,
            [licaoId]: Math.max(s.licoesConcluidas[licaoId] ?? 0, aproveitamento),
          },
        })),

      definirMeta: (minutos) =>
        set({ metaDiariaMin: clamp(Math.round(minutos), 5, 60) }),

      concluirOnboarding: () => set({ onboardingConcluido: true }),

      resetar: () => set({ ...estadoInicial }),
    }),
    {
      name: "sankhya-quiz:progresso",
      // v2 removeu o sistema de vidas.
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // O estado persistido nao existe no servidor. Hidratamos de proposito
      // em um efeito (ver `StoreHydration`), o que elimina qualquer
      // divergencia entre HTML do servidor e primeiro render do cliente.
      skipHydration: true,
      partialize: (s) => ({
        xp: s.xp,
        metaDiariaMin: s.metaDiariaMin,
        historico: s.historico,
        licoesConcluidas: s.licoesConcluidas,
        segundosResiduais: s.segundosResiduais,
        onboardingConcluido: s.onboardingConcluido,
      }),
      /**
       * Descarta os campos de vidas de quem ja tinha estado da v1. Sem isto,
       * `vidas` e `ultimaPerdaVida` ficariam no localStorage para sempre.
       */
      migrate: (persistido, versao) => {
        const s = { ...(persistido as Record<string, unknown>) };
        if (versao < 2) {
          delete s.vidas;
          delete s.ultimaPerdaVida;
        }
        return { ...estadoInicial, ...s } as ProgressState;
      },
    },
  ),
);

/* ===========================================================================
 * Seletores derivados
 *
 * Regra: selector do Zustand v5 e comparado com `Object.is`. As funcoes que
 * devolvem array/objeto recebem primitivos e sao chamadas dentro de `useMemo`
 * no componente — devolver referencia nova a cada leitura causaria loop de
 * render (React #185).
 * ======================================================================== */

export function nivelDoXp(xp: number) {
  return Math.floor(xp / XP_POR_NIVEL) + 1;
}

export function xpNoNivel(xp: number) {
  return xp % XP_POR_NIVEL;
}

/** Minutos praticados hoje. */
export function minutosHoje(s: ProgressState) {
  return s.historico[dayKey()]?.minutos ?? 0;
}

export function metaAtingidaHoje(s: ProgressState) {
  return minutosHoje(s) >= s.metaDiariaMin;
}

/**
 * Sequencia (ofensiva) em dias. Conta para tras a partir de hoje; o dia de
 * hoje so entra se a meta ja foi batida, para que a sequencia nao "pisque"
 * ao longo do dia.
 */
export function streakAtual(s: ProgressState) {
  const bateu = (k: string) => (s.historico[k]?.minutos ?? 0) >= s.metaDiariaMin;
  const hoje = new Date();
  let dias = 0;
  let offset = bateu(dayKey(hoje)) ? 0 : 1;
  for (;;) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - offset);
    if (!bateu(dayKey(d))) break;
    dias += 1;
    offset += 1;
  }
  return dias;
}

/**
 * Segunda a domingo da semana corrente, para o card "Ofensiva semanal".
 *
 * Recebe primitivos (e nao o state) de proposito: devolve um ARRAY NOVO a cada
 * chamada, e usar isso direto como selector do Zustand causaria loop infinito
 * de render. Chame dentro de um `useMemo` no componente.
 */
export function semanaAtual(
  historico: Record<string, DiaHistorico>,
  metaDiariaMin: number,
) {
  const hoje = new Date();
  // getDay(): 0=domingo. Convertemos para semana comecando na segunda.
  const offsetSegunda = (hoje.getDay() + 6) % 7;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - offsetSegunda);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda);
    d.setDate(segunda.getDate() + i);
    const k = dayKey(d);
    const dia = historico[k] ?? diaVazio();
    const futuro = d > hoje && k !== dayKey(hoje);
    return {
      key: k,
      label: ["S", "T", "Q", "Q", "S", "S", "D"][i],
      minutos: dia.minutos,
      bateuMeta: dia.minutos >= metaDiariaMin,
      parcial: dia.minutos > 0 && dia.minutos < metaDiariaMin,
      hoje: k === dayKey(hoje),
      futuro,
    };
  });
}

/** Minutos restantes para bater a meta de hoje. */
export function faltaParaMeta(s: ProgressState) {
  return Math.max(0, s.metaDiariaMin - minutosHoje(s));
}
