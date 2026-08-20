"use server";

import { auth } from "@/lib/auth";
import { questoesPorId } from "@/data/questoes";
import type { Questao } from "@/data/schema";

/** Nunca devolvemos mais que isto de uma vez. */
const MAX_POR_SESSAO = 20;

/**
 * Carrega as questoes de uma sessao de revisao pelos ids.
 *
 * Existe por dois motivos, nesta ordem de importancia:
 *
 * 1. BUNDLE. O banco de questoes tem ~90 kB gzip. A fila de revisao vive no
 *    localStorage (cliente), entao a pagina nao pode ser um Server Component
 *    puro — mas tambem nao precisa embarcar o banco inteiro no navegador para
 *    montar uma sessao de 10 questoes. O cliente manda os ids, o servidor
 *    devolve so o necessario.
 *
 * 2. ARQUITETURA. Quando o progresso migrar para uma API, esta funcao vira uma
 *    chamada HTTP sem que nenhum componente mude — a assinatura ja e
 *    `(ids) => Promise<Questao[]>`.
 */
export async function carregarQuestoes(ids: string[]): Promise<Questao[]> {
  // Rota protegida pelo middleware, mas server actions sao endpoints publicos:
  // a checagem de sessao aqui e obrigatoria, nao redundante.
  const sessao = await auth();
  if (!sessao?.user) return [];

  const unicos = [...new Set(ids)].slice(0, MAX_POR_SESSAO);
  return unicos
    .map((id) => questoesPorId.get(id))
    .filter((q): q is Questao => Boolean(q));
}
