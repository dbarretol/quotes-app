"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, RotateCcw } from "lucide-react"
import { CategoryFilter } from "@/components/category-filter"
import { QuoteActions } from "@/components/quote-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress-storage"
import { ALL_CATEGORIES, ALL_QUOTES, formatAuthor, type Quote } from "@/lib/quotes"

const QUOTES_BY_ID = new Map(ALL_QUOTES.map((quote) => [quote.id, quote]))
const VALID_IDS: ReadonlySet<string> = new Set(QUOTES_BY_ID.keys())
const VALID_CATEGORIES: ReadonlySet<string> = new Set(ALL_CATEGORIES)

export default function QuotesApp() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [usedIds, setUsedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [categories, setCategories] = useState<ReadonlySet<string>>(() => new Set(ALL_CATEGORIES))
  // Saved progress is read after mount, since localStorage is not available during prerendering.
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
    const saved = loadProgress(VALID_IDS, VALID_CATEGORIES)
    if (saved) {
      setUsedIds(new Set(saved.usedIds))
      setCurrentQuote(saved.currentId ? (QUOTES_BY_ID.get(saved.currentId) ?? null) : null)
      if (saved.categories) setCategories(new Set(saved.categories))
    }
    setIsRestored(true)
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
  }, [isRestored, usedIds, currentQuote, categories])

  // Progress is measured within the selected categories.
  const pool = ALL_QUOTES.filter((quote) => categories.has(quote.category))
  const poolSize = pool.length
  const isFiltered = categories.size < ALL_CATEGORIES.length
  const shownCount = pool.filter((quote) => usedIds.has(quote.id)).length
  const isAllQuotesUsed = poolSize > 0 && shownCount >= poolSize
  const progress = poolSize > 0 ? Math.round((shownCount / poolSize) * 100) : 0

  const handleNewQuote = () => {
    const unusedQuotes = pool.filter((quote) => !usedIds.has(quote.id))
    if (unusedQuotes.length === 0) return

    const selectedQuote = unusedQuotes[Math.floor(Math.random() * unusedQuotes.length)]
    setCurrentQuote(selectedQuote)
    setUsedIds((prev) => new Set(prev).add(selectedQuote.id))
  }

  // Resets progress for the selected categories only; other categories keep theirs.
  const handleReset = () => {
    const poolIds = new Set(pool.map((quote) => quote.id))
    setUsedIds((prev) => new Set([...prev].filter((id) => !poolIds.has(id))))
    setCurrentQuote(null)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-indigo-950 p-4 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Daily Motivation</h1>
          <p className="text-muted-foreground">Get inspired with random motivational quotes</p>
        </header>

        <CategoryFilter categories={ALL_CATEGORIES} selected={categories} onChange={setCategories} />

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground/90">
              {currentQuote ? "Your Quote" : "Ready for Inspiration?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div aria-live="polite">
              {currentQuote ? (
                <figure
                  key={currentQuote.id}
                  className="space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
                >
                  <blockquote className="text-xl font-medium text-foreground text-center italic leading-relaxed">
                    &ldquo;{currentQuote.text}&rdquo;
                  </blockquote>
                  <figcaption className="flex flex-col items-center gap-3">
                    <cite className="not-italic text-muted-foreground">&mdash; {formatAuthor(currentQuote)}</cite>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {currentQuote.category}
                    </Badge>
                  </figcaption>
                </figure>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-lg">
                  Click the button below to get your first motivational quote!
                </p>
              )}
            </div>

            {currentQuote && <QuoteActions quote={currentQuote} />}

            <div className="flex flex-col items-center space-y-4">
              {!isAllQuotesUsed ? (
                <Button onClick={handleNewQuote} size="lg" className="px-8 py-3 text-lg font-semibold">
                  <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
                  Get New Quote
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium text-foreground/90">
                    🎉 You&apos;ve seen all {poolSize} quotes{isFiltered && " in the selected categories"}!
                  </p>
                  <Button
                    onClick={handleReset}
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg font-semibold bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                    Start Over
                  </Button>
                </div>
              )}

              <div className="w-full text-sm text-muted-foreground text-center">
                <p id="progress-label">
                  Quotes shown: {shownCount} / {poolSize}
                </p>
                <div
                  role="progressbar"
                  aria-labelledby="progress-label"
                  aria-valuemin={0}
                  aria-valuemax={poolSize}
                  aria-valuenow={shownCount}
                  className="w-full bg-muted rounded-full h-2 mt-2"
                >
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full motion-safe:transition-all motion-safe:duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentQuote && !isAllQuotesUsed && (
          <div className="text-center">
            <Button onClick={handleReset} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Reset Progress
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
