/**
 * SCHEMAS ZOD — fonte unica de verdade dos tipos do banco de questoes.
 *
 * Este modulo carrega o Zod (~63 kB gzip) e por isso NAO deve ser importado
 * como valor por nenhum componente. Quem precisa dos tipos importa de
 * `./schema`, que faz apenas re-export de TIPOS — e `import type` e apagado na
 * compilacao, entao o app recebe tipos derivados do Zod com custo zero em
 * runtime.
 *
 * Os schemas em si sao consumidos por `scripts/validate-data.ts`, que valida o
 * banco inteiro antes do build (`npm run validate:data`).
 */
import { z } from "zod";
import { TIPOS_QUESTAO, TONES } from "./constantes";

/* ===========================================================================
 * Fonte / referencia
 *
 * Toda questao aponta para a aula real do EAD Sankhya de onde o conteudo saiu.
 * E isso que alimenta a citacao em mono do painel de erro
 * ("Fonte: Faturamento MGE - 12:41" no protótipo).
 * ======================================================================== */
export const fonteSchema = z.object({
  /** Nome da trilha no EAD, ex. "Jornada de Vendas". */
  trilha: z.string().min(3),
  /** Nome da aula, ex. "Como faturar um orcamento de venda". */
  aula: z.string().min(3),
  /** URL da aula em ead.sankhya.com.br. */
  url: z.string().url(),
  /** Marca de tempo do video, quando aplicavel. */
  timestamp: z.string().regex(/^\d{1,2}:\d{2}$/).optional(),
  /** Trecho citado literalmente, exibido entre aspas. */
  citacao: z.string().min(10).optional(),
});
export type Fonte = z.infer<typeof fonteSchema>;

/* ===========================================================================
 * Blocos comuns
 * ======================================================================== */
const baseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  moduloId: z.string().min(2),
  licaoId: z.string().min(2),
  /** Enunciado da questao. */
  enunciado: z.string().min(12),
  /** Contexto opcional acima do enunciado (cenario, tela, situacao). */
  contexto: z.string().optional(),
  /** Por que a resposta correta esta certa. Sempre exibido no feedback. */
  explicacaoCorreta: z.string().min(20),
  fonte: fonteSchema,
  dificuldade: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string().min(2)).min(1),
});

const alternativaSchema = z.object({
  id: z.string().min(1),
  texto: z.string().min(1),
  correta: z.boolean(),
  /**
   * Por que ESTA alternativa esta errada. Obrigatoria em toda alternativa
   * incorreta — e o coracao do produto: ao errar, o app explica o equivoco
   * especifico daquela escolha, nao um texto genérico.
   */
  explicacaoErro: z.string().min(20).optional(),
});

const alternativasSchema = z
  .array(alternativaSchema)
  .min(2)
  .refine((alts) => alts.filter((a) => a.correta).length === 1, {
    message: "Deve haver exatamente uma alternativa correta.",
  })
  .refine((alts) => alts.every((a) => a.correta || !!a.explicacaoErro), {
    message: "Toda alternativa incorreta precisa de explicacaoErro.",
  });

/* ===========================================================================
 * Os 6 tipos de questao
 * ======================================================================== */

/** 1. Multipla escolha — 4 alternativas, uma correta. */
export const multiplaEscolhaSchema = baseSchema.extend({
  tipo: z.literal("multipla-escolha"),
  alternativas: alternativasSchema,
});

/** 2. Verdadeiro / falso — afirmacao unica, explicacao para cada lado. */
export const verdadeiroFalsoSchema = baseSchema.extend({
  tipo: z.literal("verdadeiro-falso"),
  afirmacao: z.string().min(12),
  resposta: z.boolean(),
  /** Por que a resposta oposta a correta esta errada. */
  explicacaoErro: z.string().min(20),
});

/** 3. Completar lacuna — arrastar fichas do banco para os espacos. */
export const completarLacunaSchema = baseSchema.extend({
  tipo: z.literal("completar-lacuna"),
  /** Texto com `{{1}}`, `{{2}}`... marcando as lacunas. */
  texto: z.string().includes("{{1}}"),
  lacunas: z
    .array(z.object({ pos: z.number().int().positive(), respostaId: z.string() }))
    .min(1),
  /** Fichas disponiveis, incluindo distratores. */
  banco: z
    .array(
      z.object({
        id: z.string().min(1),
        texto: z.string().min(1),
        /** Por que colocar esta ficha aqui e um erro comum. */
        explicacaoErro: z.string().min(20).optional(),
      }),
    )
    .min(2),
});

/** 4. Ordenar passos — arrastar para a sequencia correta do processo. */
export const ordenarPassosSchema = baseSchema.extend({
  tipo: z.literal("ordenar-passos"),
  passos: z
    .array(
      z.object({
        id: z.string().min(1),
        texto: z.string().min(3),
        /** Posicao correta, 1-based. */
        ordem: z.number().int().positive(),
      }),
    )
    .min(3),
  /** Por que a ordem trocada quebra o processo. */
  explicacaoErro: z.string().min(20),
});

/** 5. Associar colunas — ligar conceito (esquerda) a definicao (direita). */
export const associarColunasSchema = baseSchema.extend({
  tipo: z.literal("associar-colunas"),
  pares: z
    .array(
      z.object({
        id: z.string().min(1),
        esquerda: z.string().min(2),
        direita: z.string().min(2),
        /** Por que confundir este item e um erro comum. */
        explicacaoErro: z.string().min(20).optional(),
      }),
    )
    .min(3),
  explicacaoErro: z.string().min(20),
});

/** 6. Resposta digitada curta — nome de tela, campo, parametro ou sigla. */
export const respostaCurtaSchema = baseSchema.extend({
  tipo: z.literal("resposta-curta"),
  /** Variacoes aceitas; a comparacao normaliza caixa, acento e pontuacao. */
  respostasAceitas: z.array(z.string().min(1)).min(1),
  /** Resposta canonica mostrada no feedback. */
  respostaCanonica: z.string().min(1),
  dica: z.string().optional(),
  explicacaoErro: z.string().min(20),
});

export const questaoSchema = z.discriminatedUnion("tipo", [
  multiplaEscolhaSchema,
  verdadeiroFalsoSchema,
  completarLacunaSchema,
  ordenarPassosSchema,
  associarColunasSchema,
  respostaCurtaSchema,
]);

export type Questao = z.infer<typeof questaoSchema>;
export type QuestaoTipo = (typeof TIPOS_QUESTAO)[number];
export type MultiplaEscolha = z.infer<typeof multiplaEscolhaSchema>;
export type VerdadeiroFalso = z.infer<typeof verdadeiroFalsoSchema>;
export type CompletarLacuna = z.infer<typeof completarLacunaSchema>;
export type OrdenarPassos = z.infer<typeof ordenarPassosSchema>;
export type AssociarColunas = z.infer<typeof associarColunasSchema>;
export type RespostaCurta = z.infer<typeof respostaCurtaSchema>;
export type Alternativa = z.infer<typeof alternativaSchema>;


/* ===========================================================================
 * Modulos e licoes
 * ======================================================================== */
export const toneSchema = z.enum(TONES);
export type Tone = z.infer<typeof toneSchema>;

export const licaoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  moduloId: z.string().min(2),
  titulo: z.string().min(3),
  /** Uma linha explicando o que a licao cobre. */
  resumo: z.string().min(10),
  ordem: z.number().int().positive(),
  /** `prova` e o no dourado de fim de unidade (medalha no protótipo). */
  tipo: z.enum(["licao", "prova"]),
});
export type Licao = z.infer<typeof licaoSchema>;

export const moduloSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(3),
  /** Linha de apoio exibida no card de modulo (artboard 1c). */
  descricao: z.string().min(10),
  emoji: z.string().min(1),
  tone: toneSchema,
  /** Trilha correspondente no EAD Sankhya. */
  trilhaEad: z.string().min(3),
  ordem: z.number().int().positive(),
  licoes: z.array(licaoSchema).min(1),
});
export type Modulo = z.infer<typeof moduloSchema>;
