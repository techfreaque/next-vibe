/**
 * SMS Service Repository Implementation
 * Provides centralized SMS sending functionality for email-related notifications
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

import type { SmsSendRequestOutput, SmsSendResponseOutput } from "./definition";

/**
 * SMS Service Repository Interface
 */
export interface SmsServiceRepository {
  sendSms(
    data: SmsSendRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmsSendResponseOutput>>;
}

/**
 * SMS Service Repository Implementation
 * Provides SMS notifications for email-related events
 */
export class SmsServiceRepositoryImpl implements SmsServiceRepository {
  async sendSms(
    data: SmsSendRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmsSendResponseOutput>> {
    try {
      logger.debug("SMS service: Sending SMS notification", {
        to: data.to,
        messageLength: data.message.length,
        campaignType: data.campaignType ?? "unknown",
        userId: user.id,
      });

      // Validate phone number format
      if (!this.isValidPhoneNumber(data.to)) {
        return fail({
          message: "app.api.emails.smsService.errors.invalid_phone.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { phoneNumber: data.to },
        });
      }

      // Validate message length (SMS limit is typically 160 characters)
      if (data.message.length > 160) {
        logger.warn("SMS service: Message exceeds standard SMS length", {
          messageLength: data.message.length,
          to: data.to,
        });
      }

      // SMS sending implementation would go here
      // For now, this is a placeholder that simulates SMS sending
      const result = await this.sendSmsInternal(data, logger);

      logger.debug("SMS service: SMS sent successfully", {
        messageId: result.messageId,
        to: data.to,
        provider: result.provider,
      });

      return success({
        result: {
          success: true,
          messageId: result.messageId,
          sentAt: new Date().toISOString(),
          provider: result.provider,
          cost: result.cost,
        },
      });
    } catch (error) {
      logger.error(
        "SMS service: Critical error in SMS sending",
        parseError(error),
      );
      return fail({
        message: "app.api.emails.smsService.errors.send.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Internal SMS sending implementation
   * This would integrate with actual SMS providers (Twilio, AWS SNS, etc.)
   */
  private async sendSmsInternal(
    data: SmsSendRequestOutput,
    logger: EndpointLogger,
  ): Promise<{ messageId: string; provider: string; cost: number }> {
    logger.debug("SMS service: Processing SMS send request", {
      to: data.to,
      messageLength: data.message.length,
    });

    // Simulate SMS provider integration
    // In a real implementation, this would call:
    // - Twilio API
    // - AWS SNS
    // - Other SMS providers

    // eslint-disable-next-line i18next/no-literal-string
    const messageId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Simulate network delay
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    return {
      messageId,
      provider: "simulation",
      cost: 0.005, // Example cost in USD
    };
  }

  /**
   * Validate phone number format
   * Basic validation - in production, use a proper phone number validation library
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove spaces, dashes, and parentheses
    const cleaned = phoneNumber.replace(/[\s\-()]/g, "");

    // Check if it's a valid international format (+1234567890) or national format
    const phoneRegex = /^(\+?[1-9]\d{1,14}|\d{10,15})$/;

    return phoneRegex.test(cleaned);
  }
}

/**
 * SMS Service Repository Singleton Instance
 */
export const smsServiceRepository = new SmsServiceRepositoryImpl();
