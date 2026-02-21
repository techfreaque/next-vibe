/**
 * Messaging Account Create API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestResponseField,
  responseField,
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
import { MessagingAccountCreateContainer } from "./widget";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "messaging", "accounts", "create"],
  title: "app.api.emails.messaging.accounts.create.title",
  description: "app.api.emails.messaging.accounts.create.description",
  category: "app.api.emails.category",
  icon: "message-circle",
  tags: ["app.api.emails.messaging.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      name: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.create.fields.name.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.name.description",
        placeholder:
          "app.api.emails.messaging.accounts.create.fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      description: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.emails.messaging.accounts.create.fields.description.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.description.description",
        placeholder:
          "app.api.emails.messaging.accounts.create.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      channel: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messaging.accounts.create.fields.channel.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB).default(MessageChannel.SMS),
      }),

      provider: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messaging.accounts.create.fields.provider.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.provider.description",
        columns: 6,
        options: MessagingProviderOptions,
        schema: z.enum(MessagingProviderDB).default(MessagingProvider.TWILIO),
      }),

      fromId: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.create.fields.fromId.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.fromId.description",
        placeholder:
          "app.api.emails.messaging.accounts.create.fields.fromId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiToken: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.emails.messaging.accounts.create.fields.apiToken.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.apiToken.description",
        placeholder:
          "app.api.emails.messaging.accounts.create.fields.apiToken.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      apiSecret: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label:
          "app.api.emails.messaging.accounts.create.fields.apiSecret.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.apiSecret.description",
        placeholder:
          "app.api.emails.messaging.accounts.create.fields.apiSecret.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.messaging.accounts.create.fields.priority.label",
        description:
          "app.api.emails.messaging.accounts.create.fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).default(0),
      }),

      // Response fields
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messaging.accounts.create.response.id",
        schema: z.uuid(),
      }),

      status: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.messaging.accounts.create.response.status",
        schema: z.enum(MessagingAccountStatusDB),
      }),

      createdAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messaging.accounts.create.response.createdAt",
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.messaging.accounts.create.errors.validation.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.messaging.accounts.create.errors.unauthorized.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messaging.accounts.create.errors.forbidden.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messaging.accounts.create.errors.notFound.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messaging.accounts.create.errors.conflict.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messaging.accounts.create.errors.server.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.messaging.accounts.create.errors.networkError.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.messaging.accounts.create.errors.unsavedChanges.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messaging.accounts.create.errors.unknown.title",
      description:
        "app.api.emails.messaging.accounts.create.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.messaging.accounts.create.success.title",
    description: "app.api.emails.messaging.accounts.create.success.description",
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
