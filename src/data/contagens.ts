/**
 * GERADO por scripts/validate-data.ts — nao edite a mao.
 * Rode `npm run validate:data` (ou qualquer `npm run build`) para atualizar.
 *
 * Quantidade de questoes por licao. Existe para que a camada de progresso,
 * usada em componentes cliente, saiba os totais sem importar o banco inteiro.
 */
export const QUESTOES_POR_LICAO: Record<string, number> = {
  "nav-interface": 3,
  "nav-cadastros": 4,
  "nav-menus": 4,
  "nav-prova": 3,
  "par-parametros": 4,
  "par-top": 5,
  "par-acessos": 4,
  "par-prova": 3,
  "com-pedido": 4,
  "com-liberacao": 4,
  "com-nota": 4,
  "com-prova": 3,
  "ven-pedido": 4,
  "ven-aprovacao": 4,
  "ven-nfe": 4,
  "ven-prova": 3,
  "rec-titulos": 4,
  "rec-baixa": 4,
  "rec-boletos": 4,
  "rec-prova": 3,
  "est-movimento": 4,
  "est-controles": 4,
  "est-inventario": 4,
  "est-prova": 3,
  "fin-bancos": 4,
  "fin-conciliacao": 4,
  "fin-caixa": 3,
  "fin-prova": 3,
  "pre-custo": 4,
  "pre-tabelas": 4,
  "pre-analise": 4,
  "pre-prova": 3,
};

export const TOTAL_QUESTOES = 119;

export function totalQuestoesDaLicao(licaoId: string): number {
  return QUESTOES_POR_LICAO[licaoId] ?? 0;
}
