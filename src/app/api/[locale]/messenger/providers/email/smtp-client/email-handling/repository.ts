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

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { MessageStatus, MessageType } from "../../../../messages/enum";
import { EmailMetadataRepository } from "../email-metadata/repository";
import { EmailSendingRepository } from "../email-sending/repository";
import { scopedTranslation } from "../i18n";
import type {
  EmailHandleRequestOutput,
  EmailHandleResponseOutput,
} from "./handler";

/**
 * Email Handling Repository
 */
export class EmailHandlingRepository {
  static async handleEmails<
    TRequest,
    TResponse,
    TUrlVariables,
    TScopedTranslationKey extends string,
  >(
    data: EmailHandleRequestOutput<
      TRequest,
      TResponse,
      TUrlVariables,
      TScopedTranslationKey
    >,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailHandleResponseOutput>> {
    const errors: ErrorResponseType[] = [];

    if (data.email?.afterHandlerEmails) {
      try {
        await Promise.all(
          data.email.afterHandlerEmails.map(async (emailData) => {
            const { t: smtpT } = scopedTranslation.scopedT(data.locale);
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
                      message: smtpT(
                        "emailHandling.email.errors.rendering_failed",
                      ),
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
                  jsx: templateData.jsx,
                  subject: templateData.subject,
                  toEmail: templateData.toEmail,
                  toName: templateData.toName,
                  locale: data.locale,
                  senderName: templateData.senderName,
                  campaignType: templateData.campaignType,
                  emailJourneyVariant: templateData.emailJourneyVariant ?? null,
                  emailCampaignStage: templateData.emailCampaignStage ?? null,
                  replyToEmail: templateData.replyToEmail,
                  replyToName: templateData.replyToName,
                  unsubscribeUrl: templateData.unsubscribeUrl,
                  selectionCriteriaOverride: templateData.smtpSelectionCriteria,
                },
                logger,
                data.locale,
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
                errors.push(
                  fail({
                    message: smtpT("emailHandling.email.errors.send_failed"),
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
                await EmailMetadataRepository.storeEmailMetadata(
                  {
                    subject: smtpT(
                      "emailHandling.email.errors.email_failed_subject",
                    ),
                    recipientEmail: "unknown@example.com",
                    recipientName: smtpT(
                      "emailHandling.email.errors.unknown_recipient",
                    ),
                    senderEmail: smtpT(
                      "emailHandling.email.errors.unknown_sender",
                    ),
                    senderName: smtpT(
                      "emailHandling.email.errors.unknown_sender",
                    ),
                    type: MessageType.SYSTEM,
                    templateName: null,
                    status: MessageStatus.FAILED,
                    error: parsedError.message,
                    userId: data.user.isPublic ? null : data.user.id,
                    leadId: null,
                    metadata: {
                      locale: data.locale,
                      errorType: smtpT(
                        "emailHandling.email.errors.email_render_exception",
                      ),
                      errorDetails: parsedError.message,
                      endpoint: data.urlPathParams
                        ? JSON.stringify(data.urlPathParams)
                        : undefined,
                      requestData: data.requestData
                        ? JSON.stringify(data.requestData)
                        : undefined,
                    },
                  },
                  logger,
                  smtpT,
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
                  message: smtpT("emailHandling.email.errors.rendering_failed"),
                  errorType: ErrorResponseTypes.EMAIL_ERROR,
                  messageParams: { error: parsedError.message },
                }),
              );
            }
          }),
        );
      } catch (error) {
        const parsedError = parseError(error);
        const { t: outerSmtpT } = scopedTranslation.scopedT(data.locale);
        errors.push(
          fail({
            message: outerSmtpT("emailHandling.email.errors.batch_send_failed"),
            errorType: ErrorResponseTypes.EMAIL_ERROR,
            messageParams: { error: parsedError.message },
          }),
        );
      }
    }

    if (errors.length > 0) {
      const { t: outerSmtpT } = scopedTranslation.scopedT(data.locale);
      logger.error("Email errors", errors);
      return fail({
        message: outerSmtpT("emailHandling.email.errors.batch_send_failed"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          errors: errors.map((error) => error.message).join(", "),
        },
      });
    }

    return success({ success: true });
  }
}
