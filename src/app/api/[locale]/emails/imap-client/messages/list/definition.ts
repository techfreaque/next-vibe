/**
 * IMAP Messages List API Route Definition
 * Defines endpoint for listing IMAP messages with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
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
import { scopedTranslation } from "./i18n";
import { ImapMessagesListContainer } from "./widget";

/**
 * Get IMAP Messages List Endpoint (GET)
 * Retrieves a paginated list of IMAP messages with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "messages", "list"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.email",
  icon: "message-square",
  tags: ["tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapMessagesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST QUERY FIELDS ===
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label",
        description: "get.page.description",
        columns: 3,
        schema: z.coerce.number().int().positive().default(1),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.limit.label",
        description: "get.limit.description",
        columns: 3,
        schema: z.coerce.number().int().positive().max(100).default(20),
      }),

      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.accountId.label",
        description: "get.accountId.description",
        placeholder: "get.accountId.placeholder",
        columns: 6,
        schema: z.preprocess(
          (v) => (v === "" ? undefined : v),
          z.uuid().optional(),
        ),
      }),

      folderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.folderId.label",
        description: "get.folderId.description",
        placeholder: "get.folderId.placeholder",
        columns: 6,
        schema: z.preprocess(
          (v) => (v === "" ? undefined : v),
          z.uuid().optional(),
        ),
      }),

      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label",
        description: "get.search.description",
        placeholder: "get.search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.threadId.label",
        description: "get.threadId.description",
        placeholder: "get.threadId.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label",
        description: "get.status.description",
        options: ImapMessageStatusFilterOptions,
        columns: 4,
        schema: z.enum(ImapMessageStatusFilter).optional(),
      }),

      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.sortBy.label",
        description: "get.sortBy.description",
        options: ImapMessageSortFieldOptions,
        columns: 4,
        schema: z
          .enum(ImapMessageSortField)
          .default(ImapMessageSortField.SENT_AT),
      }),

      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.sortOrder.label",
        description: "get.sortOrder.description",
        options: SortOrderOptions,
        columns: 4,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateFrom.label",
        description: "get.dateFrom.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateTo.label",
        description: "get.dateTo.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.message.title",
          description: "get.response.message.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.id",
              schema: z.string(),
            }),
            subject: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.subject",
              schema: z.string(),
            }),
            senderEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.senderEmail",
              schema: z.string(),
            }),
            senderName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.senderName",
              schema: z.string().nullable(),
            }),
            isRead: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.message.isRead",
              schema: z.boolean(),
            }),
            isFlagged: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.message.isFlagged",
              schema: z.boolean(),
            }),
            hasAttachments: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.message.hasAttachments",
              schema: z.boolean(),
            }),
            sentAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.sentAt",
              schema: z.string().nullable(),
            }),
            headers: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.message.headers",
              schema: z.record(z.string(), z.string()).optional(),
            }),
          },
        }),
      }),

      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.coerce.number(),
      }),

      pageNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.page",
        schema: z.coerce.number(),
      }),

      pageLimit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limit",
        schema: z.coerce.number(),
      }),

      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages",
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
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
    title: "get.success.title",
    description: "get.success.description",
  },
});

// Export types following migration guide pattern
export type ImapMessagesListGetRequestInput = typeof GET.types.RequestInput;
export type ImapMessagesListGetRequestOutput = typeof GET.types.RequestOutput;
export type ImapMessagesListGetResponseInput = typeof GET.types.ResponseInput;
export type ImapMessagesListGetResponseOutput = typeof GET.types.ResponseOutput;

// Export individual message type from the array
export type ImapMessageResponseType =
  ImapMessagesListGetResponseOutput["messages"][number];

/**
 * Export definitions
 */
const definitions = {
  GET,
} as const;
export default definitions;
