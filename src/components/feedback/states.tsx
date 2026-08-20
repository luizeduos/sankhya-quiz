"use client";

import { m } from "motion/react";
import { Button } from "@/components/ui/button";
import { Mascot, type MascotMood } from "@/components/mascot/mascot";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/** Estado vazio: nada a mostrar, mas com um caminho para frente. */
export function EmptyState({
  emoji,
  mascote = "pensando",
  titulo,
  descricao,
  acao,
  className,
}: {
  emoji?: string;
  mascote?: MascotMood | null;
  titulo: string;
  descricao: string;
  acao?: { rotulo: string; onClick: () => void };
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <m.div
      className={cn(
        "mx-auto flex w-full max-w-[440px] flex-col items-center gap-3 px-5 py-14 text-center",
        className,
      )}
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
    >
      {mascote ? (
        <Mascot mood={mascote} size={92} />
      ) : (
        <span aria-hidden className="text-[42px]">
          {emoji}
        </span>
      )}
      <p className="text-subtitle font-black">{titulo}</p>
      <p className="text-[15px] leading-relaxed text-muted">{descricao}</p>
      {acao && (
        <Button variant="blue" size="md" className="mt-2" onClick={acao.onClick}>
          {acao.rotulo}
        </Button>
      )}
    </m.div>
  );
}

/** Estado de erro: o que falhou e como tentar de novo. */
export function ErrorState({
  titulo = "Algo saiu do trilho",
  descricao,
  onTentar,
}: {
  titulo?: string;
  descricao: string;
  onTentar?: () => void;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <m.div
      className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-3 px-5 py-14 text-center"
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
    >
      <Mascot mood="triste" size={92} />
      <p className="text-subtitle font-black text-coral-ink">{titulo}</p>
      <p className="text-[15px] leading-relaxed text-muted">{descricao}</p>
      {onTentar && (
        <Button variant="coral" size="md" className="mt-2" onClick={onTentar}>
          Tentar de novo
        </Button>
      )}
    </m.div>
  );
}

/* ===========================================================================
 * Skeletons com shimmer
 * ======================================================================== */
export function SkeletonLinha({
  w = "100%",
  h = 16,
  className,
}: {
  w?: number | string;
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("shimmer rounded-full bg-track", className)}
      style={{ width: w, height: h }}
    />
  );
}

export function SkeletonCard({
  h = 160,
  className,
}: {
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("shimmer rounded-panel border border-line bg-surface", className)}
      style={{ height: h }}
    />
  );
}

/** Skeleton generico de pagina, usado nos `loading.tsx`. */
export function SkeletonPagina() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 lg:px-10">
      <div className="flex flex-col gap-2">
        <SkeletonLinha w={220} h={28} />
        <SkeletonLinha w={300} h={16} />
      </div>
      <SkeletonCard h={140} className="rounded-hero" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} h={186} className="rounded-[22px]" />
        ))}
      </div>
    </div>
  );
}
