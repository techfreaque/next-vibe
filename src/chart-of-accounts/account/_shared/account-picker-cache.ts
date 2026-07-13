/**
 * In-memory cache for account picker data.
 *
 * When the list widget calls onPick(), it writes the full account snapshot here.
 * The update widget reads from this cache to populate the context header and
 * pre-fill editable fields without an additional network round-trip.
 *
 * Lifecycle: session-scoped (cleared on page reload). This is intentional —
 * stale context data is harmless because the PATCH only writes the fields
 * the user explicitly edits.
 */

export interface CachedAccount {
  id: string;
  name: string;
  code: string;
  type: string;
  subtype: string;
  isSystem: boolean;
  isActive: boolean;
  description: string | null;
  sortOrder: number;
}

const cache = new Map<string, CachedAccount>();

export function setCachedAccount(account: CachedAccount): void {
  cache.set(account.id, account);
}

export function getCachedAccount(id: string): CachedAccount | undefined {
  return cache.get(id);
}
