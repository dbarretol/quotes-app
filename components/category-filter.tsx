"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: readonly string[]
  /** Selected categories; when it contains every category, "All" is active. */
  selected: ReadonlySet<string>
  onChange: (selected: ReadonlySet<string>) => void
}

// 44px tall on touch screens, compact on larger screens.
const TOUCH_TARGET = "h-11 sm:h-9"

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
    <div role="group" aria-label="Filter quotes by category" className="flex flex-wrap justify-center gap-2">
      <Button
        size="sm"
        className={TOUCH_TARGET}
        variant={allSelected ? "default" : "outline"}
        aria-pressed={allSelected}
        onClick={selectAll}
      >
        All
      </Button>
      {categories.map((category) => {
        const isActive = !allSelected && selected.has(category)
        return (
          <Button
            key={category}
            size="sm"
            className={TOUCH_TARGET}
            variant={isActive ? "default" : "outline"}
            aria-pressed={isActive}
            onClick={() => toggle(category)}
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
