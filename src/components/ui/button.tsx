"use client";

import { m } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion/springs";

/**
 * Botao pressionavel do design (artboard 1a, "Botoes pressionaveis").
 *
 * Profundidade: sombra solida deslocada na cor escura do proprio elemento.
 * Ao pressionar, o botao desce 4px (transform, via Motion) e a sombra vira
 * 2px (CSS `:active` em `.pressable`) — os dois em sincronia dao a sensacao
 * de tecla fisica. Nada de animar box-shadow: a sombra troca de valor de uma
 * vez, o deslocamento e que carrega o movimento.
 */
const buttonVariants = cva(
  cn(
    "pressable relative inline-flex select-none items-center justify-center gap-2",
    "font-sans font-black tracking-[0.8px] uppercase",
    "transition-colors duration-150",
    "disabled:pointer-events-none",
  ),
  {
    variants: {
      variant: {
        green: "bg-green text-white [--depth-color:var(--green-deep)]",
        blue: "bg-blue text-white [--depth-color:var(--blue-deep)]",
        coral: "bg-coral text-white [--depth-color:var(--coral-deep)]",
        gold: "bg-gold text-[#4a3200] [--depth-color:var(--gold-deep)]",
        violet: "bg-violet text-white [--depth-color:var(--violet-deep)]",
        /** "PULAR" — contorno, texto azul. */
        outline: cn(
          "border-2 border-line-strong bg-surface text-blue",
          "[--depth-color:var(--border-strong)]",
          "hover:bg-blue-soft",
        ),
        neutral:
          "bg-neutralbtn text-neutralbtn-ink [--depth-color:var(--neutral-btn-deep)]",
        /** Sem profundidade: acoes terciarias, links de texto. */
        ghost:
          "text-muted hover:bg-track hover:text-ink [--depth-y:0px] tracking-normal normal-case",
      },
      size: {
        lg: "rounded-btn px-6 py-[15px] text-[16px]",
        md: "rounded-card px-5 py-[13px] text-[14px]",
        sm: "rounded-chip px-[18px] py-[11px] text-[13px]",
        icon: "size-11 rounded-card p-0 tracking-normal",
      },
      depth: { "0": "", "3": "", "5": "", "6": "" },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "green", size: "lg", depth: "5", full: false },
  },
);

const depthClass = { "0": "depth-0", "3": "depth-3", "5": "depth-5", "6": "depth-6" };

type Props = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
    /** Mostra spinner e bloqueia interacao, preservando a largura. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  depth = "5",
  full,
  loading,
  disabled,
  children,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  // Desabilitado herda a paleta neutra do design, seja qual for a variante.
  const resolved = isDisabled && variant !== "ghost" ? "neutral" : variant;

  return (
    <m.button
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant: resolved, size, full }),
        depthClass[depth ?? "5"],
        isDisabled && "cursor-not-allowed",
        className,
      )}
      whileTap={isDisabled ? undefined : { y: 4 }}
      whileHover={isDisabled ? undefined : { y: -1 }}
      transition={spring.overshoot}
      {...props}
    >
      {loading && (
        <m.span
          aria-hidden
          className="size-4 shrink-0 rounded-full border-2 border-current border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </m.button>
  );
}

export { buttonVariants };
