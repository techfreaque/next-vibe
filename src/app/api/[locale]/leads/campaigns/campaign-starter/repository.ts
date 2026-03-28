/**
 * Campaign Starter Repository
 * Handles business logic for campaign starter operations
 * Includes config management (get, update, ensureExists) merged from campaign-starter-config
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
import { Environment } from "next-vibe/shared/utils/env-util";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getCronFrequencyMinutes } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import {
  cronTasks,
  type NewCronTask,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { scopedTranslation as smtpScopedTranslation } from "../../../messenger/providers/email/smtp-client/i18n";
import { SmtpRepository } from "../../../messenger/providers/email/smtp-client/repository";
import { leads } from "../../db";
import {
  EmailCampaignStage,
  isStatusTransitionAllowed,
  LeadStatus,
} from "../../enum";
import { type CampaignStarterConfig, campaignStarterConfigs } from "./db";
import type {
  CampaignStarterConfigGetResponseOutput,
  CampaignStarterPostRequestOutput,
  CampaignStarterPostResponseOutput,
} from "./definition";
import type { CampaignsCampaignStarterT } from "./i18n";

// ─── Timezone helpers ─────────────────────────────────────────────────────────

/** Get the current UTC offset in whole hours for an IANA timezone (e.g. "Europe/Berlin" → 2 in summer). */
function getUtcOffsetHours(timezone: string): number {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const localHour =
    Number(
      new Intl.DateTimeFormat([], {
        timeZone: timezone,
        hour: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(now)
        .find((p) => p.type === "hour")?.value ?? "0",
    ) % 24;
  let offset = localHour - utcHour;
  if (offset > 12) {
    offset -= 24;
  }
  if (offset < -12) {
    offset += 24;
  }
  return offset;
}

function localHourToUtc(localHour: number, timezone: string): number {
  return (((localHour - getUtcOffsetHours(timezone)) % 24) + 24) % 24;
}

function utcHourToLocal(utcHour: number, timezone: string): number {
  return (((utcHour + getUtcOffsetHours(timezone)) % 24) + 24) % 24;
}

function convertLocaleConfigToUtc(
  localeConfig: CampaignStarterConfigGetResponseOutput["localeConfig"],
  timezone: string | undefined,
): CampaignStarterConfigGetResponseOutput["localeConfig"] {
  if (!timezone) {
    return localeConfig;
  }
  return Object.fromEntries(
    Object.entries(localeConfig).map(([locale, entry]) => [
      locale,
      {
        ...entry,
        enabledHours: {
          start: localHourToUtc(entry.enabledHours.start, timezone),
          end: localHourToUtc(entry.enabledHours.end, timezone),
        },
      },
    ]),
  );
}

function convertLocaleConfigFromUtc(
  localeConfig: CampaignStarterConfigGetResponseOutput["localeConfig"],
  timezone: string | undefined,
): CampaignStarterConfigGetResponseOutput["localeConfig"] {
  if (!timezone) {
    return localeConfig;
  }
  return Object.fromEntries(
    Object.entries(localeConfig).map(([locale, entry]) => [
      locale,
      {
        ...entry,
        enabledHours: {
          start: utcHourToLocal(entry.enabledHours.start, timezone),
          end: utcHourToLocal(entry.enabledHours.end, timezone),
        },
      },
    ]),
  );
}

// ─── Default config helpers ───────────────────────────────────────────────────

function getDefaultLocaleEntry(): {
  leadsPerWeek: number;
  enabledDays: number[];
  enabledHours: { start: number; end: number };
} {
  return {
    leadsPerWeek: 0,
    enabledDays: [1, 2, 3, 4, 5],
    enabledHours: { start: 7, end: 15 },
  };
}

function getDefaultCampaignConfig(): CampaignStarterConfigGetResponseOutput {
  const isProduction = env.NODE_ENV === Environment.PRODUCTION;
  return {
    dryRun: false,
    minAgeHours: 0,
    localeConfig: {
      "en-GLOBAL": getDefaultLocaleEntry(),
      "de-DE": getDefaultLocaleEntry(),
      "pl-PL": getDefaultLocaleEntry(),
    },
    // eslint-disable-next-line i18next/no-literal-string
    schedule: isProduction ? "*/5 * * * *" : "*/1 * * * *",
    enabled: false,
    priority: isProduction ? CronTaskPriority.MEDIUM : CronTaskPriority.LOW,
    timeout: isProduction ? 300000 : 180000,
    retries: isProduction ? 3 : 2,
    retryDelay: isProduction ? 30000 : 15000,
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class CampaignStarterRepository {
  private static getCurrentEnvironment(): Environment {
    return env.NODE_ENV === Environment.PRODUCTION
      ? Environment.PRODUCTION
      : Environment.DEVELOPMENT;
  }

  private static async formatConfigResponse(
    dbConfig: CampaignStarterConfig,
    timezone: string | undefined,
  ): Promise<CampaignStarterConfigGetResponseOutput> {
    const defaults = getDefaultCampaignConfig();
    const [cronTask] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.routeId, "campaign-starter"))
      .limit(1);

    const localeConfig = convertLocaleConfigFromUtc(
      dbConfig.localeConfig,
      timezone,
    );

    if (!cronTask) {
      return {
        dryRun: dbConfig.dryRun === 1,
        minAgeHours: dbConfig.minAgeHours,
        localeConfig,
        schedule: defaults.schedule,
        enabled: defaults.enabled,
        priority: defaults.priority,
        timeout: defaults.timeout,
        retries: defaults.retries,
        retryDelay: defaults.retryDelay,
      };
    }

    return {
      dryRun: dbConfig.dryRun === 1,
      minAgeHours: dbConfig.minAgeHours,
      localeConfig,
      schedule: cronTask.schedule,
      enabled: cronTask.enabled ?? false,
      priority: cronTask.priority,
      timeout: cronTask.timeout ?? defaults.timeout,
      retries: cronTask.retries ?? defaults.retries,
      retryDelay: cronTask.retryDelay ?? defaults.retryDelay,
    };
  }

  private static async saveCronTaskSettings(
    config: CampaignStarterConfigGetResponseOutput,
  ): Promise<void> {
    const [existingCronTask] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.routeId, "campaign-starter"))
      .limit(1);

    const taskInput = {
      dryRun: config.dryRun,
      force: false,
      minAgeHours: config.minAgeHours,
      localeConfig: config.localeConfig,
      schedule: config.schedule,
      enabled: config.enabled,
      priority: config.priority,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
    };

    const cronData: NewCronTask<
      Omit<CampaignStarterPostRequestOutput, "timezone">
    > = {
      id: "campaign-starter",
      shortId: "campaign-starter",
      routeId: "campaign-starter",
      displayName: "campaign-starter",
      version: "1.0.0",
      category: TaskCategory.LEAD_MANAGEMENT,
      // eslint-disable-next-line i18next/no-literal-string
      description: "Campaign starter cron task",
      schedule: config.schedule,
      enabled: config.enabled,
      priority: config.priority,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
      taskInput,
      updatedAt: new Date(),
    };

    if (existingCronTask) {
      await db
        .update(cronTasks)
        .set(cronData)
        .where(eq(cronTasks.routeId, "campaign-starter"));
    } else {
      await db.insert(cronTasks).values(cronData);
    }
  }

  private static formatConfigForDb(
    config: CampaignStarterConfigGetResponseOutput,
    environment: string,
  ): CampaignStarterConfig {
    return {
      id: crypto.randomUUID(),
      environment,
      dryRun: config.dryRun ? 1 : 0,
      minAgeHours: config.minAgeHours,
      localeConfig: config.localeConfig,
      localeAccumulators: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async getConfig(
    user: { id: string },
    timezone: string | undefined,
    t: CampaignsCampaignStarterT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigGetResponseOutput>> {
    try {
      const environment = CampaignStarterRepository.getCurrentEnvironment();
      logger.debug("Fetching campaign starter config", {
        environment,
        userId: user.id,
        timezone,
      });

      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        const config = await CampaignStarterRepository.formatConfigResponse(
          existingConfig,
          timezone,
        );
        return success(config);
      }

      return success(getDefaultCampaignConfig());
    } catch (error) {
      logger.error("Error fetching campaign starter config", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateConfig(
    data: CampaignStarterPostRequestOutput,
    timezone: string | undefined,
    user: { id: string },
    t: CampaignsCampaignStarterT,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      const environment = CampaignStarterRepository.getCurrentEnvironment();
      logger.debug("Updating campaign starter config", {
        environment,
        userId: user.id,
        dryRun: data.dryRun,
        enabled: data.enabled,
        timezone,
      });

      const dataWithUtcHours = {
        ...data,
        localeConfig: convertLocaleConfigToUtc(data.localeConfig, timezone),
      };

      const dbConfig = CampaignStarterRepository.formatConfigForDb(
        dataWithUtcHours,
        environment,
      );

      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        await db
          .update(campaignStarterConfigs)
          .set(dbConfig)
          .where(eq(campaignStarterConfigs.environment, environment));
      } else {
        await db.insert(campaignStarterConfigs).values({
          ...dbConfig,
          createdAt: new Date(),
        });
      }

      await CampaignStarterRepository.saveCronTaskSettings(dataWithUtcHours);

      return success();
    } catch (error) {
      logger.error("Error updating campaign starter config", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async ensureConfigExists(
    user: { id: string },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CampaignStarterConfigGetResponseOutput>> {
    try {
      const environment = CampaignStarterRepository.getCurrentEnvironment();
      logger.debug("Ensuring config exists", {
        environment,
        userId: user.id,
        locale,
      });

      const [existingConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      if (existingConfig) {
        const config = await CampaignStarterRepository.formatConfigResponse(
          existingConfig,
          "UTC",
        );
        return success(config);
      }

      const defaultConfig = getDefaultCampaignConfig();
      const dbConfig = CampaignStarterRepository.formatConfigForDb(
        defaultConfig,
        environment,
      );

      await db.insert(campaignStarterConfigs).values({
        ...dbConfig,
        createdAt: new Date(),
      });

      return success(defaultConfig);
    } catch (error) {
      logger.error("Error ensuring config exists", parseError(error));
      return success(getDefaultCampaignConfig());
    }
  }

  static async processLocaleLeads(
    locale: CountryLanguage,
    leadsPerRun: number | undefined,
    minAgeDate: Date,
    config: CampaignStarterConfigGetResponseOutput,
    result: CampaignStarterPostResponseOutput,
    logger: EndpointLogger,
    t: CampaignsCampaignStarterT,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Processing locale leads for campaign starter", {
        locale,
        leadsPerRun,
        minAgeDate: minAgeDate.toISOString(),
        dryRun: config.dryRun,
      });

      const languageCode = getLanguageFromLocale(locale);

      const SYSTEM_LEAD_ID = "00000000-0000-0000-0000-000000000000";
      const smtpT = smtpScopedTranslation.scopedT(locale).t;
      const capacityResult = await SmtpRepository.getTotalSendingCapacity(
        {},
        {
          isPublic: true,
          leadId: SYSTEM_LEAD_ID,
          roles: [],
        },
        smtpT,
        logger,
      );
      const totalRemainingCapacity = capacityResult.success
        ? capacityResult.data.remainingCapacity
        : 100;

      const [globalPendingCount] = await db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(leads)
        .where(
          and(eq(leads.status, LeadStatus.PENDING), isNotNull(leads.email)),
        );

      const existingGlobalPending = globalPendingCount?.count || 0;

      const optimalQueueSize = Math.max(totalRemainingCapacity * 2, 100);
      const globalAvailableSlots = Math.max(
        0,
        optimalQueueSize - existingGlobalPending,
      );

      const totalConfiguredLocales = Object.keys(
        config.localeConfig || {},
      ).length;
      const localeShare =
        totalConfiguredLocales > 0
          ? Math.ceil(globalAvailableSlots / totalConfiguredLocales)
          : globalAvailableSlots;

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

      const localeLeads = await db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.NEW),
            eq(leads.language, languageCode),
            lt(leads.createdAt, minAgeDate),
            isNull(leads.lastEmailSentAt),
            isNotNull(leads.email),
          ),
        )
        .orderBy(leads.createdAt)
        .limit(adjustedLeadsPerRun);

      if (localeLeads.length === 0) {
        return success();
      }

      for (const lead of localeLeads) {
        try {
          if (config.dryRun) {
            result.leadsStarted++;
          } else {
            if (
              !isStatusTransitionAllowed(
                lead.status,
                LeadStatus.CAMPAIGN_RUNNING,
              )
            ) {
              result.errors.push({
                leadId: lead.id,
                email: lead.email!,
                error: t("errors.invalidTransition"),
              });
              continue;
            }

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
            email: lead.email!,
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
    t: CampaignsCampaignStarterT,
  ): Promise<ResponseType<number>> {
    try {
      logger.debug("Getting failed leads count for rebalancing", { locale });

      const languageCode = getLanguageFromLocale(locale);

      const failedStates = [
        LeadStatus.BOUNCED,
        LeadStatus.INVALID,
        LeadStatus.UNSUBSCRIBED,
      ];

      const now = new Date();
      const currentDay = now.getUTCDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
      startOfWeek.setUTCHours(0, 0, 0, 0);

      const failedLeads = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(
          and(
            eq(leads.language, languageCode),
            inArray(leads.status, failedStates),
            gte(leads.updatedAt, startOfWeek),
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
    t: CampaignsCampaignStarterT,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Marking failed leads as processed for rebalancing", {
        locale,
      });

      const languageCode = getLanguageFromLocale(locale);

      const failedStates = [
        LeadStatus.BOUNCED,
        LeadStatus.INVALID,
        LeadStatus.UNSUBSCRIBED,
      ];

      const now = new Date();
      const currentDay = now.getUTCDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
      startOfWeek.setUTCHours(0, 0, 0, 0);

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

  private static calculatePerRunBudget(
    weeklyQuota: number,
    schedule: string,
    enabledDays: number[],
    enabledHours: { start: number; end: number },
    logger: EndpointLogger,
  ): { exactBudget: number; perRunBudget: number; totalRunsPerWeek: number } {
    const frequencyMinutes = getCronFrequencyMinutes(schedule, logger);
    const runsPerHour = 60 / frequencyMinutes;
    const enabledHoursCount = Math.max(
      0,
      enabledHours.end - enabledHours.start,
    );
    const enabledDaysCount = enabledDays.length;
    const totalRunsPerWeek = runsPerHour * enabledHoursCount * enabledDaysCount;
    if (totalRunsPerWeek <= 0) {
      return { exactBudget: 0, perRunBudget: 0, totalRunsPerWeek: 0 };
    }
    const exactBudget = weeklyQuota / totalRunsPerWeek;
    return {
      exactBudget,
      perRunBudget: Math.floor(exactBudget),
      totalRunsPerWeek,
    };
  }

  static async run(
    data: CampaignStarterPostRequestOutput,
    timezone: string | undefined,
    user: { id: string },
    t: CampaignsCampaignStarterT,
    logger: EndpointLogger,
    platform?: string,
  ): Promise<ResponseType<CampaignStarterPostResponseOutput>> {
    // When called as a cron task, skip config update - use existing DB config instead
    if (platform !== Platform.CRON) {
      const saveResult = await CampaignStarterRepository.updateConfig(
        data,
        timezone,
        user,
        t,
        logger,
      );
      if (!saveResult.success) {
        return saveResult as never;
      }
    }

    const locale = (Object.keys(data.localeConfig)[0] ??
      "en-GLOBAL") as CountryLanguage;

    const configResult = await CampaignStarterRepository.ensureConfigExists(
      user,
      locale,
      logger,
    );

    if (!configResult.success || !configResult.data) {
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const config = { ...configResult.data, dryRun: data.dryRun };

    if (!config.enabled) {
      logger.debug("Campaign starter is disabled in configuration");
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: 0,
        errors: [],
        quotaDetails: [],
      });
    }

    // Fetch current fractional accumulators from DB
    const environment = CampaignStarterRepository.getCurrentEnvironment();
    const [configRow] = await db
      .select({ localeAccumulators: campaignStarterConfigs.localeAccumulators })
      .from(campaignStarterConfigs)
      .where(eq(campaignStarterConfigs.environment, environment))
      .limit(1);
    const localeAccumulators: Record<string, number> =
      configRow?.localeAccumulators ?? {};
    const updatedAccumulators: Record<string, number> = {
      ...localeAccumulators,
    };

    const startTime = Date.now();
    const now = new Date();
    const currentDay = now.getUTCDay() || 7;
    const currentHour = now.getUTCHours();

    const result: CampaignStarterPostResponseOutput = {
      leadsProcessed: 0,
      leadsStarted: 0,
      leadsSkipped: 0,
      executionTimeMs: 0,
      errors: [],
      quotaDetails: [],
    };

    const minAgeDate = new Date();
    minAgeDate.setHours(minAgeDate.getHours() - config.minAgeHours);

    const daysFromMonday = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    for (const localeValue of Object.values(CountryLanguageValues)) {
      const localeEntry = config.localeConfig[localeValue];
      if (localeEntry === undefined) {
        continue;
      }
      const {
        leadsPerWeek: weeklyQuota,
        enabledDays,
        enabledHours,
      } = localeEntry;
      const weeklyQuotaNum = typeof weeklyQuota === "number" ? weeklyQuota : 0;

      if (!data.force) {
        if (!enabledDays.includes(currentDay)) {
          logger.debug("Campaign starter skipped locale: not an enabled day", {
            locale: localeValue,
            currentDay,
            enabledDays,
          });
          result.leadsSkipped++;
          continue;
        }

        if (
          currentHour < enabledHours.start ||
          currentHour > enabledHours.end
        ) {
          logger.debug(
            "Campaign starter skipped locale: outside enabled hours",
            {
              locale: localeValue,
              currentHour,
              enabledHours,
            },
          );
          result.leadsSkipped++;
          continue;
        }
      }

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

      const { exactBudget, perRunBudget, totalRunsPerWeek } =
        CampaignStarterRepository.calculatePerRunBudget(
          weeklyQuotaNum,
          config.schedule,
          enabledDays,
          enabledHours,
          logger,
        );

      // Accumulate fractional budget across runs
      const carry = localeAccumulators[localeValue] ?? 0;
      const combined = exactBudget + carry;
      const accumulatedBudget = Math.floor(combined);
      const newCarry = combined - accumulatedBudget;
      updatedAccumulators[localeValue] = newCarry;

      logger.debug("Campaign starter fractional accumulator", {
        locale: localeValue,
        exactBudget,
        carry,
        combined,
        accumulatedBudget,
        newCarry,
      });

      if (accumulatedBudget <= 0) {
        logger.debug(
          "Campaign starter skipped locale: accumulated budget is 0",
          {
            locale: localeValue,
            weeklyQuota: weeklyQuotaNum,
            totalRunsPerWeek,
            carry,
            exactBudget,
          },
        );
        result.quotaDetails = [
          ...(result.quotaDetails ?? []),
          {
            locale: localeValue,
            weeklyQuota: weeklyQuotaNum,
            leadsStartedThisWeek: startedThisWeek,
            remainingQuota,
            totalRunsPerWeek,
            perRunBudget,
            dispatched: 0,
          },
        ];
        continue;
      }

      const leadsThisRun = Math.min(accumulatedBudget, remainingQuota);

      const failedLeadsCountResult =
        await CampaignStarterRepository.getFailedLeadsCount(
          localeValue,
          logger,
          t,
        );
      const failedLeadsCount = failedLeadsCountResult.success
        ? failedLeadsCountResult.data
        : 0;

      const adjustedLeadsPerRun = leadsThisRun + failedLeadsCount;

      const leadsStartedBefore = result.leadsStarted;

      await CampaignStarterRepository.processLocaleLeads(
        localeValue,
        adjustedLeadsPerRun,
        minAgeDate,
        config,
        result,
        logger,
        t,
      );

      const dispatched = result.leadsStarted - leadsStartedBefore;

      const quotaDetail: NonNullable<
        CampaignStarterPostResponseOutput["quotaDetails"]
      >[number] = {
        locale: localeValue,
        weeklyQuota: weeklyQuotaNum,
        leadsStartedThisWeek: startedThisWeek,
        remainingQuota,
        totalRunsPerWeek,
        perRunBudget,
        dispatched,
      };
      result.quotaDetails = [...(result.quotaDetails ?? []), quotaDetail];

      if (failedLeadsCount > 0) {
        await CampaignStarterRepository.markFailedLeadsAsProcessed(
          localeValue,
          logger,
          t,
        );
      }
    }

    // Persist updated fractional accumulators (skip on dry run - don't mutate state)
    if (!config.dryRun) {
      await db
        .update(campaignStarterConfigs)
        .set({ localeAccumulators: updatedAccumulators, updatedAt: new Date() })
        .where(eq(campaignStarterConfigs.environment, environment));
    }

    result.executionTimeMs = Date.now() - startTime;

    return success({
      leadsProcessed: result.leadsProcessed,
      leadsStarted: result.leadsStarted,
      leadsSkipped: result.leadsSkipped,
      executionTimeMs: result.executionTimeMs,
      errors: result.errors,
      quotaDetails: result.quotaDetails,
    });
  }
}
