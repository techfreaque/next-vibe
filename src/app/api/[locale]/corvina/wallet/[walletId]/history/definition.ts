import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const WalletHistoryContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletHistoryContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "wallet", "[walletId]", "history"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "clock",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_history"],

  fields: customWidgetObject({
    render: WalletHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      walletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.walletId.label" as const,
        description: "get.walletId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(10),
      }),
      orderBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orderBy.label" as const,
        description: "get.orderBy.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      orderDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orderDir.label" as const,
        description: "get.orderDir.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactions: responseArrayField(scopedTranslation, {
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
              content: "get.response.transactions.id" as const,
              schema: z.number(),
            }),
            executionResult: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.transactions.executionResult" as const,
              schema: z.string(),
            }),
            failureReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.failureReason" as const,
              schema: z.string().nullable(),
            }),
            sourceWalletId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.sourceWalletId" as const,
              schema: z.string().nullable(),
            }),
            targetWalletId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.targetWalletId" as const,
              schema: z.string().nullable(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.amount" as const,
              schema: z.number(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.createdAt" as const,
              schema: dateSchema.nullable(),
            }),
            authorizedBy: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.authorizedBy" as const,
              schema: z.string().nullable(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.description" as const,
              schema: z.string().nullable(),
            }),
            orderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.orderId" as const,
              schema: z.string().nullable(),
            }),
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.transactions.orgResourceId" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.coerce.number(),
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        walletId: "wallet-abc-123",
        page: 0,
        pageSize: 10,
      },
    },
    responses: {
      default: {
        transactions: [
          {
            id: 1001,
            executionResult: "SUCCESS",
            failureReason: null,
            sourceWalletId: "wallet-abc-123",
            targetWalletId: null,
            amount: -50,
            createdAt: new Date("2026-05-01T10:00:00Z"),
            authorizedBy: "admin@example.com",
            description: "Credit deduction for device usage",
            orderId: "order-xyz-789",
            orgResourceId: "exorde.connex.connectika",
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type WalletHistoryRequestOutput = typeof GET.types.RequestOutput;
export type WalletHistoryResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
