import { Button, Section, Text } from "@react-email/components";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type React from "react";

import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { contactClientRepository } from "../../../contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "../../../emails/smtp-client/components";
import { UserDetailLevel } from "../../enum";
import { userRepository } from "../../repository";
import {
  type SignupPostRequestOutput,
  type SignupPostResponseOutput,
} from "./definition";

// Constants for email templates
const CONSULTATION_DURATION = {
  minDurationMinutes: 30,
  maxDurationMinutes: 60,
};

const BUSINESS_FORM_TIME = {
  completionTimeMinutes: 10,
};

function renderWelcomeEmailContent(
  t: TFunction,
  locale: CountryLanguage,
  user: { privateName: string; id: string },
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
      title={t("app.api.v1.core.user.public.signup.email.title", {
        appName: t("app.api.common.appName"),
        privateName: user.privateName,
      })}
      previewText={t("app.api.v1.core.user.public.signup.email.previewText", {
        appName: t("app.api.common.appName"),
      })}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {t("app.api.v1.core.user.public.signup.email.welcomeMessage", {
          appName: t("app.api.common.appName"),
        })}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {t("app.api.v1.core.user.public.signup.email.description")}
      </Text>

      {/* CTA Section */}
      <Section
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          border: "2px solid #2563eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "20px",
            lineHeight: "1.6",
            color: "#1e40af",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          {t("app.api.v1.core.user.public.signup.email.ctaTitle")}
        </Text>

        <Button
          href={`${baseUrl}/${locale}/subscription`}
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "18px",
            padding: "16px 32px",
            textDecoration: "none",
            fontWeight: "700",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            display: "inline-block",
          }}
        >
          {t("app.api.v1.core.user.public.signup.email.ctaButton")}
        </Button>
      </Section>

      {/* Footer message */}
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginTop: "24px",
          textAlign: "center",
        }}
      >
        {t("app.api.v1.core.user.public.signup.email.signoff", {
          appName: t("app.api.common.appName"),
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
    locale,
    logger,
  );
  if (!userResponse.success) {
    return createErrorResponse(
      "app.api.v1.core.user.errors.not_found",
      ErrorResponseTypes.NOT_FOUND,
      { email: requestData.personalInfo.email },
    );
  }
  const user = userResponse.data;

  return createSuccessResponse({
    toEmail: user.email,
    toName: user.privateName,
    subject: t("app.api.v1.core.user.public.signup.email.subject", {
      appName: t("app.api.common.appName"),
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
    privateName: string;
    publicName: string;
    email: string;
    id: string;
    createdAt: string | number | Date;
  },
  requestData: {
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
      title={t("app.api.v1.core.user.public.signup.admin_notification.title")}
      previewText={t(
        "app.api.v1.core.user.public.signup.admin_notification.preview",
        {
          appName: t("app.api.common.appName"),
        },
      )}
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
        {t("app.api.v1.core.user.public.signup.admin_notification.title")}
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.user.public.signup.admin_notification.message", {
          appName: t("app.api.common.appName"),
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
          {t(
            "app.api.v1.core.user.public.signup.admin_notification.user_details",
          )}
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
            {t(
              "app.api.v1.core.user.public.signup.admin_notification.basic_information",
            )}
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
                {t(
                  "app.api.v1.core.user.public.signup.admin_notification.privateName",
                )}
                :
              </Text>{" "}
              {user.privateName}
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
                {t(
                  "app.api.v1.core.user.public.signup.admin_notification.publicName",
                )}
                :
              </Text>{" "}
              {user.publicName}
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
                {t(
                  "app.api.v1.core.user.public.signup.admin_notification.email",
                )}
                :
              </Text>{" "}
              <a
                href={`mailto:${user.email}`}
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {user.email}
              </a>
            </Text>
          </div>
        </div>

        {/* Signup Preferences */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            {t(
              "app.api.v1.core.user.public.signup.admin_notification.signup_preferences",
            )}
          </Text>

            {
              requestData.subscribeToNewsletter !== undefined && (
                <Text
                  style={{
                    fontSize: "14px",
                    marginBottom: "6px",
                    color: "#4b5563",
                    lineHeight: "1.5",
                  }}
                >
                  <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                    {t(
                      "app.api.v1.core.user.public.signup.admin_notification.newsletter",
                    )}
                    :
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
                      ? t(
                        "app.api.v1.core.user.public.signup.admin_notification.subscribed",
                      )
                      : t(
                        "app.api.v1.core.user.public.signup.admin_notification.not_subscribed",
                      )}
                  </span>
                </Text>
              )
            }
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
            {t(
              "app.api.v1.core.user.public.signup.admin_notification.signup_details",
            )}
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
                {t(
                  "app.api.v1.core.user.public.signup.admin_notification.signup_date",
                )}
                :
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
                {t(
                  "app.api.v1.core.user.public.signup.admin_notification.user_id",
                )}
                :
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

      {/* Action Buttons */}
      <Section style={{ textAlign: "center", marginBottom: "32px" }}>
        <Button
          href={`mailto:${user.email}?subject=Welcome to ${t("app.api.common.appName")} - Let's get started!`}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "12px 24px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t(
            "app.api.v1.core.user.public.signup.admin_notification.contact_user",
          )}
        </Button>
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
        {
          t("app.api.v1.core.user.public.signup.admin_notification.footer", {
            appName: t("app.api.common.appName"),
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
    locale,
    logger,
  );
  if (!userResponse.success) {
    return createErrorResponse(
      "app.api.v1.core.user.errors.not_found",
      ErrorResponseTypes.NOT_FOUND,
      { email: requestData.personalInfo.email },
    );
  }
  const user = userResponse.data;

  return createSuccessResponse({
    toEmail: contactClientRepository.getSupportEmail(locale),
    toName: t("app.api.common.appName"),
    subject: t(
      "app.api.v1.core.user.public.signup.admin_notification.subject",
      {
        userName: user.privateName,
      },
    ),
    jsx: renderAdminNotificationEmailContent(t, locale, user, {
      signupType: [], // signupType removed from form, defaulting to empty array
      subscribeToNewsletter: requestData.consent?.subscribeToNewsletter,
    }),
  });
};
