"use client";

import { m } from "motion/react";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks/use-mounted";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Alternancia de tema. Renderiza um placeholder do mesmo tamanho antes de
 * montar: `resolvedTheme` so existe no cliente, e desenhar o icone errado no
 * servidor causaria mismatch de hidratacao.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const montado = useMounted();

  const escuro = resolvedTheme === "dark";

  return (
    <m.button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
      className={cn(
        "grid size-10 place-items-center rounded-card border border-line bg-surface text-muted",
        "hover:text-ink",
        className,
      )}
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -1 }}
      transition={spring.snappy}
    >
      {!montado ? (
        <span className="size-5" />
      ) : (
        <m.span
          key={escuro ? "lua" : "sol"}
          initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={spring.bouncy}
          className="grid place-items-center"
        >
          {escuro ? <IconMoon /> : <IconSun />}
        </m.span>
      )}
    </m.button>
  );
}

function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.4A8.4 8.4 0 019.6 4a8.4 8.4 0 1010.4 10.4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
