/**
 * Newsletter Status Repository
 * Handles newsletter subscription status checks
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "../../user/auth/definition";
import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  StatusGetRequestOutput,
  StatusGetResponseOutput,
} from "./definition";

export interface NewsletterStatusRepository {
  getStatus(
    data: StatusGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatusGetResponseOutput>>;
}

export class NewsletterStatusRepositoryImpl
  implements NewsletterStatusRepository
{
  async getStatus(
    data: StatusGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatusGetResponseOutput>> {
    try {
      logger.debug("Getting newsletter subscription status", {
        email: data.email,
      });

      const [subscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, data.email))
        .limit(1);

      if (!subscription) {
        logger.debug("No subscription found for email", {
          email: data.email,
        });
        return createSuccessResponse({
          subscribed: false,
          status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
        });
      }

      const isSubscribed =
        subscription.status === NewsletterSubscriptionStatus.SUBSCRIBED;

      logger.debug(
        isSubscribed
          ? "User is subscribed to newsletter"
          : "User is unsubscribed from newsletter",
        {
          email: data.email,
          status: subscription.status,
          subscriptionId: subscription.id,
        },
      );

      return createSuccessResponse({
        subscribed: isSubscribed,
        status: subscription.status,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get newsletter status", {
        error: parsedError.message,
        email: data.email,
      });

      return createErrorResponse(
        "app.api.v1.core.newsletter.status.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const newsletterStatusRepository = new NewsletterStatusRepositoryImpl();
