/**
 * IMAP Folders List API Route Definition
 * Defines endpoint for listing IMAP folders with filtering and pagination
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestUrlParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../../user/user-roles/enum";
import {
  ImapFolderSortField,
  ImapFolderSortFieldOptions,
  ImapSpecialUseType,
  ImapSpecialUseTypeOptions,
  ImapSyncStatus,
  ImapSyncStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../../enum";

/**
 * Get IMAP Folders List Endpoint (GET)
 * Retrieves a paginated list of IMAP folders with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "imap-client", "folders", "list"],
  title: "app.api.v1.core.emails.imapClient.folders.list.title",
  description: "app.api.v1.core.emails.imapClient.folders.list.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.folders.list.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.folders.list.container.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // === URL PARAMETERS ===
      page: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.folders.list.page.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.page.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.page.placeholder",
        },
        z.coerce.number().min(1).default(1),
      ),

      limit: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.folders.list.limit.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.limit.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.limit.placeholder",
        },
        z.coerce.number().min(1).max(100).default(20),
      ),

      accountId: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.folders.list.accountId.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.accountId.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.accountId.placeholder",
        },
        z.uuid(),
      ),

      search: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.imapClient.folders.list.search.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.search.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.search.placeholder",
        },
        z.string().optional(),
      ),

      specialUseType: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.emails.imapClient.folders.list.specialUseType.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.specialUseType.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.specialUseType.placeholder",
          options: ImapSpecialUseTypeOptions,
        },
        z.array(z.enum(ImapSpecialUseType)).optional(),
      ),

      syncStatus: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.emails.imapClient.folders.list.syncStatus.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.syncStatus.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.syncStatus.placeholder",
          options: ImapSyncStatusOptions,
        },
        z.array(z.enum(ImapSyncStatus)).optional(),
      ),

      sortBy: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.emails.imapClient.folders.list.sortBy.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.sortBy.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.sortBy.placeholder",
          options: ImapFolderSortFieldOptions,
        },
        z
          .array(z.enum(ImapFolderSortField))
          .default([ImapFolderSortField.NAME]),
      ),

      sortOrder: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.emails.imapClient.folders.list.sortOrder.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.sortOrder.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.list.sortOrder.placeholder",
          options: SortOrderOptions,
        },
        z.array(z.enum(SortOrder)).default([SortOrder.ASC]),
      ),

      // === RESPONSE FIELDS ===
      folders: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "specialUseType",
          sortBy: "name",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.emails.imapClient.folders.list.response.folder.title",
            description:
              "app.api.v1.core.emails.imapClient.folders.list.response.folder.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.id",
              },
              z.uuid(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.name",
              },
              z.string(),
            ),
            displayName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.displayName",
              },
              z.string().nullable(),
            ),
            path: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.path",
              },
              z.string(),
            ),
            isSelectable: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.folders.list.response.folder.isSelectable",
              },
              z.boolean(),
            ),
            hasChildren: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.folders.list.response.folder.hasChildren",
              },
              z.boolean(),
            ),
            specialUseType: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.folders.list.response.folder.specialUseType",
              },
              z.enum(ImapSpecialUseType).nullable(),
            ),
            messageCount: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.messageCount",
              },
              z.number(),
            ),
            unseenCount: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.unseenCount",
              },
              z.number(),
            ),
            syncStatus: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.folders.list.response.folder.syncStatus",
              },
              z.enum(ImapSyncStatus),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.folders.list.response.folder.createdAt",
              },
              z.string(),
            ),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.folders.list.response.pagination.title",
          description:
            "app.api.v1.core.emails.imapClient.folders.list.response.pagination.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.folders.list.response.pagination.page",
            },
            z.number().int(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.folders.list.response.pagination.limit",
            },
            z.number().int(),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.folders.list.response.pagination.total",
            },
            z.number().int(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.folders.list.response.pagination.totalPages",
            },
            z.number().int(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.list.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.folders.list.success.title",
    description:
      "app.api.v1.core.emails.imapClient.folders.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: undefined,
    responses: {
      default: {
        folders: [
          {
            id: "456e7890-e89b-12d3-a456-426614174001",
            name: "INBOX",
            displayName: "Inbox",
            path: "INBOX",
            isSelectable: true,
            hasChildren: false,
            specialUseType: ImapSpecialUseType.INBOX,
            messageCount: 150,
            unseenCount: 12,
            syncStatus: ImapSyncStatus.SYNCED,
            createdAt: "2023-01-01T00:00:00.000Z",
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      },
    },
    urlPathVariables: {
      default: {
        accountId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapFoldersListRequestInput = typeof GET.types.RequestInput;
export type ImapFoldersListRequestOutput = typeof GET.types.RequestOutput;
export type ImapFoldersListResponseInput = typeof GET.types.ResponseInput;
export type ImapFoldersListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = {
  GET,
};

// Export individual endpoints
export { GET };
export default endpoints;
