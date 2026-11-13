/**
 * Guest media cleanup: pure selection logic.
 *
 * Guests (public, not logged in) generate media in incognito chats and on
 * standalone tool pages. Those files are stored with `leadId` as the owner and
 * no `uploadedBy`. Once they pass the retention window and the lead never
 * became an account, they are deleted.
 *
 * A file is deleted only when ALL hold:
 * - it is lead-owned (`leadId` set) and NOT user-owned (`uploadedBy` unset)
 * - its namespace is not a stored thread (no `chat_threads` row)
 * - it is older than the cutoff (an unparseable date counts as too new)
 * - its lead is a confirmed guest: the lead row exists and was never linked
 *   to a user account (no `convertedUserId`, no `user_lead_links` row)
 * Files with neither owner (legacy uploads, browser/desktop screenshots, the
 * URL cache) are never touched here.
 */

import type { FileMetadata } from "../index";

export const GuestMediaVerdict = {
  DELETE: "delete",
  TOO_NEW: "tooNew",
  USER_OWNED: "userOwned",
  UNOWNED: "unowned",
  STORED_THREAD: "storedThread",
  ACCOUNT_LEAD: "accountLead",
} as const;

export type GuestMediaVerdictValue =
  (typeof GuestMediaVerdict)[keyof typeof GuestMediaVerdict];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Only uuid values can match a uuid column (`chat_threads.id`, `leads.id`). */
export function isUuidCandidate(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/**
 * Lead ids of the files that could be deleted if their lead is a guest
 * (lead-owned, not user-owned). The repository resolves these against the DB.
 */
export function collectLeadIds(files: readonly FileMetadata[]): string[] {
  const ids = new Set<string>();
  for (const file of files) {
    if (!file.uploadedBy && file.leadId && isUuidCandidate(file.leadId)) {
      ids.add(file.leadId.toLowerCase());
    }
  }
  return [...ids];
}

export function classifyGuestMedia(
  file: Pick<FileMetadata, "leadId" | "uploadedBy" | "threadId" | "uploadedAt">,
  storedThreadIds: ReadonlySet<string>,
  guestLeadIds: ReadonlySet<string>,
  cutoff: Date,
): GuestMediaVerdictValue {
  if (file.uploadedBy) {
    return GuestMediaVerdict.USER_OWNED;
  }
  if (!file.leadId) {
    return GuestMediaVerdict.UNOWNED;
  }
  if (storedThreadIds.has(file.threadId.toLowerCase())) {
    return GuestMediaVerdict.STORED_THREAD;
  }
  const uploadedAtMs = new Date(file.uploadedAt).getTime();
  if (Number.isNaN(uploadedAtMs) || uploadedAtMs >= cutoff.getTime()) {
    return GuestMediaVerdict.TOO_NEW;
  }
  // Unknown leads (no row) count as accounts: only confirmed guests go.
  if (!guestLeadIds.has(file.leadId.toLowerCase())) {
    return GuestMediaVerdict.ACCOUNT_LEAD;
  }
  return GuestMediaVerdict.DELETE;
}

export interface GuestMediaSelection {
  toDelete: FileMetadata[];
  skipped: Record<
    Exclude<GuestMediaVerdictValue, typeof GuestMediaVerdict.DELETE>,
    number
  >;
  /** Deletable files left for the next run because `limit` was hit. */
  deferred: number;
}

export function selectGuestMediaForDeletion(params: {
  files: readonly FileMetadata[];
  storedThreadIds: ReadonlySet<string>;
  guestLeadIds: ReadonlySet<string>;
  cutoff: Date;
  limit: number;
}): GuestMediaSelection {
  const { files, storedThreadIds, guestLeadIds, cutoff, limit } = params;
  const selection: GuestMediaSelection = {
    toDelete: [],
    skipped: {
      tooNew: 0,
      userOwned: 0,
      unowned: 0,
      storedThread: 0,
      accountLead: 0,
    },
    deferred: 0,
  };

  for (const file of files) {
    const verdict = classifyGuestMedia(
      file,
      storedThreadIds,
      guestLeadIds,
      cutoff,
    );
    if (verdict !== GuestMediaVerdict.DELETE) {
      selection.skipped[verdict]++;
      continue;
    }
    if (selection.toDelete.length >= limit) {
      selection.deferred++;
      continue;
    }
    selection.toDelete.push(file);
  }

  return selection;
}
