/**
 * Subscription Admin List API Definition
 * Browse all subscriptions with filtering and pagination
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
  BillingIntervalAdminFilter,
  BillingIntervalAdminFilterOptions,
  ProviderAdminFilter,
  ProviderAdminFilterOptions,
  SortOrder,
  SortOrderOptions,
  SubscriptionSortField,
  SubscriptionSortFieldOptions,
  SubscriptionStatusAdminFilter,
  SubscriptionStatusAdminFilterOptions,
} from "../enum";
import { SUBSCRIPTION_ADMIN_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SubscriptionListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SubscriptionListContainer })),
);

/**
 * Get Subscription List Endpoint (GET)
 * Retrieves a paginated list of subscriptions with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "admin", "list"],
  aliases: [SUBSCRIPTION_ADMIN_LIST_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "list",
  category: "endpointCategories.subscriptions",
  subCategory: "endpointCategories.subscriptionManagement",
  tags: ["get.title" as const],

  fields: customWidgetObject({
    render: SubscriptionListContainer,
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
            options: SubscriptionStatusAdminFilterOptions,
            columns: 6,
            schema: z.array(z.enum(SubscriptionStatusAdminFilter)).optional(),
          }),
          interval: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.interval.label" as const,
            description: "get.interval.description" as const,
            placeholder: "get.interval.placeholder" as const,
            options: BillingIntervalAdminFilterOptions,
            columns: 6,
            schema: z.enum(BillingIntervalAdminFilter).optional(),
          }),
          provider: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.provider.label" as const,
            description: "get.provider.description" as const,
            placeholder: "get.provider.placeholder" as const,
            options: ProviderAdminFilterOptions,
            columns: 6,
            schema: z.enum(ProviderAdminFilter).optional(),
          }),
          dateFrom: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.DATETIME,
            label: "get.dateFrom.label" as const,
            description: "get.dateFrom.description" as const,
            columns: 6,
            schema: z.coerce.date().optional(),
          }),
          dateTo: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.DATETIME,
            label: "get.dateTo.label" as const,
            description: "get.dateTo.description" as const,
            columns: 6,
            schema: z.coerce.date().optional(),
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
            options: SubscriptionSortFieldOptions,
            columns: 6,
            schema: z
              .enum(SubscriptionSortField)
              .default(SubscriptionSortField.CREATED_AT),
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

      // === FORM ALERT ===
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
          subscriptions: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.subscriptions.id" as const,
                  schema: z.string(),
                }),
                userEmail: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.subscriptions.userEmail" as const,
                  schema: z.string(),
                }),
                userName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.subscriptions.userName" as const,
                  schema: z.string().nullable(),
                }),
                planId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.subscriptions.planId" as const,
                  schema: z.string(),
                }),
                billingInterval: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.subscriptions.billingInterval" as const,
                  schema: z.string(),
                }),
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.subscriptions.status" as const,
                  schema: z.string(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.subscriptions.createdAt" as const,
                  schema: z.coerce.date(),
                }),
                currentPeriodEnd: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content:
                    "get.response.subscriptions.currentPeriodEnd" as const,
                  schema: z.coerce.date().nullable(),
                }),
                cancelAtPeriodEnd: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.subscriptions.cancelAtPeriodEnd" as const,
                  schema: z.boolean(),
                }),
                canceledAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.subscriptions.canceledAt" as const,
                  schema: z.coerce.date().nullable(),
                }),
                cancellationReason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.subscriptions.cancellationReason" as const,
                  schema: z.string().nullable(),
                }),
                provider: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.subscriptions.provider" as const,
                  schema: z.string(),
                }),
                providerSubscriptionId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.subscriptions.providerSubscriptionId" as const,
                  schema: z.string().nullable(),
                }),
              },
            }),
          }),
        },
      }),

      // === PAGINATION INFO ===
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
          sortBy: SubscriptionSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
        paginationInfo: {
          page: 1,
          limit: 20,
        },
      },
    },
    responses: {
      default: {
        response: {
          subscriptions: [],
        },
        paginationInfo: {
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
        },
      },
    },
  },
});

// Extract types
export type SubscriptionListRequestInput = typeof GET.types.RequestInput;
export type SubscriptionListRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionListResponseInput = typeof GET.types.ResponseInput;
export type SubscriptionListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
