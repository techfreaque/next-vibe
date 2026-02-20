/**
 * Campaign Starter Route Handler
 * Called by cron to start campaigns for new leads
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { CountryLanguageValues } from "@/i18n/core/config";

import { CampaignStarterConfigRepository } from "./campaign-starter-config/repository";
import definitions from "./definition";
import { CampaignStarterRepository } from "./repository";

const SYSTEM_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000000",
  isPublic: false as const,
  roles: [UserPermissionRole.ADMIN] as (typeof UserPermissionRole.ADMIN)[],
};

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const systemUser = SYSTEM_USER;

      const configResult =
        await CampaignStarterConfigRepository.ensureConfigExists(
          systemUser,
          "en-GLOBAL",
          logger,
        );

      if (!configResult.success || !configResult.data) {
        return fail({
          message:
            "app.api.leads.leadsErrors.campaigns.common.error.server.title",
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

      const result = {
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: 0,
        errors: [] as Array<{ leadId: string; email: string; error: string }>,
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
        const locale =
          CountryLanguageValues[
            localeKey as keyof typeof CountryLanguageValues
          ];
        if (!locale) {
          continue;
        }
        const weeklyQuotaNum =
          typeof weeklyQuota === "number" ? weeklyQuota : 0;

        const startedThisWeek =
          await CampaignStarterRepository.getLeadsStartedThisWeek(
            locale,
            startOfWeek,
            logger,
          );
        const remainingQuota = Math.max(0, weeklyQuotaNum - startedThisWeek);

        if (remainingQuota <= 0) {
          continue;
        }

        const failedLeadsCountResult =
          await CampaignStarterRepository.getFailedLeadsCount(locale, logger);
        const failedLeadsCount = failedLeadsCountResult.success
          ? failedLeadsCountResult.data
          : 0;

        const adjustedLeadsPerRun = remainingQuota + failedLeadsCount;

        await CampaignStarterRepository.processLocaleLeads(
          locale,
          adjustedLeadsPerRun,
          minAgeDate,
          config,
          result,
          logger,
        );

        if (failedLeadsCount > 0) {
          await CampaignStarterRepository.markFailedLeadsAsProcessed(
            locale,
            logger,
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
    },
  },
});
