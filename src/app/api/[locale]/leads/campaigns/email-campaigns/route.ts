/**
 * Email Campaigns Route Handler
 * Called by cron or manually from admin UI to process email campaigns
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { EmailCampaignStage } from "../../enum";
import definitions from "./definition";
import { EmailCampaignsRepository } from "./repository";
import { createEmptyEmailCampaignResult } from "./types";

const STAGE_PRIORITIES: Record<string, number> = {
  [EmailCampaignStage.NOT_STARTED]: 0,
  [EmailCampaignStage.INITIAL]: 1,
  [EmailCampaignStage.FOLLOWUP_1]: 2,
  [EmailCampaignStage.FOLLOWUP_2]: 3,
  [EmailCampaignStage.FOLLOWUP_3]: 4,
  [EmailCampaignStage.NURTURE]: 5,
  [EmailCampaignStage.REACTIVATION]: 6,
};

const ENABLED_STAGES = [
  EmailCampaignStage.INITIAL,
  EmailCampaignStage.FOLLOWUP_1,
  EmailCampaignStage.FOLLOWUP_2,
  EmailCampaignStage.FOLLOWUP_3,
  EmailCampaignStage.NURTURE,
  EmailCampaignStage.REACTIVATION,
];

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) => {
      const batchSize = data.batchSize;
      const maxEmailsPerRun = data.maxEmailsPerRun;
      const dryRun = data.dryRun;

      // Bootstrap pending leads
      await EmailCampaignsRepository.bootstrapPendingLeads(
        batchSize,
        t,
        logger,
      );

      // Process stages by priority
      const stagesToProcess = ENABLED_STAGES.toSorted((a, b) => {
        return (STAGE_PRIORITIES[a] ?? 999) - (STAGE_PRIORITIES[b] ?? 999);
      });

      const globalResult = createEmptyEmailCampaignResult();

      for (const stage of stagesToProcess) {
        const remainingQuota = maxEmailsPerRun - globalResult.emailsSent;
        if (remainingQuota <= 0) {
          break;
        }

        const stageResult = await EmailCampaignsRepository.processStage(
          stage,
          { batchSize: Math.min(batchSize, remainingQuota), dryRun },
          t,
          logger,
        );

        if (!stageResult.success) {
          // Log but don't abort — return partial results
          logger.error("Stage processing failed", {
            stage,
            error: stageResult.message,
          });
          break;
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
