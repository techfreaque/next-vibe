/**
 * Users List API Route Definition
 * Following the exact pattern from leads/list/definition.ts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestResponseField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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

/**
 * Get Users List Endpoint (GET)
 * Retrieves a paginated list of users with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "app.api.users.list.get.title" as const,
  description: "app.api.users.list.get.description" as const,
  icon: "users",
  category: "app.api.users.category" as const,
  tags: ["app.api.users.list.tag" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.users.list.get.form.title" as const,
      description: "app.api.users.list.get.form.description" as const,
      layoutType: LayoutType.STACKED,
      getCount: (data) => data.paginationInfo?.totalCount,
      submitButton: {
        text: "app.api.users.list.get.actions.refresh" as const,
        loadingText: "app.api.users.list.get.actions.refreshing" as const,
        position: "header",
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
      },
    },
    { request: "data", response: true },
    {
      // === SEARCH & FILTERS ===
      searchFilters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.list.get.searchFilters.title" as const,
          description:
            "app.api.users.list.get.searchFilters.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
          order: 1,
        },
        { request: "data" },
        {
          search: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.users.list.get.search.label" as const,
            description: "app.api.users.list.get.search.description" as const,
            placeholder: "app.api.users.list.get.search.placeholder" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
          status: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "app.api.users.list.get.status.label" as const,
            description: "app.api.users.list.get.status.description" as const,
            placeholder: "app.api.users.list.get.status.placeholder" as const,
            options: UserStatusFilterOptions,
            columns: 6,
            schema: z.array(z.enum(UserStatusFilter)).optional(),
          }),
          role: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "app.api.users.list.get.role.label" as const,
            description: "app.api.users.list.get.role.description" as const,
            placeholder: "app.api.users.list.get.role.placeholder" as const,
            options: UserRoleFilterOptions,
            columns: 6,
            schema: z.array(z.enum(UserRoleFilter)).optional(),
          }),
        },
      ),

      // === SORTING OPTIONS ===
      sortingOptions: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.list.get.sortingOptions.title" as const,
          description:
            "app.api.users.list.get.sortingOptions.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 2,
        },
        { request: "data" },
        {
          sortBy: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.list.get.sortBy.label" as const,
            description: "app.api.users.list.get.sortBy.description" as const,
            placeholder: "app.api.users.list.get.sortBy.placeholder" as const,
            options: UserSortFieldOptions,
            columns: 6,
            schema: z
              .enum(UserSortField)
              .optional()
              .default(UserSortField.CREATED_AT),
          }),
          sortOrder: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.list.get.sortOrder.label" as const,
            description:
              "app.api.users.list.get.sortOrder.description" as const,
            placeholder:
              "app.api.users.list.get.sortOrder.placeholder" as const,
            options: SortOrderOptions,
            columns: 6,
            schema: z.enum(SortOrder).optional().default(SortOrder.DESC),
          }),
        },
      ),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        order: 2.5,
        usage: { request: "data" },
      }),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.list.get.response.title" as const,
          description: "app.api.users.list.get.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
          order: 3,
        },
        { response: true },
        {
          users: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
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
                email: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.users.list.get.response.users.email" as const,
                  schema: z.string(),
                }),
                privateName: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.users.list.get.response.users.privateName" as const,
                  schema: z.string(),
                }),
                publicName: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.users.list.get.response.users.publicName" as const,
                  schema: z.string(),
                }),
                isActive: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.users.list.get.response.users.isActive" as const,
                  schema: z.boolean(),
                }),
                emailVerified: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.users.list.get.response.users.emailVerified" as const,
                  schema: z.boolean(),
                }),
                createdAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content:
                    "app.api.users.list.get.response.users.createdAt" as const,
                  schema: z.coerce.date(),
                }),
                updatedAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content:
                    "app.api.users.list.get.response.users.updatedAt" as const,
                  schema: z.coerce.date(),
                }),
                id: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.users.list.get.response.users.id" as const,
                  schema: z.string(),
                }),
              },
            ),
          ),
        },
      ),

      // === PAGINATION INFO (Editable controls + display in one row) ===
      paginationInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.HORIZONTAL,
          noCard: true,
          gap: "4",
          order: 4,
        },
        { request: "data", response: true },
        {
          page: requestResponseField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.users.list.get.page.label" as const,
            columns: 3,
            schema: z.coerce.number().optional().default(1),
          }),
          limit: requestResponseField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.users.list.get.limit.label" as const,
            columns: 3,
            schema: z.coerce.number().optional().default(20),
          }),
          totalCount: responseField({
            type: WidgetType.TEXT,
            label: "app.api.users.list.get.response.totalCount" as const,
            content: "app.api.users.list.get.response.totalCount" as const,
            columns: 3,
            schema: z.coerce.number(),
          }),
          pageCount: responseField({
            type: WidgetType.TEXT,
            label: "app.api.users.list.get.response.pageCount" as const,
            content: "app.api.users.list.get.response.pageCount" as const,
            columns: 3,
            schema: z.coerce.number(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.list.get.errors.unauthorized.title" as const,
      description:
        "app.api.users.list.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.list.get.errors.validation.title" as const,
      description:
        "app.api.users.list.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.list.get.errors.forbidden.title" as const,
      description:
        "app.api.users.list.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.list.get.errors.server.title" as const,
      description: "app.api.users.list.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.list.get.errors.unknown.title" as const,
      description: "app.api.users.list.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.list.get.errors.conflict.title" as const,
      description:
        "app.api.users.list.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.list.get.errors.network.title" as const,
      description: "app.api.users.list.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.list.get.errors.notFound.title" as const,
      description:
        "app.api.users.list.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.users.list.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.list.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.users.list.get.success.title" as const,
    description: "app.api.users.list.get.success.description" as const,
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
