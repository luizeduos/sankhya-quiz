/**
 * Relatorio de First Load JS por rota.
 *
 * O `next build` do Next 16 (Turbopack) nao imprime mais a tabela de tamanhos,
 * e o `build-manifest.json` do Turbopack nao mapeia rotas do App Router para
 * chunks. Em vez de inferir, medimos o que o navegador realmente baixa:
 *
 *   1. sobe o servidor de producao (`next start`);
 *   2. emite um cookie de sessao valido (o login e por Google, que um script
 *      nao completa) para alcancar as rotas protegidas pelo middleware;
 *   3. baixa o HTML de cada rota e extrai os <script src> e <link> de
 *      preload/stylesheet;
 *   4. soma o tamanho gzip de cada arquivo em .next/static.
 *
 * Uso: node scripts/bundle-report.mjs [--limite 150] [--porta 3210]
 */
import { spawn } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const RAIZ = process.cwd();
const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : padrao;
};

const LIMITE_KB = Number(arg("limite", 150));
const PORTA = Number(arg("porta", 3210));
const BASE = `http://127.0.0.1:${PORTA}`;

/**
 * Rotas publicas: precisam ser medidas ANTES do login, porque depois o
 * middleware manda quem esta logado de volta para o app.
 */
const ROTAS_PUBLICAS = ["/login"];

const ROTAS = [
  "/",
  "/onboarding",
  "/licao/par-top",
  "/licao/par-top/resumo",
  "/modulo/parametros",
  "/revisar",
  "/conteudo",
  "/perfil",
  "/configuracoes",
];

/**
 * O app so aceita login por Google, e um script nao completa o fluxo OAuth.
 * Emitimos o mesmo cookie de sessao que o Auth.js emitiria, assinado com o
 * AUTH_SECRET do projeto. E harness de medicao, nao codigo do app.
 */
async function cookieDeSessao() {
  const { encode } = await import(
    pathToFileURL(join(RAIZ, "node_modules/@auth/core/jwt.js")).href
  );
  const env = readFileSync(join(RAIZ, ".env.local"), "utf8");
  const secret = /^AUTH_SECRET=(.+)$/m.exec(env)?.[1]?.trim();
  if (!secret) throw new Error("AUTH_SECRET ausente em .env.local");
  const token = await encode({
    secret,
    salt: "authjs.session-token",
    maxAge: 60 * 60,
    token: {
      name: "Medicao",
      email: "medicao@exemplo.com",
      sub: "bundle-report",
      cargo: "Analista",
    },
  });
  return token;
}

/* --------------------------------------------------------------- servidor */
const servidor = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "--port", String(PORTA)],
  { cwd: RAIZ, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" },
);

let saida = "";
servidor.stdout.on("data", (d) => (saida += d));
servidor.stderr.on("data", (d) => (saida += d));

function encerrar(codigo) {
  try {
    servidor.kill("SIGTERM");
  } catch {}
  process.exit(codigo);
}

async function esperarServidor(tentativas = 90) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(`${BASE}/login`, { redirect: "manual" });
      if (r.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 700));
  }
  return false;
}

/* --------------------------------------------------------------- cookies */
const jar = new Map();

function guardarCookies(res) {
  const set = res.headers.getSetCookie?.() ?? [];
  for (const c of set) {
    const [par] = c.split(";");
    const i = par.indexOf("=");
    if (i > 0) jar.set(par.slice(0, i).trim(), par.slice(i + 1).trim());
  }
}

const cabecalhoCookie = () =>
  [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

async function get(url, extra = {}) {
  // O primeiro acesso a uma rota dinamica compila sob demanda e pode passar do
  // timeout padrao do fetch; damos folga e uma segunda chance.
  for (let tentativa = 0; ; tentativa++) {
    try {
      const res = await fetch(url, {
        redirect: "manual",
        headers: { cookie: cabecalhoCookie(), ...extra },
        signal: AbortSignal.timeout(60_000),
      });
      guardarCookies(res);
      return res;
    } catch (e) {
      if (tentativa >= 2) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

async function autenticar() {
  jar.set("authjs.session-token", await cookieDeSessao());
  const r = await get(`${BASE}/perfil`);
  return r.ok;
}

/* ----------------------------------------------------------------- medida */
const cache = new Map();
function gzipKb(rel) {
  if (cache.has(rel)) return cache.get(rel);
  let kb = 0;
  try {
    const caminho = join(RAIZ, ".next", rel.replace(/^\/_next\//, ""));
    if (statSync(caminho).isFile()) {
      kb = gzipSync(readFileSync(caminho)).length / 1024;
    }
  } catch {
    kb = 0;
  }
  cache.set(rel, kb);
  return kb;
}

function extrairAssets(html) {
  const js = new Set();
  const css = new Set();

  // <script nomodule> e o bundle de legado: navegadores com suporte a modulos
  // (todos os alvos deste app) nao o baixam, entao ele nao conta como First
  // Load JS — nem para o Lighthouse. Precisamos casar a TAG inteira para
  // poder enxergar o atributo.
  const tags = html.match(/<script[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const src = tag.match(/src="(\/_next\/static\/[^"]+?\.js)"/);
    if (!src) continue;
    if (/nomodule/i.test(tag)) continue;
    js.add(src[1]);
  }

  const links = html.match(/<link[^>]*>/gi) ?? [];
  for (const tag of links) {
    const href = tag.match(/href="(\/_next\/static\/[^"]+?\.(js|css))"/);
    if (!href) continue;
    if (/nomodule/i.test(tag)) continue;
    (href[2] === "css" ? css : js).add(href[1]);
  }

  return { js: [...js], css: [...css] };
}

/* ------------------------------------------------------------------ main */
if (!(await esperarServidor())) {
  console.error("Servidor de producao nao subiu.\n" + saida.slice(-1500));
  encerrar(1);
}

const linhas = [];

async function medir(rota) {
  const res = await get(`${BASE}${rota}`);
  if (res.status >= 300 && res.status < 400) {
    linhas.push({ rota, erro: `redirect ${res.status}` });
    return;
  }
  if (!res.ok) {
    linhas.push({ rota, erro: `HTTP ${res.status}` });
    return;
  }
  const { js, css } = extrairAssets(await res.text());
  linhas.push({
    rota,
    js: js.reduce((s, f) => s + gzipKb(f), 0),
    css: css.reduce((s, f) => s + gzipKb(f), 0),
    nJs: js.length,
    arquivos: js,
  });
}

for (const rota of ROTAS_PUBLICAS) await medir(rota);

const autenticado = await autenticar();
if (!autenticado) {
  console.error(
    "Nao foi possivel autenticar com o usuario de demonstracao.\n" +
      "Confirme que AUTH_SECRET esta definido em .env.local.",
  );
  encerrar(1);
}

for (const rota of ROTAS) await medir(rota);

/* Baseline: chunks presentes em todas as rotas medidas com sucesso. */
const ok = linhas.filter((l) => !l.erro);
const conjuntos = ok.map((l) => new Set(l.arquivos));
const comuns =
  conjuntos.length > 0
    ? [...conjuntos[0]].filter((f) => conjuntos.every((s) => s.has(f)))
    : [];
const baseline = comuns.reduce((s, f) => s + gzipKb(f), 0);

const largura = Math.max(24, ...linhas.map((l) => l.rota.length)) + 2;
const cab =
  "Rota".padEnd(largura) +
  "First Load JS".padStart(15) +
  "CSS".padStart(10) +
  "próprio JS".padStart(13) +
  "chunks".padStart(8);

console.log(`\n${cab}`);
console.log("-".repeat(cab.length));

let estouros = 0;
for (const l of [...linhas].sort((a, b) => (b.js ?? 0) - (a.js ?? 0))) {
  if (l.erro) {
    console.log(l.rota.padEnd(largura) + l.erro.padStart(15));
    continue;
  }
  const proprio = l.arquivos
    .filter((f) => !comuns.includes(f))
    .reduce((s, f) => s + gzipKb(f), 0);
  const acima = l.js > LIMITE_KB;
  if (acima) estouros++;
  console.log(
    l.rota.padEnd(largura) +
      `${l.js.toFixed(1)} kB`.padStart(15) +
      `${l.css.toFixed(1)} kB`.padStart(10) +
      `${proprio.toFixed(1)} kB`.padStart(13) +
      String(l.nJs).padStart(8) +
      (acima ? "   <-- acima da meta" : ""),
  );
}

console.log("-".repeat(cab.length));
console.log(
  "compartilhado por todas".padEnd(largura) +
    `${baseline.toFixed(1)} kB`.padStart(15) +
    ` (${comuns.length} chunks)`,
);
if (process.argv.includes("--detalhe")) {
  console.log("\n--- chunks compartilhados por todas as rotas ---");
  for (const f of [...comuns].sort((a, b) => gzipKb(b) - gzipKb(a))) {
    console.log(`  ${gzipKb(f).toFixed(1).padStart(7)} kB  ${f}`);
  }
  for (const l of ok) {
    const proprios = l.arquivos.filter((f) => !comuns.includes(f));
    if (proprios.length === 0) continue;
    console.log(`\n--- ${l.rota} (chunks proprios) ---`);
    for (const f of proprios.sort((a, b) => gzipKb(b) - gzipKb(a))) {
      console.log(`  ${gzipKb(f).toFixed(1).padStart(7)} kB  ${f}`);
    }
  }
}

console.log(`\nMeta: First Load JS < ${LIMITE_KB} kB gzip por rota.`);

if (estouros > 0) {
  console.error(`${estouros} rota(s) acima da meta.\n`);
  encerrar(1);
}
console.log("Todas as rotas dentro da meta.\n");
encerrar(0);
