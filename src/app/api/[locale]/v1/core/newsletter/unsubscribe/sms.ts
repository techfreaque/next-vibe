/**
 * Newsletter Unsubscribe SMS Templates
 * SMS notifications for newsletter unsubscription operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { smsServiceRepository } from "../../emails/sms-service/repository";
import { CampaignType } from "../../emails/smtp-client/enum";
import type {
  UnsubscribePostRequestOutput,
  UnsubscribePostResponseOutput,
} from "./definition";

// Use proper imported types
type UnsubscribeRequestOutput = UnsubscribePostRequestOutput;
type UnsubscribeResponseOutput = UnsubscribePostResponseOutput;

/**
 * SMS Service Repository Interface for Newsletter Unsubscriptions
 */
export interface NewsletterUnsubscribeSmsService {
  sendConfirmationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    responseData: UnsubscribeResponseOutput,
    user: JwtPayloadType | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendAdminNotificationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    responseData: UnsubscribeResponseOutput,
    user: JwtPayloadType | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;
}

/**
 * SMS Service Repository Implementation for Newsletter Unsubscriptions
 */
export class NewsletterUnsubscribeSmsServiceImpl
  implements NewsletterUnsubscribeSmsService
{
  /**
   * Send confirmation SMS to user who unsubscribed from newsletter
   */
  async sendConfirmationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    responseData: UnsubscribeResponseOutput,
    user: JwtPayloadType | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Extract phone number from user profile if available
      const userPhone = (user as { phone?: string } | null)?.phone;

      if (!userPhone) {
        logger.debug(
          "No phone number available for unsubscribe confirmation SMS",
          {
            unsubscribeEmail: unsubscribeData.email,
            userId: user?.id,
          },
        );
        return createSuccessResponse({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("Sending unsubscribe confirmation SMS", {
        unsubscribeEmail: unsubscribeData.email,
        userPhone,
        responseMessage: responseData.message,
      });
      const { t } = simpleT(locale);
      const message = t(
        "app.api.v1.core.newsletter.unsubscribe.sms.confirmation.message",
        {
          email: unsubscribeData.email,
        },
      );

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: userPhone,
          message,
          campaignType: CampaignType.NOTIFICATION,
        },
        user || { isPublic: true as const },
        locale,
        logger,
      );

      if (!smsResult.success) {
        return createErrorResponse(
          "app.api.v1.core.newsletter.unsubscribe.sms.errors.confirmation_failed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: smsResult.message || t("app.common.error.sending_sms") },
        );
      }

      return createSuccessResponse({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error(
        "Error sending unsubscribe confirmation SMS",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.newsletter.unsubscribe.sms.errors.confirmation_failed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Send SMS notification to admin about newsletter unsubscription
   */
  async sendAdminNotificationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    responseData: UnsubscribeResponseOutput,
    user: JwtPayloadType | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Get admin phone number from environment or config
      // eslint-disable-next-line node/no-process-env
      const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE;

      if (!adminPhone) {
        logger.debug(
          "No admin phone number configured, skipping SMS notification",
          {
            unsubscribeEmail: unsubscribeData.email,
          },
        );
        return createSuccessResponse({
          messageId: "",
          sent: false,
        });
      }

      logger.debug(
        "Sending admin notification SMS for newsletter unsubscribe",
        {
          unsubscribeEmail: unsubscribeData.email,
          adminPhone,
        },
      );

      const { t } = simpleT(locale);

      const message = t(
        "app.api.v1.core.newsletter.unsubscribe.sms.admin_notification.message",
        {
          email: unsubscribeData.email,
        },
      );

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: adminPhone,
          message,
          campaignType: CampaignType.NOTIFICATION,
        },
        user || { id: "system", isPublic: false as const },
        locale,
        logger,
      );

      if (!smsResult.success) {
        return createErrorResponse(
          "app.api.v1.core.newsletter.unsubscribe.sms.errors.admin_notification_failed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: t(smsResult.message) || t("app.common.error.sending_sms") },
        );
      }

      return createSuccessResponse({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending admin notification SMS", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.newsletter.unsubscribe.sms.errors.admin_notification_failed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * SMS Service Singleton Instance
 */
export const newsletterUnsubscribeSmsService =
  new NewsletterUnsubscribeSmsServiceImpl();

/**
 * Convenience function: Send confirmation SMS
 */
export const sendConfirmationSms = (
  unsubscribeData: UnsubscribeRequestOutput,
  responseData: UnsubscribeResponseOutput,
  user: JwtPayloadType | null,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return newsletterUnsubscribeSmsService.sendConfirmationSms(
    unsubscribeData,
    responseData,
    user,
    locale,
    logger,
  );
};

/**
 * Convenience function: Send admin notification SMS
 */
export const sendAdminNotificationSms = (
  unsubscribeData: UnsubscribeRequestOutput,
  responseData: UnsubscribeResponseOutput,
  user: JwtPayloadType | null,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return newsletterUnsubscribeSmsService.sendAdminNotificationSms(
    unsubscribeData,
    responseData,
    user,
    locale,
    logger,
  );
};
