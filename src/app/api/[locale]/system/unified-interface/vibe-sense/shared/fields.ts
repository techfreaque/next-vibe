/**
 * Vibe Sense — Standard Field Helpers
 *
 * Client+server safe. No server imports.
 *
 * Provides typed DataPoint/TimeSeries schemas and standard request/response
 * field helpers used by every vibe-sense endpoint (indicators, evaluators,
 * transformers, data sources).
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import {
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { GraphResolution, GraphResolutionDB } from "../enum";

// ─── Core Data Types ─────────────────────────────────────────────────────────

export const DataPointSchema = z.object({
  timestamp: dateSchema,
  value: z.number(),
  meta: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

export type DataPoint = z.infer<typeof DataPointSchema>;

export const TimeSeriesSchema = z.array(DataPointSchema);
export type TimeSeries = DataPoint[];

export const ResolutionSchema = z.enum(GraphResolutionDB);
export type Resolution = (typeof GraphResolutionDB)[number];
export { GraphResolutionDB as ResolutionValues };

export const RangeSchema = z.object({
  from: dateSchema,
  to: dateSchema,
});
export type TimeRange = z.infer<typeof RangeSchema>;

export const NodeMetaSchema = z.object({
  actualResolution: z.enum(GraphResolutionDB),
  lookbackUsed: z.number().int().min(0),
  sparse: z.boolean().optional(),
});
export type NodeMeta = z.infer<typeof NodeMetaSchema>;

// ─── Resolution Milliseconds ─────────────────────────────────────────────────

export const RESOLUTION_MS: Record<Resolution, number> = {
  [GraphResolution.ONE_MINUTE]: 60_000,
  [GraphResolution.THREE_MINUTES]: 180_000,
  [GraphResolution.FIVE_MINUTES]: 300_000,
  [GraphResolution.FIFTEEN_MINUTES]: 900_000,
  [GraphResolution.THIRTY_MINUTES]: 1_800_000,
  [GraphResolution.ONE_HOUR]: 3_600_000,
  [GraphResolution.FOUR_HOURS]: 14_400_000,
  [GraphResolution.ONE_DAY]: 86_400_000,
  [GraphResolution.ONE_WEEK]: 604_800_000,
  [GraphResolution.ONE_MONTH]: 2_592_000_000,
};

// ─── Signal Event ─────────────────────────────────────────────────────────────

/** An evaluator output event */
export interface SignalEvent {
  timestamp: Date;
  fired: boolean;
  meta?: Record<string, string | number | boolean | null>;
}

export const SignalEventSchema = z.object({
  timestamp: z.coerce.date(),
  fired: z.boolean(),
  meta: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

export const SignalsSchema = z.array(SignalEventSchema);
export type Signals = z.infer<typeof SignalsSchema>;

export const SignalStreamsSchema = z.array(z.array(SignalEventSchema));
export type SignalStreams = z.infer<typeof SignalStreamsSchema>;

// ─── Scoped Translation Constraint ───────────────────────────────────────────

interface AnyScoped {
  ScopedTranslationKey: string;
}

// ─── Standard Field Helpers ───────────────────────────────────────────────────

/** Input time series — one per logical input port. Renders as an input handle. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function timeSeriesRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TIME_SERIES,
    label: opts.label,
    description: opts.description,
    schema: TimeSeriesSchema,
  });
}

/** Resolution selector — defaults to 1d. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function resolutionRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: opts.label,
    description: opts.description,
    schema: ResolutionSchema.default(GraphResolution.ONE_DAY),
    options: Object.values(GraphResolution).map((v) => ({
      value: v,
      label: v,
    })),
  });
}

/** Time range — from/to. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function rangeRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.DATE_RANGE,
    label: opts.label,
    description: opts.description,
    schema: RangeSchema,
  });
}

/** Lookback periods — extra bars before range.from for warm-up. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function lookbackRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.INT,
    label: opts.label,
    description: opts.description,
    schema: z.number().int().min(0).default(0),
  });
}

/** Output time series — renders as an output handle. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function timeSeriesResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TIME_SERIES,
    label: opts.label,
    description: opts.description,
    schema: TimeSeriesSchema,
  });
}

/** Output signals — evaluator result. Renders as an output handle. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function signalsResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalsSchema,
  });
}

/** Input signals — single signal stream. Renders as an input handle. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function signalsRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalsSchema,
  });
}

/** Input signal streams — multiple signal arrays. Renders as an input handle. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function signalStreamsRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalStreamsSchema,
  });
}

/** Node execution metadata — strictly typed. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function nodeMetaResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
) {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: opts.label,
    description: opts.description,
    schema: NodeMetaSchema,
  });
}
