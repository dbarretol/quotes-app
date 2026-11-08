// Validates data/quotes.json: required fields, kebab-case ids and no duplicates.
import { readFileSync } from "node:fs"

const file = new URL("../data/quotes.json", import.meta.url)
const quotes = JSON.parse(readFileSync(file, "utf8"))
const errors = []

if (!Array.isArray(quotes) || quotes.length === 0) {
  errors.push("quotes.json must be a non-empty array")
} else {
  const ids = new Set()
  const texts = new Set()

  quotes.forEach((quote, index) => {
    const where = `quote #${index} (${quote?.id ?? "no id"})`
    const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== ""

    if (!isNonEmptyString(quote.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(quote.id)) {
      errors.push(`${where}: "id" must be a kebab-case string`)
    } else if (ids.has(quote.id)) {
      errors.push(`${where}: duplicate id`)
    } else {
      ids.add(quote.id)
    }

    if (!isNonEmptyString(quote.text)) errors.push(`${where}: "text" is required`)
    else if (texts.has(quote.text)) errors.push(`${where}: duplicate text`)
    else texts.add(quote.text)

    if (!isNonEmptyString(quote.category)) errors.push(`${where}: "category" is required`)
    if (quote.author !== null && !isNonEmptyString(quote.author)) {
      errors.push(`${where}: "author" must be a string or null`)
    }
    if ("attributed" in quote && typeof quote.attributed !== "boolean") {
      errors.push(`${where}: "attributed" must be a boolean`)
    }
    if (quote.attributed && quote.author === null) {
      errors.push(`${where}: "attributed" requires an author`)
    }

    const allowed = new Set(["id", "text", "author", "category", "attributed"])
    for (const key of Object.keys(quote)) {
      if (!allowed.has(key)) errors.push(`${where}: unknown field "${key}"`)
    }
  })
}

if (errors.length > 0) {
  console.error(`quotes.json is invalid:\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(`quotes.json is valid (${quotes.length} quotes)`)
