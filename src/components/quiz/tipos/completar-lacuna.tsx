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
import { useMemo } from "react";
import { m } from "motion/react";
import type { Resposta } from "@/lib/quiz/engine";
import type { CompletarLacuna } from "@/data/schema";
import { spring } from "@/lib/motion/springs";
import { cn, seededShuffle } from "@/lib/utils";

/**
 * 3. Completar lacuna.
 *
 * O texto e quebrado nos marcadores `{{n}}` e cada lacuna vira um droppable
 * inline. As fichas do banco sao draggables; clicar tambem funciona (preenche
 * a primeira lacuna vazia), porque exigir arrasto num celular pequeno seria
 * hostil — e garante acessibilidade por teclado sem depender do sensor.
 */
export function CompletarLacunaView({
  questao,
  resposta,
  onResponder,
  revelado,
}: {
  questao: CompletarLacuna;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelado: boolean;
}) {
  const mapa = resposta?.kind === "lacunas" ? resposta.mapa : {};
  const banco = useMemo(
    () => seededShuffle(questao.banco, questao.id),
    [questao],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  /** Fichas ainda nao usadas. */
  const usadas = new Set(Object.values(mapa));
  const partes = useMemo(() => quebrar(questao.texto), [questao.texto]);

  function colocar(pos: number, fichaId: string) {
    if (revelado) return;
    const novo: Record<number, string> = { ...mapa };
    // Uma ficha ocupa uma lacuna só: se ela já estava em outra, sai de lá.
    for (const [k, v] of Object.entries(novo)) {
      if (v === fichaId) delete novo[Number(k)];
    }
    novo[pos] = fichaId;
    onResponder({ kind: "lacunas", mapa: novo });
  }

  function remover(pos: number) {
    if (revelado) return;
    const novo = { ...mapa };
    delete novo[pos];
    onResponder({ kind: "lacunas", mapa: novo });
  }

  function onDragEnd(e: DragEndEvent) {
    const pos = e.over?.data.current?.pos as number | undefined;
    if (pos === undefined) return;
    colocar(pos, String(e.active.id));
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-5">
        {/* Frase com as lacunas */}
        <p className="text-[17px] leading-[2.1] font-bold text-ink">
          {partes.map((parte, i) =>
            typeof parte === "string" ? (
              <span key={i}>{parte}</span>
            ) : (
              <Lacuna
                key={i}
                pos={parte.pos}
                ficha={
                  mapa[parte.pos]
                    ? questao.banco.find((b) => b.id === mapa[parte.pos])
                    : undefined
                }
                correta={
                  questao.lacunas.find((l) => l.pos === parte.pos)?.respostaId
                }
                revelado={revelado}
                onRemover={() => remover(parte.pos)}
              />
            ),
          )}
        </p>

        {/* Banco de fichas */}
        {!revelado && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-extrabold tracking-[1.2px] text-subtle uppercase">
              Arraste ou toque para usar
            </p>
            <div className="flex flex-wrap gap-2.5">
              {banco.map((ficha) => (
                <Ficha
                  key={ficha.id}
                  id={ficha.id}
                  texto={ficha.texto}
                  usada={usadas.has(ficha.id)}
                  onClick={() => {
                    const vazia = questao.lacunas.find((l) => !mapa[l.pos]);
                    if (vazia) colocar(vazia.pos, ficha.id);
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

/** Quebra "A {{1}} define o {{2}}" em ["A ", {pos:1}, " define o ", {pos:2}]. */
function quebrar(texto: string): (string | { pos: number })[] {
  const out: (string | { pos: number })[] = [];
  const re = /\{\{(\d+)\}\}/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) out.push(texto.slice(ultimo, m.index));
    out.push({ pos: Number(m[1]) });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) out.push(texto.slice(ultimo));
  return out;
}

function Lacuna({
  pos,
  ficha,
  correta,
  revelado,
  onRemover,
}: {
  pos: number;
  ficha?: { id: string; texto: string };
  correta?: string;
  revelado: boolean;
  onRemover: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `lacuna-${pos}`,
    data: { pos },
    disabled: revelado,
  });

  const acertou = revelado && ficha?.id === correta;
  const errou = revelado && ficha && ficha.id !== correta;

  return (
    <m.button
      type="button"
      ref={setNodeRef}
      onClick={onRemover}
      disabled={revelado || !ficha}
      aria-label={
        ficha ? `Lacuna ${pos}: ${ficha.texto}` : `Lacuna ${pos} vazia`
      }
      className={cn(
        "mx-1 inline-flex min-w-[110px] items-center justify-center rounded-chip border-2 border-b-[3px] px-3 py-1 align-middle text-[16px] font-extrabold",
        !ficha && "border-dashed border-blue/60 bg-blue-soft/50 text-transparent",
        ficha && !revelado && "border-blue bg-blue-soft text-blue-ink",
        acertou && "border-green bg-green-soft text-green-ink",
        errou && "border-coral bg-coral-soft text-coral-ink",
        isOver && "border-blue bg-blue-soft",
      )}
      animate={
        errou
          ? { x: [0, -6, 5, -3, 0] }
          : isOver
            ? { scale: 1.04 }
            : { scale: 1, x: 0 }
      }
      transition={errou ? { duration: 0.38 } : spring.snappy}
    >
      {ficha ? ficha.texto : " "}
    </m.button>
  );
}

function Ficha({
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
        "rounded-chip border-2 border-b-[3px] px-3.5 py-2 text-[15px] font-extrabold transition-opacity",
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
