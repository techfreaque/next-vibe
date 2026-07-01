/**
 * Chart of Accounts — Account Ledger Endpoint Definition
 * GET — all journal entry lines for an account with running balance
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { LineTypeOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";

const CoaLedgerWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaLedgerWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "ledger", "[accountId]"],
  aliases: ["coa-ledger"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "ledger.title" as const,
  titleShort: "ledger.titleShort" as const,
  description: "ledger.description" as const,
  icon: "file-text",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger" as const],

  fields: customWidgetObject({
    render: CoaLedgerWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      accountId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "ledger.accountId.label" as const,
        description: "ledger.accountId.description" as const,
        placeholder: "ledger.accountId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/chart-of-accounts/account/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "ledger.dateFrom.label" as const,
        description: "ledger.dateFrom.description" as const,
        placeholder: "ledger.dateFrom.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "ledger.dateTo.label" as const,
        description: "ledger.dateTo.description" as const,
        placeholder: "ledger.dateTo.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "ledger.page.label" as const,
        columns: 6,
        schema: z.number().int().min(1).default(1),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "ledger.pageSize.label" as const,
        columns: 6,
        schema: z.number().int().min(1).max(100).default(20),
      }),
      lines: responseArrayField(scopedTranslation, {
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
              label: "ledger.response.id" as const,
              schema: z.string(),
            }),
            entryId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.entryId" as const,
              schema: z.string(),
            }),
            entryNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.entryNumber" as const,
              schema: z.string(),
            }),
            date: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.date" as const,
              schema: dateSchema,
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.description" as const,
              schema: z.string().nullable(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "ledger.response.type" as const,
              options: LineTypeOptions,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.amount" as const,
              schema: z.number(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.currency" as const,
              schema: z.string(),
            }),
            runningBalance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "ledger.response.runningBalance" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ledger.response.totalCount" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

  successTypes: {
    title: "ledger.success.title" as const,
    description: "ledger.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        accountId: "00000000-0000-0000-0000-000000000020",
      },
    },
    requests: {
      default: {
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        lines: [],
        totalCount: 0,
      },
    },
  },
});

export type CoaLedgerRequestInput = typeof GET.types.RequestInput;
export type CoaLedgerRequestOutput = typeof GET.types.RequestOutput;
export type CoaLedgerResponseInput = typeof GET.types.ResponseInput;
export type CoaLedgerResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
