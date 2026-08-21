"use client";

import * as Switch from "@radix-ui/react-switch";
import { m } from "motion/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Credits } from "@/components/chrome/credits";
import { SkeletonCard } from "@/components/feedback/states";
import { useHydrated } from "@/store/hydration";
import { META_DIARIA_PADRAO, useProgressStore } from "@/store/progress";
import { useErrorsStore } from "@/store/errors";
import { useRankingStore } from "@/store/ranking";
import { useSessionStore } from "@/store/session";
import { useMounted } from "@/lib/hooks/use-mounted";
import { spring } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

const METAS = [5, 10, 15, 20, 30];

export function ConfiguracoesClient({
  nome,
  email,
}: {
  nome: string;
  email: string;
}) {
  const pronto = useHydrated();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const montado = useMounted();

  const meta = useProgressStore((s) => s.metaDiariaMin);
  const definirMeta = useProgressStore((s) => s.definirMeta);
  const resetarProgresso = useProgressStore((s) => s.resetar);
  const participarRanking = useRankingStore((s) => s.participar);
  const definirParticipacao = useRankingStore((s) => s.definirParticipacao);
  const limparErros = useErrorsStore((s) => s.limpar);
  const abandonarSessao = useSessionStore((s) => s.abandonar);

  const [confirmandoReset, setConfirmandoReset] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5 px-5 py-7 lg:py-9">
      <h1 className="text-[26px] leading-tight font-black lg:text-[30px]">
        Configurações
      </h1>

      {/* Conta */}
      <Secao titulo="Conta">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-[15px] font-extrabold">{nome}</span>
            {email && (
              <span className="font-mono text-[12px] text-subtle">{email}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto tracking-normal normal-case"
            onClick={() => signOut({ redirectTo: "/login" })}
          >
            Sair da conta
          </Button>
        </div>
      </Secao>

      {/* Aparencia */}
      <Secao titulo="Aparência">
        <Item
          rotulo="Tema escuro"
          descricao={
            montado
              ? `Agora em ${resolvedTheme === "dark" ? "escuro" : "claro"}.`
              : "Carregando preferência."
          }
        >
          <SwitchLinha
            checked={montado ? resolvedTheme === "dark" : false}
            onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            rotulo="Alternar tema escuro"
          />
        </Item>
        <Item
          rotulo="Seguir o sistema"
          descricao="Usa a preferência de tema do seu dispositivo."
        >
          <SwitchLinha
            checked={montado ? theme === "system" : false}
            onCheckedChange={(v) =>
              setTheme(v ? "system" : (resolvedTheme ?? "light"))
            }
            rotulo="Seguir o tema do sistema"
          />
        </Item>
      </Secao>

      {/* Meta diaria */}
      <Secao titulo="Meta diária">
        {pronto ? (
          <>
            <p className="text-[14px] leading-relaxed text-muted">
              A ofensiva só conta o dia em que você atinge a meta. Escolha um
              valor que dê para manter todos os dias.
            </p>
            <div className="flex flex-wrap gap-2">
              {METAS.map((v) => (
                <m.button
                  key={v}
                  type="button"
                  onClick={() => {
                    definirMeta(v);
                    toast.sucesso(`Meta diária: ${v} min`);
                  }}
                  aria-pressed={meta === v}
                  className={cn(
                    "rounded-chip border-2 border-b-[3px] px-4 py-2 text-[14px] font-extrabold transition-colors",
                    meta === v
                      ? "border-gold bg-gold-soft text-gold-ink"
                      : "border-line-strong bg-surface text-muted hover:border-gold",
                  )}
                  whileTap={{ y: 2 }}
                  transition={spring.snappy}
                >
                  {v} min
                  {v === META_DIARIA_PADRAO && (
                    <span className="ml-1.5 text-[11px] opacity-60">padrão</span>
                  )}
                </m.button>
              ))}
            </div>
          </>
        ) : (
          <SkeletonCard h={90} className="border-0" />
        )}
      </Secao>

      {/* Ranking */}
      <Secao titulo="Ranking">
        {pronto ? (
          <>
            <Item
              rotulo="Aparecer no ranking"
              descricao={
                participarRanking
                  ? "Seu nome, foto e cargo do Google aparecem no placar, junto com XP, ofensiva e lições concluídas."
                  : "Você está fora do placar. Seu progresso continua sendo contado normalmente."
              }
            >
              <SwitchLinha
                checked={participarRanking}
                onCheckedChange={(v) => {
                  definirParticipacao(v);
                  toast.sucesso(
                    v ? "Você entrou no ranking." : "Você saiu do ranking.",
                  );
                }}
                rotulo="Aparecer no ranking"
              />
            </Item>
            <p className="text-[13px] leading-relaxed text-subtle">
              Desligar remove seu registro do placar no servidor — não é apenas
              uma preferência de exibição.
            </p>
          </>
        ) : (
          <SkeletonCard h={70} className="border-0" />
        )}
      </Secao>

      {/* Dados locais */}
      <Secao titulo="Dados">
        <p className="text-[14px] leading-relaxed text-muted">
          Seu progresso, XP, ofensiva e histórico de erros ficam guardados neste
          navegador (localStorage). A única coisa que sai daqui é o resumo
          publicado no ranking (XP, ofensiva e número de lições) — e só enquanto
          a opção acima estiver ligada.
        </p>
        {confirmandoReset ? (
          <div className="flex flex-col gap-2.5 rounded-card border-2 border-coral bg-coral-soft p-4">
            <p className="text-[14px] font-extrabold text-coral-ink">
              Apagar todo o progresso? Isso não pode ser desfeito.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="coral"
                size="sm"
                className="tracking-normal normal-case"
                onClick={() => {
                  resetarProgresso();
                  limparErros();
                  abandonarSessao();
                  // Republica o resumo zerado: sem isto o placar continuaria
                  // exibindo o XP antigo de quem acabou de apagar tudo.
                  void useRankingStore.getState().publicar({ forcar: true });
                  setConfirmandoReset(false);
                  toast.sucesso("Progresso apagado.");
                }}
              >
                Sim, apagar tudo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmandoReset(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="self-start tracking-normal normal-case"
            onClick={() => setConfirmandoReset(true)}
          >
            Apagar progresso local
          </Button>
        )}
      </Secao>

      {/* Sobre — crédito de desenvolvimento */}
      <Secao titulo="Sobre">
        <Credits variant="about" />
        <p className="text-[14px] leading-relaxed text-muted">
          Sankhya Quiz é um treinamento gamificado para o ERP Sankhya. As
          questões têm como fonte as aulas reais do EAD Sankhya, citadas no
          feedback de cada questão.
        </p>
      </Secao>
    </div>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <m.section
      className="flex flex-col gap-3 rounded-panel border border-line bg-surface p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={spring.soft}
    >
      <h2 className="text-[12px] font-extrabold tracking-[1.4px] text-subtle uppercase">
        {titulo}
      </h2>
      {children}
    </m.section>
  );
}

function Item({
  rotulo,
  descricao,
  children,
}: {
  rotulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
      <div className="flex min-w-0 flex-col">
        <span className="text-[15px] font-extrabold">{rotulo}</span>
        <span className="text-[13px] text-muted">{descricao}</span>
      </div>
      <div className="ml-auto shrink-0">{children}</div>
    </div>
  );
}

function SwitchLinha({
  checked,
  onCheckedChange,
  rotulo,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  rotulo: string;
}) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={rotulo}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-green" : "bg-track-deep",
      )}
    >
      <Switch.Thumb asChild>
        <m.span
          className="block size-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 26 : 4 }}
          transition={spring.snappy}
        />
      </Switch.Thumb>
    </Switch.Root>
  );
}
