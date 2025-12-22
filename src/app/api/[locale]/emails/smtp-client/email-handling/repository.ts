/**
 * Email Handling Repository
 * Core service for handling email processing and orchestration
 */

import "server-only";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { emailEnv } from "@/app/api/[locale]/emails/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { EmailProvider, EmailStatus, EmailType } from "../../messages/enum";
import { emailMetadataRepository } from "../email-metadata/repository";
import { EmailSendingRepository } from "../email-sending/repository";
import type {
  EmailHandleRequestOutput,
  EmailHandleResponseOutput,
} from "./types";

/**
 * Email Handling Repository Interface
 */
export interface EmailHandlingRepository {
  handleEmails<TRequest, TResponse, TUrlVariables>(
    data: EmailHandleRequestOutput<TRequest, TResponse, TUrlVariables>,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailHandleResponseOutput>>;
}

/**
 * Email Handling Repository Implementation
 */
export class EmailHandlingRepositoryImpl implements EmailHandlingRepository {
  async handleEmails<TRequest, TResponse, TUrlVariables>(
    data: EmailHandleRequestOutput<TRequest, TResponse, TUrlVariables>,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailHandleResponseOutput>> {
    const errors: ErrorResponseType[] = [];

    if (data.email?.afterHandlerEmails) {
      try {
        await Promise.all(
          data.email.afterHandlerEmails.map(async (emailData) => {
            try {
              const emailMessage = await emailData.render({
                user: data.user,
                urlPathParams: data.urlPathParams,
                requestData: data.requestData,
                responseData: data.responseData,
                t: data.t,
                locale: data.locale,
                logger,
              });

              if (!emailMessage.success) {
                if (!emailData.ignoreErrors) {
                  errors.push(
                    fail({
                      message:
                        "app.api.emails.smtpClient.emailHandling.email.errors.rendering_failed",
                      errorType: ErrorResponseTypes.EMAIL_ERROR,
                      messageParams: { error: emailMessage.message },
                    }),
                  );
                }
                return;
              }

              const templateData = emailMessage.data;

              // Build comprehensive email data with all template information
              const emailSendResult = await EmailSendingRepository.sendEmail(
                {
                  params: {
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
                    emailJourneyVariant:
                      templateData.emailJourneyVariant ?? null,
                    emailCampaignStage: templateData.emailCampaignStage ?? null,
                    // Pass through email metadata
                    replyToEmail: templateData.replyToEmail,
                    replyToName: templateData.replyToName,
                    unsubscribeUrl: templateData.unsubscribeUrl,
                    // Pass through SMTP selection criteria if provided
                    selectionCriteriaOverride:
                      templateData.smtpSelectionCriteria,
                  },
                },
                logger,
              );

              if (emailSendResult.success && emailSendResult.data) {
                logger.debug("Email sent successfully", {
                  recipient: templateData.toEmail,
                  subject: templateData.subject,
                  messageId: String(
                    emailSendResult.data.result.messageId ?? "",
                  ),
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
                  fail({
                    message:
                      "app.api.emails.smtpClient.emailHandling.email.errors.send_failed",
                    errorType: ErrorResponseTypes.EMAIL_ERROR,
                    messageParams: { error: emailSendResult.message },
                  }),
                );
              }
            } catch (error) {
              const parsedError = parseError(error);
              logger.error("Email render error", parsedError.message);

              // Try to store email metadata even for exceptions
              try {
                await emailMetadataRepository.storeEmailMetadata(
                  {
                    params: {
                      subject: data.t(
                        "app.api.emails.smtpClient.emailHandling.email.errors.email_failed_subject",
                      ),
                      recipientEmail: "unknown@example.com", // Fallback since we don't have recipient data
                      recipientName: data.t(
                        "app.api.emails.smtpClient.emailHandling.email.errors.unknown_recipient",
                      ),
                      senderEmail: emailEnv.EMAIL_FROM_EMAIL,
                      senderName: data.t("config.appName"),
                      type: EmailType.SYSTEM,
                      templateName: null,
                      status: EmailStatus.FAILED,
                      error: parsedError.message,
                      userId: data.user.isPublic ? null : data.user.id,
                      leadId: null,
                      metadata: {
                        locale: data.locale,
                        errorType: data.t(
                          "app.api.emails.smtpClient.emailHandling.email.errors.email_render_exception",
                        ),
                        errorDetails: parsedError.message,
                        endpoint: data.urlPathParams
                          ? JSON.stringify(data.urlPathParams)
                          : undefined,
                        requestData: data.requestData
                          ? JSON.stringify(data.requestData)
                          : undefined,
                      },
                      emailProvider: EmailProvider.SMTP,
                      externalId: null,
                    },
                  },
                  logger,
                );

                logger.debug("Email metadata stored for exception", {
                  error: parsedError.message,
                  userId: data.user.id,
                });
              } catch (metadataError) {
                logger.error(
                  "Failed to store email metadata for exception",
                  parseError(metadataError),
                );
                // Don't fail the process if metadata storage fails
              }

              errors.push(
                fail({
                  message:
                    "app.api.emails.smtpClient.emailHandling.email.errors.rendering_failed",
                  errorType: ErrorResponseTypes.EMAIL_ERROR,
                  messageParams: { error: parsedError.message },
                }),
              );
            }
          }),
        );
      } catch (error) {
        const parsedError = parseError(error);
        errors.push(
          fail({
            message:
              "app.api.emails.smtpClient.emailHandling.email.errors.batch_send_failed",
            errorType: ErrorResponseTypes.EMAIL_ERROR,
            messageParams: { error: parsedError.message },
          }),
        );
      }
    }

    if (errors.length > 0) {
      logger.error("Email errors");
      return fail({
        message:
          "app.api.emails.smtpClient.emailHandling.email.errors.batch_send_failed",
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          errors: errors.map((error) => error.message).join(", "),
        },
      });
    }

    return success({ success: true });
  }
}

export const emailHandlingRepository = new EmailHandlingRepositoryImpl();
