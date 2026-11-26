/**
 * Chart of Accounts: Statutory Statements Endpoint Definition
 * GET: balance sheet and profit and loss in the official layout of the
 * company's country profile (Slovakia: Úč MÚJ), current and previous period.
 *
 * Countries without a layout return success with `available: false` and
 * empty statements, so the widget can show a clear empty state.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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

import { accountingDateSchema } from "../../shared/calendar-date";
import { scopedTranslation } from "./i18n";

const StatutoryStatementsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.StatutoryStatementsWidget,
  })),
);

const statementLineField = objectField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  layoutType: LayoutType.GRID,
  usage: { response: true },
  children: {
    id: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.lineId",
      schema: z.string(),
    }),
    row: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.row",
      schema: z.number().int(),
    }),
    marker: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.marker",
      schema: z.string(),
    }),
    kind: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.kind",
      schema: z.enum(["total", "group", "item"]),
    }),
    label: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.label",
      schema: z.string(),
    }),
    officialLabel: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.officialLabel",
      schema: z.string(),
    }),
    current: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.current",
      schema: z.number(),
    }),
    previous: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      label: "response.previous",
      schema: z.number(),
    }),
  },
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "statutory-statements"],
  aliases: ["coa-statutory-statements"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "file-text",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.statements"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: StatutoryStatementsWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label",
        description: "companyId.description",
        placeholder: "companyId.placeholder",
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "currency",
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^(?:[A-Z]{3})?$/)
          .optional(),
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "from.label",
        description: "from.description",
        schema: accountingDateSchema.optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "to.label",
        description: "to.description",
        schema: accountingDateSchema.optional(),
      }),

      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.company",
        schema: z.string(),
      }),
      reportCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.company",
        schema: z.string(),
      }),
      reportCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "currency",
        schema: z.string(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.country",
        schema: z.string(),
      }),
      layout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.layout",
        schema: z.enum(["SK_MUJ"]).nullable(),
      }),
      available: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.available",
        schema: z.boolean(),
      }),
      fromResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.from",
        schema: dateSchema,
      }),
      toResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.to",
        schema: dateSchema,
      }),
      previousFromResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.previousFrom",
        schema: dateSchema,
      }),
      previousToResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.previousTo",
        schema: dateSchema,
      }),
      balanceSheet: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: statementLineField,
      }),
      profitLoss: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: statementLineField,
      }),
      unmapped: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.code",
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.name",
              schema: z.string(),
            }),
            statement: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.statement",
              schema: z.enum(["balanceSheet", "profitLoss"]),
            }),
            current: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.current",
              schema: z.number(),
            }),
            previous: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.previous",
              schema: z.number(),
            }),
          },
        }),
      }),
      difference: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.difference",
        schema: z.number(),
      }),
      previousDifference: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.previousDifference",
        schema: z.number(),
      }),
      isBalanced: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.isBalanced",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  options: { formOptions: { autoSubmit: true, debounceMs: 300 } },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        from: "2025-01-01",
        to: "2025-12-31",
      },
    },
    responses: {
      default: {
        reportCompanyId: "00000000-0000-4000-8000-000000000001",
        reportCompanyName: "Example s.r.o.",
        reportCurrency: "EUR",
        country: "SK",
        layout: "SK_MUJ",
        available: true,
        fromResponse: "2025-01-01",
        toResponse: "2025-12-31",
        previousFromResponse: "2024-01-01",
        previousToResponse: "2024-12-31",
        balanceSheet: [
          {
            id: "bs01",
            row: 1,
            marker: "",
            kind: "total",
            label: "Total assets",
            officialLabel: "SPOLU MAJETOK",
            current: 12_500,
            previous: 9_800,
          },
        ],
        profitLoss: [
          {
            id: "pl38",
            row: 38,
            marker: "***",
            kind: "total",
            label: "Result for the period after tax",
            officialLabel:
              "Výsledok hospodárenia za účtovné obdobie po zdanení",
            current: 2_700,
            previous: 1_900,
          },
        ],
        unmapped: [],
        difference: 0,
        previousDifference: 0,
        isBalanced: true,
      },
    },
  },
});

export type StatutoryStatementsRequestInput = typeof GET.types.RequestInput;
export type StatutoryStatementsRequestOutput = typeof GET.types.RequestOutput;
export type StatutoryStatementsResponseInput = typeof GET.types.ResponseInput;
export type StatutoryStatementsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
