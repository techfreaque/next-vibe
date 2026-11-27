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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { accountingDateSchema } from "../../shared/calendar-date";
import { scopedTranslation } from "../i18n";

const ExchangeRateSetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ExchangeRateSetWidget })),
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
  path: ["chart-of-accounts", "exchange-rates", "set"],
  aliases: ["coa-exchange-rate-set"],
  title: "set.title" as const,
  titleShort: "set.title" as const,
  description: "set.description" as const,
  category: "accounting",
  subCategory: "Ledger",
  icon: "plus" as const,
  tags: ["tags.ledger" as const, "tags.fx" as const, "tags.rates" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  options: {
    mutationOptions: {
      onSuccess: async (ctx) => {
        const [{ apiClient }, listDef] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../list/definition"),
        ]);
        await apiClient.refetchEndpoint(listDef.default.GET, ctx.logger);
      },
    },
  },
  fields: customWidgetObject({
    render: ExchangeRateSetWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      baseCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.baseCurrency" as const,
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{3}$/)
          .default("EUR"),
      }),
      quoteCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.quoteCurrency" as const,
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{3}$/),
      }),
      rate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.rate" as const,
        schema: z.number().positive(),
      }),
      rateDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "fields.rateDate" as const,
        schema: accountingDateSchema,
      }),
      saved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "set.success" as const,
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: {
        baseCurrency: "EUR",
        quoteCurrency: "USD",
        rate: 1.085,
        rateDate: "2026-11-27",
      },
    },
    responses: { default: { saved: true } },
  },
  successTypes: {
    title: "set.success" as const,
    description: "set.description" as const,
  },
});

export type ExchangeRateSetRequest = typeof POST.types.RequestOutput;
export type ExchangeRateSetResponse = typeof POST.types.ResponseOutput;

export default { POST };
