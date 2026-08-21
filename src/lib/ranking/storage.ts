import { entradaSchema, type EntradaRanking } from "./tipos";

/**
 * Persistencia do ranking.
 *
 * O app nao tem banco de dados — e isso e deliberado em todo o resto
 * (autenticacao via Google, progresso no localStorage). Um placar, porem, e
 * estado COMPARTILHADO por definicao: nao existe ranking "de todos" dentro de
 * um localStorage. Em vez de arrastar um ORM e um Postgres para dentro do
 * projeto, este modulo define a menor interface possivel e traz duas
 * implementacoes:
 *
 *  1. REDIS REST (Vercel KV / Upstash) — usada quando as variaveis de ambiente
 *     existem. Fala HTTP puro com `fetch`, portanto NAO adiciona dependencia
 *     nenhuma ao package.json e funciona no runtime Edge.
 *  2. MEMORIA — fallback. O placar funciona de verdade (varias contas no mesmo
 *     servidor se veem), mas o dado morre no restart e nao e compartilhado
 *     entre instancias serverless. Serve para desenvolvimento e para o app
 *     nao quebrar em um deploy sem KV configurado; a UI avisa quando este e
 *     o modo ativo, em vez de fingir persistencia.
 */

export type RankingStorage = {
  tipo: "compartilhada" | "memoria";
  ler(): Promise<EntradaRanking[]>;
  gravar(entrada: EntradaRanking): Promise<void>;
  remover(id: string): Promise<void>;
};

/** Chave unica: um hash com uma entrada por pessoa. */
const CHAVE = "sankhya-quiz:ranking:v1";

/* ===========================================================================
 * Redis via REST (Upstash e Vercel KV expoem a MESMA API)
 * ======================================================================== */

function credenciais() {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/** `true` quando existe backend compartilhado configurado. */
export function temPersistenciaCompartilhada() {
  return credenciais() !== null;
}

function redisStorage(url: string, token: string): RankingStorage {
  async function comando<T>(args: (string | number)[]): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      // Placar muda a cada resposta certa: cache aqui devolveria numero velho.
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Redis REST ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) throw new Error(`Redis REST: ${json.error}`);
    return json.result as T;
  }

  return {
    tipo: "compartilhada",

    async ler() {
      // HGETALL devolve um array plano [campo, valor, campo, valor, ...].
      const plano = (await comando<string[] | null>(["HGETALL", CHAVE])) ?? [];
      const saida: EntradaRanking[] = [];
      for (let i = 1; i < plano.length; i += 2) {
        const parsed = parseEntrada(plano[i]);
        if (parsed) saida.push(parsed);
      }
      return saida;
    },

    async gravar(entrada) {
      await comando(["HSET", CHAVE, entrada.id, JSON.stringify(entrada)]);
    },

    async remover(id) {
      await comando(["HDEL", CHAVE, id]);
    },
  };
}

/* ===========================================================================
 * Memoria
 * ======================================================================== */

/**
 * `globalThis` e nao um `const` de modulo: em desenvolvimento o Next recarrega
 * modulos a cada edicao, e um Map de modulo perderia o placar a cada save.
 */
const g = globalThis as typeof globalThis & {
  __rankingMemoria?: Map<string, EntradaRanking>;
};
g.__rankingMemoria ??= new Map();

const memoriaStorage: RankingStorage = {
  tipo: "memoria",
  async ler() {
    return [...g.__rankingMemoria!.values()];
  },
  async gravar(entrada) {
    g.__rankingMemoria!.set(entrada.id, entrada);
  },
  async remover(id) {
    g.__rankingMemoria!.delete(id);
  },
};

/* ===========================================================================
 * Selecao
 * ======================================================================== */

/** Descarta registro invalido em vez de derrubar o placar inteiro. */
function parseEntrada(bruto: string): EntradaRanking | null {
  try {
    const parsed = entradaSchema.safeParse(JSON.parse(bruto));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function rankingStorage(): RankingStorage {
  const cred = credenciais();
  return cred ? redisStorage(cred.url, cred.token) : memoriaStorage;
}
