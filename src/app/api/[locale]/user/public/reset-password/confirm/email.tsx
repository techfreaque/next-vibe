/**
 * Password Reset Confirmation Email Templates
 * Refactored to separate template from business logic
 */

import { Section, Text } from "@react-email/components";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import type {
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
} from "./definition";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/app/api/[locale]/emails/smtp-client/components/tracking_context.email";
import { EmailTemplate } from "@/app/api/[locale]/emails/smtp-client/components/template.email";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const passwordResetConfirmPropsSchema = z.object({
  publicName: z.string(),
  userId: z.string(),
});

type PasswordResetConfirmProps = z.infer<
  typeof passwordResetConfirmPropsSchema
>;

function PasswordResetConfirmEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PasswordResetConfirmProps;
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const appName = t("config.appName");

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.user.public.resetPassword.confirm.email.title", {
        appName,
      })}
      previewText={t(
        "app.api.user.public.resetPassword.confirm.email.previewText",
        {
          appName,
        },
      )}
      recipientEmail={recipientEmail}
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
        {t("app.api.user.public.resetPassword.confirm.email.greeting", {
          name: props.publicName,
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
        {t("app.api.user.public.resetPassword.confirm.email.successMessage", {
          appName,
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
        {t("app.api.user.public.resetPassword.confirm.email.loginInstructions")}
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
          {t("app.api.user.public.resetPassword.confirm.email.securityWarning")}
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
        {t("app.api.user.public.resetPassword.confirm.email.securityTip")}
      </Text>
    </EmailTemplate>
  );
}

// Template Definition Export
const passwordResetConfirmTemplate: EmailTemplateDefinition<PasswordResetConfirmProps> =
  {
    meta: {
      id: "password-reset-confirm",
      version: "1.0.0",
      name: "app.api.emails.templates.password.reset.confirm.meta.name",
      description:
        "app.api.emails.templates.password.reset.confirm.meta.description",
      category: "auth",
      path: "/user/public/reset-password/confirm/email.tsx",
      defaultSubject: (t) =>
        t("app.api.user.public.resetPassword.confirm.email.subject", {
          appName: "",
        }),
      previewFields: {
        publicName: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.password.reset.confirm.preview.privateName.label",
          description:
            "app.admin.emails.templates.templates.password.reset.confirm.preview.privateName.description",
          defaultValue: "Max Mustermann",
          required: true,
        },
        userId: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.password.reset.confirm.preview.userId.label",
          description:
            "app.admin.emails.templates.templates.password.reset.confirm.preview.userId.description",
          defaultValue: "example-user-id-123",
          required: true,
        },
      },
    },
    schema: passwordResetConfirmPropsSchema,
    component: PasswordResetConfirmEmail,
    exampleProps: {
      publicName: "Max Mustermann",
      userId: "example-user-id-123",
    },
  };

export default passwordResetConfirmTemplate;

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Password Reset Confirmation Email Adapter
 * Maps password reset confirmation to template props
 *
 * This function:
 * 1. Verifies the user exists in the database
 * 2. Constructs a personalized confirmation email
 * 3. Returns the email content and recipient information
 */
export const renderResetPasswordConfirmMail: EmailFunctionType<
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
  UndefinedType
> = async ({ requestData, locale, t, logger }) => {
  logger.debug("Rendering password reset confirmation email", {
    email: requestData.verification.email,
  });

  const userResponse = await UserRepository.getUserByEmail(
    requestData.verification.email,
    UserDetailLevel.STANDARD,
    locale,
    logger,
  );
  if (!userResponse.success) {
    return fail({
      message: "app.api.emails.errors.no_email",
      errorType: ErrorResponseTypes.NOT_FOUND,
      cause: userResponse,
    });
  }

  const user = userResponse.data;
  const appName = t("config.appName");

  const templateProps: PasswordResetConfirmProps = {
    publicName: user.publicName,
    userId: user.id,
  };

  return success({
    toEmail: requestData.verification.email,
    toName: user.publicName,
    subject: t("app.api.user.public.resetPassword.confirm.email.subject", {
      appName,
    }),
    jsx: passwordResetConfirmTemplate.component({
      props: templateProps,
      t,
      locale,
      recipientEmail: requestData.verification.email,
      tracking: createTrackingContext(locale, undefined, user.id),
    }),
  });
};
