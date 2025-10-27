/**
 * Campaign Starter Configuration
 * Default configurations for production and development environments
 */

import { Environment } from "next-vibe/shared/utils/env-util";

import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/enum";
import { env } from "@/config/env";

import type { CampaignStarterConfigType } from "./definition";

/**
 * Interface for cron settings (all required fields)
 */
export interface CronSettings {
  schedule: string;
  enabled: boolean;
  priority: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Production Configuration
 */
export const PRODUCTION_CONFIG: CampaignStarterConfigType = {
  // Production configuration
  dryRun: false,
  minAgeHours: 0,
  enabledDays: [1, 2, 3, 4, 5], // Monday-Friday
  enabledHours: {
    start: 7, // 7 AM UTC
    end: 15, // 3 PM UTC
  },
  leadsPerWeek: {
    "en-GLOBAL": 0, // 100 leads per week for English (Global)
    "de-DE": 0, // 50 leads per week for German (Germany)
    "pl-PL": 0, // 30 leads per week for Polish (Poland)
  },
  // Cron settings
  schedule: "*/3 * * * *",
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: 300000,
  retries: 3,
  retryDelay: 30000,
};

/**
 * Development Configuration
 */
export const DEVELOPMENT_CONFIG: CampaignStarterConfigType = {
  // Non-production configuration (testing)
  dryRun: false,
  minAgeHours: 0,
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
  leadsPerWeek: {
    "en-GLOBAL": 50,
    "de-DE": 50,
    "pl-PL": 50,
  },
  // Cron settings
  schedule: "*/3 * * * *",
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: 300000,
  retries: 3,
  retryDelay: 30000,
};

/**
 * Get configuration based on environment
 */
export function getDefaultConfig(): CampaignStarterConfigType {
  return env.NODE_ENV === Environment.PRODUCTION
    ? PRODUCTION_CONFIG
    : DEVELOPMENT_CONFIG;
}

/**
 * Get default cron settings based on environment
 */
export function getDefaultCronSettings(): CronSettings {
  const isProduction = env.NODE_ENV === Environment.PRODUCTION;
  return {
    // eslint-disable-next-line i18next/no-literal-string
    schedule: isProduction ? "*/3 * * * *" : "*/1 * * * *", // Every 3 min (prod) or 1 min (dev)

    enabled: true,
    priority: isProduction ? CronTaskPriority.MEDIUM : CronTaskPriority.LOW,
    timeout: isProduction ? 300000 : 180000, // 5 min (prod) or 3 min (dev)
    retries: isProduction ? 3 : 2,
    retryDelay: isProduction ? 30000 : 15000, // 30s (prod) or 15s (dev)
  };
}

/**
 * Get complete default configuration (campaign + cron settings)
 */
export function getDefaultConfigWithCron(): CampaignStarterConfigType {
  const campaignConfig = getDefaultConfig();
  const cronConfig = getDefaultCronSettings();

  return {
    ...campaignConfig,
    ...cronConfig,
  };
}
