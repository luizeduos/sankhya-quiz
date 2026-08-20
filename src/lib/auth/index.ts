import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./config";

/**
 * Autenticacao: Google como unico provedor.
 *
 * Nao existe login por senha, e isso e uma decisao de arquitetura, nao uma
 * lacuna: senha exigiria uma tabela de usuarios, hash, fluxo de recuperacao e
 * um servico de e-mail. Delegando a identidade ao Google, o app nao guarda
 * credencial nenhuma e nao precisa de banco para autenticar — a sessao e um
 * JWT assinado, em cookie httpOnly.
 *
 * Para adicionar outro provedor (Microsoft/Entra ID, por exemplo, que faz
 * sentido num contexto corporativo), basta acrescenta-lo ao array `providers`:
 * nenhuma outra parte do app conhece o provedor usado.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Mesmo e-mail chegando por outro provedor no futuro reaproveita a
      // identidade em vez de criar uma conta paralela.
      allowDangerousEmailAccountLinking: true,
      // Pede a escolha de conta a cada login: em maquina compartilhada, sem
      // isto o Google reentra silenciosamente com a ultima conta usada.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
});

/**
 * `true` quando as credenciais do Google estao presentes.
 *
 * A tela de login usa isto para explicar o que falta em vez de mostrar um
 * botao que quebra — util em ambiente novo ou preview sem as variaveis.
 */
export const GOOGLE_CONFIGURADO = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);
