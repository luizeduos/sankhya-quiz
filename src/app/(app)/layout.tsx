import { redirect } from "next/navigation";
import { BottomTabBar } from "@/components/chrome/bottom-tab-bar";
import { Credits } from "@/components/chrome/credits";
import { HudBar, HudBarMobile } from "@/components/chrome/hud";
import { Sidebar } from "@/components/chrome/sidebar";
import { Toaster } from "@/components/ui/toast";
import { PageTransition } from "@/components/motion/page-transition";
import { StoreHydration } from "@/store/hydration";
import { auth } from "@/lib/auth";

/**
 * Moldura da area autenticada.
 *
 * Desktop (>= lg): sidebar de 248px + HUD bar, como no artboard 1b.
 * Mobile (< lg): HUD compacto no topo + bottom tab bar, como no 1c.
 *
 * O middleware ja barra quem nao esta logado; a checagem aqui e a segunda
 * camada, para o caso de a rota ser alcancada sem passar pelo matcher.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await auth();
  if (!sessao?.user) redirect("/login");

  const nome = sessao.user.name ?? "Você";
  const cargo = sessao.user.cargo ?? "Analista";
  const imagem = sessao.user.image;

  return (
    <div className="flex min-h-dvh bg-bg">
      <StoreHydration />
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="hidden lg:block">
          <HudBar nome={nome} cargo={cargo} imagem={imagem} />
        </div>
        <div className="lg:hidden">
          <HudBarMobile nome={nome} imagem={imagem} />
        </div>

        <main className="flex min-h-0 flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Credito no footer de todas as telas do app (no desktop ele tambem
            aparece na sidebar; aqui garantimos o mobile e telas largas). */}
        <footer className="flex justify-center px-5 py-6 lg:hidden">
          <Credits />
        </footer>

        <BottomTabBar />
      </div>

      <Toaster />
    </div>
  );
}
