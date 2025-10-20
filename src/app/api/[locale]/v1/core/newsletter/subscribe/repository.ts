/**
 * Newsletter Subscribe Repository
 * Handles newsletter subscription business logic
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { getNewsletterSubscriptionStatus } from "@/app/api/[locale]/v1/core/leads/enum";
import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
} from "./definition";

export interface NewsletterSubscribeRepository {
  subscribe(
    data: SubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscribePostResponseOutput>>;
}

export class NewsletterSubscribeRepositoryImpl
  implements NewsletterSubscribeRepository
{
  async subscribe(
    data: SubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscribePostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      // Get leadId from user prop (JWT payload) - always present
      const leadId = user.leadId;

      logger.debug("app.api.v1.core.newsletter.subscribe.repository.starting", {
        email: data.email,
        hasName: !!data.name,
        hasPreferences: !!data.preferences?.length,
        leadId,
      });

      // Handle lead linking using leadId from JWT
      try {
        logger.debug(
          "app.api.v1.core.newsletter.subscribe.repository.linking_to_lead",
          {
            leadId,
            email: data.email,
          },
        );

        const leadResult = await leadsRepository.getLeadById(
          leadId,
          user,
          locale,
          logger,
        );
        if (leadResult.success) {
          logger.debug(
            "app.api.v1.core.newsletter.subscribe.repository.lead_found",
            {
              leadId,
              email: data.email,
            },
          );

          // Access nested data structure properly
          const currentStatus = leadResult.data.lead.basicInfo.status;
          const newStatus = getNewsletterSubscriptionStatus(currentStatus);

          const updateData = {
            status: newStatus,
            metadata: {
              ...(leadResult.data.lead.metadata.metadata || {}),
              newsletterSubscribed: true,
              newsletterSubscriptionDate: new Date().toISOString(),
              subscribedEmail: data.email,
              subscribedName: data.name || "",
            },
          };

          const updateResult = await leadsRepository.updateLead(
            leadId,
            updateData,
            user,
            locale,
            logger,
          );

          if (updateResult.success) {
            logger.debug(
              "app.api.v1.core.newsletter.subscribe.repository.lead_updated",
              {
                leadId,
                email: data.email,
              },
            );
          } else {
            logger.error(
              "app.api.v1.core.newsletter.subscribe.repository.lead_update_failed",
              {
                leadId,
                email: data.email,
                error: updateResult.message,
              },
            );
          }
        } else {
          logger.debug(
            "app.api.v1.core.newsletter.subscribe.repository.lead_not_found",
            {
              leadId,
              email: data.email,
            },
          );
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.newsletter.subscribe.repository.lead_linking_error",
          {
            error: parseError(error).message,
            leadId,
            email: data.email,
          },
        );
      }

      // Check if already subscribed
      const [existingSubscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, data.email))
        .limit(1);

      if (existingSubscription) {
        if (
          existingSubscription.status ===
          NewsletterSubscriptionStatus.SUBSCRIBED
        ) {
          logger.debug(
            "app.api.v1.core.newsletter.subscribe.repository.already_subscribed",
            {
              email: data.email,
              subscriptionId: existingSubscription.id,
            },
          );
          return createSuccessResponse({
            success: true,
            message: t(
              "app.api.v1.core.newsletter.subscribe.response.alreadySubscribed",
            ),
            leadId,
            subscriptionId: existingSubscription.id,
            userId: existingSubscription.userId || undefined,
          });
        }

        // Reactivate subscription
        logger.debug(
          "app.api.v1.core.newsletter.subscribe.repository.reactivating",
          {
            email: data.email,
            previousStatus: existingSubscription.status,
          },
        );

        await db
          .update(newsletterSubscriptions)
          .set({
            status: NewsletterSubscriptionStatus.SUBSCRIBED,
            marketingConsent: true,
            source: "website",
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscriptions.email, data.email));

        return createSuccessResponse({
          success: true,
          message: t("app.api.v1.core.newsletter.subscribe.response.success"),
          leadId,
          subscriptionId: existingSubscription.id,
          userId: existingSubscription.userId || undefined,
        });
      }

      // Create new subscription
      logger.debug(
        "app.api.v1.core.newsletter.subscribe.repository.creating_new",
        {
          email: data.email,
          hasName: !!data.name,
          preferencesCount: data.preferences?.length || 0,
        },
      );

      const newSubscription = await db
        .insert(newsletterSubscriptions)
        .values({
          email: data.email,
          name: data.name,
          status: NewsletterSubscriptionStatus.SUBSCRIBED,
          marketingConsent: true,
        })
        .returning();

      logger.debug(
        "app.api.v1.core.newsletter.subscribe.repository.created_successfully",
        {
          email: data.email,
          subscriptionId: newSubscription[0].id,
        },
      );

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.newsletter.subscribe.response.success"),
        leadId,
        subscriptionId: newSubscription[0].id,
        userId: newSubscription[0].userId || undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.newsletter.subscribe.repository.subscription_failed",
        {
          error: parsedError.message,
          email: data.email,
        },
      );

      return createErrorResponse(
        "app.api.v1.core.newsletter.subscribe.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const newsletterSubscribeRepository =
  new NewsletterSubscribeRepositoryImpl();
