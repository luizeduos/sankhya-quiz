import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { RankingClient } from "./ranking-client";

export const metadata: Metadata = {
  title: "Ranking",
  description:
    "Placar de XP da semana, XP total e ofensiva entre todos que estudam no Sankhya Quiz.",
};

export default async function RankingPage() {
  const sessao = await auth();
  return <RankingClient nome={sessao?.user?.name ?? "Você"} />;
}
