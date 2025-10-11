import { Button, Section, Text } from "@react-email/components";
import { env } from "next-vibe/server/env";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type React from "react";

import type {
  EmailFunctionType,
  EmailTemplateReturnType,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import {
  BUSINESS_FORM_TIME,
  CONSULTATION_DURATION,
} from "../../../consultation/consultation-config/repository";
import { contactClientRepository } from "../../../contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "../../../emails/smtp-client/components";
import { PreferredContactMethod, UserDetailLevel } from "../../enum";
import { userRepository } from "../../repository";
import {
  type SignupPostRequestOutput,
  type SignupPostResponseOutput,
} from "./definition";
import { SignupType } from "./enum";

function renderWelcomeEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { firstName: string; id: string },
  baseUrl: string,
  leadId: string,
): React.ReactElement {
  // Create tracking context for user signup emails with leadId and userId
  const tracking = createTrackingContext(
    locale,
    leadId, // leadId from signup form
    user.id, // userId for signup emails
    undefined, // no campaignId for transactional emails
    baseUrl,
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("auth.signup.email.title", {
        appName: t("common.appName"),
        firstName: user.firstName,
      })}
      previewText={t("auth.signup.email.previewText", {
        appName: t("common.appName"),
      })}
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
        {t("auth.signup.email.welcomeMessage", {
          appName: t("common.appName"),
        })}
      </Text>

      {/* Primary Action - Consultation Booking */}
      <Section
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          border: "2px solid #2563eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          style={{
            fontSize: "20px",
            lineHeight: "1.6",
            color: "#1e40af",
            fontWeight: "700",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          {t("auth.signup.email.primaryAction.title")}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#1e40af",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {t("auth.signup.email.primaryAction.description")}
        </Text>

        {/* Benefits list */}
        <ul
          style={{
            color: "#1e40af",
            paddingLeft: "20px",
            marginBottom: "20px",
            listStyle: "none",
          }}
        >
          <li style={{ margin: "8px 0", paddingLeft: "0" }}>
            {t("auth.signup.email.primaryAction.benefits.strategy")}
          </li>
          <li style={{ margin: "8px 0", paddingLeft: "0" }}>
            {t("auth.signup.email.primaryAction.benefits.setup")}
          </li>
          <li style={{ margin: "8px 0", paddingLeft: "0" }}>
            {t("auth.signup.email.primaryAction.benefits.questions")}
          </li>
          <li style={{ margin: "8px 0", paddingLeft: "0" }}>
            {t("auth.signup.email.primaryAction.benefits.flexible")}
          </li>
        </ul>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Button
            href={`${baseUrl}/${locale}/app/onboarding`}
            style={{
              backgroundColor: "#2563eb",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "18px",
              padding: "16px 32px",
              textDecoration: "none",
              fontWeight: "700",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {t("auth.signup.email.primaryAction.cta")}
          </Button>
        </div>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#1e40af",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {t("auth.signup.email.primaryAction.timeframe", {
            minDuration: CONSULTATION_DURATION.minDurationMinutes,
            maxDuration: CONSULTATION_DURATION.maxDurationMinutes,
          })}
        </Text>
      </Section>

      {/* Optional Step - Business Profile */}
      <Section
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#64748b",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          {t("auth.signup.email.firstStep.title")}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#64748b",
            marginBottom: "16px",
          }}
        >
          {t("auth.signup.email.firstStep.description")}
        </Text>
        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#2563eb",
            marginBottom: "16px",
            fontWeight: "600",
            backgroundColor: "#eff6ff",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #dbeafe",
          }}
        >
          {t("auth.signup.email.firstStep.note")}
        </Text>
        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#64748b",
            marginBottom: "16px",
            fontStyle: "italic",
          }}
        >
          {t("auth.signup.email.firstStep.timeframe", {
            minutes: BUSINESS_FORM_TIME.completionTimeMinutes,
          })}
        </Text>
        <Button
          href={`${baseUrl}/${locale}/app/onboarding`}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #64748b",
            borderRadius: "6px",
            color: "#64748b",
            fontSize: "16px",
            padding: "12px 24px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          {t("auth.signup.email.firstStep.cta")}
        </Button>
      </Section>

      {/* What We Do Section */}
      <Text
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          fontWeight: "600",
          marginBottom: "16px",
          marginTop: "24px",
        }}
      >
        {t("auth.signup.email.ourService.title")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("auth.signup.email.ourService.description")}
      </Text>

      <ul
        style={{
          color: "#374151",
          paddingLeft: "20px",
          marginBottom: "24px",
        }}
      >
        <li style={{ margin: "8px 0" }}>
          {t("auth.signup.email.ourService.customContent")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("auth.signup.email.ourService.strategicPlanning")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("auth.signup.email.ourService.monthlyApproval")}
        </li>
        <li style={{ margin: "8px 0" }}>
          {t("auth.signup.email.ourService.professionalManagement")}
        </li>
      </ul>

      {/* After Profile Section */}
      <Text
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          fontWeight: "600",
          marginBottom: "16px",
          marginTop: "24px",
        }}
      >
        {t("auth.signup.email.afterProfile.title")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("auth.signup.email.afterProfile.description")}
      </Text>

      {/* Pricing Option */}
      <Section
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#64748b",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          {t("auth.signup.email.afterProfile.payment.title")}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#64748b",
            marginBottom: "16px",
          }}
        >
          {t("auth.signup.email.afterProfile.payment.description")}
        </Text>
        <ul
          style={{
            color: "#64748b",
            paddingLeft: "20px",
            marginBottom: "16px",
          }}
        >
          <li style={{ margin: "8px 0" }}>
            {t("auth.signup.email.afterProfile.payment.benefits.immediate")}
          </li>
          <li style={{ margin: "8px 0" }}>
            {t("auth.signup.email.afterProfile.payment.benefits.strategy")}
          </li>
          <li style={{ margin: "8px 0" }}>
            {t("auth.signup.email.afterProfile.payment.benefits.analytics")}
          </li>
        </ul>
        <Section style={{ textAlign: "center", marginTop: "16px" }}>
          <Button
            href={`${baseUrl}/${locale}/app/onboarding`}
            style={{
              backgroundColor: "transparent",
              border: "2px solid #64748b",
              borderRadius: "6px",
              color: "#64748b",
              fontSize: "16px",
              fontWeight: "600",
              padding: "12px 24px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {t("auth.signup.email.afterProfile.payment.cta")}
          </Button>
        </Section>
        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#64748b",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          {t("auth.signup.email.afterProfile.payment.timeframe")}
        </Text>
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {t("auth.signup.email.afterProfile.flexibility")}
      </Text>

      {/* Support section */}
      <Section
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#1f2937",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          {t("auth.signup.email.needHelp")}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          {t("auth.signup.email.supportMessage")}
        </Text>
        <Button
          href={`${baseUrl}/${locale}/help`}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #6b7280",
            borderRadius: "6px",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "500",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("auth.signup.email.contactSupport")}
        </Button>
      </Section>

      {/* Footer message */}
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginTop: "32px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("auth.signup.email.excited")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {t("auth.signup.email.signoff", {
          appName: t("common.appName"),
        })}
      </Text>
    </EmailTemplate>
  );
}

export const renderRegisterMail: EmailFunctionType<
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  Record<string, string>
> = async ({ requestData, locale, t, logger }) => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const userResponse = await userRepository.getUserByEmail(
    requestData.personalInfo.email,
    UserDetailLevel.STANDARD,
    logger,
  );
  if (!userResponse.success) {
    return createErrorResponse(
      "user.errors.user_not_found",
      ErrorResponseTypes.NOT_FOUND,
      { email: requestData.personalInfo.email },
    );
  }
  const user = userResponse.data;

  return createSuccessResponse({
    toEmail: user.email,
    toName: user.firstName,
    subject: t("auth.signup.email.subject", {
      appName: t("common.appName"),
    }),
    jsx: renderWelcomeEmailContent(
      t,
      locale,
      user,
      baseUrl,
      requestData.advanced?.leadId || "",
    ),
  });
};

function renderAdminNotificationEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    id: string;
    createdAt: string | number | Date;
  },
  requestData: {
    phone?: string;
    preferredContactMethod: string[];
    signupType: string[];
    subscribeToNewsletter?: boolean | null;
  },
): React.ReactElement {
  // Create tracking context for admin notification emails with leadId and userId
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for admin notification emails
    user.id, // userId for admin notification about this user
    undefined, // no campaignId for transactional emails
    env.NEXT_PUBLIC_APP_URL,
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("auth.signup.admin_notification.title")}
      previewText={t("auth.signup.admin_notification.preview", {
        appName: t("common.appName"),
      })}
      tracking={tracking}
    >
      {/* Header Message */}
      <Text
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#1f2937",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {t("auth.signup.admin_notification.title")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("auth.signup.admin_notification.message", {
          appName: t("common.appName"),
        })}
      </Text>

      {/* User Details Section */}
      <Section
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px",
            borderBottom: "2px solid #3b82f6",
            paddingBottom: "8px",
          }}
        >
          {t("auth.signup.admin_notification.user_details")}
        </Text>

        {/* Basic Info Row */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("auth.signup.admin_notification.basic_information")}
          </Text>

          <div style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("auth.signup.admin_notification.name")}:
              </Text>{" "}
              {user.firstName} {user.lastName}
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("auth.signup.admin_notification.email")}:
              </Text>{" "}
              <a
                href={`mailto:${user.email}`}
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {user.email}
              </a>
            </Text>

            {user.company && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("auth.signup.admin_notification.company")}:
                </Text>{" "}
                {user.company}
              </Text>
            )}

            {requestData.phone && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("auth.signup.admin_notification.phone")}:
                </Text>{" "}
                <a
                  href={`tel:${requestData.phone}`}
                  style={{ color: "#3b82f6", textDecoration: "none" }}
                >
                  {requestData.phone}
                </a>
              </Text>
            )}
          </div>
        </div>

        {/* Contact Preferences */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("auth.signup.admin_notification.contact_preferences")}
          </Text>

          <div style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("auth.signup.admin_notification.preferred_method")}:
              </Text>{" "}
              <span
                style={{
                  backgroundColor: requestData.preferredContactMethod.includes(
                    PreferredContactMethod.EMAIL,
                  )
                    ? "#dbeafe"
                    : "#fef3c7",
                  color: requestData.preferredContactMethod.includes(
                    PreferredContactMethod.EMAIL,
                  )
                    ? "#1e40af"
                    : "#92400e",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {requestData.preferredContactMethod.join(", ")}
              </span>
            </Text>

            {requestData.signupType.length > 0 && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("auth.signup.admin_notification.signup_type")}:
                </Text>{" "}
                <span
                  style={{
                    backgroundColor: requestData.signupType.includes(
                      SignupType.MEETING,
                    )
                      ? "#ecfdf5"
                      : "#f0f9ff",
                    color: requestData.signupType.includes(SignupType.MEETING)
                      ? "#065f46"
                      : "#0c4a6e",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {requestData.signupType.includes(SignupType.MEETING)
                    ? t("auth.signup.admin_notification.consultation_first")
                    : t("auth.signup.admin_notification.direct_signup")}
                </span>
              </Text>
            )}

            {requestData.subscribeToNewsletter !== undefined && (
              <Text
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                  {t("auth.signup.admin_notification.newsletter")}:
                </Text>{" "}
                <span
                  style={{
                    backgroundColor: requestData.subscribeToNewsletter
                      ? "#dcfce7"
                      : "#fee2e2",
                    color: requestData.subscribeToNewsletter
                      ? "#166534"
                      : "#991b1b",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {requestData.subscribeToNewsletter
                    ? t("auth.signup.admin_notification.subscribed")
                    : t("auth.signup.admin_notification.not_subscribed")}
                </span>
              </Text>
            )}
          </div>
        </div>

        {/* Signup Details */}
        <div>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t("auth.signup.admin_notification.signup_details")}
          </Text>

          <div style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("auth.signup.admin_notification.signup_date")}:
              </Text>{" "}
              {new Date(user.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </Text>

            <Text
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                {t("auth.signup.admin_notification.user_id")}:
              </Text>{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#f3f4f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {user.id}
              </span>
            </Text>
          </div>
        </div>
      </Section>

      {/* Next Steps Section */}
      <Section
        style={{
          backgroundColor: requestData.signupType.includes(SignupType.MEETING)
            ? "#fff7ed"
            : "#f0f9ff",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: `1px solid ${requestData.signupType.includes(SignupType.MEETING) ? "#fed7aa" : "#bfdbfe"}`,
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: requestData.signupType.includes(SignupType.MEETING)
              ? "#ea580c"
              : "#2563eb",
            marginBottom: "8px",
          }}
        >
          {t("auth.signup.admin_notification.recommended_next_steps")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: requestData.signupType.includes(SignupType.MEETING)
              ? "#9a3412"
              : "#1e40af",
          }}
        >
          {requestData.signupType.includes(SignupType.MEETING)
            ? t("auth.signup.admin_notification.consultation_recommendation")
            : t("auth.signup.admin_notification.direct_recommendation")}
        </Text>
      </Section>

      {/* Action Buttons */}
      <Section style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ marginBottom: "12px" }}>
          <Button
            href={`mailto:${user.email}?subject=Welcome to ${t("common.appName")} - Let's get started!`}
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              padding: "12px 24px",
              textDecoration: "none",
              display: "inline-block",
              marginRight: "12px",
            }}
          >
            {t("auth.signup.admin_notification.contact_user")}
          </Button>

          {requestData.phone && (
            <Button
              href={`tel:${requestData.phone}`}
              style={{
                backgroundColor: "#10b981",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                padding: "12px 24px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {t("auth.signup.admin_notification.call_user")}
            </Button>
          )}
        </div>
      </Section>

      {/* Footer */}
      <Text
        style={{
          fontSize: "12px",
          lineHeight: "1.5",
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
        }}
      >
        {t("auth.signup.admin_notification.footer", {
          appName: t("common.appName"),
        })}
      </Text>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Function
 * Sends notification to admin when a new user signs up
 */
export const renderAdminSignupNotification: EmailFunctionType<
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  Record<string, string>
> = async ({ requestData, locale, t, logger }) => {
  const userResponse = await userRepository.getUserByEmail(
    requestData.personalInfo.email,
    UserDetailLevel.STANDARD,
    logger,
  );
  if (!userResponse.success) {
    return createErrorResponse(
      "user.errors.user_not_found",
      ErrorResponseTypes.NOT_FOUND,
      { email: requestData.personalInfo.email },
    );
  }
  const user = userResponse.data;

  return createSuccessResponse({
    toEmail: contactClientRepository.getSupportEmail(locale),
    toName: t("common.appName"),
    subject: t("auth.signup.admin_notification.subject", {
      userName: user.firstName,
    }),
    jsx: renderAdminNotificationEmailContent(t, locale, user, {
      phone: requestData.businessInfo?.phone,
      preferredContactMethod: [requestData.preferences.preferredContactMethod],
      signupType: [requestData.preferences.signupType],
      subscribeToNewsletter: requestData.consent?.subscribeToNewsletter,
    }),
  });
};
