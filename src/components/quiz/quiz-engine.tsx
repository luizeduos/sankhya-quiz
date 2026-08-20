"use client";

import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Feedback } from "./feedback";
import { AssociarColunasView } from "./tipos/associar-colunas";
import { CompletarLacunaView } from "./tipos/completar-lacuna";
import { MultiplaEscolhaView, VerdadeiroFalsoView } from "./tipos/escolha";
import { OrdenarPassosView } from "./tipos/ordenar-passos";
import { RespostaCurtaView } from "./tipos/resposta-curta";
import {
  respostaCompleta,
  serializar,
  verificar,
  type Resposta,
  type Veredito,
} from "@/lib/quiz/engine";
import { celebrarAcerto } from "@/lib/celebrar";
import { useErrorsStore } from "@/store/errors";
import { useProgressStore, XP_POR_DIFICULDADE } from "@/store/progress";
import { useSessionStore, type ModoSessao } from "@/store/session";
import { useXpFlight } from "@/store/xp-flight";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { TIPO_LABEL, type Questao } from "@/data/schema";
import type { Licao } from "@/data/schema";

/**
 * Motor de quiz: seleção -> VERIFICAR -> feedback -> CONTINUAR -> resumo.
 *
 * Estados por questao:
 *   "respondendo" — o usuario monta a resposta, VERIFICAR habilita quando
 *                   ela esta completa;
 *   "revelado"    — cards travados, painel de feedback aberto, botao vira
 *                   CONTINUAR.
 */
export function QuizEngine({
  licao,
  questoes,
  modo,
  titulo,
}: {
  licao: Licao | null;
  questoes: Questao[];
  modo: ModoSessao;
  titulo: string;
}) {
  const router = useRouter();
  const reduced = useReducedMotionSafe();

  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [veredito, setVeredito] = useState<Veredito | null>(null);
  const [xpGanho, setXpGanho] = useState(0);
  // Preenchido no efeito abaixo: `Date.now()` durante o render seria impuro
  // e produziria valores diferentes entre servidor e cliente.
  const inicioQuestao = useRef<number>(0);

  const registrarAcertoXp = useProgressStore((s) => s.registrarAcerto);
  const registrarErroVida = useProgressStore((s) => s.registrarErro);
  const registrarTempo = useProgressStore((s) => s.registrarTempo);
  const concluirLicao = useProgressStore((s) => s.concluirLicao);

  const marcarErro = useErrorsStore((s) => s.registrarErro);
  const marcarAcerto = useErrorsStore((s) => s.registrarAcerto);

  const iniciarSessao = useSessionStore((s) => s.iniciar);
  const responderSessao = useSessionStore((s) => s.responder);
  const avancarSessao = useSessionStore((s) => s.avancar);
  const encerrarSessao = useSessionStore((s) => s.encerrar);
  const lancarXp = useXpFlight((s) => s.lancar);

  const questao = questoes[indice];
  const total = questoes.length;
  const ultima = indice === total - 1;

  // Marca o inicio de cada questao. Roda apos o commit, entao o render
  // permanece puro.
  useEffect(() => {
    inicioQuestao.current = Date.now();
  }, [indice]);

  /* --- Abre a sessao uma unica vez ------------------------------------- */
  const sessaoIniciada = useRef(false);
  useEffect(() => {
    if (sessaoIniciada.current || questoes.length === 0) return;
    sessaoIniciada.current = true;
    iniciarSessao({
      licaoId: licao?.id ?? `revisao-${Date.now()}`,
      modo,
      ordem: questoes.map((q) => q.id),
    });
  }, [iniciarSessao, licao, modo, questoes]);

  /* --- Cronometro de tempo praticado ----------------------------------- */
  useEffect(() => {
    // Acumula em blocos de 15s enquanto a aba esta visivel. Assim a "meta
    // diária" mede tempo real de estudo, e nao aba aberta em segundo plano.
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") registrarTempo(15);
    }, 15_000);
    return () => window.clearInterval(id);
  }, [registrarTempo]);

  const respostas = useSessionStore((s) => s.respostas);

  /* --- Acoes ----------------------------------------------------------- */
  const podeVerificar = useMemo(
    () => (questao ? respostaCompleta(questao, resposta) : false),
    [questao, resposta],
  );

  const verificarAgora = useCallback(() => {
    if (!questao || !resposta || veredito) return;

    const v = verificar(questao, resposta);
    setVeredito(v);

    const duracaoMs = inicioQuestao.current
      ? Date.now() - inicioQuestao.current
      : 0;
    responderSessao({
      questaoId: questao.id,
      enunciado: questao.enunciado,
      correta: v.correta,
      resposta: serializar(resposta),
      duracaoMs,
    });

    if (v.correta) {
      const ganho = registrarAcertoXp(questao.dificuldade);
      setXpGanho(ganho);
      lancarXp(ganho);
      marcarAcerto(questao.id);
      void celebrarAcerto();
    } else {
      registrarErroVida();
      marcarErro({
        questaoId: questao.id,
        moduloId: questao.moduloId,
        licaoId: questao.licaoId,
        tags: questao.tags,
        enunciado: questao.enunciado,
        resposta: serializar(resposta),
      });
    }
  }, [
    questao,
    resposta,
    veredito,
    responderSessao,
    registrarAcertoXp,
    lancarXp,
    marcarAcerto,
    registrarErroVida,
    marcarErro,
  ]);

  const continuar = useCallback(() => {
    if (!veredito) return;
    avancarSessao();

    if (ultima) {
      // `respostas` ja inclui a ultima: `responderSessao` roda em
      // `verificarAgora`, e o clique em CONTINUAR acontece num render depois.
      const finais = respostas;
      const corretas = finais.filter((r) => r.correta).length;
      // Divide pelo numero de respostas dadas, nao pelo total de questoes:
      // questoes puladas nao devem contar como erro no aproveitamento.
      const aprov = finais.length > 0 ? corretas / finais.length : 0;
      if (licao) concluirLicao(licao.id, aprov);
      const xpTotal = finais.reduce(
        (s, r) =>
          s +
          (r.correta
            ? XP_POR_DIFICULDADE[
                questoes.find((q) => q.id === r.questaoId)?.dificuldade ?? 1
              ]
            : 0),
        0,
      );
      encerrarSessao(xpTotal);
      router.push(licao ? `/licao/${licao.id}/resumo` : "/revisar/resumo");
      return;
    }

    setVeredito(null);
    setResposta(null);
    setXpGanho(0);
    inicioQuestao.current = Date.now();
    setIndice((i) => i + 1);
  }, [
    veredito,
    avancarSessao,
    ultima,
    respostas,
    licao,
    concluirLicao,
    questoes,
    encerrarSessao,
    router,
  ]);

  /* --- Atalhos de teclado ---------------------------------------------- */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Enter" || e.target instanceof HTMLInputElement) return;
      e.preventDefault();
      if (veredito) continuar();
      else if (podeVerificar) verificarAgora();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [veredito, continuar, podeVerificar, verificarAgora]);

  if (!questao) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Cabecalho: sair, progresso, contador */}
      <div className="flex items-center gap-3 px-5 pt-5 lg:px-10">
        <button
          type="button"
          onClick={() => {
            useSessionStore.getState().abandonar();
            router.push("/");
          }}
          aria-label="Sair da lição"
          className="grid size-9 shrink-0 place-items-center rounded-card text-[20px] font-black text-subtle hover:bg-track hover:text-ink"
        >
          ✕
        </button>

        <ProgressBar
          value={indice + (veredito ? 1 : 0)}
          max={total}
          tone={modo === "revisao" ? "coral" : "green"}
          height={14}
          label="Progresso da lição"
          className="flex-1"
        />

        <span className="tnum shrink-0 text-[14px] font-extrabold text-muted">
          {indice + 1}/{total}
        </span>
      </div>

      {/* Corpo */}
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-5 px-5 py-6 lg:px-0">
        {/* Titulo compartilhado com o no da trilha */}
        <div className="flex flex-wrap items-center gap-2.5">
          {licao && (
            <m.span
              layoutId={`no-${licao.id}`}
              className="grid size-9 place-items-center rounded-full bg-blue text-[14px] font-black text-white"
              transition={spring.soft}
            >
              ▶
            </m.span>
          )}
          <span className="text-[14px] font-extrabold text-muted">{titulo}</span>
          <Chip
            tone={modo === "revisao" ? "coral" : "blue"}
            className="ml-auto"
          >
            {TIPO_LABEL[questao.tipo]}
          </Chip>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={questao.id}
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: reduced ? 0 : 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -26 }}
            transition={spring.soft}
          >
            {questao.contexto && (
              <p className="rounded-card border-l-4 border-gold bg-gold-soft px-4 py-3 text-[14px] leading-relaxed text-gold-ink2">
                {questao.contexto}
              </p>
            )}

            <h1 className="text-[22px] leading-[1.25] font-extrabold lg:text-[26px]">
              {questao.enunciado}
            </h1>

            <TipoQuestao
              questao={questao}
              resposta={resposta}
              onResponder={setResposta}
              revelado={veredito !== null}
              onEnviar={verificarAgora}
            />
          </m.div>
        </AnimatePresence>

        <AnimatePresence>
          {veredito && (
            <Feedback key="feedback" veredito={veredito} xpGanho={xpGanho} />
          )}
        </AnimatePresence>
      </div>

      {/* Rodape fixo com a acao principal */}
      <div className="sticky bottom-0 border-t border-line bg-bg/95 px-5 py-4 backdrop-blur-sm lg:px-10">
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-3">
          {!veredito && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                // Pular conta como nao respondida e nao gasta vida.
                if (ultima) continuarSemResposta();
                else {
                  setResposta(null);
                  setIndice((i) => i + 1);
                  inicioQuestao.current = Date.now();
                }
              }}
              className="hidden sm:inline-flex"
            >
              Pular
            </Button>
          )}
          <Button
            variant={
              veredito ? (veredito.correta ? "green" : "coral") : "green"
            }
            size="lg"
            full
            disabled={!veredito && !podeVerificar}
            onClick={veredito ? continuar : verificarAgora}
          >
            {veredito ? (ultima ? "Ver resumo" : "Continuar") : "Verificar"}
          </Button>
        </div>
      </div>

    </div>
  );

  /** Pular na ultima questao: encerra a sessao com o que ja foi respondido. */
  function continuarSemResposta() {
    if (licao) {
      const corretas = respostas.filter((r) => r.correta).length;
      // Pelo numero de respostas dadas: pular nao conta como erro.
      concluirLicao(licao.id, respostas.length > 0 ? corretas / respostas.length : 0);
    }
    const xpTotal = respostas.reduce(
      (s, r) =>
        s +
        (r.correta
          ? XP_POR_DIFICULDADE[
              questoes.find((q) => q.id === r.questaoId)?.dificuldade ?? 1
            ]
          : 0),
      0,
    );
    encerrarSessao(xpTotal);
    router.push(licao ? `/licao/${licao.id}/resumo` : "/revisar/resumo");
  }
}

/* ===========================================================================
 * Despacho por tipo — cada tipo e um componente proprio
 * ======================================================================== */
function TipoQuestao({
  questao,
  resposta,
  onResponder,
  revelado,
  onEnviar,
}: {
  questao: Questao;
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelado: boolean;
  onEnviar: () => void;
}) {
  const props = { resposta, onResponder, revelado };
  switch (questao.tipo) {
    case "multipla-escolha":
      return <MultiplaEscolhaView questao={questao} {...props} />;
    case "verdadeiro-falso":
      return <VerdadeiroFalsoView questao={questao} {...props} />;
    case "completar-lacuna":
      return <CompletarLacunaView questao={questao} {...props} />;
    case "ordenar-passos":
      return <OrdenarPassosView questao={questao} {...props} />;
    case "associar-colunas":
      return <AssociarColunasView questao={questao} {...props} />;
    case "resposta-curta":
      return (
        <RespostaCurtaView questao={questao} {...props} onEnviar={onEnviar} />
      );
  }
}
