"use client";

import { m } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

export type EstadoCard = "neutro" | "selecionado" | "correto" | "errado";

/**
 * Card de alternativa nos 4 estados do artboard 1a.
 *
 * A borda inferior de 4px (em vez de sombra) e o que da o relevo aos cards
 * de alternativa no protótipo; ela nao muda de espessura, so de cor, entao a
 * troca de estado nunca reflui o layout.
 *
 * No erro, o card faz um shake amortecido em `x` — keyframes de transform,
 * nada de animar borda ou sombra.
 */
const ESTILO: Record<EstadoCard, string> = {
  neutro: "border-line-strong bg-surface text-ink hover:border-blue/45",
  selecionado: "border-blue bg-blue-soft text-blue-ink",
  correto: "border-green bg-green-soft text-green-ink",
  errado: "border-coral bg-coral-soft text-coral-ink",
};

const MARCADOR: Record<EstadoCard, string> = {
  neutro: "border-2 border-line-strong text-subtle",
  selecionado: "border-2 border-blue text-blue",
  correto: "bg-green text-white",
  errado: "bg-coral text-white",
};

export function AnswerCard({
  estado,
  marcador,
  children,
  onClick,
  disabled,
  indice = 0,
  className,
  shake,
}: {
  estado: EstadoCard;
  /** Numero, letra ou glifo do quadradinho a esquerda. */
  marcador: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  indice?: number;
  className?: string;
  /** Dispara o shake (usado quando esta e a alternativa errada escolhida). */
  shake?: boolean;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <m.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={estado === "selecionado"}
      className={cn(
        "flex w-full items-center gap-3 rounded-btn border-2 border-b-4 px-4 py-3.5 text-left",
        "text-[15px] leading-snug font-bold transition-colors duration-150",
        ESTILO[estado],
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={
        shake && !reduced
          ? { opacity: 1, y: 0, x: [0, -9, 7, -5, 3, 0] }
          : { opacity: 1, y: 0, x: 0 }
      }
      transition={
        shake && !reduced
          ? { duration: 0.44, ease: "easeOut" }
          : { ...spring.soft, delay: reduced ? 0 : indice * 0.055 }
      }
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.995 }}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-[26px] shrink-0 place-items-center rounded-chip text-[12px] font-extrabold",
          MARCADOR[estado],
        )}
      >
        {marcador}
      </span>
      <span className="min-w-0">{children}</span>
    </m.button>
  );
}
