/**
 * Vibe Sense - Standard Field Helpers
 *
 * Client+server safe. No server imports.
 *
 * Provides typed DataPoint/TimeSeries schemas and standard request/response
 * field helpers used by every vibe-sense endpoint (indicators, evaluators,
 * transformers, data sources).
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

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

const TimeSeriesSchema = z.array(DataPointSchema);
export type TimeSeries = DataPoint[];

const ResolutionSchema = z.enum(GraphResolutionDB);
export type Resolution = (typeof GraphResolutionDB)[number];
export { GraphResolutionDB as ResolutionValues };

const RangeSchema = z.object({
  from: dateSchema,
  to: dateSchema,
});
export type TimeRange = z.infer<typeof RangeSchema>;

const NodeMetaSchema = z.object({
  actualResolution: z.enum(GraphResolutionDB),
  lookbackUsed: z.number().int().min(0),
  sparse: z.boolean().optional(),
});

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

const SignalEventSchema = z.object({
  timestamp: z.coerce.date(),
  fired: z.boolean(),
  meta: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

const SignalsSchema = z.array(SignalEventSchema);
export type Signals = z.infer<typeof SignalsSchema>;

const SignalStreamsSchema = z.array(z.array(SignalEventSchema));

// ─── Scoped Translation Constraint ───────────────────────────────────────────

interface AnyScoped {
  ScopedTranslationKey: string;
}

// ─── Standard Field Helpers ───────────────────────────────────────────────────

// ─── Shared return-type helpers ──────────────────────────────────────────────
// requestField / responseField produce complex inferred intersections.
// These aliases let the exported functions carry explicit return types without
// repeating the full intersection inline.

type RequestFieldReturn<
  TST extends AnyScoped,
  TConfig extends {
    type: WidgetType;
    fieldType: FieldDataType;
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
    schema: z.ZodTypeAny;
    options?: { value: string; label: string }[];
  },
> = TConfig & {
  usage: { request: "data"; response?: never };
  schemaType: "primitive";
};

type ResponseFieldReturn<
  TST extends AnyScoped,
  TConfig extends {
    type: WidgetType;
    fieldType: FieldDataType;
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
    schema: z.ZodTypeAny;
  },
> = TConfig & {
  usage: { request?: never; response: true };
  schemaType: "primitive";
};

/** Input time series - one per logical input port. Renders as an input handle. */

export function timeSeriesRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.TIME_SERIES;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof TimeSeriesSchema;
  }
> {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TIME_SERIES,
    label: opts.label,
    description: opts.description,
    schema: TimeSeriesSchema,
  });
}

/** Resolution selector - defaults to 1d. */

export function resolutionRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.SELECT;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: z.ZodDefault<typeof ResolutionSchema>;
    options: { value: string; label: string }[];
  }
> {
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

/** Time range - from/to. */

export function rangeRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.DATE_RANGE;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof RangeSchema;
  }
> {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.DATE_RANGE,
    label: opts.label,
    description: opts.description,
    schema: RangeSchema,
  });
}

/** Lookback periods - extra bars before range.from for warm-up. */

export function lookbackRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.INT;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: z.ZodDefault<z.ZodNumber>;
  }
> {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.INT,
    label: opts.label,
    description: opts.description,
    schema: z.number().int().min(0).default(0),
  });
}

/** Output time series - renders as an output handle. */

export function timeSeriesResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): ResponseFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.TIME_SERIES;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof TimeSeriesSchema;
  }
> {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TIME_SERIES,
    label: opts.label,
    description: opts.description,
    schema: TimeSeriesSchema,
  });
}

/** Output signals - evaluator result. Renders as an output handle. */

export function signalsResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): ResponseFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.SIGNALS;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof SignalsSchema;
  }
> {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalsSchema,
  });
}

/** Input signals - single signal stream. Renders as an input handle. */

export function signalsRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.SIGNALS;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof SignalsSchema;
  }
> {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalsSchema,
  });
}

/** Input signal streams - multiple signal arrays. Renders as an input handle. */

export function signalStreamsRequestField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): RequestFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.SIGNALS;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof SignalStreamsSchema;
  }
> {
  return requestField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SIGNALS,
    label: opts.label,
    description: opts.description,
    schema: SignalStreamsSchema,
  });
}

/** Node execution metadata - strictly typed. */

export function nodeMetaResponseField<TST extends AnyScoped>(
  st: TST,
  opts: {
    label: TST["ScopedTranslationKey"];
    description?: TST["ScopedTranslationKey"];
  },
): ResponseFieldReturn<
  TST,
  {
    type: WidgetType.FORM_FIELD;
    fieldType: FieldDataType.TEXT;
    label: TST["ScopedTranslationKey"];
    description: TST["ScopedTranslationKey"] | undefined;
    schema: typeof NodeMetaSchema;
  }
> {
  return responseField(st, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: opts.label,
    description: opts.description,
    schema: NodeMetaSchema,
  });
}

// ─── Data Source Built-in Widget ─────────────────────────────────────────────

const DataSourceChartWidgetLazy = lazyWidget(() =>
  import("./data-source-widget").then((m) => ({
    default: m.DataSourceChartWidget,
  })),
);

interface DataSourceWidgetReturn<TST extends AnyScoped> {
  render: typeof DataSourceChartWidgetLazy;
  noFormElement: true;
  usage: { request: "data"; response: true };
  children: {
    resolution: ReturnType<typeof resolutionRequestField<TST>>;
    range: ReturnType<typeof rangeRequestField<TST>>;
    lookback: ReturnType<typeof lookbackRequestField<TST>>;
    result: ReturnType<typeof timeSeriesResponseField<TST>>;
    meta: ReturnType<typeof nodeMetaResponseField<TST>>;
  };
  type: WidgetType.CUSTOM_WIDGET;
  schemaType: "object";
}

export function dataSourceWidget<TST extends AnyScoped>(
  st: TST,
  keys: {
    resolution: {
      label: TST["ScopedTranslationKey"];
      description?: TST["ScopedTranslationKey"];
    };
    range: {
      label: TST["ScopedTranslationKey"];
      description?: TST["ScopedTranslationKey"];
    };
    lookback: {
      label: TST["ScopedTranslationKey"];
      description?: TST["ScopedTranslationKey"];
    };
    result: {
      label: TST["ScopedTranslationKey"];
      description?: TST["ScopedTranslationKey"];
    };
    meta: {
      label: TST["ScopedTranslationKey"];
      description?: TST["ScopedTranslationKey"];
    };
  },
): DataSourceWidgetReturn<TST> {
  return customWidgetObject({
    render: DataSourceChartWidgetLazy,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      resolution: resolutionRequestField(st, keys.resolution),
      range: rangeRequestField(st, keys.range),
      lookback: lookbackRequestField(st, keys.lookback),
      result: timeSeriesResponseField(st, keys.result),
      meta: nodeMetaResponseField(st, keys.meta),
    },
  });
}
