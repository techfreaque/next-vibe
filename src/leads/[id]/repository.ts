import "server-only";

import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import {
  emailCampaigns,
  leadEngagements,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { LeadsRepository } from "next-vibe/identity/lead/repository";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { QueryResultRow } from "pg";

import { creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { ipPrefixSql } from "@/leads/analytics/bot-sql";
import { LeadDimension } from "@/leads/analytics/enum";
import { dimensionColumn, leadFactsSql } from "@/leads/analytics/segment-sql";
import { growthJourneys } from "@/leads/growth/db";
import { MessageStatus } from "@/messenger/messages/enum";
import { newsletterSubscriptions } from "@/newsletter/db";

import type { LeadGetResponseOutput } from "./definition";
import { LeadAccountAssociation, LeadJourneyEvent } from "./enum";

type Review = NonNullable<LeadGetResponseOutput["review"]>;
type JourneyEvent = Review["events"][number];
type LeadDetail = LeadGetResponseOutput["lead"];
type AccountAssociation = Omit<
  NonNullable<Review["accountAssociations"]>[number],
  "email" | "publicName"
>;

async function getReview(lead: LeadDetail): Promise<Review> {
  const leadId = lead.basicInfo.id;
  const leadIds = [
    leadId,
    ...lead.linkedLeads.map((link) => link.linkedLeadId),
  ];
  const [evidence, accountLinks] = await Promise.all([
    db
      .select({
        leadId: leads.id,
        source: leads.source,
        convertedUserId: leads.convertedUserId,
        convertedAt: leads.convertedAt,
        guestConsentAt: leads.uncensoredConsentAt,
        guestConsentVersion: leads.uncensoredConsentVersion,
        attribution: {
          firstTouchAt: growthJourneys.firstTouchAt,
          firstChannel: growthJourneys.firstChannel,
          firstSource: growthJourneys.firstSource,
          firstCampaign: growthJourneys.firstCampaign,
          lastTouchAt: growthJourneys.lastTouchAt,
          lastChannel: growthJourneys.lastChannel,
          lastSource: growthJourneys.lastSource,
          lastCampaign: growthJourneys.lastCampaign,
          firstChatAt: growthJourneys.firstChatAt,
          firstPaidAt: growthJourneys.firstPaidAt,
          userId: growthJourneys.userId,
        },
      })
      .from(leads)
      .leftJoin(growthJourneys, eq(growthJourneys.leadId, leads.id))
      .where(inArray(leads.id, leadIds)),
    db
      .select({
        leadId: userLeadLinks.leadId,
        userId: userLeadLinks.userId,
        reason: userLeadLinks.linkReason,
        recordedAt: userLeadLinks.linkedAt,
      })
      .from(userLeadLinks)
      .where(inArray(userLeadLinks.leadId, leadIds)),
  ]);
  const primary = evidence.find((record) => record.leadId === leadId);
  const growth = primary?.attribution;

  // Each recorded association belongs to its source lead. Account IDs are used
  // to find user-only records without traversing any of those accounts' leads.
  const associations: AccountAssociation[] = accountLinks.map((link) => ({
    ...link,
    association: LeadAccountAssociation.LINK,
  }));
  for (const record of evidence) {
    if (record.convertedUserId) {
      associations.push({
        leadId: record.leadId,
        userId: record.convertedUserId,
        association: LeadAccountAssociation.CONVERSION,
        reason: null,
        recordedAt: record.convertedAt,
      });
    }
    if (record.attribution?.userId) {
      associations.push({
        leadId: record.leadId,
        userId: record.attribution.userId,
        association: LeadAccountAssociation.ATTRIBUTION,
        reason: null,
        recordedAt: null,
      });
    }
  }
  const userIds = [...new Set(associations.map((record) => record.userId))];

  const [
    engagements,
    deliveries,
    [nextEmail],
    wallets,
    subscriptions,
    accounts,
  ] = await Promise.all([
    db
      .select({
        id: leadEngagements.id,
        date: leadEngagements.timestamp,
        engagementType: leadEngagements.engagementType,
        detail: emailCampaigns.subject,
      })
      .from(leadEngagements)
      .leftJoin(
        emailCampaigns,
        and(
          eq(emailCampaigns.id, leadEngagements.campaignId),
          eq(emailCampaigns.leadId, leadEngagements.leadId),
        ),
      )
      .where(eq(leadEngagements.leadId, leadId))
      .orderBy(desc(leadEngagements.timestamp), desc(leadEngagements.id))
      .limit(25),
    db
      .select({
        id: emailCampaigns.id,
        subject: emailCampaigns.subject,
        sentAt: emailCampaigns.sentAt,
        bouncedAt: emailCampaigns.bouncedAt,
      })
      .from(emailCampaigns)
      .where(eq(emailCampaigns.leadId, leadId))
      .orderBy(desc(emailCampaigns.createdAt), desc(emailCampaigns.id))
      .limit(20),
    db
      .select({ at: emailCampaigns.scheduledAt })
      .from(emailCampaigns)
      .where(
        and(
          eq(emailCampaigns.leadId, leadId),
          eq(emailCampaigns.status, MessageStatus.PENDING),
          isNull(emailCampaigns.sentAt),
        ),
      )
      .orderBy(asc(emailCampaigns.scheduledAt))
      .limit(1),
    db
      .select({
        id: creditWallets.id,
        leadId: creditWallets.leadId,
        userId: creditWallets.userId,
      })
      .from(creditWallets)
      .where(
        or(
          inArray(creditWallets.leadId, leadIds),
          userIds.length
            ? and(
                isNull(creditWallets.leadId),
                inArray(creditWallets.userId, userIds),
              )
            : undefined,
        ),
      )
      .orderBy(asc(creditWallets.id)),
    db
      .select({
        id: newsletterSubscriptions.id,
        email: newsletterSubscriptions.email,
        leadId: newsletterSubscriptions.leadId,
        userId: newsletterSubscriptions.userId,
        status: newsletterSubscriptions.status,
        marketingConsent: newsletterSubscriptions.marketingConsent,
        subscriptionDate: newsletterSubscriptions.subscriptionDate,
        confirmedAt: newsletterSubscriptions.confirmedAt,
        unsubscribedDate: newsletterSubscriptions.unsubscribedDate,
      })
      .from(newsletterSubscriptions)
      .where(
        or(
          inArray(newsletterSubscriptions.leadId, leadIds),
          userIds.length
            ? and(
                isNull(newsletterSubscriptions.leadId),
                inArray(newsletterSubscriptions.userId, userIds),
              )
            : undefined,
        ),
      )
      .orderBy(asc(newsletterSubscriptions.id)),
    userIds.length
      ? db
          .select({
            id: users.id,
            email: users.email,
            publicName: users.publicName,
          })
          .from(users)
          .where(inArray(users.id, userIds))
      : [],
  ]);

  const { lifecycle, conversion, engagement } = lead;
  const events: JourneyEvent[] = [];
  const addEvent = (
    kind: JourneyEvent["kind"],
    date: Date | null | undefined,
    id?: string,
    detail?: string | null,
  ): void => {
    if (date) {
      events.push({
        id: id ? `${kind}/${id}` : kind,
        kind,
        date,
        detail: detail ?? undefined,
      });
    }
  };

  addEvent(LeadJourneyEvent.CREATED, lead.metadata.createdAt);
  addEvent(LeadJourneyEvent.CAMPAIGN_STARTED, lifecycle.campaignStartedAt);
  addEvent(LeadJourneyEvent.BOUNCED, lifecycle.bouncedAt);
  addEvent(LeadJourneyEvent.INVALID, lifecycle.invalidAt);
  addEvent(LeadJourneyEvent.UNSUBSCRIBED, engagement.unsubscribedAt);
  addEvent(LeadJourneyEvent.SIGNUP, conversion.signedUpAt);
  addEvent(
    LeadJourneyEvent.CONVERTED,
    conversion.convertedAt,
    undefined,
    conversion.convertedUserId,
  );
  addEvent(
    LeadJourneyEvent.SUBSCRIPTION_CONFIRMED,
    conversion.subscriptionConfirmedAt,
  );

  if (growth) {
    addEvent(
      LeadJourneyEvent.FIRST_TOUCH,
      growth.firstTouchAt,
      undefined,
      [growth.firstChannel, growth.firstCampaign].filter(Boolean).join(" · "),
    );
    if (growth.lastTouchAt.getTime() !== growth.firstTouchAt.getTime()) {
      addEvent(
        LeadJourneyEvent.LAST_TOUCH,
        growth.lastTouchAt,
        undefined,
        [growth.lastChannel, growth.lastCampaign].filter(Boolean).join(" · "),
      );
    }
    addEvent(LeadJourneyEvent.FIRST_CHAT, growth.firstChatAt);
    addEvent(LeadJourneyEvent.FIRST_PAYMENT, growth.firstPaidAt);
  }

  for (const link of lead.linkedLeads) {
    addEvent(
      LeadJourneyEvent.LEAD_LINK,
      link.linkedAt,
      link.linkedLeadId,
      link.email ?? link.businessName,
    );
  }
  for (const link of lead.linkedUsers) {
    addEvent(
      LeadJourneyEvent.ACCOUNT_LINK,
      link.linkedAt,
      link.userId,
      link.email,
    );
  }
  for (const { code, clickedAt, ownerUserId } of lead.referralHistory) {
    addEvent(
      LeadJourneyEvent.REFERRAL,
      clickedAt,
      `${ownerUserId}/${code}/${clickedAt.getTime()}`,
      code,
    );
  }

  for (const { id, subject, sentAt, bouncedAt } of deliveries) {
    addEvent(LeadJourneyEvent.EMAIL_SENT, sentAt, id, subject);
    addEvent(LeadJourneyEvent.EMAIL_BOUNCED, bouncedAt, id, subject);
  }
  for (const event of engagements) {
    events.push({
      ...event,
      detail: event.detail ?? undefined,
      kind: LeadJourneyEvent.INTERACTION,
    });
  }

  for (const row of subscriptions) {
    // A related account or another lead's consent belongs in the review,
    // while the timeline only records consent attached to this lead.
    if (row.leadId === leadId) {
      addEvent(
        LeadJourneyEvent.NEWSLETTER_SUBSCRIBED,
        row.subscriptionDate,
        row.id,
        row.email,
      );
      addEvent(
        LeadJourneyEvent.NEWSLETTER_CONFIRMED,
        row.confirmedAt,
        row.id,
        row.email,
      );
      addEvent(
        LeadJourneyEvent.NEWSLETTER_UNSUBSCRIBED,
        row.unsubscribedDate,
        row.id,
        row.email,
      );
    }
  }

  const accountsById = new Map(accounts.map((record) => [record.id, record]));
  const accountAssociations = associations
    .toSorted(
      (a, b) =>
        Number(b.leadId === leadId) - Number(a.leadId === leadId) ||
        a.leadId.localeCompare(b.leadId) ||
        a.userId.localeCompare(b.userId) ||
        a.association.localeCompare(b.association),
    )
    .map((record) => {
      const account = accountsById.get(record.userId);
      return {
        ...record,
        email: account?.email ?? null,
        publicName: account?.publicName ?? null,
      };
    });

  return {
    events: events.toSorted(
      (a, b) => a.date.getTime() - b.date.getTime() || a.id.localeCompare(b.id),
    ),
    nextEmailAt: nextEmail?.at ?? null,
    attributedUserId: growth?.userId ?? null,
    accountAssociations,
    relatedLeadEvidence: evidence
      .filter((record) => record.leadId !== leadId)
      .map(
        ({
          leadId: relatedLeadId,
          source,
          guestConsentAt,
          guestConsentVersion,
          attribution,
        }) => ({
          leadId: relatedLeadId,
          source,
          guestConsentAt,
          guestConsentVersion,
          attribution: attribution
            ? {
                firstTouchAt: attribution.firstTouchAt,
                firstChannel: attribution.firstChannel,
                firstSource: attribution.firstSource,
                firstCampaign: attribution.firstCampaign,
                lastTouchAt: attribution.lastTouchAt,
                lastChannel: attribution.lastChannel,
                lastSource: attribution.lastSource,
                lastCampaign: attribution.lastCampaign,
              }
            : null,
        }),
      ),
    wallets,
    newsletter: subscriptions.map((subscription) => ({
      id: subscription.id,
      email: subscription.email,
      leadId: subscription.leadId,
      userId: subscription.userId,
      status: subscription.status,
      marketingConsent: subscription.marketingConsent,
      confirmedAt: subscription.confirmedAt,
      unsubscribedDate: subscription.unsubscribedDate,
    })),
    guestConsentAt: primary?.guestConsentAt ?? null,
    guestConsentVersion: primary?.guestConsentVersion ?? null,
  };
}

type LeadTraffic = NonNullable<LeadGetResponseOutput["traffic"]>;

/** Bot class, first touch, network and burst context of one lead. */
async function getTraffic(leadId: string): Promise<LeadTraffic | undefined> {
  const { rows } = await db.execute<QueryResultRow & LeadTraffic>(sql`
    WITH f AS (${leadFactsSql(sql`l.id = ${leadId}`)})
    SELECT f.bot_family AS "botFamily",
      ${dimensionColumn(LeadDimension.CHANNEL_TYPE)} AS "channelType",
      f.channel, f.source, f.medium, f.campaign,
      f.referrer_host AS "referrerHost", f.landing_path AS "landingPath",
      f.ref_code AS "refCode", f.ip_prefix AS "ipPrefix", f.ua_fp AS "uaFingerprint",
      (SELECT count(*)::int FROM leads p
        WHERE f.ip_prefix IS NOT NULL AND p.created_at >= now() - interval '30 days'
          AND p.ip_address IS NOT NULL
          AND ${ipPrefixSql(sql`p.ip_address`)} = f.ip_prefix) AS "prefixLeads30d",
      (SELECT count(*)::int FROM leads p
        WHERE f.ua IS NOT NULL AND p.created_at >= now() - interval '30 days'
          AND p.user_agent = f.ua) AS "uaLeads30d",
      coalesce((SELECT sum((t.metadata->>'freeCreditsUsed')::numeric)
        FROM credit_transactions t JOIN credit_wallets w ON w.id = t.wallet_id
        WHERE t.type = ${CreditTransactionType.USAGE}
          AND (t.metadata->>'actorLeadId' = f.id::text
            OR (t.metadata->>'actorLeadId' IS NULL AND w.lead_id = f.id))
          AND (t.metadata->>'freeCreditsUsed') ~ '^[0-9.]+$'), 0)::float8 AS "freeCreditsBurned"
    FROM f
  `);
  return rows[0];
}

export class LeadDetailRepository {
  static async getLead(
    id: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadGetResponseOutput>> {
    const result = await LeadsRepository.getLeadById(id, logger, locale);
    if (!result.success) {
      return result;
    }

    try {
      const [review, traffic] = await Promise.all([
        getReview(result.data.lead),
        getTraffic(id),
      ]);
      return success({ ...result.data, review, traffic });
    } catch (error) {
      logger.error("Failed to load lead review", parseError(error));
      return success({ ...result.data, review: undefined });
    }
  }
}
