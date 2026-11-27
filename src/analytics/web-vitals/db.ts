/**
 * Real-user Core Web Vitals: one row per metric per page view.
 * No lead or user reference: field performance only, bots excluded at ingest.
 */

import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  WebVitalDeviceDB,
  WebVitalMetricDB,
  WebVitalPageTypeDB,
  WebVitalRatingDB,
} from "./enum";

export const webVitals = pgTable(
  "web_vitals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
    metric: text("metric", { enum: WebVitalMetricDB }).notNull(),
    /** ms for LCP/INP/TTFB/FCP, unitless score for CLS */
    value: doublePrecision("value").notNull(),
    rating: text("rating", { enum: WebVitalRatingDB }).notNull(),
    pageType: text("page_type", { enum: WebVitalPageTypeDB }).notNull(),
    /** Landing path without query string, max 200 chars */
    path: text("path").notNull(),
    locale: text("locale").notNull(),
    device: text("device", { enum: WebVitalDeviceDB }).notNull(),
    /** web-vitals navigationType: navigate, reload, back-forward, prerender... */
    navigationType: text("navigation_type"),
  },
  (table) => [
    index("idx_web_vitals_recorded_at").on(table.recordedAt),
    index("idx_web_vitals_page_metric").on(
      table.pageType,
      table.metric,
      table.recordedAt,
    ),
  ],
);

export type WebVitalRow = typeof webVitals.$inferSelect;
export type NewWebVitalRow = typeof webVitals.$inferInsert;
