/**
 * Template Notifications Repository
 * Repository for template notification operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType, JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { templates } from "../db";
import { TemplateStatus, type TemplateStatusValue } from "../enum";
import type {
  TemplateNotificationsRequestTypeOutput,
  TemplateNotificationsResponseTypeOutput,
} from "./definition";

/**
 * Template Notifications Repository Interface
 */
export interface ITemplateNotificationsRepository {
  sendNotifications(
    data: TemplateNotificationsRequestTypeOutput,
    auth: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateNotificationsResponseTypeOutput>>;
}

/**
 * Template Notifications Repository Implementation
 */
class TemplateNotificationsRepository
  implements ITemplateNotificationsRepository
{
  /**
   * Send notifications
   */
  async sendNotifications(
    data: TemplateNotificationsRequestTypeOutput,
    auth: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateNotificationsResponseTypeOutput>> {
    try {
      const userId = authRepository.requireUserId(auth as JwtPrivatePayloadType);
      logger.debug("app.api.v1.core.templateApi.notifications.debug.sending", {
        templateId: data.templateId,
        notificationType: data.notificationType,
        channels: data.channels,
        userId,
      });

      // Get template from database
      const template = await db
        .select()
        .from(templates)
        .where(
          and(eq(templates.id, data.templateId), eq(templates.userId, userId)),
        )
        .limit(1);

      if (template.length === 0) {
        logger.error(
          "app.api.v1.core.templateApi.notifications.errors.notFound.description",
          {
            templateId: data.templateId,
          },
        );
        return createErrorResponse(
          "template.notifications.errors.notFound",
          ErrorResponseTypes.NOT_FOUND,
          { templateId: data.templateId },
        );
      }

      const templateData = template[0];

      const response: TemplateNotificationsResponseTypeOutput = {
        response: {
          success: true,
          notifications: {},
          template: {
            id: templateData.id,
            name: templateData.name,
            status: templateData.status,
          },
        },
      };

      // Send email notifications if requested
      if (data.channels.includes("app.api.v1.core.templateApi.notifications.enums.channel.email")) {
        // In a real implementation, you would integrate with an email service
        // For now, we'll simulate successful sending
        const recipients = data.recipients || ["user@example.com"];
        response.response.notifications.email = {
          sent: recipients.length,
          failed: 0,
          recipients,
        };
        logger.debug("app.api.v1.core.templateApi.notifications.debug.emailSent", {
          count: recipients.length,
        });
      }

      // Send SMS notifications if requested
      if (data.channels.includes("app.api.v1.core.templateApi.notifications.enums.channel.sms")) {
        // In a real implementation, you would integrate with an SMS service
        // For now, we'll simulate successful sending
        const DEFAULT_PHONE_NUMBER = "+1234567890"; // TODO: Use real phone numbers
        const recipients = data.recipients || [DEFAULT_PHONE_NUMBER];
        response.response.notifications.sms = {
          sent: recipients.length,
          failed: 0,
          recipients,
        };
        logger.debug("app.api.v1.core.templateApi.notifications.debug.smsSent", {
          count: recipients.length,
        });
      }

      logger.debug("app.api.v1.core.templateApi.notifications.debug.sent", {
        emailCount: response.response.notifications.email?.sent || 0,
        smsCount: response.response.notifications.sms?.sent || 0,
      });

      return createSuccessResponse(response);
    } catch (error) {
      logger.error(
        "Failed to send notifications",
        {
          error,
        },
      );
      const parsedError = parseError(error);
      return createErrorResponse(
        "template.notifications.errors.server",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const templateNotificationsRepository =
  new TemplateNotificationsRepository();
