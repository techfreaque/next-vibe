/**
 * Newsletter Blast repository
 * Enqueues a one-off, consent-filtered newsletter to confirmed opt-ins and,
 * with send=true, dispatches exactly that newsletter's rows in the same run.
 * The general email-campaigns dispatcher is never needed for this.
 *
 * Never twice: one row per normalized address (one locale), addresses that
 * already got this newsletter are skipped, and every send first claims
 * (variant, stage, address) in email_send_log under a unique index, so
 * reruns, deploys, re-fired cron tasks, retries and concurrent dispatchers
 * can never mail the same newsletter to the same address again.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as emailCampaignsScopedTranslation } from "../email-campaigns/i18n";
import { EmailCampaignsRepository } from "../email-campaigns/repository";
import { campaignSchedulerService } from "../emails/services/scheduler";
import type {
  NewsletterBlastPostRequestOutput,
  NewsletterBlastPostResponseOutput,
} from "./definition";
import type { NewsletterBlastT } from "./i18n";

/**
 * The journey this blast enqueues. Bump this when wiring the next one-off
 * newsletter so the task sends the current issue.
 */
const BLAST_JOURNEY_VARIANT = EmailJourneyVariant.NEWSLETTER_NOV_2026;

/** Rows per dispatch batch, and a hard stop so a bad state can never loop. */
const SEND_BATCH_SIZE = 50;
const MAX_SEND_BATCHES = 100;

export class NewsletterBlastRepository {
  static async run(
    data: NewsletterBlastPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: NewsletterBlastT,
  ): Promise<ResponseType<NewsletterBlastPostResponseOutput>> {
    try {
      const result =
        await campaignSchedulerService.bootstrapConsentedNewsletterBlast(
          BLAST_JOURNEY_VARIANT,
          logger,
          { dryRun: data.dryRun },
        );

      let sent = 0;
      let sendFailed = 0;
      let sendSkipped = 0;
      if (data.send && !data.dryRun) {
        const campaignsT = emailCampaignsScopedTranslation.scopedT(locale).t;
        for (let batch = 0; batch < MAX_SEND_BATCHES; batch++) {
          const stage = await EmailCampaignsRepository.processStage(
            EmailCampaignStage.INITIAL,
            {
              batchSize: SEND_BATCH_SIZE,
              dryRun: false,
              journeyVariant: BLAST_JOURNEY_VARIANT,
            },
            campaignsT,
            logger,
          );
          if (!stage.success) {
            logger.error("newsletter-blast.send.batch_failed", {
              batch,
              message: stage.message,
            });
            break;
          }
          sent += stage.data.emailsSent;
          sendFailed += stage.data.emailsFailed;
          sendSkipped += stage.data.duplicatesSkipped;
          // Sent rows leave PENDING, failed ones are retried later or
          // cancelled, consent-gated ones are halted, rows whose address
          // already got this newsletter are marked duplicate (send-log
          // claim): an empty batch means done.
          if (stage.data.leadsProcessed <= stage.data.inFlightSkipped) {
            break;
          }
        }
      }

      const byLocale = Object.entries(result.byLocale)
        .toSorted(([a], [b]) => a.localeCompare(b))
        .map(([loc, count]) => `${loc}: ${count}`)
        .join(", ");

      logger.info("newsletter-blast.run.done", {
        journeyVariant: BLAST_JOURNEY_VARIANT,
        dryRun: data.dryRun,
        send: data.send,
        ...result,
        sent,
        sendSkipped,
        sendFailed,
      });

      return success({
        audience: result.audience,
        byLocale,
        scheduled: result.scheduled,
        alreadyPending: result.alreadyPending,
        cancelled: result.cancelled,
        alreadySent: result.alreadySent,
        duplicates: result.duplicates,
        errors: result.errors,
        sent,
        sendSkipped,
        sendFailed,
      });
    } catch (error) {
      logger.error("newsletter-blast.run.error", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
