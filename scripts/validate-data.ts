/**
 * Valida o banco de questoes e regenera `src/data/contagens.ts`.
 *
 * Roda como `prebuild`, entao o arquivo gerado nunca fica defasado e conteudo
 * malformado derruba o build em vez de chegar em producao.
 *
 * Uso: npm run validate:data
 */
import { writeFileSync } from "node:fs";
import { contagemPorLicao, resumoBanco } from "../src/data/questoes";
import { validarBanco } from "../src/data/questoes/validar";
import { licoes, modulos } from "../src/data/modulos";

const erros = validarBanco();
const resumo = resumoBanco();

console.log("Banco de questoes Sankhya Quiz");
console.log(`  modulos:  ${modulos.length}`);
console.log(`  licoes:   ${licoes.length}`);
console.log(`  questoes: ${resumo.total}`);
for (const [tipo, n] of Object.entries(resumo.porTipo)) {
  console.log(`    ${tipo.padEnd(18)} ${n}`);
}

if (erros.length > 0) {
  console.error(`\n${erros.length} problema(s) encontrado(s):`);
  for (const e of erros) console.error(`  - ${e}`);
  process.exit(1);
}

/* Gera as contagens usadas pela camada de progresso no cliente. -------------
 * Sem isso, `lib/quiz/progresso.ts` precisaria importar o banco inteiro
 * (~90 kB gzip) so para saber quantas questoes cada licao tem — e como ele e
 * usado por componentes cliente, o banco iria para o bundle de quase toda
 * rota. */
const contagens = contagemPorLicao();
const linhas = licoes
  .map((l) => `  "${l.id}": ${contagens[l.id] ?? 0},`)
  .join("\n");

const conteudo = `/**
 * GERADO por scripts/validate-data.ts — nao edite a mao.
 * Rode \`npm run validate:data\` (ou qualquer \`npm run build\`) para atualizar.
 *
 * Quantidade de questoes por licao. Existe para que a camada de progresso,
 * usada em componentes cliente, saiba os totais sem importar o banco inteiro.
 */
export const QUESTOES_POR_LICAO: Record<string, number> = {
${linhas}
};

export const TOTAL_QUESTOES = ${resumo.total};

export function totalQuestoesDaLicao(licaoId: string): number {
  return QUESTOES_POR_LICAO[licaoId] ?? 0;
}
`;

writeFileSync("src/data/contagens.ts", conteudo, "utf8");
console.log("\nOK: banco valido. src/data/contagens.ts regenerado.");
