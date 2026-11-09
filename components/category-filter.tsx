"use client"

import { PosterButton } from "@/components/poster-button"
import { getCategorySwatch } from "@/lib/category-theme"

interface CategoryFilterProps {
  categories: readonly string[]
  /** Selected categories; when it contains every category, "All" is active. */
  selected: ReadonlySet<string>
  onChange: (selected: ReadonlySet<string>) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const allSelected = selected.size === categories.length

  const selectAll = () => onChange(new Set(categories))

  const toggle = (category: string) => {
    // From "All", picking a category narrows the selection to just that one.
    if (allSelected) return onChange(new Set([category]))

    const next = new Set(selected)
    if (next.has(category)) next.delete(category)
    else next.add(category)
    // Deselecting the last category goes back to "All", so the pool is never empty.
    onChange(next.size === 0 ? new Set(categories) : next)
  }

  return (
    <div role="group" aria-label="Filter quotes by category" className="flex flex-wrap gap-2">
      <PosterButton variant={allSelected ? "solid" : "outline"} aria-pressed={allSelected} onClick={selectAll}>
        All
      </PosterButton>
      {categories.map((category) => {
        const isActive = !allSelected && selected.has(category)
        const swatch = getCategorySwatch(category)
        return (
          <PosterButton
            key={category}
            variant={isActive ? "solid" : "outline"}
            aria-pressed={isActive}
            onClick={() => toggle(category)}
          >
            {swatch && (
              <span
                aria-hidden="true"
                className="size-3 rounded-full ring-1 ring-current"
                style={{ backgroundColor: swatch }}
              />
            )}
            {category}
          </PosterButton>
        )
      })}
    </div>
  )
}
