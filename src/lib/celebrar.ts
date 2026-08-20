/**
 * Confete sob demanda.
 *
 * `canvas-confetti` (~7 KB gzip + canvas runtime) NAO entra no bundle de
 * nenhuma rota: e importado dinamicamente no primeiro acerto e o modulo fica
 * em cache para os proximos. Isso mantem o First Load JS da rota de licao
 * baixo mesmo com a celebracao presente.
 */
type ConfettiFn = (opts: Record<string, unknown>) => void;

let carregando: Promise<ConfettiFn | null> | null = null;

function carregar(): Promise<ConfettiFn | null> {
  carregando ??= import("canvas-confetti")
    .then((mod) => mod.default as unknown as ConfettiFn)
    .catch(() => null);
  return carregando;
}

function reduzido() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Rajada de acerto, nas cores do design. */
export async function celebrarAcerto() {
  if (reduzido()) return;
  const confetti = await carregar();
  if (!confetti) return;

  const cores = ["#17B26A", "#1B7FE3", "#FFC53D", "#8B5CF6"];
  confetti({
    particleCount: 44,
    spread: 62,
    startVelocity: 34,
    decay: 0.9,
    scalar: 0.85,
    ticks: 140,
    origin: { x: 0.5, y: 0.72 },
    colors: cores,
    disableForReducedMotion: true,
  });
}

/** Celebracao maior: fim de licao com bom aproveitamento, prova, meta batida. */
export async function celebrarConquista() {
  if (reduzido()) return;
  const confetti = await carregar();
  if (!confetti) return;

  const cores = ["#17B26A", "#1B7FE3", "#FFC53D", "#FF7A1A", "#8B5CF6"];
  for (const [x, delay] of [
    [0.22, 0],
    [0.78, 140],
    [0.5, 280],
  ] as const) {
    window.setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 78,
        startVelocity: 42,
        decay: 0.91,
        ticks: 190,
        origin: { x, y: 0.68 },
        colors: cores,
        disableForReducedMotion: true,
      });
    }, delay);
  }
}
