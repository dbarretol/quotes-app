# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-11-08

### Added

- Link preview image for Open Graph and X, in the app's poster style; links now show a large card ([#27](https://github.com/dbarretol/quotes-app/pull/27))

### Changed

- README reorganized for visitors, with a screenshot, diagrams of how the app works and a contributing guide ([#27](https://github.com/dbarretol/quotes-app/pull/27))

## [1.3.0] - 2026-11-08

### Changed

- Upgraded to Next.js 16; builds now use Turbopack ([#24](https://github.com/dbarretol/quotes-app/pull/24))
- Node.js 20.9 or later is required ([#24](https://github.com/dbarretol/quotes-app/pull/24))
- ESLint uses the native flat config from `eslint-config-next`; browser-only state is read without effects, following the new React hooks lint rules ([#24](https://github.com/dbarretol/quotes-app/pull/24))

## [1.2.0] - 2026-11-08

A new poster-style design and a round of usability fixes.

### Added

- Each category has its own color; the whole screen takes the color of the quote on display, with a darker palette in dark mode ([#21](https://github.com/dbarretol/quotes-app/pull/21))
- Resetting progress can be undone for a few seconds ([#20](https://github.com/dbarretol/quotes-app/pull/20))
- The category filter is kept in the URL, so filtered links can be shared ([#20](https://github.com/dbarretol/quotes-app/pull/20))

### Changed

- Quotes are shown at poster size in Archivo condensed, left-aligned, without a card ([#21](https://github.com/dbarretol/quotes-app/pull/21))
- Controls stay fixed at the bottom of the screen; buttons use sentence case ("Next quote") ([#21](https://github.com/dbarretol/quotes-app/pull/21))
- Category buttons show their color and are larger on touch screens ([#20](https://github.com/dbarretol/quotes-app/pull/20), [#21](https://github.com/dbarretol/quotes-app/pull/21))

### Fixed

- The main button no longer moves between quotes ([#20](https://github.com/dbarretol/quotes-app/pull/20))
- No content flash or screen reader announcement when saved progress is restored ([#20](https://github.com/dbarretol/quotes-app/pull/20))
- Native scrollbars and controls follow the dark theme ([#20](https://github.com/dbarretol/quotes-app/pull/20))

### Removed

- shadcn/ui components and the `geist`, `@radix-ui/react-slot` and `class-variance-authority` dependencies ([#21](https://github.com/dbarretol/quotes-app/pull/21))

## [1.1.0] - 2026-11-08

### Added

- Filter quotes by category; progress, completion and reset apply to the selected categories ([#15](https://github.com/dbarretol/quotes-app/pull/15))
- Light and dark themes with a toggle; follows the system setting by default ([#17](https://github.com/dbarretol/quotes-app/pull/17))
- Fade-in transition for new quotes, disabled when reduced motion is preferred ([#17](https://github.com/dbarretol/quotes-app/pull/17))
- Production URL, canonical link, Open Graph and Twitter metadata ([#16](https://github.com/dbarretol/quotes-app/pull/16))
- `robots.txt` and `sitemap.xml` ([#16](https://github.com/dbarretol/quotes-app/pull/16))
- Live demo link in the README ([#16](https://github.com/dbarretol/quotes-app/pull/16))

### Changed

- Dependabot only proposes minor and patch updates; major upgrades are planned separately ([#14](https://github.com/dbarretol/quotes-app/pull/14))

## [1.0.0] - 2026-11-08

First stable release.

### Added

- Quote authors, with popular but unverified attributions shown as "attributed to …" ([#5](https://github.com/dbarretol/quotes-app/pull/5))
- Stable quote ids and a `validate:quotes` script that checks `data/quotes.json` ([#5](https://github.com/dbarretol/quotes-app/pull/5))
- Progress saved in the browser (`localStorage`) and restored on reload ([#4](https://github.com/dbarretol/quotes-app/pull/4))
- Copy the current quote to the clipboard, or share it where the browser supports sharing ([#6](https://github.com/dbarretol/quotes-app/pull/6))
- Continuous integration: lint, typecheck, quote validation, build and `npm audit` on Node 22, 24 and 26 ([#3](https://github.com/dbarretol/quotes-app/pull/3))
- Weekly Dependabot updates for npm and GitHub Actions ([#3](https://github.com/dbarretol/quotes-app/pull/3))
- ESLint 9 configuration and `typecheck` script ([#2](https://github.com/dbarretol/quotes-app/pull/2))
- Accessibility: progress bar ARIA attributes and live announcements for new quotes and copy results ([#2](https://github.com/dbarretol/quotes-app/pull/2), [#6](https://github.com/dbarretol/quotes-app/pull/6))
- README and MIT license ([#2](https://github.com/dbarretol/quotes-app/pull/2))

### Changed

- Upgraded to React 19 and Next.js 15.5 ([#1](https://github.com/dbarretol/quotes-app/pull/1))
- `data/quotes.json` is now a flat list of quote objects ([#5](https://github.com/dbarretol/quotes-app/pull/5))
- Production builds now fail on lint or type errors ([#2](https://github.com/dbarretol/quotes-app/pull/2))
- npm is the only supported package manager ([#1](https://github.com/dbarretol/quotes-app/pull/1))
- Real page title and description ([#2](https://github.com/dbarretol/quotes-app/pull/2))

### Fixed

- The completion message now appears together with the last quote instead of requiring an extra click ([#2](https://github.com/dbarretol/quotes-app/pull/2))
- The progress bar no longer renders `NaN%` on first load ([#2](https://github.com/dbarretol/quotes-app/pull/2))
- Duplicate quote texts in different categories are no longer treated as the same quote ([#2](https://github.com/dbarretol/quotes-app/pull/2))

### Removed

- Unused UI components, hooks, styles, placeholder assets and their dependencies ([#1](https://github.com/dbarretol/quotes-app/pull/1))

### Security

- Resolved all `npm audit` findings, including a critical vulnerability in `next@15.2.4` ([#1](https://github.com/dbarretol/quotes-app/pull/1))

[1.4.0]: https://github.com/dbarretol/quotes-app/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/dbarretol/quotes-app/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/dbarretol/quotes-app/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/dbarretol/quotes-app/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dbarretol/quotes-app/releases/tag/v1.0.0
