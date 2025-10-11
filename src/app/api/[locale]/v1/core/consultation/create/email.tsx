/**
 * Consultation Email Templates
 * Email templates for consultation-related notifications
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { ExtendedUserDetailLevel } from "@/app/api/[locale]/v1/core/user/definition";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { getLocaleString } from "@/i18n/core/localization-utils";

import type {
  ConsultationCreateRequestTypeOutput,
  ConsultationCreateResponseTypeOutput,
} from "./definition";
import {
  renderConsultationAdminEmail,
  renderConsultationConfirmationEmail,
  renderConsultationUpdateEmail,
} from "./email-client";

/**
 * Email template for consultation request confirmation
 */
export const consultationRequestEmail: EmailFunctionType<
  ConsultationCreateRequestTypeOutput,
  ConsultationCreateResponseTypeOutput,
  Record<string, never>
> = async ({ requestData, locale, t, user, logger }) => {
  // Check if user is authenticated and not public
  if (!user || user.isPublic) {
    return createErrorResponse(
      "app.api.v1.core.consultation.create.errors.unauthorized.description",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }

  const userId = authRepository.requireUserId(user);
  logger.debug(
    t(
      "app.api.v1.core.consultation.create.debug.rendering_consultation_request_email",
    ),
    {
      userId,
      locale,
      requestData,
    },
  );

  const standardUserResponse = await userRepository.getUserById(
    userId,
    "standard" as ExtendedUserDetailLevel,
    logger,
  );
  if (!standardUserResponse.success) {
    return createErrorResponse(
      "user.errors.user_not_found",
      ErrorResponseTypes.NOT_FOUND,
      { userId },
    );
  }
  const standardUser = standardUserResponse.data;

  return createSuccessResponse({
    toEmail: standardUser.email,
    toName: `${standardUser.firstName} ${standardUser.lastName}`,
    subject: t("email.consultation.confirmation.subject", {
      name: standardUser.firstName,
    }),
    jsx: renderConsultationConfirmationEmail(
      t,
      locale,
      {
        firstName: standardUser.firstName,
        id: standardUser.id,
        leadId: standardUser.leadId,
      },
      requestData,
    ),
  });
};

/**
 * Email template for consultation update confirmation
 */
export const consultationUpdateEmail: EmailFunctionType<
  ConsultationCreateRequestTypeOutput,
  ConsultationCreateResponseTypeOutput,
  Record<string, never>
> = async ({ requestData, locale, t, user, logger }) => {
  // Check if user is authenticated and not public
  if (!user || user.isPublic) {
    return createErrorResponse(
      "app.api.v1.core.consultation.create.errors.unauthorized.description",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }

  const userId = authRepository.requireUserId(user);
  logger.debug(
    t(
      "app.api.v1.core.consultation.create.debug.rendering_consultation_update_email",
    ),
    {
      userId,
      locale,
      requestData,
    },
  );

  const standardUserResponse = await userRepository.getUserById(
    userId,
    "standard" as ExtendedUserDetailLevel,
    logger,
  );
  if (!standardUserResponse.success) {
    return createErrorResponse(
      "user.errors.user_not_found",
      ErrorResponseTypes.NOT_FOUND,
      { userId },
    );
  }
  const standardUser = standardUserResponse.data;

  return createSuccessResponse({
    toEmail: standardUser.email,
    toName: `${standardUser.firstName} ${standardUser.lastName}`,
    subject: t("email.consultation.updated.subject", {
      name: standardUser.firstName,
    }),
    jsx: renderConsultationUpdateEmail(t, locale, standardUser, requestData),
  });
};

/**
 * Admin notification email for consultation requests
 * Sends notification to admin when a new consultation is requested
 */
export const consultationAdminEmail: EmailFunctionType<
  ConsultationCreateRequestTypeOutput,
  ConsultationCreateResponseTypeOutput,
  Record<string, never>
> = async ({ requestData, locale, t, user, logger }) => {
  // Check if user is authenticated and not public
  if (!user || user.isPublic) {
    return createErrorResponse(
      "app.api.v1.core.consultation.create.errors.unauthorized.description",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }

  const userId = authRepository.requireUserId(user);
  const typedRequestData = requestData;
  logger.debug(
    t(
      "app.api.v1.core.consultation.create.debug.rendering_consultation_admin_notification_email",
    ),
    {
      userId,
      locale,
      requestData: typedRequestData,
    },
  );

  const standardUserResponse = await userRepository.getUserById(
    userId,
    "standard" as ExtendedUserDetailLevel,
    logger,
  );
  if (!standardUserResponse.success) {
    return createErrorResponse(
      "user.errors.user_not_found",
      ErrorResponseTypes.NOT_FOUND,
      { userId },
    );
  }
  const standardUser = standardUserResponse.data;

  const appName = t("common.appName");

  // Format the preferred date
  const preferredDate = typedRequestData.preferredDate
    ? new Date(typedRequestData.preferredDate).toLocaleDateString(
        getLocaleString(locale),
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : t("consultation.email.noScheduledDate");

  return createSuccessResponse({
    toEmail: contactClientRepository.getSupportEmail(locale),
    toName: appName,
    subject: t("consultation.email.subject", { appName }),
    replyToEmail: standardUser.email,
    replyToName: `${standardUser.firstName} ${standardUser.lastName}`,
    jsx: renderConsultationAdminEmail(
      t,
      locale,
      standardUser,
      requestData,
      preferredDate,
    ),
  });
};
