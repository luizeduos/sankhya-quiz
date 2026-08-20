import type { Metadata } from "next";
import { ResumoLicao } from "@/components/quiz/resumo-licao";

export const metadata: Metadata = {
  title: "Resumo da revisão",
  description: "Resultado da sua sessão de revisão de erros.",
};

export default function ResumoRevisaoPage() {
  return <ResumoLicao />;
}
