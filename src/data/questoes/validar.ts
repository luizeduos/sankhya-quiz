import { questaoSchema } from "../schema.zod";
import { licoesPorId, modulosPorId } from "../modulos";
import { questoes } from "./index";

/**
 * Validacao Zod do banco de questoes.
 *
 * Vive separado de `./index` porque carrega o Zod: se estivesse no barrel,
 * qualquer import do banco arrastaria ~63 kB gzip de validador para o bundle.
 * Aqui, so `scripts/validate-data.ts` importa este modulo.
 */
export function validarBanco(): string[] {
  const erros: string[] = [];
  const vistos = new Set<string>();
  const licoesComQuestao = new Set<string>();

  for (const q of questoes) {
    const r = questaoSchema.safeParse(q);
    if (!r.success) {
      for (const issue of r.error.issues) {
        erros.push(`${q.id}: ${issue.path.join(".") || "(raiz)"} - ${issue.message}`);
      }
    }

    if (vistos.has(q.id)) erros.push(`${q.id}: id duplicado`);
    vistos.add(q.id);
    licoesComQuestao.add(q.licaoId);

    if (!modulosPorId.has(q.moduloId)) {
      erros.push(`${q.id}: moduloId "${q.moduloId}" nao existe`);
    }
    const licao = licoesPorId.get(q.licaoId);
    if (!licao) {
      erros.push(`${q.id}: licaoId "${q.licaoId}" nao existe`);
    } else if (licao.moduloId !== q.moduloId) {
      erros.push(`${q.id}: licao "${q.licaoId}" pertence a outro modulo`);
    }

    if (q.tipo === "completar-lacuna") {
      const ids = new Set(q.banco.map((b) => b.id));
      for (const l of q.lacunas) {
        if (!ids.has(l.respostaId)) {
          erros.push(`${q.id}: lacuna ${l.pos} aponta para ficha inexistente`);
        }
        if (!q.texto.includes(`{{${l.pos}}}`)) {
          erros.push(`${q.id}: texto nao contem o marcador {{${l.pos}}}`);
        }
      }
      if (q.banco.length <= q.lacunas.length) {
        erros.push(`${q.id}: o banco precisa de ao menos um distrator`);
      }
    }

    if (q.tipo === "ordenar-passos") {
      const ordens = q.passos.map((p) => p.ordem).sort((a, b) => a - b);
      const esperado = q.passos.map((_, i) => i + 1);
      if (ordens.join(",") !== esperado.join(",")) {
        erros.push(`${q.id}: ordens devem ser 1..${q.passos.length} sem repetir`);
      }
    }
  }

  // Toda licao precisa de questao, senao a trilha oferece um no vazio.
  for (const licao of licoesPorId.values()) {
    if (!licoesComQuestao.has(licao.id)) {
      erros.push(`licao "${licao.id}" nao tem nenhuma questao`);
    }
  }

  return erros;
}
