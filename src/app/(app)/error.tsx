"use client";

import { ErrorState } from "@/components/feedback/states";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      descricao={
        process.env.NODE_ENV === "development"
          ? error.message
          : "Não conseguimos carregar esta tela. Tente novamente em instantes."
      }
      onTentar={reset}
    />
  );
}
