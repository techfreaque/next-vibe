/**
 * Lead Creation Email Templates
 * React Email templates for lead creation operations
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

import { LeadSourceOptions, LeadStatusOptions } from "../enum";
import type { LeadCreateType } from "../types";
import type { LeadCreatePostResponseOutput } from "./definition";

/**
 * Welcome Email Template Component for New Leads
 * Sends a welcome message to leads when they are created in the system
 */
// Type for the lead data from create response
type LeadData = LeadCreatePostResponseOutput["lead"];

function WelcomeEmailContent({
  lead,
  t,
  locale,
  userId,
}: {
  lead: LeadData;
  t: TFunction;
  locale: CountryLanguage;
  userId?: string;
}): JSX.Element {
  // Create tracking context for welcome emails with leadId
  const tracking = createTrackingContext(
    locale,
    lead.summary.id, // leadId for tracking engagement
    userId, // userId if lead is associated with a user
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.leads.create.email.welcome.title", {
        businessName:
          lead.summary.businessName ||
          lead.summary.email ||
          t("app.api.v1.core.leads.create.email.welcome.defaultName"),
      })}
      previewText={t("app.api.v1.core.leads.create.email.welcome.preview")}
      tracking={tracking}
    >
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.leads.create.email.welcome.greeting", {
          businessName:
            lead.summary.businessName ||
            t("app.api.v1.core.leads.create.email.welcome.defaultName"),
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
        {t("app.api.v1.core.leads.create.email.welcome.introduction")}
      </Span>

      {/* Next Steps Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t("app.api.v1.core.leads.create.email.welcome.nextSteps.title")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.create.email.welcome.nextSteps.step1Number",
            )}
          </Span>
          {"  "}
          {t("app.api.v1.core.leads.create.email.welcome.nextSteps.step1")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.create.email.welcome.nextSteps.step2Number",
            )}
          </Span>
          {"  "}
          {t("app.api.v1.core.leads.create.email.welcome.nextSteps.step2")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "0",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.create.email.welcome.nextSteps.step3Number",
            )}
          </Span>
          {"  "}
          {t("app.api.v1.core.leads.create.email.welcome.nextSteps.step3")}
        </Span>
      </Section>

      <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

      {/* Call to Action */}
      <Section style={{ textAlign: "center", marginBottom: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/consultation/onboarding`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            padding: "12px 24px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.v1.core.leads.create.email.welcome.cta.getStarted")}
        </Button>
      </Section>

      <Span
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#6b7280",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.leads.create.email.welcome.support", {
          supportEmail: contactClientRepository.getSupportEmail(locale),
        })}
      </Span>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Template Component for New Leads
 * Notifies admin team when a new lead is created
 */
function AdminNotificationEmailContent({
  lead,
  t,
  locale,
  userId,
}: {
  lead: LeadData;
  t: TFunction;
  locale: CountryLanguage;
  userId?: string;
}): JSX.Element {
  // Create tracking context for admin notification emails
  const tracking = createTrackingContext(
    locale,
    lead.summary.id, // leadId for tracking
    userId, // userId if available
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.leads.create.email.admin.newLead.title")}
      previewText={t(
        "app.api.v1.core.leads.create.email.admin.newLead.preview",
        {
          businessName:
            lead.summary.businessName ||
            lead.summary.email ||
            t("app.api.v1.core.leads.create.email.admin.newLead.defaultName"),
        },
      )}
      tracking={tracking}
    >
      <Span
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.leads.create.email.admin.newLead.message", {
          businessName:
            lead.summary.businessName ||
            lead.summary.email ||
            t("app.api.v1.core.leads.create.email.admin.newLead.defaultName"),
        })}
      </Span>

      {/* Lead Details Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t("app.api.v1.core.leads.create.email.admin.newLead.leadDetails")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.leads.create.email.admin.newLead.businessName")}
            :
          </Span>{" "}
          {lead.summary.businessName ||
            t("app.api.v1.core.leads.create.email.admin.newLead.notProvided")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.leads.create.email.admin.newLead.email")}:
          </Span>{" "}
          {lead.summary.email ||
            t("app.api.v1.core.leads.create.email.admin.newLead.notProvided")}
        </Span>

        {lead.contactDetails.phone && (
          <Span
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <Span style={{ fontWeight: "700" }}>
              {t("app.api.v1.core.leads.create.email.admin.newLead.phone")}:
            </Span>{" "}
            {lead.contactDetails.phone}
          </Span>
        )}

        {lead.contactDetails.website && (
          <Span
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <Span style={{ fontWeight: "700" }}>
              {t("app.api.v1.core.leads.create.email.admin.newLead.website")}:
            </Span>{" "}
            {lead.contactDetails.website}
          </Span>
        )}

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.leads.create.email.admin.newLead.source")}:
          </Span>{" "}
          {lead.trackingInfo.source
            ? t(
                LeadSourceOptions.find(
                  (opt) => opt.value === lead.trackingInfo.source,
                )?.label ??
                  "app.api.v1.core.leads.create.email.admin.newLead.notProvided",
              )
            : t("app.api.v1.core.leads.create.email.admin.newLead.notProvided")}
        </Span>

        <Span
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Span style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.leads.create.email.admin.newLead.status")}:
          </Span>{" "}
          {t(
            LeadStatusOptions.find((opt) => opt.value === lead.summary.status)
              ?.label ??
              "app.api.v1.core.leads.create.email.admin.newLead.notProvided",
          )}
        </Span>

        {lead.metadata.notes && (
          <>
            <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
            <Span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {t("app.api.v1.core.leads.create.email.admin.newLead.notes")}:
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
              {lead.metadata.notes}
            </Span>
          </>
        )}
      </Section>

      {/* Admin Actions */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/leads/lead/${lead.summary.id}`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
            marginRight: "12px",
          }}
        >
          {t("app.api.v1.core.leads.create.email.admin.newLead.viewLead")}
        </Button>

        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/leads`}
          style={{
            backgroundColor: "#6b7280",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.v1.core.leads.create.email.admin.newLead.viewAllLeads")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Welcome Email Function for New Leads
 * Sends welcome email to leads when they are created (if email provided)
 */
export const renderWelcomeMail: EmailFunctionType<
  LeadCreateType,
  LeadCreatePostResponseOutput,
  never
> = ({ responseData, locale, t, user }) => {
  try {
    // Only send welcome email if lead has email and the creation was successful
    if (!responseData?.lead?.summary?.email) {
      return createErrorResponse(
        "app.api.v1.core.leads.create.email.welcome.error.noEmail",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: responseData.lead.summary.email,
      toName:
        responseData.lead.summary.businessName ||
        responseData.lead.summary.email,
      subject: t("app.api.v1.core.leads.create.email.welcome.subject", {
        companyName: t("config.appName"),
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),

      jsx: WelcomeEmailContent({
        lead: responseData.lead,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.leads.create.email.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Admin Notification Email Function for New Leads
 * Notifies admin team when a new lead is created
 */
export const renderAdminNotificationMail: EmailFunctionType<
  LeadCreateType,
  LeadCreatePostResponseOutput,
  never
> = ({ responseData, locale, t, user }) => {
  try {
    if (!responseData?.lead) {
      return createErrorResponse(
        "app.api.v1.core.leads.create.email.admin.newLead.error.noData",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.v1.core.leads.create.email.admin.newLead.subject", {
        businessName:
          responseData.lead.summary.businessName ||
          responseData.lead.summary.email ||
          t("app.api.v1.core.leads.create.email.admin.newLead.defaultName"),
      }),
      replyToEmail:
        responseData.lead.summary.email ||
        contactClientRepository.getSupportEmail(locale),
      replyToName:
        responseData.lead.summary.businessName ||
        t("app.api.v1.core.leads.create.email.admin.newLead.defaultName"),

      jsx: AdminNotificationEmailContent({
        lead: responseData.lead,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.leads.create.email.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
