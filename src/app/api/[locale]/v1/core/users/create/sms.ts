/**
 * Users Create SMS Templates
 * SMS notifications for new user account creation
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { smsServiceRepository } from "../../emails/sms-service/repository";
import { CampaignType } from "../../emails/smtp-client/enum";
import type {
  UserCreateRequestTypeOutput,
  UserCreateResponseTypeOutput,
} from "./definition";

/**
 * Get localized SMS message templates using translation keys
 */
function getSmsMessage(
  messageType: "welcome" | "verification",
  t: TFunction,
  params: Record<string, string> = {},
): string {
  const translationKey =
    messageType === "welcome"
      ? "app.api.v1.core.users.create.sms.welcome.message"
      : "app.api.v1.core.users.create.sms.verification.message";

  // Get the template from translation system
  let template = t(translationKey);

  // Replace parameters in template
  Object.entries(params).forEach(([key, value]) => {
    const startPattern = "{" + "{";
    const endPattern = "}" + "}";
    const pattern = startPattern + key + endPattern;
    template = template.replaceAll(pattern, value);
  });

  return template;
}

/**
 * SMS Service Repository Interface for User Creation
 */
export interface UserCreateSmsService {
  sendWelcomeSms(
    userData: UserCreateResponseTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendVerificationSms(
    userData: UserCreateResponseTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;
}

/**
 * SMS Service Repository Implementation for User Creation
 */
export class UserCreateSmsServiceImpl implements UserCreateSmsService {
  /**
   * Send welcome SMS to newly created user
   */
  async sendWelcomeSms(
    userData: UserCreateResponseTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Only send SMS if user has a phone number
      if (!userData.responsePhone) {
        logger.debug("No phone number provided, skipping welcome SMS", {
          userId: userData.responseId,
        });
        return createSuccessResponse({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("Sending welcome SMS to new user", {
        userId: userData.responseId,
        phone: userData.responsePhone,
      });

      const message = this.generateWelcomeMessage(userData, t);

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: userData.responsePhone,
          message,
          campaignType: CampaignType.TRANSACTIONAL,
        },
        user,
        locale,
        logger,
      );

      if (!smsResult.success) {
        return createErrorResponse(
          "app.api.v1.core.users.create.sms.errors.welcome_failed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: smsResult.error },
        );
      }

      return createSuccessResponse({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending welcome SMS", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.users.create.sms.errors.welcome_failed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Send phone verification SMS to newly created user
   */
  async sendVerificationSms(
    userData: UserCreateResponseTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    try {
      // Only send SMS if user has a phone number
      if (!userData.responsePhone) {
        logger.debug("No phone number provided, skipping verification SMS", {
          userId: userData.responseId,
        });
        return createSuccessResponse({
          messageId: "",
          sent: false,
        });
      }

      logger.debug("Sending verification SMS to new user", {
        userId: userData.responseId,
        phone: userData.responsePhone,
      });

      const verificationCode = this.generateVerificationCode();
      const message = this.generateVerificationMessage(
        userData,
        verificationCode,
        t,
      );

      const smsResult = await smsServiceRepository.sendSms(
        {
          to: userData.responsePhone,
          message,
          campaignType: CampaignType.NOTIFICATION,
        },
        user,
        locale,
        logger,
      );

      if (!smsResult.success) {
        return createErrorResponse(
          "app.api.v1.core.users.create.sms.errors.verification_failed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: smsResult.error },
        );
      }

      // In a real implementation, you would store the verification code
      // in the database or cache for later verification
      logger.debug("Verification SMS sent successfully", {
        userId: userData.responseId,
        messageId: smsResult.data.result.messageId,
        // Don't log the actual verification code for security
      });

      return createSuccessResponse({
        messageId: smsResult.data.result.messageId,
        sent: true,
      });
    } catch (error) {
      logger.error("Error sending verification SMS", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.users.create.sms.errors.verification_failed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Generate welcome message for new user
   */
  private generateWelcomeMessage(
    userData: UserCreateResponseTypeOutput,
    t: TFunction,
  ): string {
    return getSmsMessage("welcome", t, {
      firstName: userData.responseFirstName,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    });
  }

  /**
   * Generate phone verification message
   */
  private generateVerificationMessage(
    userData: UserCreateResponseTypeOutput,
    code: string,
    t: TFunction,
  ): string {
    return getSmsMessage("verification", t, {
      firstName: userData.responseFirstName,
      code: code,
    });
  }

  /**
   * Generate random 6-digit verification code
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

/**
 * SMS Service Singleton Instance
 */
export const userCreateSmsService = new UserCreateSmsServiceImpl();

/**
 * Helper functions for easy integration in routes
 */
export const sendWelcomeSms = async (
  userData: UserCreateResponseTypeOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
  t: TFunction,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await userCreateSmsService.sendWelcomeSms(
    userData,
    user,
    locale,
    logger,
    t,
  );
};

export const sendVerificationSms = async (
  userData: UserCreateResponseTypeOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
  t: TFunction,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await userCreateSmsService.sendVerificationSms(
    userData,
    user,
    locale,
    logger,
    t,
  );
};
