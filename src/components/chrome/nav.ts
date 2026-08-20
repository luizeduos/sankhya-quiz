/**
 * Navegacao unica para a sidebar do desktop (artboard 1b) e a bottom tab bar
 * do mobile (artboard 1c). A tab bar usa `curto` e mostra apenas os 5
 * primeiros itens, exatamente como no protótipo.
 */
export type ItemNav = {
  href: string;
  label: string;
  curto: string;
  emoji: string;
  /** Exibe o contador de erros pendentes ao lado do rotulo. */
  badgeErros?: boolean;
  /** Fica fora da bottom tab bar do mobile. */
  soDesktop?: boolean;
};

export const NAV: ItemNav[] = [
  { href: "/", label: "Trilhas", curto: "Trilhas", emoji: "🏠" },
  {
    href: "/revisar",
    label: "Revisar erros",
    curto: "Erros",
    emoji: "🔁",
    badgeErros: true,
  },
  { href: "/conteudo", label: "Conteúdo", curto: "Conteúdo", emoji: "📄" },
  { href: "/perfil", label: "Perfil", curto: "Perfil", emoji: "👤" },
  {
    href: "/configuracoes",
    label: "Configurações",
    curto: "Config",
    emoji: "⚙️",
    soDesktop: true,
  },
];

export const NAV_MOBILE = NAV.filter((i) => !i.soDesktop);

/** Item ativo: casa exato para "/" e por prefixo para o resto. */
export function isAtivo(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
