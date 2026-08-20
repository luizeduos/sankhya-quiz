"use client";

import { ThemeProvider } from "next-themes";
import { MotionProvider } from "@/components/motion/motion-provider";

/**
 * Unico limite de cliente na raiz. Os `children` continuam sendo Server
 * Components — sao passados por props, nao importados aqui.
 *
 * Sem `SessionProvider` de proposito: nenhum componente usa `useSession()`.
 * Os dados do usuario descem por props dos Server Components, que leem a
 * sessao com `auth()`. Isso mantem o contexto do next-auth (e o fetch de
 * `/api/auth/session` que ele dispara) fora de todas as rotas.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <MotionProvider>{children}</MotionProvider>
    </ThemeProvider>
  );
}
