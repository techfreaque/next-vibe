/**
 * Subscription Stripe Sync API Definition
 * Admin repair tool: pull status / period / cancellation fields from Stripe into
 * our subscription rows (one by id or all), and expire legacy rows with no
 * Stripe id whose period ended. Dry run by default. Never touches credits.
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
  backButton,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { SubscriptionStatus, SubscriptionStatusDB } from "../../enum";
import { SUBSCRIPTION_SYNC_STRIPE_ALIAS } from "./constants";
import { SubscriptionSyncAction, SubscriptionSyncActionDB } from "./enum";
import { scopedTranslation } from "./i18n";

const SubscriptionSyncStripeContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionSyncStripeContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "admin", "sync-stripe"],
  aliases: [SUBSCRIPTION_SYNC_STRIPE_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "refresh-cw",
  category: "subscriptions",
  subCategory: "Management",
  tags: ["post.title" as const],

  fields: customWidgetObject({
    render: SubscriptionSyncStripeContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST ===
      subscriptionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.subscriptionId.label" as const,
        description: "post.fields.subscriptionId.description" as const,
        placeholder: "post.fields.subscriptionId.placeholder" as const,
        columns: 6,
        schema: z.string().trim().max(255).optional(),
      }),
      all: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.all.label" as const,
        description: "post.fields.all.description" as const,
        columns: 3,
        schema: z.boolean().default(false),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label" as const,
        description: "post.fields.dryRun.description" as const,
        columns: 3,
        schema: z.boolean().default(true),
      }),

      // === RESPONSE ===
      dryRunResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.dryRun" as const,
        schema: z.boolean(),
      }),
      scanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.scanned" as const,
        schema: z.number(),
      }),
      changed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.changed" as const,
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.failed" as const,
        schema: z.number(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.items" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            subscriptionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.subscriptionId" as const,
              schema: z.string(),
            }),
            userEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.userEmail" as const,
              schema: z.string().nullable(),
            }),
            providerSubscriptionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.providerSubscriptionId" as const,
              schema: z.string().nullable(),
            }),
            action: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.action" as const,
              schema: z.enum(SubscriptionSyncActionDB),
            }),
            statusBefore: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.statusBefore" as const,
              schema: z.enum(SubscriptionStatusDB),
            }),
            statusAfter: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.statusAfter" as const,
              schema: z.enum(SubscriptionStatusDB),
            }),
            periodEndBefore: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.periodEndBefore" as const,
              schema: z.coerce.date().nullable(),
            }),
            periodEndAfter: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.periodEndAfter" as const,
              schema: z.coerce.date().nullable(),
            }),
            note: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.item.note" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: { subscriptionId: "sub_1Qexampleqc2INl", dryRun: true },
      all: { all: true, dryRun: true },
    },
    responses: {
      default: {
        dryRunResult: true,
        scanned: 1,
        changed: 1,
        failed: 0,
        items: [
          {
            subscriptionId: "5b0c2f4e-1d7a-4c3b-9a51-2e8f6d4c7a10",
            userEmail: "user@example.com",
            providerSubscriptionId: "sub_1Qexampleqc2INl",
            action: SubscriptionSyncAction.UPDATED,
            statusBefore: SubscriptionStatus.PAST_DUE,
            statusAfter: SubscriptionStatus.CANCELED,
            periodEndBefore: new Date("2026-11-01T00:00:00.000Z"),
            periodEndAfter: new Date("2026-11-01T00:00:00.000Z"),
            note: null,
          },
        ],
      },
      all: {
        dryRunResult: true,
        scanned: 0,
        changed: 0,
        failed: 0,
        items: [],
      },
    },
  },
});

export type SubscriptionSyncStripeRequestOutput =
  typeof POST.types.RequestOutput;
export type SubscriptionSyncStripeResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
