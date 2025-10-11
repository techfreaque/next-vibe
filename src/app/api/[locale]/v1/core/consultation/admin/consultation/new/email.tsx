/**
 * Admin Consultation New Email Handlers
 * Email handlers for new consultation creation notifications
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { contactClientRepository } from "../../../../contact/repository-client";
import type { EmailFunctionType } from "../../../../emails/smtp-client/email-handling/definition";
import type {
  ConsultationCreatePostRequestTypeInput,
  ConsultationCreatePostResponseTypeOutput,
} from "./definition";
import { InternalEmailTemplate, PartnerEmailTemplate } from "./email-client";

/**
 * Partner Email Handler
 */
export const adminConsultationPartnerEmail: EmailFunctionType<
  ConsultationCreatePostRequestTypeInput,
  ConsultationCreatePostResponseTypeOutput,
  never
> = ({ requestData, t, locale }) => {
  try {
    // Only send partner email if we have contact information
    if (!requestData.email || !requestData.name) {
      return createErrorResponse(
        "consultation.error.title",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    const contactName = requestData.name;
    const businessName =
      requestData.businessName ||
      requestData.businessType ||
      t("consultation.title");
    const preferredDate = requestData.preferredDate
      ? new Date(requestData.preferredDate).toLocaleDateString()
      : t("consultation.title");

    const partnerEmailJsx = (
      <PartnerEmailTemplate
        name={contactName}
        businessName={businessName}
        preferredDate={preferredDate}
        message={requestData.message || ""}
        locale={locale}
      />
    );

    return createSuccessResponse({
      toEmail: requestData.email,
      toName: contactName,
      subject: t("consultation.title"),
      jsx: partnerEmailJsx,
    });
  } catch {
    return createErrorResponse(
      "consultation.error.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Internal Email Handler
 */
export const adminConsultationInternalEmail: EmailFunctionType<
  ConsultationCreatePostRequestTypeInput,
  ConsultationCreatePostResponseTypeOutput,
  never
> = ({ requestData, t, locale }) => {
  try {
    const appName = t("consultation.title");
    const contactName = requestData.name || t("consultation.title");
    const businessName =
      requestData.businessName ||
      requestData.businessType ||
      t("consultation.title");
    const preferredDate = requestData.preferredDate
      ? new Date(requestData.preferredDate).toLocaleDateString()
      : t("consultation.title");

    const internalEmailJsx = (
      <InternalEmailTemplate
        contactName={contactName}
        contactEmail={requestData.email || t("consultation.title")}
        contactPhone={requestData.phone || t("consultation.title")}
        businessName={businessName}
        businessType={requestData.businessType || t("consultation.title")}
        preferredDate={preferredDate}
        priority={requestData.priority || t("consultation.title")}
        message={requestData.message || ""}
        internalNotes={requestData.internalNotes || ""}
        appName={appName}
        locale={locale}
      />
    );

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: appName,
      subject: t("consultation.title"),
      replyToEmail: requestData.email,
      replyToName: contactName,
      jsx: internalEmailJsx,
    });
  } catch {
    return createErrorResponse(
      "consultation.error.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
