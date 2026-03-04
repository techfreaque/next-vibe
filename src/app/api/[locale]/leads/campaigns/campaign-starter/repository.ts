/**
 * Campaign Starter Repository
 * Handles business logic for campaign starter operations
 */

import "server-only";

import { and, eq, gte, inArray, isNotNull, isNull, lt, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { scopedTranslation as smtpScopedTranslation } from "../../../emails/smtp-client/i18n";
import { SmtpRepository } from "../../../emails/smtp-client/repository";
import { leads } from "../../db";
import {
  EmailCampaignStage,
  isStatusTransitionAllowed,
  LeadStatus,
} from "../../enum";
import { CampaignStarterConfigRepository } from "./campaign-starter-config/repository";
import type {
  CampaignStarterPostRequestOutput,
  CampaignStarterPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import type {
  CampaignStarterConfigType,
  CampaignStarterResultType,
} from "./types";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const INVALID_TRANSITION_ERROR = "Invalid status transition for campaign start";

/**
 * Campaign Starter Repository Interface
 */
export interface ICampaignStarterRepository {
  processLocaleLeads(
    locale: CountryLanguage,
    leadsPerRun: number | undefined,
    minAgeDate: Date,
    config: CampaignStarterConfigType,
    result: CampaignStarterResultType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<void>>;

  getFailedLeadsCount(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<number>>;

  markFailedLeadsAsProcessed(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<void>>;
}

/**
 * Campaign Starter Repository Implementation
 */
export class CampaignStarterRepository {
  static async processLocaleLeads(
    locale: CountryLanguage,
    leadsPerRun: number | undefined,
    minAgeDate: Date,
    config: CampaignStarterConfigType,
    result: CampaignStarterResultType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Processing locale leads for campaign starter", {
        locale,
        leadsPerRun,
        minAgeDate: minAgeDate.toISOString(),
        dryRun: config.dryRun,
      });

      const languageCode = getLanguageFromLocale(locale);

      // Get current SMTP sending capacity to determine optimal queue size
      // Use system/public user context for cron job
      const SYSTEM_LEAD_ID = "00000000-0000-0000-0000-000000000000";
      const smtpT = smtpScopedTranslation.scopedT(locale).t;
      const capacityResult = await SmtpRepository.getTotalSendingCapacity(
        {},
        {
          isPublic: true,
          leadId: SYSTEM_LEAD_ID,
          roles: [UserPermissionRole.PUBLIC],
        },
        smtpT,
        logger,
      );
      const totalRemainingCapacity = capacityResult.success
        ? capacityResult.data.remainingCapacity
        : 100; // Fallback

      // Check how many PENDING leads already exist globally (not per locale)
      // Queue management should be global since SMTP accounts are shared
      const [globalPendingCount] = await db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(leads)
        .where(
          and(eq(leads.status, LeadStatus.PENDING), isNotNull(leads.email)),
        );

      const existingGlobalPending = globalPendingCount?.count || 0;

      // Calculate intelligent queue size based on SMTP capacity
      // Queue should be 2-3x the hourly sending capacity to ensure smooth processing
      const optimalQueueSize = Math.max(totalRemainingCapacity * 2, 100); // At least 100 for small setups
      const globalAvailableSlots = Math.max(
        0,
        optimalQueueSize - existingGlobalPending,
      );

      // Calculate this locale's fair share of available slots
      // This ensures fair distribution across locales while respecting global capacity
      const totalConfiguredLocales = Object.keys(
        config.leadsPerWeek || {},
      ).length;
      const localeShare =
        totalConfiguredLocales > 0
          ? Math.ceil(globalAvailableSlots / totalConfiguredLocales)
          : globalAvailableSlots;

      // Final adjustment: don't exceed requested amount or available queue slots
      // Note: We don't limit by totalRemainingCapacity because queue is for future processing
      const adjustedLeadsPerRun = Math.min(leadsPerRun || 0, localeShare);

      logger.debug("Intelligent campaign starter queue management", {
        locale,
        requestedLeadsPerRun: leadsPerRun,
        totalRemainingCapacity,
        existingGlobalPending,
        optimalQueueSize,
        globalAvailableSlots,
        totalConfiguredLocales,
        localeShare,
        adjustedLeadsPerRun,
      });

      if (adjustedLeadsPerRun <= 0) {
        logger.debug(
          "Skipping locale due to intelligent queue capacity management",
          {
            locale,
            reason:
              totalRemainingCapacity === 0
                ? "SMTP_CAPACITY_EXHAUSTED"
                : "QUEUE_FULL",
            existingGlobalPending,
            optimalQueueSize,
            totalRemainingCapacity,
          },
        );
        return success();
      }

      // Query for NEW leads in this locale that are old enough to start campaigns
      // Only process leads with email addresses since campaigns require emails
      const query = db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.NEW),
            eq(leads.language, languageCode),
            lt(leads.createdAt, minAgeDate),
            isNull(leads.lastEmailSentAt),
            isNotNull(leads.email), // Only process leads with email addresses
          ),
        )
        .orderBy(leads.createdAt); // Process oldest leads first

      const localeLeads = await query.limit(adjustedLeadsPerRun);

      if (localeLeads.length === 0) {
        return success();
      }

      // Process each lead
      for (const lead of localeLeads) {
        try {
          if (config.dryRun) {
            result.leadsStarted++;
          } else {
            // Validate status transition before updating
            if (
              !isStatusTransitionAllowed(
                lead.status,
                LeadStatus.CAMPAIGN_RUNNING,
              )
            ) {
              result.errors.push({
                leadId: lead.id,
                email: lead.email!,
                error: INVALID_TRANSITION_ERROR,
              });
              continue;
            }

            // Update lead status to PENDING so email campaign can pick it up
            const now = new Date();
            await db
              .update(leads)
              .set({
                status: LeadStatus.PENDING,
                currentCampaignStage: EmailCampaignStage.NOT_STARTED,
                campaignStartedAt: now,
                updatedAt: now,
              })
              .where(eq(leads.id, lead.id));

            result.leadsStarted++;
          }

          result.leadsProcessed++;
        } catch (error) {
          const errorMessage = parseError(error).message;
          result.errors.push({
            leadId: lead.id,
            email: lead.email!, // Email is guaranteed to exist since we filtered in the database query
            error: errorMessage,
          });

          logger.error("Failed to start campaign for lead", {
            leadId: lead.id,
            email: lead.email,
            locale,
            error: errorMessage,
          });
        }
      }

      return success();
    } catch (error) {
      logger.error("Failed to process locale leads", {
        error: parseError(error),
        locale,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getFailedLeadsCount(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<number>> {
    try {
      logger.debug("Getting failed leads count for rebalancing", { locale });

      // Extract language code from locale (e.g., "en-GLOBAL" -> "en")
      const languageCode = getLanguageFromLocale(locale);

      // Define failed states that should trigger rebalancing
      const failedStates = [
        LeadStatus.BOUNCED,
        LeadStatus.INVALID,
        LeadStatus.UNSUBSCRIBED, // Optional: include unsubscribed if you want to rebalance them too
      ];

      // Get the start of current week (Monday 00:00 UTC)
      const now = new Date();
      const currentDay = now.getUTCDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Sunday = 0, so 6 days from Monday
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
      startOfWeek.setUTCHours(0, 0, 0, 0);

      // Count leads that were updated to failed states this week
      // but haven't been rebalanced yet
      const failedLeads = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(
          and(
            eq(leads.language, languageCode),
            inArray(leads.status, failedStates),
            gte(leads.updatedAt, startOfWeek),
            // Only count leads that haven't been marked as rebalanced yet
            sql`NOT (COALESCE(${leads.metadata}, '{}')::jsonb ? 'rebalanced')`,
          ),
        );

      const count = Number(failedLeads[0]?.count || 0);

      if (count > 0) {
        logger.debug("Found failed leads for rebalancing", {
          locale,
          languageCode,
          failedCount: count,
          failedStates,
          weekStartDate: startOfWeek.toISOString(),
        });
      }

      return success(count);
    } catch (error) {
      logger.error("Failed to count failed leads", {
        error: parseError(error),
        locale,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async markFailedLeadsAsProcessed(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Marking failed leads as processed for rebalancing", {
        locale,
      });

      // Extract language code from locale (e.g., "en-GLOBAL" -> "en")
      const languageCode = getLanguageFromLocale(locale);

      // Define failed states that should trigger rebalancing
      const failedStates = [
        LeadStatus.BOUNCED,
        LeadStatus.INVALID,
        LeadStatus.UNSUBSCRIBED,
      ];

      // Get the start of current week (Monday 00:00 UTC)
      const now = new Date();
      const currentDay = now.getUTCDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
      startOfWeek.setUTCHours(0, 0, 0, 0);

      // Update failed leads to mark them as processed for rebalancing
      // We add a special metadata flag to track this
      await db
        .update(leads)
        .set({
          metadata: sql`COALESCE(${leads.metadata}, '{}') || '{"rebalanced": true}'::jsonb`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(leads.language, languageCode),
            inArray(leads.status, failedStates),
            gte(leads.updatedAt, startOfWeek),
            // Only update leads that haven't been marked as rebalanced yet
            sql`NOT (COALESCE(${leads.metadata}, '{}')::jsonb ? 'rebalanced')`,
          ),
        );

      logger.debug("Marked failed leads as processed for rebalancing", {
        locale,
        languageCode,
        failedStates,
      });

      return success();
    } catch (error) {
      logger.error("Failed to mark failed leads as processed", {
        error: parseError(error),
        locale,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Count leads that have been started into campaigns this week for a given locale.
   * Uses campaignStartedAt to track when campaign-starter transitioned a lead to PENDING.
   */
  static async getLeadsStartedThisWeek(
    locale: CountryLanguage,
    startOfWeek: Date,
    logger: EndpointLogger,
  ): Promise<number> {
    try {
      const languageCode = getLanguageFromLocale(locale);

      const [result] = await db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(leads)
        .where(
          and(
            eq(leads.language, languageCode),
            gte(leads.campaignStartedAt, startOfWeek),
          ),
        );

      return result?.count || 0;
    } catch (error) {
      logger.error("Failed to count leads started this week", {
        error: parseError(error).message,
        locale,
      });
      return 0;
    }
  }

  static async run(
    // oxlint-disable-next-line no-unused-vars
    _data: CampaignStarterPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CampaignStarterPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const systemUser = {
      id: "00000000-0000-0000-0000-000000000001",
      leadId: "00000000-0000-0000-0000-000000000000",
      isPublic: false as const,
      roles: [UserPermissionRole.ADMIN] as (typeof UserPermissionRole.ADMIN)[],
    };

    const configResult =
      await CampaignStarterConfigRepository.ensureConfigExists(
        systemUser,
        locale,
        logger,
      );

    if (!configResult.success || !configResult.data) {
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const config = configResult.data;

    if (!config.enabled) {
      logger.debug("Campaign starter is disabled in configuration");
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: 0,
      });
    }

    const startTime = Date.now();
    const now = new Date();
    const currentDay = now.getUTCDay() || 7;
    const currentHour = now.getUTCHours();

    if (!config.enabledDays.includes(currentDay)) {
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: Date.now() - startTime,
      });
    }

    if (
      currentHour < config.enabledHours.start ||
      currentHour > config.enabledHours.end
    ) {
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: Date.now() - startTime,
      });
    }

    const result: CampaignStarterResultType = {
      leadsProcessed: 0,
      leadsStarted: 0,
      leadsSkipped: 0,
      executionTimeMs: 0,
      errors: [],
    };

    const minAgeDate = new Date();
    minAgeDate.setHours(minAgeDate.getHours() - config.minAgeHours);

    const daysFromMonday = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    for (const [localeKey, weeklyQuota] of Object.entries(
      config.leadsPerWeek,
    )) {
      const localeValue =
        CountryLanguageValues[localeKey as keyof typeof CountryLanguageValues];
      if (!localeValue) {
        continue;
      }
      const weeklyQuotaNum = typeof weeklyQuota === "number" ? weeklyQuota : 0;

      const startedThisWeek =
        await CampaignStarterRepository.getLeadsStartedThisWeek(
          localeValue,
          startOfWeek,
          logger,
        );
      const remainingQuota = Math.max(0, weeklyQuotaNum - startedThisWeek);

      if (remainingQuota <= 0) {
        continue;
      }

      const failedLeadsCountResult =
        await CampaignStarterRepository.getFailedLeadsCount(
          localeValue,
          logger,
          t,
        );
      const failedLeadsCount = failedLeadsCountResult.success
        ? failedLeadsCountResult.data
        : 0;

      const adjustedLeadsPerRun = remainingQuota + failedLeadsCount;

      await CampaignStarterRepository.processLocaleLeads(
        localeValue,
        adjustedLeadsPerRun,
        minAgeDate,
        config,
        result,
        logger,
        t,
      );

      if (failedLeadsCount > 0) {
        await CampaignStarterRepository.markFailedLeadsAsProcessed(
          localeValue,
          logger,
          t,
        );
      }
    }

    result.executionTimeMs = Date.now() - startTime;

    return success({
      leadsProcessed: result.leadsProcessed,
      leadsStarted: result.leadsStarted,
      leadsSkipped: result.leadsSkipped,
      executionTimeMs: result.executionTimeMs,
    });
  }
}

/**
 * Default repository instance
 */
