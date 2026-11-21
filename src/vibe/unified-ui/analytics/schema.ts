/**
 * Response building blocks for analytics endpoints.
 *
 * Use these inside `responseField(..., { schema })` so every report speaks the
 * same shape. Widgets render them with the next-vibe-ui analytics components
 * (KpiTile, TimeSeriesChart, FunnelChart, BreakdownTable); CLI and MCP get a
 * text/table rendering from the same components.
 */

import { z } from "zod";

import { ANALYTICS_BUCKETS } from "./enum";

/** Echo of the resolved window (labels the period on every surface). */
export const analyticsWindowSchema = z.object({
  from: z.string(),
  to: z.string(),
  previousFrom: z.string().nullable(),
  previousTo: z.string().nullable(),
  bucket: z.enum(ANALYTICS_BUCKETS),
});
export type AnalyticsWindowEcho = z.output<typeof analyticsWindowSchema>;

/** KPI with the same metric for the previous window (null = not comparable). */
export const kpiSchema = z.object({
  value: z.number(),
  previous: z.number().nullable(),
});
export type Kpi = z.output<typeof kpiSchema>;

/**
 * Time series: one shared bucket axis, N series of equal length.
 * `key` is a stable identifier the widget maps to a translated label.
 */
export const timeSeriesSchema = z.object({
  buckets: z.array(z.string()),
  series: z.array(
    z.object({
      key: z.string(),
      values: z.array(z.number()),
    }),
  ),
});
export type TimeSeries = z.output<typeof timeSeriesSchema>;

/** Funnel step counts in order. */
export const funnelSchema = z.array(
  z.object({
    key: z.string(),
    value: z.number(),
  }),
);
export type Funnel = z.output<typeof funnelSchema>;

/**
 * Generic breakdown row: a dimension value plus named numeric metrics.
 * `key` is the raw dimension value (null bucket = "(none)").
 */
export const breakdownRowSchema = z.object({
  key: z.string().nullable(),
  metrics: z.record(z.string(), z.number()),
});
export type BreakdownRow = z.output<typeof breakdownRowSchema>;
export const breakdownSchema = z.array(breakdownRowSchema);
