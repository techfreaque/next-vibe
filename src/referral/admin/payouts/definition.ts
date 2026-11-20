/**
 * Admin Referral Payouts Endpoint Definition
 * GET: list all payout requests (with optional status filter)
 * POST: admin action (approve / reject / complete)
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
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
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  PayoutCurrency,
  PayoutCurrencyDB,
  PayoutStatus,
  PayoutStatusDB,
  PayoutStatusOptions,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
import { adminPayoutActions } from "../../payout-actions";

const AdminPayoutsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AdminPayoutsContainer })),
);

const PayoutActionContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PayoutActionContainer })),
);

const payoutExample = {
  id: "123e4567-e89b-12d3-a456-426614174101",
  userId: "123e4567-e89b-12d3-a456-426614174000",
  userEmail: "partner@example.test",
  amountCents: 2505,
  currency: PayoutCurrency.USDC,
  status: PayoutStatus.PENDING,
  walletAddress: "0x46836cbe9fc7ec2040a2203149ca7e1a178ad013",
  adminNotes: null,
  rejectionReason: null,
  createdAt: "2026-11-18T15:20:00.000Z",
  processedAt: null,
};

/**
 * GET: list all payout requests
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "admin", "payouts"],
  title: "admin.payouts.get.title" as const,
  titleShort: "admin.payouts.get.titleShort" as const,
  description: "admin.payouts.get.description" as const,
  category: "referral" as const,
  subCategory: "Payouts" as const,
  icon: "wallet" as const,
  tags: ["tags.referral", "tags.get"],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: AdminPayoutsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().trim().max(200).optional(),
        label: "admin.payouts.fields.search.label",
        description: "admin.payouts.fields.search.description",
      }),
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.uuid().optional(),
        label: "admin.payouts.fields.userId.label",
        hidden: true,
        includeInCacheKey: true,
      }),
      requestId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.uuid().optional(),
        label: "admin.payouts.fields.requestId.label",
        hidden: true,
        includeInCacheKey: true,
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        schema: z.coerce.number().int().min(1).max(10_000_000).default(1),
        label: "admin.payouts.fields.page.label",
        hidden: true,
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        schema: z.coerce.number().int().min(1).max(100).default(20),
        label: "admin.payouts.fields.limit.label",
        hidden: true,
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "admin.payouts.fields.status.label" as const,
        description: "admin.payouts.fields.status.description" as const,
        placeholder: "admin.payouts.fields.status.all",
        schema: z.enum(PayoutStatusDB).optional(),
        options: PayoutStatusOptions,
      }),
      items: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            id: z.string(),
            userId: z.string(),
            userEmail: z.string(),
            amountCents: z.coerce.number(),
            currency: z.enum(PayoutCurrencyDB),
            status: z.enum(PayoutStatusDB),
            walletAddress: z.string().nullable(),
            adminNotes: z.string().nullable(),
            rejectionReason: z.string().nullable(),
            createdAt: z.string(),
            processedAt: z.string().nullable(),
          }),
        ),
      }),
      resultPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {},
      pending: { status: PayoutStatus.PENDING },
      approved: { status: PayoutStatus.APPROVED },
      empty: { search: "no-match@example.test" },
      secondPage: { page: 2, limit: 1 },
    },
    responses: {
      default: {
        items: [
          payoutExample,
          {
            ...payoutExample,
            id: "123e4567-e89b-12d3-a456-426614174102",
            status: PayoutStatus.APPROVED,
            currency: PayoutCurrency.BTC,
            walletAddress: "bc1q2ej7jptwr7x77wa0udhd9ckuwtnsg540jfwhnt",
            amountCents: 5030,
            createdAt: "2026-11-17T09:00:00.000Z",
            processedAt: "2026-11-18T08:00:00.000Z",
          },
        ],
        totalCount: 2,
        resultPage: 1,
        pageSize: 20,
      },
      pending: {
        items: [payoutExample],
        totalCount: 1,
        resultPage: 1,
        pageSize: 20,
      },
      approved: {
        items: [
          {
            ...payoutExample,
            id: "123e4567-e89b-12d3-a456-426614174102",
            status: PayoutStatus.APPROVED,
            currency: PayoutCurrency.BTC,
            walletAddress: "bc1q2ej7jptwr7x77wa0udhd9ckuwtnsg540jfwhnt",
            amountCents: 5030,
            processedAt: "2026-11-18T08:00:00.000Z",
          },
        ],
        totalCount: 1,
        resultPage: 1,
        pageSize: 20,
      },
      empty: { items: [], totalCount: 0, resultPage: 1, pageSize: 20 },
      secondPage: {
        items: [
          {
            ...payoutExample,
            id: "123e4567-e89b-12d3-a456-426614174103",
            status: PayoutStatus.COMPLETED,
            currency: PayoutCurrency.CREDITS,
            walletAddress: null,
            processedAt: "2026-11-18T16:20:00.000Z",
          },
        ],
        totalCount: 2,
        resultPage: 2,
        pageSize: 1,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },
  successTypes: { title: "success.title", description: "success.description" },
});

/**
 * POST: admin action (approve / reject / complete)
 */
export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "admin", "payouts"],
  title: "admin.payouts.post.title" as const,
  titleShort: "admin.payouts.post.titleShort" as const,
  description: "admin.payouts.post.description" as const,
  category: "referral" as const,
  subCategory: "Payouts" as const,
  icon: "wallet" as const,
  tags: ["tags.referral"],
  allowedRoles: [UserRole.ADMIN] as const,

  options: {
    mutationOptions: {
      onSuccess: async ({ logger }) => {
        const { buildKey } =
          await import("next-vibe/unified-ui/hooks/query-key-builder");
        const { queryClient } =
          await import("next-vibe/unified-ui/hooks/store");
        const key = buildKey<CreateApiEndpointAny>(
          "query",
          GET,
          undefined,
          logger,
          undefined,
        );
        await queryClient.invalidateQueries({
          predicate: ({ queryKey: [query] }) =>
            typeof query === "string" &&
            (query === key || query.startsWith(`${key}-`)),
        });
      },
    },
  },

  fields: customWidgetObject({
    render: PayoutActionContainer,
    usage: { request: "data", response: true },
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "admin.payouts.widget.confirmAction",
        usage: { request: "data" },
      }),
      requestId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.requestId.label" as const,
        description: "admin.payouts.fields.requestId.description" as const,
        schema: z.uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "admin.payouts.fields.action.label" as const,
        description: "admin.payouts.fields.action.description" as const,
        options: [
          { value: "approve", label: "admin.payouts.widget.approve" as const },
          { value: "reject", label: "admin.payouts.widget.reject" as const },
          {
            value: "complete",
            label: "admin.payouts.widget.complete" as const,
          },
        ],
        schema: z.enum(adminPayoutActions),
      }),
      adminNotes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.adminNotes.label" as const,
        description: "admin.payouts.fields.adminNotes.description" as const,
        schema: z.string().optional(),
      }),
      rejectionReason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.rejectionReason.label" as const,
        description:
          "admin.payouts.fields.rejectionReason.description" as const,
        schema: z.string().optional(),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        requestId: payoutExample.id,
        action: "approve" as const,
      },
    },
    responses: {
      default: { success: true, message: "Payout request approved" },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },
  successTypes: { title: "success.title", description: "success.description" },
});

export type AdminPayoutsGetResponseOutput = typeof GET.types.ResponseOutput;
export type AdminPayoutsGetRequestOutput = typeof GET.types.RequestOutput;
export type AdminPayoutsPostRequestOutput = typeof POST.types.RequestOutput;
export type AdminPayoutsPostResponseOutput = typeof POST.types.ResponseOutput;

export default { GET, POST } as const;
