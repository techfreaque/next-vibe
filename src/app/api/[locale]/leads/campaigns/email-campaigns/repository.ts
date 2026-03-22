/**
 * Email Campaigns Repository
 * Handles business logic and configuration for email campaign operations
 */

import "server-only";

import { render } from "@react-email/render";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { CampaignType } from "@/app/api/[locale]/messenger/accounts/enum";
import { scopedTranslation as smtpScopedTranslation } from "@/app/api/[locale]/messenger/providers/email/smtp-client/i18n";
import { SmtpSendingRepository } from "@/app/api/[locale]/messenger/providers/email/smtp-client/sending/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  cronTasks,
  type NewCronTask,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { env } from "@/config/env";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../user/auth/types";
import { leads } from "../../db";
import type { EmailCampaignStageValue } from "../../enum";
import {
  EmailCampaignStage as EmailCampaignStageEnum,
  EmailProvider,
  LeadStatus,
} from "../../enum";
import type { LeadWithEmailType } from "../../types";
import { emailRendererService } from "../emails/services/renderer";
import { campaignSchedulerService } from "../emails/services/scheduler";
import type {
  EmailCampaignsConfigGetResponseOutput,
  EmailCampaignsPostRequestOutput,
} from "./definition";
import type { EmailCampaignsT } from "./i18n";
import type { EmailCampaignsPostResponseOutput } from "./definition";

const STAGE_PRIORITIES: Record<string, number> = {
  [EmailCampaignStageEnum.NOT_STARTED]: 0,
  [EmailCampaignStageEnum.INITIAL]: 1,
  [EmailCampaignStageEnum.FOLLOWUP_1]: 2,
  [EmailCampaignStageEnum.FOLLOWUP_2]: 3,
  [EmailCampaignStageEnum.FOLLOWUP_3]: 4,
  [EmailCampaignStageEnum.NURTURE]: 5,
  [EmailCampaignStageEnum.REACTIVATION]: 6,
};

const ENABLED_STAGES = [
  EmailCampaignStageEnum.INITIAL,
  EmailCampaignStageEnum.FOLLOWUP_1,
  EmailCampaignStageEnum.FOLLOWUP_2,
  EmailCampaignStageEnum.FOLLOWUP_3,
  EmailCampaignStageEnum.NURTURE,
  EmailCampaignStageEnum.REACTIVATION,
];

/**
 * Stage processing options
 */
interface StageProcessOptions {
  batchSize: number;
  dryRun: boolean;
}

const EMAIL_CAMPAIGNS_TASK_ID = "email-campaigns";

function getDefaultConfig(): EmailCampaignsConfigGetResponseOutput {
  const isProduction = env.NODE_ENV === Environment.PRODUCTION;
  return {
    enabled: false,
    dryRun: !isProduction,
    batchSize: isProduction ? 100 : 10,
    maxEmailsPerRun: isProduction ? 500 : 10,
    schedule: isProduction ? "*/1 7-15 * * 1-5" : "*/3 * * * *",
    priority: CronTaskPriority.HIGH,
    timeout: 1800000,
    retries: 3,
    retryDelay: 30000,
  };
}

/**
 * Email Campaigns Repository
 */
export class EmailCampaignsRepository {
  static async getConfig(
    user: JwtPayloadType,
    t: EmailCampaignsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignsConfigGetResponseOutput>> {
    try {
      logger.info("Fetching email campaigns config", { userId: user.id });

      const [existing] = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, EMAIL_CAMPAIGNS_TASK_ID))
        .limit(1);

      if (!existing) {
        return success(getDefaultConfig());
      }

      const defaults = getDefaultConfig();
      const taskInput = existing.taskInput;

      return success({
        enabled: existing.enabled,
        dryRun:
          typeof taskInput.dryRun === "boolean"
            ? taskInput.dryRun
            : defaults.dryRun,
        batchSize:
          typeof taskInput.batchSize === "number"
            ? taskInput.batchSize
            : defaults.batchSize,
        maxEmailsPerRun:
          typeof taskInput.maxEmailsPerRun === "number"
            ? taskInput.maxEmailsPerRun
            : defaults.maxEmailsPerRun,
        schedule: existing.schedule,
        priority: existing.priority ?? defaults.priority,
        timeout: existing.timeout ?? defaults.timeout,
        retries: existing.retries ?? defaults.retries,
        retryDelay: existing.retryDelay ?? defaults.retryDelay,
      });
    } catch (error) {
      logger.error("Error fetching email campaigns config", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateConfig(
    data: EmailCampaignsPostRequestOutput,
    user: JwtPayloadType,
    t: EmailCampaignsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignsPostRequestOutput>> {
    try {
      logger.info("Updating email campaigns config", {
        userId: user.id,
        enabled: data.enabled,
        dryRun: data.dryRun,
      });

      if (!data.enabled) {
        await db
          .delete(cronTasks)
          .where(eq(cronTasks.id, EMAIL_CAMPAIGNS_TASK_ID));
        logger.debug("Removed email-campaigns cron task (disabled)");
        return success();
      }

      const cronData: NewCronTask<EmailCampaignsPostRequestOutput> = {
        id: EMAIL_CAMPAIGNS_TASK_ID,
        shortId: EMAIL_CAMPAIGNS_TASK_ID,
        routeId: EMAIL_CAMPAIGNS_TASK_ID,
        displayName: "Email Campaigns",
        description: "Send automated email campaigns to leads",
        version: "1.0.0",
        category: TaskCategory.LEAD_MANAGEMENT,
        schedule: data.schedule,
        enabled: true,
        priority: data.priority,
        timeout: data.timeout,
        retries: data.retries,
        retryDelay: data.retryDelay,
        taskInput: {
          enabled: data.enabled,
          dryRun: data.dryRun,
          batchSize: data.batchSize,
          maxEmailsPerRun: data.maxEmailsPerRun,
          schedule: data.schedule,
          priority: data.priority,
          timeout: data.timeout,
          retries: data.retries,
          retryDelay: data.retryDelay,
        },
        updatedAt: new Date(),
      };

      const [existing] = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(eq(cronTasks.id, EMAIL_CAMPAIGNS_TASK_ID))
        .limit(1);

      if (existing) {
        await db
          .update(cronTasks)
          .set(cronData)
          .where(eq(cronTasks.id, EMAIL_CAMPAIGNS_TASK_ID));
      } else {
        await db.insert(cronTasks).values(cronData);
      }

      logger.debug("Saved email-campaigns cron task");
      return success();
    } catch (error) {
      logger.error("Error updating email campaigns config", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async run(
    data: EmailCampaignsPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: EmailCampaignsT,
  ): Promise<
    ResponseType<{
      emailsScheduled: number;
      emailsSent: number;
      emailsFailed: number;
      leadsProcessed: number;
    }>
  > {
    const saveResult = await EmailCampaignsRepository.updateConfig(
      data,
      user,
      t,
      logger,
    );
    if (!saveResult.success) {
      return saveResult as never;
    }

    const { batchSize, maxEmailsPerRun, dryRun } = data;

    await EmailCampaignsRepository.bootstrapPendingLeads(batchSize, t, logger);

    const stagesToProcess = ENABLED_STAGES.toSorted(
      (a, b) => (STAGE_PRIORITIES[a] ?? 999) - (STAGE_PRIORITIES[b] ?? 999),
    );

    const globalResult: EmailCampaignsPostResponseOutput = {
      emailsScheduled: 0,
      emailsSent: 0,
      emailsFailed: 0,
      leadsProcessed: 0,
    };

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
  }

  static async bootstrapPendingLeads(
    batchSize: number,
    t: EmailCampaignsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      const pendingLeads = await db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.PENDING),
            isNotNull(leads.email),
            isNull(leads.convertedAt),
          ),
        )
        .limit(batchSize);

      logger.debug(`Bootstrapping ${pendingLeads.length} pending leads`);

      let bootstrapped = 0;

      for (const lead of pendingLeads) {
        try {
          const campaignId =
            await campaignSchedulerService.scheduleInitialCampaign(
              lead.id,
              {},
              logger,
            );

          if (campaignId) {
            await db
              .update(leads)
              .set({
                status: LeadStatus.CAMPAIGN_RUNNING,
                updatedAt: new Date(),
              })
              .where(eq(leads.id, lead.id));

            bootstrapped++;
            logger.debug("Bootstrapped lead into campaign", {
              leadId: lead.id,
              email: lead.email,
              campaignId,
            });
          }
        } catch (error) {
          logger.error("Failed to bootstrap lead into campaign", {
            leadId: lead.id,
            error: parseError(error).message,
          });
        }
      }

      logger.info(
        `Bootstrapped ${bootstrapped}/${pendingLeads.length} pending leads`,
      );
      return success(bootstrapped);
    } catch (error) {
      logger.error("Failed to bootstrap pending leads", {
        error: parseError(error).message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async processStage(
    stage: typeof EmailCampaignStageValue,
    options: StageProcessOptions,
    t: EmailCampaignsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignsPostResponseOutput>> {
    try {
      logger.debug(
        `Processing stage: ${stage} (batch=${options.batchSize}, dryRun=${options.dryRun})`,
      );

      const result: EmailCampaignsPostResponseOutput & {
        errors: Array<{
          leadId: string;
          email: string;
          stage: string;
          error: string;
        }>;
        stageTransitions: Record<string, number>;
      } = {
        emailsScheduled: 0,
        emailsSent: 0,
        emailsFailed: 0,
        leadsProcessed: 0,
        errors: [],
        stageTransitions: {},
      };

      const pendingEmails = await campaignSchedulerService.getPendingEmails(
        options.batchSize,
        logger,
      );

      result.leadsProcessed = pendingEmails.length;

      if (pendingEmails.length === 0) {
        logger.debug(`No pending emails for stage: ${stage}`);
        return success(result);
      }

      for (const campaign of pendingEmails) {
        try {
          if (options.dryRun) {
            logger.debug("Dry run - would send email", {
              campaignId: campaign.id,
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              journeyVariant: campaign.journeyVariant,
            });
            result.emailsScheduled++;
            continue;
          }

          const [fullLead] = await db
            .select()
            .from(leads)
            .where(eq(leads.id, campaign.leadId))
            .limit(1);

          if (!fullLead) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: "Lead not found",
            });
            continue;
          }

          const leadLocale = getLocaleFromLanguageAndCountry(
            fullLead.language,
            fullLead.country,
          );
          const { t: simpleLocalT } = simpleT(leadLocale);

          if (!fullLead.email) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: "Lead has no email",
            });
            continue;
          }

          const leadWithEmail: LeadWithEmailType = {
            ...fullLead,
            email: fullLead.email,
            linkedLeadsCount: 0,
            hasLinkedUser: false,
          };

          const rendered = await emailRendererService.renderEmail(
            leadWithEmail,
            campaign.journeyVariant,
            campaign.stage,
            {
              locale: leadLocale,
              companyName: "",
              companyEmail: "",
              campaignId: campaign.id,
              unsubscribeUrl: `${env.NEXT_PUBLIC_APP_URL}/${leadLocale}/newsletter/unsubscribe?email=${encodeURIComponent(fullLead.email ?? "")}`,
              trackingUrl: env.NEXT_PUBLIC_APP_URL,
            },
            logger,
          );

          if (!rendered) {
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: "Template rendering failed",
            });
            continue;
          }

          const html = await render(rendered.jsx);

          const smtpT = smtpScopedTranslation.scopedT(leadLocale).t;
          const sendResult = await SmtpSendingRepository.sendEmail(
            {
              to: campaign.lead.email,
              toName: campaign.lead.businessName || undefined,
              subject: rendered.subject,
              html,
              text: rendered.text,
              senderName: simpleLocalT("config.appName"),
              replyTo: contactClientRepository.getSupportEmail(leadLocale),
              selectionCriteria: {
                campaignType: CampaignType.LEAD_CAMPAIGN,
                emailJourneyVariant: campaign.journeyVariant,
                emailCampaignStage: campaign.stage,
                country: fullLead.country,
                language: fullLead.language,
              },
              leadId: campaign.leadId,
              campaignId: campaign.id,
            },
            logger,
            smtpT,
          );

          if (!sendResult.success) {
            const errorMsg = sendResult.message ?? "Unknown send error";
            const retried = await campaignSchedulerService.scheduleRetry(
              campaign.id,
              campaign.retryCount,
              errorMsg,
              logger,
            );
            result.emailsFailed++;
            result.errors.push({
              leadId: campaign.leadId,
              email: campaign.lead.email,
              stage: campaign.stage,
              error: retried
                ? `Send failed, retry ${campaign.retryCount + 1} scheduled: ${errorMsg}`
                : `Send failed, max retries exceeded: ${errorMsg}`,
            });
            logger.error("Failed to send campaign email", {
              campaignId: campaign.id,
              leadId: campaign.leadId,
              retryCount: campaign.retryCount,
              retried,
              error: errorMsg,
            });
            continue;
          }

          await campaignSchedulerService.markEmailAsSent(
            campaign.id,
            logger,
            EmailProvider.SMTP,
            sendResult.data?.messageId ?? null,
            sendResult.data?.accountId ?? null,
          );

          result.emailsSent++;
          result.stageTransitions[campaign.stage] =
            (result.stageTransitions[campaign.stage] ?? 0) + 1;
        } catch (error) {
          const errorMsg = parseError(error).message;
          await campaignSchedulerService.scheduleRetry(
            campaign.id,
            campaign.retryCount,
            errorMsg,
            logger,
          );
          result.emailsFailed++;
          result.errors.push({
            leadId: campaign.leadId,
            email: campaign.lead.email,
            stage: campaign.stage,
            error: errorMsg,
          });
          logger.error("Failed to process campaign email", {
            campaignId: campaign.id,
            leadId: campaign.leadId,
            retryCount: campaign.retryCount,
            error: errorMsg,
          });
        }
      }

      logger.debug(
        `Stage ${stage} done: ${result.emailsSent} sent, ${result.emailsFailed} failed, ${result.leadsProcessed} processed`,
      );

      return success(result);
    } catch (error) {
      logger.error("Failed to process stage", {
        stage,
        error: parseError(error).message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
