"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"
import { PosterButton } from "@/components/poster-button"
import { formatQuoteForSharing, type Quote } from "@/lib/quotes"

type CopyStatus = "idle" | "copied" | "failed"

const STATUS_RESET_MS = 2000

export function QuoteActions({ quote }: { quote: Quote }) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  // The Web Share API only exists in the browser (mostly on mobile), so it is detected after mount.
  const [canShare, setCanShare] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
    return () => clearTimeout(resetTimer.current)
  }, [])

  // A new quote resets the copy feedback.
  useEffect(() => {
    clearTimeout(resetTimer.current)
    setCopyStatus("idle")
  }, [quote.id])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatQuoteForSharing(quote))
      setCopyStatus("copied")
    } catch {
      setCopyStatus("failed")
    }
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopyStatus("idle"), STATUS_RESET_MS)
  }

  const handleShare = async () => {
    try {
      await navigator.share({ text: formatQuoteForSharing(quote), url: window.location.href })
    } catch {
      // The user cancelled the share sheet or sharing failed; nothing to do.
    }
  }

  return (
    <div className="flex gap-2">
      <PosterButton variant="quiet" onClick={handleCopy}>
        {copyStatus === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy"}
      </PosterButton>
      {canShare && (
        <PosterButton variant="quiet" onClick={handleShare}>
          <Share2 aria-hidden="true" />
          Share
        </PosterButton>
      )}
      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? "Quote copied to clipboard" : copyStatus === "failed" ? "Could not copy the quote" : ""}
      </span>
    </div>
  )
}
