"use client";

import { m } from "motion/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Resposta } from "@/lib/quiz/engine";
import type { RespostaCurta } from "@/data/schema";
import { spring } from "@/lib/motion/springs";
import { cn, normalizeAnswer } from "@/lib/utils";

/**
 * 6. Resposta digitada curta.
 *
 * A comparacao normaliza caixa, acento e pontuacao (`normalizeAnswer`), entao
 * "top", "TOP" e "Tipo de Operação" caem no mesmo lugar — o objetivo e testar
 * o conceito, nao a digitacao.
 */
export function RespostaCurtaView({
  questao,
  resposta,
  onResponder,
  revelado,
  onEnviar,
}: {
  questao: RespostaCurta;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelado: boolean;
  /** Enter no campo dispara VERIFICAR. */
  onEnviar?: () => void;
}) {
  const [mostrarDica, setMostrarDica] = useState(false);
  const valor = resposta?.kind === "texto" ? resposta.valor : "";
  const acertou =
    revelado &&
    questao.respostasAceitas.some(
      (a) => normalizeAnswer(a) === normalizeAnswer(valor),
    );

  return (
    <div className="flex flex-col gap-3">
      <Input
        autoFocus
        value={valor}
        disabled={revelado}
        placeholder="Digite sua resposta"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(e) => onResponder({ kind: "texto", valor: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !revelado) {
            e.preventDefault();
            onEnviar?.();
          }
        }}
        className={cn(
          "text-[18px]",
          revelado &&
            (acertou
              ? "border-green bg-green-soft text-green-ink"
              : "border-coral bg-coral-soft text-coral-ink"),
        )}
        invalido={revelado && !acertou}
      />

      {questao.dica && !revelado && (
        <div>
          {mostrarDica ? (
            <m.p
              className="rounded-card bg-gold-soft px-3.5 py-2.5 text-[14px] text-gold-ink2"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring.snappy}
            >
              💡 {questao.dica}
            </m.p>
          ) : (
            <button
              type="button"
              onClick={() => setMostrarDica(true)}
              className="text-[13px] font-extrabold text-blue hover:underline"
            >
              Ver dica
            </button>
          )}
        </div>
      )}
    </div>
  );
}
