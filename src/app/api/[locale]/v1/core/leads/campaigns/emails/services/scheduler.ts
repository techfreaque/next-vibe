/**
 * Campaign Scheduler Service
 * Handles email campaign scheduling and automation
 */

import { and, count, eq, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { TFunction } from "@/i18n/core/static-types";

import { emailCampaigns, leads } from "../../../db";
import type { EmailJourneyVariant, EmailProvider } from "../../../enum";
import { EmailCampaignStage, EmailStatus, LeadStatus } from "../../../enum";
import type { CampaignSchedulingOptions } from "../types";
import { abTestingService } from "./ab-testing";

// Type aliases for enum values
type EmailCampaignStageValues =
  (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
type EmailJourneyVariantValues =
  (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant];
type EmailProviderValues = (typeof EmailProvider)[keyof typeof EmailProvider];

/**
 * Campaign Scheduling Rules
 * Defines timing between email stages
 */
const SCHEDULING_RULES: {
  [stage in Exclude<
    EmailCampaignStageValues,
    (typeof EmailCampaignStage)["NOT_STARTED"]
  >]: {
    delay: number; // In milliseconds
    nextStage: EmailCampaignStageValues | null;
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
   * Check if lead is eligible for email campaigns
   * Leads are ineligible if they are converted, unsubscribed, or have invalid status
   */
  private isLeadEligibleForCampaign(lead: typeof leads.$inferSelect): boolean {
    const ineligibleStatuses: Array<
      (typeof LeadStatus)[keyof typeof LeadStatus]
    > = [
      LeadStatus.UNSUBSCRIBED,
      LeadStatus.SIGNED_UP,
      LeadStatus.CONSULTATION_BOOKED,
      LeadStatus.SUBSCRIPTION_CONFIRMED,
      LeadStatus.BOUNCED,
      LeadStatus.INVALID,
      LeadStatus.PENDING,
    ];

    return (
      !ineligibleStatuses.includes(lead.status) &&
      !lead.convertedAt &&
      !lead.signedUpAt &&
      !lead.consultationBookedAt &&
      !lead.subscriptionConfirmedAt
    );
  }

  /**
   * Schedule initial email campaign for a new lead
   */
  async scheduleInitialCampaign(
    leadId: string,
    options: {
      journeyVariant?: EmailJourneyVariantValues;
      priority?: "low" | "normal" | "high";
      metadata?: Record<string, string | number | boolean>;
    } = {},
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      logger.info("campaign.schedule.initial.start", { leadId, options });

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

      // Check if lead is eligible for campaigns
      if (!this.isLeadEligibleForCampaign(lead)) {
        logger.info("campaign.schedule.initial.skip.ineligible", {
          leadId,
          status: lead.status,
          convertedAt: lead.convertedAt?.toISOString() || null,
        });
        return null;
      }

      // Assign journey variant using A/B testing
      const journeyVariant =
        options.journeyVariant ||
        abTestingService.assignJourneyVariant(leadId, logger, {
          country: lead.country || undefined,
          source: lead.source || undefined,
        });

      // Update lead with assigned journey variant
      await db
        .update(leads)
        .set({
          emailJourneyVariant: journeyVariant,
          currentCampaignStage: EmailCampaignStage.INITIAL,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId));

      // Schedule initial email
      const campaignId = await this.scheduleEmail(
        {
          leadId,
          journeyVariant,
          stage: EmailCampaignStage.INITIAL,
          scheduledAt: new Date(), // Send immediately
          metadata: options.metadata,
        },
        logger,
      );

      if (campaignId) {
        // Schedule next stage
        await this.scheduleNextStage(
          leadId,
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
        journeyVariant,
        stage,
        scheduledAt,
        metadata = {},
      } = options;

      // Check if email already scheduled for this stage
      const existingCampaign = await db
        .select()
        .from(emailCampaigns)
        .where(
          and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.stage, stage),
            eq(emailCampaigns.journeyVariant, journeyVariant),
          ),
        )
        .limit(1);

      if (existingCampaign.length > 0) {
        logger.info("campaign.schedule.email.already.scheduled", {
          leadId,
          stage,
          existingCampaignId: existingCampaign[0].id,
        });
        return existingCampaign[0].id;
      }

      // Create email campaign record
      // Note: subject will be updated when email is rendered and sent
      const [campaign] = await db
        .insert(emailCampaigns)
        .values({
          leadId,
          stage,
          journeyVariant,
          // Use template name as temporary subject - will be replaced with actual subject when rendered
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
    currentStage: Exclude<
      EmailCampaignStageValues,
      (typeof EmailCampaignStage)["NOT_STARTED"]
    >,
    journeyVariant: EmailJourneyVariantValues,
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

      const nextScheduledAt = new Date(Date.now() + rule.delay);

      return await this.scheduleEmail(
        {
          leadId,
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
   * Get pending emails ready to be sent
   */
  async getPendingEmails(
    limit = 100,
    logger: EndpointLogger,
  ): Promise<
    Array<{
      id: string;
      leadId: string;
      stage: EmailCampaignStageValues;
      journeyVariant: EmailJourneyVariantValues;
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
            // Only send to leads with running campaigns (after campaign starter)
            eq(leads.status, LeadStatus.CAMPAIGN_RUNNING),
            // Exclude converted leads
            isNull(leads.convertedAt),
            // Only process leads with email addresses
            isNotNull(leads.email),
          ),
        )
        .orderBy(emailCampaigns.scheduledAt)
        .limit(limit);

      logger.info("campaign.pending.emails.retrieved", {
        count: pendingCampaigns.length,
        limit,
      });

      return pendingCampaigns.map((campaign) => ({
        id: campaign.id,
        leadId: campaign.leadId,
        stage: campaign.stage as EmailCampaignStageValues,
        journeyVariant: campaign.journeyVariant as EmailJourneyVariantValues,
        scheduledAt: campaign.scheduledAt,
        lead: {
          id: campaign.lead.id,
          email: campaign.lead.email!, // We filtered for isNotNull(leads.email) above
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
    emailProvider: EmailProviderValues,
    externalId: string | null = null,
  ): Promise<boolean> {
    try {
      await db
        .update(emailCampaigns)
        .set({
          status: EmailStatus.SENT,
          sentAt: new Date(),
          externalId,
          emailProvider,
        })
        .where(eq(emailCampaigns.id, campaignId));

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
   * Cancel scheduled emails for a lead
   */
  async cancelScheduledEmails(
    leadId: string,
    t: TFunction,
    logger: EndpointLogger,
    reason: string | null = null,
  ): Promise<number> {
    try {
      const result = await db
        .update(emailCampaigns)
        .set({
          status: EmailStatus.FAILED,
          metadata: {
            cancelReason:
              reason ||
              t(
                "app.api.v1.core.leads.campaigns.emails.services.scheduler.cancelledBySystem",
              ),
          },
        })
        .where(
          and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.status, EmailStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          ),
        );

      logger.info("campaign.cancel.scheduled.emails", {
        leadId,
        reason,
        cancelledCount: result.rowCount || 0,
      });

      return result.rowCount || 0;
    } catch (error) {
      logger.error(
        "campaign.cancel.scheduled.emails.error",
        parseError(error),
        {
          leadId,
        },
      );
      return 0;
    }
  }

  /**
   * Get campaign statistics
   * Optimized to use a single query with conditional aggregation
   */
  async getCampaignStats(
    logger: EndpointLogger,
    journeyVariant: EmailJourneyVariantValues | null = null,
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
