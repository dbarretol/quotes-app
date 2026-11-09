import { ImageResponse } from "next/og"
import { getCategorySwatch } from "@/lib/category-theme"
import { ALL_CATEGORIES } from "@/lib/quotes"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }
export const OG_IMAGE_ALT = `${SITE_NAME}: one quote at a time, on a poster colored by its category.`

const HEADLINE = "One quote at a time."
const DOMAIN = new URL(SITE_URL).host
// The image uses the first category's poster colors, as the app does when showing one of its quotes.
const BACKGROUND = "#E4572E"
const INK = "#000000"

/**
 * Loads a static Archivo instance from Google Fonts, subset to `text`. The image is generated at
 * build time, so this runs once per build. Width 63 is the closest instance Google Fonts serves to
 * the app's condensed width of 62.
 */
async function loadArchivo(width: number, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@${width},${weight}&text=${encodeURIComponent(text)}`
  const css = await fetch(cssUrl).then((res) => res.text())
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
  if (!fontUrl) throw new Error(`Archivo ${width}/${weight} not found in Google Fonts response`)

  const font = await fetch(fontUrl)
  if (!font.ok) throw new Error(`Failed to download Archivo ${width}/${weight}: HTTP ${font.status}`)
  return font.arrayBuffer()
}

/** Shared image for link previews (Open Graph and X). */
export async function renderOgImage(): Promise<ImageResponse> {
  const [condensedBold, semiBold] = await Promise.all([
    loadArchivo(63, 700, HEADLINE),
    loadArchivo(100, 600, SITE_NAME + DOMAIN),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: BACKGROUND,
          color: INK,
        }}
      >
        <div style={{ fontFamily: "Archivo", fontWeight: 600, fontSize: 34 }}>{SITE_NAME}</div>

        <div
          style={{
            fontFamily: "Archivo Condensed",
            fontWeight: 700,
            fontSize: 196,
            lineHeight: 0.95,
            maxWidth: 900,
          }}
        >
          {HEADLINE}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16 }}>
            {ALL_CATEGORIES.map((category) => (
              <div
                key={category}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  border: `3px solid ${INK}`,
                  backgroundColor: getCategorySwatch(category) ?? INK,
                }}
              />
            ))}
          </div>
          <div style={{ fontFamily: "Archivo", fontWeight: 600, fontSize: 28 }}>{DOMAIN}</div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "Archivo Condensed", data: condensedBold, weight: 700, style: "normal" },
        { name: "Archivo", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  )
}
