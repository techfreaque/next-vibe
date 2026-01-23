/**
 * IMAP Message Detail API Route Definition
 * Defines endpoints for individual IMAP message operations (GET and PATCH by ID)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";

/**
 * GET endpoint for IMAP message by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "messages", "[id]"],
  title: "app.api.emails.imapClient.messages.id.get.title",
  description: "app.api.emails.imapClient.messages.id.get.description",
  category: "app.api.emails.category",
  icon: "message-square",
  tags: ["app.api.emails.imapClient.messages.id.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.messages.id.get.container.title",
      description:
        "app.api.emails.imapClient.messages.id.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAM FIELDS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.id.get.id.label",
        description: "app.api.emails.imapClient.messages.id.get.id.description",
        placeholder: "app.api.emails.imapClient.messages.id.get.id.placeholder",
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.messages.id.get.message.title",
          description:
            "app.api.emails.imapClient.messages.id.get.message.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.id.tag",
            schema: z.uuid(),
          }),
          subject: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string(),
          }),
          recipientEmail: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.email(),
          }),
          recipientName: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          senderEmail: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.email(),
          }),
          senderName: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          imapUid: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          imapMessageId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          imapFolderId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.uuid().optional(),
          }),
          accountId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.tags.accounts",
            schema: z.uuid(),
          }),
          bodyText: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          bodyHtml: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          headers: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.record(z.string(), z.string()).optional(),
          }),
          isRead: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          isFlagged: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          isDeleted: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          isDraft: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          isAnswered: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          inReplyTo: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          references: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          threadId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          messageSize: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          hasAttachments: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          attachmentCount: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          lastSyncAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          syncStatus: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          syncError: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          sentAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          receivedAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          folderName: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.string(),
          }),
          size: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.messages.id.get.errors.validation.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.notFound.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.messages.id.get.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.server.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.conflict.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.network.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.messages.id.get.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.get.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.id.get.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.messages.id.get.success.title",
    description:
      "app.api.emails.imapClient.messages.id.get.success.description",
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
  method: Methods.PATCH,
  path: ["emails", "imap-client", "messages", "[id]"],
  title: "app.api.emails.imapClient.messages.id.patch.title",
  description: "app.api.emails.imapClient.messages.id.patch.description",
  category: "app.api.emails.category",
  icon: "message-square",
  tags: ["app.api.emails.imapClient.messages.id.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.messages.id.patch.container.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAM FIELDS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.id.patch.id.label",
        description:
          "app.api.emails.imapClient.messages.id.patch.id.description",
        placeholder:
          "app.api.emails.imapClient.messages.id.patch.id.placeholder",
        schema: z.uuid(),
      }),

      // === REQUEST DATA FIELDS ===
      isRead: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.messages.id.patch.isRead.label",
        description:
          "app.api.emails.imapClient.messages.id.patch.isRead.description",
        schema: z.boolean().optional(),
      }),

      isFlagged: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.messages.id.patch.isFlagged.label",
        description:
          "app.api.emails.imapClient.messages.id.patch.isFlagged.description",
        schema: z.boolean().optional(),
      }),

      subject: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.id.patch.subject.label",
        description:
          "app.api.emails.imapClient.messages.id.patch.subject.description",
        placeholder:
          "app.api.emails.imapClient.messages.id.patch.subject.placeholder",
        schema: z.string().min(1).max(255).optional(),
      }),

      // === RESPONSE FIELDS ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.messages.id.patch.message.title",
          description:
            "app.api.emails.imapClient.messages.id.patch.message.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.id.tag",
            schema: z.uuid(),
          }),
          subject: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string(),
          }),
          recipientEmail: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.email(),
          }),
          recipientName: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          senderEmail: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.email(),
          }),
          senderName: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          imapUid: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          imapMessageId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          imapFolderId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.uuid().optional(),
          }),
          accountId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.tags.accounts",
            schema: z.uuid(),
          }),
          bodyText: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          bodyHtml: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          headers: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.record(z.string(), z.string()).optional(),
          }),
          isRead: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          isFlagged: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          isDeleted: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          isDraft: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          isAnswered: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean().optional(),
          }),
          inReplyTo: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          references: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          threadId: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          messageSize: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          hasAttachments: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.boolean(),
          }),
          attachmentCount: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
          lastSyncAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          syncStatus: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          syncError: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable().optional(),
          }),
          sentAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          receivedAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().nullable(),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.string().optional(),
          }),
          folderName: responseField({
            type: WidgetType.BADGE,
            text: "app.api.emails.imapClient.messages.tag",
            schema: z.string(),
          }),
          size: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.imapClient.messages.tag",
            schema: z.coerce.number().optional(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.validation.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.notFound.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.patch.errors.server.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.conflict.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.patch.errors.network.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.messages.id.patch.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.messages.id.patch.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.id.patch.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.messages.id.patch.success.title",
    description:
      "app.api.emails.imapClient.messages.id.patch.success.description",
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
