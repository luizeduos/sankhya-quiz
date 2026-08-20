import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, GOOGLE_CONFIGURADO } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse o Sankhya Quiz e continue treinando seu conhecimento no ERP Sankhya.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  // Ja logado? Nao faz sentido mostrar a tela de entrada.
  const sessao = await auth();
  if (sessao?.user) redirect(callbackUrl ?? "/");

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      erroInicial={error}
      googleConfigurado={GOOGLE_CONFIGURADO}
    />
  );
}
