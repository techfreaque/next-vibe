/**
 * Chart of Accounts — Balance Sheet Report Endpoint Definition
 * GET — assets, liabilities, equity as of a date
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
  customWidgetObject,
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

const BalanceSheetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BalanceSheetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "balance-sheet"],
  aliases: ["coa-balance-sheet"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "balanceSheet.title" as const,
  titleShort: "balanceSheet.titleShort" as const,
  description: "balanceSheet.description" as const,
  icon: "list",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.journal"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BalanceSheetWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "balanceSheet.companyId.label" as const,
        description: "balanceSheet.companyId.description" as const,
        placeholder: "balanceSheet.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      asOfDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "balanceSheet.asOfDate.label" as const,
        description: "balanceSheet.asOfDate.description" as const,
        placeholder: "balanceSheet.asOfDate.placeholder" as const,
        schema: z.string().date().optional(),
      }),

      asOfDateResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "balanceSheet.response.asOfDate" as const,
        schema: z.string(),
      }),
      assets: responseArrayField(scopedTranslation, {
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
              content: "balanceSheet.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.name" as const,
              schema: z.string(),
            }),
            subtype: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.subtype" as const,
              schema: z.string(),
            }),
            balance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.balance" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalAssets: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "balanceSheet.response.totalAssets" as const,
        schema: z.number(),
      }),
      liabilities: responseArrayField(scopedTranslation, {
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
              content: "balanceSheet.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.name" as const,
              schema: z.string(),
            }),
            subtype: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.subtype" as const,
              schema: z.string(),
            }),
            balance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.balance" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalLiabilities: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "balanceSheet.response.totalLiabilities" as const,
        schema: z.number(),
      }),
      equity: responseArrayField(scopedTranslation, {
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
              content: "balanceSheet.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.name" as const,
              schema: z.string(),
            }),
            subtype: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.subtype" as const,
              schema: z.string(),
            }),
            balance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "balanceSheet.response.balance" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalEquity: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "balanceSheet.response.totalEquity" as const,
        schema: z.number(),
      }),
      isBalanced: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "balanceSheet.response.isBalanced" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "balanceSheet.errors.unauthorized.title" as const,
      description: "balanceSheet.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "balanceSheet.errors.validation.title" as const,
      description: "balanceSheet.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "balanceSheet.errors.forbidden.title" as const,
      description: "balanceSheet.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "balanceSheet.errors.server.title" as const,
      description: "balanceSheet.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "balanceSheet.errors.unknown.title" as const,
      description: "balanceSheet.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "balanceSheet.errors.conflict.title" as const,
      description: "balanceSheet.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "balanceSheet.errors.network.title" as const,
      description: "balanceSheet.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "balanceSheet.errors.notFound.title" as const,
      description: "balanceSheet.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "balanceSheet.errors.unsavedChanges.title" as const,
      description: "balanceSheet.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "balanceSheet.success.title" as const,
    description: "balanceSheet.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        asOfDate: "2026-12-31",
      },
    },
    responses: {
      default: {
        asOfDateResponse: "2026-12-31",
        assets: [],
        totalAssets: 0,
        liabilities: [],
        totalLiabilities: 0,
        equity: [],
        totalEquity: 0,
        isBalanced: true,
      },
    },
  },
});

export type BalanceSheetRequestInput = typeof GET.types.RequestInput;
export type BalanceSheetRequestOutput = typeof GET.types.RequestOutput;
export type BalanceSheetResponseInput = typeof GET.types.ResponseInput;
export type BalanceSheetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
