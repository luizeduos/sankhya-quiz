import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { ROTA_LOGIN, authConfig, isRotaPublica } from "@/lib/auth/config";

/**
 * Protecao de rotas no Edge.
 *
 * Usa apenas `authConfig` (sem providers), portanto nao carrega bcrypt nem
 * acesso a banco.
 *
 * O redirecionamento e feito AQUI, a mao, em vez de delegar ao callback
 * `authorized` do Auth.js: assim garantimos que o destino pretendido va no
 * `callbackUrl` como caminho relativo, e o formulario de login devolve o
 * usuario exatamente onde ele tentou entrar. Delegando ao Auth.js, o redirect
 * saia sem `callbackUrl` (ou com URL absoluta baseada em AUTH_URL, que quebra
 * em preview deploys).
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const logado = Boolean(req.auth?.user);

  /**
   * Origem do redirect derivada dos CABECALHOS da requisicao.
   *
   * Nem `nextUrl.clone()` nem `req.url` servem aqui: dentro do wrapper do
   * Auth.js a origem dos dois pode vir de `AUTH_URL`/`NEXTAUTH_URL` em vez do
   * host que realmente atendeu. Com isso, um app servido em outra porta ou
   * dominio (preview da Vercel, `next start -p 3300`, tunel) redirecionava
   * para o host configurado — e o navegador batia em "connection refused".
   *
   * `x-forwarded-*` sao os cabecalhos que a Vercel (e qualquer proxy) preenche.
   */
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? nextUrl.host;
  const proto =
    req.headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  const paraCa = (pathname: string, params?: Record<string, string>) => {
    const url = new URL(pathname, `${proto}://${host}`);
    for (const [k, v] of Object.entries(params ?? {})) {
      url.searchParams.set(k, v);
    }
    return NextResponse.redirect(url);
  };

  // Quem ja esta logado nao precisa ver login/cadastro.
  if (logado && isRotaPublica(nextUrl.pathname)) {
    const destino = nextUrl.searchParams.get("callbackUrl");
    return paraCa(destino?.startsWith("/") ? destino : "/");
  }

  if (logado || isRotaPublica(nextUrl.pathname)) {
    return NextResponse.next();
  }

  // `callbackUrl` sempre relativo: o formulario de login so aceita destinos
  // que comecem com "/", o que fecha a porta para open redirect.
  return paraCa(ROTA_LOGIN, {
    callbackUrl: `${nextUrl.pathname}${nextUrl.search}`,
  });
});

export const config = {
  /**
   * Roda em tudo, menos:
   *  - /api        (as rotas do Auth.js precisam ficar livres)
   *  - _next/*     (assets e chunks)
   *  - arquivos com extensao (favicon, logo.svg, fontes)
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
