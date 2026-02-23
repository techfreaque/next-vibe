/**
 * IMAP Accounts List API Route Definition
 * Defines endpoint for listing IMAP accounts with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
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
import { scopedTranslation } from "./i18n";
import { ImapAccountsListContainer } from "./widget";

/**
 * Get IMAP Accounts List Endpoint (GET)
 * Retrieves a paginated list of IMAP accounts with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "accounts", "list"],
  title: "title",
  description: "description",
  category: "category",
  tags: ["tags.accounts"],

  icon: "inbox",
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS ===
      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        placeholder: "fields.page.placeholder",
        columns: 2,
        schema: z.coerce.number().min(1).default(1),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        placeholder: "fields.limit.placeholder",
        columns: 2,
        schema: z.coerce.number().min(1).max(100).default(20),
      }),

      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.search.label",
        description: "fields.search.description",
        placeholder: "fields.search.placeholder",
        columns: 4,
        schema: z.string().optional(),
      }),

      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        placeholder: "fields.status.placeholder",
        options: ImapAccountStatusFilterOptions,
        columns: 2,
        schema: z
          .enum(ImapAccountStatusFilter)
          .default(ImapAccountStatusFilter.ALL),
      }),

      enabled: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enabled.label",
        description: "fields.enabled.description",
        columns: 2,
        schema: z.boolean().optional(),
      }),

      sortBy: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortBy.label",
        description: "fields.sortBy.description",
        placeholder: "fields.sortBy.placeholder",
        options: ImapAccountSortFieldOptions,
        columns: 2,
        schema: z
          .enum(ImapAccountSortField)
          .default(ImapAccountSortField.CREATED_AT),
      }),

      sortOrder: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortOrder.label",
        description: "fields.sortOrder.description",
        placeholder: "fields.sortOrder.placeholder",
        options: SortOrderOptions,
        columns: 2,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===
      accounts: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        sortBy: "name",
        columns: 12,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.id",
              schema: z.uuid(),
            }),
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.name",
              schema: z.string(),
            }),
            email: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.email",
              schema: z.email(),
            }),
            host: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.host",
              schema: z.string(),
            }),
            port: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.port",
              schema: z.coerce.number(),
            }),
            secure: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.secure",
              schema: z.boolean(),
            }),
            username: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.username",
              schema: z.string(),
            }),
            authMethod: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.authMethod",
              schema: z.enum(ImapAuthMethod),
            }),
            connectionTimeout: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.connectionTimeout",
              schema: z.coerce.number(),
            }),
            keepAlive: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.keepAlive",
              schema: z.boolean(),
            }),
            enabled: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.enabled",
              schema: z.boolean(),
            }),
            syncInterval: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.syncInterval",
              schema: z.coerce.number(),
            }),
            maxMessages: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.maxMessages",
              schema: z.coerce.number(),
            }),
            syncFolders: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.syncFolders",
              schema: z.array(z.string()),
            }),
            lastSyncAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.lastSyncAt",
              schema: z.string().nullable(),
            }),
            syncStatus: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.syncStatus",
              schema: z.enum(ImapSyncStatus),
            }),
            syncError: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.syncError",
              schema: z.string().nullable(),
            }),
            isConnected: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.accounts.item.isConnected",
              schema: z.boolean(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.createdAt",
              schema: z.string(),
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.accounts.item.updatedAt",
              schema: z.string(),
            }),
          },
        }),
      }),

      pagination: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.pagination.title",
        description: "response.pagination.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          page: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.page",
            schema: z.coerce.number(),
          }),
          limit: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.limit",
            schema: z.coerce.number(),
          }),
          total: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.total",
            schema: z.coerce.number(),
          }),
          totalPages: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.totalPages",
            schema: z.coerce.number(),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
            host: "imap.gmail.com",
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
