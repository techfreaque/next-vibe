/**
 * Real usage = USAGE rows minus signup-carryover rows. A carryover row mirrors
 * guest spend that is already a USAGE row on the guest's own wallet; it only
 * moves the free allowance, so platform-wide spend stats must skip it.
 */

import { sql } from "drizzle-orm";

import { creditTransactions } from "./db";

/** SQL predicate: this credit_transactions row is not a signup carryover */
export const notSignupCarryover = sql`COALESCE(${creditTransactions.metadata}->>'signupCarryover', '') <> 'true'`;

/** Same predicate for raw SQL strings; `alias` is the credit_transactions alias */
export function notSignupCarryoverRaw(alias?: string): string {
  const col = alias ? `${alias}.metadata` : "metadata";
  return `COALESCE(${col}->>'signupCarryover', '') <> 'true'`;
}
