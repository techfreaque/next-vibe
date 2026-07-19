/**
 * Unified Inbox List API Definition
 * Lists messages from any account/folder via the MessengerProvider interface.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { MESSENGER_INBOX_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "inbox", "list"],
  aliases: [MESSENGER_INBOX_ALIAS] as const,
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "messenger",
  subCategory: "Inbox",
  icon: "inbox",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        columns: 6,
        schema: z.string().uuid(),
      }),

      folderPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "folderPath.label",
        description: "folderPath.description",
        placeholder: "folderPath.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            uid: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.uid.label",
              schema: z.number().int(),
            }),
            messageId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.messageId.label",
              schema: z.string(),
            }),
            subject: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.subject.label",
              schema: z.string(),
            }),
            from: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.from.label",
              schema: z.string(),
            }),
            to: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.to.label",
              schema: z.string(),
            }),
            date: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.date.label",
              schema: z.coerce.date(),
            }),
            isRead: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "messages.isRead.label",
              schema: z.boolean(),
            }),
            isFlagged: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "messages.isFlagged.label",
              schema: z.boolean(),
            }),
            folderPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.folderPath.label",
              schema: z.string().optional(),
            }),
            bodyText: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "messages.bodyText.label",
              schema: z.string().optional(),
            }),
          },
        }),
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
      default: {
        accountId: "00000000-0000-0000-0000-000000000001",
        folderPath: "INBOX",
      },
    },
    responses: {
      default: {
        messages: [
          {
            uid: 1,
            messageId: "msg_abc123",
            subject: "Hello World",
            from: "sender@example.com",
            to: "me@example.com",
            date: new Date("2024-01-07T12:00:00.000Z"),
            isRead: false,
            isFlagged: false,
            folderPath: "INBOX",
            bodyText: "Hello!",
          },
        ],
      },
    },
  },
});

export type InboxListRequestInput = typeof GET.types.RequestInput;
export type InboxListRequestOutput = typeof GET.types.RequestOutput;
export type InboxListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
