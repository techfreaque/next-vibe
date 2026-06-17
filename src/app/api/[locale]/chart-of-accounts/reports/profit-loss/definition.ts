/**
 * Chart of Accounts — Profit & Loss Report Endpoint Definition
 * GET — revenue vs. expenses for a date range
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../i18n";

const ProfitLossWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProfitLossWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "profit-loss"],
  aliases: ["coa-profit-loss"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "profitLoss.title" as const,
  titleShort: "profitLoss.titleShort" as const,
  description: "profitLoss.description" as const,
  icon: "trending-up",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.journal"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: ProfitLossWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "profitLoss.companyId.label" as const,
        description: "profitLoss.companyId.description" as const,
        placeholder: "profitLoss.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "profitLoss.from.label" as const,
        description: "profitLoss.from.description" as const,
        placeholder: "profitLoss.from.placeholder" as const,
        schema: z.string().date().optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "profitLoss.to.label" as const,
        description: "profitLoss.to.description" as const,
        placeholder: "profitLoss.to.placeholder" as const,
        schema: z.string().date().optional(),
      }),
      periodId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "profitLoss.periodId.label" as const,
        description: "profitLoss.periodId.description" as const,
        placeholder: "profitLoss.periodId.placeholder" as const,
        schema: z.string().uuid().optional(),
      }),

      fromResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.from" as const,
        schema: z.string(),
      }),
      toResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.to" as const,
        schema: z.string(),
      }),
      revenue: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            accountId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "accountGet.accountId.label" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.name" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.amount" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalRevenue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.totalRevenue" as const,
        schema: z.number(),
      }),
      expenses: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            accountId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "accountGet.accountId.label" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.name" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "profitLoss.response.amount" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalExpenses: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.totalExpenses" as const,
        schema: z.number(),
      }),
      grossProfit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.grossProfit" as const,
        schema: z.number(),
      }),
      operatingProfit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.operatingProfit" as const,
        schema: z.number(),
      }),
      netProfit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "profitLoss.response.netProfit" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "profitLoss.errors.unauthorized.title" as const,
      description: "profitLoss.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "profitLoss.errors.validation.title" as const,
      description: "profitLoss.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "profitLoss.errors.forbidden.title" as const,
      description: "profitLoss.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "profitLoss.errors.server.title" as const,
      description: "profitLoss.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "profitLoss.errors.unknown.title" as const,
      description: "profitLoss.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "profitLoss.errors.conflict.title" as const,
      description: "profitLoss.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "profitLoss.errors.network.title" as const,
      description: "profitLoss.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "profitLoss.errors.notFound.title" as const,
      description: "profitLoss.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "profitLoss.errors.unsavedChanges.title" as const,
      description: "profitLoss.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "profitLoss.success.title" as const,
    description: "profitLoss.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        from: "2026-01-01",
        to: "2026-12-31",
      },
    },
    responses: {
      default: {
        fromResponse: "2026-01-01",
        toResponse: "2026-12-31",
        revenue: [],
        totalRevenue: 0,
        expenses: [],
        totalExpenses: 0,
        grossProfit: 0,
        operatingProfit: 0,
        netProfit: 0,
      },
    },
  },
});

export type ProfitLossRequestInput = typeof GET.types.RequestInput;
export type ProfitLossRequestOutput = typeof GET.types.RequestOutput;
export type ProfitLossResponseInput = typeof GET.types.ResponseInput;
export type ProfitLossResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
