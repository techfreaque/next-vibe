/**
 * Messaging Account Edit API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestResponseField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";
import {
  MessageChannel,
  MessageChannelDB,
  MessageChannelOptions,
  MessagingAccountStatus,
  MessagingAccountStatusDB,
  MessagingProvider,
  MessagingProviderDB,
  MessagingProviderOptions,
} from "../../../enum";
import { MessagingAccountEditContainer } from "./widget";

/**
 * GET endpoint — retrieve account by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "messaging", "accounts", "edit", "[id]"],
  title: "app.api.emails.messaging.accounts.edit.id.get.title",
  description: "app.api.emails.messaging.accounts.edit.id.get.description",
  category: "app.api.emails.category",
  icon: "message-circle",
  tags: ["app.api.emails.messaging.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountEditContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.id.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.name",
        schema: z.string(),
      }),
      description: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.description",
        schema: z.string().optional(),
      }),
      channel: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.messaging.accounts.edit.id.response.account.channel",
        schema: z.enum(MessageChannelDB),
      }),
      provider: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.messaging.accounts.edit.id.response.account.provider",
        schema: z.enum(MessagingProviderDB),
      }),
      fromId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.fromId",
        schema: z.string().nullable(),
      }),
      status: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.messaging.accounts.edit.id.response.account.status",
        schema: z.enum(MessagingAccountStatusDB),
      }),
      priority: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.priority",
        schema: z.coerce.number().int().optional(),
      }),
      messagesSentTotal: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.messagesSentTotal",
        schema: z.coerce.number().int(),
      }),
      lastUsedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.lastUsedAt",
        schema: dateSchema.nullable(),
      }),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.createdAt",
        schema: dateSchema,
      }),
      updatedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messaging.accounts.edit.id.response.account.updatedAt",
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.validation.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.unauthorized.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.forbidden.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.notFound.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.conflict.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.server.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.networkError.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.unsavedChanges.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.unknown.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.messaging.accounts.edit.id.success.title",
    description:
      "app.api.emails.messaging.accounts.edit.id.success.description",
  },

  examples: {
    urlPathParams: { default: { id: "550e8400-e29b-41d4-a716-446655440001" } },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Twilio SMS",
        channel: MessageChannel.SMS,
        provider: MessagingProvider.TWILIO,
        fromId: "+1234567890",
        status: MessagingAccountStatus.ACTIVE,
        priority: 10,
        messagesSentTotal: 500,
        lastUsedAt: "2024-01-07T11:45:00.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-07T10:00:00.000Z",
      },
    },
  },
});

/**
 * PUT endpoint — update account
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["emails", "messaging", "accounts", "edit", "[id]"],
  title: "app.api.emails.messaging.accounts.edit.id.put.title",
  description: "app.api.emails.messaging.accounts.edit.id.put.description",
  category: "app.api.emails.category",
  icon: "message-circle",
  tags: ["app.api.emails.messaging.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.id.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.name.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.name.description",
        placeholder:
          "app.api.emails.messaging.accounts.edit.id.fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      description: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.emails.messaging.accounts.edit.id.fields.description.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.description.description",
        placeholder:
          "app.api.emails.messaging.accounts.edit.id.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      channel: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.channel.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB).optional(),
      }),

      provider: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.emails.messaging.accounts.edit.id.fields.provider.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.provider.description",
        columns: 6,
        options: MessagingProviderOptions,
        schema: z.enum(MessagingProviderDB).optional(),
      }),

      fromId: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.fromId.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.fromId.description",
        placeholder:
          "app.api.emails.messaging.accounts.edit.id.fields.fromId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiToken: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label:
          "app.api.emails.messaging.accounts.edit.id.fields.apiToken.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.apiToken.description",
        placeholder:
          "app.api.emails.messaging.accounts.edit.id.fields.apiToken.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiSecret: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label:
          "app.api.emails.messaging.accounts.edit.id.fields.apiSecret.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.apiSecret.description",
        placeholder:
          "app.api.emails.messaging.accounts.edit.id.fields.apiSecret.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.emails.messaging.accounts.edit.id.fields.priority.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).optional(),
      }),

      status: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messaging.accounts.edit.id.fields.status.label",
        description:
          "app.api.emails.messaging.accounts.edit.id.fields.status.description",
        columns: 6,
        schema: z.enum(MessagingAccountStatusDB).optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.validation.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.unauthorized.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.forbidden.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.notFound.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.conflict.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.server.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.networkError.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.messaging.accounts.edit.id.errors.unsavedChanges.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messaging.accounts.edit.id.errors.unknown.title",
      description:
        "app.api.emails.messaging.accounts.edit.id.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.messaging.accounts.edit.id.put.success.title",
    description:
      "app.api.emails.messaging.accounts.edit.id.put.success.description",
  },

  examples: {
    urlPathParams: { default: { id: "550e8400-e29b-41d4-a716-446655440001" } },
    requests: { default: { name: "Updated Twilio SMS", priority: 15 } },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Updated Twilio SMS",
        channel: MessageChannel.SMS,
        provider: MessagingProvider.TWILIO,
        fromId: "+1234567890",
        status: MessagingAccountStatus.ACTIVE,
      },
    },
  },
});

export type MessagingAccountEditGETRequestInput = typeof GET.types.RequestInput;
export type MessagingAccountEditGETRequestOutput =
  typeof GET.types.RequestOutput;
export type MessagingAccountEditGETResponseInput =
  typeof GET.types.ResponseInput;
export type MessagingAccountEditGETResponseOutput =
  typeof GET.types.ResponseOutput;

export type MessagingAccountEditPUTRequestInput = typeof PUT.types.RequestInput;
export type MessagingAccountEditPUTRequestOutput =
  typeof PUT.types.RequestOutput;
export type MessagingAccountEditPUTResponseInput =
  typeof PUT.types.ResponseInput;
export type MessagingAccountEditPUTResponseOutput =
  typeof PUT.types.ResponseOutput;

const messagingAccountEditEndpoints = { GET, PUT };
export default messagingAccountEditEndpoints;
