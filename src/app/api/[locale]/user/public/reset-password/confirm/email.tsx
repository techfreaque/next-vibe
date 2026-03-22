/**
 * Password Reset Confirmation Email Templates
 * Refactored to separate template from business logic
 */

import { Section, Text } from "@react-email/components";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import { z } from "zod";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/agent/models/models";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import type { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import { scopedTranslation as confirmScopedTranslation } from "./i18n";
import type {
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
} from "./definition";
import definition from "./definition";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailTemplate } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/template.email";
import { simpleT } from "@/i18n/core/shared";

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

type ScopedT = ReturnType<typeof confirmScopedTranslation.scopedT>["t"];

function PasswordResetConfirmEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PasswordResetConfirmProps;
  t: ScopedT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = simpleT(locale);
  const appName = globalT("config.appName");

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.title", {
        appName,
      })}
      previewText={t("email.previewText", {
        appName,
        modelCount: TOTAL_MODEL_COUNT,
      })}
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
        {t("email.greeting", {
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
        {t("email.successMessage", {
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
        {t("email.loginInstructions", {
          modelCount: TOTAL_MODEL_COUNT,
        })}
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
          {t("email.securityWarning")}
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
        {t("email.securityTip")}
      </Text>
    </EmailTemplate>
  );
}

// Template Definition Export
export const passwordResetConfirmEmailTemplate: EmailTemplateDefinition<
  PasswordResetConfirmProps,
  typeof confirmScopedTranslation,
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation: confirmScopedTranslation,
  meta: {
    id: "password-reset-confirm",
    version: "1.0.0",
    name: "emailTemplates.confirm.name",
    description: "emailTemplates.confirm.description",
    category: "emailTemplates.confirm.category",
    path: "/user/public/reset-password/confirm/email.tsx",
    defaultSubject: "email.subject",
    previewFields: {
      publicName: {
        type: "text",
        label: "emailTemplates.confirm.preview.publicName.label",
        description: "emailTemplates.confirm.preview.publicName.description",
        defaultValue: "Max Mustermann",
        required: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.confirm.preview.userId.label",
        description: "emailTemplates.confirm.preview.userId.description",
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
  render: async ({ requestData, locale, logger }) => {
    logger.debug("Rendering password reset confirmation email", {
      email: requestData.email,
    });

    const { t } = confirmScopedTranslation.scopedT(locale);

    const userResponse = await UserRepository.getUserByEmail(
      requestData.email,
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );
    if (!userResponse.success) {
      return fail({
        message: t("errors.no_email"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        cause: userResponse,
      });
    }

    const user = userResponse.data;

    const templateProps: PasswordResetConfirmProps = {
      publicName: user.publicName,
      userId: user.id,
    };

    return success({
      toEmail: requestData.email,
      toName: user.publicName,
      subject: t("email.subject"),
      leadId: user.leadId,
      jsx: passwordResetConfirmEmailTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: requestData.email,
        tracking: createTrackingContext(locale, user.leadId, user.id),
      }),
    });
  },
};
