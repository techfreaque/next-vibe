/**
 * Subscription Admin Referrals Endpoint Definition
 * GET: referral codes, earnings, payouts overview
 * POST: admin payout action (approve / reject / complete)
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
  PayoutAction,
  PayoutActionOptions,
  PayoutStatusAdminFilter,
  PayoutStatusAdminFilterOptions,
  ReferralSortField,
  ReferralSortFieldOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";
import { SUBSCRIPTION_ADMIN_REFERRALS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const ReferralsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralsContainer })),
);

/**
 * GET: Referral dashboard with codes, earnings, and payout requests
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "admin", "referrals"],
  aliases: [SUBSCRIPTION_ADMIN_REFERRALS_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "users",
  category: "endpointCategories.subscriptions",
  subCategory: "endpointCategories.subscriptionAnalytics",
  tags: ["get.title" as const],

  fields: customWidgetObject({
    render: ReferralsContainer,
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
          payoutStatus: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.payoutStatus.label" as const,
            description: "get.payoutStatus.description" as const,
            placeholder: "get.payoutStatus.placeholder" as const,
            options: PayoutStatusAdminFilterOptions,
            columns: 6,
            schema: z.enum(PayoutStatusAdminFilter).optional(),
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
            options: ReferralSortFieldOptions,
            columns: 6,
            schema: z
              .enum(ReferralSortField)
              .default(ReferralSortField.CREATED_AT),
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
          // Summary stats
          summary: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.summary.title" as const,
            description: "get.response.summary.description" as const,
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              totalCodes: responseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "get.response.summary.totalCodes.label" as const,
                schema: z.coerce.number(),
              }),
              totalSignups: responseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "get.response.summary.totalSignups.label" as const,
                schema: z.coerce.number(),
              }),
              totalEarned: responseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "get.response.summary.totalEarned.label" as const,
                schema: z.coerce.number(),
              }),
              totalPaidOut: responseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "get.response.summary.totalPaidOut.label" as const,
                schema: z.coerce.number(),
              }),
              pendingPayouts: responseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "get.response.summary.pendingPayouts.label" as const,
                schema: z.coerce.number(),
              }),
            },
          }),

          // Referral codes
          codes: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                code: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.code" as const,
                  schema: z.string(),
                }),
                ownerEmail: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.ownerEmail" as const,
                  schema: z.string(),
                }),
                ownerName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.ownerName" as const,
                  schema: z.string(),
                }),
                currentUses: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.currentUses" as const,
                  schema: z.coerce.number(),
                }),
                totalSignups: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.totalSignups" as const,
                  schema: z.coerce.number(),
                }),
                totalEarned: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.codes.totalEarned" as const,
                  schema: z.coerce.number(),
                }),
                isActive: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.codes.isActive" as const,
                  schema: z.boolean(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.codes.createdAt" as const,
                  schema: z.coerce.date(),
                }),
              },
            }),
          }),

          // Payout requests
          payoutRequests: responseArrayField(scopedTranslation, {
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
                  content: "get.response.payoutRequests.id" as const,
                  schema: z.string(),
                }),
                userEmail: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.payoutRequests.userEmail" as const,
                  schema: z.string(),
                }),
                amountCents: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.payoutRequests.amountCents" as const,
                  schema: z.coerce.number(),
                }),
                currency: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.payoutRequests.currency" as const,
                  schema: z.string(),
                }),
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.payoutRequests.status" as const,
                  schema: z.string(),
                }),
                walletAddress: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.payoutRequests.walletAddress" as const,
                  schema: z.string().nullable(),
                }),
                adminNotes: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.payoutRequests.adminNotes" as const,
                  schema: z.string().nullable(),
                }),
                rejectionReason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.payoutRequests.rejectionReason" as const,
                  schema: z.string().nullable(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.payoutRequests.createdAt" as const,
                  schema: z.coerce.date(),
                }),
                processedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  content: "get.response.payoutRequests.processedAt" as const,
                  schema: z.coerce.date().nullable(),
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
          sortBy: ReferralSortField.CREATED_AT,
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
          summary: {
            totalCodes: 0,
            totalSignups: 0,
            totalEarned: 0,
            totalPaidOut: 0,
            pendingPayouts: 0,
          },
          codes: [],
          payoutRequests: [],
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

/**
 * POST: admin payout action (approve / reject / complete)
 */
export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "admin", "referrals"],
  title: "post.title" as const,
  description: "post.description" as const,
  category: "endpointCategories.subscriptions",
  subCategory: "endpointCategories.subscriptionAnalytics",
  icon: "wallet",
  tags: ["post.title" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    noCard: true,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      requestId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.requestId.label" as const,
        description: "post.requestId.description" as const,
        placeholder: "post.requestId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.action.label" as const,
        description: "post.action.description" as const,
        placeholder: "post.action.placeholder" as const,
        options: PayoutActionOptions,
        schema: z.enum(PayoutAction),
      }),
      adminNotes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.adminNotes.label" as const,
        description: "post.adminNotes.description" as const,
        placeholder: "post.adminNotes.placeholder" as const,
        schema: z.string().optional(),
      }),
      rejectionReason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.rejectionReason.label" as const,
        description: "post.rejectionReason.description" as const,
        placeholder: "post.rejectionReason.placeholder" as const,
        schema: z.string().optional(),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.success" as const,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        requestId: "123e4567-e89b-12d3-a456-426614174000",
        action: PayoutAction.APPROVE,
      },
    },
    responses: {
      default: { success: true, message: "Payout request approved" },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

// Extract types
export type ReferralsGetRequestOutput = typeof GET.types.RequestOutput;
export type ReferralsGetResponseOutput = typeof GET.types.ResponseOutput;
export type ReferralsPostRequestOutput = typeof POST.types.RequestOutput;
export type ReferralsPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
