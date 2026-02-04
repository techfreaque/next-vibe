/**
 * Password Reset Request Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Section, Text } from "@react-email/components";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
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
import {
  createTrackingContext,
  type TrackingContext,
} from "@/app/api/[locale]/emails/smtp-client/components/tracking_context.email";
import { EmailTemplate } from "@/app/api/[locale]/emails/smtp-client/components/template.email";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const passwordResetRequestPropsSchema = z.object({
  publicName: z.string(),
  userId: z.string(),
  passwordResetUrl: z.string().url(),
});

type PasswordResetRequestProps = z.infer<
  typeof passwordResetRequestPropsSchema
>;

function PasswordResetRequestEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PasswordResetRequestProps;
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const translatedAppName = t("config.appName");

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
        {t("app.api.user.public.resetPassword.request.email.greeting", {
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
          href={props.passwordResetUrl}
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

// Template Definition Export
const passwordResetRequestTemplate: EmailTemplateDefinition<PasswordResetRequestProps> =
  {
    meta: {
      id: "password-reset-request",
      version: "1.0.0",
      name: "app.api.emails.templates.password.reset.request.meta.name",
      description:
        "app.api.emails.templates.password.reset.request.meta.description",
      category: "auth",
      path: "/user/public/reset-password/request/email.tsx",
      defaultSubject: (t) =>
        t("app.api.user.public.resetPassword.request.email.subject", {
          appName: "",
        }),
      previewFields: {
        publicName: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.password.reset.request.preview.privateName.label",
          description:
            "app.admin.emails.templates.templates.password.reset.request.preview.privateName.description",
          defaultValue: "Max Mustermann",
          required: true,
        },
        userId: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.password.reset.request.preview.userId.label",
          description:
            "app.admin.emails.templates.templates.password.reset.request.preview.userId.description",
          defaultValue: "example-user-id-123",
          required: true,
        },
        passwordResetUrl: {
          type: "url",
          label:
            "app.admin.emails.templates.templates.password.reset.request.preview.resetToken.label",
          description:
            "app.admin.emails.templates.templates.password.reset.request.preview.resetToken.description",
          defaultValue: "https://example.com/user/reset-password/token123",
          required: true,
        },
      },
    },
    schema: passwordResetRequestPropsSchema,
    component: PasswordResetRequestEmail,
    exampleProps: {
      publicName: "Max Mustermann",
      userId: "example-user-id-123",
      passwordResetUrl: "https://example.com/user/reset-password/token123",
    },
  };

export default passwordResetRequestTemplate;

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Password Reset Email Adapter
 * Maps password reset request to template props
 *
 * This function:
 * 1. Verifies the user exists in the database
 * 2. Creates a password reset token
 * 3. Constructs a personalized email with a reset link
 * 4. Returns the email content and recipient information
 */
export const renderResetPasswordMail: EmailFunctionType<
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
  UndefinedType
> = async ({ requestData, t, locale, logger }) => {
  logger.debug("Rendering password reset email", {
    email: requestData.email,
  });

  try {
    const userResponse = await UserRepository.getUserByEmail(
      requestData.email,
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );
    if (!userResponse.success) {
      // will not get sent to the user as ignoreError is true
      return fail({
        message: "app.api.emails.errors.no_email",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { email: requestData.email },
        cause: userResponse,
      });
    }

    const user = userResponse.data;

    // Create a reset token
    const tokenResponse = await PasswordRepository.createResetToken(
      requestData.email,
      locale,
      logger,
    );
    if (!tokenResponse.success) {
      return fail({
        message: "app.api.emails.errors.email_generation_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { email: requestData.email },
        cause: tokenResponse,
      });
    }

    const token = tokenResponse.data;
    const passwordResetUrl = `${env.NEXT_PUBLIC_APP_URL}/${locale}/user/reset-password/${token}`;

    const templateProps: PasswordResetRequestProps = {
      publicName: user.publicName,
      userId: user.id,
      passwordResetUrl,
    };

    const translatedAppName = t("config.appName");

    return success({
      toEmail: requestData.email,
      toName: user.publicName,
      subject: t("app.api.user.public.resetPassword.request.email.subject", {
        appName: translatedAppName,
      }),
      jsx: passwordResetRequestTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: requestData.email,
        tracking: createTrackingContext(locale, undefined, user.id),
      }),
    });
  } catch (error) {
    logger.error("Error generating password reset email", parseError(error));
    const parsedError = parseError(error);
    return fail({
      message: "app.api.emails.errors.email_generation_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        email: requestData.email,
        errorMessage: parsedError.message,
      },
    });
  }
};
