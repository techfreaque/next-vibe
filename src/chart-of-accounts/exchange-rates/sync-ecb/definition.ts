import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const ExchangeRateSyncWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ExchangeRateSyncWidget })),
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
  path: ["chart-of-accounts", "exchange-rates", "sync-ecb"],
  aliases: ["coa-exchange-rates-sync"],
  title: "sync.title" as const,
  titleShort: "sync.title" as const,
  description: "sync.description" as const,
  category: "accounting",
  subCategory: "Ledger",
  icon: "refresh-cw" as const,
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
    render: ExchangeRateSyncWidgetLazy,
    usage: { response: true },
    children: {
      rateDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.rateDate" as const,
        schema: z.string(),
      }),
      upsertedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sync.upsertedCount" as const,
        schema: z.number().int(),
      }),
    },
  }),
  errorTypes,
  examples: {
    responses: {
      default: { rateDate: "2026-11-27", upsertedCount: 30 },
    },
  },
  successTypes: {
    title: "sync.success" as const,
    description: "sync.description" as const,
  },
});

export type ExchangeRateSyncResponse = typeof POST.types.ResponseOutput;

export default { POST };
