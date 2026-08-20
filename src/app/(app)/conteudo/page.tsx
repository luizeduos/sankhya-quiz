import type { Metadata } from "next";
import { Chip } from "@/components/ui/chip";
import { formatarDuracao, listarTrilhas, totaisEad } from "@/lib/ead/catalog";
import { modulos } from "@/data/modulos";
import { resumoBanco } from "@/data/questoes";

export const metadata: Metadata = {
  title: "Conteúdo",
  description:
    "Catálogo do EAD Sankhya que serve de fonte para as questões do quiz.",
};

/**
 * Catalogo do EAD.
 *
 * Server Component de proposito: le `src/data/ead/catalog.json` (~234 KB) no
 * servidor e envia apenas HTML. O JSON nunca entra no bundle do cliente — o
 * modulo `lib/ead/catalog.ts` e marcado `server-only` justamente para que uma
 * importacao acidental no cliente falhe no build em vez de inflar a rota.
 */
export default function ConteudoPage() {
  const trilhas = listarTrilhas();
  const resumo = resumoBanco();
  const cobertas = new Set(modulos.map((m) => m.trilhaEad));

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-5 py-7 lg:py-9">
      <div className="flex flex-col gap-2">
        <h1 className="text-[26px] leading-tight font-black lg:text-[30px]">
          Conteúdo
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          As questões do quiz saem das aulas reais do EAD Sankhya. Cada questão
          cita a aula de origem no painel de feedback, e você pode abri-la aqui.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Estatistica valor={resumo.total} rotulo="questões" />
        <Estatistica valor={totaisEad.trilhas} rotulo="trilhas no EAD" />
        <Estatistica valor={totaisEad.aulas} rotulo="aulas catalogadas" />
        <Estatistica valor={totaisEad.videos} rotulo="vídeos" />
      </div>

      <div className="flex flex-col gap-4">
        {trilhas.map((t) => {
          const coberta = cobertas.has(t.nome);
          const modulo = modulos.find((m) => m.trilhaEad === t.nome);
          return (
            <details
              key={t.nome}
              className="group rounded-panel border border-line bg-surface"
              open={coberta}
            >
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-5">
                <span className="text-[17px] font-black">
                  {modulo ? `${modulo.emoji} ` : ""}
                  {t.nome}
                </span>
                {coberta ? (
                  <Chip tone="green">no quiz</Chip>
                ) : (
                  <Chip tone="neutral">catálogo</Chip>
                )}
                <span className="tnum ml-auto text-[13px] font-extrabold text-muted">
                  {t.aulas.length} aulas · {formatarDuracao(t.duracao)}
                </span>
              </summary>

              {/* Só as trilhas que alimentam o quiz listam as aulas uma a uma.
                  As outras 15 ficam como referência com link para o EAD: a
                  lista completa das 387 aulas deixava o HTML desta rota em
                  ~650 kB, o que atrasaria o LCP sem servir a ninguém. */}
              {!coberta ? (
                <p className="border-t border-line px-5 py-4 text-[14px] text-muted">
                  {t.aulas.length} aulas nesta trilha, ainda sem questões no
                  quiz.{" "}
                  <a
                    href={t.aulas[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-blue hover:underline"
                  >
                    Abrir no EAD Sankhya →
                  </a>
                </p>
              ) : (
              <ul className="flex flex-col gap-px border-t border-line px-5 py-4">
                {t.aulas.map((a) => (
                  <li key={a.aulaId} className="flex items-baseline gap-2.5 py-1">
                    <span className="tnum w-6 shrink-0 text-right font-mono text-[11px] text-subtle">
                      {a.ordem}
                    </span>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 text-[14px] leading-snug text-ink underline decoration-transparent underline-offset-2 transition-colors hover:decoration-blue hover:text-blue"
                    >
                      {a.aula}
                    </a>
                    <span className="ml-auto flex shrink-0 gap-1.5">
                      {a.qtdVideos > 0 && (
                        <span
                          className="text-[11px] text-subtle"
                          title={`${a.qtdVideos} vídeo(s)`}
                        >
                          ▶ {a.qtdVideos}
                        </span>
                      )}
                      {a.temQuiz && (
                        <span className="text-[11px] text-violet" title="tem quiz">
                          ✎
                        </span>
                      )}
                      {a.temPdf && (
                        <span className="text-[11px] text-subtle" title="tem PDF">
                          ⤓
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              )}
            </details>
          );
        })}
      </div>

      <p className="font-mono text-[12px] leading-relaxed text-subtle">
        Fonte: catálogo do EAD Sankhya (ead.sankhya.com.br). Os links abrem a
        aula original e exigem login no EAD.
      </p>
    </div>
  );
}

function Estatistica({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-panel border border-line bg-surface px-4 py-3.5">
      <span className="tnum text-[24px] font-black">{valor}</span>
      <span className="text-[12px] font-extrabold tracking-[1px] text-subtle uppercase">
        {rotulo}
      </span>
    </div>
  );
}
