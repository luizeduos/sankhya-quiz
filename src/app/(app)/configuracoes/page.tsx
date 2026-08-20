import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { ConfiguracoesClient } from "./configuracoes-client";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Tema, meta diária, dados locais e informações do aplicativo.",
};

export default async function ConfiguracoesPage() {
  const sessao = await auth();
  return (
    <ConfiguracoesClient
      nome={sessao?.user?.name ?? "Você"}
      email={sessao?.user?.email ?? ""}
    />
  );
}
