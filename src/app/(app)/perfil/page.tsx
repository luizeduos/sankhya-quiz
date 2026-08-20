import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { PerfilClient } from "./perfil-client";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Seu progresso, XP, ofensiva e desempenho por módulo.",
};

export default async function PerfilPage() {
  const sessao = await auth();
  return (
    <PerfilClient
      nome={sessao?.user?.name ?? "Você"}
      email={sessao?.user?.email ?? ""}
      cargo={sessao?.user?.cargo ?? "Analista"}
      imagem={sessao?.user?.image ?? null}
    />
  );
}
