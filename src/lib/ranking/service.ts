import { rankingStorage } from "./storage";
import {
  semanaKey,
  valorDoCriterio,
  type Criterio,
  type EntradaRanking,
  type LinhaRanking,
  type Publicacao,
  type RespostaRanking,
} from "./tipos";

/** Tamanho do placar visivel. Acima disso ninguem rola a lista. */
export const TOP = 50;

/** Identidade vinda da SESSAO — nunca do corpo da requisicao. */
export type IdentidadeRanking = {
  id: string;
  nome: string;
  cargo: string;
  avatar: string | null;
};

/**
 * Publica (ou remove) o resumo de progresso de uma pessoa.
 *
 * Idempotente por pessoa: sempre sobrescreve o registro anterior, entao o
 * cliente pode reenviar a vontade — e reenvia, a cada licao concluida.
 */
export async function publicar(
  identidade: IdentidadeRanking,
  dados: Publicacao,
): Promise<void> {
  const storage = rankingStorage();

  if (!dados.visivel) {
    await storage.remover(identidade.id);
    return;
  }

  await storage.gravar({
    ...identidade,
    xpTotal: dados.xpTotal,
    xpSemana: dados.xpSemana,
    semana: semanaKey(),
    streak: dados.streak,
    licoes: dados.licoes,
    minutos: dados.minutos,
    atualizadoEm: Date.now(),
  });
}

/** Remove a pessoa do placar (usado pelo opt-out e pelo reset de progresso). */
export async function remover(id: string): Promise<void> {
  await rankingStorage().remover(id);
}

/**
 * Monta o placar de um criterio.
 *
 * A ordenacao acontece em memoria, e nao em estruturas ordenadas do Redis, de
 * proposito: manter tres sorted sets (semana, geral, ofensiva) exigiria
 * escrita em tres lugares mais um job para zerar o semanal na virada da
 * semana. Com um hash unico + ordenacao na leitura, a virada de semana e
 * automatica (`valorDoCriterio` zera quem tem semana antiga) e nao existe
 * estado derivado para dessincronizar. O custo e O(n log n) por leitura, o que
 * e irrelevante na ordem de grandeza de um treinamento corporativo.
 */
export async function classificar(
  criterio: Criterio,
  meuId: string | null,
): Promise<RespostaRanking> {
  const storage = rankingStorage();
  const semana = semanaKey();
  const entradas = await storage.ler();

  const ordenadas = [...entradas].sort((a, b) => {
    const dif =
      valorDoCriterio(b, criterio, semana) - valorDoCriterio(a, criterio, semana);
    if (dif !== 0) return dif;
    // Desempate estavel e explicavel: XP total, depois nome.
    if (b.xpTotal !== a.xpTotal) return b.xpTotal - a.xpTotal;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  // Posicao de competicao: valores iguais dividem a mesma posicao, e a
  // proxima posicao pula (1, 2, 2, 4) — como em placar esportivo.
  const linhas: LinhaRanking[] = [];
  let posicao = 0;
  let anterior: number | null = null;

  ordenadas.forEach((entrada, i) => {
    const valor = valorDoCriterio(entrada, criterio, semana);
    if (valor !== anterior) {
      posicao = i + 1;
      anterior = valor;
    }
    linhas.push({ posicao, valor, eu: entrada.id === meuId, entrada });
  });

  const minhaLinha = meuId ? (linhas.find((l) => l.eu) ?? null) : null;

  return {
    criterio,
    semana,
    linhas: linhas.slice(0, TOP),
    minhaLinha,
    participantes: linhas.length,
    persistencia: storage.tipo,
  };
}

/** Usado pelo card do ranking na Home: so a minha posicao, sem a lista. */
export async function minhaPosicao(
  criterio: Criterio,
  meuId: string,
): Promise<{ linha: LinhaRanking | null; participantes: number }> {
  const { minhaLinha, participantes } = await classificar(criterio, meuId);
  return { linha: minhaLinha, participantes };
}

export type { EntradaRanking };
