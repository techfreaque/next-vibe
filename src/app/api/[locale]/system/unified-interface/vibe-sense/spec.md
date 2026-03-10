# Vibe Sense

> Universal dataflow engine for next-vibe. Any endpoint or indicator is a graph node. Nodes pipe typed data through transformers and evaluators into other endpoints. Cron persists datapoints. Charts render the history. Thea orchestrates.

---

## Core Model

Every node has **typed input** and **typed output**. The graph is a DAG of pipes. Data flows from sources through transforms and evaluations into sinks. There is no boundary between "data side" and "action side" — an endpoint node is a source (GET leads/stats) or a sink (POST leads/create) depending on where it sits in the graph.

### Node Types

| Type            | Role                                                      | Input           | Output                    |
| --------------- | --------------------------------------------------------- | --------------- | ------------------------- |
| **Indicator**   | Raw DB query, optimized path for domain metrics.          | `range`         | `TimeSeries`              |
| **Endpoint**    | Calls any next-vibe endpoint. Schema known at build time. | mapped fields   | endpoint response (typed) |
| **Transformer** | Reshapes data between nodes. Stateless.                   | any typed input | reshaped output           |
| **Evaluator**   | Produces boolean signal from numeric series.              | `TimeSeries[]`  | `Signal`                  |

**Indicators** are the optimized path for domain metrics that benefit from direct DB queries (daily lead counts, user registrations). They are not the only data source.

**Endpoint nodes** are the universal adapter. Every next-vibe endpoint is discoverable, has typed Zod schemas, and works as an MCP tool. An endpoint node in a graph calls that endpoint with mapped inputs and pipes the response forward. All 300+ endpoints are available as graph nodes.

There is no separate "action" concept. An endpoint node after an evaluator IS the action — the evaluator's signal gates whether downstream nodes execute. Same node type, same mechanics, different position in the DAG.

### Graph

A stored DAG config connecting nodes. Has a trigger (cron or manual). Versioned with branching — edits create a new branch, never mutate the active version.

---

## Data Flow

```
Source (indicator or endpoint GET)
  -> Transformer (field_pick, ratio, window, etc.)
  -> Evaluator (threshold, crossover, etc.)
  -> Endpoint POST (fires only when signal=true)
  -> Transformer (reshape response)
  -> Endpoint POST (chained, receives previous output)
```

The cron executes the graph on schedule. Each source node produces data. The engine persists datapoints for nodes marked `persist: always`. Transformers reshape between mismatched types. Evaluators check conditions and gate downstream execution. Output from each node flows to the next via edges.

### Endpoint Nodes

```typescript
{
  type: "endpoint",
  id: "fetch_lead_stats",
  endpointId: "leads.stats",
  method: "GET",
  inputMapping: {
    "dateFrom": { source: "static", value: "2025-01-01" },
    "dateTo":   { source: "static", value: "2025-12-31" },
  },
  outputField: "total",
  resolution: "1d",
  persist: "always",
}
```

As a **source** (no upstream edges): called with static/configured inputs on each cron tick. The `outputField` value is extracted as a datapoint.

As a **sink** (after evaluator): called only when the upstream signal fires. Inputs mapped from upstream node outputs. Response pipes to the next node if edges exist.

### Input Mapping

Every endpoint node has an `inputMapping` that maps each input field to:

- `{ source: "static", value: ... }` — hardcoded value
- `{ source: "node", nodeId: "...", field: "..." }` — value from upstream node output
- `{ source: "signal", field: "meta.actual" }` — value from the gating evaluator's signal

Schemas are known from endpoint definitions. The builder shows dropdowns of available fields for both source and target.

---

## Indicators

Domain-owned, optimized DB queries. Domains export from `indicators.ts`, auto-discovered at startup.

```typescript
export const leadsCreated: Indicator = {
  id: "leads.created",
  resolution: "1d",
  persist: "always",
  query: (range) => countLeadsCreated(range),
};
```

Derived indicators chain from other indicators:

```typescript
export const leadsCreatedMA7: DerivedIndicator = {
  id: "leads.created_ma7",
  inputs: ["leads.created"],
  resolution: "1d",
  lookback: 7,
  persist: "never",
  derive: ([series]) => rollingAverage(series, 7),
};
```

**Persist modes:** `always` (written every execution), `never` (computed on-the-fly from nearest persisted ancestor), `snapshot` (cached with TTL).

**Resolution rules:** Fine-to-coarse scaling is automatic (engine aggregates). Coarse-to-fine is rejected at registration and in the builder. Evaluators declare their own resolution; inputs scale up to match.

**Lookback propagation:** The engine accumulates lookback upstream through derived chains. Callers receive exactly the requested range — lookback is invisible to them.

---

## Transformers

Stateless reshape operations. Work on any typed input — TimeSeries, endpoint responses, upstream node output.

| Transformer  | Input          | Output       | Use                            |
| ------------ | -------------- | ------------ | ------------------------------ |
| `field_pick` | structured obj | single value | Extract a field from response  |
| `merge`      | two series     | one series   | Combine by timestamp           |
| `window`     | series + size  | series       | Rolling avg/sum/min/max        |
| `ratio`      | two series     | series       | A / B point-by-point           |
| `delta`      | series         | series       | Period-over-period change      |
| `clamp`      | series + range | series       | Bound values to min/max        |
| `json_path`  | any JSON       | extracted    | Deep field extraction          |
| `script`     | any            | any          | Sandboxed Bun eval, admin-only |

`field_pick` and `json_path` are the key glue — they extract typed fields from endpoint responses so downstream nodes get clean numeric series.

---

## Evaluators

Take numeric series, produce boolean signals. Signals are always persisted (audit trail).

| Type        | Inputs    | Logic                          |
| ----------- | --------- | ------------------------------ |
| `threshold` | 1 series  | `value <op> constant`          |
| `crossover` | 2 series  | A crosses above B              |
| `and`       | N signals | All fire at same timestamp     |
| `or`        | N signals | Any fires                      |
| `not`       | 1 signal  | Invert                         |
| `script`    | variadic  | Sandboxed function, admin-only |

Evaluators gate downstream execution. Nodes after an evaluator only execute when the signal fires.

---

## Execution Modes

### Scheduled (cron)

```
trigger fires -> walk DAG -> execute sources -> transform -> evaluate -> persist -> fire gated endpoints
```

The engine tracks `lastRunAt` per graph. It passes `{ from: lastRun, to: now }` as range. Only the delta is fetched and persisted.

### On-Demand (chart load)

```
time range requested -> walk DAG -> read persisted data -> compute non-persisted on-the-fly -> return series
```

Cache layer in front. First render pays computation cost, subsequent renders are fast.

### Backtest

```
{ mode: "backtest", range, resolution, actions: "simulate" }
```

Same graph, replayed over historical range. Gated endpoint calls are intercepted and recorded instead of executed. Results are stored separately. Multiple runs overlay for comparison.

---

## Persistence

```
pipeline_datapoints        — time series values (unique on node_id + graph_id + timestamp)
pipeline_signals           — evaluator fire history
pipeline_runs              — execution log (graph_id, started_at, finished_at, status, error_count, node_count)
pipeline_backtest_runs     — backtest metadata
pipeline_backtest_results  — backtest series + signals
pipeline_snapshots         — computation cache with TTL
pipeline_retention_config  — per-node retention policy
```

`pipeline_runs` tracks every scheduled and on-demand execution — when the graph last ran, whether it succeeded, how many nodes executed, what errors occurred.

**Retention:** Per-node policy `{ maxRows, maxAgeDays }`, whichever triggers first. Cleanup runs as a scheduled task. `persist: never` nodes have no stored data.

---

## Graph Versioning

Edits never mutate — they always branch.

```
graph: "lead-funnel"
  v1 (system seed)
  v2 (branch from v1, admin edit)  <- active
  v3 (branch from v2, draft)
```

Backtest results reference specific versions. System graphs are read-only; admins branch to edit, then promote back.

| Owner type | Created by        | Visible to | Editable by |
| ---------- | ----------------- | ---------- | ----------- |
| system     | seeds / promotion | all admins | nobody      |
| admin      | admin user        | that admin | that admin  |
| user       | any user (future) | that user  | that user   |

Graphs can be archived (soft delete: `isActive = false`, `archivedAt` set). Archived graphs stop executing but retain data and version history. Hard delete is available for admin-owned graphs with no data.

---

## Chart Rendering

Layout derives from the graph — the pipeline IS the chart definition.

**Library:** lightweight-charts (TradingView OSS). Built for time-series navigation: pan/zoom, resolution switching, logical pagination.

**Auto-layout:** Indicator and endpoint source nodes become chart series. Evaluator nodes become time-axis markers/bands. Gated endpoint sinks become event markers.

**Panes:** Main pane (shared y-axis, overlaid series) + sub-panes (separate y-axis, time-aligned, resizable). Zoom/pan syncs across all panes.

**Data loading:** Initial fetch for visible range. Incremental fetch on pan/zoom. Re-query on resolution switch.

---

## Graph Builder

React Flow is the only way to edit graph config. Full CRUD.

### Layout

```
+------------------+------------------------+------------------+
|                  |                        |                  |
|   Node Palette   |     React Flow         |  Node Inspector  |
|   (left sidebar) |     Canvas             |  (right panel)   |
|                  |                        |                  |
|   - Indicators   |                        |  Selected node:  |
|   - Endpoints    |                        |  - Type config   |
|   - Transformers |                        |  - Input mapping |
|   - Evaluators   |                        |  - Display opts  |
|                  |                        |                  |
+------------------+------------------------+------------------+
|              Bottom Bar: Name, Description, Trigger, Save    |
+--------------------------------------------------------------+
```

### Node Palette

Collapsible sidebar with four categories:

- **Indicators** — all registered indicators from the registry. Drag to add.
- **Endpoints** — searchable list of all endpoints from the endpoint meta API. Shows method badge (GET/POST/PUT). Drag to add.
- **Transformers** — built-in transformer list. Drag to add.
- **Evaluators** — evaluator type list. Drag to add.

Each palette item shows icon, name, and brief description.

### Node Cards

Each node is a React Flow custom node with:

- **Type badge** — color-coded (blue=indicator, green=endpoint, purple=transformer, orange=evaluator)
- **Input handles** (left) — one per declared input, typed
- **Output handles** (right) — one per output field. Multi-value nodes show multiple named handles.
- **Compact summary** — key config inline (resolution, function name, operator, endpoint ID)

### Node Inspector

Opens when a node is selected. Shows full editable config for that node type:

**Indicator:** indicator ID (read-only), resolution, persist mode (read-only from registry), chart display options (pane, color, visibility).

**Endpoint:** endpoint ID + method (from palette), input mapping editor (per field: source selector with static/node output/signal meta, value input or upstream field dropdown), output field picker (shows response schema), resolution, persist mode.

**Transformer:** function selector, function-specific args (window size, field name, etc.), resolution.

**Evaluator:** evaluator type selector, type-specific args (threshold: op + value, crossover: none, etc.), resolution.

### Connection Validation

On edge draw:

- Resolution mismatch (coarse to fine) — rejected with visual feedback
- Type mismatch — rejected
- Valid connection — animated edge, color matches data type

### Operations

| Action      | How                                                  |
| ----------- | ---------------------------------------------------- |
| Add node    | Drag from palette onto canvas                        |
| Delete node | Select + Delete key, or right-click context menu     |
| Edit node   | Select node, inspector panel populates               |
| Connect     | Drag from output handle to input handle              |
| Disconnect  | Click edge + Delete key                              |
| Move        | Drag node on canvas                                  |
| Save        | Bottom bar Save button, creates new version (branch) |

### Serialization

Builder state serializes to `GraphConfig` JSON on save: nodes map (`Record<nodeId, NodeConfig>`), edges array, positions, trigger config, chart overrides.

---

## Scheduling

Graphs with `trigger: { type: "cron", schedule: "..." }` register as tasks in the existing task infrastructure.

`engine/scheduler.ts` reads all active graphs with cron triggers and registers one task per graph. Task execution calls `runGraph` with `{ from: lastRunAt, to: now }`. `lastRunAt` is tracked in `pipeline_runs`.

On graph edit (new version activated), the scheduler re-registers the task with updated config.

---

## Seed Graphs

System-owned, read-only, seeded on startup.

| Graph                | Key nodes                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Lead funnel          | `leads.created`, `leads.converted`, `leads.created_ma7`, conversion ratio, threshold evaluators |
| User growth          | `users.registered`, `users.active_total`, growth MA, ban spike evaluator                        |
| Campaign performance | `campaigns.sent`, open/click rates, engagement window, threshold evaluators                     |

---

## Platform Integration

- Graphs trigger via existing **task infrastructure** (cron)
- Endpoint nodes call existing **endpoints** — no new execution primitives
- **Thea** reads, creates, modifies, triggers graphs, and queries the registry as MCP tools
- **Registry API** exposes all indicators + all endpoints as available nodes for the builder

---

## File Structure

```
vibe-sense/
  spec.md
  db.ts                  — all pipeline_* tables
  repository.ts          — graph CRUD, trigger, backtest
  seeds.ts
  task.ts                — cleanup + graph scheduler registration
  engine/
    walker.ts            — DAG topological sort, deduplication
    executor.ts          — node execution, resolution scaling, persist
    runner.ts            — full graph execution orchestration
    scheduler.ts         — cron registration for active graphs
    backtest.ts          — backtest mode, endpoint interception
  store/
    datapoints.ts        — time-series read/write + retention
    signals.ts           — evaluator signal read/write
    cache.ts             — computation cache (memory + DB)
    backtest.ts          — backtest run + result storage
    runs.ts              — execution history read/write
  indicators/
    types.ts             — Indicator, DerivedIndicator, TimeSeries types
    registry.ts          — auto-discovery, registration, validation
    range.ts             — lookback accumulation, range arithmetic
  transformers/
    field-pick.ts, merge.ts, window.ts, ratio.ts, delta.ts, clamp.ts
    json-path.ts         — deep field extraction from structured responses
    script.ts            — sandboxed eval (admin-only)
  evaluators/
    threshold.ts, crossover.ts, and.ts
    script.ts            — sandboxed eval (admin-only)
  graph/
    types.ts             — GraphConfig, NodeConfig unions, InputMapping types
  graphs/
    seeds/               — system graph seed files
    [endpoints]          — CRUD, trigger, backtest, data, edit, promote, registry
  cleanup/               — retention + snapshot eviction endpoint
  registry/              — indicator + endpoint registry endpoint
```
