/**
 * Model Catalog Scan - report shape.
 * One schema shared by the endpoint response, the stored jsonb report and the
 * email composer, so a coding session reads exactly what the email said.
 */

import { z } from "zod";

export const catalogModelKindSchema = z.enum([
  "chat",
  "image",
  "video",
  "audio",
  "other",
]);
export type CatalogModelKind = z.infer<typeof catalogModelKindSchema>;

/** An upstream model none of our definitions references yet. */
export const catalogNewModelSchema = z.object({
  source: z.string(),
  apiProvider: z.string(),
  providerModel: z.string(),
  name: z.string(),
  kind: catalogModelKindSchema,
  createdAt: z.string().nullable(),
  /** USD per 1M tokens (token-billed models only) */
  inputUsdPer1M: z.number().nullable(),
  outputUsdPer1M: z.number().nullable(),
  contextWindow: z.number().nullable(),
  /** Id, name or provider category suggests an uncensored / roleplay model */
  uncensored: z.boolean(),
});
export type CatalogNewModel = z.infer<typeof catalogNewModelSchema>;

/** A live provider price or context window that drifted from our definition. */
export const catalogPriceChangeSchema = z.object({
  modelId: z.string(),
  apiProvider: z.string(),
  providerModel: z.string(),
  field: z.string(),
  oldValue: z.number(),
  newValue: z.number(),
  changePercent: z.number(),
  /** Implausible jump: likely a broken price fetcher */
  suspect: z.boolean(),
  source: z.string(),
});
export type CatalogPriceChange = z.infer<typeof catalogPriceChangeSchema>;

/** One of our provider entries whose id is gone from the provider's list. */
export const catalogMissingModelSchema = z.object({
  modelId: z.string(),
  apiProvider: z.string(),
  providerModel: z.string(),
  legacy: z.boolean(),
});
export type CatalogMissingModel = z.infer<typeof catalogMissingModelSchema>;

/** Upstream model with a published shutdown date that we still reference. */
export const catalogDeprecationSchema = z.object({
  modelId: z.string(),
  apiProvider: z.string(),
  providerModel: z.string(),
  expiresAt: z.string(),
  legacy: z.boolean(),
});
export type CatalogDeprecation = z.infer<typeof catalogDeprecationSchema>;

export const catalogSourceStatusSchema = z.object({
  source: z.string(),
  ok: z.boolean(),
  modelCount: z.number(),
  error: z.string().nullable(),
});
export type CatalogSourceStatus = z.infer<typeof catalogSourceStatusSchema>;

export const catalogReportSchema = z.object({
  /** New upstream models created after this instant were reported */
  newSince: z.string(),
  newModels: z.array(catalogNewModelSchema),
  priceChanges: z.array(catalogPriceChangeSchema),
  missingUpstream: z.array(catalogMissingModelSchema),
  deprecations: z.array(catalogDeprecationSchema),
  sources: z.array(catalogSourceStatusSchema),
});
export type CatalogReport = z.infer<typeof catalogReportSchema>;

export const catalogScanSummarySchema = z.object({
  id: z.string(),
  scannedAt: z.string(),
  newModels: z.number(),
  priceChanges: z.number(),
  missingUpstream: z.number(),
  deprecations: z.number(),
  sourceErrors: z.number(),
  emailedTo: z.array(z.string()),
  emailError: z.string().nullable(),
});
export type CatalogScanSummary = z.infer<typeof catalogScanSummarySchema>;
