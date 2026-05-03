/**
 * Newsletter Subscribe Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Hr, Link, Section } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { configScopedTranslation } from "@/config/i18n";

import { EmailTemplate } from "../../messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../../messenger/providers/email/smtp-client/components/tracking_context.email";
import type definition from "./definition";
import {
  type SubscribePostRequestOutput as NewsletterSubscriptionType,
  type SubscribePostResponseOutput as NewsletterSubscriptionResponseType,
} from "./definition";
import { scopedTranslation } from "./i18n";

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

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function NewsletterWelcomeEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: NewsletterWelcomeProps;
  t: ModuleT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");

  return (
    <EmailTemplate
      locale={locale}
      title={t("emailTemplate.welcome.title", { appName })}
      previewText={t("emailTemplate.welcome.preview")}
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
          ? t("emailTemplate.welcome.greeting_with_name", {
              name: props.name,
            })
          : t("emailTemplate.welcome.greeting")}
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
        {t("emailTemplate.welcome.message", { appName })}
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
        {t("emailTemplate.welcome.what_to_expect")}
      </div>

      <ul
        style={{
          color: "#374151",
          paddingLeft: "20px",
          marginBottom: "24px",
        }}
      >
        <li style={{ margin: "8px 0" }}>
          {t("emailTemplate.welcome.benefit_1")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("emailTemplate.welcome.benefit_2")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("emailTemplate.welcome.benefit_3")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("emailTemplate.welcome.benefit_4")}
        </li>
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
        {t("emailTemplate.welcome.frequency")}
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
        {t("emailTemplate.welcome.unsubscribe_text")}{" "}
        <Link
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/story/newsletter/unsubscribe/${encodeURIComponent(
            props.email,
          )}`}
          style={{ color: "#4f46e5" }}
        >
          {t("emailTemplate.welcome.unsubscribe_link")}
        </Link>
      </div>
    </EmailTemplate>
  );
}

// Template Definition Export
export const newsletterWelcomeEmailTemplate: EmailTemplateDefinition<
  NewsletterWelcomeProps,
  typeof scopedTranslation,
  NewsletterSubscriptionType,
  NewsletterSubscriptionResponseType,
  never,
  typeof definition.POST.allowedRoles
> = {
  meta: {
    id: "newsletter-welcome",
    version: "1.0.0",
    name: "emailTemplates.welcome.name",
    description: "emailTemplates.welcome.description",
    category: "emailTemplates.welcome.category",
    path: "/newsletter/subscribe/email.tsx",
    defaultSubject: "emailTemplate.welcome.subject",
    previewFields: {
      email: {
        type: "email",
        label: "emailTemplates.welcome.preview.email.label",
        description: "emailTemplates.welcome.preview.email.description",
        defaultValue: "max@example.com",
        required: true,
      },
      name: {
        type: "text",
        label: "emailTemplates.welcome.preview.name.label",
        description: "emailTemplates.welcome.preview.name.description",
        defaultValue: "Max Mustermann",
      },
      leadId: {
        type: "text",
        label: "emailTemplates.welcome.preview.leadId.label",
        description: "emailTemplates.welcome.preview.leadId.description",
        defaultValue: "example-lead-id-456",
      },
      userId: {
        type: "text",
        label: "emailTemplates.welcome.preview.userId.label",
        description: "emailTemplates.welcome.preview.userId.description",
        defaultValue: "example-user-id-123",
      },
    },
  },
  scopedTranslation,
  schema: newsletterWelcomePropsSchema,
  component: NewsletterWelcomeEmail,
  exampleProps: {
    email: "max@example.com",
    name: "Max Mustermann",
    leadId: "example-lead-id-456",
    userId: "example-user-id-123",
  },
  render: ({ requestData, responseData, locale, t }) => {
    const { t: configT } = configScopedTranslation.scopedT(locale);
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
        subject: t("emailTemplate.welcome.subject", {
          appName: configT("appName"),
        }),
        leadId: responseData.leadId,
        jsx: newsletterWelcomeEmailTemplate.component({
          props: templateProps,
          t,
          locale,
          recipientEmail: requestData.email,
          tracking: createTrackingContext(
            locale,
            responseData.leadId,
            responseData.userId,
          ),
        }),
      });
    } catch {
      return fail({
        message: t("errors.email_generation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

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
  t: ModuleT;
  locale: CountryLanguage;
  recipientEmail: string;
}): ReactElement {
  const tracking = createTrackingContext(locale);

  return (
    <EmailTemplate
      locale={locale}
      title={t("emailTemplate.admin_notification.title")}
      previewText={t("emailTemplate.admin_notification.preview")}
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
        {t("emailTemplate.admin_notification.message")}
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
        {t("emailTemplate.admin_notification.subscriber_details")}:
      </div>

      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#4b5563",
          marginBottom: "8px",
        }}
      >
        <strong>{t("emailTemplate.admin_notification.email")}:</strong>{" "}
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
          <strong>{t("emailTemplate.admin_notification.name")}:</strong>{" "}
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
            <strong>
              {t("emailTemplate.admin_notification.preferences")}:
            </strong>
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
          {t("emailTemplate.admin_notification.view_in_admin")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE
// ============================================================================

const adminNewsletterSubscribePropsSchema = z.object({
  subscriberEmail: z.string().email(),
  subscriberName: z.string().optional(),
});

type AdminNewsletterSubscribeProps = z.infer<
  typeof adminNewsletterSubscribePropsSchema
>;

export const adminNewsletterSubscribeEmailTemplate: EmailTemplateDefinition<
  AdminNewsletterSubscribeProps,
  typeof scopedTranslation,
  NewsletterSubscriptionType,
  NewsletterSubscriptionResponseType,
  never,
  typeof definition.POST.allowedRoles
> = {
  meta: {
    id: "newsletter-subscribe-admin",
    version: "1.0.0",
    name: "emailTemplates.welcome.name",
    description: "emailTemplates.welcome.description",
    category: "emailTemplates.welcome.category",
    path: "/newsletter/subscribe/email.tsx",
    defaultSubject: "emailTemplate.admin_notification.subject",
    previewFields: {
      subscriberEmail: {
        type: "email",
        label: "emailTemplates.welcome.preview.email.label",
        defaultValue: "subscriber@example.com",
        required: true,
      },
      subscriberName: {
        type: "text",
        label: "emailTemplates.welcome.preview.name.label",
        defaultValue: "Max Mustermann",
      },
    },
  },
  scopedTranslation,
  schema: adminNewsletterSubscribePropsSchema,
  component: ({ props, t, locale, recipientEmail }) =>
    AdminNotificationEmailContent({
      requestData: { email: props.subscriberEmail, name: props.subscriberName },
      t,
      locale,
      recipientEmail,
    }),
  exampleProps: {
    subscriberEmail: "subscriber@example.com",
    subscriberName: "Max Mustermann",
  },
  render: ({ requestData, locale, t, user }) => {
    const { t: globalT } = configScopedTranslation.scopedT(locale);
    try {
      return success({
        toEmail: contactClientRepository.getSupportEmail(locale),
        toName: globalT("appName"),
        subject: t("emailTemplate.admin_notification.subject"),
        leadId: user.leadId,
        jsx: AdminNotificationEmailContent({
          requestData,
          t,
          locale,
          recipientEmail: contactClientRepository.getSupportEmail(locale),
        }),
      });
    } catch {
      return fail({
        message: t("errors.email_generation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
