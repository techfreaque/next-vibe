/**
 * Email Campaigns Cron Configuration
 * Configuration constants and default values for email campaign automation
 */

import { Environment } from "next-vibe/shared/utils/env-util";

import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { CronTaskDefinition } from "@/app/api/[locale]/v1/core/system/tasks/types/definition";
import { env } from "@/config/env";

import { EmailCampaignStage } from "../../enum";
import type { EmailCampaignConfigType, EmailCampaignResultType } from "./types";
import { emailCampaignConfigSchema, emailCampaignResultSchema } from "./types";

/**
 * Email Campaign Stage Delays (in days)
 */
export const STAGE_DELAYS = {
  INITIAL: 0,
  FOLLOWUP_1: 20,
  FOLLOWUP_2: 40,
  FOLLOWUP_3: 60,
  NURTURE: 90,
  REACTIVATION: 120,
} as const;

/**
 * Production Configuration
 */
export const PRODUCTION_CONFIG: EmailCampaignConfigType = {
  batchSize: 100,
  maxEmailsPerRun: 500,
  dryRun: false,
  enabledStages: [
    EmailCampaignStage.INITIAL,
    EmailCampaignStage.FOLLOWUP_1,
    EmailCampaignStage.FOLLOWUP_2,
    EmailCampaignStage.FOLLOWUP_3,
  ],
  delayBetweenStages: {
    [EmailCampaignStage.INITIAL]: STAGE_DELAYS.INITIAL,
    [EmailCampaignStage.FOLLOWUP_1]: STAGE_DELAYS.FOLLOWUP_1,
    [EmailCampaignStage.FOLLOWUP_2]: STAGE_DELAYS.FOLLOWUP_2,
    [EmailCampaignStage.FOLLOWUP_3]: STAGE_DELAYS.FOLLOWUP_3,
    [EmailCampaignStage.NURTURE]: STAGE_DELAYS.NURTURE,
    [EmailCampaignStage.REACTIVATION]: STAGE_DELAYS.REACTIVATION,
  },
  enabledDays: [1, 2, 3, 4, 5], // Monday-Friday
  enabledHours: {
    start: 7, // 7 AM UTC
    end: 15, // 3 PM UTC
  },
};

/**
 * Development Configuration
 */
export const DEVELOPMENT_CONFIG: EmailCampaignConfigType = {
  batchSize: 100,
  maxEmailsPerRun: 500,
  dryRun: false,
  enabledStages: [
    EmailCampaignStage.INITIAL,
    EmailCampaignStage.FOLLOWUP_1,
    EmailCampaignStage.FOLLOWUP_2,
    EmailCampaignStage.FOLLOWUP_3,
  ],
  delayBetweenStages: {
    [EmailCampaignStage.INITIAL]: STAGE_DELAYS.INITIAL,
    [EmailCampaignStage.FOLLOWUP_1]: STAGE_DELAYS.FOLLOWUP_1,
    [EmailCampaignStage.FOLLOWUP_2]: STAGE_DELAYS.FOLLOWUP_2,
    [EmailCampaignStage.FOLLOWUP_3]: STAGE_DELAYS.FOLLOWUP_3,
    [EmailCampaignStage.NURTURE]: STAGE_DELAYS.NURTURE,
    [EmailCampaignStage.REACTIVATION]: STAGE_DELAYS.REACTIVATION,
  },
  enabledDays: ((): number[] => {
    // Always current day for testing
    const today = new Date().getUTCDay() || 7; // Convert Sunday (0) to 7
    return [today];
  })(),
  enabledHours: {
    // All hours for testing
    start: 0,
    end: 23,
  },
};

/**
 * Get configuration based on environment
 */
export function getDefaultConfig(): EmailCampaignConfigType {
  return env.NODE_ENV === Environment.PRODUCTION
    ? PRODUCTION_CONFIG
    : DEVELOPMENT_CONFIG;
}

/**
 * Get schedule based on environment
 */
export function getSchedule(): string {
  return env.NODE_ENV === Environment.PRODUCTION
    ? // eslint-disable-next-line i18next/no-literal-string
      "*/1 7-15 * * 1-5" // Production: Every 3 minutes, Monday-Friday, 7-15 UTC
    : // eslint-disable-next-line i18next/no-literal-string
      "*/1 * * * *"; // Development: Every 3 minutes, always
}

/**
 * Email Campaign Cron Task Definition
 * Production-ready configuration for automated email campaigns
 */
export const taskDefinition: CronTaskDefinition<
  EmailCampaignConfigType,
  EmailCampaignResultType
> = {
  // Task metadata
  name: "lead-email-campaigns",
  description:
    // eslint-disable-next-line i18next/no-literal-string
    "Send automated email campaigns to leads based on their stage and timing",
  version: "1.0.0",

  // Scheduling configuration
  schedule: getSchedule(),
  timezone: "UTC",
  enabled: true,

  // Execution configuration
  timeout: 600000, // 10 minutes
  retries: 3,
  retryDelay: 5000,

  // Task-specific configuration
  defaultConfig: getDefaultConfig(),

  // Validation schemas
  configSchema: emailCampaignConfigSchema,
  resultSchema: emailCampaignResultSchema,

  // Task categories and metadata
  tags: ["email", "marketing", "leads", "automation"],
  dependencies: [],
  monitoring: {
    alertOnFailure: true,
    alertOnLongExecution: true,
    maxExecutionTime: 600000, // 10 minutes
  },

  // Documentation
  documentation: {
    // eslint-disable-next-line i18next/no-literal-string
    purpose: "Automates lead nurturing through staged email campaigns",
    // eslint-disable-next-line i18next/no-literal-string
    impact: "Improves lead conversion and engagement rates",
    // eslint-disable-next-line i18next/no-literal-string
    rollback: "No rollback needed - emails are tracked in database",
  },
};
