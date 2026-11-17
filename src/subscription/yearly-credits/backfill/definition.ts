/**
 * Yearly Credits Backfill - Definition
 * POST (admin): months of the current yearly period that passed without a
 * monthly grant (before the yearly-credits task existed). Dry run by default:
 * lists what would be granted. With dryRun=false grants one pack per
 * subscription, once (idempotent), expiring at the period end.
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

import { scopedTranslation } from "../i18n";

const YearlyCreditsBackfillWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.YearlyCreditsBackfillWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "yearly-credits", "backfill"],
  title: "backfill.title",
  titleShort: "backfill.titleShort",
  description: "backfill.description",
  icon: "calendar",
  category: "subscriptions",
  subCategory: "Management",
  tags: ["tags.subscription", "tags.admin"],
  aliases: ["yearly-credits-backfill"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: YearlyCreditsBackfillWidget,
    usage: { request: "data", response: true } as const,
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "backfill.fields.dryRun.label",
        description: "backfill.fields.dryRun.description",
        columns: 12,
        schema: z.boolean().optional().default(true),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),
      dryRunApplied: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.response.dryRun",
        schema: z.boolean(),
      }),
      subscriptions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.response.subscriptions",
        schema: z.coerce.number(),
      }),
      months: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.response.months",
        schema: z.coerce.number(),
      }),
      credits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.response.credits",
        schema: z.coerce.number(),
      }),
      rows: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "backfill.response.rows",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            subscriptionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.subscriptionId",
              schema: z.string(),
            }),
            userEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.userEmail",
              schema: z.string(),
            }),
            plan: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.plan",
              schema: z.string(),
            }),
            periodStart: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.periodStart",
              schema: z.string(),
            }),
            periodEnd: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.periodEnd",
              schema: z.string(),
            }),
            currentMonth: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.currentMonth",
              schema: z.coerce.number(),
            }),
            missedMonths: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.missedMonths",
              schema: z.coerce.number(),
            }),
            credits: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.credits",
              schema: z.coerce.number(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.response.status",
              schema: z.enum([
                "pending",
                "granted",
                "alreadyGranted",
                "nothingMissed",
              ]),
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
        subscriptions: 1,
        months: 7,
        credits: 5600,
        rows: [
          {
            subscriptionId: "04caeabf-7f12-48dd-953b-3f2c5a5c6120",
            userEmail: "subscriber@example.com",
            plan: "subscription",
            periodStart: "2026-04-09T00:00:00.000Z",
            periodEnd: "2027-04-09T00:00:00.000Z",
            currentMonth: 8,
            missedMonths: 7,
            credits: 5600,
            status: "pending",
          },
        ],
      },
    },
  },
});

export type YearlyCreditsBackfillResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
