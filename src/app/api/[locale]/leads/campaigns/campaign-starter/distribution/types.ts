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
      start: z.coerce.number().min(0).max(23),
      end: z.coerce.number().min(0).max(23),
    }),
    enabledDays: z.array(z.coerce.number().min(1).max(7)),
    leadsPerWeek: z.record(z.string(), z.coerce.number().min(0)),
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
  totalEnabledHours: z.coerce.number(),
  enabledDaysPerWeek: z.coerce.number(),
  totalEnabledMinutesPerDay: z.coerce.number(),
  runsPerDay: z.coerce.number(),
  totalEnabledMinutesPerWeek: z.coerce.number(),
  runsPerWeek: z.coerce.number(),
});

export type DistributionCalculationOutputType = z.infer<
  typeof distributionCalculationOutputSchema
>;

/**
 * Locale Quota Calculation Input
 */
export const localeQuotaCalculationInputSchema = z.object({
  locale: z.string(),
  weeklyQuota: z.coerce.number(),
  config: z.object({
    enabledHours: z.object({
      start: z.coerce.number().min(0).max(23),
      end: z.coerce.number().min(0).max(23),
    }),
    enabledDays: z.array(z.coerce.number().min(1).max(7)),
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
  weeklyQuota: z.coerce.number(),
  dailyQuota: z.coerce.number(),
  currentTime: z.string(),
  minutesIntoEnabledPeriod: z.coerce.number(),
  totalEnabledMinutesInDay: z.coerce.number(),
  progressThroughDay: z.coerce.number(),
  targetLeadsProcessedByNow: z.coerce.number(),
  processedCount: z.coerce.number(),
  baseLeadsPerRun: z.coerce.number(),
  failedLeadsCount: z.coerce.number(),
  adjustedLeadsPerRun: z.coerce.number(),
});

export type LocaleProcessingInfoOutputType = z.infer<
  typeof localeProcessingInfoOutputSchema
>;
