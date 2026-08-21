import { z } from "zod";

export { inicioDaSemana, rotuloDaSemana, semanaKey } from "./semana";

/**
 * Contrato do ranking.
 *
 * O ranking e a PRIMEIRA parte do app com estado compartilhado: XP, ofensiva e
 * licoes sempre viveram no localStorage de cada navegador (ver
 * `store/progress.ts`), o que e suficiente para o progresso individual mas
 * torna impossivel comparar duas pessoas. Aqui cada cliente PUBLICA um resumo
 * do proprio progresso e LE o resumo de todos.
 *
 * Consequencia honesta disso: os numeros sao AUTODECLARADOS. Nao existe forma
 * de auditar XP que foi calculado no cliente, e por isso o ranking e explicito
 * na UI sobre ser um placar de estimulo, nao uma avaliacao formal. Quando o
 * progresso migrar para o servidor (as questoes e a correcao ja vivem la), o
 * unico arquivo a mudar e o `service.ts` — o formato abaixo continua valendo.
 */

/**
 * Limites de sanidade. Nao impedem trapaca (impossivel com estado no cliente),
 * mas impedem que um numero absurdo — por bug ou por brincadeira no console —
 * quebre a escala do placar para todo mundo.
 */
export const LIMITES = {
  xp: 5_000_000,
  streak: 3_650,
  licoes: 5_000,
  minutos: 1_000_000,
} as const;

/** Corpo aceito em POST /api/ranking. A identidade NUNCA vem daqui. */
export const publicacaoSchema = z.object({
  xpTotal: z.number().int().min(0).max(LIMITES.xp),
  xpSemana: z.number().int().min(0).max(LIMITES.xp),
  streak: z.number().int().min(0).max(LIMITES.streak),
  licoes: z.number().int().min(0).max(LIMITES.licoes),
  minutos: z.number().int().min(0).max(LIMITES.minutos),
  /** `false` remove a pessoa do placar (opt-out em /configuracoes). */
  visivel: z.boolean(),
});

export type Publicacao = z.infer<typeof publicacaoSchema>;

/** Uma linha do placar, como fica guardada e como sai na API. */
export type EntradaRanking = {
  /** Id do provedor de identidade (`token.sub`). Chave do registro. */
  id: string;
  nome: string;
  cargo: string;
  avatar: string | null;
  xpTotal: number;
  /** XP da semana em `semana`. Ignorado quando a semana virou. */
  xpSemana: number;
  semana: string;
  streak: number;
  licoes: number;
  minutos: number;
  /** Epoch ms da ultima publicacao. */
  atualizadoEm: number;
};

/** Schema do que esta gravado — registro antigo/corrompido e descartado. */
export const entradaSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  cargo: z.string(),
  avatar: z.string().nullable(),
  xpTotal: z.number().int().min(0),
  xpSemana: z.number().int().min(0),
  semana: z.string(),
  streak: z.number().int().min(0),
  licoes: z.number().int().min(0),
  minutos: z.number().int().min(0),
  atualizadoEm: z.number().int().min(0),
});

export const CRITERIOS = ["semana", "geral", "ofensiva"] as const;
export type Criterio = (typeof CRITERIOS)[number];

export const criterioSchema = z.enum(CRITERIOS);

/** Linha ja classificada, com a posicao resolvida (empate = mesma posicao). */
export type LinhaRanking = {
  posicao: number;
  eu: boolean;
  /** Valor do criterio consultado, ja pronto para exibir. */
  valor: number;
  entrada: EntradaRanking;
};

export type RespostaRanking = {
  criterio: Criterio;
  semana: string;
  /** Top N. */
  linhas: LinhaRanking[];
  /** Minha linha, mesmo quando estou fora do top N. `null` = fora do placar. */
  minhaLinha: LinhaRanking | null;
  /** Total de pessoas no placar. */
  participantes: number;
  /** Nome do backend em uso, para a UI avisar quando for volatil. */
  persistencia: "compartilhada" | "memoria";
};

/** Valor do criterio para uma entrada, respeitando a virada de semana. */
export function valorDoCriterio(
  e: EntradaRanking,
  criterio: Criterio,
  semanaAtual: string,
): number {
  if (criterio === "geral") return e.xpTotal;
  if (criterio === "ofensiva") return e.streak;
  return e.semana === semanaAtual ? e.xpSemana : 0;
}
