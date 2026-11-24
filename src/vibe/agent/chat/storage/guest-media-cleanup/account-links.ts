import "server-only";

import { sql } from "drizzle-orm";
import type { db } from "next-vibe/database";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import { remoteConnections } from "next-vibe/remote-connection/db";

import { creditWallets } from "@/credits/db";
import { growthJourneys } from "@/leads/growth/db";
import { lifecycleEnrollments } from "@/leads/lifecycle/db";
import { emails } from "@/messenger/messages/db";
import { newsletterSubscriptions } from "@/newsletter/db";
import { leadReferrals } from "@/referral/db";
import { signupEvents } from "@/user/public/signup/db";
import { SignupEventType } from "@/user/public/signup/event-type";

import { chatFolders, chatThreads } from "../../db";

/**
 * Strong lead links can tie a browser to an account through other leads.
 * IP matches only pool guest credits and do not establish account ownership.
 */
export async function findGuestLeadComponent(
  database: Pick<typeof db, "execute">,
  leadIds: string[],
): Promise<{ root_id: string; lead_id: string; account_linked: boolean }[]> {
  if (leadIds.length === 0) {
    return [];
  }
  const result = await database.execute<{
    root_id: string;
    lead_id: string;
    account_linked: boolean;
  }>(sql`
    WITH RECURSIVE connected(root_id, lead_id) AS (
      SELECT id, id FROM ${leads}
      WHERE id IN (${sql.join(
        leadIds.map((id) => sql`${id}::uuid`),
        sql`, `,
      )})
      UNION
      SELECT c.root_id, CASE WHEN e.lead_id_1 = c.lead_id THEN e.lead_id_2 ELSE e.lead_id_1 END
      FROM connected c
      JOIN ${leadLeadLinks} e ON (e.lead_id_1 = c.lead_id OR e.lead_id_2 = c.lead_id)
        AND e.link_reason <> 'ip_match'
    )
    SELECT c.root_id, c.lead_id, (
      l.converted_user_id IS NOT NULL OR l.converted_at IS NOT NULL
      OR l.signed_up_at IS NOT NULL OR l.status = ${LeadStatus.SIGNED_UP}
      OR l.metadata @> '{"hadAccount":true}'::jsonb
      OR EXISTS (SELECT 1 FROM ${userLeadLinks} u WHERE u.lead_id = l.id)
      OR EXISTS (SELECT 1 FROM ${growthJourneys} g WHERE g.lead_id = l.id
        AND (g.user_id IS NOT NULL OR g.signed_up_at IS NOT NULL))
      OR EXISTS (SELECT 1 FROM ${signupEvents} s WHERE s.lead_id = l.id AND s.type = ${SignupEventType.CONFIRMED})
      OR EXISTS (SELECT 1 FROM ${leadReferrals} r WHERE r.lead_id = l.id)
      OR EXISTS (SELECT 1 FROM ${creditWallets} w WHERE w.lead_id = l.id AND w.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${chatThreads} t WHERE t.lead_id = l.id AND t.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${chatFolders} f WHERE f.lead_id = l.id AND f.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${newsletterSubscriptions} n WHERE n.lead_id = l.id AND n.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${lifecycleEnrollments} e WHERE e.lead_id = l.id AND e.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${emails} m WHERE m.lead_id = l.id AND m.user_id IS NOT NULL)
      OR EXISTS (SELECT 1 FROM ${remoteConnections} r WHERE r.lead_id = l.id::text)
    ) AS account_linked
    FROM connected c JOIN ${leads} l ON l.id = c.lead_id
  `);
  return result.rows;
}
