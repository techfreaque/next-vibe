# Vibe Sense Data Source Pattern

Guide to writing endpoints that feed time-series data into the Vibe Sense graph engine.

## Overview

A **data source** is a standard endpoint (definition + repository + route) that the graph engine can call as a node. What makes it a data source is using the **standard field helpers** from `vibe-sense/shared/fields.ts` for its request and response fields - no custom transforms needed, the engine can wire it directly.

Endpoints are organized by role:

- **Data sources** - fetch raw time-series (`result: TimeSeries`)
- **Indicators** - transform time-series (EMA, SMA, Bollinger Bands)
- **Evaluators** - produce signals (`signals: SignalEvent[]`)
- **Transformers** - combine or reshape series
- **Actions** - side-effect endpoints (send alert, trigger AI run)

There is a convention to group data sources under a `data-sources/` folder when a module has many, but it is not required.

## Data Source Definition

```typescript
// data-sources/cron-executions-failed/definition.ts

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CRON_EXECUTIONS_FAILED_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [CRON_EXECUTIONS_FAILED_ALIAS],
  method: Methods.POST,
  path: [
    "system",
    "unified-interface",
    "data-sources",
    "cron-executions-failed",
  ],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsDataSources",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "post.fields.resolution.label",
        description: "post.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "post.fields.range.label",
        description: "post.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "post.fields.lookback.label",
        description: "post.fields.lookback.description",
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.result.label",
        description: "post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "post.fields.meta.label",
        description: "post.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    /* all 9 error types required */
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        range: { from: new Date("2024-01-01"), to: new Date("2024-01-31") },
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
```

## Standard Field Helpers

All helpers are exported from `vibe-sense/shared/fields.ts`. Import from there, not from individual files.

### Request Fields

| Helper                                | Type                          | Purpose                                              |
| ------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| `resolutionRequestField(st, opts)`    | `SELECT` (GraphResolutionDB)  | Time series resolution (1m, 5m, 1h, 1d…)             |
| `rangeRequestField(st, opts)`         | `DATE_RANGE` (`{ from, to }`) | Time range to fetch                                  |
| `lookbackRequestField(st, opts)`      | `INT` (≥0, default 0)         | Extra bars before `range.from` for warm-up           |
| `timeSeriesRequestField(st, opts)`    | `TIME_SERIES`                 | Upstream time series input (indicators/transformers) |
| `signalsRequestField(st, opts)`       | `SIGNALS`                     | Upstream signal stream input                         |
| `signalStreamsRequestField(st, opts)` | `SIGNALS`                     | Multiple signal stream inputs                        |

### Response Fields

| Helper                              | Type          | Purpose                                        |
| ----------------------------------- | ------------- | ---------------------------------------------- |
| `timeSeriesResponseField(st, opts)` | `TIME_SERIES` | Primary output series                          |
| `signalsResponseField(st, opts)`    | `SIGNALS`     | Signal events output (evaluators)              |
| `nodeMetaResponseField(st, opts)`   | `TEXT`        | Execution metadata (resolution used, lookback) |

### Data Types

```typescript
// DataPoint - one bar of data
{ timestamp: Date; value: number; meta?: Record<string, string | number | boolean | null> }

// TimeSeries - array of DataPoints
DataPoint[]

// NodeMeta - returned with every result
{ actualResolution: Resolution; lookbackUsed: number; sparse?: boolean }

// SignalEvent - evaluator output
{ timestamp: Date; fired: boolean; meta?: Record<...> }
```

## Graph Behavior Markers (`graphNode`)

The `createEndpoint` call accepts an optional `graphNode` property that tells the engine how to treat this node:

```typescript
createEndpoint({
  // ...
  graphNode: {
    backtestMode?: "bulk" | "rolling";  // default: "bulk"
    sideEffect?: boolean;               // default: false
    cacheable?: boolean;                // default: true
  },
});
```

| Marker                    | Default  | When to set                                                        |
| ------------------------- | -------- | ------------------------------------------------------------------ |
| `backtestMode: "rolling"` | `"bulk"` | PnL tracking, position sizing - called bar-by-bar                  |
| `sideEffect: true`        | `false`  | Sends email, triggers AI run, writes to DB - skipped in chart mode |
| `cacheable: false`        | `true`   | Live prices, randomized output, stateful endpoints                 |

**By role:**

- Data sources, indicators, transformers: `{ cacheable: true }` (default - omit marker)
- Evaluators: `{ cacheable: true }` (default - omit marker)
- Actions: `{ sideEffect: true, cacheable: false }`
- Rolling simulations: `{ backtestMode: "rolling" }`

## Repository Pattern

Data source repositories follow the standard pattern - return `ResponseType<T>`, no throw:

```typescript
// data-sources/cron-executions-failed/repository.ts

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ResponseType, success, fail } from "@/app/api/[locale]/shared/types/endpoint-types";
import type { NodeMeta, TimeSeries } from "../../shared/fields";

interface CronExecutionsFailedRequest {
  resolution: Resolution;
  range: { from: Date; to: Date };
  lookback: number;
}

interface CronExecutionsFailedResponse {
  result: TimeSeries;
  meta: NodeMeta;
}

export async function getCronExecutionsFailed(
  request: CronExecutionsFailedRequest,
  logger: EndpointLogger,
): Promise<ResponseType<CronExecutionsFailedResponse>> {
  try {
    const data = await db.query. /* ... fetch time-series from DB ... */;
    return success({
      result: data.map((row) => ({
        timestamp: row.timestamp,
        value: row.count,
      })),
      meta: {
        actualResolution: request.resolution,
        lookbackUsed: request.lookback,
      },
    });
  } catch (err) {
    logger.error("getCronExecutionsFailed failed", err);
    return fail({ message: "Failed to fetch data", errorType: EndpointErrorTypes.SERVER_ERROR });
  }
}
```

## Folder Convention

When a module produces multiple data sources, group them:

```
<module>/
  data-sources/
    <metric-name>/
      constants.ts
      definition.ts
      i18n/
        en/index.ts
        de/index.ts
        pl/index.ts
        index.ts
      repository.ts
      route.ts
```

Single data sources can live at the module root without a `data-sources/` wrapper.

## Aliases

Every data source needs a stable alias (used in graph config `endpointPath`):

```typescript
// constants.ts
export const CRON_EXECUTIONS_FAILED_ALIAS = "cron_executions_failed" as const;
```

Register the alias in `createEndpoint({ aliases: [MY_ALIAS] })`. The alias appears in `system/generated/alias-map.ts` after `vibe generate-all`.

## Multi-output Endpoints (Indicators)

Indicators that produce multiple named series (e.g. Bollinger upper/middle/lower) use multiple `timeSeriesResponseField` children:

```typescript
children: {
  source: timeSeriesRequestField(st, { label: "..." }),        // input
  upper: timeSeriesResponseField(st, { label: "Upper Band" }), // named output
  middle: timeSeriesResponseField(st, { label: "Middle" }),
  lower: timeSeriesResponseField(st, { label: "Lower Band" }),
  meta: nodeMetaResponseField(st, { label: "..." }),
},
```

Graph edges reference the output by field name: `fromHandle: "upper"`.

## Edge Wiring Summary

The engine connects nodes via edges. Default handles:

- Output: `"result"` (first `timeSeriesResponseField`)
- Input: `"source"` (first `timeSeriesRequestField`)

Custom handles use the field name from the definition's `children` object.
