/**
 * Lead Batch Operations Email Templates
 * React Email templates for batch update and delete operations
 */

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

import { contactClientRepository } from "../../contact/repository-client";
import {
  createTrackingContext,
  EmailTemplate,
} from "../../emails/smtp-client/components";
import type { EmailFunctionType } from "../../emails/smtp-client/email-handling/definition";

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
  data: any;
  responseData: any;
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
      title={t("app.api.v1.core.leads.batch.email.admin.batchUpdate.title")}
      previewText={t(
        "app.api.v1.core.leads.batch.email.admin.batchUpdate.preview",
        {
          totalProcessed: responseData?.totalProcessed || 0,
        },
      )}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.leads.batch.email.admin.batchUpdate.message", {
          totalProcessed: responseData?.totalProcessed || 0,
        })}
      </Text>

      {/* Operation Summary Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t(
            "app.api.v1.core.leads.batch.email.admin.batchUpdate.operationSummary",
          )}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchUpdate.totalMatched",
            )}
            :
          </Text>{" "}
          {responseData?.totalMatched || 0}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchUpdate.totalProcessed",
            )}
            :
          </Text>{" "}
          {responseData?.totalProcessed || 0}
        </Text>

        {responseData?.totalUpdated && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t(
                "app.api.v1.core.leads.batch.email.admin.batchUpdate.totalUpdated",
              )}
              :
            </Text>{" "}
            {responseData.totalUpdated}
          </Text>
        )}

        {responseData?.errors?.length > 0 && (
          <>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "8px",
                color: "#dc2626",
              }}
            >
              <Text style={{ fontWeight: "700" }}>
                {t(
                  "app.api.v1.core.leads.batch.email.admin.batchUpdate.errors",
                )}
                :
              </Text>{" "}
              {responseData.errors.length}
            </Text>
          </>
        )}

        {data?.dryRun && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "0",
              color: "#f59e0b",
              fontWeight: "700",
            }}
          >
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchUpdate.dryRunNote",
            )}
          </Text>
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
          {t("app.api.v1.core.leads.batch.email.admin.batchUpdate.viewLeads")}
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
  data: any;
  responseData: any;
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
      title={t("app.api.v1.core.leads.batch.email.admin.batchDelete.title")}
      previewText={t(
        "app.api.v1.core.leads.batch.email.admin.batchDelete.preview",
        {
          totalProcessed: responseData?.totalProcessed || 0,
        },
      )}
      tracking={tracking}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        {t("app.api.v1.core.leads.batch.email.admin.batchDelete.message", {
          totalProcessed: responseData?.totalProcessed || 0,
        })}
      </Text>

      {/* Operation Summary Section */}
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {t(
            "app.api.v1.core.leads.batch.email.admin.batchDelete.operationSummary",
          )}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchDelete.totalMatched",
            )}
            :
          </Text>{" "}
          {responseData?.totalMatched || 0}
        </Text>

        <Text
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            color: "#4b5563",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchDelete.totalProcessed",
            )}
            :
          </Text>{" "}
          {responseData?.totalProcessed || 0}
        </Text>

        {responseData?.totalDeleted && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t(
                "app.api.v1.core.leads.batch.email.admin.batchDelete.totalDeleted",
              )}
              :
            </Text>{" "}
            {responseData.totalDeleted}
          </Text>
        )}

        {responseData?.errors?.length > 0 && (
          <>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "8px",
                color: "#dc2626",
              }}
            >
              <Text style={{ fontWeight: "700" }}>
                {t(
                  "app.api.v1.core.leads.batch.email.admin.batchDelete.errors",
                )}
                :
              </Text>{" "}
              {responseData.errors.length}
            </Text>
          </>
        )}

        {data?.dryRun && (
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "0",
              color: "#f59e0b",
              fontWeight: "700",
            }}
          >
            {t(
              "app.api.v1.core.leads.batch.email.admin.batchDelete.dryRunNote",
            )}
          </Text>
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
          {t("app.api.v1.core.leads.batch.email.admin.batchDelete.viewLeads")}
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
  any,
  any,
  UndefinedType
> = ({ requestData, responseData, locale, t, user }) => {
  try {
    if (!responseData) {
      return createErrorResponse(
        "app.api.v1.core.leads.batch.email.admin.batchUpdate.error.noData",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("common.appName"),
      subject: t(
        "app.api.v1.core.leads.batch.email.admin.batchUpdate.subject",
        {
          totalProcessed: responseData.totalProcessed || 0,
        },
      ),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("common.appName"),

      jsx: BatchUpdateCompletionEmailContent({
        data: requestData,
        responseData,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return createErrorResponse(
      "error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Batch Delete Admin Notification Email Function
 * Notifies admin team when a batch delete operation is completed
 */
export const renderBatchDeleteNotificationMail: EmailFunctionType<
  any,
  any,
  UndefinedType
> = ({ requestData, responseData, locale, t, user }) => {
  try {
    if (!responseData) {
      return createErrorResponse(
        "app.api.v1.core.leads.batch.email.admin.batchDelete.error.noData",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("common.appName"),
      subject: t(
        "app.api.v1.core.leads.batch.email.admin.batchDelete.subject",
        {
          totalProcessed: responseData.totalProcessed || 0,
        },
      ),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("common.appName"),

      jsx: BatchDeleteCompletionEmailContent({
        data: requestData,
        responseData,
        t,
        locale,
        userId: user?.id,
      }),
    });
  } catch {
    return createErrorResponse(
      "error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
