"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";

/**
 * Transicao de rota. Fica dentro do layout (e nao em template.tsx) porque
 * precisamos de saida animada, o que exige AnimatePresence com chave estavel.
 *
 * `mode="wait"` garante que a tela antiga sai antes da nova entrar — sem isso
 * as duas se sobrepoem e o layout "salta".
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();

  // Rotas de licao compartilham a mesma chave para nao reanimar a moldura
  // entre questoes — quem anima ali dentro e o QuizEngine.
  const key = pathname.startsWith("/licao/")
    ? pathname.split("/").slice(0, 3).join("/")
    : pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={key}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.995 }}
        transition={spring.soft}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
