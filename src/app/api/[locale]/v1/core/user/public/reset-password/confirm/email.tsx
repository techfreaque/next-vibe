import { Section, Text } from "@react-email/components";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type React from "react";

import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { UserDetailLevel } from "../../../enum";
import { userRepository } from "../../../repository";
import type { StandardUserType } from "../../../types";
import type {
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
} from "./definition";

function renderPasswordResetConfirmEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: StandardUserType,
  appName: string,
): React.ReactElement {
  // Create tracking context for user emails (no lead, but may have user ID)
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for user emails
    user.id, // userId if available
    undefined, // no campaignId for transactional emails
  );
  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t(
        "app.api.v1.core.user.public.resetPassword.confirm.email.title",
        {
          appName,
        },
      )}
      previewText={t(
        "app.api.v1.core.user.public.resetPassword.confirm.email.previewText",
        {
          appName,
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
        {t("app.api.v1.core.user.public.resetPassword.confirm.email.greeting", {
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
        {t(
          "app.api.v1.core.user.public.resetPassword.confirm.email.successMessage",
          {
            appName,
          },
        )}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t(
          "app.api.v1.core.user.public.resetPassword.confirm.email.loginInstructions",
        )}
      </Text>

      <Section style={{ marginTop: "32px" }}>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          {t(
            "app.api.v1.core.user.public.resetPassword.confirm.email.securityWarning",
          )}
        </Text>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#6B7280",
          marginTop: "24px",
        }}
      >
        {t(
          "app.api.v1.core.user.public.resetPassword.confirm.email.securityTip",
        )}
      </Text>
    </EmailTemplate>
  );
}

/**
 * Password Reset Confirmation Email Template
 *
 * This function renders an email template for password reset confirmations.
 * It's used to notify users that their password has been successfully reset.
 *
 * The function:
 * 1. Verifies the user exists in the database
 * 2. Constructs a personalized confirmation email
 * 3. Returns the email content and recipient information
 *
 * @param requestData - The validated request data from the client
 * @param t - The translation function
 * @param locale - The current locale
 * @returns A promise resolving to either a success or error response
 */
export const renderResetPasswordConfirmMail: EmailFunctionType<
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
  UndefinedType
> = async ({ requestData, locale, t, logger }) => {
  logger.debug("Rendering password reset confirmation email", {
    email: requestData.verification.email,
  });

  const userResponse = await userRepository.getUserByEmail(
    requestData.verification.email,
    UserDetailLevel.STANDARD,
    locale,
    logger,
  );
  if (!userResponse.success) {
    return createErrorResponse(
      "app.api.v1.core.emails.errors.no_email",
      ErrorResponseTypes.NOT_FOUND,
    );
  }
  const user = userResponse.data;
  const appName = t("config.appName");
  return createSuccessResponse({
    toEmail: requestData.verification.email,
    toName: user.publicName,
    subject: t(
      "app.api.v1.core.user.public.resetPassword.confirm.email.subject",
      {
        appName,
      },
    ),
    jsx: renderPasswordResetConfirmEmailContent(
      t,
      locale,
      userResponse.data,
      appName,
    ),
  });
};
