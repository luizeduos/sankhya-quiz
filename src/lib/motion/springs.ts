import type { Transition } from "motion/react";

/**
 * Fisica central da aplicacao. Nada de easing linear: todo movimento sai
 * daqui, para que o app tenha uma unica "sensacao" ao toque.
 */
export const spring = {
  /** Reacao imediata: toques, hover, troca de estado de card. */
  snappy: { type: "spring", stiffness: 420, damping: 28, mass: 0.6 },
  /** Entrada com vida: selos, badges, +XP. */
  bouncy: { type: "spring", stiffness: 400, damping: 18, mass: 0.7 },
  /** Movimento amplo e calmo: paineis, sheets, transicao de rota. */
  soft: { type: "spring", stiffness: 180, damping: 22, mass: 0.9 },
  /** Retorno com ultrapassagem: botao voltando do press. */
  overshoot: { type: "spring", stiffness: 520, damping: 14, mass: 0.5 },
  /** Elastico forte: comemoracao, no da trilha crescendo. */
  elastic: { type: "spring", stiffness: 300, damping: 12, mass: 0.6 },
} satisfies Record<string, Transition>;

/** Transicao usada quando o usuario pediu menos movimento. */
export const reducedTransition: Transition = { duration: 0.12, ease: "easeOut" };

/** Escalonamento padrao de listas. */
export const stagger = (childDelay = 0.055, delayChildren = 0.04) => ({
  animate: { transition: { staggerChildren: childDelay, delayChildren } },
});
