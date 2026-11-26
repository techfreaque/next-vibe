/**
 * Users List API Route Definition
 * Admin user directory: search, business filters, sortable money/activity columns.
 * Every request field is flat and optional so CLI/MCP calls work with zero args.
 */

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
  LastActiveFilter,
  ListSortOrder,
  ListSortOrderOptions,
  PayerFilter,
  UserListSortField,
  UserListSortFieldOptions,
  UsersAudience,
} from "./enum";
import { userFilterFields } from "./filter-fields";
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
  creditsSpent30d: z.coerce.number(),
  totalPaidUsd: z.coerce.number(),
  paymentsCount: z.coerce.number(),
  subscriptionStatus: z.string().nullable(),
  plan: z.string().nullable(),
  source: z.string().nullable(),
  firstRefCode: z.string().nullable(),
  referredByEmail: z.string().nullable(),
  referredByUserId: z.string().nullable(),
  referralCode: z.string().nullable(),
  referralsMade: z.coerce.number(),
});

const emptyDirectoryExample = {
  users: [],
  summary: {
    totalCount: 0,
    pageCount: 0,
    page: 1,
    limit: 20,
    payingCount: 0,
    verifiedCount: 0,
    activeMonthCount: 0,
    bannedCount: 0,
    freeBurnCount: 0,
    totalPaidUsd: 0,
    creditBalance: 0,
    creditsSpent: 0,
    creditsSpent30d: 0,
    signupsByWeek: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    signupsThisWeek: 0,
  },
};

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

      // === FILTERS (shared with the signups report) ===
      ...userFilterFields,

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
          verifiedCount: z.coerce.number(),
          activeMonthCount: z.coerce.number(),
          bannedCount: z.coerce.number(),
          freeBurnCount: z.coerce.number(),
          totalPaidUsd: z.coerce.number(),
          creditBalance: z.coerce.number(),
          creditsSpent: z.coerce.number(),
          /** Credits spent by the matching users in the last 30 days. */
          creditsSpent30d: z.coerce.number(),
          /** Weekly signups of the matching users, last 12 complete ISO weeks, oldest first. */
          signupsByWeek: z.array(z.coerce.number()),
          /** Signups so far in the running (partial) week. */
          signupsThisWeek: z.coerce.number(),
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
      empty: { search: "no-matching-account-example", limit: 20 },
      payingActive: {
        audience: UsersAudience.HUMANS,
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
            creditsSpent30d: 120,
            totalPaidUsd: 17.28,
            paymentsCount: 2,
            subscriptionStatus: "enums.status.active",
            plan: "enums.plan.plus",
            source: "google.com",
            firstRefCode: null,
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
          verifiedCount: 1,
          activeMonthCount: 1,
          bannedCount: 0,
          freeBurnCount: 0,
          totalPaidUsd: 17.28,
          creditBalance: 420.5,
          creditsSpent: 1300,
          creditsSpent30d: 300,
          signupsByWeek: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          signupsThisWeek: 0,
        },
      },
      empty: emptyDirectoryExample,
      payingActive: emptyDirectoryExample,
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
