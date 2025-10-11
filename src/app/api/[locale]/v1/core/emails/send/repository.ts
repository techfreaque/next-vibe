/**
 * Email Send Repository
 * Handles business logic for sending emails with optional SMS notifications
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { Countries, Languages } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";

// Define the proper type for locale to match standardized patterns
type CountryLanguage = `${Lowercase<Languages>}-${Countries}`;
import { emailServiceRepository as emailService } from "../email-service/repository";
import { smsServiceRepository as smsService } from "../sms-service/repository";
import type {
  EmailSendRequestTypeOutput,
  EmailSendResponseTypeOutput,
} from "./definition";

/**
 * Email Send Repository Interface
 */
export interface EmailSendRepository {
  sendEmail(
    data: EmailSendRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailSendResponseTypeOutput>>;
}

/**
 * Email Send Repository Implementation
 */
export class EmailSendRepositoryImpl implements EmailSendRepository {
  async sendEmail(
    data: EmailSendRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailSendResponseTypeOutput>> {
    try {
      logger.info("Email send repository: Processing email send request", {
        to: data.to,
        subject: data.subject,
        hasSmsNotification: data.sendSmsNotification,
        userId: user.id,
      });

      // Validate SMS notification requirements
      if (data.sendSmsNotification) {
        if (!data.smsPhoneNumber || !data.smsMessage) {
          return createErrorResponse(
            "app.api.v1.core.emails.send.errors.validation.title",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              field: "smsPhoneNumber|smsMessage",
              message:
                "SMS phone number and message are required when SMS notification is enabled",
            },
          );
        }
      }

      // Send email using email service
      const emailResult = await emailService.sendEmail(
        {
          to: data.to,
          toName: data.toName,
          subject: data.subject,
          html: data.html,
          text: data.text,
          replyTo: data.replyTo,
          senderName: data.senderName,
          campaignType: data.campaignType,
          leadId: data.leadId,
        },
        user,
        locale,
        logger,
      );

      if (!emailResult.success) {
        logger.error("Email send repository: Email sending failed", {
          error: emailResult.message,
          to: data.to,
          subject: data.subject,
        });
        return emailResult;
      }

      // Prepare response with email result
      const response: EmailSendResponseTypeOutput = {
        success: emailResult.data.success,
        messageId: emailResult.data.messageId,
        accountId: emailResult.data.accountId,
        accountName: emailResult.data.accountName,
        accepted: emailResult.data.accepted,
        rejected: emailResult.data.rejected,
        response: emailResult.data.response,
        sentAt: emailResult.data.sentAt,
      };

      // Send SMS notification if requested (optional, non-blocking)
      if (data.sendSmsNotification && data.smsPhoneNumber && data.smsMessage) {
        logger.info("Email send repository: Sending SMS notification", {
          phoneNumber: data.smsPhoneNumber,
          emailMessageId: emailResult.data.messageId,
        });

        try {
          const smsResult = await smsService.sendSms(
            {
              to: data.smsPhoneNumber,
              message: data.smsMessage,
              campaignType: data.campaignType,
              leadId: data.leadId,
              templateName: "email_notification",
            },
            user,
            locale,
            logger,
          );

          if (smsResult.success) {
            response.smsResult = {
              success: true,
              messageId: smsResult.data.messageId,
              sentAt: smsResult.data.sentAt,
              provider: smsResult.data.provider,
            };
            logger.info(
              "Email send repository: SMS notification sent successfully",
              {
                smsMessageId: smsResult.data.messageId,
                emailMessageId: emailResult.data.messageId,
              },
            );
          } else {
            response.smsResult = {
              success: false,
              error: smsResult.message,
            };
            logger.warn("Email send repository: SMS notification failed", {
              error: smsResult.message,
              emailMessageId: emailResult.data.messageId,
            });
          }
        } catch (smsError) {
          logger.warn(
            "Email send repository: SMS notification error (non-blocking)",
            smsError,
          );
          response.smsResult = {
            success: false,
            error: "SMS service temporarily unavailable",
          };
        }
      }

      logger.info("Email send repository: Email send completed successfully", {
        emailMessageId: response.messageId,
        accountUsed: response.accountName,
        smsNotificationSent: response.smsResult?.success || false,
      });

      return createSuccessResponse(response);
    } catch (error) {
      logger.error(
        "Email send repository: Critical error in email send",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.emails.send.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }
}

/**
 * Email Send Repository Singleton Instance
 */
export const emailSendRepository = new EmailSendRepositoryImpl();
