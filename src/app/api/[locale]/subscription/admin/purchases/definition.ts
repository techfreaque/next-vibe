/**
 * Subscription Admin Purchases Endpoint Definition
 * GET: list all credit pack purchases with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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
  CreditPackSourceAdminFilter,
  CreditPackSourceAdminFilterOptions,
  CreditPackTypeAdminFilter,
  CreditPackTypeAdminFilterOptions,
  PurchaseSortField,
  PurchaseSortFieldOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";
import { SUBSCRIPTION_ADMIN_PURCHASES_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const PurchasesContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PurchasesContainer })),
);

/**
 * Get Purchases List Endpoint (GET)
 * Retrieves a paginated list of credit pack purchases with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "admin", "purchases"],
  aliases: [SUBSCRIPTION_ADMIN_PURCHASES_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "credit-card",
  category: "endpointCategories.subscriptions",
  subCategory: "endpointCategories.subscriptionAnalytics",
  tags: ["get.title" as const],

  fields: customWidgetObject({
    render: PurchasesContainer,
    usage: { request: "data", response: true } as const,
    children: {
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
          packType: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "get.packType.label" as const,
            description: "get.packType.description" as const,
            placeholder: "get.packType.placeholder" as const,
            options: CreditPackTypeAdminFilterOptions,
            columns: 6,
            schema: z.array(z.enum(CreditPackTypeAdminFilter)).optional(),
          }),
          source: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.source.label" as const,
            description: "get.source.description" as const,
            placeholder: "get.source.placeholder" as const,
            options: CreditPackSourceAdminFilterOptions,
            columns: 6,
            schema: z.enum(CreditPackSourceAdminFilter).optional(),
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
            options: PurchaseSortFieldOptions,
            columns: 6,
            schema: z
              .enum(PurchaseSortField)
              .default(PurchaseSortField.CREATED_AT),
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
          purchases: responseArrayField(scopedTranslation, {
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
                  content: "get.response.purchases.id" as const,
                  schema: z.string(),
                }),
                userEmail: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.userEmail" as const,
                  schema: z.string(),
                }),
                userName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.userName" as const,
                  schema: z.string(),
                }),
                packType: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.packType" as const,
                  schema: z.string(),
                }),
                source: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.source" as const,
                  schema: z.string(),
                }),
                originalAmount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.originalAmount" as const,
                  schema: z.coerce.number(),
                }),
                remaining: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.purchases.remaining" as const,
                  schema: z.coerce.number(),
                }),
                expiresAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.purchases.expiresAt" as const,
                  schema: z.coerce.date().nullable(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.purchases.createdAt" as const,
                  schema: z.coerce.date(),
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
          sortBy: PurchaseSortField.CREATED_AT,
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
          purchases: [],
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
export type PurchasesGetRequestInput = typeof GET.types.RequestInput;
export type PurchasesGetRequestOutput = typeof GET.types.RequestOutput;
export type PurchasesGetResponseInput = typeof GET.types.ResponseInput;
export type PurchasesGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
