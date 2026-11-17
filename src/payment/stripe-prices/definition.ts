/**
 * Stripe Prices Ensure - Definition
 * POST (admin): make sure every sellable price (each subscription tier per
 * interval, each credit pack, per currency and language) exists in the
 * connected Stripe account. Prices are found by lookup key, so this is
 * idempotent and needs no price ids in .env. Run once per Stripe account after
 * a price change ships; checkout also creates a missing price on first use.
 * Dry run (list only) by default.
 * Client+server safe. No server imports.
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
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { STRIPE_PRICES_ENSURE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const StripePricesWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.StripePricesWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "stripe-prices"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "credit-card",
  category: "payments",
  subCategory: "Management",
  tags: ["tags.payment", "tags.admin"],
  aliases: [STRIPE_PRICES_ENSURE_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: StripePricesWidget,
    usage: { request: "data", response: true } as const,
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 12,
        schema: z.boolean().optional().default(true),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      dryRunApplied: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.dryRun",
        schema: z.boolean(),
      }),
      stripeMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.stripeMode",
        schema: z.enum(["test", "live"]),
      }),
      existing: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.existing",
        schema: z.coerce.number(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.created",
        schema: z.coerce.number(),
      }),
      missing: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.missing",
        schema: z.coerce.number(),
      }),
      prices: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.prices",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            lookupKey: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.lookupKey",
              schema: z.string(),
            }),
            priceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.priceId",
              schema: z.string(),
            }),
            productId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.productId",
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.amount",
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.status",
              schema: z.enum(["existing", "created", "missing"]),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
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
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: { dryRun: true },
    },
    responses: {
      default: {
        dryRunApplied: true,
        stripeMode: "test",
        existing: 1,
        created: 0,
        missing: 1,
        prices: [
          {
            lookupKey: "ub_subscription_plus_month_usd_2000_en",
            priceId: "price_123",
            productId: "ub_subscription_plus_en",
            amount: "20.00 USD",
            status: "existing",
          },
          {
            lookupKey: "ub_subscription_pro_month_eur_10000_de",
            priceId: "",
            productId: "ub_subscription_pro_de",
            amount: "100.00 EUR",
            status: "missing",
          },
        ],
      },
    },
  },
});

export type StripePricesEnsureRequestOutput = typeof POST.types.RequestOutput;
export type StripePricesEnsureResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
