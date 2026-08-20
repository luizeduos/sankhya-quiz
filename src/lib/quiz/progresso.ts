import { licoes, modulos, ordemGlobal } from "@/data/modulos";
import { totalQuestoesDaLicao } from "@/data/contagens";
import type { Licao, Modulo } from "@/data/schema";
import type { EstadoNo, NoTrilha } from "@/components/home/trilha-geometria";

/**
 * Traduz o mapa de licoes concluidas em estados de trilha.
 *
 * Regra de desbloqueio: a licao N abre quando a N-1 foi concluida. A primeira
 * licao de tudo comeca aberta. E o que faz a trilha ser "continua": o
 * desbloqueio atravessa a fronteira entre modulos.
 */
export type Concluidas = Record<string, number>;

export function licaoConcluida(c: Concluidas, licaoId: string) {
  return c[licaoId] !== undefined;
}

/** Indice, na ordem global, da primeira licao ainda nao concluida. */
export function indiceAtual(c: Concluidas): number {
  const i = ordemGlobal.findIndex((id) => !licaoConcluida(c, id));
  return i === -1 ? ordemGlobal.length - 1 : i;
}

export function licaoAtual(c: Concluidas): Licao {
  return licoes[indiceAtual(c)];
}

export function moduloAtual(c: Concluidas): Modulo {
  const atual = licaoAtual(c);
  return modulos.find((m) => m.id === atual.moduloId) ?? modulos[0];
}

export function estaLiberada(c: Concluidas, licaoId: string): boolean {
  const i = ordemGlobal.indexOf(licaoId);
  if (i <= 0) return true;
  return licaoConcluida(c, ordemGlobal[i - 1]) || licaoConcluida(c, licaoId);
}

function estadoDe(c: Concluidas, licao: Licao): EstadoNo {
  if (licaoConcluida(c, licao.id)) return "concluido";
  const atual = licaoAtual(c);
  if (licao.id === atual.id) return licao.tipo === "prova" ? "prova" : "atual";
  if (!estaLiberada(c, licao.id)) return "bloqueado";
  return licao.tipo === "prova" ? "prova" : "bloqueado";
}

/**
 * Nos da trilha exibida na Home: as licoes do modulo atual, seguidas das
 * duas primeiras do modulo seguinte (atenuadas). Isso reproduz a densidade de
 * 6 nos do artboard 1b e deixa visivel que a trilha nao termina na unidade.
 */
export function nosDaTrilha(c: Concluidas, modulo?: Modulo): NoTrilha[] {
  const mod = modulo ?? moduloAtual(c);
  const proprios: NoTrilha[] = mod.licoes.map((l) => ({
    id: l.id,
    titulo: l.titulo,
    subtitulo: subtituloDoNo(c, l, mod),
    estado: estadoDe(c, l),
  }));

  const iMod = modulos.findIndex((m) => m.id === mod.id);
  const seguinte = modulos[iMod + 1];
  if (!seguinte) return proprios;

  const espia: NoTrilha[] = seguinte.licoes.slice(0, 2).map((l) => ({
    id: l.id,
    titulo: l.titulo,
    subtitulo: seguinte.titulo,
    estado: estadoDe(c, l),
    proximaUnidade: true,
  }));

  return [...proprios, ...espia];
}

function subtituloDoNo(c: Concluidas, licao: Licao, modulo: Modulo) {
  const total = totalQuestoesDaLicao(licao.id);
  const pos = modulo.licoes.findIndex((l) => l.id === licao.id) + 1;
  const estado = estadoDe(c, licao);

  if (estado === "atual") {
    return `Lição ${pos} de ${modulo.licoes.length} · ${total} questões`;
  }
  if (estado === "concluido") {
    const nota = Math.round((c[licao.id] ?? 0) * 100);
    return `Concluída · ${nota}%`;
  }
  return licao.resumo;
}

/* ===========================================================================
 * Progresso por modulo — alimenta os cards do artboard 1c
 * ======================================================================== */
export type ProgressoModulo = {
  modulo: Modulo;
  concluidas: number;
  total: number;
  /** 0..1 */
  fracao: number;
  percentual: number;
  /** Estado de cada licao, para a mini-trilha do card. */
  nos: EstadoNo[];
  liberado: boolean;
};

export function progressoDoModulo(
  c: Concluidas,
  modulo: Modulo,
): ProgressoModulo {
  const total = modulo.licoes.length;
  const concluidas = modulo.licoes.filter((l) => licaoConcluida(c, l.id)).length;
  const nos = modulo.licoes.map((l) => estadoDe(c, l));
  return {
    modulo,
    concluidas,
    total,
    fracao: total > 0 ? concluidas / total : 0,
    percentual: total > 0 ? Math.round((concluidas / total) * 100) : 0,
    nos,
    liberado: estaLiberada(c, modulo.licoes[0]?.id ?? ""),
  };
}

export function progressoDeTodos(c: Concluidas): ProgressoModulo[] {
  return modulos.map((m) => progressoDoModulo(c, m));
}

/** Total de questoes do app, usado em telas de resumo. */
export function totalDeLicoes() {
  return licoes.length;
}
