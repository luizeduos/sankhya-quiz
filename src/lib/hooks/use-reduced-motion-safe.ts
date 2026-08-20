"use client";

import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion` do Motion devolve `null` antes de hidratar. Aqui
 * normalizamos para boolean, com `false` como padrao seguro (o CSS em
 * globals.css ja neutraliza animacoes puras de CSS nesse caso).
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}
