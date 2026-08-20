"use client";

import { m } from "motion/react";
import { useMemo } from "react";
import { Avatar } from "@/components/chrome/hud";
import { Reveal } from "@/components/motion/reveal";
import { SkeletonCard } from "@/components/feedback/states";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  AnelProgresso,
  BarrasPorModulo,
  HeatmapDias,
} from "@/components/perfil/graficos";
import { useHydrated } from "@/store/hydration";
import {
  XP_POR_NIVEL,
  nivelDoXp,
  streakAtual,
  useProgressStore,
  xpNoNivel,
} from "@/store/progress";
import { totalPendente, useErrorsStore } from "@/store/errors";
import { progressoDeTodos } from "@/lib/quiz/progresso";
import { licoes } from "@/data/modulos";
import { spring } from "@/lib/motion/springs";
import { dayKey, formatNumber } from "@/lib/utils";

/**
 * Perfil com reveal on-scroll. Todos os graficos sao SVG proprio (ver
 * `components/perfil/graficos.tsx`), sem biblioteca de charts.
 */
export function PerfilClient({
  nome,
  email,
  cargo,
  imagem,
}: {
  nome: string;
  email: string;
  cargo: string;
  imagem: string | null;
}) {
  const pronto = useHydrated();
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore(streakAtual);
  const meta = useProgressStore((s) => s.metaDiariaMin);
  const historico = useProgressStore((s) => s.historico);
  const concluidas = useProgressStore((s) => s.licoesConcluidas);
  const pendentes = useErrorsStore(totalPendente);

  const dias = useMemo(() => ultimos(56, historico), [historico]);

  if (!pronto) {
    return (
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-4 px-5 py-7">
        <SkeletonCard h={160} className="rounded-hero" />
        <SkeletonCard h={220} />
        <SkeletonCard h={280} />
      </div>
    );
  }

  const nivel = nivelDoXp(xp);
  const noNivel = xpNoNivel(xp);
  const progresso = progressoDeTodos(concluidas);
  const totalLicoes = licoes.length;
  const feitas = Object.keys(concluidas).length;
  const totalQuestoes = Object.values(historico).reduce(
    (s, d) => s + d.questoes,
    0,
  );
  const totalAcertos = Object.values(historico).reduce(
    (s, d) => s + d.acertos,
    0,
  );
  const totalMinutos = Object.values(historico).reduce(
    (s, d) => s + d.minutos,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-5 py-7 lg:py-9">
      {/* Cabecalho do perfil */}
      <m.div
        className="flex flex-wrap items-center gap-4 rounded-hero border border-line bg-surface p-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.soft}
      >
        <Avatar nome={nome} imagem={imagem} size={76} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-[24px] leading-tight font-black">{nome}</h1>
          <p className="text-[14px] text-muted">
            Nível {nivel} · {cargo}
          </p>
          {email && (
            <p className="font-mono text-[12px] text-subtle">{email}</p>
          )}
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:ml-auto sm:w-[200px]">
          <ProgressBar
            value={noNivel}
            max={XP_POR_NIVEL}
            tone="gold"
            height={12}
            label="Progresso do nível"
          />
          <span className="tnum text-[13px] font-extrabold text-muted">
            {noNivel}/{XP_POR_NIVEL} XP para o nível {nivel + 1}
          </span>
        </div>
      </m.div>

      {/* Numeros principais */}
      <Reveal stagger={0.06} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Numero valor={formatNumber(xp)} rotulo="XP total" tom="gold" />
        <Numero valor={String(streak)} rotulo="dias seguidos" tom="orange" />
        <Numero
          valor={
            totalQuestoes > 0
              ? `${Math.round((totalAcertos / totalQuestoes) * 100)}%`
              : "—"
          }
          rotulo="taxa de acerto"
          tom="violet"
        />
        <Numero valor={String(pendentes)} rotulo="a revisar" tom="coral" />
      </Reveal>

      {/* Progresso geral */}
      <Reveal className="flex flex-wrap items-center gap-6 rounded-panel border border-line bg-surface p-6">
        <AnelProgresso
          valor={totalLicoes > 0 ? feitas / totalLicoes : 0}
          rotulo="trilha"
        />
        <div className="flex min-w-[220px] flex-1 flex-col gap-2.5">
          <p className="text-[17px] font-black">Progresso geral</p>
          <Linha
            rotulo="Lições concluídas"
            valor={`${feitas} de ${totalLicoes}`}
          />
          <Linha
            rotulo="Questões respondidas"
            valor={formatNumber(totalQuestoes)}
          />
          <Linha
            rotulo="Taxa de acerto"
            valor={
              totalQuestoes > 0
                ? `${Math.round((totalAcertos / totalQuestoes) * 100)}%`
                : "—"
            }
          />
          <Linha
            rotulo="Tempo praticado"
            valor={
              totalMinutos >= 60
                ? `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}min`
                : `${totalMinutos} min`
            }
          />
        </div>
      </Reveal>

      {/* Desempenho por modulo */}
      <Reveal className="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6">
        <p className="text-[17px] font-black">Progresso por módulo</p>
        <BarrasPorModulo
          dados={progresso.map((p) => ({
            rotulo: p.modulo.titulo,
            emoji: p.modulo.emoji,
            valor: p.fracao,
            tom: p.modulo.tone,
          }))}
        />
      </Reveal>

      {/* Heatmap */}
      <Reveal className="flex flex-col gap-3 rounded-panel border border-line bg-surface p-6">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-[17px] font-black">Últimas 8 semanas</p>
          <p className="text-[13px] text-muted">
            intensidade proporcional aos minutos praticados
          </p>
        </div>
        <HeatmapDias dias={dias} meta={meta} />
        <div className="flex items-center gap-2 text-[12px] text-subtle">
          <span>menos</span>
          <span className="size-[11px] rounded-[3px] bg-track" />
          <span className="size-[11px] rounded-[3px] bg-green opacity-35" />
          <span className="size-[11px] rounded-[3px] bg-green opacity-65" />
          <span className="size-[11px] rounded-[3px] bg-green" />
          <span>mais</span>
        </div>
      </Reveal>
    </div>
  );
}

function Numero({
  valor,
  rotulo,
  tom,
}: {
  valor: string;
  rotulo: string;
  tom: "gold" | "orange" | "violet" | "coral";
}) {
  const cor = {
    gold: "text-gold-ink",
    orange: "text-orange-ink",
    violet: "text-violet-ink2",
    coral: "text-coral-ink",
  }[tom];

  return (
    <div className="flex flex-col gap-0.5 rounded-panel border border-line bg-surface px-4 py-3.5">
      <span className={`tnum text-[24px] font-black ${cor}`}>{valor}</span>
      <span className="text-[11px] font-extrabold tracking-[1px] text-subtle uppercase">
        {rotulo}
      </span>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5 last:border-0">
      <span className="text-[14px] text-muted">{rotulo}</span>
      <span className="tnum text-[15px] font-extrabold">{valor}</span>
    </div>
  );
}

/** Ultimos N dias em ordem cronologica, com zeros nos dias sem atividade. */
function ultimos(
  n: number,
  historico: Record<string, { minutos: number }>,
): { key: string; minutos: number }[] {
  const hoje = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - (n - 1 - i));
    const key = dayKey(d);
    return { key, minutos: historico[key]?.minutos ?? 0 };
  });
}
