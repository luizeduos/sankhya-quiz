"use client";

import { create } from "zustand";

/**
 * Coordena a animacao do "+XP" que sobe do painel de acerto e e absorvido
 * pelo contador do HUD.
 *
 * O truque: o mesmo `layoutId` ("xp-token") e usado por dois elementos em
 * partes distintas da arvore. Enquanto `fase === "painel"`, o token vive
 * dentro do painel de feedback; quando vira "hud", o painel desmonta o seu e
 * o HUD monta o dele — o Motion faz o FLIP entre as duas posicoes reais na
 * tela, sem que ninguem precise medir coordenadas.
 *
 * Nao e persistido: e estado de animacao, morre com a navegacao.
 */
type Fase = "painel" | "hud" | null;

type XpFlightState = {
  valor: number;
  fase: Fase;
  /** Muda a cada voo, para reiniciar o count-up mesmo com o mesmo valor. */
  vooId: number;
  lancar: (valor: number) => void;
  absorver: () => void;
  encerrar: () => void;
};

export const useXpFlight = create<XpFlightState>((set, get) => ({
  valor: 0,
  fase: null,
  vooId: 0,

  lancar: (valor) =>
    set((s) => ({ valor, fase: "painel", vooId: s.vooId + 1 })),

  absorver: () => {
    if (get().fase !== "painel") return;
    set({ fase: "hud" });
  },

  encerrar: () => set({ fase: null, valor: 0 }),
}));
