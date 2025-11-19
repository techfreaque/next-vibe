/**
 * Users List API Route Definition
 * Following the exact pattern from leads/list/definition.ts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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
  path: ["v1", "core", "users", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "app.api.v1.core.users.list.title" as const,
  description: "app.api.v1.core.users.list.description" as const,
  category: "app.api.v1.core.users.category" as const,
  tags: ["app.api.v1.core.users.list.tag" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.users.list.container.title" as const,
      description: "app.api.v1.core.users.list.container.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === PAGINATION & SEARCH ===
      searchAndPagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.list.container.title" as const,
          description:
            "app.api.v1.core.users.list.container.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          page: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.users.list.fields.page.label" as const,
              description:
                "app.api.v1.core.users.list.fields.page.description" as const,
              placeholder:
                "app.api.v1.core.users.list.fields.page.placeholder" as const,
              layout: { columns: 3 },
            },
            z.number().min(1).optional().default(1),
          ),
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.users.list.fields.limit.label" as const,
              description:
                "app.api.v1.core.users.list.fields.limit.description" as const,
              placeholder:
                "app.api.v1.core.users.list.fields.limit.placeholder" as const,
              layout: { columns: 3 },
            },
            z.number().min(1).max(100).optional().default(20),
          ),

          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.users.list.fields.search.label" as const,
              description:
                "app.api.v1.core.users.list.fields.search.description" as const,
              placeholder:
                "app.api.v1.core.users.list.fields.search.placeholder" as const,
              layout: { columns: 12 },
            },
            z.string().optional(),
          ),
        },
      ),

      // === FILTERS ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.list.container.title" as const,
          description:
            "app.api.v1.core.users.list.container.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.users.list.fields.status.label" as const,
              description:
                "app.api.v1.core.users.list.fields.status.description" as const,
              options: UserStatusFilterOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(UserStatusFilter)).optional(),
          ),
          role: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.users.list.fields.role.label" as const,
              description:
                "app.api.v1.core.users.list.fields.role.description" as const,
              options: UserRoleFilterOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(UserRoleFilter)).optional(),
          ),
        },
      ),

      // === SORTING ===
      sorting: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.list.container.title" as const,
          description:
            "app.api.v1.core.users.list.container.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          sortBy: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.users.list.fields.sortBy.label" as const,
              description:
                "app.api.v1.core.users.list.fields.sortBy.description" as const,
              options: UserSortFieldOptions,
              layout: { columns: 6 },
            },
            z
              .nativeEnum(UserSortField)
              .optional()
              .default(UserSortField.CREATED_AT),
          ),
          sortOrder: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.users.list.fields.sortOrder.label" as const,
              description:
                "app.api.v1.core.users.list.fields.sortOrder.description" as const,
              placeholder:
                "app.api.v1.core.users.list.fields.sortOrder.placeholder" as const,
              options: SortOrderOptions,
              layout: { columns: 6 },
            },
            z.enum(SortOrder).optional().default(SortOrder.DESC),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.list.response.summary.title" as const,
          description:
            "app.api.v1.core.users.list.response.summary.description" as const,
          layout: { type: LayoutType.VERTICAL },
        },
        { response: true },
        {
          totalCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.list.response.total.content" as const,
            },
            z.number(),
          ),
          pageCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.list.response.page.content" as const,
            },
            z.number(),
          ),
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.list.response.page.content" as const,
            },
            z.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.list.response.limit.content" as const,
            },
            z.number(),
          ),
          users: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              layout: "grid",
              cardConfig: {
                title: "email",
                subtitle: "publicName",
                content: ["privateName"],
                metadata: ["isActive", "emailVerified"],
              },
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.users.list.response.user.title" as const,
                description:
                  "app.api.v1.core.users.list.response.summary.description" as const,
                layout: { type: LayoutType.GRID, columns: 3 },
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.id" as const,
                  },
                  z.string(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.email" as const,
                  },
                  z.string(),
                ),
                privateName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.privateName" as const,
                  },
                  z.string(),
                ),
                publicName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.publicName" as const,
                  },
                  z.string(),
                ),
                isActive: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.users.list.response.user.isActive" as const,
                  },
                  z.boolean(),
                ),
                emailVerified: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.users.list.response.user.emailVerified" as const,
                  },
                  z.boolean(),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.createdAt" as const,
                  },
                  z.string(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.users.list.response.user.updatedAt" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.users.list.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.users.list.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.users.list.errors.validation.title" as const,
      description:
        "app.api.v1.core.users.list.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.users.list.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.users.list.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.users.list.errors.server.title" as const,
      description:
        "app.api.v1.core.users.list.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.users.list.errors.unknown.title" as const,
      description:
        "app.api.v1.core.users.list.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.users.list.errors.conflict.title" as const,
      description:
        "app.api.v1.core.users.list.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.users.list.errors.network.title" as const,
      description:
        "app.api.v1.core.users.list.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.users.list.errors.notFound.title" as const,
      description:
        "app.api.v1.core.users.list.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.users.list.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.users.list.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.users.list.post.success.title" as const,
    description: "app.api.v1.core.users.list.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        searchAndPagination: {
          page: 1,
          limit: 20,
        },
        filters: {},
        sorting: {
          sortBy: UserSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
      basicSearch: {
        searchAndPagination: {
          page: 1,
          limit: 10,
          search: "john",
        },
        filters: {
          status: [UserStatusFilter.ACTIVE],
        },
        sorting: {
          sortBy: UserSortField.EMAIL,
          sortOrder: SortOrder.ASC,
        },
      },
    },
    responses: {
      default: {
        response: {
          users: [],
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
        },
      },
      basicSearch: {
        response: {
          users: [],
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

const definitions = { GET };
export { GET };
export default definitions;
