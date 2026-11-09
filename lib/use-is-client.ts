import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * False during prerendering and hydration, true afterwards.
 * Lets components read browser-only APIs without calling setState in an effect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

/** Reads a browser-only value; returns `serverValue` during prerendering and hydration. */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribe, read, () => serverValue)
}
