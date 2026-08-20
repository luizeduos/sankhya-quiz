/**
 * Monta a URL canonica de uma aula no EAD Sankhya.
 *
 * O padrao foi verificado contra as 387 linhas de `catalog.json`: nenhuma
 * divergencia. `cat` = trilha_id, `cid` = curso_id, `aid` = aula_id.
 */
export function ead(cat: number, cid: number, aid: number): string {
  return `https://ead.sankhya.com.br/html/conteudo.php?act=cnt&niv=1&cat=${cat}&cid=${cid}&aid=${aid}`;
}

/** IDs de trilha/curso por modulo, para nao repetir numeros soltos. */
export const TRILHA = {
  navegando: { cat: 10, cid: 11, nome: "Navegando com Maestria" },
  parametros: { cat: 9, cid: 9, nome: "Configurações técnicas" },
  compras: { cat: 1, cid: 1, nome: "Jornada de Compras" },
  vendas: { cat: 4, cid: 4, nome: "Jornada de Vendas" },
  recebimentos: { cat: 7, cid: 7, nome: "Jornada de Recebimentos" },
  estocagem: { cat: 3, cid: 3, nome: "Jornada de Estocagem" },
  financeiro: { cat: 8, cid: 8, nome: "Jornada Financeira" },
  precificacao: { cat: 2, cid: 2, nome: "Jornada de Precificação" },
} as const;

export type ModuloId = keyof typeof TRILHA;

/** Atalho: `fonte("vendas", 103, "Como realizar a emissão de NF-e")`. */
export function fonte(
  modulo: ModuloId,
  aulaId: number,
  aula: string,
  extra?: { timestamp?: string; citacao?: string },
) {
  const t = TRILHA[modulo];
  return {
    trilha: t.nome,
    aula,
    url: ead(t.cat, t.cid, aulaId),
    ...extra,
  };
}
