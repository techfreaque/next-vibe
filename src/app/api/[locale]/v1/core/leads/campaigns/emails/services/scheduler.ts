/**
 * Campaign Scheduler Service
 * Handles email campaign scheduling and automation
 */

import { and, count, eq, isNotNull, isNull, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TFunction } from "@/i18n/core/static-types";

import type { EmailProvider } from "../../../enum";
import { emailCampaigns, leads } from "../../../db";
import type { EmailJourneyVariant } from "../../../enum";
import { EmailCampaignStage, EmailStatus, LeadStatus } from "../../../enum";
import type { CampaignSchedulingOptions } from "../types";
import { abTestingService } from "./ab-testing";

/**
 * Campaign Scheduling Rules
 * Defines timing between email stages
 */
const SCHEDULING_RULES: {
  [stage in Exclude<EmailCampaignStage, EmailCampaignStage.NOT_STARTED>]: {
    delay: number; // In milliseconds
    nextStage: EmailCampaignStage | null;
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
   * Schedule initial email campaign for a new lead
   */
  async scheduleInitialCampaign(
    leadId: string,
    options: {
      journeyVariant?: EmailJourneyVariant;
      priority?: "low" | "normal" | "high";
      metadata?: Record<string, string | number | boolean>;
    } = {},
  ): Promise<string | null> {
    try {
      console.debug("Scheduling initial campaign", { leadId, options });

      // Get lead data
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (!lead) {
        console.error("Lead not found for campaign scheduling", { leadId });
        return null;
      }

      // Skip if lead is already unsubscribed or converted
      if (
        lead.status === LeadStatus.UNSUBSCRIBED ||
        lead.status === LeadStatus.SIGNED_UP ||
        lead.status === LeadStatus.CONSULTATION_BOOKED ||
        lead.status === LeadStatus.SUBSCRIPTION_CONFIRMED ||
        lead.status === LeadStatus.BOUNCED ||
        lead.status === LeadStatus.INVALID ||
        lead.status === LeadStatus.PENDING ||
        lead.convertedAt ||
        lead.signedUpAt ||
        lead.consultationBookedAt ||
        lead.subscriptionConfirmedAt
      ) {
        console.debug("Skipping campaign for unsubscribed/converted lead", {
          leadId,
          status: lead.status,
          convertedAt: lead.convertedAt,
        });
        return null;
      }

      // Assign journey variant using A/B testing
      const journeyVariant =
        options.journeyVariant ||
        abTestingService.assignJourneyVariant(leadId, {
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
      const campaignId = await this.scheduleEmail({
        leadId,
        journeyVariant,
        stage: EmailCampaignStage.INITIAL,
        scheduledAt: new Date(), // Send immediately
        metadata: options.metadata,
      });

      if (campaignId) {
        // Schedule next stage
        await this.scheduleNextStage(
          leadId,
          EmailCampaignStage.INITIAL,
          journeyVariant,
        );
      }

      return campaignId;
    } catch (error) {
      console.error("Error scheduling initial campaign", error, { leadId });
      return null;
    }
  }

  /**
   * Schedule a specific email
   */
  async scheduleEmail(
    options: CampaignSchedulingOptions,
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
        console.debug("Email already scheduled for this stage", {
          leadId,
          stage,
          existingCampaignId: existingCampaign[0].id,
        });
        return existingCampaign[0].id;
      }

      // Create email campaign record
      const [campaign] = await db
        .insert(emailCampaigns)
        .values({
          leadId,
          stage,
          journeyVariant,
          subject: `${stage} - ${journeyVariant}`, // Will be updated when email is rendered
          templateName: `${journeyVariant}_${stage}`,
          scheduledAt,
          status: EmailStatus.PENDING,
          metadata,
        })
        .returning();

      return campaign.id;
    } catch (error) {
      console.error("Error scheduling email", error, options);
      return null;
    }
  }

  /**
   * Schedule the next stage in the email sequence
   */
  async scheduleNextStage(
    leadId: string,
    currentStage: Exclude<EmailCampaignStage, EmailCampaignStage.NOT_STARTED>,
    journeyVariant: EmailJourneyVariant,
  ): Promise<string | null> {
    try {
      const rule = SCHEDULING_RULES[currentStage];
      if (!rule?.nextStage) {
        console.debug("No next stage to schedule", { leadId, currentStage });
        return null;
      }

      const nextScheduledAt = new Date(Date.now() + rule.delay);

      return await this.scheduleEmail({
        leadId,
        journeyVariant,
        stage: rule.nextStage,
        scheduledAt: nextScheduledAt,
      });
    } catch (error) {
      console.error("Error scheduling next stage", error, {
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
  async getPendingEmails(limit = 100): Promise<
    Array<{
      id: string;
      leadId: string;
      stage: EmailCampaignStage;
      journeyVariant: EmailJourneyVariant;
      scheduledAt: Date;
      lead: {
        id: string;
        email: string;
        businessName: string | null;
        status: LeadStatus;
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

      console.debug("Retrieved pending emails", {
        count: pendingCampaigns.length,
        limit,
      });

      return pendingCampaigns.map((campaign) => ({
        id: campaign.id,
        leadId: campaign.leadId,
        stage: campaign.stage as EmailCampaignStage,
        journeyVariant: campaign.journeyVariant as EmailJourneyVariant,
        scheduledAt: campaign.scheduledAt,
        lead: {
          id: campaign.lead.id,
          email: campaign.lead.email!, // We filtered for isNotNull(leads.email) above
          businessName: campaign.lead.businessName,
          status: campaign.lead.status,
        },
      }));
    } catch (error) {
      console.error("Error getting pending emails", error);
      return [];
    }
  }

  /**
   * Mark email as sent
   */
  async markEmailAsSent(
    campaignId: string,
    emailProvider: EmailProvider,
    externalId?: string,
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

      console.debug("Email marked as sent", {
        campaignId,
        externalId,
        emailProvider,
      });

      return true;
    } catch (error) {
      console.error("Error marking email as sent", error, { campaignId });
      return false;
    }
  }

  /**
   * Cancel scheduled emails for a lead
   */
  async cancelScheduledEmails(
    leadId: string,
    t: TFunction,
    reason?: string,
  ): Promise<number> {
    try {
      const result = await db
        .update(emailCampaigns)
        .set({
          status: EmailStatus.FAILED,
          metadata: {
            cancelReason:
              reason || t("email.leads.scheduler.cancelledBySystem"),
          },
        })
        .where(
          and(
            eq(emailCampaigns.leadId, leadId),
            eq(emailCampaigns.status, EmailStatus.PENDING),
            isNull(emailCampaigns.sentAt),
          ),
        );

      console.debug("Cancelled scheduled emails", {
        leadId,
        reason,
        cancelledCount: result.rowCount || 0,
      });

      return result.rowCount || 0;
    } catch (error) {
      console.error("Error cancelling scheduled emails", error, { leadId });
      return 0;
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(journeyVariant?: EmailJourneyVariant): Promise<{
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  }> {
    try {
      const whereConditions = journeyVariant
        ? [eq(emailCampaigns.journeyVariant, journeyVariant)]
        : [];

      // Get total campaigns
      const totalResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );

      // Get pending campaigns
      const pendingResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.PENDING),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.PENDING),
        );

      // Get sent campaigns
      const sentResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.SENT),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.SENT),
        );

      // Get delivered campaigns
      const deliveredResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.DELIVERED),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.DELIVERED),
        );

      // Get opened campaigns
      const openedResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.OPENED),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.OPENED),
        );

      // Get clicked campaigns
      const clickedResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.CLICKED),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.CLICKED),
        );

      // Get failed campaigns
      const failedResult = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          whereConditions.length > 0
            ? and(
                eq(emailCampaigns.status, EmailStatus.FAILED),
                ...whereConditions,
              )
            : eq(emailCampaigns.status, EmailStatus.FAILED),
        );

      return {
        total: totalResult[0]?.count || 0,
        pending: pendingResult[0]?.count || 0,
        sent: sentResult[0]?.count || 0,
        delivered: deliveredResult[0]?.count || 0,
        opened: openedResult[0]?.count || 0,
        clicked: clickedResult[0]?.count || 0,
        failed: failedResult[0]?.count || 0,
      };
    } catch (error) {
      console.error("Error getting campaign stats", error);
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
