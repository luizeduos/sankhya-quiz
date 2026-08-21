"use client";

import { useEffect } from "react";
import { useHydrated } from "@/store/hydration";
import { useProgressStore } from "@/store/progress";
import { useRankingStore } from "@/store/ranking";

/** Espera para agrupar varias mudancas seguidas em uma unica publicacao. */
const DEBOUNCE_MS = 1_500;

/**
 * Ponte entre o progresso local e o placar compartilhado.
 *
 * Montado uma vez, no layout da area autenticada. Publica o resumo:
 *
 *  - assim que o localStorage e lido (para quem so abre o app aparecer);
 *  - a cada mudanca de XP / licoes / historico, com debounce — durante uma
 *    licao o XP muda a cada acerto, e uma requisicao por acerto seria
 *    desperdicio puro;
 *  - ao voltar o foco para a aba, porque ofensiva e XP da semana dependem da
 *    data: quem deixou a aba aberta na virada da meia-noite (ou do domingo
 *    para a segunda) tem numeros diferentes sem nada ter acontecido no app.
 *
 * `useRankingStore.publicar` ja descarta payload identico ao ultimo enviado,
 * entao um gatilho a mais nunca vira requisicao a mais.
 */
export function RankingSync() {
  const pronto = useHydrated();

  useEffect(() => {
    if (!pronto) return;

    const publicar = () => void useRankingStore.getState().publicar();
    let timer: number | undefined;
    const agendar = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(publicar, DEBOUNCE_MS);
    };

    publicar();

    const cancelar = useProgressStore.subscribe(agendar);
    window.addEventListener("focus", publicar);

    return () => {
      window.clearTimeout(timer);
      cancelar();
      window.removeEventListener("focus", publicar);
    };
  }, [pronto]);

  return null;
}
