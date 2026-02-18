/**
 * Email Campaigns Repository
 * Handles business logic for email campaign operations
 */

import "server-only";

import { render } from "@react-email/render";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { CampaignType } from "@/app/api/[locale]/emails/smtp-client/enum";
import { SmtpSendingRepository } from "@/app/api/[locale]/emails/smtp-client/sending/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { leads } from "../../db";
import type { EmailCampaignStage } from "../../enum";
import { EmailProvider, LeadStatus } from "../../enum";
import type { LeadWithEmailType } from "../../types";
import { emailRendererService } from "../emails/services/renderer";
import { campaignSchedulerService } from "../emails/services/scheduler";
import type { EmailCampaignResultType } from "./types";
import { createEmptyEmailCampaignResult } from "./types";

/**
 * Stage processing options
 */
interface StageProcessOptions {
  batchSize: number;
  dryRun: boolean;
}

/**
 * Email Campaigns Repository Interface
 */
export interface IEmailCampaignsRepository {
  bootstrapPendingLeads(
    batchSize: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;

  processStage(
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
    options: StageProcessOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignResultType>>;
}

/**
 * Email Campaigns Repository Implementation
 */
export class EmailCampaignsRepositoryImpl implements IEmailCampaignsRepository {
  /**
   * Bootstrap PENDING leads into active campaigns.
   * Finds leads with status=PENDING (set by campaign-starter) that don't yet
   * have an emailCampaigns entry, schedules their initial email, and transitions
   * them to CAMPAIGN_RUNNING.
   */
  async bootstrapPendingLeads(
    batchSize: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      // Find PENDING leads with email addresses that haven't been scheduled yet
      const pendingLeads = await db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.PENDING),
            isNotNull(leads.email),
            isNull(leads.convertedAt),
          ),
        )
        .limit(batchSize);

      logger.debug("Bootstrapping pending leads into campaigns", {
        count: pendingLeads.length,
      });

      let bootstrapped = 0;

      for (const lead of pendingLeads) {
        try {
          const campaignId =
            await campaignSchedulerService.scheduleInitialCampaign(
              lead.id,
              {},
              logger,
            );

          if (campaignId) {
            // Transition lead to CAMPAIGN_RUNNING
            await db
              .update(leads)
              .set({
                status: LeadStatus.CAMPAIGN_RUNNING,
                updatedAt: new Date(),
              })
              .where(eq(leads.id, lead.id));

            bootstrapped++;
            logger.debug("Bootstrapped lead into campaign", {
              leadId: lead.id,
              email: lead.email,
              campaignId,
            });
          }
        } catch (error) {
          logger.error("Failed to bootstrap lead into campaign", {
            leadId: lead.id,
            error: parseError(error).message,
          });
        }
      }

      logger.info("Pending leads bootstrapped", {
        bootstrapped,
        total: pendingLeads.length,
      });
      return success(bootstrapped);
    } catch (error) {
      logger.error("Failed to bootstrap pending leads", {
        error: parseError(error).message,
      });
      return fail({
        message:
          "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async processStage(
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
    options: StageProcessOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignResultType>> {
    try {
      logger.debug("Processing email campaign stage", {
        stage,
        batchSize: options.batchSize,
        dryRun: options.dryRun,
      });

      const result = createEmptyEmailCampaignResult();

      // Get all pending emails due for sending from the emailCampaigns scheduler table
      const pendingEmails = await campaignSchedulerService.getPendingEmails(
        options.batchSize,
        logger,
      );

      result.leadsProcessed = pendingEmails.length;

      if (pendingEmails.length === 0) {
        logger.debug("No pending emails found", { stage });
        return success(result);
      }

      // Process each scheduled email
      for (const campaign of pendingEmails) {
        try {
          if (options.dryRun) {
            logger.debug("Dry run - would send email", {
              campaignId: campaign.id,
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              journeyVariant: campaign.journeyVariant,
            });
            result.emailsScheduled++;
            continue;
          }

          // Fetch full lead record to get country + language for locale resolution
          const [fullLead] = await db
            .select()
            .from(leads)
            .where(eq(leads.id, campaign.leadId))
            .limit(1);

          if (!fullLead) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: "Lead not found",
            });
            continue;
          }

          // Build locale from lead's country + language
          const leadLocale =
            `${fullLead.country}-${fullLead.language}` as CountryLanguage;
          const { t } = simpleT(leadLocale);

          // Render the email template (returns JSX + subject)
          // fullLead.email is non-null here: getPendingEmails filters isNotNull(leads.email)
          const rendered = await emailRendererService.renderEmail(
            fullLead as LeadWithEmailType,
            campaign.journeyVariant,
            campaign.stage,
            {
              t,
              locale: leadLocale,
              companyName: "",
              companyEmail: "",
              campaignId: campaign.id,
              unsubscribeUrl: "",
              trackingUrl: "",
            },
            logger,
          );

          if (!rendered) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: "Template rendering failed",
            });
            continue;
          }

          // Convert JSX to HTML string for SMTP transport
          const html = await render(rendered.jsx);

          // Send via SMTP
          const sendResult = await SmtpSendingRepository.sendEmail(
            {
              to: campaign.lead.email,
              toName: campaign.lead.businessName || undefined,
              subject: rendered.subject,
              html,
              text: rendered.text,
              senderName: t("config.appName"),
              replyTo: contactClientRepository.getSupportEmail(leadLocale),
              selectionCriteria: {
                campaignType: CampaignType.LEAD_CAMPAIGN,
                emailJourneyVariant: campaign.journeyVariant,
                emailCampaignStage: campaign.stage,
                country: fullLead.country,
                language: fullLead.language,
              },
              leadId: campaign.leadId,
              campaignId: campaign.id,
            },
            logger,
          );

          if (!sendResult.success) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: sendResult.message,
            });
            logger.error("Failed to send campaign email", {
              campaignId: campaign.id,
              leadId: campaign.leadId,
              error: sendResult.message,
            });
            continue;
          }

          // Mark email as sent in the campaigns table
          await campaignSchedulerService.markEmailAsSent(
            campaign.id,
            logger,
            EmailProvider.SMTP,
            sendResult.data?.messageId ?? null,
          );

          result.emailsSent++;
          result.stageTransitions[campaign.stage] =
            (result.stageTransitions[campaign.stage] ?? 0) + 1;
        } catch (error) {
          result.emailsFailed++;
          result.errors.push({
            leadId: campaign.leadId,
            email: campaign.lead.email,
            stage: campaign.stage,
            error: parseError(error).message,
          });
          logger.error("Failed to process campaign email", {
            campaignId: campaign.id,
            leadId: campaign.leadId,
            error: parseError(error).message,
          });
        }
      }

      logger.debug("Stage processing completed", {
        stage,
        leadsProcessed: result.leadsProcessed,
        emailsSent: result.emailsSent,
        emailsFailed: result.emailsFailed,
      });

      return success(result);
    } catch (error) {
      logger.error("Failed to process stage", {
        stage,
        error: parseError(error).message,
      });
      return fail({
        message:
          "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Default repository instance
 */
export const emailCampaignsRepository = new EmailCampaignsRepositoryImpl();
