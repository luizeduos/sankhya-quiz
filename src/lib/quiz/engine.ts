import type { Fonte, Questao } from "@/data/schema";
import { normalizeAnswer, seededShuffle } from "@/lib/utils";

/* ===========================================================================
 * Resposta do usuario — uma forma por familia de interacao
 * ======================================================================== */
export type Resposta =
  /** Multipla escolha: id da alternativa marcada. */
  | { kind: "escolha"; id: string }
  /** Verdadeiro/falso. */
  | { kind: "booleano"; valor: boolean }
  /** Completar lacuna: posicao da lacuna -> id da ficha colocada. */
  | { kind: "lacunas"; mapa: Record<number, string> }
  /** Ordenar passos: ids na ordem escolhida. */
  | { kind: "ordem"; ids: string[] }
  /** Associar colunas: id do par (coluna esquerda) -> id do par escolhido a direita. */
  | { kind: "pares"; mapa: Record<string, string> }
  /** Resposta digitada. */
  | { kind: "texto"; valor: string };

/**
 * Veredito exibido no painel de feedback. A ordem dos campos e a ordem do
 * stagger na tela, como no artboard 1a:
 *   resposta correta -> por que errei -> por que a correta esta certa -> fonte
 */
export type Veredito = {
  correta: boolean;
  /** Texto da resposta correta, para exibir quando o usuario erra. */
  respostaCorreta: string;
  /** Por que a escolha do usuario esta errada. Ausente quando ele acertou. */
  porqueErrei?: string;
  porqueCorreta: string;
  fonte: Fonte;
};

/** Uma resposta vazia nao deve habilitar o botao VERIFICAR. */
export function respostaCompleta(q: Questao, r: Resposta | null): boolean {
  if (!r) return false;
  switch (q.tipo) {
    case "multipla-escolha":
      return r.kind === "escolha" && r.id.length > 0;
    case "verdadeiro-falso":
      return r.kind === "booleano";
    case "completar-lacuna":
      return (
        r.kind === "lacunas" &&
        q.lacunas.every((l) => Boolean(r.mapa[l.pos]))
      );
    case "ordenar-passos":
      return r.kind === "ordem" && r.ids.length === q.passos.length;
    case "associar-colunas":
      return (
        r.kind === "pares" && q.pares.every((p) => Boolean(r.mapa[p.id]))
      );
    case "resposta-curta":
      return r.kind === "texto" && r.valor.trim().length > 0;
  }
}

/**
 * Avalia a resposta. Correcao e binaria de proposito: em questoes de arrastar,
 * dar credito parcial diluiria o feedback — o valor esta em apontar
 * exatamente qual item foi trocado.
 */
export function verificar(q: Questao, r: Resposta): Veredito {
  const base = { porqueCorreta: q.explicacaoCorreta, fonte: q.fonte };

  switch (q.tipo) {
    case "multipla-escolha": {
      const correta = q.alternativas.find((a) => a.correta)!;
      if (r.kind !== "escolha") return erroGenerico(q, base, correta.texto);
      const escolhida = q.alternativas.find((a) => a.id === r.id);
      return {
        ...base,
        correta: escolhida?.correta === true,
        respostaCorreta: correta.texto,
        porqueErrei: escolhida?.correta ? undefined : escolhida?.explicacaoErro,
      };
    }

    case "verdadeiro-falso": {
      const textoCorreto = q.resposta ? "Verdadeiro" : "Falso";
      if (r.kind !== "booleano") return erroGenerico(q, base, textoCorreto);
      const acertou = r.valor === q.resposta;
      return {
        ...base,
        correta: acertou,
        respostaCorreta: textoCorreto,
        porqueErrei: acertou ? undefined : q.explicacaoErro,
      };
    }

    case "completar-lacuna": {
      const textoCorreto = q.lacunas
        .map((l, i) => {
          const ficha = q.banco.find((b) => b.id === l.respostaId);
          return `${i + 1}. ${ficha?.texto ?? "?"}`;
        })
        .join("  ·  ");
      if (r.kind !== "lacunas") return erroGenerico(q, base, textoCorreto);

      const primeiraErrada = q.lacunas.find(
        (l) => r.mapa[l.pos] !== l.respostaId,
      );
      if (!primeiraErrada) {
        return { ...base, correta: true, respostaCorreta: textoCorreto };
      }
      // A explicacao vem da ficha que o usuario colocou no lugar errado —
      // e o erro dele que precisa ser explicado, nao a resposta certa.
      const fichaUsada = q.banco.find(
        (b) => b.id === r.mapa[primeiraErrada.pos],
      );
      const fichaCerta = q.banco.find((b) => b.id === primeiraErrada.respostaId);
      return {
        ...base,
        correta: false,
        respostaCorreta: textoCorreto,
        porqueErrei:
          fichaUsada?.explicacaoErro ??
          `Na lacuna ${primeiraErrada.pos} você colocou "${fichaUsada?.texto ?? "?"}", mas o termo que fecha a frase é "${fichaCerta?.texto ?? "?"}".`,
      };
    }

    case "ordenar-passos": {
      const certos = [...q.passos].sort((a, b) => a.ordem - b.ordem);
      const textoCorreto = certos.map((p, i) => `${i + 1}. ${p.texto}`).join("  ·  ");
      if (r.kind !== "ordem") return erroGenerico(q, base, textoCorreto);

      const acertou = r.ids.every((id, i) => certos[i]?.id === id);
      if (acertou) {
        return { ...base, correta: true, respostaCorreta: textoCorreto };
      }
      const iErro = r.ids.findIndex((id, i) => certos[i]?.id !== id);
      const posto = r.ids[iErro];
      const esperado = certos[iErro];
      const colocado = q.passos.find((p) => p.id === posto);
      return {
        ...base,
        correta: false,
        respostaCorreta: textoCorreto,
        porqueErrei: `${q.explicacaoErro} Na posição ${iErro + 1} você colocou "${colocado?.texto ?? "?"}", quando o passo correto é "${esperado?.texto ?? "?"}".`,
      };
    }

    case "associar-colunas": {
      const textoCorreto = q.pares
        .map((p) => `${p.esquerda} → ${p.direita}`)
        .join("  ·  ");
      if (r.kind !== "pares") return erroGenerico(q, base, textoCorreto);

      const errado = q.pares.find((p) => r.mapa[p.id] !== p.id);
      if (!errado) {
        return { ...base, correta: true, respostaCorreta: textoCorreto };
      }
      const escolhido = q.pares.find((p) => p.id === r.mapa[errado.id]);
      return {
        ...base,
        correta: false,
        respostaCorreta: textoCorreto,
        porqueErrei:
          errado.explicacaoErro ??
          `Você ligou "${errado.esquerda}" a "${escolhido?.direita ?? "?"}". ${q.explicacaoErro}`,
      };
    }

    case "resposta-curta": {
      if (r.kind !== "texto") return erroGenerico(q, base, q.respostaCanonica);
      const dado = normalizeAnswer(r.valor);
      const acertou = q.respostasAceitas.some(
        (a) => normalizeAnswer(a) === dado,
      );
      return {
        ...base,
        correta: acertou,
        respostaCorreta: q.respostaCanonica,
        porqueErrei: acertou ? undefined : q.explicacaoErro,
      };
    }
  }
}

function erroGenerico(
  q: Questao,
  base: { porqueCorreta: string; fonte: Fonte },
  respostaCorreta: string,
): Veredito {
  return {
    ...base,
    correta: false,
    respostaCorreta,
    porqueErrei: "Resposta em formato inesperado.",
  };
}

/** Serializa a resposta para guardar no historico e reexibir no resumo. */
export function serializar(r: Resposta): string {
  switch (r.kind) {
    case "escolha":
      return r.id;
    case "booleano":
      return r.valor ? "verdadeiro" : "falso";
    case "texto":
      return r.valor;
    case "ordem":
      return r.ids.join(">");
    case "lacunas":
      return Object.entries(r.mapa)
        .map(([k, v]) => `${k}=${v}`)
        .join(",");
    case "pares":
      return Object.entries(r.mapa)
        .map(([k, v]) => `${k}=${v}`)
        .join(",");
  }
}

/* ===========================================================================
 * Montagem da sessao
 * ======================================================================== */

/**
 * Ordena as questoes da licao. `seed` mantem o embaralhamento estavel entre
 * servidor e cliente (e entre recargas da mesma sessao), o que evita
 * mismatch de hidratacao e "troca de questao" ao dar refresh.
 */
export function montarOrdem(questoes: Questao[], seed: string): string[] {
  // Do mais facil para o mais difícil dentro de cada bloco embaralhado:
  // a licao abre acessivel e fecha exigente.
  const embaralhadas = seededShuffle(questoes, seed);
  return [...embaralhadas]
    .sort((a, b) => a.dificuldade - b.dificuldade)
    .map((q) => q.id);
}

/** Alternativas embaralhadas de forma estavel por questao. */
export function alternativasEmbaralhadas<T extends { id: string }>(
  itens: readonly T[],
  seed: string,
): T[] {
  return seededShuffle(itens, seed);
}

/** Aproveitamento 0..1 de uma lista de respostas. */
export function aproveitamento(respostas: { correta: boolean }[]): number {
  if (respostas.length === 0) return 0;
  return respostas.filter((r) => r.correta).length / respostas.length;
}
