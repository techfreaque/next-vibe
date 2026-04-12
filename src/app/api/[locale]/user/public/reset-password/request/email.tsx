/**
 * Password Reset Request Email Template
 */

import { Button, Section, Text } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { ReactElement } from "react";
import { z } from "zod";

import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { EmailTemplate } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/tracking_context.email";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import { RESET_TOKEN_EXPIRY } from "@/config/constants";
import { env } from "@/config/env";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import { scopedTranslation as resetPasswordScopedTranslation } from "../i18n";
import { PasswordRepository } from "../repository";
import type {
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
} from "./definition";
import definition from "./definition";
import {
  scopedTranslation as requestScopedTranslation,
  type ResetPasswordRequestT,
} from "./i18n";

// ============================================================================
// SCHEMA
// ============================================================================

const passwordResetRequestPropsSchema = z.object({
  publicName: z.string(),
  userId: z.string(),
  passwordResetUrl: z.string().url(),
  totalModelCount: z.number(),
});

type PasswordResetRequestProps = z.infer<
  typeof passwordResetRequestPropsSchema
>;

type ScopedT = ResetPasswordRequestT;

// ============================================================================
// COMPONENT
// ============================================================================

function PasswordResetRequestEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PasswordResetRequestProps;
  t: ScopedT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.title", { appName })}
      previewText={t("email.previewText", {
        appName,
        hours: RESET_TOKEN_EXPIRY,
      })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {t("email.greeting", { name: props.publicName })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "28px",
        }}
      >
        {t("email.requestInfo", { appName })}
      </Text>

      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={props.passwordResetUrl}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            padding: "14px 32px",
            textDecoration: "none",
          }}
        >
          {t("email.buttonText")}
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "13px",
          lineHeight: "1.5",
          color: "#9ca3af",
          marginBottom: "24px",
          fontStyle: "italic",
        }}
      >
        {t("email.expirationInfo", { hours: RESET_TOKEN_EXPIRY })}
      </Text>

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#6b7280",
          marginTop: "8px",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "20px",
        }}
      >
        {t("email.promoText", { modelCount: props.totalModelCount })}
      </Text>

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#9ca3af",
          marginTop: "8px",
        }}
      >
        {t("email.signoff", { appName })}
      </Text>
    </EmailTemplate>
  );
}

// ============================================================================
// TEMPLATE DEFINITION
// ============================================================================

export const passwordResetRequestEmailTemplate: EmailTemplateDefinition<
  PasswordResetRequestProps,
  typeof requestScopedTranslation,
  ResetPasswordRequestPostRequestOutput,
  ResetPasswordRequestPostResponseOutput,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation: requestScopedTranslation,
  meta: {
    id: "password-reset-request",
    version: "1.0.0",
    name: "emailTemplates.request.name",
    description: "emailTemplates.request.description",
    category: "emailTemplates.request.category",
    path: "/user/public/reset-password/request/email.tsx",
    defaultSubject: "email.subject",
    previewFields: {
      publicName: {
        type: "text",
        label: "emailTemplates.request.preview.publicName.label",
        description: "emailTemplates.request.preview.publicName.description",
        defaultValue: "Max Mustermann",
        required: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.request.preview.userId.label",
        description: "emailTemplates.request.preview.userId.description",
        defaultValue: "example-user-id-123",
        required: true,
      },
      passwordResetUrl: {
        type: "url",
        label: "emailTemplates.request.preview.passwordResetUrl.label",
        description:
          "emailTemplates.request.preview.passwordResetUrl.description",
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
    totalModelCount: 42,
  },
  render: async ({ requestData, locale, logger }) => {
    logger.debug("Rendering password reset email", {
      email: requestData.email,
    });

    const { t } = requestScopedTranslation.scopedT(locale);
    const { t: resetT } = resetPasswordScopedTranslation.scopedT(locale);
    const { t: globalT } = configScopedTranslation.scopedT(locale);

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
          message: t("errors.no_email"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { email: requestData.email },
          cause: userResponse,
        });
      }

      const user = userResponse.data;

      const tokenResponse = await PasswordRepository.createResetToken(
        requestData.email,
        locale,
        logger,
        resetT,
      );
      if (!tokenResponse.success) {
        return fail({
          message: t("errors.email_generation_failed"),
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
        totalModelCount: getAvailableModelCount(false),
      };

      return success({
        toEmail: requestData.email,
        toName: user.publicName,
        subject: t("email.subject", { appName: globalT("appName") }),
        leadId: user.leadId,
        jsx: passwordResetRequestEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: requestData.email,
          tracking: createTrackingContext(locale, user.leadId, user.id),
        }),
      });
    } catch (error) {
      logger.error("Error generating password reset email", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("errors.email_generation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: requestData.email,
          errorMessage: parsedError.message,
        },
      });
    }
  },
};
