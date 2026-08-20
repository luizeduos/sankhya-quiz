import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { modulos, modulosPorId } from "@/data/modulos";
import { questoesDoModulo } from "@/data/questoes";
import { TIPO_LABEL, type Fonte, type QuestaoTipo } from "@/data/schema";
import { ModuloClient } from "./modulo-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduloId: string }>;
}): Promise<Metadata> {
  const { moduloId } = await params;
  const m = modulosPorId.get(moduloId);
  return { title: m?.titulo ?? "Unidade", description: m?.descricao };
}

/**
 * A leitura do banco de questoes acontece AQUI, no servidor. O componente
 * cliente recebe apenas os agregados de que precisa (contagem por tipo e a
 * lista de fontes), entao o banco (~90 kB gzip) nao vai para o navegador.
 */
export default async function ModuloPage({
  params,
}: {
  params: Promise<{ moduloId: string }>;
}) {
  const { moduloId } = await params;
  const modulo = modulosPorId.get(moduloId);
  if (!modulo) notFound();

  const questoes = questoesDoModulo(modulo.id);

  const contagem = new Map<QuestaoTipo, number>();
  for (const q of questoes) contagem.set(q.tipo, (contagem.get(q.tipo) ?? 0) + 1);

  const porTipo = [...contagem.entries()].map(([tipo, n]) => ({
    rotulo: TIPO_LABEL[tipo],
    n,
  }));

  // Aulas do EAD citadas pelas questoes desta unidade, sem repetir.
  const fontes: Fonte[] = [
    ...new Map(questoes.map((q) => [q.fonte.url, q.fonte])).values(),
  ];

  const indice = modulos.findIndex((m) => m.id === moduloId);

  return (
    <ModuloClient
      modulo={modulo}
      anterior={modulos[indice - 1] ?? null}
      seguinte={modulos[indice + 1] ?? null}
      totalQuestoes={questoes.length}
      porTipo={porTipo}
      fontes={fontes}
    />
  );
}
