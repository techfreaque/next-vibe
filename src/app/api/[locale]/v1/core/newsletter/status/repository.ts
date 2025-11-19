/**
 * Newsletter Status Repository
 * Handles newsletter subscription status checks
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../system/db";
import type { JwtPayloadType } from "../../user/auth/types";
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
        return success({
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

      return success({
        subscribed: isSubscribed,
        status: subscription.status,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get newsletter status", {
        error: parsedError.message,
        email: data.email,
      });

      return fail({
        message: "app.api.v1.core.newsletter.status.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

export const newsletterStatusRepository = new NewsletterStatusRepositoryImpl();
