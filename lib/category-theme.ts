import type { CSSProperties } from "react"

interface ColorPair {
  background: string
  foreground: string
}

interface CategoryTheme {
  light: ColorPair
  dark: ColorPair
}

// Every pair meets WCAG AA contrast (4.5:1) for normal text.
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  Motivation: { light: { background: "#E4572E", foreground: "#000000" }, dark: { background: "#3B1409", foreground: "#F7B9A6" } },
  Success: { light: { background: "#C9A227", foreground: "#000000" }, dark: { background: "#3A2E06", foreground: "#EED98A" } },
  Perseverance: { light: { background: "#1F6F50", foreground: "#FFFFFF" }, dark: { background: "#0E2E21", foreground: "#A9DCC6" } },
  Growth: { light: { background: "#6A8D3A", foreground: "#000000" }, dark: { background: "#243012", foreground: "#CFE3A8" } },
  Wisdom: { light: { background: "#2E3A87", foreground: "#FFFFFF" }, dark: { background: "#141A3D", foreground: "#B9C2F2" } },
}

// Used before the first quote and for categories without a dedicated color.
const NEUTRAL_THEME: CategoryTheme = {
  light: { background: "hsl(var(--background))", foreground: "hsl(var(--foreground))" },
  dark: { background: "hsl(var(--background))", foreground: "hsl(var(--foreground))" },
}

export function getCategoryTheme(category: string | null): CategoryTheme {
  return (category && CATEGORY_THEMES[category]) || NEUTRAL_THEME
}

/** Swatch color shown in the category filter (the light background). */
export function getCategorySwatch(category: string): string | null {
  return CATEGORY_THEMES[category]?.light.background ?? null
}

/** CSS custom properties consumed by the `.poster` class in globals.css. */
export function posterStyle(category: string | null): CSSProperties {
  const { light, dark } = getCategoryTheme(category)
  return {
    "--poster-bg-light": light.background,
    "--poster-fg-light": light.foreground,
    "--poster-bg-dark": dark.background,
    "--poster-fg-dark": dark.foreground,
  } as CSSProperties
}
