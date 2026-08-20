/* ---------------------------------------------------------------------------
 * Sankhya Quiz
 * Desenvolvido por Luiz Eduardo — https://luizeduos.web.app
 * ------------------------------------------------------------------------- */
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { Providers } from "@/components/providers";
import {
  APP_DESCRIPTION,
  APP_NAME,
  AUTHOR,
  AUTHOR_URL,
} from "@/lib/app-meta";
import "./globals.css";

/**
 * Fontes self-hosted por next/font: nenhuma requisicao ao Google em runtime,
 * `display: swap` com fallback ajustado, zero FOUT visivel e CLS ~0.
 * Ambas sao variaveis, entao os pesos 400..1000 do design saem de um
 * unico arquivo.
 */
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — treine o ERP Sankhya jogando`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: AUTHOR, url: AUTHOR_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,
  keywords: [
    "Sankhya",
    "ERP",
    "quiz",
    "treinamento",
    "gamificacao",
    "NF-e",
    "TOP",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e141c" },
  ],
  width: "device-width",
  initialScale: 1,
  // A trilha e o quiz nao devem ser bloqueados para zoom (acessibilidade).
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${jetbrains.variable} min-h-dvh antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
