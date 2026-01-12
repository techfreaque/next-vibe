/**
 * IMAP Messages List API Route Definition
 * Defines endpoint for listing IMAP messages with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import {
  ImapMessageSortField,
  ImapMessageSortFieldOptions,
  ImapMessageStatusFilter,
  ImapMessageStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../../enum";

/**
 * Get IMAP Messages List Endpoint (GET)
 * Retrieves a paginated list of IMAP messages with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "messages", "list"],
  title: "app.api.emails.imapClient.messages.list.get.title",
  description: "app.api.emails.imapClient.messages.list.get.description",
  category: "app.api.emails.category",
  icon: "message-square",
  tags: ["app.api.emails.imapClient.messages.list.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.messages.list.get.container.title",
      description: "app.api.emails.imapClient.messages.list.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST QUERY FIELDS ===
      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.emails.imapClient.messages.list.get.page.label",
          description: "app.api.emails.imapClient.messages.list.get.page.description",
          columns: 3,
        },
        z.coerce.number().int().positive().default(1),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.emails.imapClient.messages.list.get.limit.label",
          description: "app.api.emails.imapClient.messages.list.get.limit.description",
          columns: 3,
        },
        z.coerce.number().int().positive().max(100).default(20),
      ),

      accountId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.messages.list.get.accountId.label",
          description: "app.api.emails.imapClient.messages.list.get.accountId.description",
          placeholder: "app.api.emails.imapClient.messages.list.get.accountId.placeholder",
          columns: 6,
        },
        z.uuid(),
      ),

      folderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.messages.list.get.folderId.label",
          description: "app.api.emails.imapClient.messages.list.get.folderId.description",
          placeholder: "app.api.emails.imapClient.messages.list.get.folderId.placeholder",
          columns: 6,
        },
        z.uuid().optional(),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.messages.list.get.search.label",
          description: "app.api.emails.imapClient.messages.list.get.search.description",
          placeholder: "app.api.emails.imapClient.messages.list.get.search.placeholder",
          columns: 12,
        },
        z.string().optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.emails.imapClient.messages.list.get.status.label",
          description: "app.api.emails.imapClient.messages.list.get.status.description",
          options: ImapMessageStatusFilterOptions,
          columns: 4,
        },
        z.enum(ImapMessageStatusFilter).optional(),
      ),

      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.emails.imapClient.messages.list.get.sortBy.label",
          description: "app.api.emails.imapClient.messages.list.get.sortBy.description",
          options: ImapMessageSortFieldOptions,
          columns: 4,
        },
        z.nativeEnum(ImapMessageSortField).default(ImapMessageSortField.SENT_AT),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.emails.imapClient.messages.list.get.sortOrder.label",
          description: "app.api.emails.imapClient.messages.list.get.sortOrder.description",
          options: SortOrderOptions,
          columns: 4,
        },
        z.enum(SortOrder).default(SortOrder.DESC),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.emails.imapClient.messages.list.get.dateFrom.label",
          description: "app.api.emails.imapClient.messages.list.get.dateFrom.description",
          columns: 6,
        },
        z.string().optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.emails.imapClient.messages.list.get.dateTo.label",
          description: "app.api.emails.imapClient.messages.list.get.dateTo.description",
          columns: 6,
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      messages: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.emails.imapClient.messages.list.get.response.message.title",
            description: "app.api.emails.imapClient.messages.list.get.response.message.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.id",
              },
              z.string(),
            ),
            subject: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.subject",
              },
              z.string(),
            ),
            senderEmail: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.senderEmail",
              },
              z.string(),
            ),
            senderName: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.senderName",
              },
              z.string().nullable(),
            ),
            isRead: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.messages.list.get.response.message.isRead",
              },
              z.boolean(),
            ),
            isFlagged: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.messages.list.get.response.message.isFlagged",
              },
              z.boolean(),
            ),
            hasAttachments: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.messages.list.get.response.message.hasAttachments",
              },
              z.boolean(),
            ),
            sentAt: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.sentAt",
              },
              z.string().nullable(),
            ),
            headers: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.emails.imapClient.messages.list.get.response.message.headers",
              },
              z.record(z.string(), z.string()).optional(),
            ),
          },
        ),
      ),

      total: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.imapClient.messages.list.get.response.total",
        },
        z.coerce.number(),
      ),

      pageNumber: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.imapClient.messages.list.get.response.page",
        },
        z.coerce.number(),
      ),

      pageLimit: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.imapClient.messages.list.get.response.limit",
        },
        z.coerce.number(),
      ),

      totalPages: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.imapClient.messages.list.get.response.totalPages",
        },
        z.coerce.number(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.validation.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.unauthorized.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.forbidden.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.notFound.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.conflict.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.server.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.network.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.unsavedChanges.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.messages.list.get.errors.unknown.title",
      description: "app.api.emails.imapClient.messages.list.get.errors.unknown.description",
    },
  },

  examples: {
    requests: {
      default: {
        page: 1,
        limit: 20,
        accountId: "123e4567-e89b-12d3-a456-426614174000",
        folderId: "456e7890-e89b-12d3-a456-426614174001",
        search: "",
        status: ImapMessageStatusFilter.UNREAD,
        sortBy: ImapMessageSortField.SENT_AT,
        sortOrder: SortOrder.DESC,
      },
    },
    responses: {
      default: {
        messages: [
          {
            id: "789e0123-e89b-12d3-a456-426614174002",
            subject: "Test Email",
            senderEmail: "sender@example.com",
            senderName: "John Doe",
            isRead: false,
            isFlagged: true,
            hasAttachments: true,
            sentAt: "2024-01-15T10:30:00Z",
          },
        ],
        total: 50,
        pageNumber: 1,
        pageLimit: 20,
        totalPages: 3,
      },
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.messages.list.get.success.title",
    description: "app.api.emails.imapClient.messages.list.get.success.description",
  },
});

// Export types following migration guide pattern
export type ImapMessagesListGetRequestInput = typeof GET.types.RequestInput;
export type ImapMessagesListGetRequestOutput = typeof GET.types.RequestOutput;
export type ImapMessagesListGetResponseInput = typeof GET.types.ResponseInput;
export type ImapMessagesListGetResponseOutput = typeof GET.types.ResponseOutput;

// Export individual message type from the array
export type ImapMessageResponseType = ImapMessagesListGetResponseOutput["messages"][number];

/**
 * Export definitions
 */
const definitions = {
  GET,
} as const;
export default definitions;
