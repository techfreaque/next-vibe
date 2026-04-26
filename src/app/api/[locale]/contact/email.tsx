/**
 * Contact Form Email Template
 * Refactored to separate template from business logic
 */

import {
  Button,
  Hr,
  Link,
  Section,
  Text as Span,
} from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import { env } from "@/config/env";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailTemplate } from "../messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../messenger/providers/email/smtp-client/components/tracking_context.email";
import type definition from "./definition";
import { type ContactRequest, type ContactResponse } from "./definition";
import { type ContactT, scopedTranslation } from "./i18n";
import { contactClientRepository } from "./repository-client";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const contactFormPropsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string(),
  priority: z.string().optional(),
  message: z.string(),
  isForCompany: z.boolean(),
  userId: z.string().optional(),
  leadId: z.string().optional(),
});

type ContactFormProps = z.infer<typeof contactFormPropsSchema>;

function ContactFormEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: ContactFormProps;
  t: ContactT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  return (
    <EmailTemplate
      locale={locale}
      title={t("email.partner.greeting", {
        name: props.name,
      })}
      previewText={props.subject}
      recipientEmail={recipientEmail}
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
        {t("email.partner.thankYou")}
      </Span>

      {/* Contact Details Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Span
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          {t("email.company.contactDetails")}
        </Span>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            color: "#4b5563",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                  width: "120px",
                }}
              >
                {t("email.company.name")}:
              </td>
              <td style={{ paddingBottom: "8px", verticalAlign: "top" }}>
                {props.name}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                }}
              >
                {t("email.company.email")}:
              </td>
              <td style={{ paddingBottom: "8px", verticalAlign: "top" }}>
                <Link
                  href={`mailto:${props.email}`}
                  style={{ color: "#4f46e5" }}
                >
                  {props.email}
                </Link>
              </td>
            </tr>
            {props.company && (
              <tr>
                <td
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  {t("email.company.company")}:
                </td>
                <td style={{ paddingBottom: "8px", verticalAlign: "top" }}>
                  {props.company}
                </td>
              </tr>
            )}
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                }}
              >
                {t("email.company.contactSubject")}:
              </td>
              <td style={{ paddingBottom: "8px", verticalAlign: "top" }}>
                {t(props.subject as Parameters<ContactT>[0])}
              </td>
            </tr>
            {props.priority && (
              <tr>
                <td
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  {t("email.admin_notification.priority")}:
                </td>
                <td style={{ paddingBottom: "8px", verticalAlign: "top" }}>
                  {t(props.priority as Parameters<ContactT>[0])}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />

        <Span
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {t("email.partner.message")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            color: "#4b5563",
            whiteSpace: "pre-wrap",
            backgroundColor: "#ffffff",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
          }}
        >
          {props.message}
        </Span>
      </Section>

      {/* Additional Info Section */}
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("email.partner.additionalInfo")}
      </Span>

      {/* Admin Button for Company Emails */}
      {props.isForCompany && (
        <Section style={{ textAlign: "center", marginTop: "24px" }}>
          <Button
            href={`${env.NEXT_PUBLIC_APP_URL}/admin/contacts`}
            style={{
              backgroundColor: "#4f46e5",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "14px",
              padding: "10px 20px",
              textDecoration: "none",
            }}
          >
            {t("email.company.viewDetails")}
          </Button>
        </Section>
      )}
    </EmailTemplate>
  );
}

// Template Definition Export
export const contactFormEmailTemplate: EmailTemplateDefinition<
  ContactFormProps,
  typeof scopedTranslation,
  ContactRequest,
  ContactResponse,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    id: "contact-form",
    version: "1.0.0",
    name: "emailTemplates.contactForm.meta.name",
    description: "emailTemplates.contactForm.meta.description",
    category: "emailTemplates.contactForm.meta.category",
    path: "/contact/email.tsx",
    defaultSubject: "email.partner.subject",
    previewFields: {
      name: {
        type: "text",
        label: "emailTemplates.contactForm.preview.name.label",
        description: "emailTemplates.contactForm.preview.name.description",
        defaultValue: "Max Mustermann",
        required: true,
      },
      email: {
        type: "email",
        label: "emailTemplates.contactForm.preview.email.label",
        description: "emailTemplates.contactForm.preview.email.description",
        defaultValue: "max@example.com",
        required: true,
      },
      company: {
        type: "text",
        label: "emailTemplates.contactForm.preview.company.label",
        description: "emailTemplates.contactForm.preview.company.description",
        defaultValue: "Musterfirma GmbH",
      },
      subject: {
        type: "text",
        label: "emailTemplates.contactForm.preview.subject.label",
        description: "emailTemplates.contactForm.preview.subject.description",
        defaultValue: "subject.helpSupport",
        required: true,
      },
      priority: {
        type: "text",
        label: "emailTemplates.contactForm.preview.priority.label",
        description: "emailTemplates.contactForm.preview.priority.description",
        defaultValue: "priority.medium",
      },
      message: {
        type: "textarea",
        label: "emailTemplates.contactForm.preview.message.label",
        description: "emailTemplates.contactForm.preview.message.description",
        defaultValue:
          "Ich hätte gerne weitere Informationen zu Ihren Premium-Services.",
        required: true,
        rows: 5,
      },
      isForCompany: {
        type: "boolean",
        label: "emailTemplates.contactForm.preview.isForCompany.label",
        description:
          "emailTemplates.contactForm.preview.isForCompany.description",
        defaultValue: true,
      },
      userId: {
        type: "text",
        label: "emailTemplates.contactForm.preview.userId.label",
        description: "emailTemplates.contactForm.preview.userId.description",
        defaultValue: "example-user-id-123",
      },
      leadId: {
        type: "text",
        label: "emailTemplates.contactForm.preview.leadId.label",
        description: "emailTemplates.contactForm.preview.leadId.description",
        defaultValue: "example-lead-id-456",
      },
    },
  },
  schema: contactFormPropsSchema,
  component: ContactFormEmail,
  exampleProps: {
    name: "Max Mustermann",
    email: "max@example.com",
    company: "Musterfirma GmbH",
    subject: "subject.helpSupport",
    priority: "priority.medium",
    message: "Ich hätte gerne weitere Informationen zu Ihren Premium-Services.",
    isForCompany: true,
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
  },
  render: ({ requestData, locale, user }) => {
    const { t: contactT } = scopedTranslation.scopedT(locale);
    const { t: globalT } = configScopedTranslation.scopedT(locale);
    try {
      const resolvedEmail = requestData.email ?? "";
      const templateProps: ContactFormProps = {
        name: requestData.name,
        email: resolvedEmail,
        subject: requestData.subject,
        priority: requestData.priority,
        message: requestData.message,
        isForCompany: true,
      };

      return success({
        toEmail: contactClientRepository.getSupportEmail(locale),
        toName: globalT("appName"),
        subject: contactT("email.partner.subject", {
          subject: requestData.subject,
        }),
        replyToEmail: resolvedEmail,
        replyToName: requestData.name,
        leadId: user.leadId,
        jsx: contactFormEmailTemplate.component({
          props: templateProps,
          t: contactT,
          locale,
          recipientEmail: contactClientRepository.getSupportEmail(locale),
          tracking: createTrackingContext(locale),
        }),
      });
    } catch {
      return fail({
        message: contactT("errors.email_generation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

// Admin contact notification template - same component, isForCompany forced true
const adminContactPropsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string(),
  priority: z.string().optional(),
  message: z.string(),
  userId: z.string().optional(),
  leadId: z.string().optional(),
});

type AdminContactProps = z.infer<typeof adminContactPropsSchema>;

export const adminContactFormEmailTemplate: EmailTemplateDefinition<
  AdminContactProps,
  typeof scopedTranslation,
  ContactRequest,
  ContactResponse,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    id: "admin-contact-form-notification",
    version: "1.0.0",
    name: "emailTemplates.adminContact.meta.name",
    description: "emailTemplates.adminContact.meta.description",
    category: "emailTemplates.adminContact.meta.category",
    path: "/contact/email.tsx",
    defaultSubject: "email.partner.subject",
    previewFields: {
      name: {
        type: "text",
        label: "emailTemplates.adminContact.preview.name.label",
        defaultValue: "Max Mustermann",
        required: true,
      },
      email: {
        type: "email",
        label: "emailTemplates.adminContact.preview.email.label",
        defaultValue: "max@example.com",
        required: true,
      },
      subject: {
        type: "text",
        label: "emailTemplates.adminContact.preview.subject.label",
        defaultValue: "subject.generalInquiry",
        required: true,
      },
      priority: {
        type: "text",
        label: "emailTemplates.adminContact.preview.priority.label",
        defaultValue: "priority.high",
      },
      message: {
        type: "textarea",
        label: "emailTemplates.adminContact.preview.message.label",
        defaultValue:
          "I would like to know more about your subscription plans.",
        required: true,
      },
      company: {
        type: "text",
        label: "emailTemplates.adminContact.preview.company.label",
        defaultValue: "Acme Corp",
      },
      userId: {
        type: "text",
        label: "emailTemplates.adminContact.preview.userId.label",
        defaultValue: "example-user-id-123",
      },
      leadId: {
        type: "text",
        label: "emailTemplates.adminContact.preview.leadId.label",
        defaultValue: "example-lead-id-456",
      },
    },
  },
  schema: adminContactPropsSchema,
  component: ({ props, t, locale, recipientEmail, tracking }) =>
    ContactFormEmail({
      props: { ...props, isForCompany: true },
      t,
      locale,
      recipientEmail,
      tracking,
    }),
  exampleProps: {
    name: "Max Mustermann",
    email: "max@example.com",
    subject: "subject.generalInquiry",
    priority: "priority.high",
    message: "I would like to know more about your subscription plans.",
    company: "Acme Corp",
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
  },
  render: ({ requestData, locale, user }) => {
    const { t: contactT } = scopedTranslation.scopedT(locale);
    try {
      const resolvedEmail = requestData.email ?? "";
      const templateProps: ContactFormProps = {
        name: requestData.name,
        email: resolvedEmail,
        subject: requestData.subject,
        priority: requestData.priority,
        message: requestData.message,
        isForCompany: false,
        userId: user?.id,
        leadId: user?.leadId,
      };
      const { t: globalT } = configScopedTranslation.scopedT(locale);

      return success({
        toEmail: resolvedEmail,
        toName: requestData.name,
        subject: contactT("email.partner.subject", {
          subject: requestData.subject,
        }),
        replyToEmail: contactClientRepository.getSupportEmail(locale),
        replyToName: globalT("appName"),
        leadId: user.leadId,
        jsx: contactFormEmailTemplate.component({
          props: templateProps,
          t: contactT,
          locale,
          recipientEmail: resolvedEmail,
          tracking: createTrackingContext(locale, user?.leadId, user?.id),
        }),
      });
    } catch {
      return fail({
        message: contactT("errors.email_generation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
