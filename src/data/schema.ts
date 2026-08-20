/**
 * TIPOS do banco de questoes — ponto de importacao para TODO o app.
 *
 * Os tipos sao derivados dos schemas Zod em `./schema.zod`, que continua sendo
 * a fonte unica de verdade. A diferenca e que aqui tudo passa por
 * `export type`, apagado na compilacao: nenhum componente arrasta o Zod
 * (~63 kB gzip) para o bundle so para conhecer a forma de uma questao.
 *
 * Se voce precisa VALIDAR dados em runtime, importe de `./schema.zod` — e
 * faca isso apenas em scripts ou em codigo de servidor.
 */
export type {
  Alternativa,
  AssociarColunas,
  CompletarLacuna,
  Fonte,
  Licao,
  Modulo,
  MultiplaEscolha,
  OrdenarPassos,
  Questao,
  QuestaoTipo,
  RespostaCurta,
  Tone,
  VerdadeiroFalso,
} from "./schema.zod";

export { TIPOS_QUESTAO, TIPO_LABEL, TONES } from "./constantes";
