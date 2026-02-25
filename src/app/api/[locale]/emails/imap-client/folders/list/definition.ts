/**
 * IMAP Folders List API Route Definition
 * Defines endpoint for listing IMAP folders with filtering and pagination
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
  ImapFolderSortField,
  ImapFolderSortFieldOptions,
  ImapSpecialUseType,
  ImapSpecialUseTypeOptions,
  ImapSyncStatus,
  ImapSyncStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { ImapFoldersListContainer } from "./widget";

/**
 * Get IMAP Folders List Endpoint (GET)
 * Retrieves a paginated list of IMAP folders with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "folders", "list"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  icon: "folder",
  tags: ["tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapFoldersListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === URL PARAMETERS ===
      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "page.label",
        description: "page.description",
        placeholder: "page.placeholder",
        schema: z.coerce.number().min(1).default(1),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "limit.label",
        description: "limit.description",
        placeholder: "limit.placeholder",
        schema: z.coerce.number().min(1).max(100).default(20),
      }),

      accountId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        schema: z.preprocess(
          (v) => (v === "" ? undefined : v),
          z.uuid().optional(),
        ),
      }),

      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.label",
        description: "search.description",
        placeholder: "search.placeholder",
        schema: z.string().optional(),
      }),

      specialUseType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "specialUseType.label",
        description: "specialUseType.description",
        placeholder: "specialUseType.placeholder",
        options: ImapSpecialUseTypeOptions,
        schema: z.array(z.enum(ImapSpecialUseType)).optional(),
      }),

      syncStatus: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "syncStatus.label",
        description: "syncStatus.description",
        placeholder: "syncStatus.placeholder",
        options: ImapSyncStatusOptions,
        schema: z.array(z.enum(ImapSyncStatus)).optional(),
      }),

      sortBy: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortBy.label",
        description: "sortBy.description",
        placeholder: "sortBy.placeholder",
        options: ImapFolderSortFieldOptions,
        schema: z.enum(ImapFolderSortField).default(ImapFolderSortField.NAME),
      }),

      sortOrder: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortOrder.label",
        description: "sortOrder.description",
        placeholder: "sortOrder.placeholder",
        options: SortOrderOptions,
        schema: z.enum(SortOrder).default(SortOrder.ASC),
      }),

      // === RESPONSE FIELDS ===
      folders: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        sortBy: "name",
        columns: 12,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "response.folder.title",
          description: "response.folder.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.id",
              schema: z.uuid(),
            }),
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.name",
              schema: z.string(),
            }),
            displayName: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.displayName",
              schema: z.string().nullable(),
            }),
            path: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.path",
              schema: z.string(),
            }),
            isSelectable: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.folder.isSelectable",
              schema: z.boolean(),
            }),
            hasChildren: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.folder.hasChildren",
              schema: z.boolean(),
            }),
            specialUseType: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.folder.specialUseType",
              schema: z.enum(ImapSpecialUseType).nullable(),
            }),
            messageCount: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.messageCount",
              schema: z.coerce.number(),
            }),
            unseenCount: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.unseenCount",
              schema: z.coerce.number(),
            }),
            syncStatus: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.folder.syncStatus",
              schema: z.enum(ImapSyncStatus),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.folder.createdAt",
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
            schema: z.coerce.number().int(),
          }),
          limit: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.limit",
            schema: z.coerce.number().int(),
          }),
          total: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.total",
            schema: z.coerce.number().int(),
          }),
          totalPages: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.totalPages",
            schema: z.coerce.number().int(),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  // === EXAMPLES ===
  examples: {
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
    requests: {
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
} as const;
export default endpoints;
