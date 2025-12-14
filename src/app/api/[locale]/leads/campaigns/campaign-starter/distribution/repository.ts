/**
 * Campaign Starter Distribution Repository
 * Handles lead distribution calculations and locale quota management
 */

import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { getCronFrequencyMinutes } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { leads } from "../../../db";
import type {
  DistributionCalculationInputType,
  DistributionCalculationOutputType,
  LocaleProcessingInfoOutputType,
  LocaleQuotaCalculationInputType,
} from "./types";

/**
 * Distribution Repository Interface
 */
export interface DistributionRepository {
  calculateDistribution(
    data: DistributionCalculationInputType,
    logger: EndpointLogger,
  ): ResponseType<DistributionCalculationOutputType>;

  calculateLocaleQuota(
    data: LocaleQuotaCalculationInputType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LocaleProcessingInfoOutputType>>;
}

/**
 * Distribution Repository Implementation
 */
export class DistributionRepositoryImpl implements DistributionRepository {
  calculateDistribution(
    data: DistributionCalculationInputType,
    logger: EndpointLogger,
  ): ResponseType<DistributionCalculationOutputType> {
    try {
      const { config, cronSchedule } = data;

      const totalEnabledHours =
        config.enabledHours.end - config.enabledHours.start + 1;
      const enabledDaysPerWeek = config.enabledDays.length;

      // Get cron frequency from schedule
      const cronFrequencyMinutes = getCronFrequencyMinutes(
        cronSchedule,
        logger,
      );

      // Calculate runs per day for the current enabled days
      const totalEnabledMinutesPerDay = totalEnabledHours * 60;
      const runsPerDay = totalEnabledMinutesPerDay / cronFrequencyMinutes;

      // Calculate total runs per week
      const totalEnabledMinutesPerWeek =
        totalEnabledMinutesPerDay * enabledDaysPerWeek;
      const runsPerWeek = totalEnabledMinutesPerWeek / cronFrequencyMinutes;

      const result: DistributionCalculationOutputType = {
        totalEnabledHours,
        enabledDaysPerWeek,
        totalEnabledMinutesPerDay,
        runsPerDay,
        totalEnabledMinutesPerWeek,
        runsPerWeek,
      };

      return success(result);
    } catch (error) {
      logger.error("Distribution calculation failed", parseError(error));
      return fail({
        message:
          "app.api.leads.leadsErrors.campaigns.common.error.server.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async calculateLocaleQuota(
    data: LocaleQuotaCalculationInputType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LocaleProcessingInfoOutputType>> {
    try {
      const {
        locale: targetLocale,
        weeklyQuota,
        config,
        distribution,
        now,
      } = data;

      const currentHour = now.getUTCHours();

      // Calculate daily quota from weekly quota
      const dailyQuota = weeklyQuota / distribution.enabledDaysPerWeek;

      // Calculate how many leads we should have processed by now today
      const currentMinuteOfDay = currentHour * 60 + now.getUTCMinutes();
      const minutesIntoEnabledPeriod = Math.max(
        0,
        currentMinuteOfDay - config.enabledHours.start * 60,
      );
      const totalEnabledMinutesInDay =
        (config.enabledHours.end - config.enabledHours.start + 1) * 60;

      // Calculate target leads processed by this time
      const progressThroughDay = Math.min(
        1,
        minutesIntoEnabledPeriod / totalEnabledMinutesInDay,
      );
      const targetLeadsProcessedByNow = Math.floor(
        dailyQuota * progressThroughDay,
      );

      // Count how many leads we've already processed today for this locale
      const processedCount = await this.getProcessedLeadsToday(
        targetLocale as CountryLanguage,
        now,
      );

      // Calculate how many more leads we need to process to catch up
      let rawLeadsPerRun = Math.max(
        0,
        targetLeadsProcessedByNow - processedCount,
      );

      // For development: if we haven't processed any leads yet and it's early in the day,
      // process at least 1 lead to get things started
      if (processedCount === 0 && rawLeadsPerRun === 0 && dailyQuota > 0) {
        rawLeadsPerRun = Math.min(5, Math.ceil(dailyQuota / 10));
      }

      // Apply safety limit
      const maxLeadsPerRun = 500;
      const baseLeadsPerRun = Math.min(rawLeadsPerRun, maxLeadsPerRun);

      const result: LocaleProcessingInfoOutputType = {
        locale: targetLocale,
        weeklyQuota,
        dailyQuota: Math.round(dailyQuota * 100) / 100,
        currentTime: `${currentHour}:${now.getUTCMinutes().toString().padStart(2, "0")}`,
        minutesIntoEnabledPeriod,
        totalEnabledMinutesInDay,
        progressThroughDay: Math.round(progressThroughDay * 100) / 100,
        targetLeadsProcessedByNow,
        processedCount,
        baseLeadsPerRun,
        failedLeadsCount: 0, // Will be set by caller
        adjustedLeadsPerRun: 0, // Will be set by caller
      };

      return success(result);
    } catch (error) {
      logger.error("Locale quota calculation failed", parseError(error));
      return fail({
        message:
          "app.api.leads.leadsErrors.campaigns.common.error.server.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Count how many leads were already processed today for a locale
   */
  private async getProcessedLeadsToday(
    locale: CountryLanguage,
    now: Date,
  ): Promise<number> {
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const languageCode = getLanguageFromLocale(locale);

    // Count leads that have had campaigns started today (campaignStartedAt is set)
    const alreadyProcessedToday = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(
        and(
          eq(leads.language, languageCode),
          gte(leads.campaignStartedAt, startOfDay),
        ),
      );

    return Number(alreadyProcessedToday[0]?.count || 0);
  }
}

export const distributionRepository = new DistributionRepositoryImpl();
