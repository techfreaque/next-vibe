/**
 * Free-credit pool membership for an account.
 *
 * One account = one monthly free pool. Its members are:
 * - leads linked to the account (user_lead_links: signup, login, second device)
 * - leads converted into the account (leads.converted_user_id)
 * - guest leads connected to those through STRONG lead_lead_links (tracked
 *   page, referral, manual): never through ip_match. Sharing an IP is not
 *   proof of being the same person, so strangers behind one IP never share an
 *   account's pool (see credits/anti-farming for the IP-based guest rules).
 * The walk never enters a lead that belongs to ANOTHER account.
 *
 * A guest pool (no account) = guest leads connected through ANY link,
 * including ip_match (same IP within 24 h), never entering an account's lead.
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
        ON (ll.lead_id_1 = pl.lead_id OR ll.lead_id_2 = pl.lead_id)
        AND ll.link_reason <> 'ip_match'
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

/**
 * Subquery returning `lead_id` for every lead in a GUEST pool: the start lead
 * plus guest leads connected through any lead_lead_links (incl. ip_match),
 * never entering a lead that belongs to an account.
 */
export function guestPoolLeadIdsSql(
  leadId: string | ReturnType<typeof sql.placeholder>,
): SQL {
  return sql`
    WITH RECURSIVE guest_leads(lead_id) AS (
      SELECT ${leadId}::uuid
      UNION
      SELECT nxt.lead_id
      FROM guest_leads gl
      JOIN ${leadLeadLinks} ll
        ON ll.lead_id_1 = gl.lead_id OR ll.lead_id_2 = gl.lead_id
      CROSS JOIN LATERAL (
        SELECT CASE WHEN ll.lead_id_1 = gl.lead_id
          THEN ll.lead_id_2 ELSE ll.lead_id_1 END AS lead_id
      ) nxt
      WHERE NOT EXISTS (
        SELECT 1 FROM ${userLeadLinks} owned_ull
        WHERE owned_ull.lead_id = nxt.lead_id
      )
      AND NOT EXISTS (
        SELECT 1 FROM ${leads} owned_l
        WHERE owned_l.id = nxt.lead_id
          AND owned_l.converted_user_id IS NOT NULL
      )
    )
    SELECT lead_id FROM guest_leads
  `;
}
