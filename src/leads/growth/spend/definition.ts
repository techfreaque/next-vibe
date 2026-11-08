/**
 * Channel Spend - Endpoint Definitions
 * GET: spend per channel + period with signups, paying users and cost per
 * paying user. POST: log (upsert) what a channel cost in a period.
 * Client+server safe. No server imports.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { SpendCurrencyOptions } from "../enum";
import { scopedTranslation } from "../i18n";
import {
  GROWTH_CHANNEL_SPEND_LIST_ALIAS,
  GROWTH_CHANNEL_SPEND_LOG_ALIAS,
} from "./constants";

const ChannelSpendWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ChannelSpendWidget })),
);
const ChannelSpendLogWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ChannelSpendLogWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;

const spendRowSchema = z.object({
  id: z.uuid(),
  channel: z.string(),
  /** ISO date (YYYY-MM-DD) */
  periodStart: z.string(),
  /** ISO date (YYYY-MM-DD), inclusive */
  periodEnd: z.string(),
  amountCents: z.coerce.number(),
  currency: z.enum(CurrenciesArr),
  note: z.string().nullable(),
  signups: z.coerce.number(),
  paid: z.coerce.number(),
  costPerPaidCents: z.coerce.number().nullable(),
  costPerSignupCents: z.coerce.number().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "growth", "spend"],
  title: "spend.get.title",
  titleShort: "spend.get.titleShort",
  description: "spend.get.description",
  icon: "wallet",
  category: "leads",
  subCategory: "growth",
  tags: ["tags.growth", "tags.spend"],
  aliases: [GROWTH_CHANNEL_SPEND_LIST_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ChannelSpendWidget,
    usage: { response: true } as const,
    children: {
      rows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "spend.get.response.rows",
        schema: z.array(spendRowSchema),
      }),
    },
  }),

  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        rows: [
          {
            id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012",
            channel: "reddit",
            periodStart: "2026-10-01",
            periodEnd: "2026-10-31",
            amountCents: 25000,
            currency: "EUR",
            note: "2 promoted posts",
            signups: 40,
            paid: 5,
            costPerPaidCents: 5000,
            costPerSignupCents: 625,
          },
        ],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "growth", "spend"],
  title: "spend.post.title",
  titleShort: "spend.post.titleShort",
  description: "spend.post.description",
  icon: "wallet",
  category: "leads",
  subCategory: "growth",
  tags: ["tags.growth", "tags.spend"],
  aliases: [GROWTH_CHANNEL_SPEND_LOG_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: ChannelSpendLogWidget,
    usage: { request: "data", response: true } as const,
    children: {
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "spend.post.fields.channel.label",
        description: "spend.post.fields.channel.description",
        placeholder: "spend.post.fields.channel.placeholder",
        schema: z.string().trim().min(1).max(100),
      }),
      periodStart: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "spend.post.fields.periodStart.label",
        description: "spend.post.fields.periodStart.description",
        columns: 6,
        schema: dateSchema,
      }),
      periodEnd: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "spend.post.fields.periodEnd.label",
        description: "spend.post.fields.periodEnd.description",
        columns: 6,
        schema: dateSchema,
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "spend.post.fields.amount.label",
        description: "spend.post.fields.amount.description",
        columns: 6,
        schema: z.number().min(0).max(10_000_000),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "spend.post.fields.currency.label",
        description: "spend.post.fields.currency.description",
        options: SpendCurrencyOptions,
        columns: 6,
        schema: z.enum(CurrenciesArr).default("EUR"),
      }),
      note: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "spend.post.fields.note.label",
        description: "spend.post.fields.note.description",
        placeholder: "spend.post.fields.note.placeholder",
        schema: z.string().trim().max(200).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "spend.post.response.id",
        schema: z.uuid(),
      }),
    },
  }),

  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        channel: "reddit",
        periodStart: "2026-10-01",
        periodEnd: "2026-10-31",
        amount: 250,
        currency: "EUR",
        note: "2 promoted posts",
      },
    },
    responses: {
      default: {
        id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012",
      },
    },
  },
});

export type ChannelSpendGetResponseOutput = typeof GET.types.ResponseOutput;
export type ChannelSpendLogRequestOutput = typeof POST.types.RequestOutput;
export type ChannelSpendLogResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export default definitions;
