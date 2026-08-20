import { cn } from "@/lib/utils";

/**
 * Superficie base do design: r20, borda de 1px, fundo de superficie.
 * Sem sombra difusa — a profundidade neste sistema e sempre solida.
 */
export function Card({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "section" | "article" | "aside" }) {
  return (
    <Tag
      className={cn(
        "rounded-panel border border-line bg-surface",
        className,
      )}
      {...props}
    />
  );
}

/** Rotulo de secao: 12/800, uppercase, tracking 1.4px. */
export function SectionLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-extrabold text-label uppercase text-subtle",
        className,
      )}
      {...props}
    />
  );
}
