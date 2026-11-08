/**
 * Newsletter Confirm Repository
 * Double opt-in: flips confirmedAt when the mailed token comes back.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { newsletterSubscriptions } from "../db";
import type {
  ConfirmPostRequestOutput,
  ConfirmPostResponseOutput,
} from "./definition";
import type { NewsletterConfirmT } from "./i18n";

export class NewsletterConfirmRepository {
  static async confirm(
    data: ConfirmPostRequestOutput,
    logger: EndpointLogger,
    t: NewsletterConfirmT,
  ): Promise<ResponseType<ConfirmPostResponseOutput>> {
    try {
      const [subscription] = await db
        .select({
          id: newsletterSubscriptions.id,
          email: newsletterSubscriptions.email,
          confirmedAt: newsletterSubscriptions.confirmedAt,
          userId: newsletterSubscriptions.userId,
          leadId: newsletterSubscriptions.leadId,
        })
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.confirmationToken, data.token))
        .limit(1);

      if (!subscription) {
        return fail({
          message: t("post.errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Idempotent: a second click (or a mail scanner) changes nothing
      if (!subscription.confirmedAt) {
        const now = new Date();
        await db
          .update(newsletterSubscriptions)
          .set({ confirmedAt: now, updatedAt: now })
          .where(eq(newsletterSubscriptions.id, subscription.id));
        logger.debug("Newsletter subscription confirmed", {
          subscriptionId: subscription.id,
        });
        // Growth funnel step (write-once on the journey)
        const { GrowthJourneyRepository } =
          await import("@/leads/growth/repository");
        const { FunnelStep } = await import("@/leads/growth/enum");
        await GrowthJourneyRepository.markStep(
          { userId: subscription.userId, leadId: subscription.leadId },
          FunnelStep.NEWSLETTER,
          logger,
        );
      }

      return success({
        confirmed: true,
        email: subscription.email,
        bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
      });
    } catch (error) {
      logger.error("Newsletter confirmation failed", parseError(error));
      return fail({
        message: t("post.errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
