/**
 * Consultation Email Client Templates
 * React Email UI templates for consultation-related notifications
 */

import { Button, Hr, Link, Section, Text } from "@react-email/components";
import type React from "react";

import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLocaleString } from "@/i18n/core/localization-utils";
import type { TFunction } from "@/i18n/core/static-types";

import type { StandardUserType } from "../../user/definition";

export function renderConsultationConfirmationEmail(
  t: TFunction,
  locale: CountryLanguage,
  standardUser: { firstName: string; id: string; leadId?: string | null },
  requestData: { preferredDate?: string; preferredTime?: string },
): React.ReactElement {
  // Create tracking context for consultation emails (transactional)
  const tracking = createTrackingContext(
    locale,
    standardUser.leadId || undefined, // leadId from user if available
    standardUser.id, // userId for consultation emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("email.consultation.confirmation.title", {
        name: standardUser.firstName,
      })}
      previewText={t("email.consultation.confirmation.preview")}
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
        {t("email.consultation.confirmation.greeting", {
          name: standardUser.firstName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("email.consultation.confirmation.message")}
      </Text>

      {requestData.preferredDate && (
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
            backgroundColor: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
          }}
        >
          <strong>{t("email.consultation.confirmation.preferredDate")}:</strong>{" "}
          {new Date(requestData.preferredDate).toLocaleDateString(
            getLocaleString(locale),
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
          {requestData.preferredTime && (
            <>
              {" "}
              {t("email.consultation.confirmation.at")}{" "}
              {requestData.preferredTime}
            </>
          )}
        </Text>
      )}

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("email.consultation.confirmation.nextSteps")}
      </Text>
    </EmailTemplate>
  );
}

export function renderConsultationUpdateEmail(
  t: TFunction,
  locale: CountryLanguage,
  standardUser: { firstName: string; id: string; leadId?: string | null },
  requestData: { preferredDate?: string; preferredTime?: string },
): React.ReactElement {
  // Create tracking context for consultation emails (transactional)
  const tracking = createTrackingContext(
    locale,
    standardUser.leadId || undefined, // leadId from user if available
    standardUser.id, // userId for consultation emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("email.consultation.updated.title", {
        name: standardUser.firstName,
      })}
      previewText={t("email.consultation.updated.preview")}
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
        {t("email.consultation.updated.greeting", {
          name: standardUser.firstName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("email.consultation.updated.message")}
      </Text>

      {requestData.preferredDate && (
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
            backgroundColor: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
          }}
        >
          <strong>{t("email.consultation.updated.newDate")}:</strong>{" "}
          {new Date(requestData.preferredDate).toLocaleDateString(
            getLocaleString(locale),
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
          {requestData.preferredTime && (
            <>
              {" "}
              {t("email.consultation.confirmation.at")}{" "}
              {requestData.preferredTime}
            </>
          )}
        </Text>
      )}

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("email.consultation.updated.nextSteps")}
      </Text>
    </EmailTemplate>
  );
}

export function renderConsultationAdminEmail(
  t: TFunction,
  locale: CountryLanguage,
  standardUser: StandardUserType,
  requestData: {
    preferredDate?: string;
    preferredTime?: string;
    message?: string;
  },
  preferredDate: string,
): React.ReactElement {
  // Create tracking context for consultation emails (transactional)
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for consultation emails
    undefined, // no userId for consultation emails
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("consultation.email.title", { appName: t("common.appName") })}
      previewText={t("consultation.email.previewText")}
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
        {t("consultation.email.greeting")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("consultation.email.greeting")}
      </Text>

      {/* Request Details Section */}
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
          {t("consultation.email.details")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("email.contact.company.name")}
          </Text>{" "}
          {standardUser.firstName} {standardUser.lastName}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("consultation.email.contactEmail")}:
          </Text>{" "}
          <Link
            href={`mailto:${standardUser.email}`}
            style={{ color: "#4f46e5" }}
          >
            {standardUser.email}
          </Link>
        </Text>

        {requestData.preferredDate && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "4px",
              color: "#4b5563",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t("consultation.email.preferredDate")}:
            </Text>{" "}
            {preferredDate}
            {requestData.preferredTime && ` at ${requestData.preferredTime}`}
          </Text>
        )}

        {requestData.message && (
          <>
            <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {t("consultation.email.message")}
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
          </>
        )}
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("consultation.email.closing")}
      </Text>

      {/* Admin Button */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${envClient.NEXT_PUBLIC_APP_URL}/admin/consultations`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            padding: "10px 20px",
            textDecoration: "none",
          }}
        >
          {t("consultation.email.viewRequest")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}
