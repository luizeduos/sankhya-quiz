"use client";

import { useMemo } from "react";
import { AnswerCard, type EstadoCard } from "../answer-card";
import { alternativasEmbaralhadas } from "@/lib/quiz/engine";
import type { Resposta } from "@/lib/quiz/engine";
import type { MultiplaEscolha, VerdadeiroFalso } from "@/data/schema";

type Props<T> = {
  questao: T;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  /** Depois de VERIFICAR os cards revelam correto/errado e travam. */
  revelado: boolean;
};

/** 1. Multipla escolha — alternativas embaralhadas de forma estavel. */
export function MultiplaEscolhaView({
  questao,
  resposta,
  onResponder,
  revelado,
}: Props<MultiplaEscolha>) {
  const alternativas = useMemo(
    () => alternativasEmbaralhadas(questao.alternativas, questao.id),
    [questao],
  );
  const escolhidoId = resposta?.kind === "escolha" ? resposta.id : null;

  return (
    <div className="flex flex-col gap-3">
      {alternativas.map((alt, i) => {
        const selecionada = escolhidoId === alt.id;
        let estado: EstadoCard = "neutro";
        if (revelado) {
          if (alt.correta) estado = "correto";
          else if (selecionada) estado = "errado";
        } else if (selecionada) {
          estado = "selecionado";
        }

        return (
          <AnswerCard
            key={alt.id}
            estado={estado}
            indice={i}
            disabled={revelado}
            shake={revelado && selecionada && !alt.correta}
            marcador={
              estado === "correto" ? "✓" : estado === "errado" ? "✕" : i + 1
            }
            onClick={() => onResponder({ kind: "escolha", id: alt.id })}
          >
            {alt.texto}
          </AnswerCard>
        );
      })}
    </div>
  );
}

/** 2. Verdadeiro / falso — a afirmacao em destaque e dois cards largos. */
export function VerdadeiroFalsoView({
  questao,
  resposta,
  onResponder,
  revelado,
}: Props<VerdadeiroFalso>) {
  const valor = resposta?.kind === "booleano" ? resposta.valor : null;

  return (
    <div className="flex flex-col gap-4">
      <blockquote className="rounded-panel border-l-4 border-blue bg-blue-soft px-4 py-3.5 text-[16px] leading-relaxed font-bold text-blue-ink">
        {questao.afirmacao}
      </blockquote>

      <div className="grid gap-3 sm:grid-cols-2">
        {[true, false].map((opcao, i) => {
          const selecionada = valor === opcao;
          const eCorreta = opcao === questao.resposta;
          let estado: EstadoCard = "neutro";
          if (revelado) {
            if (eCorreta) estado = "correto";
            else if (selecionada) estado = "errado";
          } else if (selecionada) {
            estado = "selecionado";
          }

          return (
            <AnswerCard
              key={String(opcao)}
              estado={estado}
              indice={i}
              disabled={revelado}
              shake={revelado && selecionada && !eCorreta}
              marcador={
                estado === "correto" ? "✓" : estado === "errado" ? "✕" : opcao ? "V" : "F"
              }
              onClick={() => onResponder({ kind: "booleano", valor: opcao })}
              className="justify-center sm:py-5"
            >
              {opcao ? "Verdadeiro" : "Falso"}
            </AnswerCard>
          );
        })}
      </div>
    </div>
  );
}
