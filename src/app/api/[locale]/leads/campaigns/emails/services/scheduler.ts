/**
 * Campaign Scheduler Service
 * Handles email campaign scheduling and automation
 */

import { and, count, eq, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { EmailStatus } from "../../../../emails/messages/enum";
import {
  CampaignType,
  type CampaignTypeValue,
} from "../../../../emails/smtp-client/enum";
import { emailCampaigns, leads } from "../../../db";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
  EmailProviderValues,
} from "../../../enum";
import { EmailCampaignStage, LeadStatus } from "../../../enum";
import type { CampaignSchedulingOptions } from "../types";
import { abTestingService } from "./ab-testing";

/**
 * Campaign Scheduling Rules
 * Defines timing between email stages
 */
type SchedulableStage = Exclude<
  typeof EmailCampaignStageValues,
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
      journeyVariant?: typeof EmailJourneyVariantValues;
      priority?: "low" | "normal" | "high";
      metadata?: Record<string, string | number | boolean>;
    } = {},
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      const campaignType = options.campaignType ?? CampaignType.LEAD_CAMPAIGN;
      logger.info("campaign.schedule.initial.start", {
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
        logger.info("campaign.schedule.initial.skip.ineligible", {
          leadId,
          status: lead.status,
          convertedAt: lead.convertedAt?.toISOString() || null,
        });
        return null;
      }

      // Assign journey variant using A/B testing (only meaningful for COLD campaigns)
      const journeyVariant =
        options.journeyVariant ||
        abTestingService.assignJourneyVariant(leadId, logger, {
          country: lead.country || undefined,
          source: lead.source || undefined,
        });

      // Upsert lead_campaigns row — one row per lead+campaignType
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
        logger.info("campaign.schedule.email.already.scheduled", {
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
          status: EmailStatus.PENDING,
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
    currentStage: SchedulableStage,
    journeyVariant: typeof EmailJourneyVariantValues,
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

      const nextRule = SCHEDULING_RULES[rule.nextStage];
      const nextScheduledAt = new Date(
        Date.now() + (nextRule?.delay ?? rule.delay),
      );

      return await this.scheduleEmail(
        {
          leadId,
          campaignType,
          journeyVariant,
          stage: rule.nextStage,
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
  ): Promise<
    Array<{
      id: string;
      leadId: string;
      campaignType: typeof CampaignTypeValue;
      stage: typeof EmailCampaignStageValues;
      journeyVariant: typeof EmailJourneyVariantValues;
      scheduledAt: Date;
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
          lead: leads,
        })
        .from(emailCampaigns)
        .innerJoin(leads, eq(emailCampaigns.leadId, leads.id))
        .where(
          and(
            eq(emailCampaigns.status, EmailStatus.PENDING),
            lt(emailCampaigns.scheduledAt, now),
            isNull(emailCampaigns.sentAt),
            // Only process leads with email addresses
            isNotNull(leads.email),
            // Exclude converted leads
            isNull(leads.convertedAt),
          ),
        )
        .orderBy(emailCampaigns.scheduledAt)
        .limit(limit);

      logger.debug(`Pending emails: ${pendingCampaigns.length}/${limit}`);

      return pendingCampaigns.map((campaign) => ({
        id: campaign.id,
        leadId: campaign.leadId,
        campaignType: campaign.campaignType,
        stage: campaign.stage,
        journeyVariant: campaign.journeyVariant,
        scheduledAt: campaign.scheduledAt,
        lead: {
          id: campaign.lead.id,
          email: campaign.lead.email!,
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
    emailProvider: typeof EmailProviderValues,
    externalId: string | null = null,
    smtpAccountId: string | null = null,
  ): Promise<boolean> {
    try {
      const now = new Date();

      const [sent] = await db
        .update(emailCampaigns)
        .set({
          status: EmailStatus.SENT,
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
   * Does NOT require a TFunction — safe to call from any server context.
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
            eq(emailCampaigns.status, EmailStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          )
        : and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.status, EmailStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          );

      const result = await db
        .update(emailCampaigns)
        .set({
          status: EmailStatus.FAILED,
          error: reason,
          updatedAt: now,
        })
        .where(emailConditions);

      const cancelledCount = result.rowCount ?? 0;
      logger.info("campaign.halt", {
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
        // halt all — pass undefined to haltCampaign
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
   * Get campaign statistics
   * Optimized to use a single query with conditional aggregation
   */
  async getCampaignStats(
    logger: EndpointLogger,
    journeyVariant: typeof EmailJourneyVariantValues | null = null,
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
          pending: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.PENDING} then 1 end)`,
          sent: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.SENT} then 1 end)`,
          delivered: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.DELIVERED} then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.OPENED} then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.FAILED} then 1 end)`,
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

      logger.info("campaign.stats.retrieved", {
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
