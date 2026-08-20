"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion/springs";
import { APP_VERSION, AUTHOR, AUTHOR_URL } from "@/lib/app-meta";

/**
 * Credito de desenvolvimento — FONTE UNICA DE VERDADE.
 *
 * Usado no footer de todas as telas do app, abaixo do card de /login e na
 * secao "Sobre" de /configuracoes. Qualquer mudanca de texto, link ou estilo
 * do credito acontece aqui e em nenhum outro lugar.
 */
export function Credits({
  variant = "footer",
  className,
}: {
  variant?: "footer" | "auth" | "about";
  className?: string;
}) {
  const link = (
    <m.a
      href={AUTHOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-1 font-extrabold text-blue"
      whileHover="hover"
      whileFocus="hover"
      initial="rest"
    >
      <span className="relative">
        {AUTHOR}
        {/* Sublinhado que cresce da esquerda: scaleX, nunca width. */}
        <m.span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full bg-blue"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={spring.snappy}
        />
      </span>
      <m.span
        aria-hidden
        className="text-[1.05em] leading-none"
        variants={{ rest: { x: 0, opacity: 0.55 }, hover: { x: 3, opacity: 1 } }}
        transition={spring.snappy}
      >
        &rarr;
      </m.span>
    </m.a>
  );

  if (variant === "about") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <p className="text-[15px] text-muted">
          Desenvolvido por {link}
        </p>
        <p className="font-mono text-[12px] text-subtle">
          Sankhya Quiz v{APP_VERSION}
        </p>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "text-[13px] text-subtle",
        variant === "auth" ? "text-center" : "",
        className,
      )}
    >
      Desenvolvido por {link}
    </p>
  );
}
