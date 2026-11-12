/**
 * Campaign Scheduler Service
 * Handles email campaign scheduling and automation
 */

import {
  and,
  count,
  eq,
  inArray,
  isNotNull,
  isNull,
  lt,
  ne,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import type {
  Countries,
  CountryLanguage,
  Languages,
} from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  getLanguageAndCountryFromLocale,
  getLocaleFromLanguageAndCountry,
} from "next-vibe/core/i18n/core/language-utils";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { emailCampaigns, leads } from "next-vibe/identity/lead/db";
import type {
  EmailCampaignStageValue,
  EmailJourneyVariantValue,
  EmailProviderValue,
} from "next-vibe/identity/lead/enum";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadSource,
  LeadStatus,
} from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  CampaignType,
  type CampaignTypeValue,
} from "../../../../messenger/accounts/enum";
import { MessageStatus } from "../../../../messenger/messages/enum";
import { newsletterSubscriptions } from "../../../../newsletter/db";
import { NewsletterSubscriptionStatus } from "../../../../newsletter/enum";
import type { CampaignSchedulingOptions } from "../types";
import { abTestingService } from "./ab-testing";

/**
 * Campaign Scheduling Rules
 * Defines timing between email stages
 */
type SchedulableStage = Exclude<
  typeof EmailCampaignStageValue,
  (typeof EmailCampaignStage)["NOT_STARTED"]
>;

const SCHEDULING_RULES: {
  [stage in SchedulableStage]: {
    delay: number; // In milliseconds
    nextStage: SchedulableStage | null;
  };
} = {
  [EmailCampaignStage.INITIAL]: {
    delay: 0, // Send immediately
    nextStage: EmailCampaignStage.FOLLOWUP_1,
  },
  [EmailCampaignStage.FOLLOWUP_1]: {
    delay: 3 * 24 * 60 * 60 * 1000, // 3 days
    nextStage: EmailCampaignStage.FOLLOWUP_2,
  },
  [EmailCampaignStage.FOLLOWUP_2]: {
    delay: 5 * 24 * 60 * 60 * 1000, // 5 days
    nextStage: EmailCampaignStage.FOLLOWUP_3,
  },
  [EmailCampaignStage.FOLLOWUP_3]: {
    delay: 7 * 24 * 60 * 60 * 1000, // 7 days
    nextStage: EmailCampaignStage.NURTURE,
  },
  [EmailCampaignStage.NURTURE]: {
    delay: 14 * 24 * 60 * 60 * 1000, // 14 days
    nextStage: EmailCampaignStage.REACTIVATION,
  },
  [EmailCampaignStage.REACTIVATION]: {
    delay: 30 * 24 * 60 * 60 * 1000, // 30 days
    nextStage: null, // End of sequence
  },
};

/**
 * Campaign Scheduler Service Class
 */
export class CampaignSchedulerService {
  /**
   * Check if lead is eligible to receive a given campaign type.
   * UNSUBSCRIBED, BOUNCED, INVALID always block all campaigns.
   * Other statuses are allowed depending on the campaign type.
   */
  private isLeadEligibleForCampaign(
    lead: typeof leads.$inferSelect,
    campaignType: typeof CampaignTypeValue,
  ): boolean {
    // Always block terminal opt-out/bounce/invalid statuses
    const alwaysBlocked: Array<(typeof LeadStatus)[keyof typeof LeadStatus]> = [
      LeadStatus.UNSUBSCRIBED,
      LeadStatus.BOUNCED,
      LeadStatus.INVALID,
    ];
    if (alwaysBlocked.includes(lead.status)) {
      return false;
    }

    // Campaign-type specific eligibility
    switch (campaignType) {
      case CampaignType.LEAD_CAMPAIGN:
      case CampaignType.NEWSLETTER:
        // Cold / newsletter nurture: only pre-signup leads
        return !lead.signedUpAt && !lead.convertedAt;
      case CampaignType.SIGNUP_NURTURE:
        // Signed-up leads without a subscription
        return !!lead.signedUpAt && !lead.subscriptionConfirmedAt;
      case CampaignType.RETENTION:
        // Active subscribers
        return !!lead.subscriptionConfirmedAt;
      case CampaignType.WINBACK:
        // Churned: was a subscriber, no longer
        return !!lead.signedUpAt && !lead.subscriptionConfirmedAt;
      default:
        return true;
    }
  }

  /**
   * Schedule initial email campaign for a new lead.
   * Creates or updates the lead_campaigns row for the given campaignType,
   * then schedules the INITIAL email send.
   */
  async scheduleInitialCampaign(
    leadId: string,
    options: {
      campaignType?: typeof CampaignTypeValue;
      journeyVariant?: typeof EmailJourneyVariantValue;
      priority?: "low" | "normal" | "high";
      metadata?: Record<string, string | number | boolean>;
    } = {},
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      const campaignType = options.campaignType ?? CampaignType.LEAD_CAMPAIGN;
      logger.debug("campaign.schedule.initial.start", {
        leadId,
        campaignType,
        options,
      });

      // Get lead data
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (!lead) {
        logger.error("campaign.schedule.initial.lead.not.found", { leadId });
        return null;
      }

      // Check if lead is eligible for this campaign type
      if (!this.isLeadEligibleForCampaign(lead, campaignType)) {
        logger.debug("campaign.schedule.initial.skip.ineligible", {
          leadId,
          status: lead.status,
          convertedAt: lead.convertedAt?.toISOString() || null,
        });
        return null;
      }

      // Assign journey variant:
      // - Cold campaigns (LEAD_CAMPAIGN, NEWSLETTER): use A/B testing
      // - Post-conversion campaigns: use their dedicated fixed variant
      const fixedVariantForCampaignType: Partial<
        Record<
          typeof CampaignTypeValue,
          (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant]
        >
      > = {
        [CampaignType.SIGNUP_NURTURE]: EmailJourneyVariant.SIGNUP_NURTURE,
        [CampaignType.RETENTION]: EmailJourneyVariant.RETENTION,
        [CampaignType.WINBACK]: EmailJourneyVariant.WINBACK,
      };
      const journeyVariant =
        options.journeyVariant ||
        fixedVariantForCampaignType[campaignType] ||
        abTestingService.assignJourneyVariant(leadId, logger, {
          country: lead.country || undefined,
          source: lead.source || undefined,
        });

      // Upsert lead_campaigns row - one row per lead+campaignType
      const now = new Date();

      // Update lead with assigned journey variant (kept for backwards compat / denormalized view)
      await db
        .update(leads)
        .set({
          emailJourneyVariant: journeyVariant,
          currentCampaignStage: EmailCampaignStage.INITIAL,
          updatedAt: now,
        })
        .where(eq(leads.id, leadId));

      // Schedule initial email
      const campaignId = await this.scheduleEmail(
        {
          leadId,
          campaignType,
          journeyVariant,
          stage: EmailCampaignStage.INITIAL,
          scheduledAt: now,
          metadata: options.metadata,
        },
        logger,
      );

      if (campaignId) {
        // Schedule next stage
        await this.scheduleNextStage(
          leadId,
          campaignType,
          EmailCampaignStage.INITIAL,
          journeyVariant,
          logger,
        );
      }

      return campaignId;
    } catch (error) {
      logger.error("campaign.schedule.initial.error", parseError(error), {
        leadId,
      });
      return null;
    }
  }

  /**
   * Schedule a specific email
   */
  async scheduleEmail(
    options: CampaignSchedulingOptions,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      const {
        leadId,
        campaignType,
        journeyVariant,
        stage,
        scheduledAt,
        metadata = {},
      } = options;

      // Check if email already scheduled for this lead+campaignType+stage
      const existingCampaign = await db
        .select()
        .from(emailCampaigns)
        .where(
          and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.campaignType, campaignType),
            eq(emailCampaigns.stage, stage),
            eq(emailCampaigns.journeyVariant, journeyVariant),
          ),
        )
        .limit(1);

      if (existingCampaign.length > 0) {
        logger.debug("Campaign already scheduled", {
          leadId,
          campaignType,
          stage,
          existingCampaignId: existingCampaign[0].id,
        });
        return existingCampaign[0].id;
      }

      const [campaign] = await db
        .insert(emailCampaigns)
        .values({
          leadId,
          campaignType,
          stage,
          journeyVariant,
          subject: `${journeyVariant}_${stage}`,
          templateName: `${journeyVariant}_${stage}`,
          scheduledAt,
          status: MessageStatus.PENDING,
          metadata,
        })
        .returning();

      return campaign.id;
    } catch (error) {
      logger.error("campaign.schedule.email.error", parseError(error));
      return null;
    }
  }

  /**
   * Schedule the next stage in the email sequence
   */
  async scheduleNextStage(
    leadId: string,
    campaignType: typeof CampaignTypeValue,
    currentStage: Exclude<
      typeof EmailCampaignStageValue,
      (typeof EmailCampaignStage)["NOT_STARTED"]
    >,
    journeyVariant: typeof EmailJourneyVariantValue,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      const rule = SCHEDULING_RULES[currentStage];
      if (!rule?.nextStage) {
        logger.info("campaign.schedule.next.no.next.stage", {
          leadId,
          currentStage,
        });
        return null;
      }

      const nextStage = rule.nextStage;
      const nextRule = SCHEDULING_RULES[nextStage];
      const nextScheduledAt = new Date(
        Date.now() + (nextRule?.delay ?? rule.delay),
      );

      return await this.scheduleEmail(
        {
          leadId,
          campaignType,
          journeyVariant,
          stage: nextStage,
          scheduledAt: nextScheduledAt,
        },
        logger,
      );
    } catch (error) {
      logger.error("campaign.schedule.next.error", parseError(error), {
        leadId,
        currentStage,
        journeyVariant,
      });
      return null;
    }
  }

  /**
   * Get pending emails ready to be sent.
   * Excludes emails for campaigns that have been halted (haltedAt is set).
   */
  async getPendingEmails(
    limit = 100,
    logger: EndpointLogger,
    journeyVariant?: typeof EmailJourneyVariantValue,
  ): Promise<
    Array<{
      id: string;
      leadId: string;
      campaignType: typeof CampaignTypeValue;
      stage: typeof EmailCampaignStageValue;
      journeyVariant: typeof EmailJourneyVariantValue;
      scheduledAt: Date;
      retryCount: number;
      lead: {
        id: string;
        email: string;
        businessName: string | null;
        status: (typeof LeadStatus)[keyof typeof LeadStatus];
      };
    }>
  > {
    try {
      const now = new Date();

      const pendingCampaigns = await db
        .select({
          id: emailCampaigns.id,
          leadId: emailCampaigns.leadId,
          campaignType: emailCampaigns.campaignType,
          stage: emailCampaigns.stage,
          journeyVariant: emailCampaigns.journeyVariant,
          scheduledAt: emailCampaigns.scheduledAt,
          retryCount: emailCampaigns.retryCount,
          lead: leads,
          userEmail: users.email,
        })
        .from(emailCampaigns)
        .innerJoin(leads, eq(emailCampaigns.leadId, leads.id))
        .leftJoin(users, eq(leads.convertedUserId, users.id))
        .where(
          and(
            eq(emailCampaigns.status, MessageStatus.PENDING),
            lt(emailCampaigns.scheduledAt, now),
            ...(journeyVariant
              ? [eq(emailCampaigns.journeyVariant, journeyVariant)]
              : []),
            isNull(emailCampaigns.sentAt),
            // Lead or linked user must have an email
            or(isNotNull(leads.email), isNotNull(users.email)),
            // Exclude converted leads from cold campaigns only;
            // post-conversion campaigns and newsletters target converted users
            or(
              isNull(leads.convertedAt),
              inArray(emailCampaigns.campaignType, [
                CampaignType.SIGNUP_NURTURE,
                CampaignType.RETENTION,
                CampaignType.WINBACK,
                CampaignType.NEWSLETTER,
              ]),
            ),
            // Suppress bounced, unsubscribed, and invalid leads
            notInArray(leads.status, [
              LeadStatus.BOUNCED,
              LeadStatus.UNSUBSCRIBED,
              LeadStatus.INVALID,
            ]),
          ),
        )
        .orderBy(emailCampaigns.scheduledAt)
        .limit(limit);

      const variantCounts: Record<string, number> = {};
      for (const c of pendingCampaigns) {
        variantCounts[c.journeyVariant] =
          (variantCounts[c.journeyVariant] ?? 0) + 1;
      }
      logger.debug(`Pending emails: ${pendingCampaigns.length}/${limit}`, {
        variantCounts,
      });

      return pendingCampaigns.map((campaign) => ({
        id: campaign.id,
        leadId: campaign.leadId,
        campaignType: campaign.campaignType,
        stage: campaign.stage,
        journeyVariant: campaign.journeyVariant,
        scheduledAt: campaign.scheduledAt,
        retryCount: campaign.retryCount,
        lead: {
          id: campaign.lead.id,
          email: campaign.lead.email ?? campaign.userEmail ?? "",
          businessName: campaign.lead.businessName,
          status: campaign.lead.status,
        },
      }));
    } catch (error) {
      logger.error("campaign.pending.emails.error", parseError(error));
      return [];
    }
  }

  /**
   * Mark email as sent
   */
  async markEmailAsSent(
    campaignId: string,
    logger: EndpointLogger,
    emailProvider: typeof EmailProviderValue,
    externalId: string | null = null,
    smtpAccountId: string | null = null,
  ): Promise<boolean> {
    try {
      const now = new Date();

      const [sent] = await db
        .update(emailCampaigns)
        .set({
          status: MessageStatus.SENT,
          sentAt: now,
          externalId,
          emailProvider,
          smtpAccountId,
        })
        .where(eq(emailCampaigns.id, campaignId))
        .returning({
          leadId: emailCampaigns.leadId,
          stage: emailCampaigns.stage,
        });

      // Advance lead's campaign stage and lastEmailSentAt
      if (sent) {
        await db
          .update(leads)
          .set({
            currentCampaignStage: sent.stage,
            lastEmailSentAt: now,
            emailsSent: sql`${leads.emailsSent} + 1`,
            updatedAt: now,
          })
          .where(eq(leads.id, sent.leadId));
      }

      logger.info("campaign.mark.email.sent", {
        campaignId,
        externalId,
        emailProvider,
      });

      return true;
    } catch (error) {
      logger.error("campaign.mark.email.sent.error", parseError(error), {
        campaignId,
      });
      return false;
    }
  }

  /**
   * Halt a campaign for a lead.
   * Marks the lead_campaigns row as halted and cancels all pending email sends
   * for that campaign type. If no campaignType is given, halts all campaigns.
   * Does NOT require a TFunction - safe to call from any server context.
   */
  async haltCampaign(
    leadId: string,
    logger: EndpointLogger,
    options: {
      campaignType?: typeof CampaignTypeValue;
      reason?: string;
    } = {},
  ): Promise<number> {
    try {
      const now = new Date();
      const { campaignType, reason = "system_halt" } = options;

      // Cancel pending email sends for the lead (filtered by campaignType if provided)
      const emailConditions = campaignType
        ? and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.campaignType, campaignType),
            eq(emailCampaigns.status, MessageStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          )
        : and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.status, MessageStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          );

      const result = await db
        .update(emailCampaigns)
        .set({
          status: MessageStatus.FAILED,
          error: reason,
          updatedAt: now,
        })
        .where(emailConditions);

      const cancelledCount = result.rowCount ?? 0;
      logger.debug("campaign.halt", {
        leadId,
        campaignType: campaignType ?? "all",
        reason,
        cancelledEmails: cancelledCount,
      });

      return cancelledCount;
    } catch (error) {
      logger.error("campaign.halt.error", parseError(error), { leadId });
      return 0;
    }
  }

  /**
   * Halt campaigns based on a lead status transition.
   * Spec halting rules:
   * → NEWSLETTER_SUBSCRIBER:  halt LEAD_CAMPAIGN
   * → SIGNED_UP:              halt LEAD_CAMPAIGN + NEWSLETTER
   * → SUBSCRIPTION_CONFIRMED: halt SIGNUP_NURTURE
   * → SIGNED_UP (churn):      halt RETENTION  (caller must pass reason="churn")
   * → UNSUBSCRIBED/BOUNCED/INVALID: halt all
   */
  async haltCampaignsForStatusChange(
    leadId: string,
    newStatus: (typeof LeadStatus)[keyof typeof LeadStatus],
    logger: EndpointLogger,
    options: { churn?: boolean } = {},
  ): Promise<void> {
    const haltTargets: Array<typeof CampaignTypeValue | undefined> = [];

    switch (newStatus) {
      case LeadStatus.NEWSLETTER_SUBSCRIBER:
        haltTargets.push(CampaignType.LEAD_CAMPAIGN);
        break;
      case LeadStatus.SIGNED_UP:
        if (options.churn) {
          haltTargets.push(CampaignType.RETENTION);
        } else {
          haltTargets.push(CampaignType.LEAD_CAMPAIGN, CampaignType.NEWSLETTER);
        }
        break;
      case LeadStatus.SUBSCRIPTION_CONFIRMED:
        haltTargets.push(CampaignType.SIGNUP_NURTURE);
        break;
      case LeadStatus.UNSUBSCRIBED:
      case LeadStatus.BOUNCED:
      case LeadStatus.INVALID:
        // halt all - pass undefined to haltCampaign
        haltTargets.push(undefined);
        break;
      default:
        return;
    }

    for (const campaignType of haltTargets) {
      await this.haltCampaign(leadId, logger, {
        campaignType,
        reason: `status_change:${newStatus}`,
      });
    }

    // Enqueue the next campaign per spec halting table
    let nextCampaignType: typeof CampaignTypeValue | null = null;
    switch (newStatus) {
      case LeadStatus.NEWSLETTER_SUBSCRIBER:
        nextCampaignType = CampaignType.NEWSLETTER;
        break;
      case LeadStatus.SIGNED_UP:
        nextCampaignType = options.churn
          ? CampaignType.WINBACK
          : CampaignType.SIGNUP_NURTURE;
        break;
      case LeadStatus.SUBSCRIPTION_CONFIRMED:
        nextCampaignType = CampaignType.RETENTION;
        break;
    }

    if (nextCampaignType) {
      await this.scheduleInitialCampaign(
        leadId,
        { campaignType: nextCampaignType },
        logger,
      );
    }
  }

  /**
   * Schedule a retry for a failed email send with exponential backoff.
   * Retry delays: retry 1 = 1h, retry 2 = 4h, retry 3 = 24h.
   * After 3 retries, marks the campaign as permanently FAILED.
   * Returns true if retry was scheduled, false if max retries exceeded.
   */
  async scheduleRetry(
    campaignId: string,
    currentRetryCount: number,
    errorMessage: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    const MAX_RETRIES = 3;
    const RETRY_DELAYS_MS = [
      1 * 60 * 60 * 1000, // 1 hour
      4 * 60 * 60 * 1000, // 4 hours
      24 * 60 * 60 * 1000, // 24 hours
    ];

    try {
      if (currentRetryCount >= MAX_RETRIES) {
        // Mark as permanently failed
        await db
          .update(emailCampaigns)
          .set({
            status: MessageStatus.FAILED,
            error: `Max retries exceeded. Last error: ${errorMessage}`,
            updatedAt: new Date(),
          })
          .where(eq(emailCampaigns.id, campaignId));

        logger.warn("campaign.retry.max_retries_exceeded", {
          campaignId,
          retryCount: currentRetryCount,
        });
        return false;
      }

      const delayMs =
        RETRY_DELAYS_MS[currentRetryCount] ??
        RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]!;
      const nextScheduledAt = new Date(Date.now() + delayMs);
      const nextRetryCount = currentRetryCount + 1;

      await db
        .update(emailCampaigns)
        .set({
          scheduledAt: nextScheduledAt,
          retryCount: nextRetryCount,
          error: errorMessage,
          updatedAt: new Date(),
        })
        .where(eq(emailCampaigns.id, campaignId));

      logger.info("campaign.retry.scheduled", {
        campaignId,
        retryCount: nextRetryCount,
        nextScheduledAt: nextScheduledAt.toISOString(),
      });
      return true;
    } catch (error) {
      logger.error("campaign.retry.schedule.error", parseError(error), {
        campaignId,
      });
      return false;
    }
  }

  /**
   * @deprecated Use haltCampaign instead.
   * Kept for any callers that still use TFunction-based cancellation.
   */
  async cancelScheduledEmails(
    leadId: string,
    logger: EndpointLogger,
    reason: string | null = null,
  ): Promise<number> {
    return this.haltCampaign(leadId, logger, { reason: reason ?? undefined });
  }

  /**
   * Every email that must never receive marketing mail (lowercased): newsletter
   * opt-outs / bounces / complaints, and leads that are bounced, unsubscribed,
   * invalid or carry an unsubscribedAt stamp. Checked by address, not by the
   * lead a campaign row happens to point at, so an opt-out recorded on any row
   * for that address wins.
   */
  private async getSuppressedEmails(): Promise<Set<string>> {
    const [optOuts, badLeads] = await Promise.all([
      db
        .select({ email: newsletterSubscriptions.email })
        .from(newsletterSubscriptions)
        .where(
          inArray(newsletterSubscriptions.status, [
            NewsletterSubscriptionStatus.UNSUBSCRIBED,
            NewsletterSubscriptionStatus.BOUNCED,
            NewsletterSubscriptionStatus.COMPLAINED,
          ]),
        ),
      db
        .select({ email: leads.email })
        .from(leads)
        .where(
          and(
            isNotNull(leads.email),
            or(
              inArray(leads.status, [
                LeadStatus.BOUNCED,
                LeadStatus.UNSUBSCRIBED,
                LeadStatus.INVALID,
              ]),
              isNotNull(leads.unsubscribedAt),
            ),
          ),
        ),
    ]);
    const suppressed = new Set<string>();
    for (const row of [...optOuts, ...badLeads]) {
      if (row.email) {
        suppressed.add(row.email.trim().toLowerCase());
      }
    }
    return suppressed;
  }

  /**
   * The consented newsletter audience. A recipient qualifies through either
   * consent record, and only with a confirmed address:
   * - account holder: users.marketing_consent AND users.email_verified, or
   * - newsletter double opt-in: newsletter_subscriptions SUBSCRIBED AND
   *   confirmed_at set AND marketing_consent.
   * Anyone in {@link getSuppressedEmails} is removed. Deduplicated by
   * lowercased email; the account row wins (carries userId + locale).
   */
  async getConsentedNewsletterAudience(): Promise<
    Array<{
      email: string;
      userId: string | null;
      subscriptionLeadId: string | null;
      locale: CountryLanguage | null;
    }>
  > {
    const [accountHolders, confirmedSubscribers, suppressed] =
      await Promise.all([
        db
          .select({ id: users.id, email: users.email, locale: users.locale })
          .from(users)
          .where(
            and(
              eq(users.marketingConsent, true),
              eq(users.emailVerified, true),
              isNotNull(users.email),
            ),
          ),
        db
          .select({
            email: newsletterSubscriptions.email,
            userId: newsletterSubscriptions.userId,
            leadId: newsletterSubscriptions.leadId,
          })
          .from(newsletterSubscriptions)
          .where(
            and(
              eq(
                newsletterSubscriptions.status,
                NewsletterSubscriptionStatus.SUBSCRIBED,
              ),
              isNotNull(newsletterSubscriptions.confirmedAt),
              eq(newsletterSubscriptions.marketingConsent, true),
            ),
          ),
        this.getSuppressedEmails(),
      ]);

    const audience = new Map<
      string,
      {
        email: string;
        userId: string | null;
        subscriptionLeadId: string | null;
        locale: CountryLanguage | null;
      }
    >();
    for (const user of accountHolders) {
      const key = user.email.trim().toLowerCase();
      if (!suppressed.has(key) && !audience.has(key)) {
        audience.set(key, {
          email: user.email,
          userId: user.id,
          subscriptionLeadId: null,
          locale: user.locale,
        });
      }
    }
    for (const sub of confirmedSubscribers) {
      const key = sub.email.trim().toLowerCase();
      if (suppressed.has(key)) {
        continue;
      }
      const existing = audience.get(key);
      if (existing) {
        existing.subscriptionLeadId = sub.leadId;
        continue;
      }
      audience.set(key, {
        email: sub.email,
        userId: sub.userId,
        subscriptionLeadId: sub.leadId,
        locale: null,
      });
    }
    return [...audience.values()];
  }

  /**
   * Send-time consent gate for NEWSLETTER campaign rows. Re-evaluated right
   * before each send so a row enqueued under an older/looser gate (or whose
   * recipient opted out since) is never mailed.
   */
  async isConsentedNewsletterRecipient(email: string): Promise<boolean> {
    const key = email.trim().toLowerCase();
    const audience = await this.getConsentedNewsletterAudience();
    return audience.some((r) => r.email.trim().toLowerCase() === key);
  }

  /**
   * Bootstrap a consent-filtered one-off newsletter blast.
   *
   * Audience: {@link getConsentedNewsletterAudience} (verified account holders
   * with marketing consent, plus confirmed double-opt-in subscribers, minus
   * every opt-out / bounce / invalid address).
   *
   * For a recipient without a lead row yet, one is created so the campaign row
   * has an owner.
   *
   * Pending rows of this variant whose recipient is NOT in the audience (e.g.
   * enqueued under an older, looser gate) are cancelled (status FAILED,
   * error "consent_gate:not_in_audience").
   *
   * Idempotent: skips any (lead, variant) that already has a campaign row, so
   * running it twice never double-sends. dryRun writes nothing and reports what
   * a real run would do, including `byLocale`: the locale each recipient will
   * be mailed in (lead language-country, as the dispatcher resolves it).
   */
  async bootstrapConsentedNewsletterBlast(
    journeyVariant: typeof EmailJourneyVariantValue,
    logger: EndpointLogger,
    options: { dryRun?: boolean } = {},
  ): Promise<{
    audience: number;
    scheduled: number;
    alreadyPending: number;
    skipped: number;
    cancelled: number;
    errors: number;
    byLocale: Record<string, number>;
  }> {
    const dryRun = options.dryRun ?? false;
    const byLocale: Record<string, number> = {};
    const result = {
      audience: 0,
      scheduled: 0,
      alreadyPending: 0,
      skipped: 0,
      cancelled: 0,
      errors: 0,
      byLocale,
    };
    const countLocale = (locale: CountryLanguage): void => {
      result.byLocale[locale] = (result.byLocale[locale] ?? 0) + 1;
    };

    try {
      const audience = await this.getConsentedNewsletterAudience();
      result.audience = audience.length;
      const audienceEmails = new Set(
        audience.map((r) => r.email.trim().toLowerCase()),
      );

      logger.info("newsletter.blast.consented.start", {
        journeyVariant,
        audience: audience.length,
        dryRun,
      });

      // 1. Cancel pending rows of this variant that are outside the audience.
      const pendingRows = await db
        .select({
          id: emailCampaigns.id,
          leadEmail: leads.email,
          userEmail: users.email,
        })
        .from(emailCampaigns)
        .innerJoin(leads, eq(emailCampaigns.leadId, leads.id))
        .leftJoin(users, eq(leads.convertedUserId, users.id))
        .where(
          and(
            eq(emailCampaigns.journeyVariant, journeyVariant),
            eq(emailCampaigns.status, MessageStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          ),
        );
      const staleIds = pendingRows
        .filter((row) => {
          const email = (row.leadEmail ?? row.userEmail ?? "")
            .trim()
            .toLowerCase();
          return !email || !audienceEmails.has(email);
        })
        .map((row) => row.id);
      result.cancelled = staleIds.length;
      if (!dryRun && staleIds.length > 0) {
        await db
          .update(emailCampaigns)
          .set({
            status: MessageStatus.FAILED,
            error: "consent_gate:not_in_audience",
            updatedAt: new Date(),
          })
          .where(inArray(emailCampaigns.id, staleIds));
      }

      // 2. Enqueue everyone in the audience who has no row for this variant.
      for (const recipient of audience) {
        try {
          let leadRow:
            | {
                id: string;
                language: Languages;
                country: Countries;
              }
            | undefined;
          const leadCols = {
            id: leads.id,
            language: leads.language,
            country: leads.country,
          };

          if (recipient.userId) {
            [leadRow] = await db
              .select(leadCols)
              .from(leads)
              .where(eq(leads.convertedUserId, recipient.userId))
              .limit(1);
          }
          if (!leadRow && recipient.subscriptionLeadId) {
            [leadRow] = await db
              .select(leadCols)
              .from(leads)
              .where(eq(leads.id, recipient.subscriptionLeadId))
              .limit(1);
          }
          if (!leadRow) {
            [leadRow] = await db
              .select(leadCols)
              .from(leads)
              .where(eq(leads.email, recipient.email))
              .limit(1);
          }

          const fallback = getLanguageAndCountryFromLocale(
            recipient.locale ?? defaultLocale,
          );

          if (!leadRow) {
            if (dryRun) {
              result.scheduled++;
              countLocale(
                getLocaleFromLanguageAndCountry(
                  fallback.language,
                  fallback.country,
                ),
              );
              continue;
            }
            const now = new Date();
            const [newLead] = await db
              .insert(leads)
              .values({
                email: recipient.email,
                businessName: "",
                convertedUserId: recipient.userId,
                language: fallback.language,
                country: fallback.country,
                status: recipient.userId
                  ? LeadStatus.SIGNED_UP
                  : LeadStatus.NEWSLETTER_SUBSCRIBER,
                source: LeadSource.WEBSITE,
                signedUpAt: recipient.userId ? now : null,
                convertedAt: recipient.userId ? now : null,
              })
              .onConflictDoNothing()
              .returning(leadCols);
            leadRow =
              newLead ??
              (
                await db
                  .select(leadCols)
                  .from(leads)
                  .where(eq(leads.email, recipient.email))
                  .limit(1)
              )[0];
          }

          if (!leadRow) {
            logger.error("newsletter.blast.consented.lead_create_failed", {
              userId: recipient.userId,
            });
            result.errors++;
            continue;
          }

          const recipientLocale = getLocaleFromLanguageAndCountry(
            leadRow.language,
            leadRow.country,
          );

          // Idempotency: any live row (pending or sent) blocks a second one.
          // FAILED rows never went out (halted, consent-gated, retries
          // exhausted), so a recipient who qualifies now is enqueued again.
          const [existing] = await db
            .select({ id: emailCampaigns.id, status: emailCampaigns.status })
            .from(emailCampaigns)
            .where(
              and(
                eq(emailCampaigns.leadId, leadRow.id),
                eq(emailCampaigns.journeyVariant, journeyVariant),
                ne(emailCampaigns.status, MessageStatus.FAILED),
              ),
            )
            .limit(1);

          if (existing) {
            if (existing.status === MessageStatus.PENDING) {
              result.alreadyPending++;
              countLocale(recipientLocale);
            } else {
              result.skipped++;
            }
            continue;
          }

          if (dryRun) {
            result.scheduled++;
            countLocale(recipientLocale);
            continue;
          }

          const campaignId = await this.scheduleEmail(
            {
              leadId: leadRow.id,
              campaignType: CampaignType.NEWSLETTER,
              journeyVariant,
              stage: EmailCampaignStage.INITIAL,
              scheduledAt: new Date(),
            },
            logger,
          );

          if (campaignId) {
            result.scheduled++;
            countLocale(recipientLocale);
          } else {
            result.errors++;
          }
        } catch (error) {
          logger.error("newsletter.blast.consented.error", parseError(error), {
            userId: recipient.userId,
          });
          result.errors++;
        }
      }

      logger.info("newsletter.blast.consented.done", {
        journeyVariant,
        dryRun,
        ...result,
      });

      return result;
    } catch (error) {
      logger.error(
        "newsletter.blast.consented.bootstrap.error",
        parseError(error),
      );
      result.errors++;
      return result;
    }
  }

  /**
   * Get campaign statistics
   * Optimized to use a single query with conditional aggregation
   */
  async getCampaignStats(
    logger: EndpointLogger,
    journeyVariant: typeof EmailJourneyVariantValue | null = null,
  ): Promise<{
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  }> {
    try {
      // Use SQL conditional aggregation for efficient counting in a single query
      const stats = await db
        .select({
          total: count(),
          pending: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.PENDING} then 1 end)`,
          sent: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.SENT} then 1 end)`,
          delivered: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.DELIVERED} then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.OPENED} then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.FAILED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(
          journeyVariant
            ? eq(emailCampaigns.journeyVariant, journeyVariant)
            : undefined,
        );

      const result = stats[0] || {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
      };

      logger.debug("Campaign stats retrieved", {
        journeyVariant,
        ...result,
      });

      return result;
    } catch (error) {
      logger.error("campaign.stats.error", parseError(error));
      return {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
      };
    }
  }
}

/**
 * Default Campaign Scheduler Service Instance
 */
export const campaignSchedulerService = new CampaignSchedulerService();
