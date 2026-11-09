const STORAGE_KEY = "daily-motivation:progress"
const STORAGE_VERSION = 1

export interface StoredProgress {
  usedIds: string[]
  currentId: string | null
  /** Selected categories; absent means all categories. */
  categories?: string[]
}

interface StoredPayload extends StoredProgress {
  version: number
}

/**
 * Reads saved progress, keeping only ids and categories that still exist in the quote list.
 * Returns null when nothing valid is stored or storage is unavailable.
 */
export function loadProgress(
  validIds: ReadonlySet<string>,
  validCategories: ReadonlySet<string>,
): StoredProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw) as Partial<StoredPayload>
    if (data.version !== STORAGE_VERSION || !Array.isArray(data.usedIds)) return null

    const usedIds = data.usedIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
    const currentId =
      typeof data.currentId === "string" && usedIds.includes(data.currentId) ? data.currentId : null

    const categories = Array.isArray(data.categories)
      ? data.categories.filter((c): c is string => typeof c === "string" && validCategories.has(c))
      : []

    return { usedIds, currentId, ...(categories.length > 0 && { categories }) }
  } catch {
    return null
  }
}

export function saveProgress(progress: StoredProgress): void {
  try {
    const payload: StoredPayload = { version: STORAGE_VERSION, ...progress }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage may be unavailable (private mode, quota exceeded); progress just won't persist.
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore: nothing to clear if storage is unavailable.
  }
}
