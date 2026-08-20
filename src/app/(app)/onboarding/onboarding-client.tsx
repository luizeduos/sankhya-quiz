"use client";

import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { CircleWipe } from "@/components/motion/circle-wipe";
import { useProgressStore } from "@/store/progress";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";
import { modulos } from "@/data/modulos";
import { TOTAL_QUESTOES } from "@/data/contagens";
import { cn } from "@/lib/utils";

const METAS = [
  { min: 5, rotulo: "Casual", desc: "5 min por dia" },
  { min: 10, rotulo: "Regular", desc: "10 min por dia" },
  { min: 15, rotulo: "Sério", desc: "15 min por dia" },
  { min: 30, rotulo: "Intenso", desc: "30 min por dia" },
];

/**
 * Onboarding em 3 passos, com transicao de mascara circular na saida
 * (login -> onboarding -> home). O wipe cobre o intervalo em que o Next busca
 * a Home, entao a passagem nunca mostra tela em branco.
 */
export function OnboardingClient({ primeiroNome }: { primeiroNome: string }) {
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  const definirMeta = useProgressStore((s) => s.definirMeta);
  const concluirOnboarding = useProgressStore((s) => s.concluirOnboarding);

  const [passo, setPasso] = useState(0);
  const [meta, setMeta] = useState(10);
  const [saindo, setSaindo] = useState(false);

  function finalizar() {
    definirMeta(meta);
    concluirOnboarding();
    setSaindo(true);
    // O wipe roda enquanto o Next prepara a Home.
    router.prefetch("/");
    window.setTimeout(() => router.replace("/"), reduced ? 140 : 620);
  }

  const passos = [
    {
      mascote: "comemorando" as const,
      titulo: `Olá, ${primeiroNome}!`,
      texto:
        "O Sankhya Quiz treina seu conhecimento no ERP em sessões curtas. Ao errar, o app explica o equívoco, mostra a resposta certa e o motivo.",
      corpo: null,
      acao: "Como funciona",
    },
    {
      mascote: "pensando" as const,
      titulo: "Trilha por módulos",
      texto: `${TOTAL_QUESTOES} questões em ${modulos.length} módulos, com fonte nas aulas reais do EAD Sankhya.`,
      corpo: (
        <div className="grid w-full grid-cols-2 gap-2.5">
          {modulos.map((mod, i) => (
            <m.div
              key={mod.id}
              className="flex items-center gap-2 rounded-card border border-line bg-surface px-3 py-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: i * 0.05 }}
            >
              <span aria-hidden className="text-[16px]">
                {mod.emoji}
              </span>
              <span className="min-w-0 truncate text-[13px] font-extrabold">
                {mod.titulo}
              </span>
            </m.div>
          ))}
        </div>
      ),
      acao: "Definir minha meta",
    },
    {
      mascote: "idle" as const,
      titulo: "Sua meta diária",
      texto:
        "A ofensiva conta o dia em que você bate a meta. Comece por algo que dê para manter.",
      corpo: (
        <div className="grid w-full grid-cols-2 gap-2.5">
          {METAS.map((op) => (
            <m.button
              key={op.min}
              type="button"
              onClick={() => setMeta(op.min)}
              aria-pressed={meta === op.min}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-btn border-2 border-b-4 px-4 py-3 text-left",
                meta === op.min
                  ? "border-gold bg-gold-soft"
                  : "border-line-strong bg-surface hover:border-gold",
              )}
              whileTap={{ y: 2 }}
              transition={spring.snappy}
            >
              <span
                className={cn(
                  "text-[15px] font-black",
                  meta === op.min ? "text-gold-ink" : "text-ink",
                )}
              >
                {op.rotulo}
              </span>
              <span className="text-[13px] text-muted">{op.desc}</span>
            </m.button>
          ))}
        </div>
      ),
      acao: "Começar a treinar",
    },
  ];

  const atual = passos[passo];

  return (
    <div className="relative flex flex-1 items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-5 text-center">
        {/* Indicador de passos */}
        <div className="flex gap-2" role="tablist" aria-label="Passos">
          {passos.map((_, i) => (
            <m.span
              key={i}
              role="tab"
              aria-selected={i === passo}
              className={cn(
                "h-2 rounded-full",
                i <= passo ? "bg-blue" : "bg-track-deep",
              )}
              animate={{ width: i === passo ? 28 : 8 }}
              transition={spring.snappy}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={passo}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, x: reduced ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -30 }}
            transition={spring.soft}
          >
            <Mascot mood={atual.mascote} size={108} />
            <h1 className="text-title font-black">{atual.titulo}</h1>
            <p className="text-[15px] leading-relaxed text-muted">
              {atual.texto}
            </p>
            {atual.corpo}
          </m.div>
        </AnimatePresence>

        <div className="flex w-full flex-col gap-2">
          <Button
            variant="green"
            size="lg"
            full
            onClick={() =>
              passo === passos.length - 1 ? finalizar() : setPasso((p) => p + 1)
            }
          >
            {atual.acao}
          </Button>
          {passo === 0 && (
            <Button variant="ghost" size="sm" full onClick={finalizar}>
              Pular apresentação
            </Button>
          )}
          {passo > 0 && (
            <Button
              variant="ghost"
              size="sm"
              full
              onClick={() => setPasso((p) => p - 1)}
            >
              Voltar
            </Button>
          )}
        </div>
      </div>

      {saindo && <CircleWipe origin={{ x: 50, y: 58 }} color="var(--green)" />}
    </div>
  );
}
