/**
 * Newsletter Subscribe SMS Templates
 * SMS notifications for newsletter subscription operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { smsServiceRepository } from "../../emails/sms-service/repository";
import { CampaignType } from "../../emails/smtp-client/enum";
import type {
  SubscribePostRequestOutput as NewsletterSubscriptionType,
  SubscribePostResponseOutput as NewsletterSubscriptionResponseType,
} from "./definition";

/**
 * SMS Service Repository Interface for Newsletter Subscriptions
 */
export interface NewsletterSubscribeSmsService {
  sendWelcomeSms(
    subscriptionData: NewsletterSubscriptionType,
    responseData: NewsletterSubscriptionResponseType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendAdminNotificationSms(
    subscriptionData: NewsletterSubscriptionType,
    responseData: NewsletterSubscriptionResponseType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;
}

/**
 * SMS Service Repository Implementation for Newsletter Subscriptions
 */
export class NewsletterSubscribeSmsServiceImpl implements NewsletterSubscribeSmsService {
  /**
   * Send welcome SMS to new newsletter subscriber
   */
  async sendWelcomeSms(
    subscriptionData: NewsletterSubscriptionType,
    responseData: NewsletterSubscriptionResponseType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Extract phone number from user profile if available
      const userPhone = (user as { phone?: string } | null)?.phone;

      if (!userPhone) {
        logger.debug("No phone number available for newsletter welcome SMS", {
          subscriptionEmail: subscriptionData.email,
          userId: user?.id,
        });
        return success({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("Sending welcome SMS to newsletter subscriber", {
        subscriptionEmail: subscriptionData.email,
        subscriptionName: subscriptionData.name,
        userPhone,
      });

      const message = this.generateWelcomeMessage(subscriptionData, locale);

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: userPhone,
          message,
          campaignType: CampaignType.NEWSLETTER,
        },
        user || { isPublic: true },
        locale,
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message: "app.api.newsletter.error.general.internal_server_error",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending newsletter welcome SMS", parseError(error));
      return fail({
        message: "app.api.newsletter.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Send SMS notification to admin about new newsletter subscription
   */
  async sendAdminNotificationSms(
    subscriptionData: NewsletterSubscriptionType,
    responseData: NewsletterSubscriptionResponseType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Get admin phone number from environment or config
      const adminPhone = env.ADMIN_NOTIFICATION_PHONE;

      if (!adminPhone) {
        logger.debug(
          "No admin phone number configured, skipping SMS notification",
          {
            subscriptionEmail: subscriptionData.email,
          },
        );
        return success({
          messageId: "",
          sent: false,
        });
      }

      logger.debug(
        "Sending admin notification SMS for newsletter subscription",
        {
          subscriptionEmail: subscriptionData.email,
          subscriptionName: subscriptionData.name,
          adminPhone,
        },
      );

      const message = this.generateAdminNotificationMessage(
        subscriptionData,
        locale,
      );

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: adminPhone,
          message,
          campaignType: CampaignType.NOTIFICATION,
        },
        user || { id: crypto.randomUUID(), isPublic: false },
        locale,
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message: "app.api.newsletter.error.general.internal_server_error",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending admin notification SMS", parseError(error));
      return fail({
        message: "app.api.newsletter.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate welcome message for new newsletter subscriber
   */
  private generateWelcomeMessage(
    subscriptionData: NewsletterSubscriptionType,
    locale: CountryLanguage,
  ): string {
    const name = subscriptionData.name || "there";
    const { t } = simpleT(locale);
    return t("app.api.newsletter.subscribe.sms.welcome.message", {
      name,
    });
  }

  /**
   * Generate admin notification message for newsletter subscription
   */
  private generateAdminNotificationMessage(
    subscriptionData: NewsletterSubscriptionType,
    locale: CountryLanguage,
  ): string {
    const { name, email } = subscriptionData;
    const displayName = name || email;
    const { t } = simpleT(locale);
    return t("app.api.newsletter.subscribe.sms.admin_notification.message", {
      displayName,
      email,
    });
  }
}

/**
 * SMS Service Singleton Instance
 */
export const newsletterSubscribeSmsService =
  new NewsletterSubscribeSmsServiceImpl();

/**
 * Helper functions for easy integration in routes
 */
export const sendWelcomeSms = async (
  subscriptionData: NewsletterSubscriptionType,
  responseData: NewsletterSubscriptionResponseType,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await newsletterSubscribeSmsService.sendWelcomeSms(
    subscriptionData,
    responseData,
    user,
    locale,
    logger,
  );
};

export const sendAdminNotificationSms = async (
  subscriptionData: NewsletterSubscriptionType,
  responseData: NewsletterSubscriptionResponseType,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await newsletterSubscribeSmsService.sendAdminNotificationSms(
    subscriptionData,
    responseData,
    user,
    locale,
    logger,
  );
};
