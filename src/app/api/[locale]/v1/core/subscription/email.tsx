import { Button, Link, Section, Text as Span } from "@react-email/components";
import type React from "react";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { env } from "../../../../../../config/env";
import { contactClientRepository } from "../contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "../emails/smtp-client/components";
import { SubscriptionPlan, SubscriptionStatus } from "./enum";

/**
 * Email function type for subscription success notifications
 * This is a mock type since we don't have a specific endpoint for this
 */
interface SubscriptionSuccessEmailParams {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
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
      return t("app.story.pricing.creditPricing.subscription.title");
    default:
      return t("app.story.pricing.creditPricing.subscription.title");
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
      return t("app.api.v1.core.subscription.status.active");
    case SubscriptionStatus.TRIALING:
      return t("app.api.v1.core.subscription.status.trialing");
    case SubscriptionStatus.PAST_DUE:
      return t("app.api.v1.core.subscription.status.pastDue");
    case SubscriptionStatus.CANCELED:
      return t("app.api.v1.core.subscription.status.canceled");
    case SubscriptionStatus.INCOMPLETE:
      return t("app.api.v1.core.subscription.status.incomplete");
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return t("app.api.v1.core.subscription.status.incomplete_expired");
    case SubscriptionStatus.UNPAID:
      return t("app.api.v1.core.subscription.status.unpaid");
    case SubscriptionStatus.PAUSED:
      return t("app.api.v1.core.subscription.status.paused");
    default:
      return t("app.api.v1.core.subscription.status.incomplete");
  }
}

function renderSubscriptionSuccessEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { firstName: string; id: string; leadId: string },
  planName: string,
  baseUrl: string,
): React.ReactElement {
  // Create tracking context for subscription emails (transactional)
  const tracking = createTrackingContext(
    locale,
    user.leadId, // leadId from user
    user.id, // userId for subscription emails
    undefined, // no campaignId for transactional emails
    baseUrl,
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.subscription.email.success.title", {
        appName: t("app.common.appName"),
        firstName: user.firstName,
      })}
      previewText={t("app.api.v1.core.subscription.email.success.previewText", {
        appName: t("app.common.appName"),
        planName,
      })}
      tracking={tracking}
    >
      {/* Welcome Message */}
      <Span
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          marginBottom: "16px",
          fontWeight: "600",
        }}
      >
        {t("app.api.v1.core.subscription.email.success.welcomeMessage", {
          planName,
        })}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.subscription.email.success.description", {
          appName: t("app.common.appName"),
        })}
      </Span>

      {/* Next Steps Section */}
      <Section
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          border: "2px solid #2563eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Span
          style={{
            fontSize: "20px",
            lineHeight: "1.6",
            color: "#1e40af",
            fontWeight: "700",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          {t("app.api.v1.core.subscription.email.success.nextSteps.title")}
        </Span>
        <Span
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#1e40af",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.subscription.email.success.nextSteps.description",
          )}
        </Span>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Button
            href={`${baseUrl}/${locale}/`}
            style={{
              backgroundColor: "#2563eb",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "18px",
              padding: "16px 32px",
              textDecoration: "none",
              fontWeight: "700",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {t("app.api.v1.core.subscription.email.success.nextSteps.cta")}
          </Button>
        </div>
      </Section>

      {/* Support Section */}
      <Section
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        <Span
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#1f2937",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          {t("app.api.v1.core.subscription.email.success.support.title")}
        </Span>
        <Span
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          {t("app.api.v1.core.subscription.email.success.support.description")}
        </Span>
        <Button
          href={`${baseUrl}/${locale}/help`}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #6b7280",
            borderRadius: "6px",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "500",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.v1.core.subscription.email.success.support.cta")}
        </Button>
      </Section>

      {/* Footer */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginTop: "32px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("app.api.v1.core.subscription.email.success.footer.message")}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {t("app.api.v1.core.subscription.email.success.footer.signoff", {
          appName: t("app.common.appName"),
        })}
      </Span>
    </EmailTemplate>
  );
}

function renderAdminSubscriptionNotificationEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { firstName: string; lastName: string; email: string },
  planName: string,
  statusName: string,
): React.ReactElement {
  // Create tracking context for admin subscription emails (transactional)
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for admin emails
    undefined, // no userId for admin emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.subscription.email.admin_notification.title")}
      previewText={t(
        "app.api.v1.core.subscription.email.admin_notification.preview",
        {
          appName: t("app.common.appName"),
        },
      )}
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
        {t("app.api.v1.core.subscription.email.admin_notification.title")}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.subscription.email.admin_notification.message", {
          appName: t("app.common.appName"),
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
          {t("app.api.v1.core.subscription.email.admin_notification.details")}
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
              {t(
                "app.api.v1.core.subscription.email.admin_notification.user_name",
              )}
              :
            </Span>{" "}
            {user.firstName} {user.lastName}
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
              {t(
                "app.api.v1.core.subscription.email.admin_notification.user_email",
              )}
              :
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
              {t("app.api.v1.core.subscription.email.admin_notification.plan")}:
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
              {t(
                "app.api.v1.core.subscription.email.admin_notification.status",
              )}
              :
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
          {t(
            "app.api.v1.core.subscription.email.admin_notification.contact_user",
          )}
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
        {t("app.api.v1.core.subscription.email.admin_notification.footer", {
          appName: t("app.common.appName"),
        })}
      </Span>
    </EmailTemplate>
  );
}

/**
 * Render subscription success email for user
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
    jsx: JSX.Element;
  };
} => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const planName = getPlanName(subscription.planId, t);

  return {
    success: true,
    data: {
      toEmail: user.email,
      toName: user.firstName,
      subject: t("app.api.v1.core.subscription.email.success.subject", {
        appName: t("app.common.appName"),
        planName,
      }),
      jsx: renderSubscriptionSuccessEmailContent(
        t,
        locale,
        {
          firstName: user.firstName,
          id: user.id,
          leadId: user.leadId,
        },
        planName,
        baseUrl,
      ),
    },
  };
};

/**
 * Render admin notification email for subscription success
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
    jsx: JSX.Element;
  };
} => {
  const planName = getPlanName(subscription.planId, t);
  const statusName = getStatusName(subscription.status, t);

  return {
    success: true,
    data: {
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("app.common.appName"),
      subject: t(
        "app.api.v1.core.subscription.email.admin_notification.subject",
        {
          userName: user.firstName,
          planName,
        },
      ),
      jsx: renderAdminSubscriptionNotificationEmailContent(
        t,
        locale,
        user,
        planName,
        statusName,
      ),
    },
  };
};
