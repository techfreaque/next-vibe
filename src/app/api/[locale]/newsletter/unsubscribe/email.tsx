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
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import { env } from "@/config/env";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailTemplate } from "../../messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../../messenger/providers/email/smtp-client/components/tracking_context.email";
import type definition from "./definition";
import {
  type UnsubscribePostResponseOutput as NewsletterUnsubscribeResponseType,
  type UnsubscribePostRequestOutput as NewsletterUnsubscribeType,
} from "./definition";
import { scopedTranslation } from "./i18n";

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
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/story/newsletter`}
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
export const newsletterUnsubscribeEmailTemplate: EmailTemplateDefinition<
  NewsletterUnsubscribeProps,
  typeof scopedTranslation,
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never,
  typeof definition.POST.allowedRoles
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
  render: ({ requestData, locale, t, user }) => {
    try {
      return success({
        toEmail: requestData.email,
        toName: requestData.email,
        subject: t("email.unsubscribe.subject"),
        leadId: user.leadId,
        jsx: newsletterUnsubscribeEmailTemplate.component({
          props: { email: requestData.email },
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
  },
};

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
// ADMIN NOTIFICATION TEMPLATE
// ============================================================================

const adminNewsletterUnsubscribePropsSchema = z.object({
  unsubscribedEmail: z.string().email(),
});

type AdminNewsletterUnsubscribeProps = z.infer<
  typeof adminNewsletterUnsubscribePropsSchema
>;

export const adminNewsletterUnsubscribeEmailTemplate: EmailTemplateDefinition<
  AdminNewsletterUnsubscribeProps,
  typeof scopedTranslation,
  NewsletterUnsubscribeType,
  NewsletterUnsubscribeResponseType,
  never,
  typeof definition.POST.allowedRoles
> = {
  meta: {
    id: "newsletter-unsubscribe-admin",
    version: "1.0.0",
    name: "emailTemplates.unsubscribe.name",
    description: "emailTemplates.unsubscribe.description",
    category: "emailTemplates.unsubscribe.category",
    path: "/newsletter/unsubscribe/email.tsx",
    defaultSubject: "email.unsubscribe.admin_unsubscribe_notification.subject",
    previewFields: {
      unsubscribedEmail: {
        type: "email",
        label: "emailTemplates.unsubscribe.preview.email.label",
        defaultValue: "unsubscribed@example.com",
        required: true,
      },
    },
  },
  scopedTranslation,
  schema: adminNewsletterUnsubscribePropsSchema,
  component: ({ props, t, locale, recipientEmail }) =>
    AdminUnsubscribeNotificationEmailContent({
      requestData: { email: props.unsubscribedEmail },
      t,
      locale,
      recipientEmail,
    }),
  exampleProps: {
    unsubscribedEmail: "unsubscribed@example.com",
  },
  render: ({ requestData, locale, t, user }) => {
    const { t: configT } = configScopedTranslation.scopedT(locale);
    try {
      return success({
        toEmail: contactClientRepository.getSupportEmail(locale),
        toName: configT("appName"),
        subject: t("email.unsubscribe.admin_unsubscribe_notification.subject"),
        leadId: user.leadId,
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
  },
};
