/**
 * Template Notification Email Templates
 * Email templates for template-related notifications
 */

import "server-only";

import { Button, Hr, Section, Text } from "@react-email/components";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";

import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/components";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import type {
  TemplateNotificationsRequestTypeOutput,
  TemplateNotificationsResponseTypeOutput,
} from "./definition";

// Email notification constants
const NOTIFICATION_TYPES = {
  CREATED: "Created",
  UPDATED: "Updated",
  PUBLISHED: "Published",
  DELETED: "Deleted",
  UNKNOWN: "Unknown",
} as const;

const EMAIL_LABELS = {
  ADMIN_NOTIFICATION: "Admin Notification",
  TEMPLATE_NOTIFICATION: "Template Notification",
  TEMPLATE_USER: "Template User",
} as const;

/**
 * Template Notification Email Content Component
 */
function TemplateNotificationEmailContent({
  requestData,
  responseData,
  t,
  locale,
  isForAdmin,
}: {
  requestData: TemplateNotificationsRequestTypeOutput;
  responseData: TemplateNotificationsResponseTypeOutput;
  t: TFunction;
  locale: CountryLanguage;
  isForAdmin: boolean;
}): JSX.Element {
  // Create tracking context for template notification emails (transactional)
  const tracking = createTrackingContext(
    locale,
    undefined, // no leadId for template emails
    undefined, // no userId for template emails
    undefined, // no campaignId for transactional emails
  );

  const notificationTypeMap = {
    created: NOTIFICATION_TYPES.CREATED,
    updated: NOTIFICATION_TYPES.UPDATED,
    published: NOTIFICATION_TYPES.PUBLISHED,
    deleted: NOTIFICATION_TYPES.DELETED,
  } as const;

  const notificationTypeText =
    notificationTypeMap[requestData.notificationType] ||
    NOTIFICATION_TYPES.UNKNOWN;

  const TEMPLATE_PREFIX = "Template ";
  const COLON_SEPARATOR = ": ";
  const DASH_SEPARATOR = " - ";
  const emailTitle =
    TEMPLATE_PREFIX +
    notificationTypeText +
    COLON_SEPARATOR +
    responseData.template.name;
  const emailPreview =
    TEMPLATE_PREFIX +
    notificationTypeText +
    DASH_SEPARATOR +
    responseData.template.name;

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={emailTitle}
      previewText={emailPreview}
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
        {isForAdmin
          ? EMAIL_LABELS.ADMIN_NOTIFICATION
          : EMAIL_LABELS.TEMPLATE_NOTIFICATION}
      </Text>

      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          {t("email.template.notifications.details")}
        </Text>

        <Text style={{ margin: "8px 0", color: "#374151" }}>
          <strong>{t("email.template.notifications.templateName")}:</strong>{" "}
          {responseData.template.name}
        </Text>

        <Text style={{ margin: "8px 0", color: "#374151" }}>
          <strong>{t("email.template.notifications.templateId")}:</strong>{" "}
          {responseData.template.id}
        </Text>

        <Text style={{ margin: "8px 0", color: "#374151" }}>
          <strong>{t("email.template.notifications.status")}:</strong>{" "}
          {responseData.template.status}
        </Text>

        <Text style={{ margin: "8px 0", color: "#374151" }}>
          <strong>{t("email.template.notifications.action")}:</strong>{" "}
          {notificationTypeText}
        </Text>
      </Section>

      {requestData.customMessage && (
        <Section style={{ marginBottom: "20px" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {t("email.template.notifications.customMessage")}
          </Text>
          <Text style={{ color: "#374151", fontStyle: "italic" }}>
            {requestData.customMessage}
          </Text>
        </Section>
      )}

      <Hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

      <Section style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/${locale}/admin/templates/${responseData.template.id}`}
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          {t("email.template.notifications.viewTemplate")}
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        {t("email.template.notifications.footer")}
      </Text>
    </EmailTemplate>
  );
}

/**
 * Admin Notification Email Function
 * Sends template notifications to administrators
 */
export const renderAdminNotificationMail: EmailFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, locale, t, logger }) => {
  logger.debug("Processing admin template notification email:", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
  });

  try {
    const notificationTypeMap = {
      created: NOTIFICATION_TYPES.CREATED,
      updated: NOTIFICATION_TYPES.UPDATED,
      published: NOTIFICATION_TYPES.PUBLISHED,
      deleted: NOTIFICATION_TYPES.DELETED,
    } as const;

    const notificationTypeText =
      notificationTypeMap[requestData.notificationType] ||
      NOTIFICATION_TYPES.UNKNOWN;

    const TEMPLATE_PREFIX = "Template ";
    const COLON_SEPARATOR = ": ";
    const emailSubject =
      TEMPLATE_PREFIX +
      notificationTypeText +
      COLON_SEPARATOR +
      responseData.template.name;

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("common.appName"),
      subject: emailSubject,
      jsx: TemplateNotificationEmailContent({
        requestData,
        responseData,
        t,
        locale,
        isForAdmin: true,
      }),
    });
  } catch (error) {
    logger.error("Error generating admin template notification email:", error);
    return createErrorResponse(
      "error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * User Notification Email Function
 * Sends template notifications to specific users
 */
export const renderUserNotificationMail: EmailFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, locale, t, user, logger }) => {
  logger.debug("Processing user template notification email:", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
    userId: user.id,
  });

  try {
    const notificationTypeMap = {
      created: NOTIFICATION_TYPES.CREATED,
      updated: NOTIFICATION_TYPES.UPDATED,
      published: NOTIFICATION_TYPES.PUBLISHED,
      deleted: NOTIFICATION_TYPES.DELETED,
    } as const;

    const notificationTypeText =
      notificationTypeMap[requestData.notificationType] ||
      NOTIFICATION_TYPES.UNKNOWN;

    // Use custom recipients if provided, otherwise use a default
    const DEFAULT_EMAIL = "user@example.com";
    const recipients = requestData.recipients || [DEFAULT_EMAIL];
    const primaryRecipient = recipients[0];

    const TEMPLATE_PREFIX = "Template ";
    const COLON_SEPARATOR = ": ";
    const emailSubject =
      TEMPLATE_PREFIX +
      notificationTypeText +
      COLON_SEPARATOR +
      responseData.template.name;

    return createSuccessResponse({
      toEmail: primaryRecipient,
      toName: EMAIL_LABELS.TEMPLATE_USER,
      subject: emailSubject,
      jsx: TemplateNotificationEmailContent({
        requestData,
        responseData,
        t,
        locale,
        isForAdmin: false,
      }),
    });
  } catch (error) {
    logger.error("Error generating user template notification email:", error);
    return createErrorResponse(
      "error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
