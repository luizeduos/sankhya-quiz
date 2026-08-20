"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";

/**
 * Mascara circular que revela a tela nova a partir de um ponto — usada na
 * passagem login -> onboarding -> home.
 *
 * Anima `clipPath` num overlay proprio (nao no conteudo), de modo que o
 * conteudo por baixo nunca reflui. O overlay e removido do DOM ao terminar,
 * para nao deixar uma camada composta viva a toa.
 */
export function CircleWipe({
  /** Origem em porcentagem da viewport. */
  origin = { x: 50, y: 50 },
  color = "var(--blue)",
  duration = 0.85,
  onDone,
}: {
  origin?: { x: number; y: number };
  color?: string;
  duration?: number;
  onDone?: () => void;
}) {
  const reduced = useReducedMotionSafe();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(
      () => setOpen(false),
      reduced ? 120 : duration * 1000,
    );
    return () => window.clearTimeout(t);
  }, [duration, reduced]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {open && (
        <m.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-100"
          style={{ background: color, willChange: "clip-path, opacity" }}
          initial={
            reduced
              ? { opacity: 1 }
              : { clipPath: `circle(150% at ${origin.x}% ${origin.y}%)` }
          }
          animate={
            reduced
              ? { opacity: 0 }
              : { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }
          }
          exit={{ opacity: 0 }}
          transition={
            reduced
              ? { duration: 0.12 }
              : { duration, ease: [0.83, 0, 0.17, 1] }
          }
        />
      )}
    </AnimatePresence>
  );
}
