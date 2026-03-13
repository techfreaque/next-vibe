# Vibe Sense

> Dataflow engine for next-vibe. A graph is a DAG of endpoint calls. Edges carry data between them. The engine executes nodes in topological order via in-process dispatch. Cron persists results. Charts render history.

---

## Core Concept

A **node** is a regular next-vibe endpoint — same `definition.ts` + `route.ts` as everything else. A **graph** wires nodes together with edges. An **edge** connects one node's output field to another node's input field. The field names on each end of the edge are the handle names.

There is no node type system. No indicator vs evaluator vs transformer distinction at the config level. Every node is `{ endpointPath, params }`. The engine treats them identically.

---

## Data Types

```typescript
type DataPoint = {
  timestamp: Date;
  value: number;
  meta?: Record<string, string | number | boolean | null>;
};
type TimeSeries = DataPoint[];
type SignalEvent = {
  timestamp: Date;
  fired: boolean;
  meta?: Record<string, string | number | boolean | null>;
};
type Resolution =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "4h"
  | "1d"
  | "1w"
  | "1M";
type TimeRange = { from: Date; to: Date };
type NodeMeta = {
  actualResolution: Resolution;
  lookbackUsed: number;
  sparse?: boolean;
};
```

`FieldDataType.TIME_SERIES` marks any field carrying `TimeSeries`. The graph builder uses this to derive edge handles.

---

## Endpoint Pattern

Every node endpoint follows the standard 3-file pattern. Field helpers from `vibe-sense/shared/fields.ts` provide the standard fields.

### Standard Request Fields

| Field        | Type         | Default | Notes                                                       |
| ------------ | ------------ | ------- | ----------------------------------------------------------- |
| `source`     | `TimeSeries` | —       | Primary input series. Omitted on root nodes (data sources). |
| `resolution` | `Resolution` | `"1d"`  | Computation timeframe.                                      |
| `range`      | `TimeRange`  | —       | Injected by engine from graph-level range.                  |
| `lookback`   | `number`     | `0`     | Extra bars before `range.from` for warm-up.                 |

Endpoints with multiple `TimeSeries` inputs use named fields instead of `source` (e.g. `a`, `b` for ratio).

### Standard Response Fields

| Field     | Type            | Notes                                                        |
| --------- | --------------- | ------------------------------------------------------------ |
| `result`  | `TimeSeries`    | Primary output. Multi-output nodes use named fields instead. |
| `signals` | `SignalEvent[]` | Condition check results (fired/not-fired per timestamp).     |
| `meta`    | `NodeMeta`      | Execution metadata.                                          |

An endpoint outputs `result`, or `signals`, or named series fields — whichever its logic produces. The engine reads whatever the `outputField` config points to (default `"result"`), and separately checks for `signals`.

### Custom Parameters

Beyond the standard fields, endpoints declare their own parameters as regular request fields: `period` (EMA), `op` + `value` (threshold), `stdDev` (Bollinger), etc. These are configured via `params` in the graph config.

### Graph Behavior Markers

Endpoint definitions declare intrinsic properties that the engine uses during graph execution. These are properties of the endpoint itself, not of the graph config — they describe what this endpoint _is_, not how a user configures it.

```typescript
// On the endpoint definition:
graphNode?: {
  backtestMode?: "bulk" | "rolling";   // default: "bulk"
  sideEffect?: boolean;                // default: false
  cacheable?: boolean;                 // default: true
};
```

| Marker         | Default  | Meaning                                                                                                                                                                       |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backtestMode` | `"bulk"` | `"bulk"`: called once with full range. `"rolling"`: called bar-by-bar with advancing window.                                                                                  |
| `sideEffect`   | `false`  | `true`: endpoint has external effects (send email, trigger AI run). Engine skips in readOnly/chart mode. Backtest passes `actionMode: "simulate"`.                            |
| `cacheable`    | `true`   | `true`: same inputs → same outputs. Engine can reuse results within a run and across runs for overlapping ranges. `false`: always re-execute (live prices, random, stateful). |

- **`backtestMode: "rolling"`** — PnL tracking, position sizing, trade simulation. Each call gets `{ from: rangeStart, to: currentBar }`.
- **`sideEffect: true`** — replaces the gating heuristic of checking "evaluator" in the alias. The engine knows definitively which nodes have side effects.
- **`cacheable: false`** — live market data feeds, endpoints with internal randomness, anything where the same range can return different results on different calls.

Data sources and indicators: `{ cacheable: true }`. Transformers: `{ cacheable: true }`. Evaluators: `{ cacheable: true }`. Action endpoints: `{ sideEffect: true, cacheable: false }`.

---

## Edge Wiring

An edge connects an output field on the source node to an input field on the target node:

```typescript
interface GraphEdge {
  from: string; // source node id
  to: string; // target node id
  fromHandle?: string; // source output field name (default: "result")
  toHandle?: string; // target input field name (default: "source")
}
```

The engine resolves edge wiring as follows:

1. For each incoming edge, read `fromHandle ?? "result"` from the source node's resolved output.
2. Inject the series into the target node's input at `toHandle ?? "source"`.
3. `params` entries provide non-series static parameters.

**Example — single input:**

```
leads-created → ema (period=14)
```

```typescript
edges: [{ from: "leads_created", to: "ema_14" }];
// Engine: ema_14.source = leads_created.result
```

**Example — multi input:**

```
leads-converted → ratio.a
leads-created   → ratio.b
```

```typescript
edges: [
  { from: "leads_converted", to: "conversion_rate", toHandle: "a" },
  { from: "leads_created", to: "conversion_rate", toHandle: "b" },
];
// Engine: conversion_rate.a = leads_converted.result
//         conversion_rate.b = leads_created.result
```

**Example — multi output:**

```
bollinger.upper → threshold.source
```

```typescript
edges: [{ from: "boll", to: "thresh", fromHandle: "upper" }];
// Engine: thresh.source = boll.upper
```

### Shape Compatibility

Two fields are compatible if they carry the same structural type. `TimeSeries → TimeSeries` always works. `SignalEvent[] → TimeSeries` does not.

The builder validates this on save by resolving endpoint schemas and checking field types on each edge. Incompatible edges get error state shown on the node.

---

## Signals

Signals are a **side-channel**, not an edge-connectable output. An endpoint that produces signals declares a `signals: SignalEvent[]` response field using `customResponseField` — it has no `FieldDataType.TIME_SERIES`, so the builder doesn't render a handle for it.

The engine checks for signals after every node execution. Signals affect downstream behavior via **gating** (see Execution section), not via edge wiring.

On the chart, signals render as vertical markers at fired timestamps, not as line series.

---

## Graph Config

```typescript
interface GraphNodeConfig {
  endpointPath: string; // endpoint alias (from generated alias-map)
  method?: "GET" | "POST" | "PUT" | "DELETE"; // default: POST
  resolution?: Resolution; // overrides graph-level resolution
  lookback?: number; // extra bars before range.from
  params?: Record<string, string | number | boolean | null>; // static parameters
  outputField?: string; // which response field is the primary output (default: "result")
  persist?: "always" | "never" | "snapshot"; // default: "always"
  pane?: number; // chart pane assignment
  color?: string; // chart series color
  visible?: boolean; // chart visibility
}

interface GraphConfig {
  nodes: Record<string, GraphNodeConfig>;
  edges: GraphEdge[];
  positions?: Record<string, { x: number; y: number }>;
  trigger: TriggerConfig;
  resolution?: Resolution; // graph-level default (nodes inherit unless they override)
}

type TriggerConfig = { type: "cron"; schedule: string } | { type: "manual" };
```

### `endpointPath`

Stores the endpoint **alias** from the generated alias-map (e.g. `"ema"`, `"threshold"`, `"leads-created"`). Not a URL, not a dot-joined path. The engine constructs the dispatch tool name as `${alias}_${method}`.

### `outputField` vs `fromHandle`

`outputField` controls which response field the engine stores as this node's **primary** resolved output (keyed by node id in `resolvedSeries`). Default: `"result"`.

`fromHandle` on an edge selects which output a **downstream** node reads. For single-output nodes both are the same. For multi-output nodes (e.g. Bollinger with `upper`, `middle`, `lower`), the engine also scans all response fields — any that parse as `TimeSeries` get stored as `"nodeId:fieldName"`. A downstream edge uses `fromHandle: "upper"` to pick a specific one.

### Parameters

`params` provides static values for non-series endpoint fields: `period: 14`, `op: ">"`, `value: 50`, `stdDev: 2`, etc. Series data flows through edges, never through params. If two nodes have incompatible shapes, add a transformer node in between.

---

## Execution

### Engine Loop

```
trigger fires (cron / manual / chart request)
  → topological sort (Kahn's algorithm, cycle detection)
  → for each node in order:
      1. resolve input series from upstream edges (fromHandle → toHandle)
      2. inject params (static values: period, op, value, etc.)
      3. inject standard fields: range, resolution, lookback
      4. dispatch via RouteExecutionExecutor.executeGenericHandler()
      5. extract primary output from response[outputField]
      6. scan remaining response fields for additional TimeSeries outputs
      7. extract signals from response["signals"] if present
      8. persist if persist != "never"
      9. pass outputs to downstream nodes via edges
  → record pipeline_run
```

In-process dispatch via `RouteExecutionExecutor` — no HTTP. Auth context = system user for cron, graph owner's JWT for manual/chart. Same dispatch mechanism as cron tasks and AI tool calls.

### Resolution

Resolution resolves as: `nodeConfig.resolution ?? graphConfig.resolution ?? "1d"`. The graph-level resolution is the default for all nodes; per-node overrides are for mixed-resolution graphs (e.g. a `1h` data source feeding a `1d` indicator).

The engine doesn't resample between nodes — if you wire a `1h` EMA into a `1d` threshold, the threshold gets hourly data. This is by design: the user controls resolution per node or adds a transformer.

In chart mode, if the display resolution differs from the node's resolution, the engine scales up (forward-fill) for rendering.

### Execution Modes

| Mode         | Range                              | Behavior                                                                                     |
| ------------ | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| **Cron**     | `{ from: lastRunAt, to: now }`     | Delta run. Only execute nodes on a path to a sink (persist or side-effect). Persist results. |
| **Chart**    | Last N bars at selected resolution | Full DAG. Read persisted data first, compute rest on-the-fly. `readOnly: true`.              |
| **Backtest** | User-specified historical range    | Mixed bulk/rolling per node. `actionMode: "simulate"` on side-effect nodes.                  |

**Sinks** — a node is a sink if it has `persist: "always"` or `sideEffect: true`. In cron mode, the engine prunes nodes that aren't on a path to any sink (pure intermediate compute with no persistence and no side effects).

### Backtest

Backtesting replays a graph over a historical range. The engine supports two simulation modes per node, controlled by a `backtestMode` marker on the endpoint definition:

| Mode        | Behavior                                                                                                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"bulk"`    | Default. Engine calls the endpoint once with the full range. Data sources and indicators work this way — they compute over the entire window at once.                                                                                              |
| `"rolling"` | Engine calls the endpoint bar-by-bar, advancing the window one resolution step at a time. Used for nodes that need cumulative state (e.g. PnL tracking, position sizing, trade simulation). Each call gets `{ from: rangeStart, to: currentBar }`. |

A graph can mix both modes. The engine processes the topological order per bar for rolling nodes, but pre-computes bulk nodes once upfront. Rolling nodes receive their upstream data sliced to the current bar.

Backtest config:

```typescript
interface BacktestConfig {
  graphId: string;
  graphVersionId: string;
  range: TimeRange;
  resolution: Resolution;
  actionMode: "simulate" | "execute";
}
```

`actionMode: "simulate"` is passed to action endpoints — they skip actual side effects but return a response (e.g. simulated trade result) for analysis. `actionMode: "execute"` runs actions for real (rare — used for replay/recovery).

Backtest results are stored in `pipeline_backtests` + `pipeline_datapoints` (tagged with `backtestRunId`). The chart widget can overlay backtest results on the live chart.

### Gating

Nodes with `sideEffect: true` on their endpoint definition only execute when at least one upstream signal fired in the current run. In chart/readOnly mode, side-effect nodes are always skipped.

The engine walks the DAG backwards from each side-effect node to find the nearest upstream node that produced signals. If no signal fired, the side-effect node is skipped.

### Action Nodes

Action nodes are regular endpoints with `sideEffect: true` wired downstream of an evaluator. There is no special "action" type — any endpoint can be an action. Typical actions:

- **AI run** — trigger an agent conversation
- **Send message** — email, SMS, push notification
- **Contact form** — submit a form
- **Webhook** — POST to an external URL

The canonical graph pattern: `data source → indicator(s) → evaluator → action endpoint`. The evaluator produces signals; the action endpoint only executes when a signal fires.

In backtest mode, action nodes receive `actionMode: "simulate"` — endpoints that support this flag skip the actual side effect but return a response for PnL tracking and analysis.

### Error Handling

Node failure → null output propagated downstream → downstream nodes that depend on it skip gracefully. Errors collected per-node, stored in pipeline_run record. No throws.

---

## Validation

### On Save (builder)

For each node in the graph:

1. Resolve the endpoint definition via `getEndpoint(alias)`.
2. For each incoming edge: check that `fromHandle` field on the source endpoint is `FieldDataType.TIME_SERIES` and `toHandle` field on the target endpoint is `FieldDataType.TIME_SERIES`.
3. For each `params` entry: check the value is compatible with the target field's Zod schema.
4. Check required fields are satisfied (every `TIME_SERIES` request field has either an edge or a default value).
5. Return `Map<nodeId, ValidationError[]>`. Store with the graph. Display as error badges on nodes in the builder.

### On Seed

Seeds run the same validation at startup. Errors are logged (not thrown). Invalid seeds are skipped.

### Runtime

Standard endpoint request validation via Zod schemas. Auth check per node using graph owner's roles. Failed validation → node error, null output downstream.

---

## Handles (Builder UI)

The graph builder derives handles from the endpoint's field definitions:

- `requestField` with `fieldType: FieldDataType.TIME_SERIES` → **input handle** (left side of node)
- `responseField` / `customResponseField` with `fieldType: FieldDataType.TIME_SERIES` → **output handle** (right side)
- Handle id = field name (`source`, `a`, `b`, `result`, `upper`, `middle`, `lower`, etc.)
- Handle label = field label from `scopedTranslation`

`signals` uses `customResponseField` without `FieldDataType.TIME_SERIES` — no handle. Signals are not edge-connectable.

Multi-output example (Bollinger): three output handles `upper`, `middle`, `lower`.
Multi-input example (ratio): two input handles `a`, `b`.
Standard node (EMA): one input handle `source`, one output handle `result`.

---

## Graph Builder

### Palette

Reads from the generated alias-map. Filters to vibe-sense endpoints by matching path keys for known category segments (`data-sources_`, `indicators_`, `transformers_`, `evaluators_`). Groups by category for display.

Data sources have no `TIME_SERIES` request fields (they're roots). Everything else has at least one.

Palette items show: endpoint alias and category badge.

### Inspector

Unified for all nodes. Shows:

- **Endpoint** — alias (read-only)
- **Resolution** — override picker
- **Lookback** — override number
- **Parameters** — key-value editor for `params`. New entries can be added. Values auto-coerced (numbers, booleans, strings).
- **Output Field** — which response field is the primary output (default: `"result"`)
- **Persist** — always / never / snapshot
- **Display** — color picker, pane selector, visibility toggle
- **Validation errors** — inline error list if any

No type-specific inspector panels. Every node gets the same UI.

### Edge Validation

Edges are validated on connect. The builder checks:

- Source `fromHandle` field exists and is `TIME_SERIES`
- Target `toHandle` field exists and is `TIME_SERIES`
- No duplicate connections to the same input handle

Invalid connections are rejected with a toast message.

### Node Visuals

Nodes display a category badge and colored border derived from their endpoint's `category` field (not from the alias string). Categories: data-source, indicator, transformer, evaluator, other. Visual distinction is purely cosmetic — the engine doesn't use it.

---

## Chart Widget

The chart view (at `graphs/[id]/data/`) renders persisted and computed series using `lightweight-charts`.

### Layout

- **Resolution selector** — row of resolution buttons at top
- **Multi-pane chart** — nodes with different `pane` values render in separate vertically stacked chart panes
- **Floating legend** — series name + last value, one row per visible series
- **Crosshair tooltip** — shows all series values at the cursor timestamp
- **Signal markers** — vertical lines at timestamps where signals fired

### Interaction

- Pan left to load older history (cursor-based pagination, pages accumulated client-side)
- Pan-back toast notification when loading
- Resolution switching re-fetches data at new bucket size

### Data Flow

1. GET request with `{ id, resolution, cursor? }` to the data endpoint
2. Endpoint either returns persisted datapoints (for `persist: "always"` nodes) or executes the graph in `readOnly` mode to compute on-the-fly
3. Response: `{ graph: GraphMetadata, series: NodeSeries[], signals: NodeSignals[] }`
4. Each `NodeSeries` has `{ nodeId, points: DataPoint[] }`
5. Each `NodeSignals` has `{ nodeId, events: SignalEvent[] }`

### Scale Groups

Series in the same pane share a price scale. Each pane gets its own y-axis.

---

## Graph List

The graph list view (`graphs/widget.tsx`) shows all graphs for the current user with:

- Name, slug, description
- Active/inactive badge
- Owner type (system / admin / user)
- Trigger type (cron schedule or manual)
- Last run status and timestamp
- Actions: view chart, edit in builder, activate/deactivate

---

## Graph Seeds

Seeds are `GraphSeedEntry[]` exported from `graph-seeds.ts` files colocated in domain folders. Auto-discovered by the generator.

```typescript
interface GraphSeedEntry {
  slug: string;
  name: string;
  description: string;
  config: GraphConfig;
}
```

Seeds use endpoint alias constants imported from each endpoint's `constants.ts`. Each endpoint exports its alias as a constant (e.g. `export const EMA_ALIAS = "ema"`). Edges connect handles by field name. `params` provides static parameter values. Series data flows through edges.

```typescript
// Example seed
const config: GraphConfig = {
  nodes: {
    users_registered: { endpointPath: USERS_REGISTERED_ALIAS },
    reg_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
    },
    eval_slow_growth: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
    },
  },
  edges: [
    { from: "users_registered", to: "reg_ema7" },
    // users_registered.result → reg_ema7.source (defaults)
    { from: "reg_ema7", to: "eval_slow_growth" },
    // reg_ema7.result → eval_slow_growth.source (defaults)
  ],
  trigger: { type: "cron", schedule: "0 */6 * * *" },
};
```

---

## Persistence

| Table                 | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `pipeline_graphs`     | Graph metadata (name, slug, owner, active)  |
| `pipeline_versions`   | Versioned graph configs (immutable on save) |
| `pipeline_datapoints` | Persisted node output series                |
| `pipeline_signals`    | Persisted signal events                     |
| `pipeline_runs`       | Execution log (status, errors, timing)      |
| `pipeline_backtests`  | Backtest run metadata                       |

### Persist Modes

`persist: "always"` — datapoints written on every run, read on chart requests.
`persist: "never"` — computed on-the-fly every time (volatile transforms, intermediate compute).
`persist: "snapshot"` — written once, never overwritten (point-in-time capture).

### Datapoint Keying

`pipeline_datapoints` is keyed by `(graphId, nodeId, timestamp)`. Not by `endpointPath` — two nodes using the same endpoint with different params (e.g. `ema_14` and `ema_50`) are separate series. The node id is the unique identifier within a graph.

### Caching

Two levels of caching, both gated by `cacheable: true` on the endpoint definition:

**Intra-run cache** — within a single graph execution, if the engine would call the same endpoint with identical inputs (same range, resolution, params), it reuses the result. This happens when the same data source feeds multiple branches.

**Cross-run cache** — on chart requests (`readOnly: true`), the engine reads from `pipeline_datapoints` for nodes with `persist: "always"` before executing. If persisted data covers the requested range, the node is skipped entirely. For cron runs, persisted data is not read — the engine always computes fresh results for the delta range.

Endpoints with `cacheable: false` are always re-executed regardless of persist mode.

---

## Auth

Graphs have an `ownerType`: `"system"` (seeded), `"admin"` (created by admin), or `"user"` (created by user).

- **System graphs** — created by seeds, editable by admins, visible to all admins
- **Admin graphs** — created via builder, scoped to the admin who created them
- **User graphs** — users create personal analytics dashboards. Node endpoints use `allowedRoles` to control access — users can only wire endpoints they have permission to call.

Engine execution uses a system user context for cron runs. Manual execution and chart requests use the requesting user's JWT. Each node endpoint checks its own `allowedRoles` — the engine doesn't bypass auth.

---

## Graph Versioning

Every save creates a new immutable version in `pipeline_versions`. The graph always runs against the latest active version.

### Version Management

- **Version list** — browsable history showing timestamp, diff summary, and which version is active
- **Switch** — activate any previous version. The graph immediately runs against the selected version on next trigger.
- **Delete** — remove a version (with confirmation). Cannot delete the active version.
- **Diff** — visual comparison between two versions showing added/removed/changed nodes and edges

The edit endpoint always forks from the current active version. Saving creates a new version and activates it. Switching to an old version and editing forks from that version.

---

## File Structure

```
vibe-sense/
  spec.md
  enum.ts                     Resolution enum, GraphResolution constants
  db.ts                       Drizzle schema (pipeline_* tables)
  shared/
    fields.ts                 DataPoint, TimeSeries, field helpers, RESOLUTION_MS
    range.ts                  Range arithmetic (trim, scale, extend)
    query-utils.ts            SQL helpers for data source queries
  graph/
    types.ts                  GraphNodeConfig, GraphEdge, GraphConfig, TriggerConfig
    schema.ts                 Zod validation schemas (graphConfigSchema)
  engine/
    executor.ts               Single-node execution (callEndpoint, gating, persist)
    runner.ts                 Full graph execution loop (runGraph)
    walker.ts                 Topological sort, cycle detection, reachability
    scheduler.ts              Cron trigger management (runDueGraphs)
    backtest.ts               Backtest execution
  store/
    datapoints.ts             Read/write pipeline_datapoints
    signals.ts                Read/write pipeline_signals
    runs.ts                   Read/write pipeline_runs
    cache.ts                  In-memory execution cache
    backtest.ts               Backtest result storage
  graphs/
    [id]/
      data/                   Chart data endpoint (GET) + chart widget
      edit/                   Graph builder endpoint (PUT) + builder widget
    widget.tsx                Graph list view

# Node endpoints live in analytics/ (same level as vibe-sense):
analytics/
  indicators/ema/             definition.ts, route.ts, compute.ts, constants.ts
  indicators/rsi/
  indicators/bollinger/       Multi-output: upper, middle, lower
  indicators/macd/            Multi-output: macdLine, signalLine, histogram
  transformers/ratio/         Multi-input: a, b
  transformers/merge/
  transformers/field-pick/
  transformers/json-path/
  transformers/script/
  evaluators/threshold/       Outputs signals, not result
  evaluators/crossover/
  evaluators/and/
  evaluators/or/
  evaluators/not/
  evaluators/script/

# Data sources live in their domain folders:
leads/data-sources/leads-created/     definition.ts, query.ts
user/data-sources/users-registered/
credits/data-sources/credits-spent-total/
```

No registry folder. No indicator index. No node type system. Endpoints are endpoints.
