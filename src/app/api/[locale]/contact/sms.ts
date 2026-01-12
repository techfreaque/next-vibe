/**
 * Contact Form SMS Templates
 * SMS notifications for contact form submissions
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { smsServiceRepository } from "../emails/sms-service/repository";
import { CampaignType } from "../emails/smtp-client/enum";
import type { ContactRequestOutput } from "./definition";

/**
 * SMS Service Repository Interface for Contact Forms
 */
export interface ContactSmsService {
  sendAdminNotificationSms(
    contactData: ContactRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendConfirmationSms(
    contactData: ContactRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;
}

/**
 * SMS Service Repository Implementation for Contact Forms
 */
export class ContactSmsServiceImpl implements ContactSmsService {
  /**
   * Send SMS notification to admin about new contact form submission
   */
  async sendAdminNotificationSms(
    contactData: ContactRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Get admin phone number from environment or config
      // Note: ADMIN_NOTIFICATION_PHONE not configured in env, SMS notifications disabled
      const adminPhone: string | undefined = undefined;

      if (!adminPhone) {
        logger.debug("app.api.contact.sms.admin.phone.missing", {
          contactEmail: contactData.email,
        });
        return success({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("app.api.contact.sms.admin.send.start", {
        contactEmail: contactData.email,
        contactName: contactData.name,
        adminPhone,
      });

      const message = this.generateAdminNotificationMessage(
        contactData,
        locale,
      );

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: adminPhone,
          message,
          campaignType: CampaignType.NOTIFICATION,
        },
        user ||
          ({ id: crypto.randomUUID(), isPublic: false } as JwtPayloadType),
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message: "app.api.contact.error.general.internal_server_error",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: smsResult,
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("app.api.contact.sms.admin.send.error", parseError(error));
      return fail({
        message: "app.api.contact.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Send confirmation SMS to contact form submitter
   */
  async sendConfirmationSms(
    contactData: ContactRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Extract phone number from lead data or user profile
      // This would need to be added to the contact form if SMS confirmations are desired
      const userPhone = (user as { phone?: string } | null)?.phone;

      if (!userPhone) {
        logger.debug("app.api.contact.sms.confirmation.phone.missing", {
          contactEmail: contactData.email,
          userId: user?.id,
        });
        return success({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("app.api.contact.sms.confirmation.send.start", {
        contactEmail: contactData.email,
        contactName: contactData.name,
        userPhone,
      });

      const message = this.generateConfirmationMessage(contactData, locale);

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: userPhone,
          message,
          campaignType: CampaignType.TRANSACTIONAL,
        },
        user || ({ isPublic: true } as JwtPayloadType),
        logger,
      );

      if (!smsResult.success) {
        return fail({
          message: "app.api.contact.error.general.internal_server_error",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: smsResult,
        });
      }

      return success({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error(
        "app.api.contact.sms.confirmation.send.error",
        parseError(error),
      );
      return fail({
        message: "app.api.contact.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate admin notification message for contact form submission
   */
  private generateAdminNotificationMessage(
    contactData: ContactRequestOutput,
    locale: CountryLanguage,
  ): string {
    const { name, email, subject } = contactData;
    const { t } = simpleT(locale);

    // Use i18n translations: app.api.contact.sms.admin.notification
    return t("app.api.contact.sms.admin.notification", {
      name,
      email,
      subject,
    });
  }

  /**
   * Generate confirmation message for contact form submitter
   */
  private generateConfirmationMessage(
    contactData: ContactRequestOutput,
    locale: CountryLanguage,
  ): string {
    const { name } = contactData;
    const { t } = simpleT(locale);

    // Use i18n translations: app.api.contact.sms.confirmation.message
    return t("app.api.contact.sms.confirmation.message", {
      name,
    });
  }
}

/**
 * SMS Service Singleton Instance
 */
export const contactSmsService = new ContactSmsServiceImpl();

/**
 * Helper functions for easy integration in routes
 */
export const sendAdminNotificationSms = async (
  contactData: ContactRequestOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await contactSmsService.sendAdminNotificationSms(
    contactData,
    user,
    locale,
    logger,
  );
};

export const sendConfirmationSms = async (
  contactData: ContactRequestOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await contactSmsService.sendConfirmationSms(
    contactData,
    user,
    locale,
    logger,
  );
};
