/**
 * Newsletter Status Repository
 * Handles newsletter subscription status checks
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../system/db";
import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  StatusGetRequestOutput,
  StatusGetResponseOutput,
} from "./definition";

export interface NewsletterStatusRepository {
  getStatus(
    data: StatusGetRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatusGetResponseOutput>>;
}

export class NewsletterStatusRepositoryImpl
  implements NewsletterStatusRepository
{
  async getStatus(
    data: StatusGetRequestOutput,
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
        message: "app.api.newsletter.status.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

export const newsletterStatusRepository = new NewsletterStatusRepositoryImpl();
