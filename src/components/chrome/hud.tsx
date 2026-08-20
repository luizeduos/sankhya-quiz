"use client";

import { AnimatePresence, animate, m, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/store/hydration";
import { streakAtual, useProgressStore } from "@/store/progress";
import { useXpFlight } from "@/store/xp-flight";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { cn, dayKey, formatNumber } from "@/lib/utils";

/* ===========================================================================
 * Pills do HUD — "🔥 12 · ♥ 4 · ⚡ 1.240 XP" (artboards 1a e 1b)
 * ======================================================================== */

function Pill({
  className,
  compacto,
  ...props
}: React.ComponentProps<"div"> & { compacto?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full bg-surface font-black",
        // Sombra solida de 3px, como no HUD do artboard 1b.
        "depth-3 [--depth-color:var(--border)]",
        compacto
          ? "px-[11px] py-[6px] text-[15px]"
          : "px-4 py-[9px] text-[18px]",
        className,
      )}
      {...props}
    />
  );
}

/** Skeleton do mesmo tamanho, exibido antes de o localStorage ser lido. */
function PillSkeleton({ compacto, w }: { compacto?: boolean; w: number }) {
  return (
    <div
      className={cn(
        "shimmer shrink-0 rounded-full bg-track",
        compacto ? "h-[31px]" : "h-[41px]",
      )}
      style={{ width: w }}
    />
  );
}

export function StreakPill({ compacto }: { compacto?: boolean }) {
  const pronto = useHydrated();
  const streak = useProgressStore(streakAtual);
  const meta = useProgressStore((s) => s.metaDiariaMin);
  // dayKey() e a MESMA chave de dia local que o store usa para gravar. Usar
  // toISOString() aqui daria a data UTC e, a noite no Brasil, leria o dia
  // seguinte — o icone de ofensiva apagaria sozinho.
  const minutos = useProgressStore((s) => s.historico[dayKey()]?.minutos ?? 0);
  if (!pronto) return <PillSkeleton compacto={compacto} w={compacto ? 66 : 88} />;

  const bateu = minutos >= meta;

  return (
    <Pill compacto={compacto} className="text-orange-ink" title={`Ofensiva de ${streak} dia(s)`}>
      <span className={cn("text-[1.05em] leading-none", bateu && "flame")} aria-hidden>
        🔥
      </span>
      <span className="tnum">{streak}</span>
    </Pill>
  );
}

/**
 * Contador de XP: recebe o token voador do painel de acerto (mesmo
 * `layoutId`), da um "pop" de escala e faz count-up do numero.
 */
export function XpPill({
  compacto,
  mostrarSufixo = true,
}: {
  compacto?: boolean;
  mostrarSufixo?: boolean;
}) {
  const pronto = useHydrated();
  const xp = useProgressStore((s) => s.xp);
  const { fase, valor, vooId, encerrar } = useXpFlight();
  const reduced = useReducedMotionSafe();

  if (!pronto) return <PillSkeleton compacto={compacto} w={compacto ? 92 : 132} />;

  return (
    <m.div
      className="relative"
      animate={fase === "hud" && !reduced ? { scale: [1, 1.16, 1] } : {}}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <Pill compacto={compacto} className="text-gold-ink">
        <span className="leading-none" aria-hidden>
          ⚡
        </span>
        <CountUp value={xp} vooId={vooId} />
        {mostrarSufixo && <span className="text-[0.78em]">XP</span>}
      </Pill>

      {/* Token absorvido: aparece aqui e desaparece, fechando o voo. */}
      <AnimatePresence onExitComplete={encerrar}>
        {fase === "hud" && (
          <m.span
            layoutId="xp-token"
            className="pointer-events-none absolute -top-1 left-1/2 rounded-full bg-gold px-2 py-0.5 text-[12px] font-black text-[#4a3200]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.34, ease: "easeIn" }}
          >
            +{valor}
          </m.span>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/**
 * Numero que sobe suavemente ate o valor novo. Usa um MotionValue e escreve
 * direto no `textContent`, sem passar por estado do React — assim o count-up
 * roda a 60fps sem provocar um render por frame.
 */
function CountUp({ value, vooId }: { value: number; vooId: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(value);
  const anterior = useRef(value);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unsub = mv.on("change", (v) => {
      el.textContent = formatNumber(Math.round(v));
    });
    return unsub;
  }, [mv]);

  useEffect(() => {
    if (value === anterior.current) return;
    if (reduced) {
      mv.jump(value);
      if (ref.current) ref.current.textContent = formatNumber(value);
    } else {
      animate(mv, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    }
    anterior.current = value;
  }, [value, mv, reduced, vooId]);

  return (
    <span ref={ref} className="tnum">
      {formatNumber(value)}
    </span>
  );
}

/* ===========================================================================
 * Barra do HUD
 * ======================================================================== */

export function HudBar({
  nome,
  cargo,
  imagem,
}: {
  nome: string;
  cargo: string;
  imagem?: string | null;
}) {
  const pronto = useHydrated();
  const xp = useProgressStore((s) => s.xp);
  const nivel = Math.floor(xp / 200) + 1;

  return (
    <div className="flex items-center gap-3 border-b border-line bg-bg px-5 py-4 lg:px-10">
      <StreakPill />
      <XpPill />
      <div className="ml-auto hidden items-center gap-3 sm:flex">
        <span className="text-[14px] font-extrabold text-muted">
          {nome}
          {pronto && <> · Nível {nivel}</>}
          <span className="hidden lg:inline"> · {cargo}</span>
        </span>
        <Avatar nome={nome} imagem={imagem} size={40} />
      </div>
    </div>
  );
}

/** HUD compacto do mobile (artboard 1b, 390px). */
export function HudBarMobile({
  nome,
  imagem,
}: {
  nome: string;
  imagem?: string | null;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
      <StreakPill compacto />
      <XpPill compacto mostrarSufixo={false} />
      <div className="ml-auto">
        <Avatar nome={nome} imagem={imagem} size={34} />
      </div>
    </div>
  );
}

export function Avatar({
  nome,
  imagem,
  size = 40,
  className,
}: {
  nome: string;
  imagem?: string | null;
  size?: number;
  className?: string;
}) {
  const [falhou, setFalhou] = useState(false);
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (imagem && !falhou) {
    return (
      // Avatar de provedor OAuth: host arbitrario, entao <img> comum evita
      // exigir configuracao de remotePatterns em next.config para cada
      // provedor. E uma imagem pequena e nao entra no LCP.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imagem}
        alt={nome}
        width={size}
        height={size}
        onError={() => setFalhou(true)}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-label={nome}
      className={cn(
        "avatar-hatch grid shrink-0 place-items-center rounded-full font-black text-muted",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {iniciais}
    </div>
  );
}
