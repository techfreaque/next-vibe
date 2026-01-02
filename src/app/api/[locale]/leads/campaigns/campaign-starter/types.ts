/**
 * Campaign Starter Types
 * Type definitions and schemas for the campaign starter cron task
 */

import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Campaign Starter Configuration Schema
 */
export const campaignStarterConfigSchema = z.object({
  dryRun: z.boolean(),
  minAgeHours: z.coerce.number().min(0).max(168), // 0-7 days
  enabledDays: z.array(z.coerce.number().min(1).max(7)), // 1=Monday, 7=Sunday
  enabledHours: z.object({
    start: z.coerce.number().min(0).max(23),
    end: z.coerce.number().min(0).max(23),
  }),
  // Weekly quotas per locale (leads per week)
  leadsPerWeek: z.record(z.string(), z.coerce.number().min(0)),
});

export type CampaignStarterConfigType = z.infer<typeof campaignStarterConfigSchema>;

/**
 * Campaign Starter Result Schema
 */
export const campaignStarterResultSchema = z.object({
  leadsProcessed: z.coerce.number(),
  leadsStarted: z.coerce.number(),
  leadsSkipped: z.coerce.number(),
  executionTimeMs: z.coerce.number(),
  errors: z.array(
    z.object({
      leadId: z.string(),
      email: z.string(),
      error: z.string(),
    }),
  ),
});

export type CampaignStarterResultType = z.infer<typeof campaignStarterResultSchema>;

/**
 * Distribution Calculation Result
 */
export interface DistributionCalculation {
  totalEnabledHours: number;
  enabledDaysPerWeek: number;
  totalEnabledMinutesPerDay: number;
  runsPerDay: number;
  totalEnabledMinutesPerWeek: number;
  runsPerWeek: number;
}

/**
 * Locale Processing Info
 */
export interface LocaleProcessingInfo {
  locale: CountryLanguage;
  weeklyQuota: number;
  dailyQuota: number;
  currentTime: string;
  minutesIntoEnabledPeriod: number;
  totalEnabledMinutesInDay: number;
  progressThroughDay: number;
  targetLeadsProcessedByNow: number;
  processedCount: number;
  baseLeadsPerRun: number;
  failedLeadsCount: number;
  adjustedLeadsPerRun: number;
}
