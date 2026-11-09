# Daily Motivation

[![CI](https://github.com/dbarretol/quotes-app/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/dbarretol/quotes-app/actions/workflows/ci.yml)

A minimal web app that serves random motivational quotes, one at a time and without repeats.

**Live demo:** [quotes-app-delta.vercel.app](https://quotes-app-delta.vercel.app/)

- Shows a random quote with its author and category
- Copy a quote to the clipboard or share it (where the browser supports sharing)
- Filter quotes by category (the filter is kept in the URL, so filtered links can be shared)
- Light and dark themes (follows your system setting by default)
- Never repeats a quote until you have seen them all
- Tracks your progress, saves it in your browser and lets you start over at any time (with undo)

Each category has its own color, and the whole screen takes the color of the quote on display.

Built with [Next.js](https://nextjs.org/) 15, React 19 and [Tailwind CSS](https://tailwindcss.com/), set in [Archivo](https://fonts.google.com/specimen/Archivo).

## Getting started

Requirements: Node.js 18.18 or later and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build (runs lint and type checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run validate:quotes` | Validate `data/quotes.json` |

## Adding quotes

Quotes live in [`data/quotes.json`](data/quotes.json) as a list of objects:

```json
{
  "id": "courage-to-continue",
  "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "author": "Winston Churchill",
  "category": "Motivation",
  "attributed": true
}
```

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique, kebab-case. Saved progress refers to it, so don't change it once published |
| `text` | yes | The quote |
| `author` | yes | Author name, or `null` if unknown |
| `category` | yes | Any category name; new categories are picked up automatically |
| `attributed` | no | `true` when the attribution is popular but unverified (shown as "attributed to …") |

Run `npm run validate:quotes` to check the file; CI runs it on every pull request.

## Project structure

```
app/            Next.js App Router (layout, page, global styles)
components/     App components (category filter, quote actions, theme toggle, buttons)
data/           Quote collection
lib/            Quote data helpers, category colors, storage, URL and site configuration
scripts/        Maintenance scripts
```

## License

[MIT](LICENSE)
