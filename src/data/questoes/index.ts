import type { Questao } from "../schema";
import { questoesCompras } from "./compras";
import { questoesEstocagem } from "./estocagem";
import { questoesFinanceiro } from "./financeiro";
import { questoesNavegando } from "./navegando";
import { questoesParametros } from "./parametros";
import { questoesPrecificacao } from "./precificacao";
import { questoesRecebimentos } from "./recebimentos";
import { questoesVendas } from "./vendas";

/**
 * Banco de questoes completo — conteudo real de Sankhya em pt-BR, com a
 * `fonte` de cada questao apontando para a aula correspondente no EAD.
 *
 * ATENCAO AO BUNDLE: este modulo pesa ~90 kB gzip (e texto, e o texto e o
 * produto). Importe-o SOMENTE de codigo de servidor — Server Components,
 * server actions e scripts. Componentes cliente devem receber as questoes de
 * que precisam por props ou por server action (ver
 * `src/app/(app)/revisar/actions.ts`).
 *
 * A validacao Zod do banco vive em `./validar`, que so o script de build usa.
 */
export const questoes: Questao[] = [
  ...questoesNavegando,
  ...questoesParametros,
  ...questoesCompras,
  ...questoesVendas,
  ...questoesRecebimentos,
  ...questoesEstocagem,
  ...questoesFinanceiro,
  ...questoesPrecificacao,
];

export const questoesPorId = new Map(questoes.map((q) => [q.id, q]));

const porLicao = new Map<string, Questao[]>();
for (const q of questoes) {
  const arr = porLicao.get(q.licaoId);
  if (arr) arr.push(q);
  else porLicao.set(q.licaoId, [q]);
}

export function questoesDaLicao(licaoId: string): Questao[] {
  return porLicao.get(licaoId) ?? [];
}

export function questoesDoModulo(moduloId: string): Questao[] {
  return questoes.filter((q) => q.moduloId === moduloId);
}

/** Contagem por licao, usada para gerar `src/data/contagens.ts`. */
export function contagemPorLicao(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [licaoId, lista] of porLicao) out[licaoId] = lista.length;
  return out;
}

/** Resumo do banco, para o script de validacao e paginas de servidor. */
export function resumoBanco() {
  const porTipo = new Map<string, number>();
  for (const q of questoes) porTipo.set(q.tipo, (porTipo.get(q.tipo) ?? 0) + 1);
  return {
    total: questoes.length,
    licoesComQuestao: porLicao.size,
    porTipo: Object.fromEntries(porTipo),
  };
}
