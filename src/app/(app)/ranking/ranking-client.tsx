"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/chrome/hud";
import {
  EmptyState,
  ErrorState,
  SkeletonCard,
} from "@/components/feedback/states";
import { Chip } from "@/components/ui/chip";
import { SectionLabel } from "@/components/ui/card";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { useHydrated } from "@/store/hydration";
import { useRankingStore } from "@/store/ranking";
import { rotuloDaSemana } from "@/lib/ranking/semana";
import type {
  Criterio,
  LinhaRanking,
  RespostaRanking,
} from "@/lib/ranking/tipos";
import { spring } from "@/lib/motion/springs";
import { cn, formatNumber } from "@/lib/utils";

/* ===========================================================================
 * Criterios
 *
 * Os tres saem do MESMO registro publicado por cada cliente, apenas reordenado
 * no servidor (ver lib/ranking/service.ts). Nao existe placar "principal": XP
 * da semana premia quem estuda agora, XP total premia quem ja estudou muito e
 * ofensiva premia constancia — que e o comportamento que o app quer criar.
 * ======================================================================== */
type MetaCriterio = {
  id: Criterio;
  rotulo: string;
  emoji: string;
  unidade: (v: number) => string;
  explicacao: string;
};

const CRITERIOS: MetaCriterio[] = [
  {
    id: "semana",
    rotulo: "XP da semana",
    emoji: "⚡",
    unidade: (v) => `${formatNumber(v)} XP`,
    explicacao:
      "só o XP ganho desta segunda até hoje. Zera toda segunda-feira, então quem começou hoje disputa em pé de igualdade.",
  },
  {
    id: "geral",
    rotulo: "XP total",
    emoji: "🏆",
    unidade: (v) => `${formatNumber(v)} XP`,
    explicacao: "todo o XP acumulado desde o primeiro acesso.",
  },
  {
    id: "ofensiva",
    rotulo: "Ofensiva",
    emoji: "🔥",
    unidade: (v) => `${formatNumber(v)} ${v === 1 ? "dia" : "dias"}`,
    explicacao:
      "dias seguidos batendo a meta diária. É o placar mais difícil de escalar e o mais fácil de perder.",
  },
];

const MEDALHA = ["🥇", "🥈", "🥉"];

export function RankingClient({ nome }: { nome: string }) {
  const pronto = useHydrated();
  const participar = useRankingStore((s) => s.participar);
  const definirParticipacao = useRankingStore((s) => s.definirParticipacao);

  const [criterio, setCriterio] = useState<Criterio>("semana");
  /** Contador de recargas manuais — muda para o efeito buscar de novo. */
  const [tentativa, setTentativa] = useState(0);
  /**
   * Resultado guardado JUNTO com o pedido que o produziu. Assim "carregando"
   * e "erro" sao DERIVADOS (`resultado` ainda nao corresponde ao pedido
   * atual), e nao estado extra sincronizado dentro do efeito — o que
   * dispararia render em cascata a cada troca de aba.
   */
  const [resultado, setResultado] = useState<{
    criterio: Criterio;
    tentativa: number;
    dados: RespostaRanking | null;
  } | null>(null);

  useEffect(() => {
    if (!pronto) return;
    // `vivo` cobre a troca rapida de aba: a resposta de um pedido abandonado
    // nao pode sobrescrever a do pedido atual.
    let vivo = true;

    (async () => {
      try {
        // Publica ANTES de ler: sem isto, quem acabou de ganhar XP veria a
        // propria posicao atrasada por causa do debounce do RankingSync.
        await useRankingStore.getState().publicar();
        const res = await fetch(`/api/ranking?criterio=${criterio}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as RespostaRanking;
        if (vivo) setResultado({ criterio, tentativa, dados: json });
      } catch {
        if (vivo) setResultado({ criterio, tentativa, dados: null });
      }
    })();

    return () => {
      vivo = false;
    };
  }, [pronto, criterio, tentativa]);

  const atual =
    resultado?.criterio === criterio && resultado.tentativa === tentativa
      ? resultado
      : null;
  const carregando = !pronto || atual === null;
  const erro = atual !== null && atual.dados === null;
  const dados = atual?.dados ?? null;
  const recarregar = () => setTentativa((n) => n + 1);

  const meta = CRITERIOS.find((c) => c.id === criterio) ?? CRITERIOS[0];

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-5 py-7 lg:py-9">
      <div className="flex flex-col gap-1">
        <h1 className="text-[26px] leading-tight font-black lg:text-[30px]">
          Ranking
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Semana de {rotuloDaSemana()} — {meta.explicacao}
        </p>
      </div>

      {/* Seletor de criterio */}
      <div
        role="tablist"
        aria-label="Critério do ranking"
        className="flex flex-wrap gap-2"
      >
        {CRITERIOS.map((c) => {
          const ativo = c.id === criterio;
          return (
            <m.button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => setCriterio(c.id)}
              whileTap={{ y: 2 }}
              transition={spring.snappy}
              className={cn(
                "rounded-chip border-2 border-b-[3px] px-4 py-2 text-[14px] font-extrabold transition-colors",
                ativo
                  ? "border-blue bg-blue-soft text-blue"
                  : "border-line-strong bg-surface text-muted hover:border-blue",
              )}
            >
              <span aria-hidden className="mr-1.5">
                {c.emoji}
              </span>
              {c.rotulo}
            </m.button>
          );
        })}
      </div>

      {pronto && !participar && (
        <div className="flex flex-wrap items-center gap-3 rounded-panel border-2 border-gold bg-gold-soft px-4 py-3.5">
          <p className="min-w-[200px] flex-1 text-[14px] leading-relaxed text-gold-ink2">
            <strong className="font-black text-gold-ink">
              Você está fora do placar.
            </strong>{" "}
            Seu progresso continua sendo contado, mas seu nome não aparece aqui
            para ninguém — nem para você.
          </p>
          <button
            type="button"
            onClick={() => {
              definirParticipacao(true);
              recarregar();
            }}
            className="pressable rounded-chip bg-gold px-3.5 py-2 text-[13px] font-black text-[#4a3200] depth-3 [--depth-color:var(--gold-deep)]"
          >
            Voltar ao ranking
          </button>
        </div>
      )}

      {carregando ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard h={168} className="rounded-hero" />
          <SkeletonCard h={300} />
        </div>
      ) : erro ? (
        <ErrorState
          titulo="Placar indisponível"
          descricao="Não conseguimos carregar o ranking agora. Seu progresso está salvo — nada foi perdido."
          onTentar={recarregar}
        />
      ) : !dados || dados.participantes === 0 ? (
        <EmptyState
          mascote="pensando"
          titulo="Ninguém no placar ainda"
          descricao="Assim que alguém responder uma questão, o ranking começa a se preencher. Faça uma lição e volte aqui."
        />
      ) : (
        <Placar dados={dados} meta={meta} nome={nome} />
      )}

      <Rodape dados={dados} />
    </div>
  );
}

/* ===========================================================================
 * Placar
 * ======================================================================== */

function Placar({
  dados,
  meta,
  nome,
}: {
  dados: RespostaRanking;
  meta: MetaCriterio;
  nome: string;
}) {
  const podio = dados.linhas.slice(0, 3);
  const resto = dados.linhas.slice(3);
  // Estou no placar, mas nao no pedaco visivel (top 50).
  const foraDaLista =
    dados.minhaLinha !== null && !dados.linhas.some((l) => l.eu);

  return (
    <>
      {podio.length > 0 && (
        <Reveal stagger={0.07} className="grid gap-3 sm:grid-cols-3">
          {podio.map((l, i) => (
            <RevealItem key={l.entrada.id}>
              <CardPodio linha={l} lugar={i} meta={meta} />
            </RevealItem>
          ))}
        </Reveal>
      )}

      {resto.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionLabel>Classificação</SectionLabel>
            <span className="h-px flex-1 bg-line" />
            <span className="text-[12px] font-extrabold text-subtle">
              {dados.participantes}{" "}
              {dados.participantes === 1 ? "participante" : "participantes"}
            </span>
          </div>

          <Reveal
            as="ul"
            stagger={0.03}
            className="flex flex-col overflow-hidden rounded-panel border border-line bg-surface"
          >
            {resto.map((l) => (
              <RevealItem as="li" key={l.entrada.id} y={8}>
                <Linha linha={l} meta={meta} />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      )}

      {/* Minha posicao fica sempre acessivel, mesmo fora do top visivel. */}
      {foraDaLista && dados.minhaLinha && (
        <div className="sticky bottom-3 z-10 flex flex-col gap-1.5">
          <SectionLabel>Sua posição</SectionLabel>
          <div className="overflow-hidden rounded-panel border-2 border-blue bg-surface depth-3 [--depth-color:var(--blue-deep)]">
            <Linha linha={dados.minhaLinha} meta={meta} />
          </div>
        </div>
      )}

      {dados.minhaLinha === null && (
        <p className="rounded-panel border border-line bg-surface px-5 py-6 text-center text-[15px] leading-relaxed text-muted">
          <strong className="font-extrabold text-ink">{nome}</strong>, você ainda
          não aparece neste placar. Responda uma questão para entrar.
        </p>
      )}
    </>
  );
}

function CardPodio({
  linha,
  lugar,
  meta,
}: {
  linha: LinhaRanking;
  lugar: number;
  meta: MetaCriterio;
}) {
  const tom = [
    "border-gold bg-gold-soft",
    "border-line-strong bg-surface-2",
    "border-orange bg-orange-soft",
  ][lugar];

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center gap-2 rounded-hero border-2 px-4 py-5 text-center",
        tom,
        linha.eu && "ring-2 ring-blue ring-offset-2 ring-offset-bg",
      )}
    >
      <span aria-hidden className="text-[30px] leading-none">
        {MEDALHA[lugar]}
      </span>
      <Avatar nome={linha.entrada.nome} imagem={linha.entrada.avatar} size={54} />
      <div className="flex w-full min-w-0 flex-col gap-0.5">
        <p className="truncate text-[15px] font-black">
          {linha.entrada.nome}
          {linha.eu && <span className="ml-1 text-blue">· você</span>}
        </p>
        <p className="truncate text-[12px] text-subtle">{linha.entrada.cargo}</p>
      </div>
      <p className="tnum mt-auto pt-1 text-[20px] font-black">
        {meta.unidade(linha.valor)}
      </p>
    </div>
  );
}

function Linha({ linha, meta }: { linha: LinhaRanking; meta: MetaCriterio }) {
  const { entrada } = linha;
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-line px-4 py-3 last:border-0",
        linha.eu && "bg-blue-soft",
      )}
    >
      <span
        className={cn(
          "tnum w-8 shrink-0 text-center text-[15px] font-black",
          linha.eu ? "text-blue" : "text-subtle",
        )}
      >
        {linha.posicao}
      </span>
      <Avatar nome={entrada.nome} imagem={entrada.avatar} size={38} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-extrabold">
          {entrada.nome}
          {linha.eu && <span className="ml-1.5 text-blue">· você</span>}
        </span>
        <span className="truncate text-[12px] text-subtle">
          {entrada.licoes} {entrada.licoes === 1 ? "lição" : "lições"} ·{" "}
          {entrada.streak} {entrada.streak === 1 ? "dia" : "dias"} de ofensiva
        </span>
      </div>
      <span className="tnum shrink-0 text-[16px] font-black">
        {meta.unidade(linha.valor)}
      </span>
    </div>
  );
}

/* ===========================================================================
 * Rodape: o que este placar e — e o que ele nao e
 * ======================================================================== */

function Rodape({ dados }: { dados: RespostaRanking | null }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-panel border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <SectionLabel>Como o placar funciona</SectionLabel>
        {dados?.persistencia === "memoria" && (
          <Chip tone="orange">placar temporário</Chip>
        )}
      </div>
      <p className="text-[14px] leading-relaxed text-muted">
        Cada pessoa publica um resumo do próprio progresso (XP, ofensiva e
        lições) enquanto estuda. Os números são <strong>autodeclarados</strong>:
        o progresso é calculado no seu navegador, então este é um placar de
        estímulo, não uma avaliação formal.
      </p>
      {dados?.persistencia === "memoria" && (
        <p className="text-[14px] leading-relaxed text-orange-ink">
          Este ambiente não tem armazenamento compartilhado configurado
          (<code className="font-mono text-[13px]">KV_REST_API_URL</code>), então
          o placar vive na memória do servidor: funciona, mas reinicia a cada
          deploy e não é compartilhado entre instâncias.
        </p>
      )}
      <p className="text-[13px] leading-relaxed text-subtle">
        Não quer aparecer? Em <strong>Configurações › Ranking</strong> você sai
        do placar sem perder nada do seu progresso.
      </p>
    </div>
  );
}
