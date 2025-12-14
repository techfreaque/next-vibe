/**
 * Email Send Repository
 * Handles business logic for sending emails with optional SMS notifications
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { Countries, Languages } from "@/i18n/core/config";

import { emailServiceRepository as emailService } from "../email-service/repository";
import { smsServiceRepository as smsService } from "../sms-service/repository";
import type {
  EmailSendRequestOutput,
  EmailSendResponseOutput,
} from "./definition";

// Define the proper type for locale to match standardized patterns
type CountryLanguage = `${Lowercase<Languages>}-${Countries}`;

/**
 * Email Send Repository Interface
 */
export interface EmailSendRepository {
  sendEmail(
    data: EmailSendRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailSendResponseOutput>>;
}

/**
 * Email Send Repository Implementation
 */
export class EmailSendRepositoryImpl implements EmailSendRepository {
  async sendEmail(
    data: EmailSendRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailSendResponseOutput>> {
    try {
      logger.info("Email send repository: Processing email send request", {
        to: data.recipient.to,
        subject: data.emailContent.subject,
        hasSmsNotification: data.smsNotifications?.sendSmsNotification,
        userId: user.id,
      });

      // Validate SMS notification requirements
      if (data.smsNotifications?.sendSmsNotification) {
        if (
          !data.smsNotifications.smsPhoneNumber ||
          !data.smsNotifications.smsMessage
        ) {
          return fail({
            message: "app.api.emails.send.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              field: "app.api.emails.send.errors.validation.smsFields",
              message: "app.api.emails.send.errors.validation.smsRequired",
            },
          });
        }
      }

      // Send email using email service
      const emailResult = await emailService.sendEmail(
        {
          recipientInfo: {
            to: data.recipient.to,
            toName: data.recipient.toName,
          },
          emailContent: {
            subject: data.emailContent.subject,
            html: data.emailContent.html,
            text: data.emailContent.text,
          },
          senderSettings: {
            senderName: data.senderSettings.senderName,
            replyTo: data.senderSettings?.replyTo,
          },
          campaignSettings: {
            campaignType: data.campaignTracking?.campaignType,
            leadId: data.campaignTracking?.leadId,
          },
          advancedOptions: {},
        },
        user,
        locale,
        logger,
      );

      if (!emailResult.success) {
        logger.error("Email send repository: Email sending failed", {
          error: emailResult.message,
          to: data.recipient.to,
          subject: data.emailContent.subject,
        });
        return emailResult;
      }

      // Prepare response with email result (match nested endpoint structure)
      const response: EmailSendResponseOutput = {
        response: {
          deliveryStatus: {
            success: emailResult.data.result.success,
            messageId: emailResult.data.result.messageId,
            sentAt: emailResult.data.result.sentAt,
            response: emailResult.data.result.response,
          },
          accountInfo: {
            accountId: emailResult.data.result.accountId,
            accountName: emailResult.data.result.accountName,
          },
          deliveryResults: {
            accepted: emailResult.data.deliveryStatus.accepted,
            rejected: emailResult.data.deliveryStatus.rejected,
          },
          smsResult: {
            success: false,
          },
        },
      };

      // Send SMS notification if requested (optional, non-blocking)
      if (
        data.smsNotifications?.sendSmsNotification &&
        data.smsNotifications.smsPhoneNumber &&
        data.smsNotifications.smsMessage
      ) {
        logger.info("Email send repository: Sending SMS notification", {
          phoneNumber: data.smsNotifications.smsPhoneNumber,
          emailMessageId: emailResult.data.result.messageId,
        });

        try {
          const smsResult = await smsService.sendSms(
            {
              to: data.smsNotifications.smsPhoneNumber,
              message: data.smsNotifications.smsMessage,
              campaignType: data.campaignTracking?.campaignType,
              leadId: data.campaignTracking?.leadId,
              templateName: "app.api.emails.send.sms.emailNotificationTemplate",
            },
            user,
            logger,
          );

          if (smsResult.success) {
            response.response.smsResult = {
              success: true,
              messageId: smsResult.data.result.messageId,
              sentAt: smsResult.data.result.sentAt,
              provider: smsResult.data.result.provider,
            };
            logger.info(
              "Email send repository: SMS notification sent successfully",
              {
                smsMessageId: smsResult.data.result.messageId,
                emailMessageId: emailResult.data.result.messageId,
              },
            );
          } else {
            response.response.smsResult = {
              success: false,
              error: smsResult.message,
            };
            logger.warn("Email send repository: SMS notification failed", {
              error: smsResult.message,
              emailMessageId: emailResult.data.result.messageId,
            });
          }
        } catch (smsError) {
          logger.warn(
            "Email send repository: SMS notification error (non-blocking)",
            parseError(smsError),
          );
          response.response.smsResult = {
            success: false,
            error: "app.api.emails.send.errors.sms.temporarilyUnavailable",
          };
        }
      }

      logger.info("Email send repository: Email send completed successfully", {
        emailMessageId: response.response.deliveryStatus.messageId,
        accountUsed: response.response.accountInfo.accountName,
        smsNotificationSent: response.response.smsResult?.success || false,
      });

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "Email send repository: Critical error in email send",
        parsedError,
      );
      return fail({
        message: "app.api.emails.send.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

/**
 * Email Send Repository Singleton Instance
 */
export const emailSendRepository = new EmailSendRepositoryImpl();
