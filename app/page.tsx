"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, RotateCcw } from "lucide-react"
import quotesData from "@/data/quotes.json"

interface Quote {
  text: string
  category: string
}

export default function QuotesApp() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [usedQuotes, setUsedQuotes] = useState<Set<string>>(new Set())
  const [isAllQuotesUsed, setIsAllQuotesUsed] = useState(false)
  const [totalQuotes, setTotalQuotes] = useState(0)

  // Calculate total number of quotes
  useEffect(() => {
    const total = Object.values(quotesData).reduce((sum, quotes) => sum + quotes.length, 0)
    setTotalQuotes(total)
  }, [])

  // Get all available quotes as an array with their categories
  const getAllQuotes = (): Quote[] => {
    const allQuotes: Quote[] = []
    Object.entries(quotesData).forEach(([category, quotes]) => {
      quotes.forEach((quote) => {
        allQuotes.push({ text: quote, category })
      })
    })
    return allQuotes
  }

  // Get a random unused quote
  const getRandomQuote = () => {
    const allQuotes = getAllQuotes()
    const unusedQuotes = allQuotes.filter((quote) => !usedQuotes.has(quote.text))

    if (unusedQuotes.length === 0) {
      setIsAllQuotesUsed(true)
      return null
    }

    const randomIndex = Math.floor(Math.random() * unusedQuotes.length)
    const selectedQuote = unusedQuotes[randomIndex]

    // Add to used quotes
    setUsedQuotes((prev) => new Set([...prev, selectedQuote.text]))

    return selectedQuote
  }

  // Handle getting a new quote
  const handleNewQuote = () => {
    if (isAllQuotesUsed) return

    const newQuote = getRandomQuote()
    if (newQuote) {
      setCurrentQuote(newQuote)
    }
  }

  // Reset the app
  const handleReset = () => {
    setUsedQuotes(new Set())
    setCurrentQuote(null)
    setIsAllQuotesUsed(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Daily Motivation</h1>
          <p className="text-gray-600">Get inspired with random motivational quotes</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-700">
              {currentQuote ? "Your Quote" : "Ready for Inspiration?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuote ? (
              <div className="space-y-4">
                <blockquote className="text-xl font-medium text-gray-800 text-center italic leading-relaxed">
                  "{currentQuote.text}"
                </blockquote>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {currentQuote.category}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">Click the button below to get your first motivational quote!</p>
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              {!isAllQuotesUsed ? (
                <Button onClick={handleNewQuote} size="lg" className="px-8 py-3 text-lg font-semibold">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Get New Quote
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium text-gray-700">🎉 You've seen all {totalQuotes} quotes!</p>
                  <Button
                    onClick={handleReset}
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg font-semibold bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Start Over
                  </Button>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center">
                <p>
                  Quotes shown: {usedQuotes.size} / {totalQuotes}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(usedQuotes.size / totalQuotes) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentQuote && !isAllQuotesUsed && (
          <div className="text-center">
            <Button onClick={handleReset} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Progress
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
