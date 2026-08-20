/**
 * Geometria da trilha serpenteante do artboard 1b.
 *
 * O protótipo posiciona os nos com percentuais e tops fixos:
 *   44%/0 · 74%/110 · 44%/222 (atual) · 20%/352 · 48%/462 · 72%/572 (prova)
 * e desenha 6 pontos entre cada par de nos, com tamanhos 7-9-11-11-9-7.
 *
 * Aqui esses numeros viram uma funcao, para que a trilha aceite qualquer
 * quantidade de licoes mantendo exatamente a mesma cadencia visual.
 */

/** Ciclo de posicoes horizontais, em % da largura da area da trilha. */
const CICLO_X = [44, 74, 44, 20, 48, 72];

/** Distancia vertical entre centros de nos consecutivos, em px. */
const PASSO_Y = 111;

export type EstadoNo = "concluido" | "atual" | "bloqueado" | "prova";

export type NoTrilha = {
  id: string;
  titulo: string;
  subtitulo?: string;
  estado: EstadoNo;
  /** Marca o no como pertencente a unidade seguinte (atenuado). */
  proximaUnidade?: boolean;
};

export type NoPosicionado = NoTrilha & {
  /** Centro horizontal, em % da largura. */
  x: number;
  /** Centro vertical, em px a partir do topo da area. */
  y: number;
  diametro: number;
  /** Lado em que o rotulo e escrito. */
  lado: "esquerda" | "direita";
};

export type Ponto = { x: number; y: number; r: number; atraso: number };

export type Segmento = {
  /** Estado herdado do no de origem, que define a cor dos pontos. */
  estado: EstadoNo;
  pontos: Ponto[];
};

export type LayoutTrilha = {
  nos: NoPosicionado[];
  segmentos: Segmento[];
  altura: number;
};

/** Diametro por estado — o no atual e o maior, como no protótipo. */
function diametroDe(estado: EstadoNo) {
  if (estado === "atual") return 92;
  if (estado === "prova") return 88;
  return 76;
}

const RAIOS_PONTO = [3.5, 4.5, 5.5, 5.5, 4.5, 3.5];

export function layoutTrilha(nos: NoTrilha[], topo = 46): LayoutTrilha {
  const posicionados: NoPosicionado[] = nos.map((no, i) => {
    const x = CICLO_X[i % CICLO_X.length];
    const proximo = CICLO_X[(i + 1) % CICLO_X.length];
    return {
      ...no,
      x,
      y: topo + i * PASSO_Y,
      diametro: diametroDe(no.estado),
      // O rotulo vai para o lado oposto ao caminho seguinte, para nao
      // colidir com os pontos.
      lado: proximo >= x ? "direita" : "esquerda",
    };
  });

  const segmentos: Segmento[] = [];
  for (let i = 0; i < posicionados.length - 1; i++) {
    const a = posicionados[i];
    const b = posicionados[i + 1];
    segmentos.push({
      estado: a.estado,
      pontos: RAIOS_PONTO.map((r, k) => {
        // Amostragem no trecho central da curva: as pontas ficam escondidas
        // atras dos proprios nos.
        const t = 0.3 + (k / (RAIOS_PONTO.length - 1)) * 0.56;
        const p = curva(a, b, t);
        return { ...p, r, atraso: 0.13 * (k + 1) };
      }),
    });
  }

  const ultimo = posicionados.at(-1);
  return {
    nos: posicionados,
    segmentos,
    altura: ultimo ? ultimo.y + ultimo.diametro / 2 + 74 : 0,
  };
}

/**
 * Cubica de Bezier entre os centros de dois nos. Os pontos de controle saem
 * na horizontal do destino e na vertical da origem, o que produz a descida
 * seguida de arco lateral do protótipo (os pontos se adensam perto do no de
 * chegada, exatamente como nos percentuais originais).
 */
function curva(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  const c1 = { x: a.x, y: a.y + (b.y - a.y) * 0.62 };
  const c2 = { x: a.x + (b.x - a.x) * 0.72, y: b.y };
  const u = 1 - t;
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;
  return {
    x: w0 * a.x + w1 * c1.x + w2 * c2.x + w3 * b.x,
    y: w0 * a.y + w1 * c1.y + w2 * c2.y + w3 * b.y,
  };
}

/** Cores dos pontos por estado, tiradas do artboard 1b. */
export const COR_PONTO: Record<EstadoNo, string> = {
  concluido: "var(--trilha-dot-verde)",
  atual: "var(--trilha-dot-azul)",
  bloqueado: "var(--trilha-dot-cinza)",
  prova: "var(--trilha-dot-dourado)",
};
