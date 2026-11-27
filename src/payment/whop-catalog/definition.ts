/**
 * Whop Catalog Sync - Definition
 * POST (admin): make sure every sellable variant (each subscription tier per
 * interval, each credit pack, per currency) exists in the Whop account of the
 * active WHOP_ENVIRONMENT. Objects are found by our key in their metadata, so
 * this is idempotent. Checkout also creates a missing variant on first use.
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

import { WHOP_CATALOG_SYNC_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const WhopCatalogWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WhopCatalogWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "whop-catalog"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "credit-card",
  category: "payments",
  subCategory: "Management",
  tags: ["tags.payment", "tags.admin"],
  aliases: [WHOP_CATALOG_SYNC_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: WhopCatalogWidget,
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
      environment: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.environment",
        schema: z.enum(["production", "sandbox"]),
      }),
      accountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.accountId",
        schema: z.string(),
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
      variants: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.variants",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            key: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.key",
              schema: z.string(),
            }),
            variantId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.variantId",
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
            purchaseUrl: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.purchaseUrl",
              schema: z.string().nullable(),
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
        environment: "sandbox",
        accountId: "biz_example",
        existing: 1,
        created: 0,
        missing: 1,
        variants: [
          {
            key: "ub_subscription_month_usd_800",
            variantId: "plan_example",
            productId: "prod_example",
            amount: "8.00 USD",
            status: "existing",
            purchaseUrl: "https://whop.com/checkout/plan_example",
          },
          {
            key: "ub_subscription_pro_year_eur_110000",
            variantId: "",
            productId: "prod_example",
            amount: "1100.00 EUR",
            status: "missing",
            purchaseUrl: null,
          },
        ],
      },
    },
  },
});

export type WhopCatalogSyncRequestOutput = typeof POST.types.RequestOutput;
export type WhopCatalogSyncResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
