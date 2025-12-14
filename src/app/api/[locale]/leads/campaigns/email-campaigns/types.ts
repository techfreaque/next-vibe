/**
 * Email Campaigns Cron Types
 * Type definitions for email campaign automation
 */

import { z } from "zod";

import { EmailCampaignStage } from "../../enum";
import { leadId } from "../../types";

/**
 * Email Campaign Task Configuration Schema
 */
export const emailCampaignConfigSchema = z.object({
  batchSize: z.coerce.number().min(1).max(100),
  maxEmailsPerRun: z.coerce.number().min(1).max(1000),
  dryRun: z.boolean(),
  enabledStages: z.array(z.enum(EmailCampaignStage)),
  delayBetweenStages: z.object({
    [EmailCampaignStage.INITIAL]: z.coerce.number(),
    [EmailCampaignStage.FOLLOWUP_1]: z.coerce.number(),
    [EmailCampaignStage.FOLLOWUP_2]: z.coerce.number(),
    [EmailCampaignStage.FOLLOWUP_3]: z.coerce.number(),
    [EmailCampaignStage.NURTURE]: z.coerce.number(),
    [EmailCampaignStage.REACTIVATION]: z.coerce.number(),
  }),
  enabledDays: z.array(z.coerce.number().min(0).max(7)),
  enabledHours: z.object({
    start: z.coerce.number().min(0).max(23),
    end: z.coerce.number().min(0).max(23),
  }),
});

/**
 * Campaign Stage Statistics Schema
 */
export const campaignStageStatsSchema = z.object({
  emailsScheduled: z.coerce.number(),
  emailsSent: z.coerce.number(),
  emailsFailed: z.coerce.number(),
  leadsProcessed: z.coerce.number(),
});

/**
 * Journey Variant Statistics Schema
 */
export const journeyVariantStatsSchema = z.object({
  emailsScheduled: z.coerce.number(),
  emailsSent: z.coerce.number(),
  emailsFailed: z.coerce.number(),
  leadsProcessed: z.coerce.number(),
  stageBreakdown: z.record(z.string(), campaignStageStatsSchema),
});

/**
 * Locale Statistics Schema
 */
export const localeStatsSchema = z.object({
  emailsScheduled: z.coerce.number(),
  emailsSent: z.coerce.number(),
  emailsFailed: z.coerce.number(),
  leadsProcessed: z.coerce.number(),
  stageBreakdown: z.record(z.string(), campaignStageStatsSchema),
  journeyBreakdown: z.record(z.string(), journeyVariantStatsSchema),
});

/**
 * Enhanced Email Campaign Task Result Schema
 */
export const emailCampaignResultSchema = z.object({
  // Overall totals
  emailsScheduled: z.coerce.number(),
  emailsSent: z.coerce.number(),
  emailsFailed: z.coerce.number(),
  leadsProcessed: z.coerce.number(),

  // Legacy stage transitions (for backward compatibility)
  stageTransitions: z.record(z.string(), z.coerce.number()),

  // Detailed breakdowns
  stageBreakdown: z.record(z.string(), campaignStageStatsSchema),
  journeyBreakdown: z.record(z.string(), journeyVariantStatsSchema),
  localeBreakdown: z.record(z.string(), localeStatsSchema), // Using string for CountryLanguage

  // Performance metrics
  processingTimeMs: z.coerce.number(),
  accountsUsed: z.coerce.number(),
  parallelBatches: z.coerce.number(),

  // Error tracking
  errors: z.array(
    z.object({
      leadId: leadId,
      email: z.string(),
      stage: z.string(),
      journeyVariant: z.string().optional(),
      locale: z.string().optional(), // CountryLanguage
      error: z.string(),
      timestamp: z.date().optional(),
    }),
  ),
});

// Type exports
export type EmailCampaignConfigType = z.infer<typeof emailCampaignConfigSchema>;
export type EmailCampaignResultType = z.infer<typeof emailCampaignResultSchema>;
export type CampaignStageStatsType = z.infer<typeof campaignStageStatsSchema>;
export type JourneyVariantStatsType = z.infer<typeof journeyVariantStatsSchema>;
export type LocaleStatsType = z.infer<typeof localeStatsSchema>;

/**
 * Helper function to create empty campaign result
 */
export function createEmptyEmailCampaignResult(): EmailCampaignResultType {
  return {
    emailsScheduled: 0,
    emailsSent: 0,
    emailsFailed: 0,
    leadsProcessed: 0,
    stageTransitions: {},
    stageBreakdown: {},
    journeyBreakdown: {},
    localeBreakdown: {},
    processingTimeMs: 0,
    accountsUsed: 0,
    parallelBatches: 0,
    errors: [],
  };
}

/**
 * Helper function to create empty stage stats
 */
export function createEmptyStageStats(): CampaignStageStatsType {
  return {
    emailsScheduled: 0,
    emailsSent: 0,
    emailsFailed: 0,
    leadsProcessed: 0,
  };
}

/**
 * Email Campaign Error Type
 */
export interface EmailCampaignError {
  leadId: string;
  email: string;
  stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
  error: string;
}
