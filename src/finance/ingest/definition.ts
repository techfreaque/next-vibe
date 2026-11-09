/**
 * Finance Ingest - Endpoint Definition
 * POST: read-only pull of revenue (Stripe, NOWPayments) and upstream balances
 * (inference providers), daily margin rollup and anomaly alerts. Also the cron
 * task body (see task.ts). Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { FINANCE_INGEST_ALIAS } from "../constants";
import { financeErrorTypes } from "../error-types";
import {
  AlertSeverityDB,
  CostCoverageDB,
  FinanceAlertTypeDB,
  FinanceSourceDB,
  IngestScope,
  IngestScopeOptions,
  SourceRunStatusDB,
} from "../enum";
import { scopedTranslation } from "../i18n";

const FinanceIngestContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FinanceIngestContainer })),
);

const sourceReportSchema = z.object({
  source: z.enum(FinanceSourceDB),
  kind: z.enum(["revenue", "provider"]),
  status: z.enum(SourceRunStatusDB),
  reason: z.string().nullable(),
  balanceUsd: z.number().nullable(),
  spendUsd: z.number().nullable(),
  events: z.number(),
});

const dayReportSchema = z.object({
  day: z.string(),
  grossRevenueUsd: z.number(),
  refundsUsd: z.number(),
  disputesUsd: z.number(),
  netRevenueUsd: z.number(),
  // null when cost coverage is NONE (cost unknown, never faked to 0).
  upstreamCostUsd: z.number().nullable(),
  // null unless cost coverage is COMPLETE (a margin off partial cost misleads).
  grossMarginUsd: z.number().nullable(),
  grossMarginPct: z.number().nullable(),
  internalBilledUsd: z.number(),
  costCoverage: z.enum(CostCoverageDB),
});

const alertReportSchema = z.object({
  type: z.enum(FinanceAlertTypeDB),
  severity: z.enum(AlertSeverityDB),
  subject: z.string(),
  message: z.string(),
  delivery: z.string(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "ingest"],
  aliases: [FINANCE_INGEST_ALIAS] as const,
  title: "ingest.title",
  titleShort: "ingest.titleShort",
  description: "ingest.description",
  icon: "refresh-cw",
  category: "finance",
  subCategory: "Monitoring",
  tags: ["tags.finance"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: FinanceIngestContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      scope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "ingest.fields.scope.label",
        description: "ingest.fields.scope.description",
        options: IngestScopeOptions,
        columns: 6,
        schema: z.enum(IngestScope).default(IngestScope.ALL),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "ingest.fields.dryRun.label",
        description: "ingest.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      windowDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "ingest.fields.windowDays.label",
        description: "ingest.fields.windowDays.description",
        columns: 6,
        schema: z.number().int().min(1).max(30).optional(),
      }),
      backfillFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ingest.fields.backfillFrom.label",
        description: "ingest.fields.backfillFrom.description",
        columns: 6,
        schema: z.string().optional(),
      }),
      backfillTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ingest.fields.backfillTo.label",
        description: "ingest.fields.backfillTo.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      ranAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.ranAt",
        schema: z.string(),
      }),
      dryRunResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.dryRun",
        schema: z.boolean(),
      }),
      sources: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.sources",
        schema: z.array(sourceReportSchema),
      }),
      days: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.days",
        schema: z.array(dayReportSchema),
      }),
      alertsRaised: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.alertsRaised",
        schema: z.number(),
      }),
      alertsSuppressed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.alertsSuppressed",
        schema: z.number(),
      }),
      alerts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ingest.response.alerts",
        schema: z.array(alertReportSchema),
      }),
    },
  }),

  errorTypes: financeErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: { scope: IngestScope.ALL, dryRun: true },
    },
    responses: {
      default: {
        ranAt: "2026-11-08T06:00:00.000Z",
        dryRunResult: true,
        sources: [
          {
            source: "enums.source.openrouter",
            kind: "provider",
            status: "enums.runStatus.ok",
            reason: null,
            balanceUsd: 11.77,
            spendUsd: 0.42,
            events: 0,
          },
        ],
        days: [],
        alertsRaised: 0,
        alertsSuppressed: 0,
        alerts: [],
      },
    },
  },
});

export type FinanceIngestRequestOutput = typeof POST.types.RequestOutput;
export type FinanceIngestResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
