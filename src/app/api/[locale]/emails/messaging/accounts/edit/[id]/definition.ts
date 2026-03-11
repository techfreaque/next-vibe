/**
 * Messaging Account Edit API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  requestField,
  requestResponseField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { scopedTranslation } from "./i18n";
import { MessagingAccountEditContainer } from "./widget";

/**
 * GET endpoint — retrieve account by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "messaging", "accounts", "edit", "[id]"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.email",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountEditContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.name",
        schema: z.string(),
      }),
      description: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.description",
        schema: z.string().optional(),
      }),
      channel: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.account.channel",
        schema: z.enum(MessageChannelDB),
      }),
      provider: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.account.provider",
        schema: z.enum(MessagingProviderDB),
      }),
      fromId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.fromId",
        schema: z.string().nullable(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.account.status",
        schema: z.enum(MessagingAccountStatusDB),
      }),
      priority: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.priority",
        schema: z.coerce.number().int().optional(),
      }),
      messagesSentTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.messagesSentTotal",
        schema: z.coerce.number().int(),
      }),
      lastUsedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.lastUsedAt",
        schema: dateSchema.nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.createdAt",
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.updatedAt",
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
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
  scopedTranslation,
  method: Methods.PUT,
  path: ["emails", "messaging", "accounts", "edit", "[id]"],
  title: "put.title",
  description: "put.description",
  category: "app.endpointCategories.email",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      id: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.name.label",
        description: "fields.name.description",
        placeholder: "fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.description.label",
        description: "fields.description.description",
        placeholder: "fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      channel: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB).optional(),
      }),

      provider: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.provider.label",
        description: "fields.provider.description",
        columns: 6,
        options: MessagingProviderOptions,
        schema: z.enum(MessagingProviderDB).optional(),
      }),

      fromId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.fromId.label",
        description: "fields.fromId.description",
        placeholder: "fields.fromId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiToken: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiToken.label",
        description: "fields.apiToken.description",
        placeholder: "fields.apiToken.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiSecret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiSecret.label",
        description: "fields.apiSecret.description",
        placeholder: "fields.apiSecret.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.priority.label",
        description: "fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).optional(),
      }),

      status: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        columns: 6,
        schema: z.enum(MessagingAccountStatusDB).optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  successTypes: {
    title: "put.success.title",
    description: "put.success.description",
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
