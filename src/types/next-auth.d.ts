import type { DefaultSession } from "next-auth";

/**
 * Estende a sessao com o cargo do usuario, que aparece no HUD
 * ("Marina R. - Nivel 7 - Consultor" no artboard 1a).
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      cargo: string;
    } & DefaultSession["user"];
  }
  interface User {
    cargo?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    cargo?: string;
  }
}
