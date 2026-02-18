/**
 * IMAP Accounts List API Route Definition
 * Defines endpoint for listing IMAP accounts with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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
import { ImapAccountsListContainer } from "./widget";

/**
 * Get IMAP Accounts List Endpoint (GET)
 * Retrieves a paginated list of IMAP accounts with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "accounts", "list"],
  title: "app.api.emails.imapClient.accounts.list.title",
  description: "app.api.emails.imapClient.accounts.list.description",
  category: "app.api.emails.category",
  tags: ["app.api.emails.imapClient.accounts.tag"],

  icon: "inbox",
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === REQUEST FIELDS ===
      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.accounts.list.fields.page.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.page.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.page.placeholder",
        columns: 2,
        schema: z.coerce.number().min(1).default(1),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.accounts.list.fields.limit.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.limit.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.limit.placeholder",
        columns: 2,
        schema: z.coerce.number().min(1).max(100).default(20),
      }),

      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.accounts.list.fields.search.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.search.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.search.placeholder",
        columns: 4,
        schema: z.string().optional(),
      }),

      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.imapClient.accounts.list.fields.status.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.status.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.status.placeholder",
        options: ImapAccountStatusFilterOptions,
        columns: 2,
        schema: z
          .enum(ImapAccountStatusFilter)
          .default(ImapAccountStatusFilter.ALL),
      }),

      enabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.accounts.list.fields.enabled.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.enabled.description",
        columns: 2,
        schema: z.boolean().optional(),
      }),

      sortBy: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.imapClient.accounts.list.fields.sortBy.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.sortBy.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.sortBy.placeholder",
        options: ImapAccountSortFieldOptions,
        columns: 2,
        schema: z
          .enum(ImapAccountSortField)
          .default(ImapAccountSortField.CREATED_AT),
      }),

      sortOrder: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.imapClient.accounts.list.fields.sortOrder.label",
        description:
          "app.api.emails.imapClient.accounts.list.fields.sortOrder.description",
        placeholder:
          "app.api.emails.imapClient.accounts.list.fields.sortOrder.placeholder",
        options: SortOrderOptions,
        columns: 2,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          sortBy: "name",
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.id",
              schema: z.uuid(),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.name",
              schema: z.string(),
            }),
            email: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.email",
              schema: z.email(),
            }),
            host: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.host",
              schema: z.string(),
            }),
            port: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.port",
              schema: z.coerce.number(),
            }),
            secure: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.secure",
              schema: z.boolean(),
            }),
            username: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.username",
              schema: z.string(),
            }),
            authMethod: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.authMethod",
              schema: z.enum(ImapAuthMethod),
            }),
            connectionTimeout: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.connectionTimeout",
              schema: z.coerce.number(),
            }),
            keepAlive: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.keepAlive",
              schema: z.boolean(),
            }),
            enabled: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.enabled",
              schema: z.boolean(),
            }),
            syncInterval: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.syncInterval",
              schema: z.coerce.number(),
            }),
            maxMessages: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.maxMessages",
              schema: z.coerce.number(),
            }),
            syncFolders: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.syncFolders",
              schema: z.array(z.string()),
            }),
            lastSyncAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.lastSyncAt",
              schema: z.string().nullable(),
            }),
            syncStatus: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.syncStatus",
              schema: z.enum(ImapSyncStatus),
            }),
            syncError: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.syncError",
              schema: z.string().nullable(),
            }),
            isConnected: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.list.response.accounts.item.isConnected",
              schema: z.boolean(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.createdAt",
              schema: z.string(),
            }),
            updatedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.list.response.accounts.item.updatedAt",
              schema: z.string(),
            }),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.imapClient.accounts.list.response.pagination.title",
          description:
            "app.api.emails.imapClient.accounts.list.response.pagination.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          page: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.accounts.list.response.pagination.page",
            schema: z.coerce.number(),
          }),
          limit: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.accounts.list.response.pagination.limit",
            schema: z.coerce.number(),
          }),
          total: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.accounts.list.response.pagination.total",
            schema: z.coerce.number(),
          }),
          totalPages: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.accounts.list.response.pagination.totalPages",
            schema: z.coerce.number(),
          }),
        },
      ),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.imapClient.accounts.list.errors.validation.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.accounts.list.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.accounts.list.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.accounts.list.errors.notFound.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.accounts.list.errors.server.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.accounts.list.errors.unknown.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.accounts.list.errors.unsaved.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.accounts.list.errors.conflict.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.accounts.list.errors.network.title",
      description:
        "app.api.emails.imapClient.accounts.list.errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.imapClient.accounts.list.success.title",
    description: "app.api.emails.imapClient.accounts.list.success.description",
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
            host: "app.api.emails.imapClient.imap.gmail.com",
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

const definitions = {
  GET,
} as const;
export default definitions;
