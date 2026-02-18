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

import {
  FEATURED_MODELS,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { contactClientRepository } from "../contact/repository-client";
import { EmailTemplate } from "../emails/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../emails/smtp-client/components/tracking_context.email";
import { SubscriptionPlan, SubscriptionStatus } from "./enum";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const subscriptionSuccessPropsSchema = z.object({
  privateName: z.string(),
  userId: z.string(),
  leadId: z.string(),
  planName: z.string(),
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
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const appName = t("config.appName");

  const modelCategories = [
    {
      label: t("app.api.subscription.email.success.models.mainstream"),
      models: FEATURED_MODELS.mainstream,
      color: "#1e40af",
      bg: "#dbeafe",
    },
    {
      label: t("app.api.subscription.email.success.models.open"),
      models: FEATURED_MODELS.open,
      color: "#166534",
      bg: "#dcfce7",
    },
    {
      label: t("app.api.subscription.email.success.models.uncensored"),
      models: FEATURED_MODELS.uncensored,
      color: "#7c2d12",
      bg: "#fed7aa",
    },
  ];

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.subscription.email.success.headline")}
      previewText={t("app.api.subscription.email.success.previewText", {
        privateName: props.privateName,
        modelCount: TOTAL_MODEL_COUNT,
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
          {t("app.api.subscription.email.success.activeBadge")}
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
        {t("app.api.subscription.email.success.greeting", {
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
        {t("app.api.subscription.email.success.intro", { appName })}
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
          {t("app.api.subscription.email.success.models.title", {
            modelCount: TOTAL_MODEL_COUNT,
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
          {t("app.api.subscription.email.success.included.title")}
        </Span>

        {[
          t("app.api.subscription.email.success.included.credits"),
          t("app.api.subscription.email.success.included.models", {
            modelCount: TOTAL_MODEL_COUNT,
          }),
          t("app.api.subscription.email.success.included.nolimits"),
          t("app.api.subscription.email.success.included.uncensored"),
          t("app.api.subscription.email.success.included.packs"),
          t("app.api.subscription.email.success.included.cancel"),
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
          {t("app.api.subscription.email.success.cta")}
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
          {t("app.api.subscription.email.success.packs.title")}
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
          {t("app.api.subscription.email.success.packs.description")}
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
          {t("app.api.subscription.email.success.packs.cta")}
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
        {t("app.api.subscription.email.success.manage", { appName })}{" "}
        <Link
          href={`${tracking.baseUrl}/${locale}/subscription`}
          style={{ color: "#6b7280", textDecoration: "underline" }}
        >
          {t("app.api.subscription.email.success.manageLink")}
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
        {t("app.api.subscription.email.success.signoff", { appName })}
      </Span>
    </EmailTemplate>
  );
}

// Template Definition Export
const subscriptionSuccessTemplate: EmailTemplateDefinition<SubscriptionSuccessProps> =
  {
    meta: {
      id: "subscription-success",
      version: "1.0.0",
      name: "app.api.emails.templates.subscription.success.meta.name",
      description:
        "app.api.emails.templates.subscription.success.meta.description",
      category: "subscription",
      path: "/subscription/email.tsx",
      defaultSubject: (t) =>
        t("app.api.subscription.email.success.subject", {
          appName: "",
          planName: "",
        }),
      previewFields: {
        privateName: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.subscription.success.preview.privateName.label",
          description:
            "app.admin.emails.templates.templates.subscription.success.preview.privateName.description",
          defaultValue: "Max",
          required: true,
        },
        userId: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.subscription.success.preview.userId.label",
          description:
            "app.admin.emails.templates.templates.subscription.success.preview.userId.description",
          defaultValue: "example-user-id-123",
          required: true,
        },
        leadId: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.subscription.success.preview.leadId.label",
          description:
            "app.admin.emails.templates.templates.subscription.success.preview.leadId.description",
          defaultValue: "example-lead-id-456",
          required: true,
        },
        planName: {
          type: "text",
          label:
            "app.admin.emails.templates.templates.subscription.success.preview.planName.label",
          description:
            "app.admin.emails.templates.templates.subscription.success.preview.planName.description",
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
    },
  };

export default subscriptionSuccessTemplate;

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
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
}): ReactElement {
  const tracking = createTrackingContext(locale);

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.subscription.email.admin_notification.title")}
      previewText={t("app.api.subscription.email.admin_notification.preview", {
        appName: t("config.appName"),
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
        {t("app.api.subscription.email.admin_notification.title")}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.subscription.email.admin_notification.message", {
          appName: t("config.appName"),
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
          {t("app.api.subscription.email.admin_notification.details")}
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
              {t("app.api.subscription.email.admin_notification.user_name")}:
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
              {t("app.api.subscription.email.admin_notification.user_email")}:
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
              {t("app.api.subscription.email.admin_notification.plan")}:
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
              {t("app.api.subscription.email.admin_notification.status")}:
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
          {t("app.api.subscription.email.admin_notification.contact_user")}
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
        {t("app.api.subscription.email.admin_notification.footer", {
          appName: t("config.appName"),
        })}
      </Span>
    </EmailTemplate>
  );
}

// Admin notification template definition (for preview registry)
export const adminSubscriptionNotificationTemplate: EmailTemplateDefinition<AdminSubscriptionProps> =
  {
    meta: {
      id: "admin-subscription-notification",
      version: "1.0.0",
      name: "app.api.emails.templates.admin.subscription.meta.name",
      description:
        "app.api.emails.templates.admin.subscription.meta.description",
      category: "admin",
      path: "/subscription/email.tsx",
      defaultSubject: (t) =>
        t("app.api.subscription.email.admin_notification.subject", {
          userName: "User",
          planName: "Plan",
        }),
      previewFields: {
        privateName: {
          type: "text",
          label:
            "app.api.emails.templates.admin.subscription.preview.privateName",
          defaultValue: "Max",
          required: true,
        },
        publicName: {
          type: "text",
          label:
            "app.api.emails.templates.admin.subscription.preview.publicName",
          defaultValue: "Max Mustermann",
          required: true,
        },
        email: {
          type: "email",
          label: "app.api.emails.templates.admin.subscription.preview.email",
          defaultValue: "max@example.com",
          required: true,
        },
        planName: {
          type: "text",
          label: "app.api.emails.templates.admin.subscription.preview.planName",
          defaultValue: "Premium Plan",
          required: true,
        },
        statusName: {
          type: "text",
          label:
            "app.api.emails.templates.admin.subscription.preview.statusName",
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
  };

// ============================================================================
// ADAPTERS (Business Logic - Maps custom data to template props)
// ============================================================================

/**
 * Email function type for subscription success notifications
 */
interface SubscriptionSuccessEmailParams {
  user: {
    id: string;
    email: string;
    privateName: string;
    publicName: string;
    leadId: string;
  };
  subscription: {
    id: string;
    planId: (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
    status: (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
    stripeSubscriptionId: string | null;
  };
  locale: CountryLanguage;
  t: TFunction;
}

/**
 * Helper function to get plan name from subscription plan ID
 */
function getPlanName(
  planId: (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan],
  t: TFunction,
): string {
  switch (planId) {
    case SubscriptionPlan.SUBSCRIPTION:
      return t("app.api.products.subscription.name");
    default:
      return t("app.api.products.subscription.name");
  }
}

/**
 * Helper function to get status name from subscription status
 */
function getStatusName(
  status: (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus],
  t: TFunction,
): string {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return t("app.api.subscription.status.active");
    case SubscriptionStatus.TRIALING:
      return t("app.api.subscription.status.trialing");
    case SubscriptionStatus.PAST_DUE:
      return t("app.api.subscription.status.pastDue");
    case SubscriptionStatus.CANCELED:
      return t("app.api.subscription.status.canceled");
    case SubscriptionStatus.INCOMPLETE:
      return t("app.api.subscription.status.incomplete");
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return t("app.api.subscription.status.incomplete_expired");
    case SubscriptionStatus.UNPAID:
      return t("app.api.subscription.status.unpaid");
    case SubscriptionStatus.PAUSED:
      return t("app.api.subscription.status.paused");
    default:
      return t("app.api.subscription.status.incomplete");
  }
}

/**
 * Subscription Success Email Adapter
 * Maps subscription data to success template props
 */
export const renderSubscriptionSuccessEmail = ({
  user,
  subscription,
  locale,
  t,
}: SubscriptionSuccessEmailParams): {
  success: boolean;
  data: {
    toEmail: string;
    toName: string;
    subject: string;
    jsx: ReactElement;
  };
} => {
  const planName = getPlanName(subscription.planId, t);

  const templateProps: SubscriptionSuccessProps = {
    privateName: user.privateName,
    userId: user.id,
    leadId: user.leadId,
    planName,
  };

  return {
    success: true,
    data: {
      toEmail: user.email,
      toName: user.privateName,
      subject: t("app.api.subscription.email.success.subject", {
        appName: t("config.appName"),
        planName,
      }),
      jsx: subscriptionSuccessTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: user.email,
        tracking: createTrackingContext(locale, user.leadId, user.id),
      }),
    },
  };
};

/**
 * Admin Subscription Notification Adapter
 * Sends admin notification when subscription is created
 */
export const renderAdminSubscriptionNotification = ({
  user,
  subscription,
  locale,
  t,
}: SubscriptionSuccessEmailParams): {
  success: boolean;
  data: {
    toEmail: string;
    toName: string;
    subject: string;
    jsx: ReactElement;
  };
} => {
  const planName = getPlanName(subscription.planId, t);
  const statusName = getStatusName(subscription.status, t);

  return {
    success: true,
    data: {
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.subscription.email.admin_notification.subject", {
        userName: user.privateName,
        planName,
      }),
      jsx: AdminSubscriptionNotificationEmailContent({
        user,
        planName,
        statusName,
        t,
        locale,
        recipientEmail: contactClientRepository.getSupportEmail(locale),
      }),
    },
  };
};
