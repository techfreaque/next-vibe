/**
 * Subscription Email Templates
 * Refactored to separate template from business logic
 */

import {
  Button,
  Column,
  Link,
  Row,
  Section,
  Text as Span,
} from "@react-email/components";
import type { ReactElement } from "react";
import { z } from "zod";

import { getAgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  FEATURED_MODELS,
  getAvailableModelCount,
} from "@/app/api/[locale]/agent/models/models";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import type { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { configScopedTranslation } from "@/config/i18n";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { EmailTemplate } from "../messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../messenger/providers/email/smtp-client/components/tracking_context.email";

import { contactClientRepository } from "../contact/repository-client";
import {
  scopedTranslation as subscriptionScopedTranslation,
  type SubscriptionT,
} from "./i18n";

// ============================================================================
// REQUEST TYPE (shared by both render functions)
// ============================================================================

interface SubscriptionEmailRequest {
  user?: {
    privateName: string;
    publicName: string;
    email: string;
    leadId: string;
    id: string;
  };
  planName?: string;
  statusName?: string;
}

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const subscriptionSuccessPropsSchema = z.object({
  privateName: z.string(),
  userId: z.string(),
  leadId: z.string(),
  planName: z.string(),
  totalModelCount: z.number(),
});

type SubscriptionSuccessProps = z.infer<typeof subscriptionSuccessPropsSchema>;

function SubscriptionSuccessEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: SubscriptionSuccessProps;
  t: SubscriptionT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const modelCategories = [
    {
      label: t("email.success.models.mainstream"),
      models: FEATURED_MODELS.mainstream,
      color: "#1e40af",
      bg: "#dbeafe",
    },
    {
      label: t("email.success.models.open"),
      models: FEATURED_MODELS.open,
      color: "#166534",
      bg: "#dcfce7",
    },
    {
      label: t("email.success.models.uncensored"),
      models: FEATURED_MODELS.uncensored,
      color: "#7c2d12",
      bg: "#fed7aa",
    },
  ];

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.success.headline")}
      previewText={t("email.success.previewText", {
        privateName: props.privateName,
        modelCount: props.totalModelCount,
      })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      {/* Activation Badge */}
      <Section style={{ textAlign: "center", marginBottom: "24px" }}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#dcfce7",
            color: "#166534",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            padding: "6px 18px",
            borderRadius: "999px",
            border: "1px solid #bbf7d0",
            textTransform: "uppercase",
          }}
        >
          {t("email.success.activeBadge")}
        </span>
      </Section>

      {/* Greeting */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "6px",
          display: "block",
        }}
      >
        {t("email.success.greeting", {
          privateName: props.privateName,
        })}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "28px",
          display: "block",
        }}
      >
        {t("email.success.intro", { appName })}
      </Span>

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
        <Span
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
            display: "block",
            textAlign: "center",
          }}
        >
          {t("email.success.models.title", {
            modelCount: props.totalModelCount,
          })}
        </Span>

        {modelCategories.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: ci < 2 ? "16px" : "0" }}>
            <Span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#6b7280",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "8px",
                display: "block",
              }}
            >
              {cat.label}
            </Span>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                    marginBottom: "6px",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* What's included */}
      <Section
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          border: "2px solid #bfdbfe",
        }}
      >
        <Span
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e40af",
            marginBottom: "14px",
            display: "block",
          }}
        >
          {t("email.success.included.title")}
        </Span>

        {[
          t("email.success.included.credits"),
          t("email.success.included.models", {
            modelCount: props.totalModelCount,
          }),
          t("email.success.included.nolimits"),
          t("email.success.included.uncensored"),
          t("email.success.included.packs"),
          t("email.success.included.cancel"),
        ].map((item, i) => (
          <Row key={i} style={{ marginBottom: "10px" }}>
            <Column
              style={{
                width: "24px",
                verticalAlign: "top",
                paddingTop: "1px",
              }}
            >
              <Span
                style={{
                  color: "#2563eb",
                  fontWeight: "700",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                ✓
              </Span>
            </Column>
            <Column style={{ verticalAlign: "top" }}>
              <Span
                style={{
                  fontSize: "15px",
                  color: "#1e3a8a",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                {item}
              </Span>
            </Column>
          </Row>
        ))}
      </Section>

      {/* Primary CTA */}
      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={`${tracking.baseUrl}/${locale}/`}
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
          {t("email.success.cta")}
        </Button>
      </Section>

      {/* Credit packs callout */}
      <Section
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "10px",
          padding: "20px 24px",
          marginBottom: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <Span
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "6px",
            display: "block",
          }}
        >
          {t("email.success.packs.title")}
        </Span>
        <Span
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#4b5563",
            marginBottom: "14px",
            display: "block",
          }}
        >
          {t("email.success.packs.description")}
        </Span>
        <Button
          href={`${tracking.baseUrl}/${locale}/subscription`}
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #2563eb",
            borderRadius: "6px",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            textDecoration: "none",
          }}
        >
          {t("email.success.packs.cta")}
        </Button>
      </Section>

      {/* Manage link */}
      <Span
        style={{
          fontSize: "13px",
          lineHeight: "1.5",
          color: "#9ca3af",
          textAlign: "center",
          marginBottom: "24px",
          display: "block",
        }}
      >
        {t("email.success.manage", { appName })}{" "}
        <Link
          href={`${tracking.baseUrl}/${locale}/subscription`}
          style={{ color: "#6b7280", textDecoration: "underline" }}
        >
          {t("email.success.manageLink")}
        </Link>
      </Span>

      {/* Signoff */}
      <Span
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#374151",
          whiteSpace: "pre-line",
          display: "block",
        }}
      >
        {t("email.success.signoff", { appName })}
      </Span>
    </EmailTemplate>
  );
}

// Template Definition Export
export const subscriptionSuccessEmailTemplate: EmailTemplateDefinition<
  SubscriptionSuccessProps,
  typeof subscriptionScopedTranslation,
  SubscriptionEmailRequest,
  never,
  never,
  readonly [typeof UserRole.CUSTOMER, typeof UserRole.ADMIN]
> = {
  scopedTranslation: subscriptionScopedTranslation,
  meta: {
    id: "subscription-success",
    version: "1.0.0",
    name: "emailTemplates.success.name",
    description: "emailTemplates.success.description",
    category: "emailTemplates.success.category",
    path: "/subscription/email.tsx",
    defaultSubject: "email.success.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "emailTemplates.success.preview.privateName.label",
        description: "emailTemplates.success.preview.privateName.description",
        defaultValue: "Max",
        required: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.success.preview.userId.label",
        description: "emailTemplates.success.preview.userId.description",
        defaultValue: "example-user-id-123",
        required: true,
      },
      leadId: {
        type: "text",
        label: "emailTemplates.success.preview.leadId.label",
        description: "emailTemplates.success.preview.leadId.description",
        defaultValue: "example-lead-id-456",
        required: true,
      },
      planName: {
        type: "text",
        label: "emailTemplates.success.preview.planName.label",
        description: "emailTemplates.success.preview.planName.description",
        defaultValue: "Premium Plan",
        required: true,
      },
    },
  },
  schema: subscriptionSuccessPropsSchema,
  component: SubscriptionSuccessEmail,
  exampleProps: {
    privateName: "Max",
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
    planName: "Premium Plan",
    totalModelCount: 42,
  },
  render: ({ user, requestData, locale }) => {
    const { t } = subscriptionScopedTranslation.scopedT(locale);
    const { t: configT } = configScopedTranslation.scopedT(locale);
    try {
      const templateProps: SubscriptionSuccessProps = {
        privateName: requestData.user?.privateName ?? "",
        userId: requestData.user?.id ?? user.id,
        leadId: requestData.user?.leadId ?? user.leadId,
        planName: requestData.planName ?? "",
        totalModelCount: getAvailableModelCount(
          getAgentEnvAvailability(),
          false,
        ),
      };
      const tracking = createTrackingContext(
        locale,
        templateProps.leadId,
        templateProps.userId,
      );
      return success({
        toEmail: requestData.user?.email ?? "",
        toName: templateProps.privateName,
        subject: t("email.success.subject", {
          appName: configT("appName"),
        }),
        leadId: templateProps.leadId,
        jsx: subscriptionSuccessEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: requestData.user?.email ?? "",
          tracking,
        }),
      });
    } catch {
      return fail({
        message: t("email.success.subject"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE
// ============================================================================

const adminSubscriptionPropsSchema = z.object({
  privateName: z.string(),
  publicName: z.string(),
  email: z.string().email(),
  planName: z.string(),
  statusName: z.string(),
});

type AdminSubscriptionProps = z.infer<typeof adminSubscriptionPropsSchema>;

function AdminSubscriptionNotificationEmailContent({
  user,
  planName,
  statusName,
  t,
  locale,
  recipientEmail,
}: {
  user: { privateName: string; publicName: string; email: string };
  planName: string;
  statusName: string;
  t: SubscriptionT;
  locale: CountryLanguage;
  recipientEmail: string;
}): ReactElement {
  const tracking = createTrackingContext(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return (
    <EmailTemplate
      locale={locale}
      title={t("email.admin_notification.title")}
      previewText={t("email.admin_notification.preview", {
        appName: configT("appName"),
      })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      {/* Header Message */}
      <Span
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {t("email.admin_notification.title")}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("email.admin_notification.message", {
          appName: configT("appName"),
        })}
      </Span>

      {/* User and Subscription Details */}
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
        <Span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px",
            borderBottom: "2px solid #3b82f6",
            paddingBottom: "8px",
          }}
        >
          {t("email.admin_notification.details")}
        </Span>

        <div style={{ marginBottom: "16px" }}>
          <Span
            style={{
              fontSize: "14px",
              marginBottom: "6px",
              color: "#4b5563",
              lineHeight: "1.5",
            }}
          >
            <Span style={{ fontWeight: "700", color: "#1f2937" }}>
              {t("email.admin_notification.user_name")}:
            </Span>{" "}
            {user.privateName} ({user.publicName})
          </Span>

          <Span
            style={{
              fontSize: "14px",
              marginBottom: "6px",
              color: "#4b5563",
              lineHeight: "1.5",
            }}
          >
            <Span style={{ fontWeight: "700", color: "#1f2937" }}>
              {t("email.admin_notification.user_email")}:
            </Span>{" "}
            <Link
              href={`mailto:${user.email}`}
              style={{ color: "#3b82f6", textDecoration: "none" }}
            >
              {user.email}
            </Link>
          </Span>

          <Span
            style={{
              fontSize: "14px",
              marginBottom: "6px",
              color: "#4b5563",
              lineHeight: "1.5",
            }}
          >
            <Span style={{ fontWeight: "700", color: "#1f2937" }}>
              {t("email.admin_notification.plan")}:
            </Span>{" "}
            <span
              style={{
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {planName}
            </span>
          </Span>

          <Span
            style={{
              fontSize: "14px",
              marginBottom: "6px",
              color: "#4b5563",
              lineHeight: "1.5",
            }}
          >
            <Span style={{ fontWeight: "700", color: "#1f2937" }}>
              {t("email.admin_notification.status")}:
            </Span>{" "}
            <span
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {statusName}
            </span>
          </Span>
        </div>
      </Section>

      {/* Action Buttons */}
      <Section style={{ textAlign: "center", marginBottom: "32px" }}>
        <Button
          href={`mailto:${user.email}?subject=Welcome to your ${planName} plan!`}
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
          {t("email.admin_notification.contact_user")}
        </Button>
      </Section>

      {/* Footer */}
      <Span
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
        {t("email.admin_notification.footer", {
          appName: configT("appName"),
        })}
      </Span>
    </EmailTemplate>
  );
}

// Admin notification template definition (for preview registry)
export const adminSubscriptionNotificationEmailTemplate: EmailTemplateDefinition<
  AdminSubscriptionProps,
  typeof subscriptionScopedTranslation,
  SubscriptionEmailRequest,
  never,
  never,
  readonly [typeof UserRole.CUSTOMER, typeof UserRole.ADMIN]
> = {
  scopedTranslation: subscriptionScopedTranslation,
  meta: {
    id: "admin-subscription-notification",
    version: "1.0.0",
    name: "emailTemplates.adminNotification.name",
    description: "emailTemplates.adminNotification.description",
    category: "emailTemplates.adminNotification.category",
    path: "/subscription/email.tsx",
    defaultSubject: "email.admin_notification.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "emailTemplates.adminNotification.preview.privateName.label",
        defaultValue: "Max",
        required: true,
      },
      publicName: {
        type: "text",
        label: "emailTemplates.adminNotification.preview.publicName.label",
        defaultValue: "Max Mustermann",
        required: true,
      },
      email: {
        type: "email",
        label: "emailTemplates.adminNotification.preview.email.label",
        defaultValue: "max@example.com",
        required: true,
      },
      planName: {
        type: "text",
        label: "emailTemplates.adminNotification.preview.planName.label",
        defaultValue: "Premium Plan",
        required: true,
      },
      statusName: {
        type: "text",
        label: "emailTemplates.adminNotification.preview.statusName.label",
        defaultValue: "Active",
        required: true,
      },
    },
  },
  schema: adminSubscriptionPropsSchema,
  component: ({ props, t, locale, recipientEmail }) =>
    AdminSubscriptionNotificationEmailContent({
      user: {
        privateName: props.privateName,
        publicName: props.publicName,
        email: props.email,
      },
      planName: props.planName,
      statusName: props.statusName,
      t,
      locale,
      recipientEmail,
    }),
  exampleProps: {
    privateName: "Max",
    publicName: "Max Mustermann",
    email: "max@example.com",
    planName: "Premium Plan",
    statusName: "Active",
  },
  render: ({ user, requestData, locale }) => {
    const { t } = subscriptionScopedTranslation.scopedT(locale);
    try {
      const adminEmail = contactClientRepository.getSupportEmail(locale);
      const templateProps: AdminSubscriptionProps = {
        privateName: requestData.user?.privateName ?? "",
        publicName: requestData.user?.publicName ?? "",
        email: requestData.user?.email ?? "",
        planName: requestData.planName ?? "",
        statusName: requestData.statusName ?? "",
      };
      return success({
        toEmail: adminEmail,
        toName: adminEmail,
        subject: t("email.admin_notification.subject", {
          planName: templateProps.planName,
        }),
        leadId: requestData.user?.leadId ?? user.leadId,
        jsx: adminSubscriptionNotificationEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: adminEmail,
          tracking: createTrackingContext(locale),
        }),
      });
    } catch {
      return fail({
        message: t("email.admin_notification.subject"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
