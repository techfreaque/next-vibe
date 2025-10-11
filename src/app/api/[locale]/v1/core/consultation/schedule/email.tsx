/**
 * Consultation Schedule Email Handlers
 * Email handlers for consultation scheduling notifications
 */

import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { contactClientRepository } from "../../contact/repository-client";
import type { EmailFunctionType } from "../../emails/smtp-client/email-handling/definition";
import type {
  ConsultationScheduleRequestTypeInput,
  ConsultationScheduleResponseTypeOutput,
} from "./definition";
import { AdminEmailTemplate, ScheduledEmailTemplate } from "./email-client";

/**
 * Scheduled Email Handler
 */
export const consultationScheduledEmail: EmailFunctionType<
  ConsultationScheduleRequestTypeInput,
  ConsultationScheduleResponseTypeOutput,
  UndefinedType
> = async ({ requestData, t, user, logger }) => {
  try {
    // Get user information
    if (!user || user.isPublic) {
      return createErrorResponse(
        "consultation.error.title",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    const { userRepository } = await import("../../user/repository");
    const { UserDetailLevel } = await import("../../user/enum");
    const userResp = await userRepository.getUserById(
      user.id,
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!userResp.success) {
      return createErrorResponse(
        "consultation.error.title",
        ErrorResponseTypes.NOT_FOUND,
      );
    }

    const userData = userResp.data;
    const userName =
      [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
      t("consultation.title");
    const userEmail = userData.email ?? "";

    const scheduledDate = requestData.scheduledDate
      ? new Date(requestData.scheduledDate).toLocaleDateString()
      : t("consultation.title");
    const scheduledTime = requestData.scheduledTime || t("consultation.title");

    const scheduledEmailJsx = (
      <ScheduledEmailTemplate
        userName={userName}
        scheduledDate={scheduledDate}
        scheduledTime={scheduledTime}
        meetingLink={requestData.meetingLink}
        translations={{
          subject: t("app.api.v1.core.consultation.create.success.title"),
          title: t("app.api.v1.core.consultation.create.title"),
          preview: t("app.api.v1.core.consultation.create.description"),
          greeting: t("app.api.v1.core.consultation.create.title"),
          message: t("app.api.v1.core.consultation.create.description"),
          details: t(
            "app.api.v1.core.consultation.create.response.consultationId",
          ),
          date: t("app.api.v1.core.consultation.create.preferredDate.label"),
          joinMeeting: t("app.api.v1.core.consultation.create.title"),
          calendarEvent: t("app.api.v1.core.consultation.create.title"),
          footer: t("app.api.v1.core.consultation.create.success.description"),
          viewConsultations: t("app.api.v1.core.consultation.create.title"),
        }}
      />
    );

    return createSuccessResponse({
      toEmail: userEmail,
      toName: userName,
      subject: t("consultation.title"),
      jsx: scheduledEmailJsx,
    });
  } catch {
    return createErrorResponse(
      "consultation.error.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Admin Email Handler
 */
export const consultationScheduleAdminEmail: EmailFunctionType<
  ConsultationScheduleRequestTypeInput,
  ConsultationScheduleResponseTypeOutput,
  UndefinedType
> = async ({ requestData, user, locale, t, logger }) => {
  try {
    // Get user information
    if (!user || user.isPublic) {
      return createErrorResponse(
        "consultation.error.title",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    const { userRepository } = await import("../../user/repository");
    const { UserDetailLevel } = await import("../../user/enum");
    const userResp = await userRepository.getUserById(
      user.id,
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!userResp.success) {
      return createErrorResponse(
        "consultation.error.title",
        ErrorResponseTypes.NOT_FOUND,
      );
    }

    const userData = userResp.data;
    const userName =
      [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
      t("consultation.title");
    const userEmail = userData.email ?? "";

    const scheduledDate = requestData.scheduledDate
      ? new Date(requestData.scheduledDate).toLocaleDateString()
      : t("consultation.title");
    const scheduledTime = requestData.scheduledTime || t("consultation.title");

    const adminEmailJsx = (
      <AdminEmailTemplate
        userName={userName}
        userEmail={userEmail}
        scheduledDate={scheduledDate}
        scheduledTime={scheduledTime}
        meetingLink={requestData.meetingLink}
        appName={t("consultation.title")}
        translations={{
          subject: t("app.api.v1.core.consultation.create.title"),
          title: t("app.api.v1.core.consultation.create.title"),
          preview: t("app.api.v1.core.consultation.create.description"),
          greeting: t("app.api.v1.core.consultation.create.title"),
          message: t("app.api.v1.core.consultation.create.description"),
          details: t(
            "app.api.v1.core.consultation.create.response.consultationId",
          ),
          userName: t("app.api.v1.core.consultation.create.title"),
          userEmail: t("app.api.v1.core.consultation.create.title"),
          scheduledDate: t(
            "app.api.v1.core.consultation.create.preferredDate.label",
          ),
          meetingLink: t("app.api.v1.core.consultation.create.title"),
          closing: t("app.api.v1.core.consultation.create.success.description"),
        }}
      />
    );

    return createSuccessResponse({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("consultation.title"),
      subject: t("consultation.title"),
      replyToEmail: userEmail,
      replyToName: userName,
      jsx: adminEmailJsx,
    });
  } catch {
    return createErrorResponse(
      "consultation.error.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};
