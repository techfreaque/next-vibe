/**
 * Newsletter Subscribe API Email Templates
 * React Email templates for newsletter subscription operations
 */

import { Button, Hr, Link, Section } from "@react-email/components";
import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";
import React from "react";
import { Span } from "next-vibe-ui/ui/span";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  SubscribePostRequestOutput as NewsletterSubscriptionType,
  SubscribePostResponseOutput as NewsletterSubscriptionResponseType,
} from "./definition";

/**
 * Welcome Email Template Component
 */
function WelcomeEmailContent({
  requestData,
  t,
  locale,
  leadId,
  userId,
}: {
  requestData: NewsletterSubscriptionType;
  t: TFunction;
  locale: CountryLanguage;
  leadId?: string;
  userId?: string;
}): JSX.Element {
  // Create tracking context for newsletter emails with leadId
  const tracking = createTrackingContext(
    locale,
    leadId, // leadId from newsletter subscription
    userId, // userId from newsletter subscription
    undefined, // no campaignId for transactional emails
  );

  const appName = t("config.appName");

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.newsletter.email.welcome.title")}
      previewText={t("app.api.v1.core.newsletter.email.welcome.preview")}
      tracking={tracking}
    >
      {/* Greeting */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {requestData.name
          ? t("app.api.v1.core.newsletter.email.welcome.greeting_with_name", {
              name: requestData.name,
            })
          : t("app.api.v1.core.newsletter.email.welcome.greeting")}
      </Span>

      {/* Welcome message */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.welcome.message", { appName })}
      </Span>

      {/* What to expect */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.welcome.what_to_expect")}
      </Span>

      <ul
        style={{
          color: "#374151",
          paddingLeft: "20px",
          marginBottom: "24px",
        }}
      >
        <li style={{ margin: "8px 0" }}>
          {t("app.api.v1.core.newsletter.email.welcome.benefit_1")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("app.api.v1.core.newsletter.email.welcome.benefit_2")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("app.api.v1.core.newsletter.email.welcome.benefit_3")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("app.api.v1.core.newsletter.email.welcome.benefit_4")}
        </li>
      </ul>

      {/* Frequency note */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.welcome.frequency")}
      </Span>

      {/* Unsubscribe link */}
      <Span
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          marginTop: "32px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.welcome.unsubscribe_text")}{" "}
        <Link
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/newsletter/unsubscribe/${encodeURIComponent(
            requestData.email,
          )}`}
          style={{ color: "#4f46e5" }}
        >
          {t("app.api.v1.core.newsletter.email.welcome.unsubscribe_link")}
        </Link>
      </Span>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Template Component
 */
function AdminNotificationEmailContent({
  requestData,
  t,
  locale,
}: {
  requestData: NewsletterSubscriptionType;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  // Create tracking context for newsletter admin emails
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for newsletter admin emails
    undefined, // no userId for newsletter admin emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.newsletter.email.admin_notification.title")}
      previewText={t(
        "app.api.v1.core.newsletter.email.admin_notification.preview",
      )}
      tracking={tracking}
    >
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.admin_notification.message")}
      </Span>

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

      {/* Subscriber details */}
      <Span
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "12px",
        }}
      >
        {t(
          "app.api.v1.core.newsletter.email.admin_notification.subscriber_details",
        )}
        :
      </Span>

      <Span
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#4b5563",
          marginBottom: "8px",
        }}
      >
        <strong>
          {t("app.api.v1.core.newsletter.email.admin_notification.email")}:
        </strong>{" "}
        {requestData.email}
      </Span>

      {requestData.name && (
        <Span
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          <strong>
            {t("app.api.v1.core.newsletter.email.admin_notification.name")}:
          </strong>{" "}
          {requestData.name}
        </Span>
      )}

      {requestData.preferences && requestData.preferences.length > 0 && (
        <>
          <Span
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#4b5563",
              marginBottom: "8px",
            }}
          >
            <strong>
              {t(
                "app.api.v1.core.newsletter.email.admin_notification.preferences",
              )}
              :
            </strong>
          </Span>
          <ul style={{ color: "#4b5563", paddingLeft: "20px" }}>
            {requestData.preferences.map((preference: string) => (
              <li key={preference} style={{ margin: "4px 0" }}>
                {preference}
              </li>
            ))}
          </ul>
        </>
      )}

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

      {/* View in admin panel button */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/newsletter`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            padding: "10px 20px",
            textDecoration: "none",
          }}
        >
          {t(
            "app.api.v1.core.newsletter.email.admin_notification.view_in_admin",
          )}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Welcome Email for New Subscribers
 * Renders a welcome email for new newsletter subscribers
 */
export const renderWelcomeMail: EmailFunctionType<
  NewsletterSubscriptionType,
  NewsletterSubscriptionResponseType,
  never
> = ({ requestData, responseData, locale, t }) => {
  try {
    return success({
      toEmail: requestData.email,
      toName: requestData.name || requestData.email,
      subject: t("app.api.v1.core.newsletter.email.welcome.subject"),
      jsx: WelcomeEmailContent({
        requestData,
        t,
        locale,
        leadId: responseData.leadId,
        userId: responseData.userId,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.newsletter.errors.email_generation_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Notification Email for Admin
 * Sends a notification to the admin when a new subscriber joins
 */
export const renderAdminNotificationMail: EmailFunctionType<
  NewsletterSubscriptionType,
  NewsletterSubscriptionResponseType,
  never
> = ({ requestData, locale, t }) => {
  try {
    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.v1.core.newsletter.email.admin_notification.subject"),
      jsx: AdminNotificationEmailContent({
        requestData,
        t,
        locale,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.newsletter.errors.email_generation_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
