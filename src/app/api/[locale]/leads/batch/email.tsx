/**
 * Lead Batch Operations Email Templates
 * React Email templates for batch update and delete operations
 */

import { Button, Section } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";
import React from "react";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailTemplate } from "../../emails/smtp-client/components/template.email";
import { createTrackingContext } from "../../emails/smtp-client/components/tracking_context.email";
import type {
  BatchDeleteRequestOutput,
  BatchDeleteResponseData,
  BatchDeleteResponseOutput,
  BatchUpdateRequestOutput,
  BatchUpdateResponseData,
  BatchUpdateResponseOutput,
} from "./definition";

/**
 * Batch Update Completion Email Template Component
 * Notifies admin team when batch update operation is completed
 */
function BatchUpdateCompletionEmailContent({
  data,
  responseData,
  t,
  locale,
  userId,
}: {
  data: BatchUpdateRequestOutput;
  responseData: BatchUpdateResponseData;
  t: TFunction;
  locale: CountryLanguage;
  userId?: string;
}): JSX.Element {
  // Create tracking context for admin notification emails
  const tracking = createTrackingContext(
    locale,
    undefined, // no specific leadId for batch operations
    userId, // userId if available
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.leads.batch.email.admin.batchUpdate.title")}
      previewText={t("app.api.leads.batch.email.admin.batchUpdate.preview", {
        totalProcessed: responseData?.totalProcessed || 0,
      })}
      tracking={tracking}
    >
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.leads.batch.email.admin.batchUpdate.message", {
          totalProcessed: responseData?.totalProcessed || 0,
        })}
      </div>

      {/* Operation Summary Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t("app.api.leads.batch.email.admin.batchUpdate.operationSummary")}
        </div>

        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <div style={{ fontWeight: "700" }}>
            {t("app.api.leads.batch.email.admin.batchUpdate.totalMatched")}:
          </div>{" "}
          {responseData?.totalMatched || 0}
        </div>

        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <div style={{ fontWeight: "700" }}>
            {t("app.api.leads.batch.email.admin.batchUpdate.totalProcessed")}:
          </div>{" "}
          {responseData?.totalProcessed || 0}
        </div>

        {responseData?.totalUpdated && (
          <div
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <div style={{ fontWeight: "700" }}>
              {t("app.api.leads.batch.email.admin.batchUpdate.totalUpdated")}:
            </div>{" "}
            {responseData.totalUpdated}
          </div>
        )}

        {responseData.errors.length > 0 && (
          <>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "8px",
                color: "#dc2626",
              }}
            >
              <div style={{ fontWeight: "700" }}>
                {t("app.api.leads.batch.email.admin.batchUpdate.errors")}:
              </div>{" "}
              {responseData.errors.length}
            </div>
          </>
        )}

        {data?.dryRun && (
          <div
            style={{
              fontSize: "14px",
              marginBottom: "0",
              color: "#f59e0b",
              fontWeight: "700",
            }}
          >
            {t("app.api.leads.batch.email.admin.batchUpdate.dryRunNote")}
          </div>
        )}
      </Section>

      {/* Admin Actions */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/leads`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.leads.batch.email.admin.batchUpdate.viewLeads")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Batch Delete Completion Email Template Component
 * Notifies admin team when batch delete operation is completed
 */
function BatchDeleteCompletionEmailContent({
  data,
  responseData,
  t,
  locale,
  userId,
}: {
  data: BatchDeleteRequestOutput;
  responseData: BatchDeleteResponseData;
  t: TFunction;
  locale: CountryLanguage;
  userId?: string;
}): JSX.Element {
  // Create tracking context for admin notification emails
  const tracking = createTrackingContext(
    locale,
    undefined, // no specific leadId for batch operations
    userId, // userId if available
    undefined, // no campaignId for transactional emails
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.leads.batch.email.admin.batchDelete.title")}
      previewText={t("app.api.leads.batch.email.admin.batchDelete.preview", {
        totalProcessed: responseData?.totalProcessed || 0,
      })}
      tracking={tracking}
    >
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.leads.batch.email.admin.batchDelete.message", {
          totalProcessed: responseData?.totalProcessed || 0,
        })}
      </div>

      {/* Operation Summary Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t("app.api.leads.batch.email.admin.batchDelete.operationSummary")}
        </div>

        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <div style={{ fontWeight: "700" }}>
            {t("app.api.leads.batch.email.admin.batchDelete.totalMatched")}:
          </div>{" "}
          {responseData?.totalMatched || 0}
        </div>

        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <div style={{ fontWeight: "700" }}>
            {t("app.api.leads.batch.email.admin.batchDelete.totalProcessed")}:
          </div>{" "}
          {responseData?.totalProcessed || 0}
        </div>

        {responseData?.totalDeleted && (
          <div
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <div style={{ fontWeight: "700" }}>
              {t("app.api.leads.batch.email.admin.batchDelete.totalDeleted")}:
            </div>{" "}
            {responseData.totalDeleted}
          </div>
        )}

        {responseData.errors.length > 0 && (
          <>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "8px",
                color: "#dc2626",
              }}
            >
              <div style={{ fontWeight: "700" }}>
                {t("app.api.leads.batch.email.admin.batchDelete.errors")}:
              </div>{" "}
              {responseData.errors.length}
            </div>
          </>
        )}

        {data?.dryRun && (
          <div
            style={{
              fontSize: "14px",
              marginBottom: "0",
              color: "#f59e0b",
              fontWeight: "700",
            }}
          >
            {t("app.api.leads.batch.email.admin.batchDelete.dryRunNote")}
          </div>
        )}
      </Section>

      {/* Admin Actions */}
      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button
          href={`${env.NEXT_PUBLIC_APP_URL}/admin/leads`}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("app.api.leads.batch.email.admin.batchDelete.viewLeads")}
        </Button>
      </Section>
    </EmailTemplate>
  );
}

/**
 * Batch Update Admin Notification Email Function
 * Notifies admin team when a batch update operation is completed
 */
export const renderBatchUpdateNotificationMail: EmailFunctionType<
  BatchUpdateRequestOutput,
  BatchUpdateResponseOutput,
  never
> = ({ requestData, responseData, locale, t, user }) => {
  try {
    if (!responseData?.response) {
      return fail({
        message: "app.api.leads.batch.email.admin.batchUpdate.error.noData",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.leads.batch.email.admin.batchUpdate.subject", {
        totalProcessed: responseData.response.totalProcessed || 0,
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),

      jsx: BatchUpdateCompletionEmailContent({
        data: requestData,
        responseData: responseData.response,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return fail({
      message: "app.api.leads.batch.email.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};

/**
 * Batch Delete Admin Notification Email Function
 * Notifies admin team when a batch delete operation is completed
 */
export const renderBatchDeleteNotificationMail: EmailFunctionType<
  BatchDeleteRequestOutput,
  BatchDeleteResponseOutput,
  never
> = ({ requestData, responseData, locale, t, user }) => {
  try {
    if (!responseData?.response) {
      return fail({
        message: "app.api.leads.batch.email.admin.batchDelete.error.noData",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.leads.batch.email.admin.batchDelete.subject", {
        totalProcessed: responseData.response.totalProcessed || 0,
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),

      jsx: BatchDeleteCompletionEmailContent({
        data: requestData,
        responseData: responseData.response,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return fail({
      message: "app.api.leads.batch.email.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
