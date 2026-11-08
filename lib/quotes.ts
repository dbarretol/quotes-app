import quotesData from "@/data/quotes.json"

export interface Quote {
  id: string
  text: string
  /** null when the author is unknown. */
  author: string | null
  category: string
  /** true when the attribution is popular but unverified. */
  attributed?: boolean
}

export const ALL_QUOTES: readonly Quote[] = quotesData

/** Author line shown under a quote. */
export function formatAuthor({ author, attributed }: Quote): string {
  if (!author) return "Unknown"
  return attributed ? `attributed to ${author}` : author
}

/** Plain-text version of a quote, used when copying or sharing. */
export function formatQuoteForSharing(quote: Quote): string {
  const text = `“${quote.text}”`
  return quote.author ? `${text} — ${formatAuthor(quote)}` : text
}
