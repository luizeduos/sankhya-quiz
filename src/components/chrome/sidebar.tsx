"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Credits } from "@/components/chrome/credits";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { NAV, isAtivo } from "@/components/chrome/nav";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useHydrated } from "@/store/hydration";
import { totalPendente, useErrorsStore } from "@/store/errors";
import { minutosHoje, useProgressStore } from "@/store/progress";
import { spring } from "@/lib/motion/springs";
import { APP_NAME } from "@/lib/app-meta";
import { cn } from "@/lib/utils";

/**
 * Sidebar de 248px do artboard 1b: logo, navegacao, card "Meta diária" no
 * rodape. Visivel a partir de lg; abaixo disso o app usa a bottom tab bar.
 *
 * O indicador do item ativo e um bloco com `layoutId`, entao ele desliza
 * entre os itens em vez de piscar — o efeito acontece na navegacao real.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col gap-6 border-r border-line bg-surface px-[18px] py-[26px] lg:flex">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="grid size-9 place-items-center rounded-card bg-blue text-[18px] font-black text-white">
          S
        </div>
        <span className="text-[19px] font-black tracking-[-0.3px]">
          {APP_NAME}
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const ativo = isAtivo(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-card px-3.5 py-3 text-[15px] font-extrabold transition-colors",
                ativo ? "text-blue" : "text-muted hover:text-ink",
              )}
            >
              {ativo && (
                <m.span
                  layoutId="sidebar-ativo"
                  className="absolute inset-0 -z-10 rounded-card bg-blue-soft"
                  transition={spring.snappy}
                />
              )}
              <span aria-hidden className="text-[17px] leading-none">
                {item.emoji}
              </span>
              {item.label}
              {item.badgeErros && <BadgeErros />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <MetaDiaria />
        <div className="flex items-center justify-between gap-2">
          <Credits />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function BadgeErros() {
  const pronto = useHydrated();
  const total = useErrorsStore(totalPendente);
  if (!pronto || total === 0) return null;
  return (
    <m.span
      className="tnum ml-auto rounded-full bg-coral px-2 py-0.5 text-[12px] font-black text-white"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring.bouncy}
    >
      {total}
    </m.span>
  );
}

/** Card "Meta diária — 7 de 10 min hoje" do rodape da sidebar (1b). */
export function MetaDiaria({ className }: { className?: string }) {
  const pronto = useHydrated();
  const minutos = useProgressStore(minutosHoje);
  const meta = useProgressStore((s) => s.metaDiariaMin);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-panel bg-gold-soft p-4",
        className,
      )}
    >
      <p className="text-[15px] font-black text-gold-ink">Meta diária</p>
      {pronto ? (
        <p className="text-[13px] leading-[1.4] text-gold-ink2">
          {minutos} de {meta} min hoje
        </p>
      ) : (
        <div className="shimmer h-[18px] w-24 rounded-full bg-gold-border" />
      )}
      <ProgressBar
        value={pronto ? minutos : 0}
        max={meta}
        tone="gold"
        height={10}
        label="Progresso da meta diária"
        className="bg-gold-border"
      />
    </div>
  );
}
