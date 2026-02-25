/**
 * User Search API Definition
 * Defines the endpoint for searching users with pagination and filtering
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
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

import { dateSchema } from "../../shared/types/common.schema";
import { UserRole, UserRoleDB, UserRoleOptions } from "../user-roles/enum";
import { UserSearchStatus, UserSearchStatusOptions } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * GET endpoint for searching users
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "search"],
  title: "title",
  description: "description",
  icon: "search",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === SEARCH CRITERIA ===
      searchCriteria: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "groups.searchCriteria.title",
        description: "groups.searchCriteria.description",
        layoutType: LayoutType.VERTICAL,
        usage: { request: "data" },
        children: {
          search: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "fields.search.label",
            description: "fields.search.description",
            placeholder: "fields.search.placeholder",
            columns: 12,
            helpText: "fields.search.help",
            schema: z
              .string()
              .min(2, {
                message: "fields.search.validation.minLength",
              })
              .optional(),
          }),
        },
      }),

      // === SEARCH FILTERS (PROGRESSIVE DISCLOSURE) ===
      filters: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "groups.filters.title",
        description: "groups.filters.description",
        layoutType: LayoutType.VERTICAL,
        usage: { request: "data" },
        children: {
          roles: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "fields.roles.label",
            description: "fields.roles.description",
            placeholder: "fields.roles.placeholder",
            options: UserRoleOptions,
            columns: 12,
            helpText: "fields.roles.help",
            schema: z.array(z.enum(UserRoleDB)).optional(),
          }),

          status: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.status.label",
            description: "fields.status.description",
            placeholder: "fields.status.placeholder",
            options: UserSearchStatusOptions,
            columns: 12,
            helpText: "fields.status.help",
            schema: z
              .enum(UserSearchStatus)
              .optional()
              .default(UserSearchStatus.ACTIVE),
          }),
        },
      }),

      // === PAGINATION CONTROLS ===
      pagination: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "groups.pagination.title",
        description: "groups.pagination.description",
        layoutType: LayoutType.VERTICAL,
        usage: { request: "data" },
        children: {
          limit: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "fields.limit.label",
            description: "fields.limit.description",
            columns: 6,
            helpText: "fields.limit.help",
            schema: z.coerce.number().min(1).max(100).default(20),
          }),

          offset: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "fields.offset.label",
            description: "fields.offset.description",
            columns: 6,
            helpText: "fields.offset.help",
            schema: z.coerce.number().min(0).default(0),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title",
        description: "response.description",
        layoutType: LayoutType.VERTICAL,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.success.badge",
            schema: z.boolean().describe("Whether the search was successful"),
          }),
          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.message.content",
            schema: z.string().describe("Human-readable search result summary"),
          }),
          searchInfo: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.searchInfo.title",
            description: "response.searchInfo.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              searchTerm: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.searchInfo.searchTerm",
                schema: z.string().optional().describe("The search term used"),
              }),
              appliedFilters: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.searchInfo.appliedFilters",
                schema: z.array(z.string()).describe("Active search filters"),
              }),
              searchTime: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.searchInfo.searchTime",
                schema: z.string().describe("How long the search took"),
              }),
              totalResults: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.searchInfo.totalResults",
                schema: z.coerce
                  .number()
                  .describe("Total number of results found"),
              }),
            },
          }),
          users: scopedResponseArrayFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                id: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.id",
                  schema: z.uuid(),
                }),
                leadId: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.leadId",
                  schema: z.uuid().nullable(),
                }),
                isPublic: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.users.isPublic",
                  schema: z.literal(false),
                }),
                privateName: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.privateName",
                  schema: z.string(),
                }),
                publicName: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.publicName",
                  schema: z.string(),
                }),
                email: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.email",
                  schema: z.email(),
                }),
                isActive: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.users.isActive",
                  schema: z.boolean().nullable(),
                }),
                emailVerified: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.users.emailVerified",
                  schema: z.boolean().nullable(),
                }),
                requireTwoFactor: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.users.requireTwoFactor",
                  schema: z.boolean().optional(),
                }),
                marketingConsent: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.users.marketingConsent",
                  schema: z.boolean().optional(),
                }),
                userRoles: scopedResponseArrayFieldNew(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  groupBy: "role",
                  child: scopedObjectFieldNew(scopedTranslation, {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.HORIZONTAL,
                    usage: { response: true },
                    children: {
                      id: scopedResponseField(scopedTranslation, {
                        type: WidgetType.TEXT,
                        content: "response.users.userRoles.id",
                        schema: z.string(),
                      }),
                      role: scopedResponseField(scopedTranslation, {
                        type: WidgetType.BADGE,
                        text: "response.users.userRoles.role",
                        schema: z.enum(UserRole),
                      }),
                    },
                  }),
                }),
                createdAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.createdAt",
                  schema: dateSchema,
                }),
                updatedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.users.updatedAt",
                  schema: dateSchema,
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
              currentPage: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.pagination.currentPage",
                schema: z.coerce
                  .number()
                  .describe("Current page number (1-based)"),
              }),
              totalPages: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.pagination.totalPages",
                schema: z.coerce.number().describe("Total number of pages"),
              }),
              itemsPerPage: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.pagination.itemsPerPage",
                schema: z.coerce.number().describe("Number of items per page"),
              }),
              totalItems: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.pagination.totalItems",
                schema: z.coerce.number().describe("Total number of items"),
              }),
              hasMore: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.pagination.hasMore",
                schema: z.boolean().describe("Whether there are more pages"),
              }),
              hasPrevious: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.pagination.hasPrevious",
                schema: z
                  .boolean()
                  .describe("Whether there are previous pages"),
              }),
            },
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
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
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
} as const;
export default userSearchEndpoints;

// Export types as required by migration guide
export type UserSearchGetRequestInput = typeof GET.types.RequestInput;
export type UserSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type UserSearchGetResponseInput = typeof GET.types.ResponseInput;
export type UserSearchGetResponseOutput = typeof GET.types.ResponseOutput;
