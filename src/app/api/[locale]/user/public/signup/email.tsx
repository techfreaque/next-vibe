/**
 * User Public Signup Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Column, Row, Section, Text } from "@react-email/components";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import type {
  EmailFunctionType,
  EmailTemplateReturnType,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-handling/handler";
import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { env } from "@/config/env";
import {
  FEATURED_MODELS,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import { translations as configTranslations } from "@/config/i18n/en";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as userScopedTranslation } from "../../i18n";
import {
  scopedTranslation as signupScopedTranslation,
  type SignupT,
  type SignupTranslationKey,
} from "./i18n";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { contactClientRepository } from "../../../contact/repository-client";
import { UserDetailLevel } from "../../enum";
import { UserRepository } from "../../repository";
import {
  type SignupPostRequestOutput,
  type SignupPostResponseOutput,
} from "./definition";
import {
  createTrackingContext,
  type TrackingContext,
} from "../../../messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailTemplate } from "../../../messenger/providers/email/smtp-client/components/template.email";
import { simpleT } from "@/i18n/core/shared";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const signupWelcomePropsSchema = z.object({
  privateName: z.string(),
  userId: z.string(),
  leadId: z.string(),
});

type SignupWelcomeProps = z.infer<typeof signupWelcomePropsSchema>;

function SignupWelcomeEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: SignupWelcomeProps;
  t: SignupT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = simpleT(locale);
  const appName = globalT("config.appName");

  const modelCategories = [
    {
      label: t("email.models.mainstream"),
      models: FEATURED_MODELS.mainstream,
      color: "#1e40af",
      bg: "#dbeafe",
    },
    {
      label: t("email.models.open"),
      models: FEATURED_MODELS.open,
      color: "#166534",
      bg: "#dcfce7",
    },
    {
      label: t("email.models.uncensored"),
      models: FEATURED_MODELS.uncensored,
      color: "#7c2d12",
      bg: "#fed7aa",
    },
  ];

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.headline")}
      previewText={t("email.previewText", {
        privateName: props.privateName,
        modelCount: TOTAL_MODEL_COUNT,
      })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      {/* Personal greeting */}
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "6px",
        }}
      >
        {t("email.greeting", {
          privateName: props.privateName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "28px",
        }}
      >
        {t("email.intro", { appName })}
      </Text>

      {/* Model showcase */}
      <Section
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {t("email.models.title", {
            modelCount: TOTAL_MODEL_COUNT,
          })}
        </Text>

        {modelCategories.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: ci < 2 ? "16px" : "0" }}>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#6b7280",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {cat.label}
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {cat.models.map((m, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    backgroundColor: cat.bg,
                    color: cat.color,
                    fontSize: "13px",
                    fontWeight: "600",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    marginRight: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* What you get */}
      <Section
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "28px",
          border: "2px solid #bfdbfe",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e40af",
            marginBottom: "14px",
          }}
        >
          {t("email.free.title")}
        </Text>

        {[
          t("email.free.credits"),
          t("email.free.allModels", {
            modelCount: TOTAL_MODEL_COUNT,
          }),
          t("email.free.uncensored"),
          t("email.free.chatModes"),
          t("email.free.noCard"),
        ].map((item, i) => (
          <Row key={i} style={{ marginBottom: "10px" }}>
            <Column
              style={{
                width: "24px",
                verticalAlign: "top",
                paddingTop: "1px",
              }}
            >
              <Text
                style={{
                  color: "#2563eb",
                  fontWeight: "700",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                ✓
              </Text>
            </Column>
            <Column style={{ verticalAlign: "top" }}>
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: "1.5",
                  color: "#1e3a8a",
                  margin: "0",
                }}
              >
                {item}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      {/* Primary CTA */}
      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={`${tracking.baseUrl}/${locale}`}
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "17px",
            padding: "16px 44px",
            textDecoration: "none",
            fontWeight: "700",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
          }}
        >
          {t("email.ctaButton")}
        </Button>
      </Section>

      {/* Upgrade nudge */}
      <Section
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "10px",
          padding: "20px 24px",
          marginBottom: "28px",
          border: "1px solid #e5e7eb",
        }}
      >
        <Text
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "6px",
          }}
        >
          {t("email.upgrade.title")}
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.6",
            marginBottom: "14px",
          }}
        >
          {t("email.upgrade.desc")}
        </Text>
        <Button
          href={`${tracking.baseUrl}/${locale}/subscription`}
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #2563eb",
            borderRadius: "6px",
            color: "#2563eb",
            fontSize: "14px",
            padding: "10px 20px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          {t("email.upgrade.cta")}
        </Button>
      </Section>

      {/* Signoff */}
      <Text
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
          whiteSpace: "pre-line",
        }}
      >
        {t("email.signoff", { appName })}
      </Text>

      {/* Privacy PS */}
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "1.6",
          color: "#9ca3af",
          fontStyle: "italic",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
        }}
      >
        {t("email.ps")}
      </Text>
    </EmailTemplate>
  );
}

// Template Definition Export
const signupWelcomeTemplate: EmailTemplateDefinition<
  SignupWelcomeProps,
  typeof signupScopedTranslation
> = {
  scopedTranslation: signupScopedTranslation,
  meta: {
    id: "signup-welcome",
    version: "1.0.0",
    name: "emailTemplates.welcome.name",
    description: "emailTemplates.welcome.description",
    category: "emailTemplates.welcome.category",
    path: "/user/public/signup/email.tsx",
    defaultSubject: "email.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "emailTemplates.welcome.preview.privateName.label",
        description: "emailTemplates.welcome.preview.privateName.description",
        defaultValue: "Max",
        required: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.welcome.preview.userId.label",
        description: "emailTemplates.welcome.preview.userId.description",
        defaultValue: "example-user-id-123",
        required: true,
      },
      leadId: {
        type: "text",
        label: "emailTemplates.welcome.preview.leadId.label",
        description: "emailTemplates.welcome.preview.leadId.description",
        defaultValue: "example-lead-id-456",
        required: true,
      },
    },
  },
  schema: signupWelcomePropsSchema,
  component: SignupWelcomeEmail,
  exampleProps: {
    privateName: "Max",
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
  },
};

export default signupWelcomeTemplate;

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE (Component - Not Registered)
// ============================================================================

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Core welcome email logic — looks up user by email and renders the welcome template.
 * Export for use by other routes (e.g. admin user-create) that share the same template.
 * Called by the typed wrappers below for signup and admin user-create contexts.
 */
export async function renderWelcomeEmailByEmail(
  email: string,
  locale: CountryLanguage,
  _t: unknown,
  logger: EndpointLogger,
): Promise<SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType> {
  const { t: tUser } = userScopedTranslation.scopedT(locale);
  const { t: signupT } = signupScopedTranslation.scopedT(locale);
  const userResponse = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    locale,
    logger,
  );
  if (!userResponse.success) {
    return fail({
      message: tUser("errors.not_found"),
      errorType: ErrorResponseTypes.NOT_FOUND,
      messageParams: { email },
      cause: userResponse,
    });
  }
  const user = userResponse.data;

  const templateProps: SignupWelcomeProps = {
    privateName: user.privateName,
    userId: user.id,
    leadId: user.leadId,
  };
  const { t: globalT } = simpleT(locale);

  return success({
    toEmail: user.email,
    toName: user.privateName,
    subject: signupT("email.subject", {
      appName: globalT("config.appName"),
    }),
    jsx: signupWelcomeTemplate.component({
      props: templateProps,
      t: signupT,
      locale,
      recipientEmail: user.email,
      tracking: createTrackingContext(locale, user.leadId, user.id),
    }),
  });
}

/**
 * Signup Welcome Email — typed for SignupPostRequestOutput.
 * Used by the public signup route.
 */
export const renderRegisterMail: EmailFunctionType<
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  never,
  SignupTranslationKey
> = ({ requestData, locale, t, logger }) =>
  renderWelcomeEmailByEmail(requestData.email, locale, t, logger);

function renderAdminNotificationEmailContent(
  t: SignupT,
  locale: CountryLanguage,
  recipientEmail: string,
  user: {
    privateName: string;
    publicName: string;
    email: string;
    id: string;
    locale: CountryLanguage;
    createdAt: string | number | Date;
    creditBalance?: number;
    leadCreditBalance?: number;
  },
  requestData: {
    subscribeToNewsletter?: boolean | null;
  },
): React.ReactElement {
  // Create tracking context for admin notification emails with leadId and userId
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for admin notification emails
    user.id, // userId for admin notification about this user
    undefined, // no campaignId for transactional emails
    env.NEXT_PUBLIC_APP_URL,
  );

  const { t: globalT } = simpleT(locale);

  return (
    <EmailTemplate
      locale={locale}
      title={t("admin_notification.title")}
      previewText={t("admin_notification.preview", {
        appName: globalT("config.appName"),
      })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      {/* Header Message */}
      <Text
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {t("admin_notification.title")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("admin_notification.message", {
          appName: globalT("config.appName"),
        })}
      </Text>

      {/* User Details Section */}
      <Section
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px",
            borderBottom: "2px solid #3b82f6",
            paddingBottom: "8px",
          }}
        >
          {t("admin_notification.user_details")}
        </Text>

        {/* Basic Info Row */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("admin_notification.basic_information")}
          </Text>

          <div style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.privateName")}:
              </Text>{" "}
              {user.privateName}
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.publicName")}:
              </Text>{" "}
              {user.publicName}
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.email")}:
              </Text>{" "}
              <a
                href={`mailto:${user.email}`}
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {user.email}
              </a>
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.locale")}:
              </Text>{" "}
              {user.locale}
            </Text>

            {user.creditBalance !== undefined && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("admin_notification.creditBalance")}:
                </Text>{" "}
                {user.creditBalance}
              </Text>
            )}

            {user.leadCreditBalance !== undefined && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("admin_notification.leadCreditBalance")}:
                </Text>{" "}
                {user.leadCreditBalance}
              </Text>
            )}
          </div>
        </div>

        {/* Signup Preferences */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("admin_notification.signup_preferences")}
          </Text>

          {requestData.subscribeToNewsletter !== undefined && (
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.newsletter")}:
              </Text>{" "}
              <span
                style={{
                  backgroundColor: requestData.subscribeToNewsletter
                    ? "#dcfce7"
                    : "#fee2e2",
                  color: requestData.subscribeToNewsletter
                    ? "#166534"
                    : "#991b1b",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {requestData.subscribeToNewsletter
                  ? t("admin_notification.subscribed")
                  : t("admin_notification.not_subscribed")}
              </span>
            </Text>
          )}
        </div>

        {/* Signup Details */}
        <div>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("admin_notification.signup_details")}
          </Text>

          <div style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.signup_date")}:
              </Text>{" "}
              {new Date(user.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("admin_notification.user_id")}:
              </Text>{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#f3f4f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {user.id}
              </span>
            </Text>
          </div>
        </div>
      </Section>

      {/* Action Buttons */}
      <Section style={{ textAlign: "center", marginBottom: "32px" }}>
        <Button
          href={`mailto:${user.email}?subject=Welcome to ${globalT("config.appName")} - Let's get started!`}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "12px 24px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("admin_notification.contact_user")}
        </Button>
      </Section>

      {/* Footer */}
      <Text
        style={{
          fontSize: "12px",
          lineHeight: "1.5",
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
        }}
      >
        {t("admin_notification.footer", {
          appName: globalT("config.appName"),
        })}
      </Text>
    </EmailTemplate>
  );
}

// Admin signup notification schema and template definition
const adminSignupPropsSchema = z.object({
  privateName: z.string(),
  publicName: z.string(),
  email: z.string().email(),
  userId: z.string(),
  subscribeToNewsletter: z.boolean().optional(),
});

type AdminSignupProps = z.infer<typeof adminSignupPropsSchema>;

export const adminSignupNotificationTemplate: EmailTemplateDefinition<
  AdminSignupProps,
  typeof signupScopedTranslation
> = {
  scopedTranslation: signupScopedTranslation,
  meta: {
    id: "admin-signup-notification",
    version: "1.0.0",
    name: "emailTemplates.adminSignup.name",
    description: "emailTemplates.adminSignup.description",
    category: "emailTemplates.adminSignup.category",
    path: "/user/public/signup/email.tsx",
    defaultSubject: "admin_notification.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "emailTemplates.adminSignup.preview.privateName.label",
        defaultValue: "Max",
        required: true,
      },
      publicName: {
        type: "text",
        label: "emailTemplates.adminSignup.preview.publicName.label",
        defaultValue: "Max Mustermann",
        required: true,
      },
      email: {
        type: "email",
        label: "emailTemplates.adminSignup.preview.email.label",
        defaultValue: "max@example.com",
        required: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.adminSignup.preview.userId.label",
        defaultValue: "example-user-id-123",
        required: true,
      },
      subscribeToNewsletter: {
        type: "boolean",
        label: "emailTemplates.adminSignup.preview.subscribeToNewsletter.label",
        defaultValue: false,
      },
    },
  },
  schema: adminSignupPropsSchema,
  component: ({ props, t, locale, recipientEmail }) =>
    renderAdminNotificationEmailContent(
      t,
      locale,
      recipientEmail,
      {
        privateName: props.privateName,
        publicName: props.publicName,
        email: props.email,
        id: props.userId,
        locale,
        createdAt: new Date(),
      },
      { subscribeToNewsletter: props.subscribeToNewsletter },
    ),
  exampleProps: {
    privateName: "Max",
    publicName: "Max Mustermann",
    email: "max@example.com",
    userId: "example-user-id-123",
    subscribeToNewsletter: false,
  },
};

/**
 * Core admin notification logic — fetches full user + credit balance and renders the admin email.
 * Called by the typed wrappers below for signup and admin user-create contexts.
 */
export async function renderAdminNotificationByEmail(
  email: string,
  subscribeToNewsletter: boolean | null | undefined,
  locale: CountryLanguage,
  _t: unknown,
  logger: EndpointLogger,
): Promise<SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType> {
  const { t: tUser } = userScopedTranslation.scopedT(locale);
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
  const { t: signupT } = signupScopedTranslation.scopedT(locale);
  const { t: globalT } = simpleT(locale);
  const userResponse = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.COMPLETE,
    locale,
    logger,
  );
  if (!userResponse.success) {
    return fail({
      message: tUser("errors.not_found"),
      errorType: ErrorResponseTypes.NOT_FOUND,
      messageParams: { email },
      cause: userResponse,
    });
  }
  const user = userResponse.data;

  // Fetch credit balances (non-blocking — omit from email if unavailable)
  const [userBalanceResult, leadBalanceResult] = await Promise.all([
    CreditRepository.getBalance({ userId: user.id }, logger, creditsT, locale),
    user.leadId
      ? CreditRepository.getBalance(
          { leadId: user.leadId },
          logger,
          creditsT,
          locale,
        )
      : Promise.resolve(null),
  ]);

  return success({
    toEmail: contactClientRepository.getSupportEmail(locale),
    toName: globalT("config.appName"),
    subject: signupT("admin_notification.subject", {
      userName: user.privateName,
    }),
    jsx: renderAdminNotificationEmailContent(
      signupT,
      locale,
      contactClientRepository.getSupportEmail(locale),
      {
        ...user,
        creditBalance: userBalanceResult?.success
          ? userBalanceResult.data.total
          : undefined,
        leadCreditBalance: leadBalanceResult?.success
          ? leadBalanceResult.data.total
          : undefined,
      },
      { subscribeToNewsletter },
    ),
  });
}

/**
 * Admin Notification Email — typed for SignupPostRequestOutput.
 * Used by the public signup route.
 */
export const renderAdminSignupNotification: EmailFunctionType<
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  never,
  SignupTranslationKey
> = ({ requestData, locale, t, logger }) =>
  renderAdminNotificationByEmail(
    requestData.email,
    requestData.subscribeToNewsletter,
    locale,
    t,
    logger,
  );
