import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-blue-soft text-blue",
  green: "bg-green-soft text-green-ink",
  coral: "bg-coral-soft text-coral-ink",
  gold: "bg-gold-soft text-gold-ink",
  orange: "bg-orange-soft text-orange-ink",
  violet: "bg-violet-soft text-violet-ink",
  neutral: "bg-track text-muted",
} as const;

export type ChipTone = keyof typeof tones;

/** Chip de categoria — r8, 12/800 (artboard 1a, "chips e badges"). */
export function Chip({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: ChipTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-[11px] py-[5px] text-[12px] font-extrabold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Badge contador circular — usado no "14" de Revisar erros. */
export function CountBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "tnum inline-flex min-w-[26px] items-center justify-center rounded-full bg-coral px-2 py-[2px] text-[12px] font-black text-white",
        className,
      )}
      {...props}
    />
  );
}
