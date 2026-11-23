/**
 * Credits History API Route Definition
 * Defines endpoint for retrieving credit transaction history
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
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
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { paginationField } from "next-vibe/unified-ui/widgets/containers/pagination/types";
import { z } from "zod";

import { CreditTransactionType, CreditTransactionTypeOptions } from "../enum";
import { scopedTranslation } from "../i18n";
import { CREDITS_HISTORY_ALIAS } from "./constants";

const CreditHistoryContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreditHistoryContainer })),
);
/**
 * Get Credit History Endpoint (GET)
 * Retrieves paginated credit transaction history
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits", "history"],
  aliases: [CREDITS_HISTORY_ALIAS],
  title: "history.get.title" as const,
  titleShort: "history.get.titleShort" as const,
  description: "history.get.description" as const,
  category: "credits" as const,
  subCategory: "Credits" as const,
  tags: ["tags.credits" as const, "tags.balance" as const],
  icon: "wallet" as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditHistoryContainer,
    usage: { response: true, request: "data" },
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true, request: "data" },
      }),
      // === ADMIN: optional target user override ===
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.targetUserId.label" as const,
        hidden: true,
        schema: z.guid().optional(),
        includeInCacheKey: true,
      }),

      // === ADMIN: optional target lead override ===
      targetLeadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.targetLeadId.label" as const,
        hidden: true,
        schema: z.guid().optional(),
        includeInCacheKey: true,
      }),

      // === ADMIN: look up a ledger by email, user ID or lead ID ===
      target: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.target.label" as const,
        description: "history.get.target.description" as const,
        placeholder: "history.get.target.placeholder" as const,
        hidden: true,
        schema: z.string().trim().max(254).optional(),
        includeInCacheKey: true,
      }),

      // === ADMIN: ledger filters (applied server-side for targeted views) ===
      packId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.packId",
        hidden: true,
        schema: z.guid().optional(),
        includeInCacheKey: true,
      }),
      typeFilter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "history.get.typeFilter.label" as const,
        options: CreditTransactionTypeOptions,
        hidden: true,
        schema: z.enum(CreditTransactionType).optional(),
        includeInCacheKey: true,
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.from" as const,
        hidden: true,
        schema: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        includeInCacheKey: true,
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.to" as const,
        hidden: true,
        schema: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        includeInCacheKey: true,
      }),

      // === CURRENT POOL BALANCE (admin targeted views) ===
      currentBalance: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "history.get.currentBalance" as const,
        schema: z
          .object({ paid: z.number(), free: z.number() })
          .nullable()
          .optional(),
      }),

      // === RECENT PLATFORM ACTIVITY (admin without a target) ===
      recent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "history.get.recent" as const,
        schema: z
          .array(
            z.object({
              id: z.string(),
              createdAt: dateSchema,
              amount: z.coerce.number(),
              label: z.string(),
              detail: z.string().nullable(),
              email: z.string().nullable(),
              userId: z.string().nullable(),
              leadId: z.string().nullable(),
            }),
          )
          .optional(),
      }),

      // === PERIOD TOTALS (admin targeted views, same filters as the list) ===
      totals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "history.get.totals" as const,
        schema: z
          .object({ spent: z.number(), granted: z.number() })
          .nullable()
          .optional(),
      }),

      // === RESOLVED ADMIN TARGET (echo, so the view names who it shows) ===
      resolvedTarget: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "history.get.resolvedTarget" as const,
        schema: z
          .object({
            userId: z.string().nullable(),
            leadId: z.string().nullable(),
            email: z.string().nullable(),
            isPartner: z.boolean().optional(),
          })
          .nullable()
          .optional(),
      }),

      // === TRANSACTION LIST ===
      transactions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.id" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.amount" as const,
              schema: z.coerce.number(),
            }),
            balanceAfter: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.transaction.balanceAfter.content" as const,
              schema: z.coerce.number(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.type" as const,
              schema: z.string().optional(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.type" as const,
              schema: z.string().optional(),
            }),
            paymentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.payment" as const,
              schema: z.string().nullable().optional(),
            }),
            typeKey: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.type" as const,
              schema: z.string().optional(),
            }),
            detail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.detail" as const,
              schema: z.string().nullable().optional(),
            }),
            messageId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "history.get.messageId" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.DATE,
              label: "history.get.createdAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),

      paginationInfo: paginationField({
        order: 2,
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "history.get.success.title" as const,
    description: "history.get.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "history.get.errors.validation.title" as const,
      description: "history.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "history.get.errors.network.title" as const,
      description: "history.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "history.get.errors.unauthorized.title" as const,
      description: "history.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "history.get.errors.forbidden.title" as const,
      description: "history.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "history.get.errors.notFound.title" as const,
      description: "history.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "history.get.errors.server.title" as const,
      description: "history.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "history.get.errors.unknown.title" as const,
      description: "history.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "history.get.errors.unsavedChanges.title" as const,
      description: "history.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "history.get.errors.conflict.title" as const,
      description: "history.get.errors.conflict.description" as const,
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        paginationInfo: {
          page: 1,
          limit: 50,
        },
      },
      adminLookup: {
        target: "customer@example.test",
        paginationInfo: {
          page: 1,
          limit: 50,
        },
      },
      adminView: {
        targetLeadId: "123e4567-e89b-12d3-a456-426614174001",
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
        paginationInfo: {
          page: 1,
          limit: 50,
        },
      },
    },
    responses: {
      adminLedger: {
        transactions: [
          {
            id: "323e4567-e89b-12d3-a456-426614174000",
            amount: -2505,
            balanceAfter: 211.823015,
            type: CreditTransactionType.REFERRAL_PAYOUT,
            messageId: null,
            createdAt: "2026-11-18T15:20:00.000Z",
          },
          {
            id: "423e4567-e89b-12d3-a456-426614174000",
            amount: -0.176985,
            balanceAfter: 2716.823015,
            type: CreditTransactionType.USAGE,
            label: CreditTransactionType.USAGE,
            detail: ChatModelId.GPT_5_MINI,
            messageId: "msg-423e4567-e89b-12d3-a456-426614174000",
            createdAt: "2026-11-18T14:00:00.000Z",
          },
          {
            id: "523e4567-e89b-12d3-a456-426614174000",
            amount: 137,
            balanceAfter: 2717,
            type: "history.get.bonusGrant",
            messageId: null,
            createdAt: "2026-11-17T10:00:00.000Z",
          },
        ],
        paginationInfo: { totalCount: 3, pageCount: 1 },
      },
      empty: {
        transactions: [],
        paginationInfo: { totalCount: 0, pageCount: 0 },
      },
      default: {
        transactions: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            amount: -5,
            balanceAfter: 1495,
            type: `${CreditTransactionType.USAGE} (${ChatModelId.GPT_5_MINI})`,
            messageId: "msg-123e4567-e89b-12d3-a456-426614174000",
            createdAt: "2025-10-16T12:00:00.000Z",
          },
          {
            id: "223e4567-e89b-12d3-a456-426614174000",
            amount: 500,
            balanceAfter: 1500,
            type: CreditTransactionType.PURCHASE,
            messageId: null,
            createdAt: "2025-10-15T10:00:00.000Z",
          },
        ],
        paginationInfo: {
          totalCount: 2,
          pageCount: 1,
        },
      },
    },
  },
});

export default { GET } as const;

export type CreditsHistoryGetRequestOutput = typeof GET.types.RequestOutput;
export type CreditsHistoryGetResponseOutput = typeof GET.types.ResponseOutput;
