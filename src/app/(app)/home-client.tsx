"use client";

import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ContinueHero } from "@/components/home/continue-hero";
import { ModuloCard } from "@/components/home/modulo-card";
import {
  RailOfensiva,
  RailRanking,
  RailRevisarErros,
} from "@/components/home/rail";
import { Trilha } from "@/components/home/trilha";
import { MetaDiaria } from "@/components/chrome/sidebar";
import { SectionLabel } from "@/components/ui/card";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useHydrated } from "@/store/hydration";
import { useProgressStore } from "@/store/progress";
import {
  moduloAtual,
  nosDaTrilha,
  progressoDeTodos,
} from "@/lib/quiz/progresso";
import { modulos } from "@/data/modulos";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

type Filtro = "todos" | "andamento" | "nao-iniciados";

/**
 * Home hibrida, combinando as duas direcoes do protótipo:
 *   - sidebar, HUD bar, header de unidade, trilha serpenteante e rail
 *     direito vem do artboard 1b;
 *   - hero "Continuar de onde parou", grid de cards de modulo com mini-trilha
 *     e bottom tab bar vem do 1c.
 */
export function HomeClient({ primeiroNome }: { primeiroNome: string }) {
  const pronto = useHydrated();
  // A saudacao depende da hora LOCAL do usuario. O servidor roda em UTC, entao
  // calcula-la no render causaria mismatch de hidratacao em qualquer fuso
  // diferente de UTC. So renderizamos depois de montar no cliente.
  const montado = useMounted();
  const concluidas = useProgressStore((s) => s.licoesConcluidas);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const modulo = pronto ? moduloAtual(concluidas) : modulos[0];
  const nos = pronto ? nosDaTrilha(concluidas) : [];
  const progresso = pronto ? progressoDeTodos(concluidas) : [];

  const filtrados = progresso.filter((p) =>
    filtro === "andamento"
      ? p.percentual > 0 && p.percentual < 100
      : filtro === "nao-iniciados"
        ? p.percentual === 0
        : true,
  );

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-6 lg:px-10 lg:py-7">
      {/* Saudacao — artboard 1c */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[26px] leading-tight font-black tracking-[-0.5px] lg:text-[34px]">
          {montado ? saudacao() : "Olá"}, {primeiroNome}
        </h1>
        <p className="text-[15px] text-muted">
          Sua trilha continua de onde você parou.
        </p>
      </div>

      <ContinueHero />

      <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
        {/* Coluna principal */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Header da unidade — artboard 1b */}
          <m.div
            className="flex flex-wrap items-center gap-4 rounded-panel bg-blue px-5 py-4 text-white lg:px-[22px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.soft}
          >
            <div
              className="grid size-[52px] shrink-0 place-items-center rounded-card bg-white/18 text-[22px] font-black"
              aria-hidden
            >
              {modulo.ordem}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-label font-extrabold uppercase opacity-80">
                Unidade {modulo.ordem}
              </p>
              <p className="truncate text-[20px] font-black lg:text-[22px]">
                {modulo.titulo}
              </p>
            </div>
            <Link
              href={`/modulo/${modulo.id}`}
              className="pressable ml-auto rounded-card bg-white px-4 py-2.5 text-[13px] font-black tracking-[0.6px] text-blue uppercase depth-4 [--depth-color:#cfe1f6] lg:px-[18px]"
            >
              Guia da unidade
            </Link>
          </m.div>

          {/* Trilha serpenteante — artboard 1b */}
          {pronto ? (
            <Trilha nos={nos} />
          ) : (
            <div className="shimmer h-[560px] rounded-panel bg-surface" />
          )}

          {/* Grid de modulos — artboard 1c */}
          <div className="flex items-center gap-3">
            <SectionLabel>Módulos</SectionLabel>
            <span className="h-px flex-1 bg-line" />
            <div className="flex gap-1.5">
              {(
                [
                  ["todos", "Todos"],
                  ["andamento", "Em andamento"],
                  ["nao-iniciados", "Não iniciados"],
                ] as const
              ).map(([valor, rotulo]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setFiltro(valor)}
                  aria-pressed={filtro === valor}
                  className={cn(
                    "rounded-chip px-[11px] py-[5px] text-[12px] font-extrabold transition-colors",
                    filtro === valor
                      ? "bg-surface-2 text-ink"
                      : "text-subtle hover:text-muted",
                  )}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>

          {pronto ? (
            filtrados.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtrados.map((p, i) => (
                  <ModuloCard
                    key={p.modulo.id}
                    p={p}
                    emAndamento={p.modulo.id === modulo.id}
                    indice={i}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-panel border border-line bg-surface px-5 py-8 text-center text-[15px] text-muted">
                Nenhum módulo neste filtro.{" "}
                <button
                  type="button"
                  className="font-extrabold text-blue hover:underline"
                  onClick={() => setFiltro("todos")}
                >
                  Ver todos
                </button>
              </p>
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="shimmer h-[186px] rounded-[22px] bg-surface"
                />
              ))}
            </div>
          )}
        </div>

        {/* Rail direita — artboard 1b */}
        <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[330px]">
          <RailRevisarErros />
          <RailRanking />
          <RailOfensiva />
          <div className="lg:hidden">
            <MetaDiaria />
          </div>
        </aside>
      </div>
    </div>
  );
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
