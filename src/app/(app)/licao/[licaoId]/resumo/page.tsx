import type { Metadata } from "next";
import { ResumoLicao } from "@/components/quiz/resumo-licao";

export const metadata: Metadata = {
  title: "Resumo da lição",
  description: "Seu resultado na lição, com as questões que voltam para revisão.",
};

export default function ResumoPage() {
  return <ResumoLicao />;
}
