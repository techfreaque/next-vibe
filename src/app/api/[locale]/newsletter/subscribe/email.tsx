/**
 * Newsletter Subscribe Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Hr, Link, Section } from "@react-email/components";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailTemplate } from "../../emails/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../../emails/smtp-client/components/tracking_context.email";
import type {
  SubscribePostRequestOutput as NewsletterSubscriptionType,
  SubscribePostResponseOutput as NewsletterSubscriptionResponseType,
} from "./definition";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const newsletterWelcomePropsSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  leadId: z.string().optional(),
  userId: z.string().optional(),
});

type NewsletterWelcomeProps = z.infer<typeof newsletterWelcomePropsSchema>;

function NewsletterWelcomeEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: NewsletterWelcomeProps;
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const appName = t("config.appName");

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.newsletter.email.welcome.title")}
      previewText={t("app.api.newsletter.email.welcome.preview")}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      {/* Greeting */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {props.name
          ? t("app.api.newsletter.email.welcome.greeting_with_name", {
              name: props.name,
            })
          : t("app.api.newsletter.email.welcome.greeting")}
      </div>

      {/* Welcome message */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.newsletter.email.welcome.message", { appName })}
      </div>

      {/* What to expect */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {t("app.api.newsletter.email.welcome.what_to_expect")}
      </div>

      <ul
        style={{
          color: "#374151",
          paddingLeft: "20px",
          marginBottom: "24px",
        }}
      >
        <li style={{ margin: "8px 0" }}>{t("app.api.newsletter.email.welcome.benefit_1")}</li>
        <li style={{ margin: "8px 0" }}>{t("app.api.newsletter.email.welcome.benefit_2")}</li>
        <li style={{ margin: "8px 0" }}>{t("app.api.newsletter.email.welcome.benefit_3")}</li>
        <li style={{ margin: "8px 0" }}>{t("app.api.newsletter.email.welcome.benefit_4")}</li>
      </ul>

      {/* Frequency note */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.newsletter.email.welcome.frequency")}
      </div>

      {/* Unsubscribe link */}
      <div
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          marginTop: "32px",
        }}
      >
        {t("app.api.newsletter.email.welcome.unsubscribe_text")}{" "}
        <Link
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/newsletter/unsubscribe/${encodeURIComponent(
            props.email,
          )}`}
          style={{ color: "#4f46e5" }}
        >
          {t("app.api.newsletter.email.welcome.unsubscribe_link")}
        </Link>
      </div>
    </EmailTemplate>
  );
}

// Template Definition Export
const newsletterWelcomeTemplate: EmailTemplateDefinition<NewsletterWelcomeProps> = {
  meta: {
    id: "newsletter-welcome",
    version: "1.0.0",
    name: "app.api.emails.templates.newsletter.welcome.meta.name",
    description: "app.api.emails.templates.newsletter.welcome.meta.description",
    category: "newsletter",
    path: "/newsletter/subscribe/email.tsx",
    defaultSubject: (t) => t("app.api.newsletter.email.welcome.subject"),
    previewFields: {
      email: {
        type: "email",
        label: "app.admin.emails.templates.templates.newsletter.welcome.preview.email.label",
        description:
          "app.admin.emails.templates.templates.newsletter.welcome.preview.email.description",
        defaultValue: "max@example.com",
        required: true,
      },
      name: {
        type: "text",
        label: "app.admin.emails.templates.templates.newsletter.welcome.preview.name.label",
        description:
          "app.admin.emails.templates.templates.newsletter.welcome.preview.name.description",
        defaultValue: "Max Mustermann",
      },
      leadId: {
        type: "text",
        label: "app.admin.emails.templates.templates.newsletter.welcome.preview.leadId.label",
        description:
          "app.admin.emails.templates.templates.newsletter.welcome.preview.leadId.description",
        defaultValue: "example-lead-id-456",
      },
      userId: {
        type: "text",
        label: "app.admin.emails.templates.templates.newsletter.welcome.preview.userId.label",
        description:
          "app.admin.emails.templates.templates.newsletter.welcome.preview.userId.description",
        defaultValue: "example-user-id-123",
      },
    },
  },
  schema: newsletterWelcomePropsSchema,
  component: NewsletterWelcomeEmail,
  exampleProps: {
    email: "max@example.com",
    name: "Max Mustermann",
    leadId: "example-lead-id-456",
    userId: "example-user-id-123",
  },
};

export default newsletterWelcomeTemplate;

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE (Component - Not Registered)
// ============================================================================

function AdminNotificationEmailContent({
  requestData,
  t,
  locale,
  recipientEmail,
}: {
  requestData: NewsletterSubscriptionType;
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
}): ReactElement {
  const tracking = createTrackingContext(locale);

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.newsletter.email.admin_notification.title")}
      previewText={t("app.api.newsletter.email.admin_notification.preview")}
      recipientEmail={recipientEmail}
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
        {t("app.api.newsletter.email.admin_notification.message")}
      </div>

      <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

      {/* Subscriber details */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "12px",
        }}
      >
        {t("app.api.newsletter.email.admin_notification.subscriber_details")}:
      </div>

      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#4b5563",
          marginBottom: "8px",
        }}
      >
        <strong>{t("app.api.newsletter.email.admin_notification.email")}:</strong>{" "}
        {requestData.email}
      </div>

      {requestData.name && (
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          <strong>{t("app.api.newsletter.email.admin_notification.name")}:</strong>{" "}
          {requestData.name}
        </div>
      )}

      {requestData.preferences && requestData.preferences.length > 0 && (
        <>
          <div
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#4b5563",
              marginBottom: "8px",
            }}
          >
            <strong>{t("app.api.newsletter.email.admin_notification.preferences")}:</strong>
          </div>
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
          {t("app.api.newsletter.email.admin_notification.view_in_admin")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Newsletter Welcome Email Adapter
 * Maps newsletter subscription to welcome template props
 */
export const renderWelcomeMail: EmailFunctionType<
  NewsletterSubscriptionType,
  NewsletterSubscriptionResponseType,
  never
> = ({ requestData, responseData, locale, t }) => {
  try {
    const templateProps: NewsletterWelcomeProps = {
      email: requestData.email,
      name: requestData.name,
      leadId: responseData.leadId,
      userId: responseData.userId,
    };

    return success({
      toEmail: requestData.email,
      toName: requestData.name || requestData.email,
      subject: t("app.api.newsletter.email.welcome.subject"),
      jsx: newsletterWelcomeTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: requestData.email,
        tracking: createTrackingContext(locale, responseData.leadId, responseData.userId),
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
 * Admin Newsletter Subscription Notification Adapter
 * Sends notification to admin when new subscriber joins
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
      subject: t("app.api.newsletter.email.admin_notification.subject"),
      jsx: AdminNotificationEmailContent({
        requestData,
        t,
        locale,
        recipientEmail: contactClientRepository.getSupportEmail(locale),
      }),
    });
  } catch {
    return fail({
      message: "app.api.newsletter.errors.email_generation_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
