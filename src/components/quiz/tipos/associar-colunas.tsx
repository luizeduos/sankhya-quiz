"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { m } from "motion/react";
import { useMemo } from "react";
import type { Resposta } from "@/lib/quiz/engine";
import type { AssociarColunas } from "@/data/schema";
import { spring } from "@/lib/motion/springs";
import { cn, seededShuffle } from "@/lib/utils";

/**
 * 5. Associar colunas.
 *
 * Coluna esquerda fixa (os conceitos), cada uma com um alvo de encaixe.
 * As definicoes ficam num banco embaralhado e sao arrastadas — ou tocadas,
 * caso em que preenchem o primeiro alvo vazio. O mapa de resposta guarda
 * `idDoParEsquerda -> idDoParCujaDefinicaoFoiEscolhida`, entao acertar e
 * simplesmente `mapa[p.id] === p.id`.
 */
export function AssociarColunasView({
  questao,
  resposta,
  onResponder,
  revelado,
}: {
  questao: AssociarColunas;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelado: boolean;
}) {
  const mapa = resposta?.kind === "pares" ? resposta.mapa : {};
  const definicoes = useMemo(
    () => seededShuffle(questao.pares, `${questao.id}-dir`),
    [questao],
  );
  const usadas = new Set(Object.values(mapa));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function ligar(esquerdaId: string, direitaId: string) {
    if (revelado) return;
    const novo: Record<string, string> = { ...mapa };
    for (const [k, v] of Object.entries(novo)) {
      if (v === direitaId) delete novo[k];
    }
    novo[esquerdaId] = direitaId;
    onResponder({ kind: "pares", mapa: novo });
  }

  function desligar(esquerdaId: string) {
    if (revelado) return;
    const novo = { ...mapa };
    delete novo[esquerdaId];
    onResponder({ kind: "pares", mapa: novo });
  }

  function onDragEnd(e: DragEndEvent) {
    const alvo = e.over?.data.current?.esquerdaId as string | undefined;
    if (!alvo) return;
    ligar(alvo, String(e.active.id));
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          {questao.pares.map((par, i) => (
            <AlvoAssociacao
              key={par.id}
              par={par}
              indice={i}
              escolhido={
                mapa[par.id]
                  ? questao.pares.find((p) => p.id === mapa[par.id])
                  : undefined
              }
              revelado={revelado}
              onRemover={() => desligar(par.id)}
            />
          ))}
        </div>

        {!revelado && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-extrabold tracking-[1.2px] text-subtle uppercase">
              Arraste ou toque para associar
            </p>
            <div className="flex flex-wrap gap-2.5">
              {definicoes.map((par) => (
                <Definicao
                  key={par.id}
                  id={par.id}
                  texto={par.direita}
                  usada={usadas.has(par.id)}
                  onClick={() => {
                    const vazio = questao.pares.find((p) => !mapa[p.id]);
                    if (vazio) ligar(vazio.id, par.id);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}

function AlvoAssociacao({
  par,
  indice,
  escolhido,
  revelado,
  onRemover,
}: {
  par: { id: string; esquerda: string; direita: string };
  indice: number;
  escolhido?: { id: string; direita: string };
  revelado: boolean;
  onRemover: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `alvo-${par.id}`,
    data: { esquerdaId: par.id },
    disabled: revelado,
  });

  const acertou = revelado && escolhido?.id === par.id;
  const errou = revelado && escolhido && escolhido.id !== par.id;

  return (
    <m.div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-btn border-2 border-b-4 p-3 sm:flex-row sm:items-center sm:gap-3",
        acertou
          ? "border-green bg-green-soft"
          : errou
            ? "border-coral bg-coral-soft"
            : isOver
              ? "border-blue bg-blue-soft"
              : "border-line-strong bg-surface",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={
        errou ? { opacity: 1, y: 0, x: [0, -7, 6, -3, 0] } : { opacity: 1, y: 0 }
      }
      transition={
        errou ? { duration: 0.4 } : { ...spring.soft, delay: indice * 0.05 }
      }
    >
      <span
        className={cn(
          "flex min-w-0 shrink-0 items-center gap-2 text-[15px] font-extrabold sm:w-[46%]",
          acertou ? "text-green-ink" : errou ? "text-coral-ink" : "text-ink",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "grid size-[26px] shrink-0 place-items-center rounded-chip text-[12px] font-extrabold",
            acertou
              ? "bg-green text-white"
              : errou
                ? "bg-coral text-white"
                : "border-2 border-line-strong text-subtle",
          )}
        >
          {revelado ? (acertou ? "✓" : "✕") : indice + 1}
        </span>
        <span className="min-w-0">{par.esquerda}</span>
      </span>

      <span aria-hidden className="hidden shrink-0 text-subtle sm:block">
        →
      </span>

      {escolhido ? (
        <button
          type="button"
          onClick={onRemover}
          disabled={revelado}
          className={cn(
            "min-w-0 flex-1 rounded-chip px-3 py-2 text-left text-[14px] font-bold",
            acertou
              ? "bg-green/12 text-green-ink"
              : errou
                ? "bg-coral/12 text-coral-ink"
                : "bg-blue/12 text-blue-ink",
          )}
        >
          {escolhido.direita}
          {errou && (
            <span className="mt-1 block text-[13px] font-normal text-coral-ink2">
              Correto: {par.direita}
            </span>
          )}
        </button>
      ) : (
        <span className="flex-1 rounded-chip border-2 border-dashed border-blue/50 px-3 py-2 text-[13px] font-bold text-subtle">
          Solte a definição aqui
        </span>
      )}
    </m.div>
  );
}

function Definicao({
  id,
  texto,
  usada,
  onClick,
}: {
  id: string;
  texto: string;
  usada: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={onClick}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "max-w-full rounded-chip border-2 border-b-[3px] px-3.5 py-2 text-left text-[14px] font-bold transition-opacity",
        "cursor-grab active:cursor-grabbing",
        usada
          ? "border-line bg-track text-subtle opacity-45"
          : "border-line-strong bg-surface text-ink hover:border-blue",
        isDragging && "z-20 opacity-90 shadow-lg",
      )}
      {...attributes}
      {...listeners}
    >
      {texto}
    </button>
  );
}
