/**
 * Campaign Starter Distribution Request/Response Types
 */

import { z } from "zod";

/**
 * Distribution Calculation Input
 */
export const distributionCalculationInputSchema = z.object({
  config: z.object({
    enabledHours: z.object({
      start: z.number().min(0).max(23),
      end: z.number().min(0).max(23),
    }),
    enabledDays: z.array(z.number().min(1).max(7)),
    leadsPerWeek: z.record(z.string(), z.number().min(0)),
  }),
  cronSchedule: z.string(),
});

export type DistributionCalculationInputType = z.infer<
  typeof distributionCalculationInputSchema
>;

/**
 * Distribution Calculation Output
 */
export const distributionCalculationOutputSchema = z.object({
  totalEnabledHours: z.number(),
  enabledDaysPerWeek: z.number(),
  totalEnabledMinutesPerDay: z.number(),
  runsPerDay: z.number(),
  totalEnabledMinutesPerWeek: z.number(),
  runsPerWeek: z.number(),
});

export type DistributionCalculationOutputType = z.infer<
  typeof distributionCalculationOutputSchema
>;

/**
 * Locale Quota Calculation Input
 */
export const localeQuotaCalculationInputSchema = z.object({
  locale: z.string(),
  weeklyQuota: z.number(),
  config: z.object({
    enabledHours: z.object({
      start: z.number().min(0).max(23),
      end: z.number().min(0).max(23),
    }),
    enabledDays: z.array(z.number().min(1).max(7)),
  }),
  distribution: distributionCalculationOutputSchema,
  now: z.date(),
});

export type LocaleQuotaCalculationInputType = z.infer<
  typeof localeQuotaCalculationInputSchema
>;

/**
 * Locale Processing Info Output
 */
export const localeProcessingInfoOutputSchema = z.object({
  locale: z.string(),
  weeklyQuota: z.number(),
  dailyQuota: z.number(),
  currentTime: z.string(),
  minutesIntoEnabledPeriod: z.number(),
  totalEnabledMinutesInDay: z.number(),
  progressThroughDay: z.number(),
  targetLeadsProcessedByNow: z.number(),
  processedCount: z.number(),
  baseLeadsPerRun: z.number(),
  failedLeadsCount: z.number(),
  adjustedLeadsPerRun: z.number(),
});

export type LocaleProcessingInfoOutputType = z.infer<
  typeof localeProcessingInfoOutputSchema
>;

const definitions = {};

export default definitions;
