"use client";

import { m } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";

/**
 * Transicao de rota: apenas ENTRADA, com remontagem por `key`.
 *
 * A versao anterior usava `AnimatePresence mode="wait"` para ter animacao de
 * saida, e isso produzia TELA BRANCA ao voltar para a Home. O motivo:
 *
 *  - as paginas desta area sao dinamicas (chamam `auth()`), entao o App Router
 *    do Next 16 revalida o RSC a cada navegacao — a arvore nova SUSPENDE;
 *  - `mode="wait"` desmonta a pagina antiga ANTES de montar a nova. Com a
 *    arvore nova suspensa dentro de uma transicao do React, existia um
 *    intervalo em que o AnimatePresence nao tinha filho nenhum para renderizar
 *    — nem o `loading.tsx`, que vive dentro do filho novo. Resultado: main
 *    vazio, que e a tela branca relatada.
 *
 * Sem AnimatePresence, o filho novo entra no MESMO commit em que o antigo sai:
 * nao existe quadro sem conteudo, e o `loading.tsx` volta a aparecer enquanto
 * a pagina carrega. O preco e a animacao de saida, que era imperceptivel
 * (180ms de opacidade) diante do custo de uma tela branca.
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
    <m.div
      // Trocar a chave remonta a subarvore, e e isso que faz `initial` tocar
      // de novo a cada rota — sem precisar de presenca/saida.
      key={key}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring.soft}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </m.div>
  );
}
