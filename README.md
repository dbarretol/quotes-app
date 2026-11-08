# Daily Motivation

[![CI](https://github.com/dbarretol/quotes-app/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/dbarretol/quotes-app/actions/workflows/ci.yml)

A minimal web app that serves random motivational quotes, one at a time and without repeats.

- Shows a random quote with its category
- Never repeats a quote until you have seen them all
- Tracks your progress, saves it in your browser and lets you start over at any time

Built with [Next.js](https://nextjs.org/) 15, React 19, [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components.

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

## Adding quotes

Quotes live in [`data/quotes.json`](data/quotes.json), grouped by category:

```json
{
  "Motivation": [
    "The only way to do great work is to love what you do."
  ]
}
```

Add a quote to an existing category or create a new category key; the app picks it up automatically.

## Project structure

```
app/            Next.js App Router (layout, page, global styles)
components/ui/  UI components (button, card, badge)
data/           Quote collection
lib/            Shared utilities
```

## License

[MIT](LICENSE)
