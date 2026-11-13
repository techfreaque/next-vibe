/**
 * Newsletter Confirm Repository
 * Double opt-in: flips confirmedAt when the mailed token comes back.
 */

import "server-only";

import { and, eq, isNull, lte, sql } from "drizzle-orm";
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
import { NewsletterSubscriptionStatus } from "../enum";
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
        await NewsletterConfirmRepository.markFunnelStep(subscription, logger);
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
  /**
   * Signup opt-in: the account verification link doubles as the newsletter
   * confirm link (one email, not two). Confirms the account's own pending
   * subscription for its current email, but only one that already existed
   * when the verification email was issued, so the email that carried the
   * link also told the user it confirms the newsletter.
   * @returns number of subscriptions confirmed
   */
  static async confirmForVerifiedAccount(
    {
      userId,
      email,
      linkIssuedAt,
    }: { userId: string; email: string; linkIssuedAt: Date },
    logger: EndpointLogger,
  ): Promise<number> {
    const now = new Date();
    const confirmed = await db
      .update(newsletterSubscriptions)
      .set({ confirmedAt: now, updatedAt: now })
      .where(
        and(
          eq(newsletterSubscriptions.userId, userId),
          eq(sql`lower(${newsletterSubscriptions.email})`, email.toLowerCase()),
          eq(
            newsletterSubscriptions.status,
            NewsletterSubscriptionStatus.SUBSCRIBED,
          ),
          isNull(newsletterSubscriptions.confirmedAt),
          lte(newsletterSubscriptions.subscriptionDate, linkIssuedAt),
        ),
      )
      .returning({
        id: newsletterSubscriptions.id,
        userId: newsletterSubscriptions.userId,
        leadId: newsletterSubscriptions.leadId,
      });
    for (const subscription of confirmed) {
      logger.info(
        "Newsletter subscription confirmed via account verification",
        {
          subscriptionId: subscription.id,
          userId,
        },
      );
      await NewsletterConfirmRepository.markFunnelStep(subscription, logger);
    }
    return confirmed.length;
  }

  /**
   * Does the account hold a pending (unconfirmed) subscription for its email?
   * The verification email then says its link confirms the newsletter too.
   */
  static async hasPendingForAccount(
    userId: string,
    email: string,
  ): Promise<boolean> {
    const [row] = await db
      .select({ id: newsletterSubscriptions.id })
      .from(newsletterSubscriptions)
      .where(
        and(
          eq(newsletterSubscriptions.userId, userId),
          eq(sql`lower(${newsletterSubscriptions.email})`, email.toLowerCase()),
          eq(
            newsletterSubscriptions.status,
            NewsletterSubscriptionStatus.SUBSCRIBED,
          ),
          isNull(newsletterSubscriptions.confirmedAt),
        ),
      )
      .limit(1);
    return row !== undefined;
  }

  /** Growth funnel step (write-once on the journey) */
  private static async markFunnelStep(
    subscription: { userId: string | null; leadId: string | null },
    logger: EndpointLogger,
  ): Promise<void> {
    const { GrowthJourneyRepository } =
      await import("@/leads/growth/repository");
    const { FunnelStep } = await import("@/leads/growth/enum");
    await GrowthJourneyRepository.markStep(
      { userId: subscription.userId, leadId: subscription.leadId },
      FunnelStep.NEWSLETTER,
      logger,
    );
  }
}
