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
import { createTrackingContext } from "../components/tracking_context.email";
import { EmailMetadataRepository } from "../email-metadata/repository";
import { EmailSendingRepository } from "../email-sending/repository";
import { scopedTranslation } from "../i18n";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
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
    TUserRoles extends readonly UserRoleValue[],
  >(
    data: EmailHandleRequestOutput<
      TRequest,
      TResponse,
      TUrlVariables,
      TScopedTranslationKey,
      TUserRoles
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
              const tracking = createTrackingContext(
                data.locale,
                data.user.isPublic ? undefined : data.user.leadId,
                data.user.isPublic ? undefined : data.user.id,
              );

              const { t: templateT } =
                emailData.template.scopedTranslation.scopedT(data.locale);
              const resolved = await emailData.template.render({
                user: data.user,
                urlPathParams: data.urlPathParams,
                requestData: data.requestData,
                responseData: data.responseData,
                t: templateT,
                locale: data.locale,
                logger,
                tracking,
              });

              if (!resolved.success) {
                if (!emailData.ignoreErrors) {
                  errors.push(
                    fail({
                      message: smtpT(
                        "emailHandling.email.errors.rendering_failed",
                      ),
                      errorType: ErrorResponseTypes.EMAIL_ERROR,
                      messageParams: { error: resolved.message },
                    }),
                  );
                }
                return;
              }

              const {
                jsx,
                toEmail,
                toName,
                subject,
                replyToEmail,
                replyToName,
                senderName,
                leadId,
                unsubscribeUrl,
              } = resolved.data;

              // Build comprehensive email data with all template information
              const emailSendResult = await EmailSendingRepository.sendEmail(
                {
                  jsx,
                  subject,
                  toEmail,
                  toName,
                  locale: data.locale,
                  senderName,
                  emailJourneyVariant: null,
                  emailCampaignStage: null,
                  replyToEmail,
                  replyToName,
                  unsubscribeUrl,
                  leadId,
                },
                logger,
                data.locale,
              );

              if (emailSendResult.success && emailSendResult.data) {
                logger.debug("Email sent successfully", {
                  recipient: toEmail,
                  subject,
                  messageId: String(
                    emailSendResult.data.result.messageId ?? "",
                  ),
                });
              } else {
                logger.error("Failed to send email", {
                  recipient: toEmail,
                  subject,
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
