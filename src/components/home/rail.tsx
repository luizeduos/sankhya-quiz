"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/store/hydration";
import {
  pontosFracos,
  totalPendente,
  useErrorsStore,
} from "@/store/errors";
import {
  semanaAtual,
  streakAtual,
  faltaParaMeta,
  useProgressStore,
} from "@/store/progress";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/* ===========================================================================
 * Card "Revisar erros" — borda coral, contador, pontos fracos (artboard 1b)
 * ======================================================================== */
export function RailRevisarErros() {
  const router = useRouter();
  const pronto = useHydrated();
  const total = useErrorsStore(totalPendente);
  // `registros` e referencia estavel do state; a derivacao vai no useMemo.
  const registros = useErrorsStore((s) => s.registros);
  const fracos = useMemo(() => pontosFracos(registros, 3), [registros]);

  if (!pronto) return <CardSkeleton h={186} />;

  const vazio = total === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-panel bg-surface p-5",
        vazio
          ? "border border-line"
          : "border-2 border-coral-border depth-5 [--depth-color:var(--coral-border)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            "text-[17px] font-black",
            vazio ? "text-ink" : "text-coral-ink",
          )}
        >
          Revisar erros
        </p>
        {!vazio && (
          <m.span
            className="tnum rounded-full bg-coral px-2.5 py-[3px] text-[13px] font-black text-white"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={spring.bouncy}
          >
            {total}
          </m.span>
        )}
      </div>

      {vazio ? (
        <p className="text-[14px] leading-[1.5] text-muted">
          Nenhum erro pendente. Toda questão que você errou já foi dominada.
        </p>
      ) : (
        <p className="text-[14px] leading-[1.5] text-muted">
          Seus pontos fracos:{" "}
          {fracos.map((t, i) => (
            <span key={t}>
              <strong className="text-ink">{t}</strong>
              {i < fracos.length - 2 ? ", " : i === fracos.length - 2 ? " e " : ""}
            </span>
          ))}
          .
        </p>
      )}

      <Button
        variant={vazio ? "outline" : "coral"}
        size="md"
        full
        disabled={vazio}
        className="mt-1"
        onClick={() => router.push("/revisar")}
      >
        {vazio ? "Nada a revisar" : `Praticar ${Math.min(total, 10)} questões`}
      </Button>
    </div>
  );
}

/* ===========================================================================
 * Card "Ofensiva semanal" — 7 barras S T Q Q S S D (artboard 1b)
 * ======================================================================== */
export function RailOfensiva() {
  const pronto = useHydrated();
  const historico = useProgressStore((s) => s.historico);
  const meta = useProgressStore((s) => s.metaDiariaMin);
  const semana = useMemo(() => semanaAtual(historico, meta), [historico, meta]);
  const streak = useProgressStore(streakAtual);
  const falta = useProgressStore(faltaParaMeta);

  if (!pronto) return <CardSkeleton h={182} />;

  return (
    <div className="flex flex-col gap-3 rounded-panel border border-line bg-surface p-5">
      <p className="text-[17px] font-black">Ofensiva semanal</p>
      <div className="flex gap-2">
        {semana.map((d, i) => (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-[38px] w-full items-end overflow-hidden rounded-[12px] bg-track">
              <m.div
                className={cn(
                  "w-full origin-bottom rounded-[12px]",
                  d.bateuMeta
                    ? "bg-orange"
                    : d.parcial
                      ? "bg-orange-dim"
                      : "bg-transparent",
                )}
                style={{ height: 38 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: d.bateuMeta ? 1 : d.parcial ? 0.55 : 0 }}
                transition={{ ...spring.bouncy, delay: i * 0.045 }}
              />
            </div>
            <span
              className={cn(
                "text-[11px] font-extrabold",
                d.hoje ? "text-orange-ink" : "text-subtle",
              )}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-[1.5] text-muted">
        {streak === 0
          ? "Comece hoje e a ofensiva aparece aqui."
          : falta > 0
            ? `${streak} ${streak === 1 ? "dia" : "dias"} seguidos. Faltam ${falta} min hoje para manter a ofensiva.`
            : `${streak} ${streak === 1 ? "dia" : "dias"} seguidos. Meta de hoje batida.`}
      </p>
    </div>
  );
}

function CardSkeleton({ h }: { h: number }) {
  return (
    <div
      className="shimmer rounded-panel border border-line bg-surface"
      style={{ height: h }}
    />
  );
}
