import type { NextAuthConfig } from "next-auth";

/**
 * Configuracao COMPATIVEL COM EDGE — sem providers, sem acesso a banco.
 *
 * O middleware roda no runtime Edge e importa apenas este arquivo; o provider
 * do Google fica em `index.ts`. Essa divisao e o padrao recomendado do
 * Auth.js v5 e e o que permite proteger rotas sem arrastar dependencias de
 * Node para o middleware.
 */
export const ROTA_LOGIN = "/login";

/** Unico prefixo que nao exige sessao. */
const PUBLICAS = ["/login"];

export function isRotaPublica(pathname: string) {
  return PUBLICAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const authConfig = {
  // Precisa estar AQUI (e nao so no NextAuth de `index.ts`) porque o
  // middleware instancia o Auth.js apenas com este objeto. Sem `trustHost`, o
  // middleware compara o host da requisicao com AUTH_URL e nega tudo que
  // divergir — o que quebraria preview deploys da Vercel e qualquer dominio
  // alternativo.
  trustHost: true,
  // Sessao em JWT dentro de cookie httpOnly: nada de estado no servidor,
  // o que mantem o deploy na Vercel sem banco de sessao.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: ROTA_LOGIN,
    error: ROTA_LOGIN,
  },
  // `providers` vazio aqui de proposito: preenchido em `index.ts`.
  providers: [],
  callbacks: {
    // Nao definimos `authorized` de proposito: o redirecionamento e feito a
    // mao em middleware.ts, para controlar o `callbackUrl`. Ter as duas coisas
    // seria duas fontes de verdade para a mesma decisao.
    jwt({ token }) {
      // O Google nao tem conceito de "cargo". Guardamos um rotulo neutro, que
      // aparece no HUD ao lado do nome; uma integracao futura com o diretorio
      // da empresa pode preenche-lo de verdade.
      token.cargo ??= "Analista";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
        session.user.cargo = (token.cargo as string) ?? "Analista";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
