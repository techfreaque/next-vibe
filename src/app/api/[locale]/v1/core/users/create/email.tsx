/**
 * Users Create Email Templates
 * React Email templates for new user notifications
 */

import { Button, Hr, Section, Text } from "@react-email/components";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import React, { type JSX } from "react";

import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  UserCreateRequestOutput,
  UserCreateResponseOutput,
} from "./definition";

/**
 * Welcome Email Template Component
 * Renders welcome email for newly created users
 */
function WelcomeEmailContent({
  userData,
  t,
  locale,
}: {
  userData: UserCreateResponseOutput;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  // Create tracking context for user emails
  const tracking = createTrackingContext(
    locale,
    userData.responseLeadId ?? undefined, // leadId if available
    userData.responseId, // userId
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.users.create.email.users.welcome.greeting", {
        name: userData.responsePrivateName,
      })}
      previewText={t(
        "app.api.v1.core.users.create.email.users.welcome.preview",
      )}
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
        {t("app.api.v1.core.users.create.email.users.welcome.introduction", {
          name: userData.responsePrivateName,
          appName: t("app.common.appName"),
        })}
      </Text>

      {/* Account Details Section */}
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
          {t("app.api.v1.core.users.create.email.users.welcome.accountDetails")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.welcome.email")}:
          </Text>{" "}
          {userData.responseEmail}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.welcome.name")}:
          </Text>{" "}
          {userData.responsePrivateName}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.welcome.publicName")}:
          </Text>{" "}
          {userData.responsePublicName}
        </Text>
      </Section>

      <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

      {/* Next Steps Section */}
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.v1.core.users.create.email.users.welcome.nextSteps")}
      </Text>

      {/* Login Button */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/user/login`}
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
          {t("app.api.v1.core.users.create.email.users.welcome.loginButton")}
        </Button>
      </Section>

      {/* Support Information */}
      <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#6b7280",
          marginBottom: "8px",
        }}
      >
        {t("app.api.v1.core.users.create.email.users.welcome.support")}
      </Text>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Template Component
 * Renders notification email for admin when new user is created
 */
function AdminNotificationEmailContent({
  userData,
  t,
  locale,
}: {
  userData: UserCreateResponseOutput;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  const tracking = createTrackingContext(
    locale,
    userData.responseLeadId ?? undefined,
    userData.responseId,
    undefined,
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.v1.core.users.create.email.users.admin.newUser")}
      previewText={t("app.api.v1.core.users.create.email.users.admin.preview", {
        name: userData.responsePrivateName,
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
        {t("app.api.v1.core.users.create.email.users.admin.notification", {
          name: userData.responsePrivateName,
          email: userData.responseEmail,
        })}
      </Text>

      {/* User Details Section */}
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
          {t("app.api.v1.core.users.create.email.users.admin.userDetails")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.labels.id")}
          </Text>{" "}
          {userData.responseId}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.labels.email")}
          </Text>{" "}
          {userData.responseEmail}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.labels.privateName")}
          </Text>{" "}
          {userData.responsePrivateName}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.labels.publicName")}
          </Text>{" "}
          {userData.responsePublicName}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.v1.core.users.create.email.users.labels.created")}
          </Text>{" "}
          {new Date(userData.responseCreatedAt).toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        {userData.responseLeadId && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "4px",
              color: "#4b5563",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t("app.api.v1.core.users.create.email.users.labels.leadId")}
            </Text>{" "}
            {userData.responseLeadId}
          </Text>
        )}
      </Section>

      {/* Admin Action Button */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/users/user/${userData.responseId}`}
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
          {t("app.api.v1.core.users.create.email.users.admin.viewUser")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Welcome Email Function
 * Renders welcome email for newly created user
 */
export const renderWelcomeEmail: EmailFunctionType<
  UserCreateRequestOutput,
  UserCreateResponseOutput,
  never
> = ({ responseData, locale, t }) => {
  try {
    if (!responseData) {
      return createErrorResponse(
        "app.api.v1.core.users.create.email.users.errors.missing_data",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: responseData.responseEmail,
      toName: responseData.responsePrivateName,
      subject: t("app.api.v1.core.users.create.email.users.welcome.subject", {
        appName: t("app.common.appName"),
      }),
      jsx: WelcomeEmailContent({
        userData: responseData,
        t,
        locale,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.users.create.email.users.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Admin Notification Email Function
 * Renders admin notification email for new user creation
 */
export const renderAdminNotificationEmail: EmailFunctionType<
  UserCreateRequestOutput,
  UserCreateResponseOutput,
  never
> = ({ responseData, locale, t }) => {
  try {
    if (!responseData) {
      return createErrorResponse(
        "app.api.v1.core.users.create.email.users.errors.missing_data",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: "admin@example.com", // Replace with actual admin email
      toName: t("app.common.appName"),
      subject: t("app.api.v1.core.users.create.email.users.admin.subject", {
        name: responseData.responsePrivateName,
      }),
      jsx: AdminNotificationEmailContent({
        userData: responseData,
        t,
        locale,
      }),
    });
  } catch {
    return createErrorResponse(
      "app.api.v1.core.users.create.email.users.error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
