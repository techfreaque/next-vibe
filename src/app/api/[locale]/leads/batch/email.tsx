/**
 * Lead Batch Operations Email Templates
 * Refactored to separate template from business logic
 */

import { Button, Section } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import React from "react";
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/emails/registry/types";
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
  BatchUpdateResponseOutput,
} from "./definition";

// ============================================================================
// TEMPLATE DEFINITION (Pure Component + Schema + Metadata)
// ============================================================================

const batchUpdatePropsSchema = z.object({
  totalMatched: z.number(),
  totalProcessed: z.number(),
  totalUpdated: z.number().optional(),
  errorsCount: z.number(),
  dryRun: z.boolean().optional(),
  userId: z.string().optional(),
});

type BatchUpdateProps = z.infer<typeof batchUpdatePropsSchema>;

function BatchUpdateEmail({
  props,
  t,
  locale,
  tracking,
}: {
  props: BatchUpdateProps;
  t: TFunction;
  locale: CountryLanguage;
  tracking?: {
    userId?: string;
    leadId?: string;
    sessionId?: string;
  };
}): ReactElement {
  const trackingContext = tracking
    ? createTrackingContext(
        locale,
        tracking.leadId,
        tracking.userId,
        undefined,
        undefined,
      )
    : createTrackingContext(locale, undefined, props.userId);

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.leads.batch.email.admin.batchUpdate.title")}
      previewText={t("app.api.leads.batch.email.admin.batchUpdate.preview", {
        totalProcessed: props.totalProcessed,
      })}
      tracking={trackingContext}
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
          totalProcessed: props.totalProcessed,
        })}
      </div>

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
          {props.totalMatched}
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
          {props.totalProcessed}
        </div>

        {props.totalUpdated && (
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
            {props.totalUpdated}
          </div>
        )}

        {props.errorsCount > 0 && (
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
            {props.errorsCount}
          </div>
        )}

        {props.dryRun && (
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

const batchUpdateTemplate: EmailTemplateDefinition<BatchUpdateProps> = {
  meta: {
    id: "batch-update",
    version: "1.0.0",
    name: "app.api.emails.templates.leads.batch.update.meta.name",
    description: "app.api.emails.templates.leads.batch.update.meta.description",
    category: "leads",
    path: "/leads/batch/email.tsx",
    defaultSubject: (t) =>
      t("app.api.leads.batch.email.admin.batchUpdate.subject", {
        totalProcessed: 0,
      }),
  },
  schema: batchUpdatePropsSchema,
  component: BatchUpdateEmail,
};

export default batchUpdateTemplate;

// ============================================================================
// BATCH DELETE TEMPLATE (Component - Not Registered)
// ============================================================================

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
}): ReactElement {
  const tracking = createTrackingContext(locale, undefined, userId);

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

// ============================================================================
// ADAPTERS (Business Logic - Maps endpoint data to template props)
// ============================================================================

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

    const templateProps: BatchUpdateProps = {
      totalMatched: responseData.response.totalMatched || 0,
      totalProcessed: responseData.response.totalProcessed || 0,
      totalUpdated: responseData.response.totalUpdated,
      errorsCount: responseData.response.errors.length,
      dryRun: requestData.dryRun,
      userId: user?.id,
    };

    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.leads.batch.email.admin.batchUpdate.subject", {
        totalProcessed: responseData.response.totalProcessed || 0,
      }),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),
      jsx: batchUpdateTemplate.component({
        props: templateProps,
        t,
        locale,
        tracking: {
          userId: user?.id,
        },
      }),
    });
  } catch {
    return fail({
      message: "app.api.leads.batch.email.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};

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
