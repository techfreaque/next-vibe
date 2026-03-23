/**
 * Unified Messenger Send API Definition
 * Sends a message through any channel (Email, SMS, WhatsApp, Telegram)
 * via a configured messenger_accounts row.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "send"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.messenger",
  icon: "send",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // Which account to send through (required)
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        columns: 12,
        schema: z.string().uuid(),
      }),

      // Recipient
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "to.label",
        description: "to.description",
        placeholder: "to.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      toName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "toName.label",
        description: "toName.description",
        placeholder: "toName.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      // Content - text is the universal body; subject + html are email-only
      subject: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "subject.label",
        description: "subject.description",
        placeholder: "subject.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      text: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "text.label",
        description: "text.description",
        placeholder: "text.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      html: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "html.label",
        description: "html.description",
        placeholder: "html.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // Sender (email only)
      senderName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "senderName.label",
        description: "senderName.description",
        placeholder: "senderName.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      replyTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "replyTo.label",
        description: "replyTo.description",
        placeholder: "replyTo.placeholder",
        columns: 6,
        schema: z.email().optional(),
      }),

      // Tracking
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "leadId.label",
        description: "leadId.description",
        placeholder: "leadId.placeholder",
        columns: 6,
        schema: z.string().uuid().optional(),
      }),

      campaignId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "campaignId.label",
        description: "campaignId.description",
        placeholder: "campaignId.placeholder",
        columns: 6,
        schema: z.string().uuid().optional(),
      }),

      // Response
      response: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title",
        description: "response.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { response: true },
        children: {
          messageId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.messageId.label",
            schema: z.string(),
          }),
          accountName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.accountName.label",
            schema: z.string(),
          }),
          channel: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.channel.label",
            schema: z.string(),
          }),
          provider: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.provider.label",
            schema: z.string(),
          }),
          sentAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.sentAt.label",
            schema: z.string(),
          }),
        },
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      email: {
        accountId: "00000000-0000-0000-0000-000000000001",
        to: "user@example.com",
        toName: "Jane Smith",
        subject: "Welcome!",
        text: "Hello Jane, welcome to Unbottled.",
        html: "<p>Hello Jane, welcome to <b>Unbottled</b>.</p>",
        senderName: "Unbottled",
        replyTo: "support@unbottled.ai",
        leadId: "00000000-0000-0000-0000-000000000002",
      },
      sms: {
        accountId: "00000000-0000-0000-0000-000000000003",
        to: "+12025551234",
        text: "Your verification code is 123456",
      },
    },
    responses: {
      default: {
        response: {
          messageId: "msg_abc123",
          accountName: "Primary SMTP",
          channel: "EMAIL",
          provider: "SMTP",
          sentAt: "2024-01-07T12:00:00.000Z",
        },
      },
    },
  },
});

export type MessengerSendRequestInput = typeof POST.types.RequestInput;
export type MessengerSendRequestOutput = typeof POST.types.RequestOutput;
export type MessengerSendResponseInput = typeof POST.types.ResponseInput;
export type MessengerSendResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
