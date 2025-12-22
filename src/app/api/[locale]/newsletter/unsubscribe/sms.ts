/**
 * Newsletter Unsubscribe SMS Templates
 * SMS notifications for newsletter unsubscription operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { smsServiceRepository } from "../../emails/sms-service/repository";
import { CampaignType } from "../../emails/smtp-client/enum";
import { smsEnv } from "../../sms/env";
import type { UnsubscribePostRequestOutput } from "./definition";

// Use proper imported types
type UnsubscribeRequestOutput = UnsubscribePostRequestOutput;

/**
 * SMS Service Repository Interface for Newsletter Unsubscriptions
 */
export interface NewsletterUnsubscribeSmsService {
  sendConfirmationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendAdminNotificationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    user: JwtPayloadType,
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
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Phone number field not yet implemented in user schema
      // TODO: Add phone field to user type when SMS feature is fully implemented
      const userPhone: string | undefined = undefined;

      if (!userPhone) {
        logger.debug(
          "No phone number available for unsubscribe confirmation SMS",
          {
            unsubscribeEmail: unsubscribeData.email,
            userId: user?.id,
          },
        );
        return success({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("Sending unsubscribe confirmation SMS", {
        unsubscribeEmail: unsubscribeData.email,
        userPhone,
      });
      const { t } = simpleT(locale);
      const message = t(
        "app.api.newsletter.unsubscribe.sms.confirmation.message",
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
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message:
            "app.api.newsletter.unsubscribe.sms.errors.confirmation_failed.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: smsResult.message || t("app.common.error.sending_sms"),
          },
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error(
        "Error sending unsubscribe confirmation SMS",
        parseError(error),
      );
      return fail({
        message:
          "app.api.newsletter.unsubscribe.sms.errors.confirmation_failed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Send SMS notification to admin about newsletter unsubscription
   */
  async sendAdminNotificationSms(
    unsubscribeData: UnsubscribeRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Get admin phone number from environment or config
      const adminPhone = smsEnv.ADMIN_NOTIFICATION_PHONE;

      if (!adminPhone) {
        logger.debug(
          "No admin phone number configured, skipping SMS notification",
          {
            unsubscribeEmail: unsubscribeData.email,
          },
        );
        return success({
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
        "app.api.newsletter.unsubscribe.sms.admin_notification.message",
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
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message:
            "app.api.newsletter.unsubscribe.sms.errors.admin_notification_failed.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: t(smsResult.message) || t("app.common.error.sending_sms"),
          },
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending admin notification SMS", parseError(error));
      return fail({
        message:
          "app.api.newsletter.unsubscribe.sms.errors.admin_notification_failed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
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
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return newsletterUnsubscribeSmsService.sendConfirmationSms(
    unsubscribeData,
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
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return newsletterUnsubscribeSmsService.sendAdminNotificationSms(
    unsubscribeData,
    user,
    locale,
    logger,
  );
};
