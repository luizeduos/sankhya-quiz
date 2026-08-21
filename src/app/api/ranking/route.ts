import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { classificar, publicar } from "@/lib/ranking/service";
import { criterioSchema, publicacaoSchema } from "@/lib/ranking/tipos";

/**
 * API do ranking.
 *
 * Duas operacoes, uma rota:
 *   GET  ?criterio=semana|geral|ofensiva  -> placar + minha posicao
 *   POST { xpTotal, xpSemana, ... }       -> publica meu resumo
 *
 * REGRA CENTRAL: a identidade (id, nome, avatar, cargo) sai da SESSAO, nunca
 * do corpo. Se viesse do corpo, qualquer pessoa logada poderia escrever no
 * registro de outra — ou inventar um participante que nao existe.
 *
 * O middleware nao cobre `/api` (ver `matcher` em middleware.ts), portanto a
 * checagem de sessao aqui e a unica que existe: nao e redundante.
 */

// Placar muda a cada resposta certa; qualquer cache aqui devolve numero velho.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessao = await auth();
  if (!sessao?.user) {
    return NextResponse.json({ erro: "nao-autenticado" }, { status: 401 });
  }

  const bruto = new URL(req.url).searchParams.get("criterio");
  const criterio = criterioSchema.safeParse(bruto ?? "semana");
  if (!criterio.success) {
    return NextResponse.json({ erro: "criterio-invalido" }, { status: 400 });
  }

  try {
    const placar = await classificar(criterio.data, sessao.user.id ?? null);
    return NextResponse.json(placar);
  } catch (e) {
    // Falha do backend de placar nao pode virar erro 500 na cara do usuario:
    // a tela mostra um estado de erro com "tentar de novo".
    console.error("[ranking] leitura falhou:", e);
    return NextResponse.json({ erro: "indisponivel" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const sessao = await auth();
  const id = sessao?.user?.id;
  if (!sessao?.user || !id) {
    return NextResponse.json({ erro: "nao-autenticado" }, { status: 401 });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "json-invalido" }, { status: 400 });
  }

  const dados = publicacaoSchema.safeParse(corpo);
  if (!dados.success) {
    return NextResponse.json(
      { erro: "dados-invalidos", detalhe: dados.error.issues },
      { status: 400 },
    );
  }

  try {
    await publicar(
      {
        id,
        nome: sessao.user.name ?? "Participante",
        cargo: sessao.user.cargo ?? "Analista",
        avatar: sessao.user.image ?? null,
      },
      dados.data,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[ranking] publicacao falhou:", e);
    return NextResponse.json({ erro: "indisponivel" }, { status: 503 });
  }
}
