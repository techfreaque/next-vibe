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

import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailTemplate } from "../emails/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "../emails/smtp-client/components/tracking_context.email";
import type { ContactRequestOutput, ContactResponseOutput } from "./definition";
import { contactClientRepository } from "./repository-client";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const contactFormPropsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string(),
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
  t: TFunction;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.contact.email.partner.greeting", {
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
        {t("app.api.contact.email.partner.thankYou")}
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
          {t("app.api.contact.email.company.contactDetails")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.contact.email.company.name")}:
          </Span>{" "}
          {props.name}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.contact.email.company.email")}:
          </Span>{" "}
          <Link href={`mailto:${props.email}`} style={{ color: "#4f46e5" }}>
            {props.email}
          </Link>
        </Span>

        {props.company && (
          <Span
            style={{
              fontSize: "14px",
              marginBottom: "4px",
              color: "#4b5563",
            }}
          >
            <Span style={{ fontWeight: "700" }}>
              {t("app.api.contact.email.company.company")}:
            </Span>{" "}
            {props.company}
          </Span>
        )}

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.contact.email.company.contactSubject")}:
          </Span>{" "}
          {props.subject}
        </Span>

        <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />

        <Span
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {t("app.api.contact.email.partner.message")}
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
        {t("app.api.contact.email.partner.additionalInfo")}
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
            {t("app.api.contact.email.company.viewDetails")}
          </Button>
        </Section>
      )}
    </EmailTemplate>
  );
}

// Template Definition Export
const contactFormTemplate: EmailTemplateDefinition<ContactFormProps> = {
  meta: {
    id: "contact-form",
    version: "1.0.0",
    name: "app.api.emails.templates.contact.form.meta.name",
    description: "app.api.emails.templates.contact.form.meta.description",
    category: "contact",
    path: "/contact/email.tsx",
    defaultSubject: (t) =>
      t("app.api.contact.email.partner.subject", { subject: "" }),
    previewFields: {
      name: {
        type: "text",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.name.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.name.description",
        defaultValue: "Max Mustermann",
        required: true,
      },
      email: {
        type: "email",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.email.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.email.description",
        defaultValue: "max@example.com",
        required: true,
      },
      company: {
        type: "text",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.company.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.company.description",
        defaultValue: "Musterfirma GmbH",
      },
      subject: {
        type: "text",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.subject.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.subject.description",
        defaultValue: "Anfrage zu Ihren Dienstleistungen",
        required: true,
      },
      message: {
        type: "textarea",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.message.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.message.description",
        defaultValue:
          "Ich hätte gerne weitere Informationen zu Ihren Premium-Services.",
        required: true,
        rows: 5,
      },
      isForCompany: {
        type: "boolean",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.isForCompany.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.isForCompany.description",
        defaultValue: true,
      },
      userId: {
        type: "text",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.userId.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.userId.description",
        defaultValue: "example-user-id-123",
      },
      leadId: {
        type: "text",
        label:
          "app.admin.emails.templates.templates.contact.form.preview.leadId.label",
        description:
          "app.admin.emails.templates.templates.contact.form.preview.leadId.description",
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
    subject: "Anfrage zu Ihren Dienstleistungen",
    message: "Ich hätte gerne weitere Informationen zu Ihren Premium-Services.",
    isForCompany: true,
    userId: "example-user-id-123",
    leadId: "example-lead-id-456",
  },
};

export default contactFormTemplate;

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Company Team Email Adapter
 * Maps contact form data to template props for company email
 */
export const renderCompanyMail: EmailFunctionType<
  ContactRequestOutput,
  ContactResponseOutput,
  never
> = ({ requestData, locale, t }) => {
  try {
    const templateProps: ContactFormProps = {
      name: requestData.name,
      email: requestData.email,
      company: requestData.company,
      subject: requestData.subject,
      message: requestData.message,
      isForCompany: true,
    };

    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.contact.email.partner.subject", {
        subject: requestData.subject,
      }),
      replyToEmail: requestData.email,
      replyToName: requestData.name,
      jsx: contactFormTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: contactClientRepository.getSupportEmail(locale),
        tracking: createTrackingContext(locale),
      }),
    });
  } catch {
    return fail({
      message: "app.api.contact.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};

/**
 * Partner/Customer Email Adapter
 * Maps contact form data to template props for customer confirmation email
 */
export const renderPartnerMail: EmailFunctionType<
  ContactRequestOutput,
  ContactResponseOutput,
  never
> = ({ requestData, locale, t, user }) => {
  try {
    const templateProps: ContactFormProps = {
      name: requestData.name,
      email: requestData.email,
      company: requestData.company,
      subject: requestData.subject,
      message: requestData.message,
      isForCompany: false,
      userId: user?.id,
      leadId: user?.leadId,
    };

    return success({
      toEmail: requestData.email,
      toName: requestData.name,
      subject: t("app.api.contact.email.partner.subject", {
        subject: requestData.subject,
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),
      jsx: contactFormTemplate.component({
        props: templateProps,
        t,
        locale,
        recipientEmail: requestData.email,
        tracking: createTrackingContext(locale, user?.leadId, user?.id),
      }),
    });
  } catch {
    return fail({
      message: "app.api.contact.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
