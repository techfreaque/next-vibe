import { Button, Section, Text } from "@react-email/components";
import { env } from "next-vibe/server/env";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type React from "react";

import type {
  EmailFunctionType,
  EmailTemplateReturnType,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import {
  createTrackingContext,
  EmailTemplate,
} from "../../../../emails/smtp-client/components";
import { UserDetailLevel } from "../../../enum";
import { userRepository } from "../../../repository";
import { passwordRepository } from "../repository";
import type {
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
} from "./definition";

function renderPasswordResetRequestEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { firstName: string; id: string },
  translatedAppName: string,
  passwordResetUrl: string,
): React.ReactElement {
  // Create tracking context for password reset emails
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for password reset emails
    user.id, // userId for password reset emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("auth.resetPassword.email.title", {
        appName: translatedAppName,
      })}
      previewText={t("auth.resetPassword.email.previewText", {
        appName: translatedAppName,
      })}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("auth.resetPassword.email.greeting", {
          firstName: user.firstName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("auth.resetPassword.email.requestInfo", {
          appName: translatedAppName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("auth.resetPassword.email.instructions")}
      </Text>

      <Section style={{ textAlign: "center", marginTop: "32px" }}>
        <Button
          href={passwordResetUrl}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "16px",
            padding: "12px 24px",
            textDecoration: "none",
          }}
        >
          {t("auth.resetPassword.email.buttonText")}
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#6B7280",
          marginTop: "24px",
        }}
      >
        {t("auth.resetPassword.email.expirationInfo")}
      </Text>
    </EmailTemplate>
  );
}

/**
 * Password Reset Email Template
 *
 * This function renders an email template for password reset requests.
 * It's used to send a password reset link to the user's email address.
 *
 * The function:
 * 1. Verifies the user exists in the database
 * 2. Creates a password reset token
 * 3. Constructs a personalized email with a reset link
 * 4. Returns the email content and recipient information
 *
 * @param requestData - The validated request data from the client
 * @param t - The translation function
 * @param locale - The current locale
 * @returns A promise resolving to either a success or error response
 */
export const renderResetPasswordMail: EmailFunctionType<
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
  UndefinedType
> = async ({ requestData, t, locale, logger }) => {
  logger.debug("Rendering password reset email", {
    email: requestData.emailInput.email,
  });

  try {
    const userResponse = await userRepository.getUserByEmail(
      requestData.emailInput.email,
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!userResponse.success) {
      // will not get sent to the user as ignoreError is true
      return createErrorResponse(
        "email.error.no_email",
        ErrorResponseTypes.NOT_FOUND,
        { email: requestData.emailInput.email },
      );
    }

    const user = userResponse.data;

    // Create a reset token
    const tokenResponse = await passwordRepository.createResetToken(
      requestData.emailInput.email,
      logger,
    );
    if (!tokenResponse.success) {
      return createErrorResponse(
        "email.error.email_generation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email: requestData.emailInput.email },
      );
    }

    const token = tokenResponse.data;
    const passwordResetUrl = `${env.NEXT_PUBLIC_APP_URL}/${locale}/user/reset-password/${token}`;

    const translatedAppName = t("common.appName");

    return createSuccessResponse({
      toEmail: requestData.emailInput.email,
      toName: user.firstName,
      subject: t("auth.resetPassword.email.subject", {
        appName: translatedAppName,
      }),
      jsx: renderPasswordResetRequestEmailContent(
        t,
        locale,
        user,
        translatedAppName,
        passwordResetUrl,
      ),
    });
  } catch (error) {
    // TODO: Replace with proper logger when email function interface supports it
    logger.error("Error generating password reset email:", error);
    const parsedError = parseError(error);
    return createErrorResponse(
      "email.error.email_generation_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
      {
        email: requestData.emailInput.email,
        errorMessage: parsedError.message,
      },
    );
  }
};
