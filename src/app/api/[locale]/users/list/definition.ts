/**
 * Users List API Route Definition
 * Following the exact pattern from leads/list/definition.ts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  objectOptionalField,
  requestField,
  requestResponseField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  SortOrder,
  SortOrderOptions,
  UserRoleFilter,
  UserRoleFilterOptions,
  UserSortField,
  UserSortFieldOptions,
  UserStatusFilter,
  UserStatusFilterOptions,
} from "../enum";
import { USERS_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { UsersListContainer } from "./widget";

/**
 * Get Users List Endpoint (GET)
 * Retrieves a paginated list of users with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "list"],
  aliases: [USERS_LIST_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "users",
  category: "endpointCategories.userManagement",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: UsersListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      // === SEARCH & FILTERS ===
      searchFilters: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.searchFilters.title" as const,
        description: "get.searchFilters.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        order: 1,
        usage: { request: "data" },
        children: {
          search: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "get.search.label" as const,
            description: "get.search.description" as const,
            placeholder: "get.search.placeholder" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
          status: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "get.status.label" as const,
            description: "get.status.description" as const,
            placeholder: "get.status.placeholder" as const,
            options: UserStatusFilterOptions,
            columns: 6,
            schema: z.array(z.enum(UserStatusFilter)).optional(),
          }),
          role: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "get.role.label" as const,
            description: "get.role.description" as const,
            placeholder: "get.role.placeholder" as const,
            options: UserRoleFilterOptions,
            columns: 6,
            schema: z.array(z.enum(UserRoleFilter)).optional(),
          }),
        },
      }),

      // === SORTING OPTIONS ===
      sortingOptions: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.sortingOptions.title" as const,
        description: "get.sortingOptions.description" as const,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 2,
        usage: { request: "data" },
        children: {
          sortBy: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.sortBy.label" as const,
            description: "get.sortBy.description" as const,
            placeholder: "get.sortBy.placeholder" as const,
            options: UserSortFieldOptions,
            columns: 6,
            schema: z.enum(UserSortField).default(UserSortField.CREATED_AT),
          }),
          sortOrder: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.sortOrder.label" as const,
            description: "get.sortOrder.description" as const,
            placeholder: "get.sortOrder.placeholder" as const,
            options: SortOrderOptions,
            columns: 6,
            schema: z.enum(SortOrder).default(SortOrder.DESC),
          }),
        },
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 2.5,
        usage: { request: "data" },
      }),

      // === RESPONSE FIELDS ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title" as const,
        description: "get.response.description" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        order: 3,
        usage: { response: true },
        children: {
          users: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.users.email" as const,
                  schema: z.string(),
                }),
                privateName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.users.privateName" as const,
                  schema: z.string(),
                }),
                publicName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.users.publicName" as const,
                  schema: z.string(),
                }),
                isActive: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.users.isActive" as const,
                  schema: z.boolean(),
                }),
                emailVerified: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.users.emailVerified" as const,
                  schema: z.boolean(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.users.createdAt" as const,
                  schema: z.coerce.date(),
                }),
                updatedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.users.updatedAt" as const,
                  schema: z.coerce.date(),
                }),
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.users.id" as const,
                  schema: z.string(),
                }),
              },
            }),
          }),
        },
      }),

      // === PAGINATION INFO (Editable controls + display in one row) ===
      paginationInfo: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.HORIZONTAL,
        noCard: true,
        gap: "4",
        order: 4,
        usage: { request: "data", response: true },
        children: {
          page: requestResponseField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "get.page.label" as const,
            columns: 3,
            schema: z.coerce.number().optional().default(1),
          }),
          limit: requestResponseField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "get.limit.label" as const,
            columns: 3,
            schema: z.coerce.number().optional().default(20),
          }),
          totalCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.totalCount" as const,
            content: "get.response.totalCount" as const,
            columns: 3,
            schema: z.coerce.number(),
          }),
          pageCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.pageCount" as const,
            content: "get.response.pageCount" as const,
            columns: 3,
            schema: z.coerce.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        searchFilters: {},
        sortingOptions: {
          sortBy: UserSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
        paginationInfo: {
          page: 1,
          limit: 20,
        },
      },
      filtered: {
        searchFilters: {
          search: "john",
          status: [UserStatusFilter.ACTIVE],
        },
        sortingOptions: {
          sortBy: UserSortField.EMAIL,
          sortOrder: SortOrder.ASC,
        },
        paginationInfo: {
          page: 1,
          limit: 10,
        },
      },
    },
    responses: {
      default: {
        response: {
          users: [],
        },
        paginationInfo: {
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
        },
      },
      filtered: {
        response: {
          users: [],
        },
        paginationInfo: {
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 10,
        },
      },
    },
  },
});

// Extract types
export type UserListRequestInput = typeof GET.types.RequestInput;
export type UserListRequestOutput = typeof GET.types.RequestOutput;
export type UserListResponseInput = typeof GET.types.ResponseInput;
export type UserListResponseOutput = typeof GET.types.ResponseOutput;

// Aliases for repository compatibility
export type UsersQueryType = UserListRequestOutput;
export type UserListResponseType = UserListResponseOutput;

const definitions = { GET } as const;
export default definitions;
