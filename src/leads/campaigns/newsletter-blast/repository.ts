/**
 * Newsletter Blast repository
 * Enqueues a one-off, consent-filtered newsletter to confirmed opt-ins.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { EmailJourneyVariant } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

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

export class NewsletterBlastRepository {
  static async run(
    data: NewsletterBlastPostRequestOutput,
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

      logger.info("newsletter-blast.run.done", {
        journeyVariant: BLAST_JOURNEY_VARIANT,
        dryRun: data.dryRun,
        ...result,
      });

      return success({
        scheduled: result.scheduled,
        skipped: result.skipped,
        errors: result.errors,
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
