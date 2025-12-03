/**
 * Email Campaigns Repository
 * Handles business logic for email campaign operations
 */

import "server-only";

import { and, eq, isNotNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { leads } from "../../db";
import { EmailCampaignStage, LeadStatus } from "../../enum";
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

      // Find leads ready for this stage
      const leadsQuery = db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.PENDING),
            eq(leads.currentCampaignStage, EmailCampaignStage.NOT_STARTED),
            isNotNull(leads.email),
          ),
        )
        .limit(options.batchSize);

      const leadsToProcess = await leadsQuery;
      result.leadsProcessed = leadsToProcess.length;

      if (leadsToProcess.length === 0) {
        logger.debug("No leads found for stage", { stage });
        return success(result);
      }

      // Process each lead
      for (const lead of leadsToProcess) {
        try {
          if (options.dryRun) {
            logger.debug("Dry run - would send email", {
              leadId: lead.id,
              email: lead.email,
              stage,
            });
            result.emailsScheduled++;
          } else {
            // TODO: Integrate with EmailService to send actual emails
            // For now, just update the database
            await db
              .update(leads)
              .set({
                currentCampaignStage: stage,
                lastEmailSentAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(leads.id, lead.id));

            result.emailsSent++;
          }
        } catch (error) {
          result.emailsFailed++;
          result.errors.push({
            leadId: lead.id,
            email: lead.email || "unknown",
            stage,
            error: parseError(error).message,
          });
          logger.error("Failed to process lead", {
            leadId: lead.id,
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
