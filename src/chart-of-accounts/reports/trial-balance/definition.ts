/**
 * Chart of Accounts — Trial Balance Report Endpoint Definition
 * GET — sums all posted debits/credits per account as of a date
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const TrialBalanceWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TrialBalanceWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "trial-balance"],
  aliases: ["coa-trial-balance"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "trialBalance.title" as const,
  titleShort: "trialBalance.titleShort" as const,
  description: "trialBalance.description" as const,
  icon: "scale",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.journal"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: TrialBalanceWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "trialBalance.companyId.label" as const,
        description: "trialBalance.companyId.description" as const,
        placeholder: "trialBalance.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      asOfDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "trialBalance.asOfDate.label" as const,
        description: "trialBalance.asOfDate.description" as const,
        placeholder: "trialBalance.asOfDate.placeholder" as const,
        schema: z.string().date().optional(),
      }),
      periodId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "trialBalance.periodId.label" as const,
        description: "trialBalance.periodId.description" as const,
        placeholder: "trialBalance.periodId.placeholder" as const,
        schema: z.string().uuid().optional(),
      }),

      asOfDateResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "trialBalance.response.asOfDate" as const,
        schema: z.string(),
      }),
      accounts: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            accountId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "accountGet.accountId.label" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.name" as const,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.type" as const,
              schema: z.string(),
            }),
            debitTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.debitTotal" as const,
              schema: z.number(),
            }),
            creditTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.creditTotal" as const,
              schema: z.number(),
            }),
            balance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "trialBalance.response.balance" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalDebits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "trialBalance.response.totalDebits" as const,
        schema: z.number(),
      }),
      totalCredits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "trialBalance.response.totalCredits" as const,
        schema: z.number(),
      }),
      isBalanced: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "trialBalance.response.isBalanced" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "trialBalance.errors.unauthorized.title" as const,
      description: "trialBalance.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "trialBalance.errors.validation.title" as const,
      description: "trialBalance.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "trialBalance.errors.forbidden.title" as const,
      description: "trialBalance.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "trialBalance.errors.server.title" as const,
      description: "trialBalance.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "trialBalance.errors.unknown.title" as const,
      description: "trialBalance.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "trialBalance.errors.conflict.title" as const,
      description: "trialBalance.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "trialBalance.errors.network.title" as const,
      description: "trialBalance.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "trialBalance.errors.notFound.title" as const,
      description: "trialBalance.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "trialBalance.errors.unsavedChanges.title" as const,
      description: "trialBalance.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "trialBalance.success.title" as const,
    description: "trialBalance.success.description" as const,
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
        accounts: [],
        totalDebits: 0,
        totalCredits: 0,
        isBalanced: true,
      },
    },
  },
});

export type TrialBalanceRequestInput = typeof GET.types.RequestInput;
export type TrialBalanceRequestOutput = typeof GET.types.RequestOutput;
export type TrialBalanceResponseInput = typeof GET.types.ResponseInput;
export type TrialBalanceResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
