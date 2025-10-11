/**
 * Template Notification SMS Templates
 * SMS templates for template-related notifications
 */

import "server-only";

import type { SmsFunctionType } from "next-vibe/server/sms/utils";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type {
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
} from "./definition";
import type { NotificationType } from "./types";

// SMS Configuration Constants
const SMS_CONFIG = {
  ADMIN_PHONE: "+1234567890",
  SYSTEM_PHONE: "+0987654321",
  EMERGENCY_PHONE: "+1111111111",
  DEFAULT_RECIPIENT: "+1234567890",
  MAX_SMS_LENGTH: 160,
} as const;

/**
 * Generate SMS message for template notifications
 */
function generateSmsMessage({
  requestData,
  responseData,
  isShort = false,
}: {
  requestData: TemplateNotificationsRequestType;
  responseData: TemplateNotificationsResponseType;
  isShort?: boolean;
}): string {
  const notificationTypeMap = {
    created: "CREATED",
    updated: "UPDATED",
    published: "PUBLISHED",
    deleted: "DELETED",
  } as const;

  const notificationTypeText =
    notificationTypeMap[requestData.notificationType] || "UNKNOWN";

  const TEMPLATE_PREFIX = "Template ";
  const COLON_SEPARATOR = ": ";
  const OPEN_PAREN = " (";
  const CLOSE_PAREN = ")";
  const NEWLINE = "\n";
  const ID_PREFIX = "ID: ";
  const STATUS_PREFIX = "Status: ";
  const NOTE_PREFIX = "\n\nNote: ";

  if (isShort) {
    return (
      TEMPLATE_PREFIX +
      notificationTypeText +
      COLON_SEPARATOR +
      responseData.template.name +
      OPEN_PAREN +
      responseData.template.id +
      CLOSE_PAREN
    );
  }

  let message =
    TEMPLATE_PREFIX +
    notificationTypeText +
    COLON_SEPARATOR +
    responseData.template.name +
    NEWLINE +
    ID_PREFIX +
    responseData.template.id +
    NEWLINE +
    STATUS_PREFIX +
    responseData.template.status;

  // Add custom message if provided
  if (requestData.customMessage) {
    message += NOTE_PREFIX + requestData.customMessage;
  }

  return message;
}

/**
 * Admin SMS Notification Function
 * Sends template notifications via SMS to administrators
 */
export const renderAdminSmsNotification: SmsFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, user, logger }) => {
  logger.debug("template.notification.sms.admin.start", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
    userId: user.id,
  });

  try {
    const message = generateSmsMessage({
      requestData,
      responseData,
      isShort: false,
    });

    // Try to generate a shorter message if the full one is too long
    const shortMessage = generateSmsMessage({
      requestData,
      responseData,
      isShort: true,
    });

    return createSuccessResponse({
      to: SMS_CONFIG.ADMIN_PHONE,
      message:
        message.length <= SMS_CONFIG.MAX_SMS_LENGTH ? message : shortMessage,
      from: SMS_CONFIG.SYSTEM_PHONE,
    });
  } catch (error) {
    logger.error("template.notification.sms.admin.error", error);
    return createErrorResponse(
      "templateErrors.template.post.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * User SMS Notification Function
 * Sends template notifications via SMS to specific users
 */
export const renderUserSmsNotification: SmsFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, user, logger }) => {
  logger.debug("template.notification.sms.user.start", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
    userId: user.id,
  });

  try {
    const message = generateSmsMessage({
      requestData,
      responseData,
      isShort: false,
    });

    // Try to generate a shorter message if the full one is too long
    const shortMessage = generateSmsMessage({
      requestData,
      responseData,
      isShort: true,
    });

    // Use custom recipients if provided, otherwise use a default
    const recipients = requestData.recipients || [SMS_CONFIG.DEFAULT_RECIPIENT];
    const primaryRecipient = recipients[0];

    return createSuccessResponse({
      to: primaryRecipient,
      message:
        message.length <= SMS_CONFIG.MAX_SMS_LENGTH ? message : shortMessage,
      from: SMS_CONFIG.SYSTEM_PHONE,
    });
  } catch (error) {
    logger.error("template.notification.sms.user.error", error);
    return createErrorResponse(
      "templateErrors.template.post.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Bulk SMS Notification Function
 * Sends template notifications via SMS to multiple recipients
 */
export const renderBulkSmsNotification: SmsFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, user, logger }) => {
  logger.debug("template.notification.sms.bulk.start", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
    recipientCount: requestData.recipients?.length || 0,
    userId: user.id,
  });

  try {
    const message = generateSmsMessage({
      requestData,
      responseData,
      isShort: true, // Use short format for bulk messages
    });

    // Use provided recipients or default
    const recipients = requestData.recipients || [SMS_CONFIG.DEFAULT_RECIPIENT];

    // For bulk SMS, we'll return the first recipient
    // In a real implementation, you'd handle multiple recipients
    return createSuccessResponse({
      to: recipients[0],
      message,
      from: SMS_CONFIG.SYSTEM_PHONE,
      options: {
        extraFields: {
          bulkRecipients: recipients.join(","),
        },
      },
    });
  } catch (error) {
    logger.error("template.notification.sms.bulk.error", error);
    return createErrorResponse(
      "templateErrors.template.post.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

/**
 * Emergency Template Notification Function
 * Sends urgent template notifications via SMS
 */
export const renderEmergencySmsNotification: SmsFunctionType<
  TemplateNotificationsRequestType,
  TemplateNotificationsResponseType,
  UndefinedType
> = ({ requestData, responseData, user, logger }) => {
  logger.debug("template.notification.sms.emergency.start", {
    templateId: requestData.templateId,
    notificationType: requestData.notificationType,
    userId: user.id,
  });

  try {
    const URGENT_PREFIX = "URGENT: Template ";
    const DASH_SEPARATOR = " - ";
    const ID_PREFIX = " (ID: ";
    const CLOSE_PAREN = ")";
    const urgentMessage =
      URGENT_PREFIX +
      requestData.notificationType.toUpperCase() +
      DASH_SEPARATOR +
      responseData.template.name +
      ID_PREFIX +
      responseData.template.id +
      CLOSE_PAREN;

    return createSuccessResponse({
      to: SMS_CONFIG.EMERGENCY_PHONE,
      message: urgentMessage,
      from: SMS_CONFIG.SYSTEM_PHONE,
      options: {
        extraFields: {
          priority: "high",
        },
      },
    });
  } catch (error) {
    logger.error("template.notification.sms.emergency.error", error);
    return createErrorResponse(
      "templateErrors.template.post.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
};

interface SMSNotificationService {
  sendSMS: (data: Omit<NotificationType, "id">) => Promise<NotificationType>;
  validateSMS: (data: Omit<NotificationType, "id">) => Promise<boolean>;
}

export const smsNotificationService: SMSNotificationService = {
  sendSMS: async (
    data: Omit<NotificationType, "id">,
  ): Promise<NotificationType> => {
    // Implementation
    const result = await Promise.resolve({ id: "1", ...data });
    return result;
  },

  validateSMS: async (data: Omit<NotificationType, "id">): Promise<boolean> => {
    // Validate SMS data structure
    const isValid = data.name && data.type && data.status;
    return await Promise.resolve(Boolean(isValid));
  },
};
