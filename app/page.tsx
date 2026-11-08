"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, RotateCcw } from "lucide-react"
import quotesData from "@/data/quotes.json"
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress-storage"

interface Quote {
  id: string
  text: string
  /** null when the author is unknown. */
  author: string | null
  category: string
  /** true when the attribution is popular but unverified. */
  attributed?: boolean
}

const ALL_QUOTES: readonly Quote[] = quotesData
const TOTAL_QUOTES = ALL_QUOTES.length
const QUOTES_BY_ID = new Map(ALL_QUOTES.map((quote) => [quote.id, quote]))
const VALID_IDS: ReadonlySet<string> = new Set(QUOTES_BY_ID.keys())

function formatAuthor({ author, attributed }: Quote): string {
  if (!author) return "Unknown"
  return attributed ? `attributed to ${author}` : author
}

export default function QuotesApp() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [usedIds, setUsedIds] = useState<ReadonlySet<string>>(() => new Set())
  // Saved progress is read after mount, since localStorage is not available during prerendering.
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
    const saved = loadProgress(VALID_IDS)
    if (saved) {
      setUsedIds(new Set(saved.usedIds))
      setCurrentQuote(saved.currentId ? (QUOTES_BY_ID.get(saved.currentId) ?? null) : null)
    }
    setIsRestored(true)
  }, [])

  useEffect(() => {
    if (!isRestored) return
    if (usedIds.size === 0) {
      clearProgress()
    } else {
      saveProgress({ usedIds: [...usedIds], currentId: currentQuote?.id ?? null })
    }
  }, [isRestored, usedIds, currentQuote])

  const shownCount = usedIds.size
  const isAllQuotesUsed = TOTAL_QUOTES > 0 && shownCount >= TOTAL_QUOTES
  const progress = TOTAL_QUOTES > 0 ? Math.round((shownCount / TOTAL_QUOTES) * 100) : 0

  const handleNewQuote = () => {
    const unusedQuotes = ALL_QUOTES.filter((quote) => !usedIds.has(quote.id))
    if (unusedQuotes.length === 0) return

    const selectedQuote = unusedQuotes[Math.floor(Math.random() * unusedQuotes.length)]
    setCurrentQuote(selectedQuote)
    setUsedIds((prev) => new Set(prev).add(selectedQuote.id))
  }

  const handleReset = () => {
    setUsedIds(new Set())
    setCurrentQuote(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Daily Motivation</h1>
          <p className="text-gray-600">Get inspired with random motivational quotes</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-700">
              {currentQuote ? "Your Quote" : "Ready for Inspiration?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div aria-live="polite">
              {currentQuote ? (
                <figure className="space-y-4">
                  <blockquote className="text-xl font-medium text-gray-800 text-center italic leading-relaxed">
                    &ldquo;{currentQuote.text}&rdquo;
                  </blockquote>
                  <figcaption className="flex flex-col items-center gap-3">
                    <cite className="not-italic text-gray-600">&mdash; {formatAuthor(currentQuote)}</cite>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {currentQuote.category}
                    </Badge>
                  </figcaption>
                </figure>
              ) : (
                <p className="text-center text-gray-500 py-8 text-lg">
                  Click the button below to get your first motivational quote!
                </p>
              )}
            </div>

            <div className="flex flex-col items-center space-y-4">
              {!isAllQuotesUsed ? (
                <Button onClick={handleNewQuote} size="lg" className="px-8 py-3 text-lg font-semibold">
                  <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
                  Get New Quote
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium text-gray-700">
                    🎉 You&apos;ve seen all {TOTAL_QUOTES} quotes!
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

              <div className="w-full text-sm text-gray-500 text-center">
                <p id="progress-label">
                  Quotes shown: {shownCount} / {TOTAL_QUOTES}
                </p>
                <div
                  role="progressbar"
                  aria-labelledby="progress-label"
                  aria-valuemin={0}
                  aria-valuemax={TOTAL_QUOTES}
                  aria-valuenow={shownCount}
                  className="w-full bg-gray-200 rounded-full h-2 mt-2"
                >
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentQuote && !isAllQuotesUsed && (
          <div className="text-center">
            <Button onClick={handleReset} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Reset Progress
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
