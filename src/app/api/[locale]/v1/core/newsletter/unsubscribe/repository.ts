/**
 * Newsletter Unsubscribe Repository
 * Handles newsletter unsubscription business logic
 */

import "server-only";

import { eq } from "drizzle-orm";

import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "../../system/db";
import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "../../user/auth/definition";
import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  UnsubscribePostRequestOutput,
  UnsubscribePostResponseOutput,
} from "./definition";

export interface NewsletterUnsubscribeRepository {
  unsubscribe(
    data: UnsubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UnsubscribePostResponseOutput>>;
}

export class NewsletterUnsubscribeRepositoryImpl
  implements NewsletterUnsubscribeRepository
{
  async unsubscribe(
    data: UnsubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UnsubscribePostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Starting newsletter unsubscription", {
        email: data.email,
      });

      // Update lead status to unsubscribed if lead exists
      const leadUpdateResult =
        await leadsRepository.updateLeadStatusOnNewsletterUnsubscribe(
          data.email,
          logger,
        );
      if (!leadUpdateResult.success) {
        logger.error(
          "Failed to update lead status during newsletter unsubscribe",
          {
            email: data.email,
            errorType: leadUpdateResult.errorType,
            message: leadUpdateResult.message,
          },
        );
      } else {
        logger.debug("Lead status update result", {
          email: data.email,
          leadFound: leadUpdateResult.data?.leadFound,
        });
      }

      // Handle newsletter subscription
      const [subscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, data.email))
        .limit(1);

      if (!subscription) {
        // Create an opt-out record for users who haven't subscribed yet
        logger.debug("Creating opt-out record for non-subscriber", {
          email: data.email,
        });

        await db.insert(newsletterSubscriptions).values({
          email: data.email,
          status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
          marketingConsent: false,
          subscriptionDate: new Date(),
          unsubscribedDate: new Date(),
          source: "opt-out",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        logger.debug("Created opt-out record for newsletter", {
          email: data.email,
        });

        return createSuccessResponse({
          success: true,
          message: t("app.api.v1.core.newsletter.unsubscribe.response.success"),
        });
      }

      if (subscription.status === NewsletterSubscriptionStatus.UNSUBSCRIBED) {
        logger.debug("User already unsubscribed from newsletter", {
          email: data.email,
        });
        return createSuccessResponse({
          success: true,
          message: t("app.api.v1.core.newsletter.unsubscribe.response.success"),
        });
      }

      // Update existing subscription status
      await db
        .update(newsletterSubscriptions)
        .set({
          status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
          marketingConsent: false,
          unsubscribedDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(newsletterSubscriptions.email, data.email));

      logger.debug("Successfully unsubscribed from newsletter", {
        email: data.email,
        subscriptionId: subscription.id,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.newsletter.unsubscribe.response.success"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Newsletter unsubscription failed", {
        error: parsedError.message,
        email: data.email,
      });

      return createErrorResponse(
        "app.api.v1.core.newsletter.unsubscribe.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const newsletterUnsubscribeRepository =
  new NewsletterUnsubscribeRepositoryImpl();
