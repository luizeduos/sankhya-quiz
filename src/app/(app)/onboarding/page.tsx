import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { OnboardingClient } from "./onboarding-client";

export const metadata: Metadata = {
  title: "Boas-vindas",
  description: "Escolha sua meta diária e comece a treinar o ERP Sankhya.",
};

export default async function OnboardingPage() {
  const sessao = await auth();
  const nome = sessao?.user?.name ?? "Você";
  return <OnboardingClient primeiroNome={nome.split(" ")[0]} />;
}
