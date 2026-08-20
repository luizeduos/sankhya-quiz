"use client";

import { m } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

export type MascotMood = "idle" | "pensando" | "comemorando" | "triste";

/**
 * Mascote do Sankhya Quiz — SVG inline animado com Motion.
 *
 * Substitui deliberadamente o Lottie do plano de stack: sao ~3 KB contra
 * ~50 KB gzip de lottie-web, todo o movimento e transform puro (composto na
 * GPU) e as cores saem dos tokens, entao o mascote acompanha o dark mode sem
 * um segundo arquivo. O protótipo trazia apenas um placeholder "mascote",
 * sem arte definida.
 *
 * Cada humor mexe so em transforms de grupos <g> e na forma da boca.
 */
export function Mascot({
  mood = "idle",
  size = 96,
  className,
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  // Corpo: respira no idle, pula na comemoracao, afunda na tristeza.
  const bodyAnim = reduced
    ? {}
    : {
        idle: { y: [0, -2.5, 0], scaleY: [1, 1.02, 1] },
        pensando: { y: [0, -1.5, 0], rotate: [-1.5, 1.5, -1.5] },
        comemorando: { y: [0, -9, 0], scaleY: [1, 0.95, 1] },
        triste: { y: [0, 1.5, 0], scaleY: [1, 0.985, 1] },
      }[mood];

  const bodyTiming = {
    idle: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const },
    pensando: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const },
    comemorando: { duration: 0.62, repeat: Infinity, ease: "easeOut" as const },
    triste: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  }[mood];

  const eyeY = mood === "triste" ? 2 : mood === "pensando" ? -1.5 : 0;
  const eyeScale = mood === "comemorando" ? 0.7 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={cn("shrink-0 overflow-visible", className)}
      role="img"
      aria-label={MOOD_LABEL[mood]}
    >
      <defs>
        <linearGradient id="mq-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--blue)" />
          <stop offset="100%" stopColor="var(--blue-deep)" />
        </linearGradient>
      </defs>

      {/* Sombra de contato: encolhe quando o corpo sobe. */}
      <m.ellipse
        cx="60"
        cy="108"
        rx="26"
        ry="5"
        fill="var(--ink)"
        opacity={0.1}
        animate={
          reduced || mood !== "comemorando"
            ? {}
            : { scaleX: [1, 0.82, 1], opacity: [0.1, 0.06, 0.1] }
        }
        transition={bodyTiming}
        style={{ transformOrigin: "60px 108px" }}
      />

      <m.g
        animate={bodyAnim}
        transition={bodyTiming}
        style={{ transformOrigin: "60px 100px" }}
      >
        {/* Antena com faisca */}
        <path
          d="M60 26 C60 18 63 14 68 11"
          stroke="var(--blue-deep)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <m.circle
          cx="69"
          cy="10"
          r="5.5"
          fill={mood === "triste" ? "var(--track-deep)" : "var(--gold)"}
          animate={
            reduced
              ? {}
              : mood === "comemorando"
                ? { scale: [1, 1.45, 1] }
                : mood === "pensando"
                  ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
                  : { scale: [1, 1.12, 1] }
          }
          transition={{
            duration: mood === "comemorando" ? 0.55 : 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "69px 10px" }}
        />

        {/* Corpo */}
        <rect
          x="18"
          y="26"
          width="84"
          height="78"
          rx="30"
          fill="url(#mq-body)"
        />
        {/* Visor */}
        <rect
          x="30"
          y="42"
          width="60"
          height="42"
          rx="19"
          fill="var(--ink)"
          opacity={0.22}
        />

        {/* Olhos */}
        <m.g
          animate={{ y: eyeY, scale: eyeScale }}
          transition={spring.snappy}
          style={{ transformOrigin: "60px 60px" }}
        >
          <Eye cx={47} reduced={reduced} mood={mood} />
          <Eye cx={73} reduced={reduced} mood={mood} delay={0.08} />
        </m.g>

        {/* Boca.
            O `d` vai como atributo, nao em `animate`: o Motion nao interpola
            strings de path, e passar `d` so no `animate` deixava o primeiro
            render sem atributo — o Chrome reclamava
            "<path> attribute d: Expected moveto path command, 'undefined'".
            A troca de humor e animada por scale, com `key` remontando o path. */}
        <m.path
          key={mood}
          d={MOUTH[mood]}
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ scale: 0.82, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring.bouncy}
          style={{ transformOrigin: "60px 72px" }}
        />

        {/* Bracinhos: levantam na comemoracao */}
        <m.g
          animate={
            reduced ? {} : { rotate: mood === "comemorando" ? -32 : -4 }
          }
          transition={spring.bouncy}
          style={{ transformOrigin: "22px 74px" }}
        >
          <rect x="6" y="68" width="18" height="9" rx="4.5" fill="var(--blue-deep)" />
        </m.g>
        <m.g
          animate={reduced ? {} : { rotate: mood === "comemorando" ? 32 : 4 }}
          transition={spring.bouncy}
          style={{ transformOrigin: "98px 74px" }}
        >
          <rect x="96" y="68" width="18" height="9" rx="4.5" fill="var(--blue-deep)" />
        </m.g>

        {/* Lagrima — so na tristeza */}
        {mood === "triste" && (
          <m.path
            d="M73 70 q4 7 0 11 q-4-4 0-11z"
            fill="#8fd0ff"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-6, 4, 14, 22] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeIn" }}
          />
        )}
      </m.g>

      {/* Faiscas de comemoracao */}
      {mood === "comemorando" && !reduced && (
        <>
          <Spark cx={16} cy={34} delay={0} />
          <Spark cx={104} cy={30} delay={0.28} />
          <Spark cx={98} cy={94} delay={0.5} />
        </>
      )}

      {/* Bolhas de pensamento */}
      {mood === "pensando" && !reduced && (
        <>
          <Think cx={100} cy={44} r={3.5} delay={0} />
          <Think cx={109} cy={34} r={5} delay={0.18} />
        </>
      )}
    </svg>
  );
}

const MOOD_LABEL: Record<MascotMood, string> = {
  idle: "Mascote do Sankhya Quiz",
  pensando: "Mascote pensando",
  comemorando: "Mascote comemorando",
  triste: "Mascote triste",
};

/** Boca por humor: sorriso, reto, sorriso largo, invertida. */
const MOUTH: Record<MascotMood, string> = {
  idle: "M50 72 q10 8 20 0",
  pensando: "M52 74 q8 2 16 -1",
  comemorando: "M46 68 q14 16 28 0",
  triste: "M50 76 q10 -8 20 0",
};

function Eye({
  cx,
  mood,
  reduced,
  delay = 0,
}: {
  cx: number;
  mood: MascotMood;
  reduced: boolean;
  delay?: number;
}) {
  // Na comemoracao os olhos viram "^" felizes; nos outros humores piscam.
  if (mood === "comemorando") {
    return (
      <path
        d={`M${cx - 6} 62 q6 -8 12 0`}
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  return (
    <m.ellipse
      cx={cx}
      cy={60}
      rx={5.5}
      ry={6.5}
      fill="#fff"
      animate={reduced ? {} : { scaleY: [1, 1, 0.08, 1] }}
      transition={{
        duration: 0.28,
        repeat: Infinity,
        repeatDelay: 3.4 + delay,
        ease: "easeInOut",
        times: [0, 0.5, 0.72, 1],
      }}
      style={{ transformOrigin: `${cx}px 60px` }}
    />
  );
}

function Spark({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <m.path
      d={`M${cx} ${cy - 7} L${cx + 2.2} ${cy - 2.2} L${cx + 7} ${cy} L${cx + 2.2} ${cy + 2.2} L${cx} ${cy + 7} L${cx - 2.2} ${cy + 2.2} L${cx - 7} ${cy} L${cx - 2.2} ${cy - 2.2} Z`}
      fill="var(--gold)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.15, 0], opacity: [0, 1, 0], rotate: [0, 45] }}
      transition={{ duration: 1.1, repeat: Infinity, delay, ease: "easeOut" }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

function Think({
  cx,
  cy,
  r,
  delay,
}: {
  cx: number;
  cy: number;
  r: number;
  delay: number;
}) {
  return (
    <m.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="var(--muted)"
      animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}
