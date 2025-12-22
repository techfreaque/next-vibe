import { Button, Section, Text } from "@react-email/components";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type React from "react";

import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import { PasswordRepository } from "../repository";
import type {
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
} from "./definition";
import { createTrackingContext } from "@/app/api/[locale]/emails/smtp-client/components/tracking_context.email";
import { EmailTemplate } from "@/app/api/[locale]/emails/smtp-client/components/template.email";

function renderPasswordResetRequestEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { publicName: string; id: string },
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
      title={t("app.api.user.public.resetPassword.request.email.title", {
        appName: translatedAppName,
      })}
      previewText={t(
        "app.api.user.public.resetPassword.request.email.previewText",
        {
          appName: translatedAppName,
        },
      )}
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
        {t("app.api.user.public.resetPassword.request.email.greeting", {
          name: user.publicName,
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
        {t("app.api.user.public.resetPassword.request.email.requestInfo", {
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
        {t("app.api.user.public.resetPassword.request.email.instructions")}
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
          {t("app.api.user.public.resetPassword.request.email.buttonText")}
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
        {t("app.api.user.public.resetPassword.request.email.expirationInfo")}
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
    const userResponse = await UserRepository.getUserByEmail(
      requestData.emailInput.email,
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );
    if (!userResponse.success) {
      // will not get sent to the user as ignoreError is true
      return fail({
        message: "app.api.emails.errors.no_email",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { email: requestData.emailInput.email },
        cause: userResponse,
      });
    }

    const user = userResponse.data;

    // Create a reset token
    const tokenResponse = await PasswordRepository.createResetToken(
      requestData.emailInput.email,
      locale,
      logger,
    );
    if (!tokenResponse.success) {
      return fail({
        message: "app.api.emails.errors.email_generation_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { email: requestData.emailInput.email },
        cause: tokenResponse,
      });
    }

    const token = tokenResponse.data;
    const passwordResetUrl = `${env.NEXT_PUBLIC_APP_URL}/${locale}/user/reset-password/${token}`;

    const translatedAppName = t("config.appName");

    return success({
      toEmail: requestData.emailInput.email,
      toName: user.publicName,
      subject: t("app.api.user.public.resetPassword.request.email.subject", {
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
    logger.error("Error generating password reset email", parseError(error));
    const parsedError = parseError(error);
    return fail({
      message: "app.api.emails.errors.email_generation_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        email: requestData.emailInput.email,
        errorMessage: parsedError.message,
      },
    });
  }
};
