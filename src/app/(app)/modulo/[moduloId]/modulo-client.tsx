"use client";

import { m } from "motion/react";
import Link from "next/link";
import { Trilha } from "@/components/home/trilha";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Chip } from "@/components/ui/chip";
import { SkeletonCard } from "@/components/feedback/states";
import { useHydrated } from "@/store/hydration";
import { useProgressStore } from "@/store/progress";
import { nosDaTrilha, progressoDoModulo } from "@/lib/quiz/progresso";
import type { Fonte, Modulo } from "@/data/schema";
import { spring } from "@/lib/motion/springs";

/**
 * "Guia da unidade": header azul do artboard 1b, a trilha da unidade e o que
 * ela cobre — incluindo as aulas reais do EAD que servem de fonte.
 */
export function ModuloClient({
  modulo,
  anterior,
  seguinte,
  totalQuestoes,
  porTipo,
  fontes,
}: {
  modulo: Modulo;
  anterior: Modulo | null;
  seguinte: Modulo | null;
  /** Agregados calculados no servidor — ver comentario em page.tsx. */
  totalQuestoes: number;
  porTipo: { rotulo: string; n: number }[];
  fontes: Fonte[];
}) {
  const pronto = useHydrated();
  const concluidas = useProgressStore((s) => s.licoesConcluidas);
  const p = pronto ? progressoDoModulo(concluidas, modulo) : null;
  const nos = pronto ? nosDaTrilha(concluidas, modulo) : [];

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-5 py-6 lg:py-8">
      <Link
        href="/"
        className="text-[14px] font-extrabold text-muted hover:text-ink"
      >
        ← Voltar à trilha
      </Link>

      {/* Header da unidade */}
      <m.div
        className="flex flex-wrap items-center gap-4 rounded-panel bg-blue px-5 py-5 text-white"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.soft}
      >
        <div
          className="grid size-[56px] shrink-0 place-items-center rounded-card bg-white/18 text-[26px]"
          aria-hidden
        >
          {modulo.emoji}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-label font-extrabold uppercase opacity-80">
            Unidade {modulo.ordem}
          </p>
          <h1 className="text-[24px] leading-tight font-black">
            {modulo.titulo}
          </h1>
          <p className="text-[14px] text-white/75">{modulo.descricao}</p>
        </div>
        {p && (
          <div className="flex w-full flex-col gap-1.5 sm:ml-auto sm:w-[190px]">
            <ProgressBar
              value={p.concluidas}
              max={p.total}
              tone="green"
              height={12}
              label="Progresso da unidade"
              className="bg-white/18"
            />
            <span className="tnum text-[13px] font-extrabold text-white/80">
              {p.concluidas} de {p.total} lições · {p.percentual}%
            </span>
          </div>
        )}
      </m.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Trilha da unidade */}
        <div className="min-w-0">
          {pronto ? (
            <Trilha nos={nos} />
          ) : (
            <SkeletonCard h={520} />
          )}
        </div>

        {/* Painel lateral */}
        <aside className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 rounded-panel border border-line bg-surface p-5">
            <p className="text-[17px] font-black">Nesta unidade</p>
            <p className="tnum text-[15px] text-muted">
              {totalQuestoes} questões · {modulo.licoes.length} lições
            </p>
            <div className="flex flex-wrap gap-2">
              {porTipo.map((t) => (
                <Chip key={t.rotulo} tone="neutral">
                  {t.rotulo} · {t.n}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-panel border border-line bg-surface p-5">
            <p className="text-[17px] font-black">Lições</p>
            <ol className="flex flex-col gap-2">
              {modulo.licoes.map((l) => (
                <li key={l.id} className="flex flex-col">
                  <Link
                    href={`/licao/${l.id}`}
                    className="text-[14px] font-extrabold text-blue hover:underline"
                  >
                    {l.tipo === "prova" ? "🏅 " : ""}
                    {l.titulo}
                  </Link>
                  <span className="text-[13px] text-subtle">{l.resumo}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2.5 rounded-panel border border-line bg-surface p-5">
            <p className="text-[17px] font-black">Fontes no EAD</p>
            <p className="text-[13px] text-muted">
              Trilha <strong className="text-ink">{modulo.trilhaEad}</strong> no
              ead.sankhya.com.br
            </p>
            <ul className="flex flex-col gap-1.5">
              {fontes.slice(0, 8).map((f) => (
                <li key={f.url}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] leading-snug text-muted underline decoration-dotted underline-offset-2 hover:text-blue"
                  >
                    {f.aula}
                  </a>
                </li>
              ))}
            </ul>
            {fontes.length > 8 && (
              <p className="font-mono text-[12px] text-subtle">
                + {fontes.length - 8} outras aulas
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Navegacao entre unidades */}
      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-5">
        {anterior ? (
          <Link
            href={`/modulo/${anterior.id}`}
            className="text-[14px] font-extrabold text-muted hover:text-ink"
          >
            ← {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {seguinte && (
          <Link
            href={`/modulo/${seguinte.id}`}
            className="ml-auto text-[14px] font-extrabold text-blue hover:underline"
          >
            {seguinte.titulo} →
          </Link>
        )}
      </div>
    </div>
  );
}
