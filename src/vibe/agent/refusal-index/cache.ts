/**
 * Tiny in-process TTL cache for the public read endpoints. Results change at
 * most weekly (or when an admin approves a sample), so a few minutes of
 * staleness is invisible. Every cache registers itself so a finished run or a
 * sample change can drop them all at once.
 */

import { PUBLIC_CACHE_TTL_MS } from "./constants";

const registry: Array<{ clear: () => void }> = [];

export class TtlCache<T> {
  private readonly entries = new Map<string, { expires: number; value: T }>();

  constructor() {
    registry.push(this);
  }

  get(key: string): T | undefined {
    const hit = this.entries.get(key);
    if (hit === undefined || hit.expires < Date.now()) {
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T): void {
    this.entries.set(key, { expires: Date.now() + PUBLIC_CACHE_TTL_MS, value });
  }

  clear(): void {
    this.entries.clear();
  }
}

/** Drop every public cache (call after a run finishes or a sample changes). */
export function invalidateRefusalIndexCaches(): void {
  for (const cache of registry) {
    cache.clear();
  }
}
