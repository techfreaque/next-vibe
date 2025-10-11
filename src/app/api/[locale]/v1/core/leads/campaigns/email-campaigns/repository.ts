/**
 * Email Campaigns Repository
 * Handles business logic for email campaign operations
 */

import "server-only";

import {
  and,
  eq,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  not,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { leads } from "../../db";
import {
  EmailCampaignStage,
  EmailCampaignStageValues,
  LeadStatus,
} from "../../enum";
import { EmailService } from "../emails";
import type {
  BatchProcessorResultType,
  EmailCampaignConfigType,
  EmailCampaignResultType,
  StageProcessorResultType,
} from "./types";

/**
 * Email Campaigns Repository Interface
 */
export interface IEmailCampaignsRepository {
  validateEmailCampaignTask(
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  findLeadsForStage(
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<any[]>>;

  processEmailStage(
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    result: EmailCampaignResultType,
    logger: EndpointLogger,
  ): Promise<ResponseType<StageProcessorResultType>>;

  processBatch(
    leads: any[],
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchProcessorResultType>>;
}

/**
 * Email Campaigns Repository Implementation
 */
export class EmailCampaignsRepositoryImpl implements IEmailCampaignsRepository {
  private readonly emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async validateEmailCampaignTask(
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Starting email campaign task validation");

      // Validate config structure
      if (!config || typeof config !== "object") {
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emailCampaigns.errors.invalidConfig.title",
          ErrorResponseTypes.VALIDATION_ERROR,
          "Invalid configuration object",
        );
      }

      // Check database connectivity
      try {
        await db.select().from(leads).limit(1);
        logger.debug("Database connectivity check passed");
      } catch (error) {
        logger.error("Database connectivity check failed", {
          error: parseError(error),
        });
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emailCampaigns.errors.databaseConnection.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          "Database connection failed",
        );
      }

      // Validate email service availability
      const availableJourneys = this.emailService.getAvailableJourneys();
      if (availableJourneys.length === 0) {
        logger.error("No email journey variants available");
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emailCampaigns.errors.noJourneys.title",
          ErrorResponseTypes.CONFIGURATION_ERROR,
          "No email journey variants configured",
        );
      }

      logger.debug("Email campaign task validation completed successfully", {
        availableJourneys: availableJourneys.length,
      });

      return createSuccessResponse(true);
    } catch (error) {
      logger.error("Email campaign task validation failed", {
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.leads.campaigns.emailCampaigns.errors.validationFailed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }

  async findLeadsForStage(
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<any[]>> {
    try {
      logger.debug("Finding leads for stage", {
        stage,
        leadsPerRun: config.leadsPerRun,
      });

      let query = db
        .select()
        .from(leads)
        .where(
          and(eq(leads.status, LeadStatus.PENDING), isNotNull(leads.email)),
        )
        .orderBy(leads.createdAt);

      // Stage-specific conditions
      switch (stage) {
        case EmailCampaignStage.NOT_STARTED:
          query = query.where(
            and(
              eq(leads.currentCampaignStage, EmailCampaignStage.NOT_STARTED),
              isNull(leads.lastEmailSentAt),
            ),
          );
          break;

        case EmailCampaignStage.INITIAL_CONTACT:
          query = query.where(
            eq(leads.currentCampaignStage, EmailCampaignStage.NOT_STARTED),
          );
          break;

        case EmailCampaignStage.FOLLOWUP_1:
        case EmailCampaignStage.FOLLOWUP_2:
        case EmailCampaignStage.FOLLOWUP_3:
          const previousStage = this.getPreviousStage(stage);
          if (previousStage) {
            // Find leads ready for next stage after delay
            const minDelay = config.stageDelays?.[stage] || 24 * 60; // Default 24 hours in minutes
            const cutoffTime = new Date(Date.now() - minDelay * 60 * 1000);

            query = query.where(
              and(
                eq(leads.currentCampaignStage, previousStage),
                isNotNull(leads.lastEmailSentAt),
                lte(leads.lastEmailSentAt, cutoffTime),
              ),
            );
          }
          break;

        case EmailCampaignStage.NURTURE:
          // Find leads ready for nurture stage
          query = query.where(
            and(
              inArray(leads.currentCampaignStage, [
                EmailCampaignStage.FOLLOWUP_3,
                EmailCampaignStage.NURTURE,
              ]),
              isNotNull(leads.lastEmailSentAt),
            ),
          );
          break;

        default:
          logger.debug("Unknown stage, returning empty result", { stage });
          return createSuccessResponse([]);
      }

      const foundLeads = await query.limit(config.leadsPerRun || 10);

      logger.debug("Found leads for stage", {
        stage,
        count: foundLeads.length,
        leadsPerRun: config.leadsPerRun,
      });

      return createSuccessResponse(foundLeads);
    } catch (error) {
      logger.error("Failed to find leads for stage", {
        error: parseError(error),
        stage,
      });
      return createErrorResponse(
        "app.api.v1.core.leads.campaigns.emailCampaigns.errors.findLeads.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }

  async processEmailStage(
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    result: EmailCampaignResultType,
    logger: EndpointLogger,
  ): Promise<ResponseType<StageProcessorResultType>> {
    try {
      logger.debug("Processing email stage", { stage });

      // Find leads for this stage
      const leadsResult = await this.findLeadsForStage(stage, config, logger);
      if (!leadsResult.success || !leadsResult.data) {
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emailCampaigns.errors.findLeadsFailed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          leadsResult.message || "Failed to find leads",
        );
      }

      const leadsForStage = leadsResult.data;
      const stageResult: StageProcessorResultType = {
        stage,
        leadsFound: leadsForStage.length,
        emailsSent: 0,
        errors: [],
      };

      if (leadsForStage.length === 0) {
        logger.debug("No leads found for stage", { stage });
        return createSuccessResponse(stageResult);
      }

      // Process leads in batches
      const batchResult = await this.processBatch(
        leadsForStage,
        stage,
        config,
        logger,
      );
      if (!batchResult.success || !batchResult.data) {
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emailCampaigns.errors.batchProcessFailed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          batchResult.message || "Batch processing failed",
        );
      }

      stageResult.emailsSent = batchResult.data.emailsSent;
      stageResult.errors = batchResult.data.errors;

      // Update global result
      result.totalEmailsSent += stageResult.emailsSent;
      result.totalLeadsProcessed += stageResult.leadsFound;
      result.errors.push(...stageResult.errors);

      logger.debug("Stage processing completed", {
        stage,
        leadsFound: stageResult.leadsFound,
        emailsSent: stageResult.emailsSent,
        errorsCount: stageResult.errors.length,
      });

      return createSuccessResponse(stageResult);
    } catch (error) {
      logger.error("Failed to process email stage", {
        error: parseError(error),
        stage,
      });
      return createErrorResponse(
        "app.api.v1.core.leads.campaigns.emailCampaigns.errors.processStage.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }

  async processBatch(
    leads: any[],
    stage: EmailCampaignStage,
    config: EmailCampaignConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchProcessorResultType>> {
    try {
      logger.debug("Processing batch", {
        leadsCount: leads.length,
        stage,
        batchSize: config.batchSize,
      });

      const batchResult: BatchProcessorResultType = {
        emailsSent: 0,
        errors: [],
      };

      const batchSize = config.batchSize || 10;

      for (let i = 0; i < leads.length; i += batchSize) {
        const batch = leads.slice(i, i + batchSize);

        for (const lead of batch) {
          try {
            if (config.dryRun) {
              logger.debug("Dry run: would send email", {
                leadId: lead.id,
                email: lead.email,
                stage,
              });
              batchResult.emailsSent++;
            } else {
              // Process email sending logic here
              // This would integrate with the EmailService
              logger.debug("Sending email", {
                leadId: lead.id,
                email: lead.email,
                stage,
              });

              // Update lead's campaign stage and timestamp
              await db
                .update(leads)
                .set({
                  currentCampaignStage: stage,
                  lastEmailSentAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(leads.id, lead.id));

              batchResult.emailsSent++;
            }
          } catch (error) {
            const errorMessage = parseError(error);
            batchResult.errors.push({
              leadId: lead.id,
              email: lead.email || "unknown",
              error: errorMessage,
            });

            logger.error("Failed to process lead", {
              leadId: lead.id,
              email: lead.email,
              stage,
              error: errorMessage,
            });
          }
        }

        // Add small delay between batches to prevent overwhelming the email service
        if (i + batchSize < leads.length) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.batchDelay || 1000),
          );
        }
      }

      logger.debug("Batch processing completed", {
        emailsSent: batchResult.emailsSent,
        errorsCount: batchResult.errors.length,
      });

      return createSuccessResponse(batchResult);
    } catch (error) {
      logger.error("Failed to process batch", {
        error: parseError(error),
        stage,
        leadsCount: leads.length,
      });
      return createErrorResponse(
        "app.api.v1.core.leads.campaigns.emailCampaigns.errors.processBatch.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }

  private getPreviousStage(
    stage: EmailCampaignStage,
  ): EmailCampaignStage | null {
    const stageOrder = [
      EmailCampaignStage.NOT_STARTED,
      EmailCampaignStage.INITIAL_CONTACT,
      EmailCampaignStage.FOLLOWUP_1,
      EmailCampaignStage.FOLLOWUP_2,
      EmailCampaignStage.FOLLOWUP_3,
      EmailCampaignStage.NURTURE,
    ];

    const currentIndex = stageOrder.indexOf(stage);
    return currentIndex > 0 ? stageOrder[currentIndex - 1] : null;
  }
}

/**
 * Default repository instance
 */
export const emailCampaignsRepository = new EmailCampaignsRepositoryImpl();
