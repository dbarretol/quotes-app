"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, RotateCcw } from "lucide-react"
import { CategoryFilter } from "@/components/category-filter"
import { PosterButton } from "@/components/poster-button"
import { QuoteActions } from "@/components/quote-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { readCategoriesFromSearch, writeCategoriesToUrl } from "@/lib/category-url"
import { posterStyle } from "@/lib/category-theme"
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress-storage"
import { ALL_CATEGORIES, ALL_QUOTES, formatAuthor, type Quote } from "@/lib/quotes"

const QUOTES_BY_ID = new Map(ALL_QUOTES.map((quote) => [quote.id, quote]))
const VALID_IDS: ReadonlySet<string> = new Set(QUOTES_BY_ID.keys())
const VALID_CATEGORIES: ReadonlySet<string> = new Set(ALL_CATEGORIES)
const UNDO_TIMEOUT_MS = 8000

interface ResetSnapshot {
  usedIds: ReadonlySet<string>
  currentQuote: Quote | null
}

/** Poster-sized type that steps down for longer quotes so they still fit the screen. */
function quoteSizeClass(text: string): string {
  if (text.length <= 60) return "text-[clamp(2.5rem,8vw,6rem)]"
  if (text.length <= 110) return "text-[clamp(2.25rem,6.5vw,4.75rem)]"
  return "text-[clamp(2rem,5vw,3.75rem)]"
}

export default function QuotesApp() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [usedIds, setUsedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [categories, setCategories] = useState<ReadonlySet<string>>(() => new Set(ALL_CATEGORIES))
  // Saved progress is read after mount, since localStorage is not available during prerendering.
  const [isRestored, setIsRestored] = useState(false)
  // New quotes are announced only after the user asks for one, not when progress is restored.
  const [hasInteracted, setHasInteracted] = useState(false)
  const [resetSnapshot, setResetSnapshot] = useState<ResetSnapshot | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const saved = loadProgress(VALID_IDS, VALID_CATEGORIES)
    if (saved) {
      setUsedIds(new Set(saved.usedIds))
      setCurrentQuote(saved.currentId ? (QUOTES_BY_ID.get(saved.currentId) ?? null) : null)
    }
    // A category filter in the URL (e.g. a shared link) takes precedence over the saved one.
    const fromUrl = readCategoriesFromSearch(window.location.search, ALL_CATEGORIES)
    const initialCategories = fromUrl ?? (saved?.categories ? new Set(saved.categories) : null)
    if (initialCategories) setCategories(initialCategories)
    setIsRestored(true)
    return () => clearTimeout(undoTimer.current)
  }, [])

  useEffect(() => {
    if (!isRestored) return
    const allCategories = categories.size === ALL_CATEGORIES.length
    if (usedIds.size === 0 && allCategories) {
      clearProgress()
    } else {
      saveProgress({
        usedIds: [...usedIds],
        currentId: currentQuote?.id ?? null,
        ...(!allCategories && { categories: [...categories] }),
      })
    }
    writeCategoriesToUrl(categories, ALL_CATEGORIES)
  }, [isRestored, usedIds, currentQuote, categories])

  // Progress is measured within the selected categories.
  const pool = ALL_QUOTES.filter((quote) => categories.has(quote.category))
  const poolSize = pool.length
  const isFiltered = categories.size < ALL_CATEGORIES.length
  const shownCount = pool.filter((quote) => usedIds.has(quote.id)).length
  const isAllQuotesUsed = poolSize > 0 && shownCount >= poolSize
  const progress = poolSize > 0 ? shownCount / poolSize : 0

  const dismissUndo = () => {
    clearTimeout(undoTimer.current)
    setResetSnapshot(null)
  }

  const handleNewQuote = () => {
    const unusedQuotes = pool.filter((quote) => !usedIds.has(quote.id))
    if (unusedQuotes.length === 0) return

    const selectedQuote = unusedQuotes[Math.floor(Math.random() * unusedQuotes.length)]
    dismissUndo()
    setHasInteracted(true)
    setCurrentQuote(selectedQuote)
    setUsedIds((prev) => new Set(prev).add(selectedQuote.id))
  }

  // Resets progress for the selected categories only; other categories keep theirs.
  // The previous state is kept for a few seconds so the reset can be undone.
  const handleReset = () => {
    const poolIds = new Set(pool.map((quote) => quote.id))
    setResetSnapshot({ usedIds, currentQuote })
    setUsedIds((prev) => new Set([...prev].filter((id) => !poolIds.has(id))))
    setCurrentQuote(null)
    clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setResetSnapshot(null), UNDO_TIMEOUT_MS)
  }

  const handleUndoReset = () => {
    if (!resetSnapshot) return
    setUsedIds(resetSnapshot.usedIds)
    setCurrentQuote(resetSnapshot.currentQuote)
    dismissUndo()
  }

  return (
    // The whole screen takes the color of the current quote's category.
    <main className="poster flex min-h-dvh flex-col" style={posterStyle(currentQuote?.category ?? null)}>
      <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-8">
        <div className="space-y-4">
          <h1 className="text-sm font-semibold">Daily Motivation</h1>
          <CategoryFilter categories={ALL_CATEGORIES} selected={categories} onChange={setCategories} />
        </div>
        <ThemeToggle />
      </header>

      {/* The quote fills the space between header and footer, so the controls stay put. */}
      <section
        aria-live={hasInteracted ? "polite" : "off"}
        className="flex flex-1 items-center px-5 py-10 sm:px-10"
      >
        {!isRestored ? null : currentQuote ? (
          <figure key={currentQuote.id} className="max-w-5xl motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
            <blockquote
              className={`font-condensed font-bold leading-[1.02] tracking-tight text-pretty [text-indent:-0.4em] ${quoteSizeClass(currentQuote.text)}`}
            >
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-base sm:text-lg">
              <cite className="block font-semibold not-italic">{formatAuthor(currentQuote)}</cite>
              <span className="block">{currentQuote.category}</span>
            </figcaption>
          </figure>
        ) : (
          <p className="font-condensed max-w-3xl text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.05] text-pretty">
            Press Next quote to see your first quote.
          </p>
        )}
      </section>

      <footer className="space-y-5 px-5 pb-6 sm:px-10 sm:pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {!isAllQuotesUsed ? (
            <PosterButton variant="solid" onClick={handleNewQuote} className="px-6 text-base">
              Next quote
              <ArrowRight aria-hidden="true" />
            </PosterButton>
          ) : (
            <>
              <p className="font-semibold">
                You&apos;ve seen all {poolSize} quotes{isFiltered && " in the selected categories"}.
              </p>
              <PosterButton variant="solid" onClick={handleReset} className="px-6 text-base">
                <RotateCcw aria-hidden="true" />
                Start over
              </PosterButton>
            </>
          )}
          {currentQuote && <QuoteActions quote={currentQuote} />}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <p id="progress-label" className="shrink-0 tabular-nums">
            {shownCount} of {poolSize} seen
          </p>
          <div
            role="progressbar"
            aria-labelledby="progress-label"
            aria-valuemin={0}
            aria-valuemax={poolSize}
            aria-valuenow={shownCount}
            className="relative h-1 flex-1 overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 bg-current opacity-25" />
            <div
              className="absolute inset-0 origin-left bg-current motion-safe:transition-transform motion-safe:duration-300"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <div className="flex min-h-11 shrink-0 items-center sm:min-h-9" aria-live="polite">
            {resetSnapshot ? (
              <p className="flex items-center gap-2">
                Progress reset.
                <PosterButton variant="quiet" onClick={handleUndoReset} className="min-h-0 px-0 underline">
                  Undo
                </PosterButton>
              </p>
            ) : (
              shownCount > 0 &&
              !isAllQuotesUsed && (
                <PosterButton variant="quiet" onClick={handleReset} className="px-0">
                  Reset
                </PosterButton>
              )
            )}
          </div>
        </div>
      </footer>
    </main>
  )
}
