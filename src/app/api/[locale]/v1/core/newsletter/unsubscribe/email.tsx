/**
 * Newsletter Unsubscribe API Email Templates
 * React Email templates for newsletter unsubscription operations
 */

import { Button, Hr, Section } from "@react-email/components";
import {
  createErrorResponse,
  createSuccessResponse,
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
  UnsubscribePostRequestOutput as NewsletterUnsubscribeType,
  UnsubscribePostResponseOutput as NewsletterUnsubscribeResponseType,
} from "./definition";

/**
 * Unsubscribe Confirmation Email Template Component
 */
function UnsubscribeConfirmationEmailContent({
  requestData,
  t,
  locale,
}: {
  requestData: NewsletterUnsubscribeType;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  // Create tracking context for unsubscribe emails
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for unsubscribe emails
    undefined, // no userId for unsubscribe emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.newsletter.email.unsubscribe.title")}
      previewText={t("app.api.v1.core.newsletter.email.unsubscribe.preview")}
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
        {t("app.api.v1.core.newsletter.email.unsubscribe.greeting")}
      </Span>

      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.newsletter.email.unsubscribe.confirmation", {
          email: requestData.email,
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
        {t("app.api.v1.core.newsletter.email.unsubscribe.resubscribe_info")}
      </Span>

      <Section style={{ textAlign: "center", marginTop: "32px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/newsletter/subscribe`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            padding: "12px 24px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.v1.core.newsletter.email.unsubscribe.resubscribe_button")}
        </Button>
      </Section>

      <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0" }} />

      <Span
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        {t("app.api.v1.core.newsletter.email.unsubscribe.support_message")}
      </Span>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Template Component
 */
function AdminUnsubscribeNotificationEmailContent({
  requestData,
  t,
  locale,
}: {
  requestData: NewsletterUnsubscribeType;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  // Create tracking context for admin emails
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
      title={t(
        "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.title",
      )}
      previewText={t(
        "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.preview",
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
        {t(
          "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.message",
        )}
      </Span>

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

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
            "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.email",
          )}
          :
        </strong>{" "}
        {requestData.email}
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
          {t(
            "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.date",
          )}
          :
        </strong>{" "}
        {new Date().toLocaleDateString()}
      </Span>

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

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
            display: "inline-block",
          }}
        >
          {t(
            "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.view_dashboard",
          )}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Unsubscribe Confirmation Email for Users
 * Renders a confirmation email when users unsubscribe from newsletter
 */
export const renderUnsubscribeConfirmationMail: EmailFunctionType<
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never
> = ({ requestData, locale, t }) => {
  try {
    return createSuccessResponse({
      toEmail: requestData.email,
      toName: requestData.email,
      subject: t("app.api.v1.core.newsletter.email.unsubscribe.subject"),
      jsx: UnsubscribeConfirmationEmailContent({
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

/**
 * Admin Notification Email for Unsubscribe
 * Sends a notification to the admin when a user unsubscribes
 */
export const renderAdminUnsubscribeNotificationMail: EmailFunctionType<
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never
> = ({ requestData, locale, t }) => {
  try {
    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("app.common.appName"),
      subject: t(
        "app.api.v1.core.newsletter.email.unsubscribe.admin_unsubscribe_notification.subject",
      ),
      jsx: AdminUnsubscribeNotificationEmailContent({
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
