/**
 * Users List API Route Definition
 * Admin user directory: search, business filters, sortable money/activity columns.
 * Every request field is flat and optional so CLI/MCP calls work with zero args.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { USERS_LIST_ALIAS } from "./constants";
import {
  AccountStateFilter,
  AccountStateFilterOptions,
  LastActiveFilter,
  LastActiveFilterOptions,
  ListSortOrder,
  ListSortOrderOptions,
  PayerFilter,
  PayerFilterOptions,
  ReferrerFilter,
  ReferrerFilterOptions,
  RoleFilter,
  RoleFilterOptions,
  SubscriptionFilter,
  SubscriptionFilterOptions,
  UserListSortField,
  UserListSortFieldOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const UsersListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UsersListContainer })),
);

export const USERS_LIST_DEFAULT_LIMIT = 25;
export const USERS_LIST_MAX_LIMIT = 200;

const userRowSchema = z.object({
  id: z.string(),
  email: z.string(),
  privateName: z.string(),
  publicName: z.string(),
  roles: z.array(z.string()),
  isActive: z.boolean(),
  isBanned: z.boolean(),
  emailVerified: z.boolean(),
  createdAt: z.coerce.date(),
  lastActiveAt: z.coerce.date().nullable(),
  creditBalance: z.coerce.number(),
  creditsSpent: z.coerce.number(),
  totalPaidUsd: z.coerce.number(),
  paymentsCount: z.coerce.number(),
  subscriptionStatus: z.string().nullable(),
  source: z.string().nullable(),
  referredByEmail: z.string().nullable(),
  referredByUserId: z.string().nullable(),
  referralCode: z.string().nullable(),
  referralsMade: z.coerce.number(),
});

/**
 * Get Users List Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "list"],
  aliases: [USERS_LIST_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort",
  description: "get.description" as const,
  icon: "users",
  category: "account",
  subCategory: "manageUsers",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: UsersListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === SEARCH ===
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label" as const,
        description: "get.fields.search.description" as const,
        placeholder: "get.fields.search.placeholder" as const,
        columns: 12,
        schema: z.string().trim().max(200).optional(),
      }),

      // === FILTERS ===
      roles: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.fields.roles.label" as const,
        description: "get.fields.roles.description" as const,
        placeholder: "get.fields.roles.placeholder" as const,
        options: RoleFilterOptions,
        columns: 6,
        schema: z.array(z.enum(RoleFilter)).optional(),
      }),
      accountState: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.fields.accountState.label" as const,
        description: "get.fields.accountState.description" as const,
        placeholder: "get.fields.accountState.placeholder" as const,
        options: AccountStateFilterOptions,
        columns: 6,
        schema: z.array(z.enum(AccountStateFilter)).optional(),
      }),
      payer: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.payer.label" as const,
        description: "get.fields.payer.description" as const,
        placeholder: "get.fields.payer.placeholder" as const,
        options: PayerFilterOptions,
        columns: 4,
        schema: z.enum(PayerFilter).optional(),
      }),
      subscription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.subscription.label" as const,
        description: "get.fields.subscription.description" as const,
        placeholder: "get.fields.subscription.placeholder" as const,
        options: SubscriptionFilterOptions,
        columns: 4,
        schema: z.enum(SubscriptionFilter).optional(),
      }),
      lastActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.lastActive.label" as const,
        description: "get.fields.lastActive.description" as const,
        placeholder: "get.fields.lastActive.placeholder" as const,
        options: LastActiveFilterOptions,
        columns: 4,
        schema: z.enum(LastActiveFilter).optional(),
      }),
      signupFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.signupFrom.label" as const,
        description: "get.fields.signupFrom.description" as const,
        columns: 3,
        schema: dateSchema.optional(),
      }),
      signupTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.signupTo.label" as const,
        description: "get.fields.signupTo.description" as const,
        columns: 3,
        schema: dateSchema.optional(),
      }),
      creditsMin: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.creditsMin.label" as const,
        description: "get.fields.creditsMin.description" as const,
        columns: 3,
        schema: z.coerce.number().min(0).optional(),
      }),
      creditsMax: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.creditsMax.label" as const,
        description: "get.fields.creditsMax.description" as const,
        columns: 3,
        schema: z.coerce.number().min(0).optional(),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.source.label" as const,
        description: "get.fields.source.description" as const,
        placeholder: "get.fields.source.placeholder" as const,
        columns: 6,
        schema: z.string().trim().max(200).optional(),
      }),
      referralActivity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.referralActivity.label" as const,
        description: "get.fields.referralActivity.description" as const,
        placeholder: "get.fields.referralActivity.placeholder" as const,
        options: ReferrerFilterOptions,
        columns: 6,
        schema: z.enum(ReferrerFilter).optional(),
      }),

      // === SORT + PAGE ===
      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.sortBy.label" as const,
        description: "get.fields.sortBy.description" as const,
        options: UserListSortFieldOptions,
        columns: 6,
        schema: z.enum(UserListSortField).default(UserListSortField.CREATED_AT),
      }),
      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.sortOrder.label" as const,
        description: "get.fields.sortOrder.description" as const,
        options: ListSortOrderOptions,
        columns: 6,
        schema: z.enum(ListSortOrder).default(ListSortOrder.DESC),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label" as const,
        description: "get.fields.page.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).default(1),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label" as const,
        description: "get.fields.limit.description" as const,
        columns: 6,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(USERS_LIST_MAX_LIMIT)
          .default(USERS_LIST_DEFAULT_LIMIT),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      users: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.users" as const,
        schema: z.array(userRowSchema),
      }),
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.summary" as const,
        schema: z.object({
          totalCount: z.coerce.number(),
          pageCount: z.coerce.number(),
          page: z.coerce.number(),
          limit: z.coerce.number(),
          payingCount: z.coerce.number(),
          totalPaidUsd: z.coerce.number(),
          creditBalance: z.coerce.number(),
        }),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

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
      default: {},
      payingActive: {
        payer: PayerFilter.PAID,
        lastActive: LastActiveFilter.WEEK,
        sortBy: UserListSortField.TOTAL_PAID,
        sortOrder: ListSortOrder.DESC,
        limit: 20,
      },
    },
    responses: {
      default: {
        users: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "user@example.com",
            privateName: "Jane Doe",
            publicName: "jane",
            roles: ["enums.userRole.customer"],
            isActive: true,
            isBanned: false,
            emailVerified: true,
            createdAt: "2026-10-01T10:00:00.000Z",
            lastActiveAt: "2026-11-10T09:00:00.000Z",
            creditBalance: 420.5,
            creditsSpent: 1300,
            totalPaidUsd: 17.28,
            paymentsCount: 2,
            subscriptionStatus: "enums.status.active",
            source: "google.com",
            referredByEmail: null,
            referredByUserId: null,
            referralCode: null,
            referralsMade: 0,
          },
        ],
        summary: {
          totalCount: 1,
          pageCount: 1,
          page: 1,
          limit: 25,
          payingCount: 1,
          totalPaidUsd: 17.28,
          creditBalance: 420.5,
        },
      },
      payingActive: {
        users: [],
        summary: {
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
          payingCount: 0,
          totalPaidUsd: 0,
          creditBalance: 0,
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
export type UserListRow = UserListResponseOutput["users"][number];

const definitions = { GET } as const;
export default definitions;
