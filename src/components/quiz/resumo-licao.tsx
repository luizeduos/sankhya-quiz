"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/feedback/states";
import { celebrarConquista } from "@/lib/celebrar";
import { useHydrated } from "@/store/hydration";
import { useSessionStore } from "@/store/session";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { licoesPorId, modulosPorId, proximaLicao } from "@/data/modulos";
import { cn, formatNumber } from "@/lib/utils";

/**
 * Resumo da licao.
 *
 * Le `ultimoResumo` do `useSessionStore` (persistido), entao a tela sobrevive
 * a um refresh — o usuario nao perde o resultado por recarregar a pagina.
 */
export function ResumoLicao() {
  const router = useRouter();
  const pronto = useHydrated();
  const reduced = useReducedMotionSafe();
  const resumo = useSessionStore((s) => s.ultimoResumo);

  const total = resumo?.respostas.length ?? 0;
  const acertos = resumo?.respostas.filter((r) => r.correta).length ?? 0;
  const aproveitamento = total > 0 ? acertos / total : 0;
  const excelente = aproveitamento >= 0.8;

  useEffect(() => {
    if (pronto && resumo && excelente) void celebrarConquista();
  }, [pronto, resumo, excelente]);

  if (!pronto) {
    return (
      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4 px-5 py-8">
        <div className="shimmer h-[220px] rounded-hero bg-surface" />
        <div className="shimmer h-[180px] rounded-panel bg-surface" />
      </div>
    );
  }

  if (!resumo || total === 0) {
    return (
      <EmptyState
        emoji="🧭"
        titulo="Nenhum resumo por aqui"
        descricao="Conclua uma lição para ver o resultado detalhado."
        acao={{ rotulo: "Ir para a trilha", onClick: () => router.push("/") }}
      />
    );
  }

  const licao = licoesPorId.get(resumo.licaoId);
  const modulo = licao ? modulosPorId.get(licao.moduloId) : undefined;
  const seguinte = licao ? proximaLicao(licao.id) : undefined;
  const erradas = resumo.respostas.filter((r) => !r.correta);
  const tempoTotal = resumo.respostas.reduce((s, r) => s + r.duracaoMs, 0);

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5 px-5 py-8 lg:py-10">
      {/* Cartao de resultado */}
      <m.div
        className={cn(
          "flex flex-col items-center gap-4 rounded-hero p-7 text-center",
          excelente ? "bg-green-soft" : "bg-gold-soft",
        )}
        initial={{ opacity: 0, y: reduced ? 0 : 22, scale: reduced ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring.soft}
      >
        <m.div
          initial={{ scale: 0, rotate: reduced ? 0 : -18 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.elastic}
        >
          <Mascot mood={excelente ? "comemorando" : "pensando"} size={112} />
        </m.div>

        <p
          className={cn(
            "text-[26px] leading-tight font-black",
            excelente ? "text-green-ink" : "text-gold-ink",
          )}
        >
          {excelente ? "Lição concluída!" : "Concluído — dá para melhorar"}
        </p>

        {licao && (
          <p className="text-[15px] text-muted">
            {modulo?.titulo} · {licao.titulo}
          </p>
        )}

        <div className="grid w-full grid-cols-3 gap-3">
          <Metrica
            rotulo="Acertos"
            valor={`${acertos}/${total}`}
            tom={excelente ? "verde" : "dourado"}
            atraso={0.1}
          />
          <Metrica
            rotulo="XP ganho"
            valor={`+${formatNumber(resumo.xpGanho)}`}
            tom="dourado"
            atraso={0.18}
          />
          <Metrica
            rotulo="Tempo"
            valor={formatarTempo(tempoTotal)}
            tom="neutro"
            atraso={0.26}
          />
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <ProgressBar
            value={acertos}
            max={total}
            tone={excelente ? "green" : "gold"}
            height={14}
            label="Aproveitamento"
          />
          <p className="tnum text-[13px] font-extrabold text-muted">
            {Math.round(aproveitamento * 100)}% de aproveitamento
          </p>
        </div>
      </m.div>

      {/* Questoes erradas voltam para a fila de revisao */}
      {erradas.length > 0 && (
        <m.div
          className="flex flex-col gap-3 rounded-panel border-2 border-coral-border bg-surface p-5"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.soft, delay: 0.14 }}
        >
          <p className="text-[17px] font-black text-coral-ink">
            {erradas.length} {erradas.length === 1 ? "questão" : "questões"} para
            revisar
          </p>
          <ul className="flex flex-col gap-2">
            {erradas.map((r, i) => (
              <m.li
                key={r.questaoId}
                className="flex gap-2.5 rounded-card bg-coral-soft px-3.5 py-3"
                initial={{ opacity: 0, x: reduced ? 0 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring.soft, delay: 0.2 + i * 0.05 }}
              >
                <span aria-hidden className="shrink-0 font-black text-coral">
                  ✕
                </span>
                <span className="min-w-0 text-[14px] leading-snug text-coral-ink2">
                  {r.enunciado}
                </span>
              </m.li>
            ))}
          </ul>
          <p className="text-[13px] text-muted">
            Elas entraram em <strong className="text-ink">Revisar erros</strong> e
            voltam até você dominá-las.
          </p>
        </m.div>
      )}

      {/* Acoes */}
      <m.div
        className="flex flex-col gap-3 sm:flex-row"
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.soft, delay: 0.3 }}
      >
        {erradas.length > 0 && (
          <Button
            variant="coral"
            size="lg"
            full
            onClick={() => router.push("/revisar")}
          >
            Revisar erros
          </Button>
        )}
        {seguinte ? (
          <Button
            variant="green"
            size="lg"
            full
            onClick={() => router.push(`/licao/${seguinte.id}`)}
          >
            Próxima lição
          </Button>
        ) : (
          <Button variant="green" size="lg" full onClick={() => router.push("/")}>
            Voltar à trilha
          </Button>
        )}
      </m.div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mx-auto text-[14px] font-extrabold text-muted hover:text-ink"
      >
        Voltar à trilha
      </button>
    </div>
  );
}

function Metrica({
  rotulo,
  valor,
  tom,
  atraso,
}: {
  rotulo: string;
  valor: string;
  tom: "verde" | "dourado" | "neutro";
  atraso: number;
}) {
  return (
    <m.div
      className="flex flex-col items-center gap-0.5 rounded-card bg-surface px-2 py-3"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring.bouncy, delay: atraso }}
    >
      <span
        className={cn(
          "tnum text-[20px] font-black",
          tom === "verde"
            ? "text-green-ink"
            : tom === "dourado"
              ? "text-gold-ink"
              : "text-ink",
        )}
      >
        {valor}
      </span>
      <span className="text-[11px] font-extrabold tracking-[1px] text-subtle uppercase">
        {rotulo}
      </span>
    </m.div>
  );
}

function formatarTempo(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}
