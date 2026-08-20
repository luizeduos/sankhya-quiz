import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "Trilhas",
  description:
    "Sua trilha de estudos no ERP Sankhya: continue de onde parou, revise erros e avance pelas unidades.",
};

export default async function HomePage() {
  const sessao = await auth();
  const primeiroNome = (sessao?.user?.name ?? "Você").split(" ")[0];

  return <HomeClient primeiroNome={primeiroNome} />;
}
