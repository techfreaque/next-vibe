/**
 * Credit Pack Email Templates
 * User confirmation + admin notification
 */

import { Button, Section, Text as Span } from "@react-email/components";
import { eq } from "drizzle-orm";
import type { UndefinedType } from "next-vibe/core/definition/common.schema";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import type { UserRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import type { ReactElement } from "react";
import { z } from "zod";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";
import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import type { EmailTemplateDefinition } from "@/messenger/registry/template";

import type {
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
} from "./admin-add/definition";
import type { CreditsT } from "./i18n";
import { scopedTranslation } from "./i18n";

// ============================================================================
// SCHEMA
// ============================================================================

const creditPackEmailPropsSchema = z.object({
  privateName: z.string(),
  userId: z.string(),
  leadId: z.string(),
  credits: z.number(),
  userEmail: z.email(),
});

type CreditPackEmailProps = z.infer<typeof creditPackEmailPropsSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

function CreditPackUserEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: CreditPackEmailProps;
  t: CreditsT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");
  const userTracking = createTrackingContext(
    locale,
    props.leadId,
    props.userId,
  );

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.creditPack.user.title")}
      previewText={t("email.creditPack.user.previewText", {
        credits: props.credits.toLocaleString(),
      })}
      recipientEmail={recipientEmail}
      tracking={userTracking}
    >
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "8px",
          display: "block",
        }}
      >
        {t("email.creditPack.user.greeting", {
          privateName: props.privateName,
        })}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
          display: "block",
        }}
      >
        {t("email.creditPack.user.body", {
          credits: props.credits.toLocaleString(),
        })}
      </Span>

      <Section
        style={{
          backgroundColor: "#f0fdf4",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "24px",
          border: "1px solid #bbf7d0",
          textAlign: "center",
        }}
      >
        <Span
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#166534",
            display: "block",
          }}
        >
          +{props.credits.toLocaleString()}
        </Span>
        <Span
          style={{
            fontSize: "14px",
            color: "#15803d",
            display: "block",
          }}
        >
          {t("enums.packType.permanent")}
        </Span>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={`${tracking.baseUrl}/${locale}/`}
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "16px",
            padding: "14px 40px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          {t("email.creditPack.user.cta")}
        </Button>
      </Section>

      <Span
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#374151",
          whiteSpace: "pre-line",
          display: "block",
        }}
      >
        {t("email.creditPack.user.signoff", { appName })}
      </Span>
    </EmailTemplate>
  );
}

// ============================================================================
// TEMPLATE DEFINITION
// ============================================================================

export const creditPackUserEmailTemplate: EmailTemplateDefinition<
  CreditPackEmailProps,
  typeof scopedTranslation,
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
  UndefinedType,
  readonly [typeof UserRole.ADMIN]
> = {
  scopedTranslation,
  meta: {
    id: "credits-credit-pack-user",
    version: "1.0.0",
    name: "email.creditPack.user.title",
    description: "email.creditPack.user.previewText",
    category: "email.creditPack.user.title",
    path: "/credits/email.tsx",
    defaultSubject: "email.creditPack.user.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "email.creditPack.user.greeting",
        defaultValue: "Max",
        required: true,
      },
      userId: {
        type: "text",
        label: "email.creditPack.admin.labelUser",
        defaultValue: "example-user-id-123",
        required: true,
      },
      leadId: {
        type: "text",
        label: "email.creditPack.admin.labelUser",
        defaultValue: "example-lead-id-456",
        required: true,
      },
      credits: {
        type: "number",
        label: "email.creditPack.admin.labelCredits",
        defaultValue: 5000,
        required: true,
      },
      userEmail: {
        type: "email",
        label: "email.creditPack.admin.labelUser",
        defaultValue: "user@example.com",
        required: true,
      },
    },
  },
  schema: creditPackEmailPropsSchema,
  component: CreditPackUserEmail,
  exampleProps: {
    privateName: "Max",
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
    credits: 5000,
    userEmail: "user@example.com",
  },
  render: async ({ requestData, locale, logger }) => {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: globalT } = configScopedTranslation.scopedT(locale);
    try {
      const [userRow] = await db
        .select({ email: users.email, privateName: users.privateName })
        .from(users)
        .where(eq(users.id, requestData.targetUserId));
      if (!userRow) {
        return fail({
          message: t("errors.userNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const [leadLink] = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, requestData.targetUserId));
      const leadId = leadLink?.leadId ?? requestData.targetUserId;
      const templateProps: CreditPackEmailProps = {
        privateName: userRow.privateName,
        userId: requestData.targetUserId,
        leadId,
        credits: requestData.amount,
        userEmail: userRow.email,
      };
      const tracking = createTrackingContext(
        locale,
        leadId,
        requestData.targetUserId,
      );
      return success({
        toEmail: templateProps.userEmail,
        toName: templateProps.privateName,
        subject: t("email.creditPack.user.subject", {
          appName: globalT("appName"),
        }),
        leadId,
        jsx: creditPackUserEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: templateProps.userEmail,
          tracking,
        }),
      });
    } catch (err) {
      logger.error("Failed to render credit pack user email", parseError(err));
      return fail({
        message: t("email.creditPack.user.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

// ============================================================================
// ADMIN TEMPLATE
// ============================================================================

const creditPackAdminEmailPropsSchema = z.object({
  userEmail: z.email(),
  credits: z.number(),
});

type CreditPackAdminEmailProps = z.infer<
  typeof creditPackAdminEmailPropsSchema
>;

function CreditPackAdminEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: CreditPackAdminEmailProps;
  t: CreditsT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.creditPack.admin.title")}
      previewText={t("email.creditPack.admin.preview")}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
          display: "block",
        }}
      >
        {t("email.creditPack.admin.body")}
      </Span>

      <Section
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            color: "#4b5563",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                  width: "120px",
                }}
              >
                {t("email.creditPack.admin.labelUser")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>{props.userEmail}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                }}
              >
                {t("email.creditPack.admin.labelCredits")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>
                {props.credits.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Span
        style={{
          fontSize: "12px",
          lineHeight: "1.5",
          color: "#6b7280",
          fontStyle: "italic",
        }}
      >
        {t("email.creditPack.admin.footer", { appName })}
      </Span>
    </EmailTemplate>
  );
}

export const creditPackAdminEmailTemplate: EmailTemplateDefinition<
  CreditPackAdminEmailProps,
  typeof scopedTranslation,
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
  UndefinedType,
  readonly [typeof UserRole.ADMIN]
> = {
  scopedTranslation,
  meta: {
    id: "credits-credit-pack-admin",
    version: "1.0.0",
    name: "email.creditPack.admin.title",
    description: "email.creditPack.admin.preview",
    category: "email.creditPack.admin.title",
    path: "/credits/email.tsx",
    defaultSubject: "email.creditPack.admin.subject",
    previewFields: {
      userEmail: {
        type: "email",
        label: "email.creditPack.admin.labelUser",
        defaultValue: "user@example.com",
        required: true,
      },
      credits: {
        type: "number",
        label: "email.creditPack.admin.labelCredits",
        defaultValue: 5000,
        required: true,
      },
    },
  },
  schema: creditPackAdminEmailPropsSchema,
  component: CreditPackAdminEmail,
  exampleProps: {
    userEmail: "user@example.com",
    credits: 5000,
  },
  render: async ({ requestData, locale, user, logger }) => {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: globalT } = configScopedTranslation.scopedT(locale);
    const adminEmail = contactClientRepository.getSupportEmail(locale);
    try {
      const [userRow] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, requestData.targetUserId));
      const templateProps: CreditPackAdminEmailProps = {
        userEmail: userRow?.email ?? "",
        credits: requestData.amount,
      };
      return success({
        toEmail: adminEmail,
        toName: adminEmail,
        subject: t("email.creditPack.admin.subject", {
          appName: globalT("appName"),
          credits: requestData.amount,
        }),
        leadId: user.leadId,
        jsx: creditPackAdminEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: adminEmail,
          tracking: createTrackingContext(locale),
        }),
      });
    } catch (err) {
      logger.error("Failed to render credit pack admin email", parseError(err));
      return fail({
        message: t("email.creditPack.admin.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
