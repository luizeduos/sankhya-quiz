/**
 * Constantes compartilhadas entre os tipos (`schema.ts`) e os schemas Zod
 * (`schema.zod.ts`). Ficam num modulo proprio para que nao exista ciclo de
 * importacao entre os dois.
 */

export const TONES = [
  "blue",
  "green",
  "gold",
  "coral",
  "violet",
  "orange",
] as const;

export const TIPOS_QUESTAO = [
  "multipla-escolha",
  "verdadeiro-falso",
  "completar-lacuna",
  "ordenar-passos",
  "associar-colunas",
  "resposta-curta",
] as const;

export const TIPO_LABEL: Record<(typeof TIPOS_QUESTAO)[number], string> = {
  "multipla-escolha": "Múltipla escolha",
  "verdadeiro-falso": "Verdadeiro ou falso",
  "completar-lacuna": "Complete a lacuna",
  "ordenar-passos": "Ordene os passos",
  "associar-colunas": "Associe as colunas",
  "resposta-curta": "Resposta curta",
};
