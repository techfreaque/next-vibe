/**
 * Subscription Admin List API Definition
 * Browse all subscriptions with filtering and pagination
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  objectField,
  objectOptionalField,
  requestField,
  requestResponseField,
  responseArrayField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { PaymentProvider } from "@/payment/enum";
import {
  BillingInterval,
  CancellationReason,
  SubscriptionPlan,
  SubscriptionPlanOptions,
  SubscriptionStatus,
} from "@/subscription/enum";

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
import { SubscriptionFocus, SubscriptionFocusOptions } from "./enum";
import { scopedTranslation } from "./i18n";

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
  defaultWebPinned: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "list",
  category: "subscriptions",
  subCategory: "Management",
  tags: ["get.title" as const],

  fields: customWidgetObject({
    render: SubscriptionListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.subscriptions.userId",
        hidden: true,
        includeInCacheKey: true,
        schema: z.uuid().optional(),
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
          plan: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.plan.label" as const,
            description: "get.plan.description" as const,
            options: SubscriptionPlanOptions,
            columns: 6,
            schema: z.enum(SubscriptionPlan).optional(),
          }),
          focus: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.focus.label" as const,
            options: SubscriptionFocusOptions,
            columns: 6,
            schema: z.enum(SubscriptionFocus).optional(),
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
            schema: dateSchema.optional(),
          }),
          dateTo: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.DATETIME,
            label: "get.dateTo.label" as const,
            description: "get.dateTo.description" as const,
            columns: 6,
            schema: dateSchema.optional(),
          }),
        },
      }),

      // === SORTING OPTIONS ===
      sortingOptions: objectOptionalField(scopedTranslation, {
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
                  label: "get.response.subscriptions.id" as const,
                  schema: z.string(),
                }),
                userId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.userId",
                  schema: z.uuid(),
                }),
                userEmail: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.userEmail" as const,
                  schema: z.string(),
                }),
                userName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.userName" as const,
                  schema: z.string().nullable(),
                }),
                planId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.planId" as const,
                  schema: z.enum(SubscriptionPlan),
                }),
                billingInterval: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.subscriptions.billingInterval" as const,
                  schema: z.enum(BillingInterval),
                }),
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.subscriptions.status" as const,
                  schema: z.enum(SubscriptionStatus),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  label: "get.response.subscriptions.createdAt" as const,
                  schema: z.coerce.date(),
                }),
                currentPeriodEnd: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content:
                    "get.response.subscriptions.currentPeriodEnd" as const,
                  schema: z.coerce.date().nullable(),
                }),
                paymentFailedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  label: "get.response.subscriptions.paymentFailedAt",
                  schema: z.coerce.date().nullable(),
                }),
                gracePeriodEndsAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  label: "get.response.subscriptions.gracePeriodEndsAt",
                  schema: z.coerce.date().nullable(),
                }),
                cancelAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  label: "get.response.subscriptions.cancelAt",
                  schema: z.coerce.date().nullable(),
                }),
                lastPaymentAmount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.lastPaymentAmount",
                  schema: z.number().nullable(),
                }),
                lastPaymentCurrency: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.lastPaymentCurrency",
                  schema: z.enum(CurrenciesArr).nullable(),
                }),
                lastPaymentAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  label: "get.response.subscriptions.lastPaymentAt",
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
                  label: "get.response.subscriptions.canceledAt" as const,
                  schema: z.coerce.date().nullable(),
                }),
                cancellationReason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.subscriptions.cancellationReason" as const,
                  schema: z.enum(CancellationReason).nullable(),
                }),
                provider: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.subscriptions.provider" as const,
                  schema: z.enum(PaymentProvider),
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
          summary: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.summary.title",
            schema: z.object({
              mrrUsd: z.number(),
              mrr: z.array(
                z.object({
                  currency: z.enum(CurrenciesArr),
                  amount: z.number(),
                }),
              ),
              renewingSoon: z.number(),
              ending: z.number(),
              pastDue: z.number(),
              noCharge: z.number(),
              fxRates: z.array(
                z.object({ currency: z.string(), usdRate: z.number() }),
              ),
            }),
          }),
          planCounts: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                plan: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.plan.label",
                  schema: z.enum(SubscriptionPlan),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.statusCounts.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          statusCounts: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                status: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.statusCounts.status",
                  schema: z.enum(SubscriptionStatus),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.statusCounts.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
        },
      }),

      // === PAGINATION INFO ===
      paginationInfo: objectOptionalField(scopedTranslation, {
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
            schema: z.coerce.number().int().min(1).max(1_000_000).default(1),
          }),
          limit: requestResponseField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "get.limit.label" as const,
            columns: 3,
            schema: z.coerce.number().int().min(1).max(100).default(20),
          }),
          totalCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.totalCount" as const,
            columns: 3,
            schema: z.coerce.number(),
          }),
          pageCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.pageCount" as const,
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
      activeOnly: {
        searchFilters: {
          status: [SubscriptionStatusAdminFilter.ACTIVE],
          plan: SubscriptionPlan.PLUS,
        },
      },
      default: {
        searchFilters: {
          status: [],
          interval: BillingIntervalAdminFilter.ANY,
          provider: ProviderAdminFilter.ANY,
        },
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
          statusCounts: [],
          planCounts: [],
          summary: {
            mrrUsd: 0,
            mrr: [],
            renewingSoon: 0,
            ending: 0,
            pastDue: 0,
            noCharge: 0,
            fxRates: [],
          },
        },
        paginationInfo: {
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
        },
      },
      pastDue: {
        response: {
          subscriptions: [
            {
              id: "ebddf6d3-2937-4650-a704-1fb6d454b589",
              userId: "22cca261-5789-4d02-aa9c-26d1b6b986af",
              userEmail: "billing-test@example.com",
              userName: "Billing Test",
              planId: SubscriptionPlan.PLUS,
              billingInterval: BillingInterval.MONTHLY,
              status: SubscriptionStatus.PAST_DUE,
              createdAt: new Date("2026-10-19T09:30:00.000Z"),
              currentPeriodEnd: new Date("2026-11-19T09:30:00.000Z"),
              paymentFailedAt: new Date("2026-11-19T09:30:02.000Z"),
              gracePeriodEndsAt: new Date("2026-11-26T09:30:02.000Z"),
              cancelAt: null,
              lastPaymentAmount: 20,
              lastPaymentCurrency: "EUR",
              lastPaymentAt: new Date("2026-10-19T09:30:00.000Z"),
              cancelAtPeriodEnd: false,
              canceledAt: null,
              cancellationReason: null,
              provider: PaymentProvider.STRIPE,
              providerSubscriptionId: "sub_audit_example",
            },
          ],
          statusCounts: [{ status: SubscriptionStatus.PAST_DUE, count: 1 }],
          planCounts: [{ plan: SubscriptionPlan.PLUS, count: 1 }],
          summary: {
            mrrUsd: 0,
            mrr: [],
            renewingSoon: 0,
            ending: 0,
            pastDue: 1,
            noCharge: 0,
            fxRates: [],
          },
        },
        paginationInfo: { totalCount: 1, pageCount: 1, page: 1, limit: 20 },
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
