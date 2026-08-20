"use client";

import { useSyncExternalStore } from "react";

const naoAssina = () => () => {};

/**
 * `false` no servidor e no primeiro render do cliente, `true` depois.
 *
 * Implementado com `useSyncExternalStore` (e nao com setState num efeito) para
 * que React nao veja um render em cascata: o snapshot do servidor e `false`, o
 * do cliente e `true`, e o React resolve a diferenca na propria hidratacao.
 *
 * Usado sempre que o valor a renderizar depende de algo que so existe no
 * cliente — tema resolvido, hora local, timezone.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    naoAssina,
    () => true,
    () => false,
  );
}
