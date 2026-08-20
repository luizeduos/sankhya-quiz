import "server-only";

import raw from "@/data/ead/catalog.json";

/**
 * Catalogo real do EAD Sankhya (ead.sankhya.com.br) — 388 aulas em 23 trilhas.
 *
 * `import "server-only"` e proposital: o JSON tem ~234 KB e serve apenas a
 * pagina /conteudo, que e Server Component. Se algum dia alguem importar este
 * modulo de um componente cliente, o build falha em vez de inflar o bundle
 * silenciosamente.
 *
 * O banco de questoes NAO depende deste arquivo: cada questao carrega sua
 * propria `fonte` (trilha, aula, url) embutida, para que o motor de quiz nao
 * precise do catalogo em runtime.
 */
export type AulaEad = {
  trilha: string;
  modulo: string;
  curso: string;
  duracaoCurso: string;
  ordem: number;
  aulaId: string;
  aula: string;
  qtdVideos: number;
  temQuiz: boolean;
  temPdf: boolean;
  url: string;
  playerUrls: string[];
};

type RawRow = {
  trilha_id: string;
  trilha: string;
  modulo: string;
  curso_id: string;
  curso: string;
  duracao_curso: string;
  ordem: string;
  aula_id: string;
  aula: string;
  qtd_videos: number;
  vimeo_ids: string;
  vimeo_urls: string;
  player_urls: string;
  quiz_questoes: string;
  pdf: string;
  tamanho_texto: string;
  url_aula: string;
};

const rows = raw as RawRow[];

export const aulas: AulaEad[] = rows.map((r) => ({
  trilha: r.trilha,
  modulo: r.modulo,
  curso: r.curso,
  duracaoCurso: r.duracao_curso,
  ordem: Number(r.ordem) || 0,
  aulaId: r.aula_id,
  aula: r.aula,
  qtdVideos: r.qtd_videos ?? 0,
  temQuiz: r.quiz_questoes !== "",
  temPdf: r.pdf !== "",
  url: r.url_aula,
  playerUrls: r.player_urls ? r.player_urls.split(",").filter(Boolean) : [],
}));

export type TrilhaEad = {
  nome: string;
  curso: string;
  duracao: string;
  aulas: AulaEad[];
  totalVideos: number;
  totalQuizzes: number;
};

/** Agrupa as aulas por trilha, preservando a ordem original do catalogo. */
export function listarTrilhas(): TrilhaEad[] {
  const map = new Map<string, TrilhaEad>();
  for (const a of aulas) {
    let t = map.get(a.trilha);
    if (!t) {
      t = {
        nome: a.trilha,
        curso: a.curso,
        duracao: a.duracaoCurso,
        aulas: [],
        totalVideos: 0,
        totalQuizzes: 0,
      };
      map.set(a.trilha, t);
    }
    t.aulas.push(a);
    t.totalVideos += a.qtdVideos;
    if (a.temQuiz) t.totalQuizzes += 1;
  }
  for (const t of map.values()) t.aulas.sort((x, y) => x.ordem - y.ordem);
  return [...map.values()];
}

export function buscarTrilha(nome: string): TrilhaEad | undefined {
  return listarTrilhas().find((t) => t.nome === nome);
}

/** Busca simples por nome de aula ou de trilha, sem acento e sem caixa. */
export function buscarAulas(termo: string, limite = 40): AulaEad[] {
  const q = termo
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
  if (!q) return [];
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  return aulas
    .filter((a) => norm(a.aula).includes(q) || norm(a.trilha).includes(q))
    .slice(0, limite);
}

/** "12:18:02" -> "12h 18min" */
export function formatarDuracao(hms: string): string {
  const [h, m] = hms.split(":").map(Number);
  if (!Number.isFinite(h)) return hms;
  if (h === 0) return `${m}min`;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

export const totaisEad = {
  aulas: aulas.length,
  trilhas: new Set(aulas.map((a) => a.trilha)).size,
  videos: aulas.reduce((s, a) => s + a.qtdVideos, 0),
};
