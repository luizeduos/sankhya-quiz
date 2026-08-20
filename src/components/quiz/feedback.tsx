"use client";

import { m } from "motion/react";
import { useEffect, useRef } from "react";
import { Mascot } from "@/components/mascot/mascot";
import type { Veredito } from "@/lib/quiz/engine";
import { useXpFlight } from "@/store/xp-flight";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Painel de feedback — o coracao do produto.
 *
 * No erro, o painel sobe com spring e revela em stagger, na ordem definida no
 * artboard 1a:
 *   1. resposta correta
 *   2. por que você errou
 *   3. por que a correta está certa
 *   4. citação da fonte (mono, com barra a esquerda)
 */
export function Feedback({
  veredito,
  xpGanho,
}: {
  veredito: Veredito;
  xpGanho: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  // O usuario acabou de clicar num botao no rodape; o painel nasce acima dele
  // e, em telas curtas, fora da vista. Trazemos o painel para a tela — com
  // `smooth` so quando o usuario aceita movimento.
  useEffect(() => {
    const t = window.setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "nearest",
      });
    }, 120);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div ref={ref} className="scroll-mb-24">
      {veredito.correta ? (
        <FeedbackAcerto veredito={veredito} xpGanho={xpGanho} />
      ) : (
        <FeedbackErro veredito={veredito} />
      )}
    </div>
  );
}

/* ===========================================================================
 * Acerto
 * ======================================================================== */
function FeedbackAcerto({
  veredito,
  xpGanho,
}: {
  veredito: Veredito;
  xpGanho: number;
}) {
  const { fase, absorver } = useXpFlight();
  const reduced = useReducedMotionSafe();

  // Depois de um instante, o token de XP "voa" para o HUD: o painel desmonta
  // o seu, o HUD monta o dele com o mesmo layoutId, e o Motion faz o FLIP.
  useEffect(() => {
    const t = window.setTimeout(absorver, reduced ? 250 : 850);
    return () => window.clearTimeout(t);
  }, [absorver, reduced]);

  return (
    <m.div
      className="flex flex-col gap-3 rounded-panel bg-green-soft p-5"
      initial={{ opacity: 0, y: reduced ? 0 : 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
    >
      <div className="flex items-center gap-3">
        {/* Selo com entrada elastica */}
        <m.span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-green text-[20px] font-black text-white"
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.elastic}
        >
          ✓
        </m.span>
        <p className="text-[20px] font-black text-green-ink">Boa!</p>

        <div className="relative ml-auto">
          {fase === "painel" && (
            <m.span
              layoutId="xp-token"
              className="rounded-full bg-gold px-2.5 py-1 text-[13px] font-black text-[#4a3200]"
              initial={{ scale: 0.5, y: reduced ? 0 : 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={spring.bouncy}
            >
              +{xpGanho} XP
            </m.span>
          )}
        </div>
        <Mascot mood="comemorando" size={54} className="shrink-0" />
      </div>

      <m.p
        className="text-[15px] leading-[1.6] text-green-ink2"
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.soft, delay: 0.1 }}
      >
        {veredito.porqueCorreta}
      </m.p>

      <CitacaoFonte veredito={veredito} tom="verde" atraso={0.2} />
    </m.div>
  );
}

/* ===========================================================================
 * Erro
 * ======================================================================== */
function FeedbackErro({ veredito }: { veredito: Veredito }) {
  const reduced = useReducedMotionSafe();

  const blocos = [
    {
      rotulo: "Resposta correta",
      texto: veredito.respostaCorreta,
      destaque: true,
    },
    veredito.porqueErrei && {
      rotulo: "Por que você errou",
      texto: veredito.porqueErrei,
    },
    { rotulo: "Por que a correta está certa", texto: veredito.porqueCorreta },
  ].filter(Boolean) as { rotulo: string; texto: string; destaque?: boolean }[];

  return (
    <m.div
      className="flex flex-col gap-3.5 rounded-panel bg-coral-soft p-5"
      initial={{ opacity: 0, y: reduced ? 0 : 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
    >
      <div className="flex items-center gap-3">
        <m.span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-coral text-[18px] font-black text-white"
          initial={{ scale: 0, rotate: 20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.elastic}
        >
          ✕
        </m.span>
        <p className="text-[20px] font-black text-coral-ink">
          Quase. Vamos entender.
        </p>
        <Mascot mood="triste" size={54} className="ml-auto shrink-0" />
      </div>

      <m.div
        className="flex flex-col gap-3.5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}
      >
        {blocos.map((b) => (
          <m.div
            key={b.rotulo}
            className="flex flex-col gap-1"
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 12 },
              show: { opacity: 1, y: 0, transition: spring.soft },
            }}
          >
            <p className="text-[12px] font-extrabold tracking-[1.2px] uppercase text-coral-ink/75">
              {b.rotulo}
            </p>
            <p
              className={cn(
                "leading-[1.6]",
                b.destaque
                  ? "text-[16px] font-extrabold text-coral-ink"
                  : "text-[15px] text-coral-ink2",
              )}
            >
              {b.texto}
            </p>
          </m.div>
        ))}
      </m.div>

      <CitacaoFonte veredito={veredito} tom="coral" atraso={0.42} />
    </m.div>
  );
}

/* ===========================================================================
 * Citacao da fonte — mono, barra a esquerda (artboard 1a)
 * ======================================================================== */
function CitacaoFonte({
  veredito,
  tom,
  atraso,
}: {
  veredito: Veredito;
  tom: "verde" | "coral";
  atraso: number;
}) {
  const reduced = useReducedMotionSafe();
  const { fonte } = veredito;

  return (
    <m.figure
      className={cn(
        "flex flex-col gap-1 border-l-4 pl-3",
        tom === "coral" ? "border-coral-rule" : "border-green/40",
      )}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.soft, delay: atraso }}
    >
      {fonte.citacao && (
        <blockquote
          className={cn(
            "font-mono text-[12px] leading-[1.6]",
            tom === "coral" ? "text-coral-quote" : "text-green-ink2",
          )}
        >
          &ldquo;{fonte.citacao}&rdquo;
        </blockquote>
      )}
      <figcaption
        className={cn(
          "font-mono text-[12px]",
          tom === "coral" ? "text-coral-quote" : "text-green-ink2",
        )}
      >
        Fonte:{" "}
        <a
          href={fonte.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {fonte.aula}
        </a>
        {fonte.timestamp && <> · {fonte.timestamp}</>}
        <span className="block opacity-75">{fonte.trilha} · EAD Sankhya</span>
      </figcaption>
    </m.figure>
  );
}
