import Image from "next/image";
import { Credits } from "@/components/chrome/credits";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { APP_NAME } from "@/lib/app-meta";

/**
 * Moldura das telas de autenticacao.
 *
 * O fundo animado sao dois blobs em `translate3d`/`scale` puro (classes
 * `.drift-a` / `.drift-b` em globals.css) sob um `overflow-hidden`. Nenhum
 * `filter` e animado: o desfoque e estatico, so a posicao se move — e sob
 * `prefers-reduced-motion` a animacao e simplesmente desligada.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg">
      {/* Fundo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="drift-a absolute -top-40 -left-32 size-[520px] rounded-full bg-blue/18 blur-3xl" />
        <div className="drift-b absolute -right-40 -bottom-48 size-[560px] rounded-full bg-green/16 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-card bg-blue text-[18px] font-black text-white">
            S
          </div>
          <span className="text-[19px] font-black tracking-[-0.3px]">
            {APP_NAME}
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        {children}
      </main>

      <footer className="flex flex-col items-center gap-3 px-6 pb-8">
        <Image
          src="/logo.svg"
          alt="Sankhya"
          width={92}
          height={25}
          priority={false}
          className="opacity-35 dark:invert dark:opacity-45"
        />
        <Credits variant="auth" />
      </footer>
    </div>
  );
}
