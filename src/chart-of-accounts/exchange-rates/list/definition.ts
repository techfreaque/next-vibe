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

import { scopedTranslation } from "../i18n";

const ExchangeRateListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ExchangeRateListWidget })),
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

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "exchange-rates", "list"],
  aliases: ["coa-exchange-rates"],
  title: "list.title" as const,
  titleShort: "list.titleShort" as const,
  description: "list.description" as const,
  category: "accounting",
  subCategory: "Ledger",
  icon: "globe" as const,
  tags: ["tags.ledger" as const, "tags.fx" as const, "tags.rates" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  options: { formOptions: { autoSubmit: true, debounceMs: 300 } },
  fields: customWidgetObject({
    render: ExchangeRateListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.currency" as const,
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^(?:[A-Z]{3})?$/)
          .optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit" as const,
        schema: z.number().int().min(1).max(200).default(50),
      }),
      rates: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.baseCurrency" as const,
              schema: z.string(),
            }),
            baseCurrency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.baseCurrency" as const,
              schema: z.string(),
            }),
            quoteCurrency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.quoteCurrency" as const,
              schema: z.string(),
            }),
            rate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.rate" as const,
              schema: z.number(),
            }),
            rateDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.rateDate" as const,
              schema: z.string(),
            }),
            source: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.source" as const,
              schema: z.enum(["ECB", "MANUAL"]),
            }),
          },
        }),
      }),
      latestDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "list.latestDate" as const,
        schema: z.string().nullable(),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: { default: { limit: 50 } },
    responses: { default: { rates: [], latestDate: null } },
  },
  successTypes: {
    title: "list.success" as const,
    description: "list.description" as const,
  },
});

export type ExchangeRateListRequest = typeof GET.types.RequestOutput;
export type ExchangeRateListResponse = typeof GET.types.ResponseOutput;

export default { GET };
