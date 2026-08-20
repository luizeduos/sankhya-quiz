"use client";

import { m } from "motion/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { useReducedMotionSafe } from "@/lib/hooks/use-reduced-motion-safe";
import { spring } from "@/lib/motion/springs";

/**
 * Entrada do app — Google como unico caminho.
 *
 * Sem formulario de senha de proposito (ver `lib/auth/index.ts`): o app nao
 * guarda credencial, entao nao existe cadastro, recuperacao de senha nem
 * usuario de demonstracao. Menos superficie de ataque e nenhum dado falso.
 */
export function LoginForm({
  callbackUrl,
  erroInicial,
  googleConfigurado,
}: {
  callbackUrl?: string;
  erroInicial?: string;
  googleConfigurado: boolean;
}) {
  const reduced = useReducedMotionSafe();
  const [erro, setErro] = useState<string | null>(
    erroInicial ? traduzErro(erroInicial) : null,
  );
  const [carregando, setCarregando] = useState(false);

  // Somente caminhos relativos: fecha a porta para open redirect.
  const destino = callbackUrl?.startsWith("/") ? callbackUrl : "/";

  async function entrar() {
    setErro(null);
    setCarregando(true);
    try {
      await signIn("google", { callbackUrl: destino });
    } catch {
      setErro("Não foi possível abrir o login do Google. Tente novamente.");
      setCarregando(false);
    }
  }

  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: spring.soft },
  };

  return (
    <m.div
      className="flex w-full max-w-[420px] flex-col items-center gap-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      <m.div variants={item}>
        <Mascot mood="idle" size={112} />
      </m.div>

      <m.div variants={item} className="flex flex-col items-center gap-2">
        <h1 className="text-title font-black">Bem-vindo</h1>
        <p className="text-center text-[15px] leading-relaxed text-muted">
          Treine o ERP Sankhya em sessões curtas. Ao errar, o app explica o
          equívoco e mostra de onde vem a resposta.
        </p>
      </m.div>

      <m.div
        variants={item}
        className="flex w-full flex-col gap-4 rounded-hero border border-line bg-surface p-6 sm:p-7"
      >
        <Button
          variant="blue"
          size="lg"
          full
          disabled={!googleConfigurado}
          loading={carregando}
          onClick={entrar}
          className="tracking-normal normal-case"
        >
          {!carregando && <GoogleMark />}
          {carregando ? "Abrindo o Google" : "Entrar com Google"}
        </Button>

        {!googleConfigurado && (
          <p className="rounded-card border-2 border-gold bg-gold-soft px-4 py-3 text-[13px] leading-relaxed text-gold-ink2">
            Este ambiente não tem o Google OAuth configurado. Defina{" "}
            <code className="font-mono">AUTH_GOOGLE_ID</code> e{" "}
            <code className="font-mono">AUTH_GOOGLE_SECRET</code> nas variáveis
            de ambiente.
          </p>
        )}

        {erro && (
          <m.p
            role="alert"
            className="rounded-card border-2 border-coral bg-coral-soft px-4 py-3 text-[14px] font-bold text-coral-ink"
            initial={{ opacity: 0, x: reduced ? 0 : -8 }}
            animate={
              reduced ? { opacity: 1 } : { opacity: 1, x: [-8, 6, -4, 2, 0] }
            }
            transition={reduced ? { duration: 0.12 } : { duration: 0.42 }}
          >
            {erro}
          </m.p>
        )}

        <p className="text-center text-[13px] leading-relaxed text-subtle">
          Usamos sua conta Google apenas para identificar você. O app não
          armazena senha.
        </p>
      </m.div>
    </m.div>
  );
}

function traduzErro(codigo: string) {
  switch (codigo) {
    case "OAuthAccountNotLinked":
      return "Este e-mail já foi usado com outro método de entrada.";
    case "AccessDenied":
      return "Acesso negado para esta conta.";
    case "Configuration":
      return "A autenticação está mal configurada neste ambiente. Avise o administrador.";
    case "OAuthCallbackError":
    case "OAuthSignInError":
      return "O login pelo Google não completou. Tente novamente.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#fff"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 009 18z"
        opacity=".85"
      />
      <path
        fill="#fff"
        d="M3.97 10.72a5.4 5.4 0 010-3.44V4.94H.96a9 9 0 000 8.12l3.01-2.34z"
        opacity=".7"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
        opacity=".55"
      />
    </svg>
  );
}
