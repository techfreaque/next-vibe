import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { categorySummarySchema } from "next-vibe/unified-ui/_shared/category-summary";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import overview from "../overview/definition";
import { scopedTranslation } from "../overview/i18n";

const summarySchema = categorySummarySchema(
  z.enum([
    "get.widget.kpi.signups",
    "get.widget.kpi.revenue",
    "get.widget.kpi.payers",
    "get.widget.kpi.humanLeads",
    "platformSummary.grossReceipts",
    "platformSummary.refunds",
    "platformSummary.netReceipts",
    "platformSummary.valuationCost",
    "platformSummary.valuationMargin",
    "platformSummary.newAccount",
    "platformSummary.receivedPayment",
    "platformSummary.completedTask",
    "get.widget.alerts.tasks",
    "get.widget.alerts.connections",
    "get.widget.alerts.failedPayments",
    "get.widget.alerts.disputes",
  ]),
);
const render = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PlatformSummaryWidget })),
);

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["analytics", "business", "summary"],
  aliases: ["platform-summary"],
  title: "platformSummary.title",
  titleShort: "platformSummary.title",
  description: "platformSummary.description",
  scopedTranslation,
  allowedRoles: [UserRole.ADMIN],
  category: "analytics",
  subCategory: "Business",
  icon: "bar-chart-2",
  tags: ["tags.overview"],
  fields: customWidgetObject({
    render,
    usage: { request: "data", response: true },
    children: {
      section: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        hidden: true,
        includeInCacheKey: true,
        label: "platformSummary.title",
        schema: z
          .enum([
            "acquisition",
            "money",
            "payments",
            "operations",
            "usage",
            "activity",
          ])
          .optional(),
      }),
      profile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        hidden: true,
        includeInCacheKey: true,
        label: "platformSummary.title",
        schema: z.literal("home").optional(),
      }),
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "platformSummary.title",
        schema: summarySchema,
      }),
    },
  }),
  errorTypes: overview.GET.errorTypes,
  successTypes: {
    title: "platformSummary.title",
    description: "platformSummary.description",
  },
  examples: {
    requests: { default: {} },
    responses: {
      default: {
        summary: {
          from: "2026-10-23",
          to: "2026-11-21",
          kpis: [
            {
              label: "get.widget.kpi.signups",
              value: 28,
              previous: 25,
              format: "number",
              drill: { alias: "acquisition-report" },
            },
            {
              label: "get.widget.kpi.revenue",
              value: 2450,
              previous: 1800,
              format: "money",
              currency: "USD",
              drill: { alias: "revenue-report" },
            },
          ],
          attentionAvailable: true,
          attention: [
            {
              label: "get.widget.alerts.tasks",
              count: 1,
              severity: "warning",
              drill: { alias: "task-health" },
            },
          ],
          recent: [],
        },
      },
    },
  },
});

export type PlatformSummaryInput = typeof GET.types.RequestOutput;
export type PlatformSummaryOutput = typeof GET.types.ResponseOutput;
export default { GET };
