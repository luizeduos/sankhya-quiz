"use client";

import { m } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Graficos em SVG escrito a mao, no lugar do Recharts.
 *
 * Motivo: Recharts pesa ~100 KB gzip e sozinho estouraria a meta de 150 KB de
 * First Load JS nesta rota. O protótipo pede apenas barras de progresso por
 * modulo, um anel e um heatmap semanal — todos triviais em SVG, com o bonus de
 * animarem em `transform` e herdarem os tokens de cor do tema.
 */

const COR_TOM: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--green)",
  gold: "var(--gold)",
  coral: "var(--coral)",
  violet: "var(--violet)",
  orange: "var(--orange)",
};

/** Barras horizontais de progresso por modulo. */
export function BarrasPorModulo({
  dados,
}: {
  dados: { rotulo: string; emoji: string; valor: number; tom: string }[];
}) {
  const reduced = useReducedMotionSafe();

  return (
    <ul className="flex flex-col gap-3">
      {dados.map((d, i) => (
        <li key={d.rotulo} className="flex items-center gap-3">
          <span aria-hidden className="w-5 shrink-0 text-[15px]">
            {d.emoji}
          </span>
          <span className="w-[104px] shrink-0 truncate text-[13px] font-extrabold">
            {d.rotulo}
          </span>
          <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-track">
            <m.div
              className="h-full origin-left rounded-full"
              style={{ background: COR_TOM[d.tom] ?? "var(--blue)", width: "100%" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: d.valor }}
              viewport={{ once: true }}
              transition={
                reduced
                  ? { duration: 0.12 }
                  : { ...spring.soft, delay: i * 0.06 }
              }
            />
          </div>
          <span className="tnum w-9 shrink-0 text-right text-[13px] font-extrabold text-muted">
            {Math.round(d.valor * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Anel de progresso geral, com o numero no centro. */
export function AnelProgresso({
  valor,
  tamanho = 132,
  espessura = 13,
  rotulo,
}: {
  valor: number;
  tamanho?: number;
  espessura?: number;
  rotulo: string;
}) {
  const reduced = useReducedMotionSafe();
  const r = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: tamanho, height: tamanho }}>
      <svg
        width={tamanho}
        height={tamanho}
        viewBox={`0 0 ${tamanho} ${tamanho}`}
        role="img"
        aria-label={`${rotulo}: ${Math.round(valor * 100)}%`}
        className="-rotate-90"
      >
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth={espessura}
        />
        <m.circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          fill="none"
          stroke="var(--green)"
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ * (1 - valor) }}
          viewport={{ once: true }}
          transition={
            reduced ? { duration: 0.12 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-[28px] leading-none font-black">
          {Math.round(valor * 100)}%
        </span>
        <span className="text-[11px] font-extrabold tracking-[1px] text-subtle uppercase">
          {rotulo}
        </span>
      </div>
    </div>
  );
}

/**
 * Heatmap dos ultimos N dias. Cada celula e um quadrado com opacidade
 * proporcional aos minutos praticados — nenhuma animacao em loop, so a
 * entrada em cascata.
 */
export function HeatmapDias({
  dias,
  meta,
}: {
  dias: { key: string; minutos: number }[];
  meta: number;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <div className="flex flex-wrap gap-1.5">
      {dias.map((d, i) => {
        const intensidade =
          d.minutos === 0 ? 0 : Math.min(1, 0.25 + (d.minutos / meta) * 0.75);
        return (
          <m.span
            key={d.key}
            title={`${formatarDia(d.key)} · ${d.minutos} min`}
            className={cn(
              "size-[15px] rounded-[4px]",
              intensidade === 0 && "bg-track",
            )}
            style={
              intensidade > 0
                ? {
                    background: "var(--green)",
                    opacity: intensidade,
                  }
                : undefined
            }
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={
              reduced
                ? { duration: 0.1 }
                : { ...spring.bouncy, delay: Math.min(i, 40) * 0.008 }
            }
          />
        );
      })}
    </div>
  );
}

function formatarDia(key: string) {
  const [, m, d] = key.split("-");
  return `${d}/${m}`;
}
