/**
 * Users Create SMS Templates
 * SMS notifications for new user account creation
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { UserCreateResponseOutput } from "./definition";

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
    const startPattern = "{{";
    const endPattern = "}}";
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
    userData: UserCreateResponseOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;

  sendVerificationSms(
    userData: UserCreateResponseOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>>;
}

/**
 * SMS Service Repository Implementation for User Creation
 */
export class UserCreateSmsServiceImpl implements UserCreateSmsService {
  /**
   * Send welcome SMS to newly created user
   */
  sendWelcomeSms(
    userData: UserCreateResponseOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    // SMS functionality not available - phone field not in schema
    logger.debug(
      "SMS functionality not available (no phone field in user schema)",
      {
        userId: userData.responseId,
      },
    );
    return Promise.resolve(
      createSuccessResponse({
        messageId: "",
        sent: false,
      }),
    );
  }

  /**
   * Send phone verification SMS to newly created user
   */
  sendVerificationSms(
    userData: UserCreateResponseOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string; sent: boolean }>> {
    // SMS functionality not available - phone field not in schema
    logger.debug(
      "SMS functionality not available (no phone field in user schema)",
      {
        userId: userData.responseId,
      },
    );
    return Promise.resolve(
      createSuccessResponse({
        messageId: "",
        sent: false,
      }),
    );
  }

  /**
   * Generate welcome message for new user
   */
  private generateWelcomeMessage(
    userData: UserCreateResponseOutput,
    t: TFunction,
  ): string {
    return getSmsMessage("welcome", t, {
      privateName: userData.responsePrivateName,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    });
  }

  /**
   * Generate phone verification message
   */
  private generateVerificationMessage(
    userData: UserCreateResponseOutput,
    code: string,
    t: TFunction,
  ): string {
    return getSmsMessage("verification", t, {
      privateName: userData.responsePrivateName,
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
  userData: UserCreateResponseOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await userCreateSmsService.sendWelcomeSms(
    userData,
    user,
    locale,
    logger,
  );
};

export const sendVerificationSms = async (
  userData: UserCreateResponseOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ messageId: string; sent: boolean }>> => {
  return await userCreateSmsService.sendVerificationSms(
    userData,
    user,
    locale,
    logger,
  );
};
