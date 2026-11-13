/**
 * Signup email guard: alias-aware uniqueness + disposable domain block.
 * normalizedEmailSql mirrors normalizeEmailForUniqueness (email-identity.ts).
 */

import "server-only";

import { and, eq, not, type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";

import { normalizeEmailForUniqueness } from "./email-identity";

/** SQL twin of normalizeEmailForUniqueness over users.email */
export function normalizedEmailSql(): SQL<string> {
  const e = sql`lower(btrim(${users.email}))`;
  const local = sql`split_part(split_part(${e}, '@', 1), '+', 1)`;
  const domain = sql`substr(${e}, strpos(${e}, '@') + 1)`;
  return sql<string>`(CASE
    WHEN strpos(${e}, '@') = 0 THEN ${e}
    WHEN ${domain} IN ('gmail.com', 'googlemail.com') THEN replace(${local}, '.', '') || '@gmail.com'
    ELSE ${local} || '@' || ${domain}
  END)`;
}

/**
 * The existing account whose normalized email equals this one's, or null.
 * excludeUserId skips the caller's own account (email change).
 */
export async function findUserByNormalizedEmail(
  email: string,
  excludeUserId: string | null,
): Promise<{ id: string; email: string } | null> {
  const match = eq(normalizedEmailSql(), normalizeEmailForUniqueness(email));
  const [row] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(excludeUserId ? and(match, not(eq(users.id, excludeUserId))) : match)
    .limit(1);
  return row ?? null;
}
