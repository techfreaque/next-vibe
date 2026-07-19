# `env.ts` — environment variables

A module that reads configuration declares an `env.ts` beside its own code. One `defineEnv({ … })` call names the keys, validates them with Zod, computes their defaults, and exports a singleton.

`vibe gen` finds every `env.ts` in the tree and writes the combined registry plus `.env.example`. Nothing imports your module to do it — the [env generator](generator.md) discovers the file.

The env files that exist:

```
core/env.ts                    logger/env.ts
agent/env.ts                   realtime/env.ts
database/env.ts                tasks/env.ts
identity/env.ts                platforms/cli/env.ts
server/server/env.ts           server/server/image-push/env.ts
```

---

## The rule: read the singleton, never `process.env`

```typescript
// ✅
import { loggerEnv } from "@/vibe/logger/env";
if (loggerEnv.VIBE_LOG_TARGET === "file") { … }
```

```typescript
// ❌ — undefined whenever logger/env.ts has not been imported yet
if (process.env["VIBE_LOG_TARGET"] === "file") { … }
```

**A default does not exist in `process.env` until the module that declares it is imported.**

`defineEnv` computes defaults and writes them back to `process.env` (`writeEnvToProcess`) as a **module-level side effect, on first import**. Before that import, a key with no value in `.env` is simply absent. `.env` supplies only what the file literally contains; everything auto-detected — `VIBE_SERVER_MODE`, `VIBE_LOG_FILE`, `VIBE_LOG_TIMESTAMP`, `PACKAGE_MANAGER`, `NODE_ENV` — exists **only** as a computed default inside the singleton.

So a raw `process.env["VIBE_LOG_TARGET"]` read does not ask "what is the log target". It asks "has some unrelated file already imported `logger/env.ts`?" — and answers `undefined` when the answer is no. That failure is silent: the key reads as unset, the code takes its fallback branch, and nothing logs an error.

Importing the singleton is what makes the value exist. Reading `loggerEnv.VIBE_LOG_TARGET` is both the read _and_ the guarantee.

The one legitimate exception is a module that must stay bundler-safe and therefore cannot import a `server-only` env file — see [Server vs client](#server-vs-client). Those read `process.env` through an `env-client.ts` singleton instead, never raw.

---

## The contract

```typescript
// <your-module>/env.ts
import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: myEnv,
  schema: myEnvSchema,
  examples: myEnvExamples,
} = defineEnv({
  MY_API_KEY: {
    schema: z.string().min(10),
    example: "sk-your-key-here",
    comment: "What this key is for and where to get it.",
  },
});
```

Three exports, all required, and the destructured name decides the module name (`loggerEnv` → `logger`, `coreClientEnv` → `core`). A file the generator cannot match on this shape is **reported at `vibe gen` time** with the exact line to add — not at runtime.

| Field of the export | Type                      | Purpose                                           |
| ------------------- | ------------------------- | ------------------------------------------------- |
| `env`               | inferred from the schemas | The validated singleton. This is what you import. |
| `schema`            | `z.ZodObject`             | Merged into the combined schema.                  |
| `examples`          | `EnvExample[]`            | Feeds `.env.example` and `keys.ts`.               |

### The field definition

| Key                  | Type                                                                            | Meaning                                                                            |
| -------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `schema`             | `z.ZodTypeAny`                                                                  | **Required.** Validation _and_ the default. `.default()` lives here.               |
| `example`            | `string \| false`                                                               | **Required.** The value written to `.env.example`. `false` omits the key entirely. |
| `comment`            | `string`                                                                        | Explains the key in `.env.example` and in validation errors.                       |
| `commented`          | `boolean`                                                                       | Key ships in `.env.example` commented out — for anything with a working default.   |
| `fieldType`          | `"text" \| "boolean" \| "number" \| "select" \| "url" \| "email" \| "log-path"` | Widget hint for the settings UI. Defaults to `"text"`.                             |
| `options`            | `readonly string[]`                                                             | Choices for `fieldType: "select"`.                                                 |
| `sensitive`          | `boolean`                                                                       | Mask in settings views. Falls back to a name-pattern heuristic.                    |
| `category`           | `string`                                                                        | Grouping within a module (`"auth"`, `"database"`).                                 |
| `onboardingRequired` | `boolean`                                                                       | Onboarding highlights it as must-configure.                                        |
| `onboardingStep`     | `number`                                                                        | Which wizard step it appears on (1-based).                                         |
| `onboardingGroup`    | `string`                                                                        | Group label for wizard step grouping.                                              |
| `autoGenerate`       | `"hex32" \| "hex64"`                                                            | Built-in random generator for a missing/placeholder value.                         |
| `generate`           | `() => string`                                                                  | Custom generator. Takes precedence over `autoGenerate`.                            |

**`options` must list exactly what the schema accepts.** Nothing checks this — the generator copies `options` into `keys.ts` verbatim and never compares it to `schema`. An option the schema rejects compiles, generates, and renders as a selectable choice that fails validation the moment it is picked. When you edit one, edit the other:

```typescript
VIBE_LOG_TARGET: {
  schema: z.enum(["file", "none"]).optional().default("file"),
  fieldType: "select",
  options: ["file", "none"],   // same list, no extras
},
```

### Defaults are Zod defaults

There is no separate `default` key. The schema carries it, which is what lets a default be computed:

```typescript
NODE_ENV: {
  schema: z.enum(Environment).default(
    isPreviewMode && !isHermesDev ? Environment.PRODUCTION : Environment.DEVELOPMENT,
  ),
  example: "development",
},
```

Empty strings are normalized to `undefined` before parsing, so `.default()` and `.optional()` fire for `KEY=` as well as for a missing key — Docker passes unset build args as empty strings.

### Generated values

`generate` / `autoGenerate` fill a key that is missing **or holding a placeholder** (`""`, `REPLACE_WITH_*`, `your-*`). The value is written to `process.env` and **persisted into `.env`** — replacing the placeholder line in place, or appended if the key is absent — so it is stable across restarts.

### Discriminated unions

For a module whose keys depend on a mode:

```typescript
export const { env: storageEnv } = defineEnv({
  discriminator: "STORAGE_TYPE",
  variants: {
    s3: { STORAGE_TYPE: { schema: z.literal("s3"), example: "s3" }, …s3Fields },
    filesystem: { STORAGE_TYPE: { schema: z.literal("filesystem"), example: "filesystem" }, …fsFields },
  },
});
```

The first variant key is injected as the discriminator's default when the var is unset or empty, so the union always matches something.

### Encrypted values

A `.env` value may be stored encrypted as `vibe:enc:<iv>:<tag>:<ct>` (AES-256-GCM). `defineEnv` decrypts `process.env` once, lazily, before validation — declarations need no special handling. The key lives at `~/.vibe/keys/<sha256(cwd)>.key`, outside the project and never committed. See `env/env-crypto.ts`.

---

## Server vs client

Two files, and **the filename is what decides** — not the key's name.

| File            | Function          | Import                  | Discovered as |
| --------------- | ----------------- | ----------------------- | ------------- |
| `env.ts`        | `defineEnv`       | `import "server-only";` | server        |
| `env-client.ts` | `defineEnvClient` | no `server-only`        | client        |

**A `NEXT_PUBLIC_` prefix does not make a var client-safe, and its absence does not make one server-only.** `core/env.ts` (server) declares `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_LOCAL_MODE`; `core/env-client.ts` (client) declares plain `NODE_ENV`. The prefix is a _bundler_ instruction — it is what permits Next.js to inline the value into browser code. Which file you put the declaration in is what determines whether the browser can reach it.

`defineEnvClient` differs in one way that matters: every field requires an explicit `value`.

```typescript
// <your-module>/env-client.ts
import { defineEnvClient } from "next-vibe/env/define-env-client";
import { z } from "zod";

export const {
  envClient: myClientEnv,
  schema: myClientEnvSchema,
  examples: myClientEnvExamples,
} = defineEnvClient({
  NEXT_PUBLIC_APP_URL: {
    schema: z.string().url(),
    value: process.env.NEXT_PUBLIC_APP_URL, // literal reference — required
    example: "http://localhost:3000",
  },
});
```

The `value: process.env.NEXT_PUBLIC_APP_URL` line is not boilerplate. Next.js inlines client env by **statically rewriting the literal text** `process.env.NEXT_PUBLIC_X`; a dynamic `process.env[key]` lookup is invisible to it and arrives `undefined` in the browser. That literal is the whole mechanism, which is why the type forces it.

`defineEnvClient` **does not write back to `process.env`** and does not persist `generate` results — client env is baked at build time.

`logger/env-client.ts` is the reference for the split. `NEXT_PUBLIC_VIBE_DEBUG` is _produced_ server-side by `logger/env.ts` (which resolves `-v`/`--verbose` from argv) and _consumed_ client-side through `loggerClientEnv`, so `logger/debug.ts` stays bundler-safe:

```typescript
// logger/debug.ts — a client-safe module reads the client singleton
import { loggerClientEnv } from "./env-client";
export const enableDebugLogger = loggerClientEnv.NEXT_PUBLIC_VIBE_DEBUG;
```

---

## Ordering

Domain env singletons read `process.env` **at module evaluation**. Anything that must be in `process.env` before they evaluate has to be there before the first `import` of them resolves — ES module imports evaluate depth-first, in dependency order, before the importing module's own body runs.

`platforms/cli/runtime/environment.ts` is what puts it there. `loadEnvironment()` runs **as a module side effect at the bottom of the file**, not on call:

```typescript
loadEnvironment(); // last line of environment.ts
```

It finds `.env` by walking up from cwd, runs dotenv, re-applies the caller's own environment over the file (an explicit env var beats `.env`; the MCP `.mcp.json` `env` block wins), and stamps `VIBE_START_TIME`. Import it first and every later singleton evaluates against a fully loaded environment.

For entrypoints outside the CLI's own import graph — a generated MCP server config, for instance — `platforms/cli/runtime/env-preload.ts` does nothing but call it, so it can be attached ahead of everything:

```bash
bun --preload ./platforms/cli/runtime/env-preload.ts <entry>   # bun
npx tsx --import <file-url-to-preload> <entry>                 # node
```

Both flags evaluate the preload before the entrypoint. That ordering is the point: the preload seeds `process.env` before any env singleton freezes. Get it wrong and the singleton captures a value the `.env` was about to override — silently, since a wrong-but-valid value raises nothing.

---

## `detect.ts`

`env/detect.ts` is pure argv parsing — no imports, no side effects — precisely so it can be read _before_ dotenv and by env files themselves. It is what lets a default know how the process was started.

| Export           | True when                                                       |
| ---------------- | --------------------------------------------------------------- |
| `isDevCommand`   | `dev` / `d` in argv                                             |
| `isStartCommand` | `start` / `s` / `build` / `b` / `rebuild` in argv               |
| `isMcpCommand`   | `mcp` in argv                                                   |
| `isHermesDev`    | a dev command with `--preview` / `--hermes`                     |
| `isPreviewMode`  | `--preview` / `--hermes`, or a start command outside production |
| `cliArgs`        | `process.argv.slice(2)`                                         |

`logger/env.ts` is the worked example — it folds these into one `VIBE_SERVER_MODE`, then drives three other defaults off it:

```typescript
const vibeServerMode = isMcpCommand
  ? "mcp"
  : isStartCommand
    ? "hermes-prod"
    : isHermesDev
      ? "hermes-dev"
      : "atlas-dev";
```

`VIBE_LOG_FILE` (`.atlas.log` / `.hermes-dev.log` / `.hermes.log` / `.vibe-mcp.log`) and `VIBE_LOG_TIMESTAMP` (`elapsed` for dev, `iso` otherwise) follow from it. This is exactly the value that exists **only** in the singleton — no `.env` carries it.

---

## What the generator emits

`vibe gen` writes four files. `GENERATED_DIR` is `src/generated` (`@/env/paths`).

| Output                    | Contents                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `generated/env/index.ts`  | `envModules` registry, merged `envSchema`, the `env` singleton, `getModuleEnv()`      |
| `generated/env/client.ts` | `envClientModules`, `envClientSchema`, the `envClient` singleton                      |
| `generated/env/keys.ts`   | `ENV_KEYS` — serializable metadata per key. Not `server-only`; feeds `env/settings/`. |
| `.env.example`            | Every key with `example !== false`, grouped by module, with comments                  |

`ENV_KEYS` is what the settings endpoint (`env/settings/`, alias `init` / `set-setting`) turns into a form — that is why `fieldType`, `options` and `sensitive` exist on a field.

**The generated `env` singleton is for introspection, not for reading a value.** Import your module's own `myEnv` — it is narrower, and it is the import that guarantees the default exists.

### The gen cache

The env generator's cache inputs are exactly the `env.ts` and `env-client.ts` files, fingerprinted as `path:mtime:size`. **Editing a declaration invalidates the cache on its own — plain `vibe gen` is enough.**

`vibe gen --force` is for when you change a file that _feeds_ a default but is not itself an input: `env/detect.ts`, `env/define-env.ts`, or any helper a default calls (`detectPackageManager()` in `core/env.ts`). Nothing about those files is fingerprinted, so the generator reports `unchanged` and leaves stale output behind. `--noCache` skips the cache for every generator.

---

## Adding an env var

1. **Pick the file.** Server → `<module>/env.ts`. Reachable from the browser → `<module>/env-client.ts` with a `NEXT_PUBLIC_` name _and_ an explicit `value: process.env.NEXT_PUBLIC_X`. No `env.ts` in your module yet? Create one with the three exports above; the generator finds it.

2. **Declare it.** Schema carries the default. `example: false` if it is auto-detected and nobody should set it by hand; `commented: true` if it has a working default but a user might override it.

   ```typescript
   MY_FEATURE_TIMEOUT: {
     schema: z.coerce.number().optional().default(30),
     example: "30",
     comment: "Seconds before the feature gives up. Defaults to 30.",
     commented: true,
     fieldType: "number",
   },
   ```

3. **Generate.** `vibe gen` — the key appears in `.env.example` and in `ENV_KEYS`.

4. **Read it through the singleton.**

   ```typescript
   import { myEnv } from "@/vibe/my-module/env";
   const timeout = myEnv.MY_FEATURE_TIMEOUT;
   ```

   Never `process.env["MY_FEATURE_TIMEOUT"]`. Step 2's default lives in `myEnv` and nowhere else until `myEnv` is imported.

5. **Check.** `vibe check src/vibe/my-module`.

A validation failure prints the key, the Zod message, your `comment`, and a copy-pasteable `KEY="example"` line — which is what `example` and `comment` are for. Write them for someone who has never seen the key.

---

## Rules

- **Read the singleton, never `process.env`.** The default only exists once the module is imported.
- **`options` must match the schema enum.** Nothing enforces it.
- **`example` is required; `false` means "keep it out of `.env.example`".** Use it for anything auto-detected.
- **Never commit a real secret to `.env.example`.** `example` is a shape, not a value.
- **`env.ts` needs `import "server-only";`.** Its absence is what makes a file client-reachable, and the generator classifies by filename regardless.
- **One module name per tree.** Two files destructuring to the same name is a `vibe gen` error.

---

## Verifying your work

```bash
vibe gen              # key must appear in .env.example and ENV_KEYS
vibe gen --force      # after changing detect.ts or a default's helper
vibe check src/vibe/<module>
```

## See also

- [generator.md](generator.md) — how the env generator is registered and cached
- [logger.md](logger.md) — the module with the most env-driven behaviour
