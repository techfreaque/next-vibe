/**
 * Newsletter Subscribe Repository
 * Handles newsletter subscription business logic
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { getNewsletterSubscriptionStatus } from "@/app/api/[locale]/leads/enum";
import { LeadsRepository } from "@/app/api/[locale]/leads/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
} from "./definition";
import type { NewsletterSubscribeT } from "./i18n";

export class NewsletterSubscribeRepository {
  static async subscribe(
    data: SubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: NewsletterSubscribeT,
  ): Promise<ResponseType<SubscribePostResponseOutput>> {
    try {
      // Get leadId from user prop (JWT payload) - always present
      const leadId = user.leadId;

      logger.debug("Processing newsletter subscription", {
        email: data.email,
        hasName: !!data.name,
        hasPreferences: !!data.preferences?.length,
        leadId,
      });

      // Handle lead linking using leadId from JWT
      try {
        logger.debug("Linking newsletter subscription to lead", {
          leadId,
          email: data.email,
        });

        const leadResult = await LeadsRepository.getLeadById(
          leadId,
          logger,
          locale,
        );
        if (leadResult.success) {
          logger.debug("Lead found for newsletter subscription", {
            leadId,
            email: data.email,
          });

          // Access nested data structure properly
          const currentStatus = leadResult.data.lead.basicInfo.status;
          const newStatus = getNewsletterSubscriptionStatus(currentStatus);

          const updateData = {
            status: newStatus,
            metadata: {
              ...leadResult.data.lead.metadata.metadata,
              newsletterSubscribed: true,
              newsletterSubscriptionDate: new Date().toISOString(),
              subscribedEmail: data.email,
              subscribedName: data.name || "",
            },
          };

          const updateResult = await LeadsRepository.updateLead(
            leadId,
            updateData,
            logger,
            locale,
          );

          if (updateResult.success) {
            logger.debug("Lead updated with newsletter subscription status", {
              leadId,
              email: data.email,
            });
          } else {
            logger.error(
              "Failed to update lead with newsletter subscription status",
              {
                leadId,
                email: data.email,
                error: updateResult.message,
              },
            );
          }
        } else {
          logger.debug("Lead not found for newsletter subscription", {
            leadId,
            email: data.email,
          });
        }
      } catch (error) {
        logger.error("Error linking newsletter subscription to lead", {
          error: parseError(error).message,
          leadId,
          email: data.email,
        });
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
          logger.debug("Email already subscribed to newsletter", {
            email: data.email,
            subscriptionId: existingSubscription.id,
          });
          return success({
            success: true,
            message: t("response.alreadySubscribed"),
            leadId,
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

        return success({
          success: true,
          message: t("response.success"),
          leadId,
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

      logger.debug("Newsletter subscription created successfully", {
        email: data.email,
        subscriptionId: newSubscription[0].id,
      });

      // Send SMS notifications after successful subscription (fire-and-forget)
      const { sendWelcomeSms, sendAdminNotificationSms } =
        await import("./sms");
      sendWelcomeSms(data, user, locale, logger).catch((smsError: Error) =>
        logger.debug("Welcome SMS failed but continuing", { smsError }),
      );
      sendAdminNotificationSms(data, user, locale, logger).catch(
        (smsError: Error) =>
          logger.debug("Admin SMS failed but continuing", { smsError }),
      );

      return success({
        success: true,
        message: t("response.success"),
        leadId,
        subscriptionId: newSubscription[0].id,
        userId: newSubscription[0].userId || undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Newsletter subscription failed", {
        error: parsedError.message,
        email: data.email,
      });

      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
