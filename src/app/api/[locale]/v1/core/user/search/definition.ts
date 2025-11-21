/**
 * User Search API Definition
 * Defines the endpoint for searching users with pagination and filtering
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

import { UserRole, UserRoleDB, UserRoleOptions } from "../user-roles/enum";
import { UserSearchStatus, UserSearchStatusOptions } from "./enum";

/**
 * GET endpoint for searching users
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "search"],
  title: "app.api.v1.core.user.search.title" as const,
  description: "app.api.v1.core.user.search.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.search.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.search.container.title" as const,
      description: "app.api.v1.core.user.search.container.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === SEARCH CRITERIA ===
      searchCriteria: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.search.groups.searchCriteria.title" as const,
          description:
            "app.api.v1.core.user.search.groups.searchCriteria.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.user.search.fields.search.label" as const,
              description:
                "app.api.v1.core.user.search.fields.search.description" as const,
              placeholder:
                "app.api.v1.core.user.search.fields.search.placeholder" as const,
              columns: 12,
              helpText:
                "app.api.v1.core.user.search.fields.search.help" as const,
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.search.fields.search.validation.minLength",
              })
              .optional(),
          ),
        },
      ),

      // === SEARCH FILTERS (PROGRESSIVE DISCLOSURE) ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.search.groups.filters.title" as const,
          description:
            "app.api.v1.core.user.search.groups.filters.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          roles: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.user.search.fields.roles.label" as const,
              description:
                "app.api.v1.core.user.search.fields.roles.description" as const,
              placeholder:
                "app.api.v1.core.user.search.fields.roles.placeholder" as const,
              options: UserRoleOptions,
              columns: 12,
              helpText:
                "app.api.v1.core.user.search.fields.roles.help" as const,
            },
            z.array(z.enum(UserRoleDB)).optional(),
          ),

          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.user.search.fields.status.label" as const,
              description:
                "app.api.v1.core.user.search.fields.status.description" as const,
              placeholder:
                "app.api.v1.core.user.search.fields.status.placeholder" as const,
              options: UserSearchStatusOptions,
              columns: 12,
              helpText:
                "app.api.v1.core.user.search.fields.status.help" as const,
            },
            z.string().optional().default(UserSearchStatus.ACTIVE),
          ),
        },
      ),

      // === PAGINATION CONTROLS ===
      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.search.groups.pagination.title" as const,
          description:
            "app.api.v1.core.user.search.groups.pagination.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.user.search.fields.limit.label" as const,
              description:
                "app.api.v1.core.user.search.fields.limit.description" as const,
              columns: 6,
              helpText:
                "app.api.v1.core.user.search.fields.limit.help" as const,
            },
            z.coerce.number().min(1).max(100).default(20),
          ),

          offset: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.user.search.fields.offset.label" as const,
              description:
                "app.api.v1.core.user.search.fields.offset.description" as const,
              columns: 6,
              helpText:
                "app.api.v1.core.user.search.fields.offset.help" as const,
            },
            z.coerce.number().min(0).default(0),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.search.response.title" as const,
          description:
            "app.api.v1.core.user.search.response.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.user.search.response.success.badge" as const,
            },
            z.boolean().describe("Whether the search was successful"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.search.response.message.content" as const,
            },
            z.string().describe("Human-readable search result summary"),
          ),
          searchInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.user.search.response.searchInfo.title" as const,
              description:
                "app.api.v1.core.user.search.response.searchInfo.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              searchTerm: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.searchInfo.searchTerm" as const,
                },
                z.string().optional().describe("The search term used"),
              ),
              appliedFilters: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.searchInfo.appliedFilters" as const,
                },
                z.array(z.string()).describe("Active search filters"),
              ),
              searchTime: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.searchInfo.searchTime" as const,
                },
                z.string().describe("How long the search took"),
              ),
              totalResults: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.searchInfo.totalResults" as const,
                },
                z.number().describe("Total number of results found"),
              ),
            },
          ),
          users: responseArrayField(
            {
              type: WidgetType.DATA_TABLE,
              columns: [
                {
                  key: "privateName",
                  label:
                    "app.api.v1.core.user.search.columns.privateName" as const,
                },
                {
                  key: "publicName",
                  label:
                    "app.api.v1.core.user.search.columns.publicName" as const,
                },
                {
                  key: "email",
                  label: "app.api.v1.core.user.search.columns.email" as const,
                },
                {
                  key: "userRoles",
                  label:
                    "app.api.v1.core.user.search.columns.userRoles" as const,
                },
              ],
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.id" as const,
                  },
                  z.uuid(),
                ),
                leadId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.leadId" as const,
                  },
                  z.uuid().nullable(),
                ),
                isPublic: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.user.search.response.users.isPublic" as const,
                  },
                  z.literal(false),
                ),
                privateName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.privateName" as const,
                  },
                  z.string(),
                ),
                publicName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.publicName" as const,
                  },
                  z.string(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.email" as const,
                  },
                  z.email(),
                ),
                isActive: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.user.search.response.users.isActive" as const,
                  },
                  z.boolean().nullable(),
                ),
                emailVerified: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.user.search.response.users.emailVerified" as const,
                  },
                  z.boolean().nullable(),
                ),
                requireTwoFactor: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.user.search.response.users.requireTwoFactor" as const,
                  },
                  z.boolean().optional(),
                ),
                marketingConsent: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.user.search.response.users.marketingConsent" as const,
                  },
                  z.boolean().optional(),
                ),
                userRoles: responseArrayField(
                  {
                    type: WidgetType.GROUPED_LIST,
                    groupBy: "role",
                  },
                  objectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.HORIZONTAL,
                    },
                    { response: true },
                    {
                      id: responseField(
                        {
                          type: WidgetType.TEXT,
                          content:
                            "app.api.v1.core.user.search.response.users.userRoles.id" as const,
                        },
                        z.string(),
                      ),
                      role: responseField(
                        {
                          type: WidgetType.BADGE,
                          text: "app.api.v1.core.user.search.response.users.userRoles.role" as const,
                        },
                        z.enum(UserRole),
                      ),
                    },
                  ),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.createdAt" as const,
                  },
                  z.string(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.user.search.response.users.updatedAt" as const,
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
                "app.api.v1.core.user.search.response.pagination.title" as const,
              description:
                "app.api.v1.core.user.search.response.pagination.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              currentPage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.pagination.currentPage" as const,
                },
                z.number().describe("Current page number (1-based)"),
              ),
              totalPages: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.pagination.totalPages" as const,
                },
                z.number().describe("Total number of pages"),
              ),
              itemsPerPage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.pagination.itemsPerPage" as const,
                },
                z.number().describe("Number of items per page"),
              ),
              totalItems: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.search.response.pagination.totalItems" as const,
                },
                z.number().describe("Total number of items"),
              ),
              hasMore: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.search.response.pagination.hasMore" as const,
                },
                z.boolean().describe("Whether there are more pages"),
              ),
              hasPrevious: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.search.response.pagination.hasPrevious" as const,
                },
                z.boolean().describe("Whether there are previous pages"),
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.search.errors.validation.title" as const,
      description:
        "app.api.v1.core.user.search.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.search.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.search.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.search.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.user.search.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.search.errors.notFound.title" as const,
      description:
        "app.api.v1.core.user.search.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.search.errors.internal.title" as const,
      description:
        "app.api.v1.core.user.search.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.search.errors.network.title" as const,
      description:
        "app.api.v1.core.user.search.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.search.errors.unknown.title" as const,
      description:
        "app.api.v1.core.user.search.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.user.search.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.user.search.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.search.errors.conflict.title" as const,
      description:
        "app.api.v1.core.user.search.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.search.success.title" as const,
    description: "app.api.v1.core.user.search.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        searchCriteria: {
          search: "john",
        },
        filters: {
          roles: undefined,
          status: undefined,
        },
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
      withPagination: {
        searchCriteria: {
          search: "doe",
        },
        filters: {
          roles: undefined,
          status: undefined,
        },
        pagination: {
          limit: 20,
          offset: 20,
        },
      },
      withoutSearch: {
        searchCriteria: {
          search: undefined,
        },
        filters: {
          roles: undefined,
          status: undefined,
        },
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
      noResults: {
        searchCriteria: {
          search: "nonexistentuser",
        },
        filters: {
          roles: undefined,
          status: undefined,
        },
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
    },
    urlPathParams: undefined,
    responses: {
      default: {
        response: {
          success: true,
          message: "Found 1 user matching your search criteria",
          searchInfo: {
            searchTerm: "john",
            appliedFilters: ["active users only"],
            searchTime: "0.123 seconds",
            totalResults: 1,
          },
          users: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              leadId: null,
              isPublic: false,
              privateName: "John Doe",
              publicName: "John D.",
              email: "john.doe@example.com",
              isActive: true,
              emailVerified: true,
              requireTwoFactor: false,
              marketingConsent: true,
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-01T00:00:00.000Z",
              userRoles: [
                {
                  id: "role-id",
                  role: UserRole.CUSTOMER,
                },
              ],
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 10,
            totalItems: 1,
            hasMore: false,
            hasPrevious: false,
          },
        },
      },
      withPagination: {
        response: {
          success: true,
          message: "Showing page 2 of 5 (users 21-40 of 50)",
          searchInfo: {
            searchTerm: "doe",
            appliedFilters: [],
            searchTime: "0.089 seconds",
            totalResults: 50,
          },
          users: [],
          pagination: {
            currentPage: 2,
            totalPages: 5,
            itemsPerPage: 20,
            totalItems: 50,
            hasMore: true,
            hasPrevious: true,
          },
        },
      },
      withoutSearch: {
        response: {
          success: true,
          message: "Showing all users (page 1 of 10)",
          searchInfo: {
            searchTerm: undefined,
            appliedFilters: [],
            searchTime: "0.045 seconds",
            totalResults: 100,
          },
          users: [],
          pagination: {
            currentPage: 1,
            totalPages: 10,
            itemsPerPage: 10,
            totalItems: 100,
            hasMore: true,
            hasPrevious: false,
          },
        },
      },
      noResults: {
        response: {
          success: true,
          message: "No users found matching your search criteria",
          searchInfo: {
            searchTerm: "nonexistentuser",
            appliedFilters: [],
            searchTime: "0.012 seconds",
            totalResults: 0,
          },
          users: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            itemsPerPage: 10,
            totalItems: 0,
            hasMore: false,
            hasPrevious: false,
          },
        },
      },
    },
  },
});

/**
 * User search endpoints
 */
const userSearchEndpoints = {
  GET,
};

export { GET };

export default userSearchEndpoints;

// Export types as required by migration guide
export type UserSearchGetRequestInput = typeof GET.types.RequestInput;
export type UserSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type UserSearchGetResponseInput = typeof GET.types.ResponseInput;
export type UserSearchGetResponseOutput = typeof GET.types.ResponseOutput;
