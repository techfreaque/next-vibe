import { z } from "zod";

import type { StatementSourceRow } from "../bank/statement-format";

export interface BankFeedWindow {
  /** Dates are inclusive booking days in the bank's statement timezone. */
  from: string;
  to: string;
}

/** IBAN is available only to the local, owner-authorized privacy rules. */
export interface BankFeedRow extends StatementSourceRow {
  counterpartyIban?: string;
}

export interface BankFeedPage {
  /** Settled account movements only. Pending card authorizations are excluded. */
  rows: readonly BankFeedRow[];
  next: string | null;
}

export type BankFeedError =
  | "consent"
  | "rateLimit"
  | "unavailable"
  | "invalidResponse"
  | "windowTooLarge";
export type BankFeedResult<T> =
  | { success: true; data: T }
  | { success: false; reason: BankFeedError };

/** Read-only access. Provider-specific account and consent credentials stay inside the adapter. */
export interface BankFeedAdapter {
  readPage(
    period: BankFeedWindow,
    cursor: string | null,
  ): Promise<BankFeedResult<BankFeedPage>>;
}

const day = z.iso.date();
const rowLimit = 1000;
const pageLimit = 32;

/** Validate a whole bounded bank period before passing any movement to the shared importer. */
export async function collectBankWindow(
  adapter: BankFeedAdapter,
  period: BankFeedWindow,
): Promise<BankFeedResult<BankFeedRow[]>> {
  if (
    !day.safeParse(period.from).success ||
    !day.safeParse(period.to).success ||
    period.to < period.from
  ) {
    return { success: false, reason: "invalidResponse" };
  }
  const seen = new Set<string>();
  const rows: BankFeedRow[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < pageLimit; page++) {
    const result = await adapter.readPage(period, cursor);
    if (!result.success) {
      return result;
    }
    for (const row of result.data.rows) {
      if (
        !day.safeParse(row.bookedDate).success ||
        row.bookedDate < period.from ||
        row.bookedDate > period.to
      ) {
        return { success: false, reason: "invalidResponse" };
      }
      rows.push(row);
    }
    if (rows.length > rowLimit) {
      return { success: false, reason: "windowTooLarge" };
    }
    cursor = result.data.next;
    if (cursor === null) {
      return { success: true, data: rows };
    }
    if (!cursor || seen.has(cursor)) {
      return { success: false, reason: "invalidResponse" };
    }
    seen.add(cursor);
  }
  return { success: false, reason: "windowTooLarge" };
}
