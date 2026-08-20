import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { licoesPorId, modulosPorId } from "@/data/modulos";
import { questoesDaLicao } from "@/data/questoes";
import { LicaoClient } from "./licao-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ licaoId: string }>;
}): Promise<Metadata> {
  const { licaoId } = await params;
  const licao = licoesPorId.get(licaoId);
  return {
    title: licao?.titulo ?? "Lição",
    description: licao?.resumo,
  };
}

export default async function LicaoPage({
  params,
}: {
  params: Promise<{ licaoId: string }>;
}) {
  const { licaoId } = await params;
  const licao = licoesPorId.get(licaoId);
  if (!licao) notFound();

  const modulo = modulosPorId.get(licao.moduloId) ?? null;
  const questoes = questoesDaLicao(licaoId);
  if (questoes.length === 0) notFound();

  return <LicaoClient licao={licao} modulo={modulo} questoes={questoes} />;
}
