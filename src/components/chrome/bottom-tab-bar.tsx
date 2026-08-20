"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MOBILE, isAtivo } from "@/components/chrome/nav";
import { useHydrated } from "@/store/hydration";
import { totalPendente, useErrorsStore } from "@/store/errors";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar do artboard 1c (390px): 5 itens, emoji acima do rotulo em
 * 10/800. O padding inferior soma a area segura do iPhone (env inset) para a
 * barra nao ficar sob o indicador de gestos.
 */
export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-30 flex shrink-0 justify-around border-t border-line bg-surface pt-3 lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      {NAV_MOBILE.map((item) => {
        const ativo = isAtivo(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "relative flex min-w-[58px] flex-col items-center gap-[3px] text-[10px] font-extrabold transition-colors",
              ativo ? "text-blue" : "text-subtle",
            )}
          >
            <m.span
              aria-hidden
              className="relative text-[20px] leading-none"
              animate={{ y: ativo ? -2 : 0, scale: ativo ? 1.1 : 1 }}
              transition={spring.bouncy}
            >
              {item.emoji}
              {item.badgeErros && <PontoErros />}
            </m.span>
            {item.curto}
            {ativo && (
              <m.span
                layoutId="tab-ativo"
                className="absolute -top-3 h-[3px] w-7 rounded-full bg-blue"
                transition={spring.snappy}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function PontoErros() {
  const pronto = useHydrated();
  const total = useErrorsStore(totalPendente);
  if (!pronto || total === 0) return null;
  return (
    <m.span
      className="tnum absolute -top-1 -right-2.5 rounded-full bg-coral px-1.5 text-[10px] leading-[15px] font-black text-white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={spring.bouncy}
    >
      {total > 99 ? "99+" : total}
    </m.span>
  );
}
