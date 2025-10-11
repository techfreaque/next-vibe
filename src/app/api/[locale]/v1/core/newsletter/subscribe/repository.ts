/**
 * Newsletter Subscribe Repository
 * Handles newsletter subscription business logic
 */

import "server-only";

import { eq } from "drizzle-orm";

import type { Lead } from "@/app/api/[locale]/v1/core/leads/db";
import {
  getNewsletterSubscriptionStatus,
  type LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

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
      logger.debug("Starting newsletter subscription", {
        email: data.email,
        hasName: !!data.name,
        hasPreferences: !!data.preferences?.length,
        hasLeadId: !!data.inputLeadId,
      });

      // Handle lead linking if leadId is provided
      if (data.inputLeadId) {
        try {
          logger.debug("Linking newsletter subscription to lead", {
            leadId: data.inputLeadId,
            email: data.email,
          });

          const leadResult = await leadsRepository.getLeadById(
            data.inputLeadId,
            user,
            locale,
            logger,
          );
          if (leadResult.success) {
            logger.debug("Lead found for newsletter subscription", {
              leadId: data.inputLeadId,
              email: data.email,
            });

            const currentStatus = leadResult.data
              .status as (typeof LeadStatus)[keyof typeof LeadStatus];
            const newStatus = getNewsletterSubscriptionStatus(currentStatus);

            const updateData: Partial<Lead> = {
              status: newStatus,
              metadata: {
                ...leadResult.data.metadata,
                newsletterSubscribed: true,
                newsletterSubscriptionDate: new Date().toISOString(),
                subscribedEmail: data.email,
                subscribedName: data.name || "",
              },
            };

            const updateResult = await leadsRepository.updateLead(
              data.inputLeadId,
              updateData as Parameters<typeof leadsRepository.updateLead>[1],
              user,
              locale,
              logger,
            );

            if (updateResult.success) {
              logger.debug("Lead updated with newsletter subscription data", {
                leadId: data.inputLeadId,
                email: data.email,
              });
            } else {
              logger.error("Failed to update lead with newsletter data", {
                leadId: data.inputLeadId,
                email: data.email,
                error: updateResult.message,
              });
            }
          } else {
            logger.debug("Lead not found or not eligible for update", {
              leadId: data.inputLeadId,
              email: data.email,
            });
          }
        } catch (error) {
          logger.error("Error during lead linking from newsletter", {
            error: parseError(error).message,
            leadId: data.inputLeadId,
            email: data.email,
          });
        }
      }

      if (!data.inputLeadId) {
        logger.error("Newsletter subscription attempted without leadId", {
          email: data.email,
          name: data.name,
        });
        return createErrorResponse(
          "app.api.v1.core.newsletter.subscribe.errors.badRequest.title",
          ErrorResponseTypes.BAD_REQUEST,
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
          logger.debug("User already subscribed to newsletter", {
            email: data.email,
            subscriptionId: existingSubscription.id,
          });
          return createSuccessResponse({
            success: true,
            message: t(
              "app.api.v1.core.newsletter.subscribe.response.alreadySubscribed",
            ),
            leadId: data.inputLeadId || "",
            subscriptionId: existingSubscription.id,
            userId: existingSubscription.userId || undefined,
          });
        }

        // Reactivate subscription
        logger.debug("Reactivating newsletter subscription", {
          email: data.email,
          previousStatus: existingSubscription.status,
        });

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
          leadId: data.inputLeadId || "",
          subscriptionId: existingSubscription.id,
          userId: existingSubscription.userId || undefined,
        });
      }

      // Create new subscription
      logger.debug("Creating new newsletter subscription", {
        email: data.email,
        hasName: !!data.name,
        preferencesCount: data.preferences?.length || 0,
      });

      const newSubscription = await db
        .insert(newsletterSubscriptions)
        .values({
          email: data.email,
          name: data.name,
          status: NewsletterSubscriptionStatus.SUBSCRIBED,
          marketingConsent: true,
        })
        .returning();

      logger.debug("Successfully created newsletter subscription", {
        email: data.email,
        subscriptionId: newSubscription[0].id,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.newsletter.subscribe.response.success"),
        leadId: data.inputLeadId || "",
        subscriptionId: newSubscription[0].id,
        userId: newSubscription[0].userId || undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Newsletter subscription failed", {
        error: parsedError.message,
        email: data.email,
      });

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
