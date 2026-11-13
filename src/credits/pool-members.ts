/**
 * Free-credit pool membership for an account.
 *
 * One account = one monthly free pool. Its members are:
 * - leads linked to the account (user_lead_links: signup, login, second device)
 * - leads converted into the account (leads.converted_user_id)
 * - every guest lead connected to those through lead_lead_links (same-IP devices,
 *   tracked pages, ...), exactly like linked guest leads share a guest pool.
 * The walk never enters a lead that belongs to ANOTHER account, so two accounts
 * behind one IP never merge.
 *
 * Shared by the TS pool resolver (credits/repository.ts) and the PL/v8 balance
 * function (credits/db-functions.ts) so both always agree on who is in the pool.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";

/**
 * Subquery returning `lead_id` for every lead in the account's free pool.
 * `userId` is a uuid string or a db-function placeholder.
 */
export function userPoolLeadIdsSql(
  userId: string | ReturnType<typeof sql.placeholder>,
): SQL {
  return sql`
    WITH RECURSIVE pool_leads(lead_id) AS (
      SELECT ull.lead_id FROM ${userLeadLinks} ull
      WHERE ull.user_id = ${userId}::uuid
      UNION
      SELECT cl.id FROM ${leads} cl
      WHERE cl.converted_user_id = ${userId}::uuid
      UNION
      SELECT nxt.lead_id
      FROM pool_leads pl
      JOIN ${leadLeadLinks} ll
        ON ll.lead_id_1 = pl.lead_id OR ll.lead_id_2 = pl.lead_id
      CROSS JOIN LATERAL (
        SELECT CASE WHEN ll.lead_id_1 = pl.lead_id
          THEN ll.lead_id_2 ELSE ll.lead_id_1 END AS lead_id
      ) nxt
      WHERE NOT EXISTS (
        SELECT 1 FROM ${userLeadLinks} other_ull
        WHERE other_ull.lead_id = nxt.lead_id
          AND other_ull.user_id <> ${userId}::uuid
      )
      AND NOT EXISTS (
        SELECT 1 FROM ${leads} other_l
        WHERE other_l.id = nxt.lead_id
          AND other_l.converted_user_id IS NOT NULL
          AND other_l.converted_user_id <> ${userId}::uuid
      )
    )
    SELECT lead_id FROM pool_leads
  `;
}
