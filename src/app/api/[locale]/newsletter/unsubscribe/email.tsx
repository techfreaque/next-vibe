/**
 * Newsletter Unsubscribe Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Hr, Section } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailTemplate } from "../../emails/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../../emails/smtp-client/components/tracking_context.email";
import type {
  UnsubscribePostRequestOutput as NewsletterUnsubscribeType,
  UnsubscribePostResponseOutput as NewsletterUnsubscribeResponseType,
} from "./definition";
import {
  type NewsletterUnsubscribeTranslationKey,
  scopedTranslation,
} from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const newsletterUnsubscribePropsSchema = z.object({
  email: z.string().email(),
});

type NewsletterUnsubscribeProps = z.infer<
  typeof newsletterUnsubscribePropsSchema
>;

function NewsletterUnsubscribeEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: NewsletterUnsubscribeProps;
  t: ModuleT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  return (
    <EmailTemplate
      locale={locale}
      title={t("email.unsubscribe.title")}
      previewText={t("email.unsubscribe.preview")}
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
        {t("email.unsubscribe.greeting")}
      </div>

      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("email.unsubscribe.confirmation", {
          email: props.email,
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
        {t("email.unsubscribe.resubscribe_info")}
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
          {t("email.unsubscribe.resubscribe_button")}
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
        {t("email.unsubscribe.support_message")}
      </div>
    </EmailTemplate>
  );
}

// Template Definition Export
const newsletterUnsubscribeTemplate: EmailTemplateDefinition<
  NewsletterUnsubscribeProps,
  typeof scopedTranslation
> = {
  meta: {
    id: "newsletter-unsubscribe",
    version: "1.0.0",
    name: "emailTemplates.unsubscribe.name",
    description: "emailTemplates.unsubscribe.description",
    category: "emailTemplates.unsubscribe.category",
    path: "/newsletter/unsubscribe/email.tsx",
    defaultSubject: "email.unsubscribe.subject",
    previewFields: {
      email: {
        type: "email",
        label: "emailTemplates.unsubscribe.preview.email.label",
        description: "emailTemplates.unsubscribe.preview.email.description",
        defaultValue: "max@example.com",
        required: true,
      },
    },
  },
  scopedTranslation,
  schema: newsletterUnsubscribePropsSchema,
  component: NewsletterUnsubscribeEmail,
  exampleProps: {
    email: "max@example.com",
  },
};

export default newsletterUnsubscribeTemplate;

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE (Component - Not Registered)
// ============================================================================

function AdminUnsubscribeNotificationEmailContent({
  requestData,
  t,
  locale,
  recipientEmail,
}: {
  requestData: NewsletterUnsubscribeType;
  t: ModuleT;
  locale: CountryLanguage;
  recipientEmail: string;
}): ReactElement {
  const tracking = createTrackingContext(locale);

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.unsubscribe.admin_unsubscribe_notification.title")}
      previewText={t(
        "email.unsubscribe.admin_unsubscribe_notification.preview",
      )}
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
        {t("email.unsubscribe.admin_unsubscribe_notification.message")}
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
          {t("email.unsubscribe.admin_unsubscribe_notification.email")}:
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
          {t("email.unsubscribe.admin_unsubscribe_notification.date")}:
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
          {t("email.unsubscribe.admin_unsubscribe_notification.view_dashboard")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Unsubscribe Confirmation Email Adapter
 * Maps unsubscribe request to confirmation template props
 */
export const renderUnsubscribeConfirmationMail: EmailFunctionType<
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never,
  NewsletterUnsubscribeTranslationKey
> = ({ requestData, locale, t }) => {
  try {
    const templateProps: NewsletterUnsubscribeProps = {
      email: requestData.email,
    };

    return success({
      toEmail: requestData.email,
      toName: requestData.email,
      subject: t("email.unsubscribe.subject"),
      jsx: newsletterUnsubscribeTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: requestData.email,
        tracking: createTrackingContext(locale),
      }),
    });
  } catch {
    return fail({
      message: t("errors.email_generation_failed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};

/**
 * Admin Unsubscribe Notification Email Adapter
 * Sends notification to admin when user unsubscribes
 */
export const renderAdminUnsubscribeNotificationMail: EmailFunctionType<
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never,
  NewsletterUnsubscribeTranslationKey
> = ({ requestData, locale, t }) => {
  const { t: globalT } = simpleT(locale);
  try {
    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: globalT("config.appName"),
      subject: t("email.unsubscribe.admin_unsubscribe_notification.subject"),
      jsx: AdminUnsubscribeNotificationEmailContent({
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
};
