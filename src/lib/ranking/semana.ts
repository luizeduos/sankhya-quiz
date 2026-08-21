/**
 * Janela semanal do ranking. Arquivo separado de `tipos.ts` de proposito: o
 * cliente precisa destas duas funcoes, e `tipos.ts` importa zod. Assim a
 * validacao (que so o servidor usa) nao entra no bundle da tela do ranking.
 */

/** Identificacao de semana ISO ("2026-W34"), a janela do ranking semanal. */
export function semanaKey(d: Date = new Date()): string {
  // Quinta-feira da semana corrente define o ano ISO (regra da ISO-8601).
  const alvo = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diaISO = (alvo.getDay() + 6) % 7; // 0 = segunda
  alvo.setDate(alvo.getDate() - diaISO + 3);
  const primeiraQuinta = new Date(alvo.getFullYear(), 0, 4);
  const diaISOJan4 = (primeiraQuinta.getDay() + 6) % 7;
  primeiraQuinta.setDate(primeiraQuinta.getDate() - diaISOJan4 + 3);
  const semanas =
    1 + Math.round((alvo.getTime() - primeiraQuinta.getTime()) / (7 * 86_400_000));
  return `${alvo.getFullYear()}-W${String(semanas).padStart(2, "0")}`;
}

/** Segunda-feira (00:00 local) da semana corrente. */
export function inicioDaSemana(d: Date = new Date()): Date {
  const seg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  seg.setDate(seg.getDate() - ((seg.getDay() + 6) % 7));
  return seg;
}

/** Rotulo humano da semana ("18/08 – 24/08"). */
export function rotuloDaSemana(d: Date = new Date()): string {
  const seg = inicioDaSemana(d);
  const dom = new Date(seg);
  dom.setDate(seg.getDate() + 6);
  const f = (x: Date) =>
    `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}`;
  return `${f(seg)} – ${f(dom)}`;
}
