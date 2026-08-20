"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { reducedTransition } from "@/lib/motion/springs";

/** Import assincrono: as features do Motion viram um chunk separado. */
const loadFeatures = () =>
  import("./features").then((mod) => mod.default);

/**
 * Raiz da camada de animacao.
 *
 * - `LazyMotion` + features assincronas mantem o bundle inicial enxuto.
 * - `strict` faz o build falhar se alguem usar `motion.div` em vez de `m.div`
 *   (que e o que puxaria a lib inteira para dentro do chunk da rota).
 * - `MotionConfig reducedMotion="user"` faz o Motion respeitar
 *   `prefers-reduced-motion` nativamente: animacoes de transform/layout sao
 *   suprimidas e so opacidade continua animando.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={reduced ? reducedTransition : undefined}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
