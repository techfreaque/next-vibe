/**
 * Email Campaigns Route Handler
 * Called by cron to process email campaigns
 */

import "server-only";

import { fail, success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { EmailCampaignStage } from "../../enum";
import { getDefaultConfig } from "./config";
import definitions from "./definition";
import { emailCampaignsRepository } from "./repository";
import { createEmptyEmailCampaignResult } from "./types";

const STAGE_PRIORITIES: Record<
  (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
  number
> = {
  [EmailCampaignStage.NOT_STARTED]: 0,
  [EmailCampaignStage.INITIAL]: 1,
  [EmailCampaignStage.FOLLOWUP_1]: 2,
  [EmailCampaignStage.FOLLOWUP_2]: 3,
  [EmailCampaignStage.FOLLOWUP_3]: 4,
  [EmailCampaignStage.NURTURE]: 5,
  [EmailCampaignStage.REACTIVATION]: 6,
};

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      const config = getDefaultConfig();
      // Override from request data
      const batchSize = data.batchSize ?? config.batchSize;
      const maxEmailsPerRun = data.maxEmailsPerRun ?? config.maxEmailsPerRun;
      const dryRun = data.dryRun ?? config.dryRun;

      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentDay = now.getUTCDay();

      // Check time window
      if (
        currentHour < config.enabledHours.start ||
        currentHour > config.enabledHours.end ||
        !config.enabledDays.includes(currentDay)
      ) {
        return success({
          emailsScheduled: 0,
          emailsSent: 0,
          emailsFailed: 0,
          leadsProcessed: 0,
        });
      }

      // Bootstrap pending leads
      await emailCampaignsRepository.bootstrapPendingLeads(batchSize, logger);

      // Process stages by priority
      const stagesToProcess = config.enabledStages.toSorted((a, b) => {
        return (STAGE_PRIORITIES[a] ?? 999) - (STAGE_PRIORITIES[b] ?? 999);
      });

      const globalResult = createEmptyEmailCampaignResult();

      for (const stage of stagesToProcess) {
        const remainingQuota = maxEmailsPerRun - globalResult.emailsSent;
        if (remainingQuota <= 0) {
          break;
        }

        const stageResult = await emailCampaignsRepository.processStage(
          stage,
          { batchSize: Math.min(batchSize, remainingQuota), dryRun },
          logger,
        );

        if (!stageResult.success) {
          return fail(stageResult);
        }

        globalResult.emailsScheduled += stageResult.data.emailsScheduled;
        globalResult.emailsSent += stageResult.data.emailsSent;
        globalResult.emailsFailed += stageResult.data.emailsFailed;
        globalResult.leadsProcessed += stageResult.data.leadsProcessed;
      }

      return success({
        emailsScheduled: globalResult.emailsScheduled,
        emailsSent: globalResult.emailsSent,
        emailsFailed: globalResult.emailsFailed,
        leadsProcessed: globalResult.leadsProcessed,
      });
    },
  },
});
