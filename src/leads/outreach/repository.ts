/**
 * Outreach contact store - shared write helpers for the contact, deal and
 * import endpoints. Server-only. Callers own error handling (try/catch +
 * fail); these helpers only run queries.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import { normalizeChannelKey } from "../growth/attribution";
import { growthCampaignLinks } from "../growth/db";
import { outreachContacts, outreachTouches } from "./db";
import type {
  OutreachContactKindValue,
  OutreachContactStatusValue,
} from "./enum";
import { OutreachDirection } from "./enum";
import { mergeStatus } from "./pipeline";

export interface ContactSeed {
  email: string;
  name: string;
  kind: typeof OutreachContactKindValue | null;
  angle: string | null;
  status: typeof OutreachContactStatusValue;
}

export class OutreachContactStore {
  static async findByEmail(
    email: string,
  ): Promise<typeof outreachContacts.$inferSelect | null> {
    const [row] = await db
      .select()
      .from(outreachContacts)
      .where(eq(outreachContacts.email, email))
      .limit(1);
    return row ?? null;
  }

  /** Create the contact if missing. Returns it plus whether it was created. */
  static async ensure(seed: ContactSeed): Promise<{
    contact: typeof outreachContacts.$inferSelect;
    created: boolean;
  } | null> {
    const existing = await OutreachContactStore.findByEmail(seed.email);
    if (existing) {
      return { contact: existing, created: false };
    }
    const [inserted] = await db
      .insert(outreachContacts)
      .values({
        email: seed.email,
        name: seed.name,
        kind: seed.kind ?? undefined,
        angle: seed.angle,
        status: seed.status,
      })
      .onConflictDoNothing({ target: outreachContacts.email })
      .returning();
    if (inserted) {
      return { contact: inserted, created: true };
    }
    // Lost a race - read the winner
    const winner = await OutreachContactStore.findByEmail(seed.email);
    return winner ? { contact: winner, created: false } : null;
  }

  /** Recompute counters from outbound / inbound touches. */
  static async refreshCounters(contactId: string): Promise<void> {
    const out = OutreachDirection.OUT;
    const inbound = OutreachDirection.IN;
    await db
      .update(outreachContacts)
      .set({
        contactCount: sql`(select count(*)::int from ${outreachTouches} t where t.contact_id = ${outreachContacts.id} and t.direction = ${out})`,
        firstContactAt: sql`(select min(t.at) from ${outreachTouches} t where t.contact_id = ${outreachContacts.id} and t.direction = ${out})`,
        lastContactAt: sql`(select max(t.at) from ${outreachTouches} t where t.contact_id = ${outreachContacts.id} and t.direction = ${out})`,
        lastReplyAt: sql`(select max(t.at) from ${outreachTouches} t where t.contact_id = ${outreachContacts.id} and t.direction = ${inbound})`,
        lastSubject: sql`(select t.subject from ${outreachTouches} t where t.contact_id = ${outreachContacts.id} and t.direction = ${out} and t.subject <> '' order by t.at desc, t.created_at desc limit 1)`,
        updatedAt: new Date(),
      })
      .where(eq(outreachContacts.id, contactId));
  }

  /** Apply the pipeline merge rule. Returns the resulting status. */
  static async applyStatus(
    contact: typeof outreachContacts.$inferSelect,
    incoming: typeof OutreachContactStatusValue,
    force = false,
  ): Promise<typeof OutreachContactStatusValue> {
    const next = mergeStatus(contact.status, incoming, force);
    if (next !== contact.status) {
      await db
        .update(outreachContacts)
        .set({ status: next, updatedAt: new Date() })
        .where(eq(outreachContacts.id, contact.id));
    }
    return next;
  }

  /** The id when a campaign link with it exists on this instance, else null. */
  static async resolveLinkId(
    linkId: string | null | undefined,
  ): Promise<string | null> {
    if (!linkId) {
      return null;
    }
    const [link] = await db
      .select({ id: growthCampaignLinks.id })
      .from(growthCampaignLinks)
      .where(eq(growthCampaignLinks.id, linkId))
      .limit(1);
    return link?.id ?? null;
  }

  static channelKey(input: string | null | undefined): string | null {
    const trimmed = input?.trim();
    return trimmed ? normalizeChannelKey(trimmed) : null;
  }
}
