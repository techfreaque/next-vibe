/**
 * Campaign Starter Configuration Repository
 * Handles database operations and business logic for campaign starter configuration
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/db";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../../user/auth/types";
import { type CampaignStarterConfig, campaignStarterConfigs } from "./db";
import {
  type CronSettings,
  getDefaultConfigWithCron,
  getDefaultCronSettings,
} from "./default-config";
import type { CampaignStarterConfigType as CampaignStarterConfigWithCronType } from "./definition";

/**
 * Campaign Starter Configuration Repository Interface
 */
export interface ICampaignStarterConfigRepository {
  getConfig(
    data: Record<string, never>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>>;

  updateConfig(
    data: CampaignStarterConfigWithCronType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>>;

  ensureConfigExists(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>>;
}

/**
 * Campaign Starter Configuration Repository Implementation
 */
class CampaignStarterConfigRepositoryImpl
  implements ICampaignStarterConfigRepository
{
  /**
   * Get current environment
   */
  private getCurrentEnvironment(): Environment {
    return env.NODE_ENV === Environment.PRODUCTION
      ? Environment.PRODUCTION
      : Environment.DEVELOPMENT;
  }

  /**
   * Validate and get priority value from database string
   */
  private isValidPriority(
    value: string,
  ): value is (typeof CronTaskPriority)[keyof typeof CronTaskPriority] {
    return (
      value === CronTaskPriority.CRITICAL ||
      value === CronTaskPriority.HIGH ||
      value === CronTaskPriority.MEDIUM ||
      value === CronTaskPriority.LOW ||
      value === CronTaskPriority.BACKGROUND
    );
  }

  /**
   * Get cron task settings for campaign starter
   */
  private async getCronTaskSettings(): Promise<CronSettings> {
    const [cronTask] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.name, "campaign-starter"))
      .limit(1);

    if (!cronTask) {
      // Return default cron settings if not found
      return getDefaultCronSettings();
    }

    const defaults = getDefaultCronSettings();

    // Validate priority is one of the valid CronTaskPriority values
    // The database constraint ensures this, but TypeScript doesn't know that
    const priorityValue = cronTask.priority;
    const priority =
      priorityValue && this.isValidPriority(priorityValue)
        ? priorityValue
        : defaults.priority;

    return {
      schedule: cronTask.schedule,
      enabled: cronTask.enabled,
      priority,
      timeout: cronTask.timeout ?? defaults.timeout,
      retries: cronTask.retries ?? defaults.retries,
      retryDelay: cronTask.retryDelay ?? defaults.retryDelay,
    };
  }

  /**
   * Convert database config to API format
   * Combines campaign config with cron settings
   */
  private async formatConfigResponse(
    dbConfig: CampaignStarterConfig,
  ): Promise<CampaignStarterConfigWithCronType> {
    // Get cron task settings
    const cronTask = await this.getCronTaskSettings();

    return {
      // Campaign-specific settings
      dryRun: dbConfig.dryRun === 1,
      minAgeHours: dbConfig.minAgeHours,
      enabledDays: dbConfig.enabledDays,
      enabledHours: dbConfig.enabledHours,
      leadsPerWeek: dbConfig.leadsPerWeek,

      // Cron task settings
      schedule: cronTask.schedule,
      enabled: cronTask.enabled,
      priority: cronTask.priority,
      timeout: cronTask.timeout,
      retries: cronTask.retries,
      retryDelay: cronTask.retryDelay,
    };
  }

  /**
   * Save cron task settings for campaign starter
   */
  private async saveCronTaskSettings(
    cronSettings: CronSettings,
  ): Promise<void> {
    const [existingCronTask] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.name, "campaign-starter"))
      .limit(1);

    const cronData = {
      name: "campaign-starter" as const,

      version: "1.0.0", // Required field
      category: "LEAD_MANAGEMENT",
      // eslint-disable-next-line i18next/no-literal-string
      description: "Campaign starter cron task",
      schedule: cronSettings.schedule,
      enabled: cronSettings.enabled,
      priority: cronSettings.priority,
      timeout: cronSettings.timeout,
      retries: cronSettings.retries,
      retryDelay: cronSettings.retryDelay,
      defaultConfig: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingCronTask) {
      // Update existing cron task
      await db
        .update(cronTasks)
        .set(cronData)
        .where(eq(cronTasks.name, "campaign-starter"));
    } else {
      // Create new cron task
      await db.insert(cronTasks).values(cronData);
    }
  }

  /**
   * Convert API config to database format (campaign settings only)
   */
  private formatConfigForDb(
    config: CampaignStarterConfigWithCronType,
    environment: string,
  ): CampaignStarterConfig {
    return {
      id: crypto.randomUUID(),
      environment,
      // Campaign-specific settings only
      dryRun: config.dryRun ? 1 : 0,
      minAgeHours: config.minAgeHours,
      enabledDays: config.enabledDays,
      enabledHours: config.enabledHours,
      leadsPerWeek: config.leadsPerWeek,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get campaign starter configuration
   */
  async getConfig(
    data: Record<string, never>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>> {
    try {
      const environment = this.getCurrentEnvironment();

      logger.info("Fetching campaign starter config", {
        environment,
        userId: user.id,
        locale,
      });

      // Try to get config from database
      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        const config = await this.formatConfigResponse(existingConfig);
        logger.debug("Found existing config in database", { environment });
        return success(config);
      }

      // If no config exists, return default config with default cron settings
      const combinedConfig = getDefaultConfigWithCron();
      logger.debug("No config found, returning default", { environment });
      return success(combinedConfig);
    } catch (error) {
      logger.error("Error fetching campaign starter config", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update campaign starter configuration
   * Handles both campaign settings and cron settings
   */
  async updateConfig(
    data: CampaignStarterConfigWithCronType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>> {
    try {
      const environment = this.getCurrentEnvironment();

      logger.info("Updating campaign starter config", {
        environment,
        userId: user.id,
        locale,
        dryRun: data.dryRun,
        enabled: data.enabled,
      });

      // Save campaign settings
      const dbConfig = this.formatConfigForDb(data, environment);

      // Check if config already exists
      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        // Update existing config
        await db
          .update(campaignStarterConfigs)
          .set(dbConfig)
          .where(eq(campaignStarterConfigs.environment, environment));

        logger.debug("Updated existing config", { environment });
      } else {
        // Create new config
        await db.insert(campaignStarterConfigs).values({
          ...dbConfig,
          createdAt: new Date(),
        });

        logger.debug("Created new config", { environment });
      }

      // Save cron settings separately
      const defaults = getDefaultCronSettings();
      const cronSettings = {
        schedule: data.schedule,
        enabled: data.enabled ?? defaults.enabled,
        priority: data.priority ?? defaults.priority,
        timeout: data.timeout ?? defaults.timeout,
        retries: data.retries ?? defaults.retries,
        retryDelay: data.retryDelay ?? defaults.retryDelay,
      };
      await this.saveCronTaskSettings(cronSettings);

      return success(data);
    } catch (error) {
      logger.error("Error updating campaign starter config", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Ensure configuration exists in database (for cron job)
   * Creates default configuration if it doesn't exist
   */
  async ensureConfigExists(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigWithCronType>> {
    try {
      const environment = this.getCurrentEnvironment();

      logger.info("Ensuring config exists", {
        environment,
        userId: user.id,
        locale,
      });

      // Try to get existing config from database
      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        const config = await this.formatConfigResponse(existingConfig);
        return success(config);
      }

      // Config doesn't exist, create it with default values
      const defaultConfigWithCron = getDefaultConfigWithCron();
      const dbConfig = this.formatConfigForDb(
        defaultConfigWithCron,
        environment,
      );

      await db.insert(campaignStarterConfigs).values({
        ...dbConfig,
        createdAt: new Date(),
      });

      logger.debug("Created default config in database", { environment });

      // Return combined config
      return success(defaultConfigWithCron);
    } catch (error) {
      logger.error("Error ensuring config exists", parseError(error));
      // Fall back to default config with default cron settings if database operation fails
      const defaultConfig = getDefaultConfigWithCron();
      return success(defaultConfig);
    }
  }
}

/**
 * Singleton instance
 */
export const campaignStarterConfigRepository =
  new CampaignStarterConfigRepositoryImpl();
