/**
 * IMAP Accounts List API Route Definition
 * Defines endpoint for listing IMAP accounts with filtering and pagination
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  ImapAccountSortField,
  ImapAccountSortFieldOptions,
  ImapAccountStatusFilter,
  ImapAccountStatusFilterOptions,
  ImapAuthMethod,
  ImapSpecialUseType,
  ImapSyncStatus,
  SortOrder,
  SortOrderOptions,
} from "../../enum";

/**
 * Get IMAP Accounts List Endpoint (GET)
 * Retrieves a paginated list of IMAP accounts with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "imap-client", "accounts", "list"],
  title: "app.api.v1.core.emails.imapClient.accounts.list.title",
  description: "app.api.v1.core.emails.imapClient.accounts.list.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.accounts.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.accounts.list.container.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.page.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.page.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.page.placeholder",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).default(1),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.limit.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.limit.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.limit.placeholder",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).max(100).default(20),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.search.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.search.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.search.placeholder",
          layout: { columns: 4 },
        },
        z.string().optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.status.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.status.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.status.placeholder",
          options: ImapAccountStatusFilterOptions,
          layout: { columns: 2 },
        },
        z
          .nativeEnum(ImapAccountStatusFilter)
          .default(ImapAccountStatusFilter.ALL),
      ),

      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.enabled.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.enabled.description",
          layout: { columns: 2 },
        },
        z.boolean().optional(),
      ),

      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortBy.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortBy.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortBy.placeholder",
          options: ImapAccountSortFieldOptions,
          layout: { columns: 2 },
        },
        z
          .nativeEnum(ImapAccountSortField)
          .default(ImapAccountSortField.CREATED_AT),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortOrder.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortOrder.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.list.fields.sortOrder.placeholder",
          options: SortOrderOptions,
          layout: { columns: 2 },
        },
        z.nativeEnum(SortOrder).default(SortOrder.DESC),
      ),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "status",
          sortBy: "name",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.title",
            description:
              "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.id",
              },
              z.uuid(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.name",
              },
              z.string(),
            ),
            email: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.email",
              },
              z.email(),
            ),
            host: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.host",
              },
              z.string(),
            ),
            port: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.port",
              },
              z.number(),
            ),
            secure: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.secure",
              },
              z.boolean(),
            ),
            username: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.username",
              },
              z.string(),
            ),
            authMethod: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.authMethod",
              },
              z.nativeEnum(ImapAuthMethod),
            ),
            connectionTimeout: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.connectionTimeout",
              },
              z.number(),
            ),
            keepAlive: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.keepAlive",
              },
              z.boolean(),
            ),
            enabled: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.enabled",
              },
              z.boolean(),
            ),
            syncInterval: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.syncInterval",
              },
              z.number(),
            ),
            maxMessages: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.maxMessages",
              },
              z.number(),
            ),
            syncFolders: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.syncFolders",
              },
              z.array(z.string()),
            ),
            lastSyncAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.lastSyncAt",
              },
              z.string().nullable(),
            ),
            syncStatus: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.syncStatus",
              },
              z.nativeEnum(ImapSyncStatus),
            ),
            syncError: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.syncError",
              },
              z.string().nullable(),
            ),
            isConnected: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.isConnected",
              },
              z.boolean(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.createdAt",
              },
              z.string(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.accounts.list.response.accounts.item.updatedAt",
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
            "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.page",
            },
            z.coerce.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.limit",
            },
            z.coerce.number(),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.total",
            },
            z.coerce.number(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.list.response.pagination.totalPages",
            },
            z.coerce.number(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.notFound.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unsaved.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.conflict.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.network.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.list.errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.accounts.list.success.title",
    description:
      "app.api.v1.core.emails.imapClient.accounts.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        page: 1,
        limit: 20,
        search: "gmail",
        status: ImapAccountStatusFilter.ENABLED,
        enabled: true,
        sortBy: ImapAccountSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    },
    responses: {
      default: {
        accounts: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Gmail Account",
            email: "user@gmail.com",
            host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
            port: 993,
            secure: true,
            username: "user@gmail.com",
            authMethod: ImapAuthMethod.PLAIN,
            connectionTimeout: 30000,
            keepAlive: true,
            enabled: true,
            syncInterval: 300,
            maxMessages: 1000,
            syncFolders: [ImapSpecialUseType.INBOX, ImapSpecialUseType.SENT],
            lastSyncAt: "2023-01-01T00:00:00.000Z",
            syncStatus: ImapSyncStatus.SYNCED,
            syncError: null,
            isConnected: true,
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapAccountsListRequestInput = typeof GET.types.RequestInput;
export type ImapAccountsListRequestOutput = typeof GET.types.RequestOutput;
export type ImapAccountsListResponseInput = typeof GET.types.ResponseInput;
export type ImapAccountsListResponseOutput = typeof GET.types.ResponseOutput;

// Export individual endpoints
export { GET };

const definitions = {
  GET,
};

export default definitions;
