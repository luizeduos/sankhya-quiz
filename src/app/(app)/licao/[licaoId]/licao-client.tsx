"use client";

import { useMemo } from "react";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { montarOrdem } from "@/lib/quiz/engine";
import type { Licao, Modulo, Questao } from "@/data/schema";

/**
 * Fronteira de cliente da licao. A ordem das questoes e derivada de um seed
 * estavel (o id da licao), entao servidor e cliente concordam e um refresh no
 * meio da licao nao reordena nada.
 */
export function LicaoClient({
  licao,
  modulo,
  questoes,
}: {
  licao: Licao;
  modulo: Modulo | null;
  questoes: Questao[];
}) {
  const ordenadas = useMemo(() => {
    const ordem = montarOrdem(questoes, licao.id);
    const porId = new Map(questoes.map((q) => [q.id, q]));
    return ordem.map((id) => porId.get(id)!).filter(Boolean);
  }, [questoes, licao.id]);

  return (
    <QuizEngine
      licao={licao}
      questoes={ordenadas}
      modo={licao.tipo === "prova" ? "prova" : "licao"}
      titulo={`${modulo?.titulo ?? ""} · ${licao.titulo}`}
    />
  );
}
