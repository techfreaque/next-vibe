/**
 * Email Handling Repository
 * Core service for handling email processing and orchestration
 */

import "server-only";

import { env } from "next-vibe/server/env";
import type {
  ErrorResponseType,
  ResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type {
  CountryLanguage,
  JwtPayloadType,
} from "../../../user/auth/definition";
import { EmailProvider, EmailStatus, EmailType } from "../../messages/enum";
import { emailMetadataRepository } from "../email-metadata/repository";
import { emailSendingRepository } from "../email-sending/repository";
import type {
  EmailHandleRequestTypeOutput,
  EmailHandleResponseTypeOutput,
  EmailTemplateReturnType,
} from "./definition";

/**
 * Email Handling Repository Interface
 */
export interface EmailHandlingRepository {
  handleEmails<TRequest, TResponse, TUrlVariables>(
    data: EmailHandleRequestTypeOutput<TRequest, TResponse, TUrlVariables>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailHandleResponseTypeOutput>>;
}

/**
 * Email Handling Repository Implementation
 */
export class EmailHandlingRepositoryImpl implements EmailHandlingRepository {
  async handleEmails<TRequest, TResponse, TUrlVariables>(
    data: EmailHandleRequestTypeOutput<TRequest, TResponse, TUrlVariables>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailHandleResponseTypeOutput>> {
    const errors: ErrorResponseType[] = [];

    if (data.email?.afterHandlerEmails) {
      try {
        await Promise.all(
          data.email.afterHandlerEmails.map(async (emailData) => {
            try {
              const emailMessage = await emailData.render({
                user: data.user,
                urlVariables: data.urlVariables,
                requestData: data.requestData,
                responseData: data.responseData,
                t: data.t,
                locale: data.locale,
              });

              if (!emailMessage.success) {
                if (!emailData.ignoreErrors) {
                  errors.push(
                    createErrorResponse(
                      "email.errors.rendering_failed",
                      ErrorResponseTypes.EMAIL_ERROR,
                      { error: emailMessage.message },
                    ),
                  );
                }
                return;
              }

              const templateData = emailMessage.data;

              // Build comprehensive email data with all template information
              const emailSendResult = await emailSendingRepository.sendEmail(
                {
                  jsx: templateData.jsx,
                  subject: templateData.subject,
                  toEmail: templateData.toEmail,
                  toName: templateData.toName,
                  locale: data.locale,
                  t: data.t,
                  // Pass through sender name from template
                  senderName: templateData.senderName,
                  // Pass through campaign context from template
                  campaignType: templateData.campaignType,
                  emailJourneyVariant: templateData.emailJourneyVariant,
                  emailCampaignStage: templateData.emailCampaignStage,
                  // Pass through email metadata
                  replyToEmail: templateData.replyToEmail,
                  replyToName: templateData.replyToName,
                  unsubscribeUrl: templateData.unsubscribeUrl,
                  // Pass through SMTP selection criteria if provided
                  selectionCriteriaOverride: templateData.smtpSelectionCriteria,
                },
                user,
                locale,
                logger,
              );

              if (emailSendResult.success) {
                logger.debug("Email sent successfully", {
                  recipient: templateData.toEmail,
                  subject: templateData.subject,
                  messageId: emailSendResult.data?.messageId,
                });
              } else {
                logger.error("Failed to send email", {
                  recipient: templateData.toEmail,
                  subject: templateData.subject,
                  error: emailSendResult.message,
                });
              }

              if (!emailData.ignoreErrors && !emailSendResult.success) {
                logger.error(
                  "Email send error",
                  emailSendResult.message,
                  emailSendResult.messageParams,
                );
                errors.push(
                  createErrorResponse(
                    "email.errors.send_failed",
                    ErrorResponseTypes.EMAIL_ERROR,
                    { error: emailSendResult.message },
                  ),
                );
              }
            } catch (error) {
              const parsedError = parseError(error);
              logger.error("Email render error", parsedError.message);

              // Try to store email metadata even for exceptions
              try {
                await emailMetadataRepository.storeEmailMetadata(
                  {
                    subject: data.t("email.errors.email_failed_subject"),
                    recipientEmail: "unknown@example.com", // Fallback since we don't have recipient data
                    recipientName: data.t("email.errors.unknown_recipient"),
                    senderEmail: env.EMAIL_FROM_EMAIL,
                    senderName: data.t("common.appName"),
                    type: EmailType.SYSTEM,
                    templateName: null,
                    status: EmailStatus.FAILED,
                    error: parsedError.message,
                    userId: user.isPublic ? null : user.id,
                    leadId: null,
                    metadata: {
                      locale: data.locale,
                      errorType: data.t("email.errors.email_render_exception"),
                      errorDetails: parsedError.message,
                      endpoint: data.urlVariables
                        ? JSON.stringify(data.urlVariables)
                        : undefined,
                      requestData: data.requestData
                        ? JSON.stringify(data.requestData)
                        : undefined,
                    },
                    emailProvider: EmailProvider.SMTP,
                    externalId: null,
                  },
                  user,
                  locale,
                  logger,
                );

                logger.debug("Email metadata stored for exception", {
                  error: parsedError.message,
                  userId: user.id,
                });
              } catch (metadataError) {
                logger.error(
                  "Failed to store email metadata for exception",
                  metadataError,
                );
                // Don't fail the process if metadata storage fails
              }

              errors.push(
                createErrorResponse(
                  "email.errors.rendering_failed",
                  ErrorResponseTypes.EMAIL_ERROR,
                  { error: parsedError.message },
                ),
              );
            }
          }),
        );
      } catch (error) {
        const parsedError = parseError(error);
        errors.push(
          createErrorResponse(
            "email.errors.batch_send_failed",
            ErrorResponseTypes.EMAIL_ERROR,
            { error: parsedError.message },
          ),
        );
      }
    }

    if (errors.length) {
      logger.error("Email errors", errors);
      return createErrorResponse(
        "email.errors.batch_send_failed",
        ErrorResponseTypes.EMAIL_ERROR,
        { errors: errors.map((error) => error.message).join(", ") },
      );
    }

    return createSuccessResponse({ success: true });
  }
}

export const emailHandlingRepository = new EmailHandlingRepositoryImpl();
