/**
 * IMAP Message Detail API Route Definition
 * Defines endpoints for individual IMAP message operations (GET and PATCH by ID)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { ImapMessageDetailContainer } from "./widget";

/**
 * GET endpoint for IMAP message by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "messages", "[id]"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.email",
  icon: "message-square",
  tags: ["tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapMessageDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "urlPathParams", response: true },
      }),

      // === URL PARAM FIELDS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label",
        description: "get.id.description",
        placeholder: "get.id.placeholder",
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      message: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title",
        description: "get.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "tag",
            schema: z.uuid(),
          }),
          subject: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          recipientEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          recipientName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          senderEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          senderName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          imapUid: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          imapMessageId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          imapFolderId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.uuid().optional(),
          }),
          accountId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "tags.accounts",
            schema: z.uuid().optional(),
          }),
          bodyText: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          bodyHtml: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          headers: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.record(z.string(), z.string()).optional(),
          }),
          isRead: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          isFlagged: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          isDeleted: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          isDraft: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          isAnswered: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          inReplyTo: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          references: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          threadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          messageSize: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          hasAttachments: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          attachmentCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          lastSyncAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          syncStatus: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.string().optional(),
          }),
          syncError: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          sentAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          receivedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          folderName: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.string(),
          }),
          size: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        message: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          subject: "Important Meeting Tomorrow",
          recipientEmail: "user@example.com",
          recipientName: "John Doe",
          senderEmail: "sender@example.com",
          senderName: "Jane Smith",
          imapUid: 1001,
          imapMessageId: "<message-id@example.com>",
          imapFolderId: "456e7890-e89b-12d3-a456-426614174001",
          accountId: "789e0123-e89b-12d3-a456-426614174002",
          bodyText: "Please join us for the important meeting tomorrow...",
          bodyHtml:
            "<p>Please join us for the important meeting tomorrow...</p>",
          headers: {
            "Message-ID": "<message-id@example.com>",
            Date: "Mon, 1 Jan 2023 10:00:00 +0000",
          },
          isRead: false,
          isFlagged: true,
          isDeleted: false,
          isDraft: false,
          isAnswered: false,
          inReplyTo: null,
          references: null,
          threadId: "thread-123",
          messageSize: 2048,
          hasAttachments: true,
          attachmentCount: 2,
          lastSyncAt: "2023-01-01T00:00:00.000Z",
          syncStatus: "SYNCED",
          syncError: null,
          sentAt: "2023-01-01T10:00:00.000Z",
          receivedAt: "2023-01-01T10:05:00.000Z",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
          folderName: "INBOX",
          size: 2048,
        },
      },
    },
  },
});

/**
 * PATCH endpoint for updating IMAP message
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["emails", "imap-client", "messages", "[id]"],
  title: "patch.title",
  description: "patch.description",
  category: "app.endpointCategories.email",
  icon: "message-square",
  tags: ["tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title",
    description: "patch.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAM FIELDS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.id.label",
        description: "patch.id.description",
        placeholder: "patch.id.placeholder",
        schema: z.uuid(),
      }),

      // === REQUEST DATA FIELDS ===
      isRead: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isRead.label",
        description: "patch.isRead.description",
        schema: z.boolean().optional(),
      }),

      isFlagged: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isFlagged.label",
        description: "patch.isFlagged.description",
        schema: z.boolean().optional(),
      }),

      subject: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.subject.label",
        description: "patch.subject.description",
        placeholder: "patch.subject.placeholder",
        schema: z.string().min(1).max(255).optional(),
      }),

      // === RESPONSE FIELDS ===
      message: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title",
        description: "patch.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "tag",
            schema: z.uuid(),
          }),
          subject: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          recipientEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          recipientName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          senderEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string(),
          }),
          senderName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          imapUid: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          imapMessageId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          imapFolderId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.uuid().optional(),
          }),
          accountId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "tags.accounts",
            schema: z.uuid().optional(),
          }),
          bodyText: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          bodyHtml: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          headers: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.record(z.string(), z.string()).optional(),
          }),
          isRead: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          isFlagged: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          isDeleted: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          isDraft: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          isAnswered: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean().optional(),
          }),
          inReplyTo: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          references: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          threadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          messageSize: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          hasAttachments: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.boolean(),
          }),
          attachmentCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
          lastSyncAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          syncStatus: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.string().optional(),
          }),
          syncError: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable().optional(),
          }),
          sentAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          receivedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().nullable(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.string().optional(),
          }),
          folderName: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "messages.tag",
            schema: z.string(),
          }),
          size: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "messages.tag",
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        isRead: true,
        isFlagged: false,
        subject: "Updated Subject",
      },
    },
    responses: {
      default: {
        message: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          subject: "Updated Subject",
          recipientEmail: "user@example.com",
          recipientName: "John Doe",
          senderEmail: "sender@example.com",
          senderName: "Jane Smith",
          imapUid: 1001,
          imapMessageId: "<message-id@example.com>",
          imapFolderId: "456e7890-e89b-12d3-a456-426614174001",
          accountId: "789e0123-e89b-12d3-a456-426614174002",
          bodyText: "Please join us for the important meeting tomorrow...",
          bodyHtml:
            "<p>Please join us for the important meeting tomorrow...</p>",
          headers: {
            "Message-ID": "<message-id@example.com>",
            Date: "Mon, 1 Jan 2023 10:00:00 +0000",
          },
          isRead: true,
          isFlagged: false,
          isDeleted: false,
          isDraft: false,
          isAnswered: false,
          inReplyTo: null,
          references: null,
          threadId: "thread-123",
          messageSize: 2048,
          hasAttachments: true,
          attachmentCount: 2,
          lastSyncAt: "2023-01-01T00:00:00.000Z",
          syncStatus: "SYNCED",
          syncError: null,
          sentAt: "2023-01-01T10:00:00.000Z",
          receivedAt: "2023-01-01T10:05:00.000Z",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T12:00:00.000Z",
          folderName: "INBOX",
          size: 2048,
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapMessageByIdRequestInput = typeof GET.types.RequestInput;
export type ImapMessageByIdRequestOutput = typeof GET.types.RequestOutput;
export type ImapMessageByIdResponseInput = typeof GET.types.ResponseInput;
export type ImapMessageByIdResponseOutput = typeof GET.types.ResponseOutput;

export type ImapMessageUpdateRequestInput = typeof PATCH.types.RequestInput;
export type ImapMessageUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type ImapMessageUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type ImapMessageUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const imapMessageEndpoints = {
  GET,
  PATCH,
} as const;
export default imapMessageEndpoints;
