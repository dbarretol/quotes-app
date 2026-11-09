import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "solid" | "outline" | "quiet"

const VARIANTS: Record<Variant, string> = {
  // Inverted colors: foreground fill with the poster background as text.
  solid: "bg-[var(--poster-fg)] text-[var(--poster-bg)] hover:opacity-90",
  outline: "border border-current hover:bg-[var(--poster-fg)] hover:text-[var(--poster-bg)]",
  quiet: "underline-offset-4 hover:underline",
}

interface PosterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

/** Button that takes its colors from the surrounding poster. */
export function PosterButton({ variant = "outline", className, type = "button", ...props }: PosterButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 sm:min-h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--poster-fg)]",
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        "motion-safe:transition-[background-color,color,opacity] motion-safe:duration-150",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
