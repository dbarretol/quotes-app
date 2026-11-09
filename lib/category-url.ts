const PARAM = "categories"

/**
 * Reads selected categories from a query string such as `?categories=wisdom,growth`.
 * Matching is case-insensitive; unknown names are ignored. Returns null when absent or empty.
 */
export function readCategoriesFromSearch(search: string, allCategories: readonly string[]): Set<string> | null {
  const raw = new URLSearchParams(search).get(PARAM)
  if (!raw) return null

  const byLowerName = new Map(allCategories.map((category) => [category.toLowerCase(), category]))
  const selected = new Set<string>()
  for (const part of raw.split(",")) {
    const category = byLowerName.get(part.trim().toLowerCase())
    if (category) selected.add(category)
  }
  return selected.size > 0 ? selected : null
}

/** Updates the current URL without a navigation; the parameter is dropped when every category is selected. */
export function writeCategoriesToUrl(selected: ReadonlySet<string>, allCategories: readonly string[]): void {
  const url = new URL(window.location.href)
  if (selected.size === allCategories.length) {
    url.searchParams.delete(PARAM)
  } else {
    const ordered = allCategories.filter((category) => selected.has(category))
    url.searchParams.set(PARAM, ordered.map((category) => category.toLowerCase()).join(","))
    // Keep the list readable (`a,b` instead of `a%2Cb`); commas are valid in a query string.
    url.search = url.search.replace(/%2C/gi, ",")
  }
  if (url.href !== window.location.href) window.history.replaceState(null, "", url)
}
