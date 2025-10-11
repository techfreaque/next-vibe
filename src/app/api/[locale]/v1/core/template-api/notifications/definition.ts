/**
 * Template Notifications API Definition
 * Defines endpoints for template notification operations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { TemplateStatus } from "../enum";

/**
 * Notification type enum
 */
const { enum: NotificationType, options: NotificationTypeOptions } =
  createEnumOptions({
    CREATED:
      "app.api.v1.core.templateApi.notifications.enums.notificationType.created",
    UPDATED:
      "app.api.v1.core.templateApi.notifications.enums.notificationType.updated",
    PUBLISHED:
      "app.api.v1.core.templateApi.notifications.enums.notificationType.published",
    DELETED:
      "app.api.v1.core.templateApi.notifications.enums.notificationType.deleted",
  });

/**
 * Notification channel enum
 */
const { enum: NotificationChannel, options: NotificationChannelOptions } =
  createEnumOptions({
    EMAIL: "app.api.v1.core.templateApi.notifications.enums.channel.email",
    SMS: "app.api.v1.core.templateApi.notifications.enums.channel.sms",
  });

/**
 * Template Notifications Endpoint (POST)
 * Send template notifications via email and SMS
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "template-api", "notifications"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  aliases: ["template-api:notifications", "template:notify"],

  title: "app.api.v1.core.templateApi.notifications.title",
  description: "app.api.v1.core.templateApi.notifications.description",
  category: "app.api.v1.core.templateApi.category",
  tags: [
    "app.api.v1.core.templateApi.tags.notifications",
    "app.api.v1.core.templateApi.tags.email",
    "app.api.v1.core.templateApi.tags.sms",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.notifications.form.title",
      description:
        "app.api.v1.core.templateApi.notifications.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      templateId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.templateApi.notifications.templateId.label",
          description:
            "app.api.v1.core.templateApi.notifications.templateId.description",
          placeholder:
            "app.api.v1.core.templateApi.notifications.templateId.placeholder",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      notificationType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.templateApi.notifications.notificationType.label",
          description:
            "app.api.v1.core.templateApi.notifications.notificationType.description",
          placeholder:
            "app.api.v1.core.templateApi.notifications.notificationType.placeholder",
          options: NotificationTypeOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(NotificationType)),
      ),

      channels: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.notifications.channels.label",
          description:
            "app.api.v1.core.templateApi.notifications.channels.description",
          placeholder:
            "app.api.v1.core.templateApi.notifications.channels.placeholder",
          options: NotificationChannelOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(NotificationChannel)).min(1),
      ),

      recipients: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.templateApi.notifications.recipients.label",
          description:
            "app.api.v1.core.templateApi.notifications.recipients.description",
          placeholder:
            "app.api.v1.core.templateApi.notifications.recipients.placeholder",
          layout: { columns: 12 },
        },
        z.array(z.uuid()).optional(),
      ),

      customMessage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.templateApi.notifications.customMessage.label",
          description:
            "app.api.v1.core.templateApi.notifications.customMessage.description",
          placeholder:
            "app.api.v1.core.templateApi.notifications.customMessage.placeholder",
          layout: { columns: 12 },
        },
        z.string().max(500).optional(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.notifications.response.title",
          description:
            "app.api.v1.core.templateApi.notifications.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          success: z.boolean(),
          notifications: z.object({
            email: z
              .object({
                sent: z.number(),
                failed: z.number(),
                recipients: z.array(z.string()),
              })
              .optional(),
            sms: z
              .object({
                sent: z.number(),
                failed: z.number(),
                recipients: z.array(z.string()),
              })
              .optional(),
          }),
          template: z.object({
            id: z.uuid(),
            name: z.string(),
            status: z.nativeEnum(TemplateStatus),
          }),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.server.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.network.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.templateApi.notifications.errors.notFound.title",
      description:
        "app.api.v1.core.templateApi.notifications.errors.notFound.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.notifications.success.title",
    description:
      "app.api.v1.core.templateApi.notifications.success.description",
  },

  examples: {
    requests: {
      empty: {},
      basic: {
        templateId: "123e4567-e89b-12d3-a456-426614174000",
        notificationType: [NotificationType.PUBLISHED],
        channels: [NotificationChannel.EMAIL],
      },
      advanced: {
        templateId: "123e4567-e89b-12d3-a456-426614174000",
        notificationType: [NotificationType.PUBLISHED],
        channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
        recipients: ["456e7890-e89b-12d3-a456-426614174001"],
        customMessage: "Your template has been published successfully!",
      },
    },
    urlPathVariables: undefined,
    responses: {
      empty: {
        response: {
          success: true,
          notifications: {
            email: {
              sent: 0,
              failed: 0,
              recipients: [],
            },
          },
          template: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Template",
            status: TemplateStatus.DRAFT,
          },
        },
      },
      basic: {
        response: {
          success: true,
          notifications: {
            email: {
              sent: 1,
              failed: 0,
              recipients: ["user@example.com"],
            },
          },
          template: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Email Newsletter Template",
            status: TemplateStatus.PUBLISHED,
          },
        },
      },
      advanced: {
        response: {
          success: true,
          notifications: {
            email: {
              sent: 1,
              failed: 0,
              recipients: ["user@example.com"],
            },
            sms: {
              sent: 1,
              failed: 0,
              recipients: ["+1234567890"],
            },
          },
          template: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Email Newsletter Template",
            status: TemplateStatus.PUBLISHED,
          },
        },
      },
    },
  },
});

export type TemplateNotificationsRequestTypeInput =
  typeof POST.types.RequestInput;
export type TemplateNotificationsRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type TemplateNotificationsResponseTypeInput =
  typeof POST.types.ResponseInput;
export type TemplateNotificationsResponseTypeOutput =
  typeof POST.types.ResponseOutput;

// Keep for backward compatibility
export const templateNotificationsRequestSchema = POST.requestSchema;
export const templateNotificationsResponseSchema = POST.responseSchema;

/**
 * Export the endpoint definitions
 */
const templateNotificationsEndpoints = {
  POST,
};

export { NotificationChannel, NotificationType, POST };
export default templateNotificationsEndpoints;
