/**
 * Growth Journey Repository
 *
 * Writes attribution touches and funnel steps onto the per-lead journey row.
 * Every method is best-effort: tracking must never break the request that
 * triggered it, so failures are logged and swallowed.
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { deriveChannel, hasCampaignSignal, type Touch } from "./attribution";
import { growthCampaignLinks, growthJourneys } from "./db";
import type { FunnelStepValue, PaidKindValue } from "./enum";
import { ChannelType, FunnelStep } from "./enum";

export class GrowthJourneyRepository {
  /**
   * Record a touch for a lead.
   * New journey → first = last = touch. Existing journey → first stays,
   * last moves only when the touch carries UTM / ref / link id.
   */
  static async recordTouch(
    leadId: string,
    touch: Touch,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const linkId = await GrowthJourneyRepository.resolveLinkId(touch.linkId);
      const t = deriveChannel({ ...touch, linkId });
      const now = new Date();
      const last = {
        lastChannel: t.channel,
        lastChannelType: t.channelType,
        lastSource: t.source,
        lastMedium: t.medium,
        lastCampaign: t.campaign,
        lastContent: t.content,
        lastTerm: t.term,
        lastReferrerHost: t.referrerHost,
        lastLandingPath: t.landingPath,
        lastRefCode: t.refCode,
        lastLinkId: linkId,
        lastTouchAt: now,
      };
      const insert = db.insert(growthJourneys).values({
        leadId,
        firstChannel: t.channel,
        firstChannelType: t.channelType,
        firstSource: t.source,
        firstMedium: t.medium,
        firstCampaign: t.campaign,
        firstContent: t.content,
        firstTerm: t.term,
        firstReferrerHost: t.referrerHost,
        firstLandingPath: t.landingPath,
        firstRefCode: t.refCode,
        firstLinkId: linkId,
        firstTouchAt: now,
        ...last,
      });

      await (hasCampaignSignal(t)
        ? insert.onConflictDoUpdate({
            target: growthJourneys.leadId,
            set: { ...last, updatedAt: now },
          })
        : insert.onConflictDoNothing({ target: growthJourneys.leadId }));

      if (linkId) {
        await db
          .update(growthCampaignLinks)
          .set({ visits: sql`${growthCampaignLinks.visits} + 1` })
          .where(eq(growthCampaignLinks.id, linkId));
      }
    } catch (error) {
      logger.error("Failed to record growth touch", parseError(error), {
        leadId,
      });
    }
  }

  /**
   * Signup: the user inherits the lead's journey (and its attribution).
   * A user keeps the first journey it was attached to.
   */
  static async attachUser(
    leadId: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const now = new Date();
      // Visit never recorded (bot filter, API-first client) → direct journey
      await db
        .insert(growthJourneys)
        .values({
          leadId,
          firstChannel: "direct",
          firstChannelType: ChannelType.DIRECT,
          lastChannel: "direct",
          lastChannelType: ChannelType.DIRECT,
          firstTouchAt: now,
          lastTouchAt: now,
        })
        .onConflictDoNothing({ target: growthJourneys.leadId });

      const [owned] = await db
        .select({ id: growthJourneys.id })
        .from(growthJourneys)
        .where(eq(growthJourneys.userId, userId))
        .limit(1);
      if (owned) {
        return;
      }

      await db
        .update(growthJourneys)
        .set({
          userId,
          signedUpAt: sql`coalesce(${growthJourneys.signedUpAt}, now())`,
          updatedAt: now,
        })
        .where(
          and(eq(growthJourneys.leadId, leadId), isNull(growthJourneys.userId)),
        );
    } catch (error) {
      logger.error(
        "Failed to attach user to growth journey",
        parseError(error),
        {
          leadId,
          userId,
        },
      );
    }
  }

  /**
   * Stamp a funnel step once. Matches the user's journey first, then the
   * lead's. Already-stamped steps are left untouched (no duplicates).
   */
  static async markStep(
    ids: { userId?: string | null; leadId?: string | null },
    step: typeof FunnelStepValue,
    logger: EndpointLogger,
    paidKind?: typeof PaidKindValue,
  ): Promise<void> {
    try {
      const set = GrowthJourneyRepository.stepUpdate(step, paidKind);
      if (!set) {
        return;
      }
      if (ids.userId) {
        const updated = await db
          .update(growthJourneys)
          .set(set)
          .where(eq(growthJourneys.userId, ids.userId))
          .returning({ id: growthJourneys.id });
        if (updated.length > 0) {
          return;
        }
      }
      if (ids.leadId) {
        await db
          .update(growthJourneys)
          .set(set)
          .where(eq(growthJourneys.leadId, ids.leadId));
      }
    } catch (error) {
      logger.error("Failed to mark growth funnel step", parseError(error), {
        step,
        userId: ids.userId ?? null,
        leadId: ids.leadId ?? null,
      });
    }
  }

  private static stepUpdate(
    step: typeof FunnelStepValue,
    paidKind: typeof PaidKindValue | undefined,
  ): PgUpdateSetSource<typeof growthJourneys> | null {
    const now = new Date();
    switch (step) {
      case FunnelStep.CHAT:
        return {
          firstChatAt: sql`coalesce(${growthJourneys.firstChatAt}, now())`,
          updatedAt: now,
        };
      case FunnelStep.NEWSLETTER:
        return {
          newsletterConfirmedAt: sql`coalesce(${growthJourneys.newsletterConfirmedAt}, now())`,
          updatedAt: now,
        };
      case FunnelStep.PAID:
        return {
          firstPaidAt: sql`coalesce(${growthJourneys.firstPaidAt}, now())`,
          firstPaidKind: paidKind
            ? sql`coalesce(${growthJourneys.firstPaidKind}, ${paidKind})`
            : undefined,
          updatedAt: now,
        };
      case FunnelStep.RETAINED:
        return {
          retainedAt: sql`coalesce(${growthJourneys.retainedAt}, now())`,
          updatedAt: now,
        };
      case FunnelStep.VISIT:
      case FunnelStep.SIGNUP:
        // Visit = recordTouch, signup = attachUser
        return null;
    }
  }

  /** utm_id must point at an existing link, otherwise it is ignored. */
  private static async resolveLinkId(
    linkId: string | null,
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
}
