# Remote Tool Call Spec

## What a Tool Is

Every API endpoint is automatically a tool. No separate tool declaration. The endpoint's `createEndpoint()` call is the tool definition - it produces the title, description, field schema, widget types, options, examples, credit cost, and permission gates in one place.

Tools are identified by a **toolName** - the endpoint's preferred name (first alias if set, canonical path otherwise). Remote tools are prefixed: `instanceId__toolName` (e.g. `hermes__ssh_exec_POST`). The separator `__` is the parsing boundary.

---

## callbackMode - Injected at Runtime

Every tool (except `wait-for-task` and `execute-tool`) gets an optional `callbackMode` parameter injected into its JSON schema at tool-load time:

```
callbackMode?: "wait" | "detach" | "wakeUp" | "endLoop" | "approve"
```

The AI passes it alongside regular tool args. It is stripped from the args before validation and handled by the stream control layer. Folder type determines which modes are allowed - incognito and public folders block async and remote modes. Only the filtered set is exposed in the enum.

`execute-tool` has `callbackMode` as a native field in its own definition. `wait-for-task` has its own stream-pause mechanism and callbackMode would interfere.

---

## Execution Paths

### Local tool

Tool has no `instanceId`. Executed directly via `RouteExecutionExecutor.executeGenericHandler()` in the same process.

- **wait / endLoop**: inline, result returned to AI synchronously
- **detach**: goroutine spun off, AI gets `{ taskId, status: "pending", hint }` immediately
- **wakeUp**: goroutine spun off, AI gets `{ taskId, status: "pending", hint }` immediately. When done: revival injects result
- **approve**: returns placeholder, stream pauses, waits for human confirm/cancel

### Remote tool (`instanceId__toolName`)

Tool is prefixed. `instanceId` is resolved to a stored `remote_connections` row. Tool name is validated against the stored capability snapshot - if not in snapshot, fail closed (no arbitrary endpoint calls).

**Transport is chosen per callbackMode:**

**Direct HTTP** (`isDirectlyAccessible=true`):

- wait / endLoop: blocking fetch to `remoteUrl/{toolName}` - result returned inline, ms latency
- detach / wakeUp: fire-and-forget fetch, task row inserted locally, return pending immediately

**Task queue** (`isDirectlyAccessible=false`):

- Task row created with `targetInstance`, callback fields, tool input
- If directly accessible: also POST to remote's task-sync endpoint immediately (push-first, falls back to cron pull)
- Remote's cron pulse picks it up (~1 min), executes, POSTs result to local's `/report`
- `/report` → `handleTaskCompletion(callbackMode)` → revival (for wait/wakeUp) or no revival (endLoop/detach)

**Deduplication**: if a remote task for the same `toolMessageId` already exists (approval re-confirmation path), skip creation and return pending. Prevents duplicate remote execution.

**Circuit breaker**: in revival streams (`isRevival=true`), remote WAIT automatically upgrades to WAKE_UP. Prevents: revival → execute-tool → new remote WAIT task → stream abort → revival → loop.

---

## Tool Input Sanitization

Before sending to remote: `instanceId` is stripped from the input object. If left in, endpoints like `tool-help` would interpret it as "proxy to another instance" and return unfiltered results. The remote executes the tool locally with the stripped input.

---

## Capability Snapshot

The capability snapshot is a static JSON file generated at build time (`vibe gen`), stored in `system/generated/remote-capabilities/{locale}/{role}.json`. It contains one entry per exposed endpoint - the full field definition tree with all UI metadata pre-baked for the target locale.

**What it contains per tool** (source: `RemoteToolCapabilitySchema`):

```typescript
{
  toolName: string          // preferred name (alias or canonical path)
  title: string             // pre-translated title
  description: string       // pre-translated description
  fields: FieldNode         // serialized createEndpoint() field tree - see below
  executionMode: "via-execute-route"
  isAsync: true
  instanceId: string        // tagged by receiver at sync time
  category?: string         // pre-translated category label
  tags?: string[]           // pre-translated tag labels
  aliases?: string[]        // all aliases (first is preferred name)
  credits?: number          // credit cost (0 = free)
}
```

**What the snapshot does NOT contain:** function refs (`hidden`, `serverDefault`, `getClassName`, `getCount`, `render`). These are stripped by JSON serialization. Every other property on the field config - widget types, `fieldType`, options, labels, constraints, layout - survives and lands on the remote side intact.

The snapshot is versioned by git SHA. Remote sync only re-sends when the version changes - steady-state sync is a single tiny request with no payload.

---

## Field-Driven UI - The Core Standard

The `fields` tree in the snapshot is the **authoritative UI contract**. It is not JSON Schema. It is the full `createEndpoint()` field definition serialized to JSON - every widget type, `fieldType`, option, constraint, and label resolved for the target locale - ready for any platform to render a complete, polished UI with no additional code.

No inference. No guessing. No JSON Schema heuristics. The field tree tells the platform exactly what to render.

---

## Field Node Structure

Every node in the `fields` tree is a serialized `UnifiedField` config. All nodes share a set of base properties. The `schemaType` discriminator tells you what additional properties are present.

### Base properties (every node)

```typescript
{
  type: WidgetType        // determines the visual widget (see WidgetType table)
  schemaType: SchemaTypes // structural discriminator (see SchemaTypes table)
  usage: {
    request?: "data" | "urlPathParams" | "data&urlPathParams"
    response?: true
  }
  // optional base props - all serializable:
  className?: string
  order?: number
  hidden?: boolean         // function refs are stripped; boolean survives
  inline?: boolean
  columns?: number
  hiddenForPlatforms?: string[]
}
```

### SchemaTypes - structural variants

| schemaType        | Shape                                                 | Use                                      |
| ----------------- | ----------------------------------------------------- | ---------------------------------------- |
| `primitive`       | Has `schema` (serialized Zod) + widget-specific props | Single input / display field             |
| `widget`          | Has widget-specific props, no `schema`                | Display-only widget with no data binding |
| `widget-object`   | Has `children` record                                 | Display-only container with sub-fields   |
| `object`          | Has `children` record                                 | Required nested object                   |
| `object-optional` | Has `children` record                                 | Optional nested object                   |
| `object-union`    | Has `discriminator` + `variants` array                | Discriminated union                      |
| `array`           | Has `child` single node                               | Required array                           |
| `array-optional`  | Has `child` single node                               | Optional array                           |

**Object/widget-object nodes** add:

```typescript
children: { [fieldName: string]: FieldNode }
```

**Array nodes** add:

```typescript
child: FieldNode;
```

**Union nodes** add:

```typescript
discriminator: string          // field name that selects the variant
variants: FieldNode[]          // each variant is an object node
```

---

## WidgetType - Visual Rendering

`type: WidgetType` on every node controls which visual widget renders. The platform maps each value to its native component.

### Layout & structure

| type        | Renders               | Key extra props                                                      |
| ----------- | --------------------- | -------------------------------------------------------------------- |
| `container` | Layout wrapper / card | `layoutType`, `columns`, `title?`, `description?`, `gap?`, `border?` |
| `separator` | Horizontal rule       | -                                                                    |

### Form inputs (`schemaType: "primitive"`, `usage.request` set)

These nodes also carry a `fieldType: FieldDataType` property that drives the specific input widget.

| type         | Note                                                          |
| ------------ | ------------------------------------------------------------- |
| `form_field` | All user-input fields. `fieldType` selects the actual widget. |

### Display widgets (`schemaType: "widget"` or `"primitive"` with `usage.response`)

| type               | Renders            | Key extra props                    |
| ------------------ | ------------------ | ---------------------------------- |
| `text`             | Paragraph          | `content?` (pre-translated static) |
| `title`            | Heading            | `content?`, `size?`                |
| `description`      | Subdued text       | `content?`                         |
| `badge`            | Status badge       | `content?`, `variant?`             |
| `markdown`         | Rendered markdown  | `content?`                         |
| `markdown_editor`  | Markdown editor    | -                                  |
| `link`             | Clickable link     | `href?`, `text?`, `external?`      |
| `avatar`           | User avatar        | `src?`, `alt?`                     |
| `icon`             | Icon               | `icon` key                         |
| `code_output`      | Code block         | `language?`                        |
| `key_value`        | Key-value pairs    | -                                  |
| `stat`             | Stat card          | `value?`, `label?`                 |
| `chart`            | Chart              | `chartType?`                       |
| `alert`            | Alert banner       | `variant?`                         |
| `status_indicator` | Status dot         | `status?`                          |
| `metadata`         | Metadata row       | -                                  |
| `empty_state`      | Empty placeholder  | `title?`, `description?`           |
| `loading`          | Loading state      | -                                  |
| `pagination`       | Pagination control | -                                  |

### Interactive widgets

| type            | Renders       | Key extra props     |
| --------------- | ------------- | ------------------- |
| `submit_button` | Submit action | `label?`            |
| `button`        | Action button | `label?`, `action?` |
| `form_alert`    | Form error/ok | -                   |

---

## FieldDataType - Input Widget Selection

When `type === "form_field"`, the `fieldType: FieldDataType` property selects the specific input widget.

| fieldType                             | Widget            | Extra props                                            |
| ------------------------------------- | ----------------- | ------------------------------------------------------ |
| `text` / `email` / `url` / `password` | Text input        | `label?`, `placeholder?`, `required?`, `disabled?`     |
| `tel`                                 | Phone input       | `label?`, `placeholder?`                               |
| `textarea`                            | Multiline text    | `rows?`, `maxLength?`, `label?`, `placeholder?`        |
| `markdown_textarea`                   | Markdown editor   | `label?`, `placeholder?`                               |
| `number` / `int`                      | Number input      | `min?`, `max?`, `step?`, `label?`                      |
| `boolean`                             | Toggle / checkbox | `label?`, `description?`                               |
| `select`                              | Dropdown          | `options[]`, `label?`                                  |
| `multiselect`                         | Multi-select      | `options[]`, `maxSelections?`, `searchable?`, `label?` |
| `filter_pills`                        | Pill selector     | `options[]`, `label?`                                  |
| `slider`                              | Slider            | `min?`, `max?`, `step?`, `marks[]?`, `label?`          |
| `range_slider`                        | Range slider      | `options[]`, `minLabel?`, `maxLabel?`                  |
| `tags`                                | Tag input         | `suggestions[]?`, `maxTags?`, `allowCustom?`           |
| `text_array`                          | Text list editor  | `label?`, `placeholder?`                               |
| `date` / `datetime` / `time`          | Date/time picker  | `minDate?`, `maxDate?`                                 |
| `date_range` / `time_range`           | Range picker      | -                                                      |
| `color`                               | Color picker      | `presetColors[]?`, `allowCustom?`                      |
| `icon`                                | Icon picker       | -                                                      |
| `file`                                | File upload       | -                                                      |
| `json`                                | JSON editor       | -                                                      |
| `uuid`                                | UUID input        | -                                                      |
| `timezone`                            | Timezone select   | -                                                      |
| `currency_select`                     | Currency select   | -                                                      |
| `language_select`                     | Language select   | -                                                      |
| `country_select`                      | Country select    | -                                                      |

**Options shape** (for select / multiselect / filter_pills / range_slider):

```typescript
options: [{
  value: string | number
  label: string         // pre-translated
  labelParams?: Record<string, string | number>
  disabled?: boolean
}]
```

---

## Translation Keys in the Snapshot

`label`, `placeholder`, `description`, `helpText`, `content`, `title`, `options[].label` - all of these are **translation key strings** in the source `createEndpoint()` definition (e.g. `"myFeature.form.nameLabel"`). The capability snapshot generator resolves them via `t(key)` before writing the JSON. By the time a platform receives the snapshot, all user-visible strings are already translated for the target locale. Render them directly - no translation lookup needed.

---

## Rendering a Tool UI

A platform that receives a capability snapshot can render a complete, interactive UI for any tool using only the `fields` tree - no React code, no schema inference, no network calls to the remote.

**The contract:**

1. Walk the `fields` tree recursively.
2. For each `schemaType: "object" | "object-optional" | "widget-object"` node, apply the `type` (container layout) and recurse into `children`.
3. For each `schemaType: "array" | "array-optional"` node, apply the container layout and recurse into `child` for each array item.
4. For each `schemaType: "object-union"` node, read the `discriminator` field from current data, select the matching `variant`, recurse.
5. For each `schemaType: "primitive"` node with `usage.request`:
   - `type === "form_field"`: render input widget selected by `fieldType`.
   - Other `type` values: render a display widget using current value.
6. For each `schemaType: "primitive" | "widget"` node with `usage.response`, render the display widget using response data.
7. Skip any node where `hidden === true` or `hiddenForPlatforms` includes the current platform.

The result is a complete, properly labelled, properly constrained UI - dropdowns populated, sliders ranged, date pickers bounded, markdown previewed - derived entirely from the field tree.

---

## Tool UI - VibeFrame vs Field-Driven vs Fallback

When a remote tool is selected in the UI, rendering priority is:

**Active connection → VibeFrame (highest fidelity):** `VibeFrameHost` renders an iframe pointing at `remoteConnection.remoteUrl`. The iframe loads the remote instance's own live widget at `/{locale}/frame/{toolName}`. The remote's full UI - its custom React components, live state, interactive elements - renders inside the local client. When the iframe signals `vf:success`, the parent form submits with the returned data.

This is the highest-fidelity path: the remote renders exactly what it would render locally. Custom widgets, live previews, interactive elements - all work because it's literally the remote's own code in an iframe.

**No active connection → Field-driven UI:** The local platform renders a UI from the capability snapshot's `fields` tree (see above). No live connection needed. Works offline, across NAT, behind firewalls. Labels, options, constraints, layout - all present. The user can compose and submit tool input without the remote being reachable.

**No snapshot → Raw JSON fallback:** Last resort. The user edits the `input` JSON field directly via the `execute-tool` parent form. No field labels, no validation, no options. Exists only for debugging and manual invocation.

The VibeFrame bridge uses postMessage (`vf:init`, `vf:auth`, `vf:data`, `vf:theme`, `vf:success`). It auto-resizes to fit the frame's content.

---

## Endpoint Definition Fields (Tool Control)

Fields on `createEndpoint()` that affect tool behavior:

| Field                  | Type                       | Effect                                                                 |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `requiresConfirmation` | `boolean?`                 | Forces `approve` mode regardless of what the AI passes                 |
| `streamTimeoutMs`      | `number?`                  | Per-tool stream timeout override. `0` = no timeout (interactive tools) |
| `credits`              | `number?`                  | Fixed credit cost shown to user before execution                       |
| `dynamicCredits`       | `fn?`                      | Compute credit cost from actual input values                           |
| `aliases`              | `string[]?`                | Preferred tool names - first alias becomes the toolName                |
| `events`               | `Record<string, ZodType>?` | WebSocket event schemas for tools that push live data                  |

All other fields (`title`, `description`, `fields`, `examples`, `errorTypes`) contribute to the AI's tool description, input schema, and the capability snapshot.
