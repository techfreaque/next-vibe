/**
 * Messaging Account Create API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedRequestField,
  scopedRequestResponseField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../../shared/types/common.schema";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  MessageChannel,
  MessageChannelDB,
  MessageChannelOptions,
  MessagingAccountStatus,
  MessagingAccountStatusDB,
  MessagingProvider,
  MessagingProviderDB,
  MessagingProviderOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { MessagingAccountCreateContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "messaging", "accounts", "create"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      name: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.name.label",
        description: "fields.name.description",
        placeholder: "fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      description: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.description.label",
        description: "fields.description.description",
        placeholder: "fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      channel: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB).default(MessageChannel.SMS),
      }),

      provider: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.provider.label",
        description: "fields.provider.description",
        columns: 6,
        options: MessagingProviderOptions,
        schema: z.enum(MessagingProviderDB).default(MessagingProvider.TWILIO),
      }),

      fromId: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.fromId.label",
        description: "fields.fromId.description",
        placeholder: "fields.fromId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiToken: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiToken.label",
        description: "fields.apiToken.description",
        placeholder: "fields.apiToken.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiSecret: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiSecret.label",
        description: "fields.apiSecret.description",
        placeholder: "fields.apiSecret.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      priority: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.priority.label",
        description: "fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).default(0),
      }),

      // Response fields
      id: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.id",
        schema: z.uuid(),
      }),

      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.status",
        schema: z.enum(MessagingAccountStatusDB),
      }),

      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.createdAt",
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
    requests: {
      default: {
        name: "Twilio SMS Account",
        channel: MessageChannel.SMS,
        provider: MessagingProvider.TWILIO,
        fromId: "+1234567890",
        apiToken: "ACxxxxxxxx",
        apiSecret: "your_auth_token",
        priority: 10,
      },
    },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Twilio SMS Account",
        channel: MessageChannel.SMS,
        provider: MessagingProvider.TWILIO,
        fromId: "+1234567890",
        status: MessagingAccountStatus.ACTIVE,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    },
  },
});

export type MessagingAccountCreatePOSTRequestInput =
  typeof POST.types.RequestInput;
export type MessagingAccountCreatePOSTRequestOutput =
  typeof POST.types.RequestOutput;
export type MessagingAccountCreatePOSTResponseInput =
  typeof POST.types.ResponseInput;
export type MessagingAccountCreatePOSTResponseOutput =
  typeof POST.types.ResponseOutput;

const messagingAccountCreateEndpoints = { POST };
export default messagingAccountCreateEndpoints;
