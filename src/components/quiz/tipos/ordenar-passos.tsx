"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo } from "react";
import type { Resposta } from "@/lib/quiz/engine";
import type { OrdenarPassos } from "@/data/schema";
import { seededShuffle, cn } from "@/lib/utils";

/**
 * 4. Ordenar passos.
 *
 * dnd-kit com sensor de teclado ativo: a questao e resolvivel sem mouse
 * (Tab para focar, Espaco para pegar, setas para mover, Espaco para soltar),
 * o que uma implementacao com HTML5 drag nativo nao daria.
 */
export function OrdenarPassosView({
  questao,
  resposta,
  onResponder,
  revelado,
}: {
  questao: OrdenarPassos;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelado: boolean;
}) {
  // Ordem inicial embaralhada de forma estavel: nunca sai na ordem correta.
  const inicial = useMemo(() => {
    const ids = questao.passos.map((p) => p.id);
    const certa = [...questao.passos]
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => p.id);
    let embaralhada = seededShuffle(ids, questao.id);
    if (embaralhada.join() === certa.join()) {
      embaralhada = seededShuffle(ids, `${questao.id}-2`);
    }
    return embaralhada;
  }, [questao]);

  const ordem = resposta?.kind === "ordem" ? resposta.ids : inicial;

  // Registra a ordem inicial como resposta, para VERIFICAR ficar habilitado.
  useEffect(() => {
    if (resposta?.kind !== "ordem") {
      onResponder({ kind: "ordem", ids: inicial });
    }
  }, [inicial, resposta, onResponder]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const certos = [...questao.passos].sort((a, b) => a.ordem - b.ordem);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const de = ordem.indexOf(String(active.id));
    const para = ordem.indexOf(String(over.id));
    onResponder({ kind: "ordem", ids: arrayMove(ordem, de, para) });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-extrabold tracking-[1.2px] text-subtle uppercase">
        Arraste para ordenar
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ordem} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2.5">
            {ordem.map((id, i) => {
              const passo = questao.passos.find((p) => p.id === id)!;
              const noLugar = certos[i]?.id === id;
              return (
                <PassoArrastavel
                  key={id}
                  id={id}
                  numero={i + 1}
                  texto={passo.texto}
                  revelado={revelado}
                  correto={noLugar}
                  travado={revelado}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function PassoArrastavel({
  id,
  numero,
  texto,
  revelado,
  correto,
  travado,
}: {
  id: string;
  numero: number;
  texto: string;
  revelado: boolean;
  correto: boolean;
  travado: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: travado });

  return (
    <li
      ref={setNodeRef}
      // transform/transition vem do dnd-kit e sao sempre translate3d:
      // o item nunca reflui a lista enquanto e arrastado.
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-btn border-2 border-b-4 px-4 py-3.5 text-[15px] font-bold",
        isDragging && "relative z-10 shadow-lg",
        revelado
          ? correto
            ? "border-green bg-green-soft text-green-ink"
            : "border-coral bg-coral-soft text-coral-ink"
          : "border-line-strong bg-surface text-ink",
        travado ? "cursor-default" : "cursor-grab active:cursor-grabbing",
      )}
      {...attributes}
      {...listeners}
    >
      <span
        aria-hidden
        className={cn(
          "tnum grid size-[26px] shrink-0 place-items-center rounded-chip text-[12px] font-extrabold",
          revelado
            ? correto
              ? "bg-green text-white"
              : "bg-coral text-white"
            : "border-2 border-line-strong text-subtle",
        )}
      >
        {revelado ? (correto ? "✓" : "✕") : numero}
      </span>
      <span className="min-w-0 flex-1">{texto}</span>
      {!travado && (
        <span aria-hidden className="shrink-0 text-subtle">
          <GripIcon />
        </span>
      )}
    </li>
  );
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="5.5" cy="4" r="1.4" />
      <circle cx="10.5" cy="4" r="1.4" />
      <circle cx="5.5" cy="8" r="1.4" />
      <circle cx="10.5" cy="8" r="1.4" />
      <circle cx="5.5" cy="12" r="1.4" />
      <circle cx="10.5" cy="12" r="1.4" />
    </svg>
  );
}
