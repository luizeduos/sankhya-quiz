"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion/springs";

const fills = {
  green: "bg-green",
  blue: "bg-blue",
  gold: "bg-gold",
  coral: "bg-coral",
  orange: "bg-orange",
} as const;

/**
 * Barra de progresso da licao.
 *
 * O preenchimento e feito com `scaleX` (composto na GPU) e nao com `width`,
 * que dispararia layout a cada frame. Por isso o `transform-origin: left`.
 * Quando o valor sobe, um brilho percorre a barra uma unica vez — a classe
 * `.sheen` e remontada por `key` para reiniciar a animacao CSS.
 */
export function ProgressBar({
  value,
  max = 100,
  tone = "green",
  height = 14,
  className,
  label,
  glow = true,
}: {
  value: number;
  max?: number;
  tone?: keyof typeof fills;
  height?: number;
  className?: string;
  label?: string;
  glow?: boolean;
}) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const [sheenKey, setSheenKey] = useState(0);
  const prev = useRef(pct);

  useEffect(() => {
    if (pct > prev.current) setSheenKey((k) => k + 1);
    prev.current = pct;
  }, [pct]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-full bg-track", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <m.div
        className={cn("h-full origin-left rounded-full", fills[tone])}
        initial={false}
        animate={{ scaleX: pct }}
        transition={spring.snappy}
        style={{ width: "100%" }}
      />
      {glow && sheenKey > 0 && (
        <span
          key={sheenKey}
          aria-hidden
          className="sheen pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        />
      )}
    </div>
  );
}
