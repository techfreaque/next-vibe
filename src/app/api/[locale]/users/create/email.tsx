/**
 * Users Create Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Hr, Section, Text } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";
import React from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailTemplate } from "../../emails/smtp-client/components/template.email";
import { createTrackingContext } from "../../emails/smtp-client/components/tracking_context.email";
import type {
  UserCreateRequestOutput,
  UserCreateResponseOutput,
} from "./definition";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const userWelcomePropsSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  privateName: z.string(),
  publicName: z.string(),
  leadId: z.string().optional(),
});

type UserWelcomeProps = z.infer<typeof userWelcomePropsSchema>;

function UserWelcomeEmail({
  props,
  t,
  locale,
  tracking,
}: {
  props: UserWelcomeProps;
  t: TFunction;
  locale: CountryLanguage;
  tracking?: {
    userId?: string;
    leadId?: string;
    sessionId?: string;
  };
}): JSX.Element {
  const trackingContext = tracking
    ? createTrackingContext(
        locale,
        tracking.leadId,
        tracking.userId,
        undefined,
        undefined,
      )
    : createTrackingContext(locale, props.leadId, props.userId);

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.users.create.email.users.welcome.greeting", {
        name: props.privateName,
      })}
      previewText={t("app.api.users.create.email.users.welcome.preview")}
      tracking={trackingContext}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "16px",
        }}
      >
        {t("app.api.users.create.email.users.welcome.introduction", {
          name: props.privateName,
          appName: t("config.appName"),
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
          {t("app.api.users.create.email.users.welcome.accountDetails")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.users.create.email.users.welcome.email")}:
          </Text>{" "}
          {props.email}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.users.create.email.users.welcome.name")}:
          </Text>{" "}
          {props.privateName}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.users.create.email.users.welcome.publicName")}:
          </Text>{" "}
          {props.publicName}
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
        {t("app.api.users.create.email.users.welcome.nextSteps")}
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
          {t("app.api.users.create.email.users.welcome.loginButton")}
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
        {t("app.api.users.create.email.users.welcome.support")}
      </Text>
    </EmailTemplate>
  );
}

// Template Definition Export
const userWelcomeTemplate: EmailTemplateDefinition<UserWelcomeProps> = {
  meta: {
    id: "user-welcome",
    version: "1.0.0",
    name: "app.api.emails.templates.users.welcome.meta.name",
    description: "app.api.emails.templates.users.welcome.meta.description",
    category: "users",
    path: "/users/create/email.tsx",
    defaultSubject: (t) =>
      t("app.api.users.create.email.users.welcome.subject", { appName: "" }),
  },
  schema: userWelcomePropsSchema,
  component: UserWelcomeEmail,
};

export default userWelcomeTemplate;

// ============================================================================
// ADMIN NOTIFICATION TEMPLATE (Component - Not Registered)
// ============================================================================

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
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.users.create.email.users.admin.newUser")}
      previewText={t("app.api.users.create.email.users.admin.preview", {
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
        {t("app.api.users.create.email.users.admin.notification", {
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
          {t("app.api.users.create.email.users.admin.userDetails")}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t("app.api.users.create.email.users.labels.id")}
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
            {t("app.api.users.create.email.users.labels.email")}
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
            {t("app.api.users.create.email.users.labels.privateName")}
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
            {t("app.api.users.create.email.users.labels.publicName")}
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
            {t("app.api.users.create.email.users.labels.created")}
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
              {t("app.api.users.create.email.users.labels.leadId")}
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
          {t("app.api.users.create.email.users.admin.viewUser")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

/**
 * Welcome Email Adapter
 * Maps user creation response to welcome template props
 */
export const renderWelcomeEmail: EmailFunctionType<
  UserCreateRequestOutput,
  UserCreateResponseOutput,
  never
> = ({ responseData, locale, t }) => {
  try {
    if (!responseData) {
      return fail({
        message: "app.api.users.create.email.users.errors.missing_data",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const templateProps: UserWelcomeProps = {
      userId: responseData.responseId,
      email: responseData.responseEmail,
      privateName: responseData.responsePrivateName,
      publicName: responseData.responsePublicName,
      leadId: responseData.responseLeadId ?? undefined,
    };

    return success({
      toEmail: responseData.responseEmail,
      toName: responseData.responsePrivateName,
      subject: t("app.api.users.create.email.users.welcome.subject", {
        appName: t("config.appName"),
      }),
      jsx: userWelcomeTemplate.component({
        props: templateProps,
        t,
        locale,
        tracking: {
          userId: responseData.responseId,
          leadId: responseData.responseLeadId ?? undefined,
        },
      }),
    });
  } catch {
    return fail({
      message:
        "app.api.users.create.email.users.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
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
      return fail({
        message: "app.api.users.create.email.users.errors.missing_data",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    return success({
      toEmail: "admin@example.com", // Replace with actual admin email
      toName: t("config.appName"),
      subject: t("app.api.users.create.email.users.admin.subject", {
        name: responseData.responsePrivateName,
      }),
      jsx: AdminNotificationEmailContent({
        userData: responseData,
        t,
        locale,
      }),
    });
  } catch {
    return fail({
      message:
        "app.api.users.create.email.users.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
