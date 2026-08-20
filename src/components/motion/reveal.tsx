"use client";

import { m, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Deslocamento inicial em px no eixo Y (negativo sobe). */
  y?: number;
  delay?: number;
  /** Escalona os filhos diretos em vez de animar o proprio bloco. */
  stagger?: number;
  once?: boolean;
  as?: "div" | "section" | "ul" | "li";
};

/**
 * Reveal on-scroll com IntersectionObserver (via `useInView`), nao com
 * listener de scroll. Anima so `opacity` e `transform`.
 */
export function Reveal({
  children,
  className,
  y = 18,
  delay = 0,
  stagger,
  once = true,
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -8% 0px" });
  const reduced = useReducedMotionSafe();
  // O union de tags faz os tipos de ref se intersectarem; o cast mantem
  // a API polimorfica sem afrouxar as props.
  const Tag = m[as] as typeof m.div;

  if (stagger !== undefined) {
    return (
      <Tag
        ref={ref}
        className={className}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : y }}
      transition={{ ...spring.soft, delay }}
    >
      {children}
    </Tag>
  );
}

/** Filho de um `<Reveal stagger>`. Herda o timing do pai por variants. */
export function RevealItem({
  children,
  className,
  y = 16,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotionSafe();
  // O union de tags faz os tipos de ref se intersectarem; o cast mantem
  // a API polimorfica sem afrouxar as props.
  const Tag = m[as] as typeof m.div;
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        show: { opacity: 1, y: 0, transition: spring.soft },
      }}
    >
      {children}
    </Tag>
  );
}
