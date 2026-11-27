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

import { scopedTranslation } from "../exchange-rates/i18n";
import { accountingDateSchema } from "../shared/calendar-date";

const FxRevaluationWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FxRevaluationWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
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
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "revaluation"],
  aliases: ["coa-fx-revaluation"],
  title: "revaluation.title" as const,
  titleShort: "revaluation.title" as const,
  description: "revaluation.description" as const,
  category: "accounting",
  subCategory: "Ledger",
  icon: "scale" as const,
  tags: ["tags.ledger" as const, "tags.fx" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  fields: customWidgetObject({
    render: FxRevaluationWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.companyId" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      asOfDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "fields.asOfDate" as const,
        schema: accountingDateSchema,
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun" as const,
        schema: z.boolean().default(true),
      }),
      postReversalNextDay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.postReversalNextDay" as const,
        schema: z.boolean().default(true),
      }),
      functionalCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "revaluation.functionalCurrency" as const,
        schema: z.string(),
      }),
      asOfDateResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.asOfDate" as const,
        schema: z.string(),
      }),
      dryRunResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.dryRun" as const,
        schema: z.boolean(),
      }),
      totalUnrealizedGainLoss: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "revaluation.totalUnrealized" as const,
        schema: z.number(),
      }),
      missingRateCurrencies: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "revaluation.missingRates" as const,
        schema: z.array(z.string()),
      }),
      journalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "revaluation.journalEntryId" as const,
        schema: z.string().nullable(),
      }),
      reversalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "revaluation.reversalEntryId" as const,
        schema: z.string().nullable(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            accountId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.account" as const,
              schema: z.string(),
            }),
            accountCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.account" as const,
              schema: z.string(),
            }),
            accountName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.account" as const,
              schema: z.string(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.currency" as const,
              schema: z.string(),
            }),
            foreignBalance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.foreignBalance" as const,
              schema: z.number(),
            }),
            carryingFunctional: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.carryingFunctional" as const,
              schema: z.number(),
            }),
            closingRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.closingRate" as const,
              schema: z.number(),
            }),
            revaluedFunctional: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.revaluedFunctional" as const,
              schema: z.number(),
            }),
            unrealizedGainLoss: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "revaluation.unrealizedDelta" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        asOfDate: "2026-12-31",
        dryRun: true,
        postReversalNextDay: true,
      },
    },
    responses: {
      default: {
        functionalCurrency: "EUR",
        asOfDateResponse: "2026-12-31",
        dryRunResponse: true,
        totalUnrealizedGainLoss: 0,
        missingRateCurrencies: [],
        journalEntryId: null,
        reversalEntryId: null,
        items: [],
      },
    },
  },
  successTypes: {
    title: "revaluation.success" as const,
    description: "revaluation.description" as const,
  },
});

export type FxRevaluationRequest = typeof POST.types.RequestOutput;
export type FxRevaluationResponse = typeof POST.types.ResponseOutput;

export default { POST };
