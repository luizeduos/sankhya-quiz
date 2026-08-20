"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  EmptyState,
  ErrorState,
  SkeletonCard,
} from "@/components/feedback/states";
import { Mascot } from "@/components/mascot/mascot";
import { useHydrated } from "@/store/hydration";
import {
  ACERTOS_PARA_DOMINAR,
  filaDeRevisao,
  pontosFracos,
  useErrorsStore,
} from "@/store/errors";
import { modulosPorId } from "@/data/modulos";
import type { Questao } from "@/data/schema";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";
import { carregarQuestoes } from "./actions";

const TAMANHO_SESSAO = 10;

/**
 * "Revisar erros": repesca as questoes erradas.
 *
 * A fila vem do `useErrorsStore` (localStorage), ordenada pelas mais erradas.
 * Uma questao sai da fila depois de ACERTOS_PARA_DOMINAR acertos consecutivos.
 *
 * O CONTEUDO das questoes nao vem do bundle: a lista usa o enunciado guardado
 * no proprio registro de erro, e a sessao busca as questoes completas por
 * server action. Assim o banco (~90 kB gzip) nunca chega ao navegador.
 */
export function RevisarClient() {
  const router = useRouter();
  const pronto = useHydrated();
  // Selecionamos `registros` (referencia estavel) e derivamos no useMemo:
  // selector que devolve array novo faz o Zustand v5 entrar em loop de render.
  const registros = useErrorsStore((s) => s.registros);
  const fila = useMemo(() => filaDeRevisao(registros), [registros]);
  const fracos = useMemo(() => pontosFracos(registros, 5), [registros]);

  const [questoes, setQuestoes] = useState<Questao[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);

  const daSessao = fila.slice(0, TAMANHO_SESSAO);

  async function iniciar() {
    setCarregando(true);
    setErro(false);
    try {
      const qs = await carregarQuestoes(daSessao.map((r) => r.questaoId));
      if (qs.length === 0) {
        setErro(true);
        return;
      }
      setQuestoes(qs);
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  if (!pronto) {
    return (
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-4 px-5 py-7">
        <SkeletonCard h={132} className="rounded-hero" />
        <SkeletonCard h={280} />
      </div>
    );
  }

  if (fila.length === 0) {
    return (
      <EmptyState
        mascote="comemorando"
        titulo="Nenhum erro pendente"
        descricao="Você dominou tudo o que errou até aqui. Avance na trilha para encontrar novos desafios."
        acao={{ rotulo: "Ir para a trilha", onClick: () => router.push("/") }}
      />
    );
  }

  if (erro) {
    return (
      <ErrorState
        descricao="Não conseguimos carregar as questões desta revisão. Verifique sua conexão e tente novamente."
        onTentar={() => void iniciar()}
      />
    );
  }

  if (questoes) {
    return (
      <QuizEngine
        licao={null}
        questoes={questoes}
        modo="revisao"
        titulo={`Revisão · ${questoes.length} questões`}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-5 py-7 lg:py-9">
      <m.div
        className="flex flex-wrap items-center gap-4 rounded-hero border-2 border-coral-border bg-surface p-5 sm:p-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.soft}
      >
        <Mascot mood="pensando" size={84} className="shrink-0" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-[24px] leading-tight font-black text-coral-ink">
            {fila.length} {fila.length === 1 ? "questão" : "questões"} para
            dominar
          </h1>
          <p className="text-[15px] leading-relaxed text-muted">
            Cada questão sai desta lista após{" "}
            <strong className="text-ink">{ACERTOS_PARA_DOMINAR} acertos</strong>{" "}
            seguidos. Sem limite de tentativas.
          </p>
          {fracos.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {fracos.map((t) => (
                <Chip key={t} tone="coral">
                  {t}
                </Chip>
              ))}
            </div>
          )}
        </div>
        <Button
          variant="coral"
          size="lg"
          depth="6"
          loading={carregando}
          className="w-full sm:ml-auto sm:w-auto"
          onClick={() => void iniciar()}
        >
          {carregando
            ? "Carregando"
            : `Praticar ${daSessao.length} ${daSessao.length === 1 ? "questão" : "questões"}`}
        </Button>
      </m.div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[12px] font-extrabold tracking-[1.4px] text-subtle uppercase">
          Fila de revisão
        </p>
        {fila.map((r, i) => {
          const modulo = modulosPorId.get(r.moduloId);
          const naSessao = i < TAMANHO_SESSAO;

          return (
            <m.div
              key={r.questaoId}
              className={cn(
                "flex flex-col gap-2 rounded-panel border bg-surface p-4",
                naSessao ? "border-coral-border" : "border-line",
              )}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: naSessao ? 1 : 0.75, y: 0 }}
              transition={{ ...spring.soft, delay: Math.min(i, 8) * 0.04 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {modulo && (
                  <Chip tone="neutral">
                    {modulo.emoji} {modulo.titulo}
                  </Chip>
                )}
                <span className="tnum text-[12px] font-extrabold text-coral">
                  {r.tentativas} {r.tentativas === 1 ? "erro" : "erros"}
                </span>
                {r.acertosSeguidos > 0 && (
                  <span className="tnum text-[12px] font-extrabold text-green-ink">
                    {r.acertosSeguidos}/{ACERTOS_PARA_DOMINAR} para dominar
                  </span>
                )}
                {naSessao && (
                  <span className="ml-auto text-[11px] font-extrabold tracking-[1px] text-coral-ink uppercase">
                    nesta sessão
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-snug font-bold">{r.enunciado}</p>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
