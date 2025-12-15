/**
 * Newsletter Unsubscribe API Email Templates
 * React Email templates for newsletter unsubscription operations
 */

import { Button, Hr, Section } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";
import React from "react";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailTemplate } from "../../emails/smtp-client/components/template.email";
import { createTrackingContext } from "../../emails/smtp-client/components/tracking_context.email";
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
    locale, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.newsletter.email.unsubscribe.title")}
      previewText={t("app.api.newsletter.email.unsubscribe.preview")}
      tracking={tracking}
    >
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.newsletter.email.unsubscribe.greeting")}
      </div>

      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.newsletter.email.unsubscribe.confirmation", {
          email: requestData.email,
        })}
      </div>

      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.newsletter.email.unsubscribe.resubscribe_info")}
      </div>

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
          {t("app.api.newsletter.email.unsubscribe.resubscribe_button")}
        </Button>
      </Section>

      <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0" }} />

      <div
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        {t("app.api.newsletter.email.unsubscribe.support_message")}
      </div>
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
    locale, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t(
        "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.title",
      )}
      previewText={t(
        "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.preview",
      )}
      tracking={tracking}
    >
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t(
          "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.message",
        )}
      </div>

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#4b5563",
          marginBottom: "8px",
        }}
      >
        <strong>
          {t(
            "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.email",
          )}
          :
        </strong>{" "}
        {requestData.email}
      </div>

      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#4b5563",
          marginBottom: "8px",
        }}
      >
        <strong>
          {t(
            "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.date",
          )}
          :
        </strong>{" "}
        {new Date().toLocaleDateString()}
      </div>

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
            "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.view_dashboard",
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
    return success({
      toEmail: requestData.email,
      toName: requestData.email,
      subject: t("app.api.newsletter.email.unsubscribe.subject"),
      jsx: UnsubscribeConfirmationEmailContent({
        requestData,
        t,
        locale,
      }),
    });
  } catch {
    return fail({
      message: "app.api.newsletter.errors.email_generation_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
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
    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t(
        "app.api.newsletter.email.unsubscribe.admin_unsubscribe_notification.subject",
      ),
      jsx: AdminUnsubscribeNotificationEmailContent({
        requestData,
        t,
        locale,
      }),
    });
  } catch {
    return fail({
      message: "app.api.newsletter.errors.email_generation_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
