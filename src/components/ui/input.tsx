import { cn } from "@/lib/utils";

/**
 * Campo de texto no vocabulario do design: borda de 2px, r16, e a borda
 * mudando de cor no foco (a mesma linguagem do card de alternativa).
 *
 * Usado pela questao de resposta curta. E o unico input do app: a
 * autenticacao e feita pelo Google, entao nao existe formulario de senha.
 */
export function Input({
  className,
  invalido,
  ...props
}: React.ComponentProps<"input"> & { invalido?: boolean }) {
  return (
    <input
      aria-invalid={invalido || undefined}
      className={cn(
        "w-full rounded-btn border-2 bg-surface px-4 py-3.5 text-[16px] font-bold text-ink",
        "placeholder:font-normal placeholder:text-subtle",
        "transition-colors duration-150 outline-none",
        invalido
          ? "border-coral focus:border-coral"
          : "border-line-strong focus:border-blue",
        "disabled:cursor-not-allowed disabled:bg-track disabled:text-subtle",
        className,
      )}
      {...props}
    />
  );
}
