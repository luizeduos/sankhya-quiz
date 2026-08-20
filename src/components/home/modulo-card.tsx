"use client";

import { m } from "motion/react";
import Link from "next/link";
import type { EstadoNo } from "./trilha-geometria";
import type { ProgressoModulo } from "@/lib/quiz/progresso";
import type { Tone } from "@/data/schema";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/** Cor do quadrado do emoji e do percentual, por tom do modulo. */
const TOM: Record<Tone, { chip: string; texto: string; borda: string }> = {
  blue: { chip: "bg-blue", texto: "text-blue", borda: "border-blue" },
  green: { chip: "bg-green", texto: "text-green", borda: "border-green" },
  gold: { chip: "bg-gold", texto: "text-gold-ink", borda: "border-gold" },
  coral: { chip: "bg-coral", texto: "text-coral", borda: "border-coral" },
  violet: { chip: "bg-violet", texto: "text-violet", borda: "border-violet" },
  orange: { chip: "bg-orange", texto: "text-orange-ink", borda: "border-orange" },
};

/**
 * Card de modulo do artboard 1c: emoji em quadrado colorido, titulo,
 * percentual a direita, mini-trilha de nos e linha de apoio.
 * O modulo em andamento recebe borda de 2px na cor do tom.
 */
export function ModuloCard({
  p,
  emAndamento,
  indice,
}: {
  p: ProgressoModulo;
  emAndamento: boolean;
  indice: number;
}) {
  const tom = TOM[p.modulo.tone];
  const bloqueado = !p.liberado;

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ ...spring.soft, delay: Math.min(indice, 5) * 0.05 }}
    >
      <m.div
        whileHover={bloqueado ? undefined : { y: -3 }}
        transition={spring.snappy}
        className={cn(
          "flex h-full flex-col gap-3.5 rounded-[22px] bg-surface p-5",
          emAndamento ? cn("border-2", tom.borda) : "border border-line",
          bloqueado && "opacity-70",
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-[13px] text-[18px]",
              tom.chip,
            )}
            aria-hidden
          >
            {p.modulo.emoji}
          </div>
          <p className="min-w-0 truncate text-[17px] font-black">
            {p.modulo.titulo}
          </p>
          <span
            className={cn(
              "tnum ml-auto shrink-0 text-[14px] font-black",
              p.percentual === 100
                ? "text-green"
                : p.percentual > 0
                  ? tom.texto
                  : "text-muted",
            )}
          >
            {p.percentual}%
          </span>
        </div>

        <MiniTrilha nos={p.nos} />

        <p className="text-[13px] leading-[1.5] text-muted">
          {p.modulo.descricao}
        </p>

        <Link
          href={`/modulo/${p.modulo.id}`}
          className={cn(
            "mt-auto text-[13px] font-extrabold hover:underline",
            bloqueado ? "pointer-events-none text-subtle" : tom.texto,
          )}
        >
          {bloqueado
            ? "Conclua a unidade anterior"
            : p.percentual === 100
              ? "Revisar unidade →"
              : "Abrir unidade →"}
        </Link>
      </m.div>
    </m.div>
  );
}

/** Mini-trilha de 4 nos ligados por barras (artboard 1c). */
export function MiniTrilha({ nos }: { nos: EstadoNo[] }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {nos.map((estado, i) => (
        <div key={i} className="flex min-w-0 flex-1 items-center gap-1.5">
          <NoMini estado={estado} />
          {i < nos.length - 1 && (
            <span
              className={cn(
                "h-1 min-w-0 flex-1 rounded-full",
                estado === "concluido" ? "bg-green" : "bg-track-deep",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function NoMini({ estado }: { estado: EstadoNo }) {
  if (estado === "concluido") {
    return (
      <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-green text-[12px] font-black text-white">
        ✓
      </span>
    );
  }
  if (estado === "atual") {
    return (
      <m.span
        className="grid size-[32px] shrink-0 place-items-center rounded-full bg-blue text-[13px] font-black text-white"
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
      >
        ▶
      </m.span>
    );
  }
  if (estado === "prova") {
    return (
      <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-gold text-[12px]">
        🏅
      </span>
    );
  }
  return (
    <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-track text-[11px]">
      🔒
    </span>
  );
}
