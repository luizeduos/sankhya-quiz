"use client";

import { m, useInView, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  COR_PONTO,
  layoutTrilha,
  type EstadoNo,
  type NoPosicionado,
  type NoTrilha,
} from "./trilha-geometria";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Trilha serpenteante do artboard 1b.
 *
 * Decisoes de performance, todas verificaveis no DevTools:
 *  - Os pontos entram em cascata com `scale`/`opacity` (o "desenhar o caminho
 *    progressivamente"), e depois pulsam em `scale` — nunca em `box-shadow`,
 *    `width` ou `filter`.
 *  - O no atual pulsa com um anel separado em `scale`+`opacity`, em vez do
 *    `box-shadow` animado do protótipo, que forcaria repaint a cada frame.
 *  - O parallax e um `translateY` derivado de `useScroll`, sem listener manual.
 */
export function Trilha({
  nos,
  className,
}: {
  nos: NoTrilha[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const emVista = useInView(ref, { once: true, margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax discreto: 14px no percurso inteiro. Mais que isso desalinha os
  // rotulos dos nos em telas curtas.
  const parallax = useTransform(scrollYProgress, [0, 1], [10, -14]);

  const { nos: posicionados, segmentos, altura } = layoutTrilha(nos);

  return (
    <div
      ref={ref}
      // `overflow-x-clip` e a rede de seguranca: nenhum elemento decorativo
      // posicionado em absoluto pode criar scroll horizontal na pagina.
      // Clip (e nao hidden) para nao criar um contexto de scroll novo, que
      // atrapalharia o `position: sticky` do rodape do quiz.
      className={cn("relative w-full overflow-x-clip", className)}
      style={{ height: altura }}
    >
      <m.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: parallax }}
      >
        {/* Pontos do caminho */}
        {segmentos.map((seg, i) =>
          seg.pontos.map((p, k) => (
            <PontoCaminho
              key={`${i}-${k}`}
              x={p.x}
              y={p.y}
              r={p.r}
              cor={COR_PONTO[seg.estado]}
              atraso={i * 0.09 + p.atraso * 0.5}
              entrou={emVista}
              reduced={reduced}
            />
          )),
        )}

        {/* Nos */}
        {posicionados.map((no, i) => (
          <NoDaTrilha
            key={no.id}
            no={no}
            indice={i}
            entrou={emVista}
            reduced={reduced}
          />
        ))}
      </m.div>
    </div>
  );
}

function PontoCaminho({
  x,
  y,
  r,
  cor,
  atraso,
  entrou,
  reduced,
}: {
  x: number;
  y: number;
  r: number;
  cor: string;
  atraso: number;
  entrou: boolean;
  reduced: boolean;
}) {
  return (
    <m.span
      aria-hidden
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: y,
        width: r * 2,
        height: r * 2,
        marginLeft: -r,
        marginTop: -r,
        background: cor,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        entrou
          ? reduced
            ? { scale: 1, opacity: 1 }
            : // Entra em cascata e, ao terminar, entra no pulso suave em loop
              // (dotFlow do protótipo) — puro transform + opacity.
              { scale: [0, 1.14, 0.82, 1.14, 0.82], opacity: [0, 1, 0.55, 1, 0.55] }
          : { scale: 0, opacity: 0 }
      }
      transition={
        reduced
          ? { duration: 0.12, delay: atraso * 0.3 }
          : {
              duration: 2.6,
              delay: atraso,
              times: [0, 0.16, 0.46, 0.73, 1],
              repeat: Infinity,
              repeatDelay: 0,
              ease: "easeInOut",
            }
      }
    />
  );
}

const FUNDO: Record<EstadoNo, string> = {
  concluido: "bg-green text-white [--depth-color:var(--green-deep)]",
  atual: "bg-blue text-white [--depth-color:var(--blue-deep)]",
  bloqueado: "bg-track text-subtle [--depth-color:var(--track-deep)]",
  prova: "bg-gold-soft text-gold-ink [--depth-color:var(--gold-border)]",
};

const ICONE: Record<EstadoNo, string> = {
  concluido: "✓",
  atual: "▶",
  bloqueado: "🔒",
  prova: "🏅",
};

function NoDaTrilha({
  no,
  indice,
  entrou,
  reduced,
}: {
  no: NoPosicionado;
  indice: number;
  entrou: boolean;
  reduced: boolean;
}) {
  const router = useRouter();
  const bloqueado = no.estado === "bloqueado";
  const r = no.diametro / 2;
  const rotuloDireita = no.lado === "direita";

  return (
    <>
      {/* Anel de pulso do no atual — camada propria, so scale/opacity. */}
      {no.estado === "atual" && !reduced && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-green/35"
          style={{
            left: `${no.x}%`,
            top: no.y,
            width: no.diametro,
            height: no.diametro,
            marginLeft: -r,
            marginTop: -r,
          }}
          animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <m.button
        type="button"
        disabled={bloqueado}
        aria-label={`${no.titulo}${bloqueado ? " (bloqueada)" : ""}`}
        onClick={() => !bloqueado && router.push(`/licao/${no.id}`)}
        // O mesmo layoutId existe no header da licao: o no cresce e se
        // transforma na tela do quiz.
        layoutId={`no-${no.id}`}
        className={cn(
          "pressable absolute grid place-items-center rounded-full font-black depth-6",
          FUNDO[no.estado],
          bloqueado ? "cursor-not-allowed" : "cursor-pointer",
          no.proximaUnidade && "opacity-55",
        )}
        style={{
          left: `${no.x}%`,
          top: no.y,
          width: no.diametro,
          height: no.diametro,
          marginLeft: -r,
          marginTop: -r,
          fontSize: no.diametro * 0.31,
        }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={
          entrou ? { scale: 1, opacity: no.proximaUnidade ? 0.55 : 1 } : {}
        }
        transition={{ ...spring.bouncy, delay: reduced ? 0 : indice * 0.09 }}
        whileHover={bloqueado ? undefined : { y: -2, scale: 1.04 }}
        whileTap={bloqueado ? undefined : { y: 4, scale: 0.98 }}
      >
        <span aria-hidden>{ICONE[no.estado]}</span>
      </m.button>

      {/* Rotulo ao lado do no.
          O lado esquerdo e resolvido com `right`, e nao com
          `transform: translateX(-100%)`: o Motion e o dono da propriedade
          `transform` deste elemento (anima `x` na entrada) e sobrescrevia o
          deslocamento, jogando os rotulos para fora da viewport — era a causa
          do scroll horizontal em telas estreitas.
          A largura e relativa a area da trilha, com piso e teto, para caber de
          390px a 1440px. */}
      <m.div
        className={cn(
          "pointer-events-none absolute flex flex-col gap-px",
          rotuloDireita ? "items-start text-left" : "items-end text-right",
        )}
        style={{
          width: "clamp(118px, 40%, 230px)",
          top: no.y - 14,
          ...(rotuloDireita
            ? { left: `${no.x}%`, marginLeft: r + 12 }
            : { right: `${100 - no.x}%`, marginRight: r + 12 }),
        }}
        initial={{ opacity: 0, x: reduced ? 0 : rotuloDireita ? -8 : 8 }}
        animate={entrou ? { opacity: 1, x: 0 } : {}}
        transition={{ ...spring.soft, delay: reduced ? 0 : indice * 0.09 + 0.08 }}
      >
        <span
          className={cn(
            "text-[14px] font-extrabold",
            no.estado === "atual" && "text-[16px] font-black text-blue",
            no.estado === "concluido" && "text-muted",
            no.estado === "bloqueado" && "text-subtle",
            no.estado === "prova" && "text-gold-ink",
          )}
        >
          {no.titulo}
        </span>
        {no.subtitulo && (
          <span className="text-[13px] text-subtle">{no.subtitulo}</span>
        )}
      </m.div>
    </>
  );
}
