/**
 * Contact Form Email Templates
 * React Email templates for contact form submissions
 */

import { Button, Hr, Link, Section, Text } from "@react-email/components";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";
import React from "react";

import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { ContactRequestOutput, ContactResponseOutput } from "./definition";
import { contactClientRepository } from "./repository-client";

/**
 * Shared Contact Email Template Component
 * Renders a consistent email template for both company and partner emails
 */
function ContactEmailContent({
  requestData,
  t,
  locale,
  isForCompany,
  userId,
  leadId,
}: {
  requestData: ContactRequestOutput;
  t: TFunction;
  locale: CountryLanguage;
  isForCompany: boolean;
  userId?: string;
  leadId?: string;
}): JSX.Element {
  // Create tracking context for contact emails with leadId and userId
  const tracking = createTrackingContext(
    locale,
    leadId, // leadId from contact form submission
    userId, // userId if user is logged in
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.contact.email.partner.greeting", {
        name: requestData.name,
      })}
      previewText={requestData.subject}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.contact.email.partner.thankYou")}
      </Text>

      {/* Contact Details Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          {t("app.api.v1.core.contact.email.company.contactDetails")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.contact.email.company.name")}:
          </Text>{" "}
          {requestData.name}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.contact.email.company.email")}:
          </Text>{" "}
          <Link
            href={`mailto:${requestData.email}`}
            style={{ color: "#4f46e5" }}
          >
            {requestData.email}
          </Link>
        </Text>

        {requestData.company && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "4px",
              color: "#4b5563",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t("app.api.v1.core.contact.email.company.company")}:
            </Text>{" "}
            {requestData.company}
          </Text>
        )}

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.contact.email.company.contactSubject")}:
          </Text>{" "}
          {requestData.subject}
        </Text>

        <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {t("app.api.v1.core.contact.email.partner.message")}
        </Text>

        <Text
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
          {requestData.message}
        </Text>
      </Section>

      {/* Additional Info Section */}
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.contact.email.partner.additionalInfo")}
      </Text>

      {/* Admin Button for Company Emails */}
      {isForCompany && (
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
            {t("app.api.v1.core.contact.email.company.viewDetails")}
          </Button>
        </Section>
      )}
    </EmailTemplate>
  );
}

/**
 * Company Team Email Function
 * Renders email template for contact form submissions to company team
 */
export const renderCompanyMail: EmailFunctionType<
  ContactRequestOutput,
  ContactResponseOutput,
  never
> = ({ requestData, locale, t }) => {
  try {
    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("app.common.appName"),
      subject: t("app.api.v1.core.contact.email.partner.subject", {
        subject: requestData.subject,
      }),
      replyToEmail: requestData.email,
      replyToName: requestData.name,

      jsx: ContactEmailContent({
        requestData,
        t,
        locale: locale,
        isForCompany: true,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.contact.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Partner/Customer Email Function
 * Renders email template for contact form confirmation to partner/customer
 */
export const renderPartnerMail: EmailFunctionType<
  ContactRequestOutput,
  ContactResponseOutput,
  never
> = ({ requestData, locale, t, user }) => {
  try {
    return createSuccessResponse({
      toEmail: requestData.email,
      toName: requestData.name,
      subject: t("app.api.v1.core.contact.email.partner.subject", {
        subject: requestData.subject,
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("app.common.appName"),

      jsx: ContactEmailContent({
        requestData,
        t,
        locale: locale,
        isForCompany: false,
        userId: user?.id, // Pass user ID if available
        leadId: user.leadId, // Pass lead ID from JWT payload
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.contact.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
