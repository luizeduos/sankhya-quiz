"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useHydrated } from "@/store/hydration";
import { useProgressStore, faltaParaMeta } from "@/store/progress";
import { useSessionStore } from "@/store/session";
import { licaoAtual, moduloAtual } from "@/lib/quiz/progresso";
import { totalQuestoesDaLicao } from "@/data/contagens";
import { licoesPorId, modulosPorId } from "@/data/modulos";
import { spring } from "@/lib/motion/springs";

/**
 * Hero "Continuar de onde parou" do artboard 1c.
 *
 * Gradiente azul-escuro, mascote a esquerda, barra de progresso da licao e
 * botao RETOMAR verde a direita. Quando existe sessao salva no
 * `useSessionStore`, os numeros vem dela ("3 de 8 questões"); quando nao,
 * caem para a proxima licao da trilha.
 */
export function ContinueHero() {
  const router = useRouter();
  const pronto = useHydrated();
  const concluidas = useProgressStore((s) => s.licoesConcluidas);
  const falta = useProgressStore(faltaParaMeta);
  // Tres selectors primitivos em vez de um objeto: um selector que monta
  // objeto novo a cada leitura faz o Zustand v5 re-renderizar sem parar.
  const sessaoLicaoId = useSessionStore((s) => s.licaoId);
  const sessaoRespondidas = useSessionStore((s) => s.respostas.length);
  const sessaoTotal = useSessionStore((s) => s.ordem.length);

  if (!pronto) return <HeroSkeleton />;

  const retomando = sessaoLicaoId !== null && sessaoTotal > 0;
  const licao = retomando
    ? (licoesPorId.get(sessaoLicaoId) ?? licaoAtual(concluidas))
    : licaoAtual(concluidas);
  const modulo = modulosPorId.get(licao.moduloId) ?? moduloAtual(concluidas);

  const total = retomando ? sessaoTotal : totalQuestoesDaLicao(licao.id);
  const feitas = retomando ? sessaoRespondidas : 0;

  return (
    <m.div
      className="flex flex-col gap-5 rounded-hero p-6 text-white sm:flex-row sm:items-center sm:gap-6"
      style={{
        background:
          "linear-gradient(180deg, var(--blue-hero-from), var(--blue-hero-to))",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
    >
      <div className="shrink-0 self-start rounded-hero bg-white/12 p-2 sm:self-auto">
        <Mascot mood={retomando ? "pensando" : "comemorando"} size={82} />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-label font-extrabold uppercase text-white/70">
          {retomando ? "Continuar de onde parou" : "Próxima lição"}
        </p>
        <p className="text-[22px] leading-tight font-black sm:text-[24px]">
          {licao.titulo}
          <span className="text-white/60"> · {modulo.titulo}</span>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ProgressBar
            value={feitas}
            max={total}
            tone="green"
            height={12}
            label="Progresso da lição"
            className="w-[200px] max-w-full bg-white/15"
          />
          <span className="text-[13px] font-extrabold text-white/70 tnum">
            {feitas} de {total} questões
          </span>
        </div>
        {falta > 0 && (
          <p className="text-[13px] text-white/60">
            Faltam{" "}
            <strong className="text-gold">{falta} min</strong> para bater a meta
            de hoje.
          </p>
        )}
      </div>

      <Button
        variant="green"
        size="lg"
        depth="6"
        className="sm:ml-auto"
        onClick={() => router.push(`/licao/${licao.id}`)}
      >
        {retomando ? "Retomar" : "Começar"}
      </Button>
    </m.div>
  );
}

function HeroSkeleton() {
  return (
    <div className="flex items-center gap-6 rounded-hero bg-surface p-6">
      <div className="shimmer size-[98px] shrink-0 rounded-hero bg-track" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="shimmer h-3 w-40 rounded-full bg-track" />
        <div className="shimmer h-6 w-64 max-w-full rounded-full bg-track" />
        <div className="shimmer h-3 w-52 rounded-full bg-track" />
      </div>
      <div className="shimmer hidden h-[54px] w-[150px] rounded-btn bg-track sm:block" />
    </div>
  );
}
