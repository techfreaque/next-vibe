# `setup.ts` — machine-local artifacts

A module that owns files which are **generated on the developer's machine** — absolute paths, a chosen runtime, anything that cannot be committed — declares a `setup.ts` beside its own code.

`vibe setup` runs every `install()`. `vibe uninstall` runs every `uninstall()`. Neither the CLI nor any other module imports your platform to do it: the [`setup-index` generator](generator.md) discovers the file and emits the registry.

The package manager runs the same set on `postinstall`, via `src/vibe/core/setup/postinstall.mjs`.

---

## The contract

```ts
// src/vibe/platforms/mcp/setup.ts
import "server-only";

import chalk from "chalk";
import type { SetupResult } from "next-vibe/core/setup/types";
import type { EndpointLogger } from "next-vibe/logger/types";

export const description = "MCP config";

export async function install(logger: EndpointLogger): Promise<SetupResult> {
  const { changed, failed } = await writeMcpConfigs();
  if (failed !== undefined) {
    return { changed, summary: failed, failed };
  }
  logger.info(`${chalk.green("✓")} ${description}`);
  return { changed, summary: `wrote ${changed.length} MCP config file(s)` };
}

export async function uninstall(logger: EndpointLogger): Promise<SetupResult> {
  const changed = await removeMcpConfigs();
  return { changed, summary: `removed ${changed.length} file(s)` };
}
```

Three exports, all required. Name the file `setup.ts`, or `<name>.setup.ts` when one directory owns two unrelated artifacts — the `<name>` stays in the registry key so the output still says which is which.

| Export        | Type                               | Purpose                                                                         |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| `description` | `string`                           | What this setup owns. A **label, not a sentence** — it is printed after a tick. |
| `install`     | `(logger) => Promise<SetupResult>` | Create the artifacts. Must be idempotent.                                       |
| `uninstall`   | `(logger) => Promise<SetupResult>` | Remove them. Absent files are already correct.                                  |

```ts
interface SetupResult {
  changed: string[]; // absolute paths created/rewritten/removed; [] is a valid no-op
  summary: string; // one line, used for the endpoint response
  failed?: string; // set to report a hard failure
}
```

A file exporting **none** of these is skipped silently — `setup.ts` is also vitest's name for something else entirely. Exporting **some** of them is a typo or a half-finished module, and gets a warning at generate time so it does not silently never run.

---

## Failing: return, never throw

`restricted-syntax` bans `throw` in this codebase. A setup reports failure by returning `failed`, exactly as a generator does with [`GeneratorResult.failed`](generator.md):

```ts
if (!bunAvailable && !npxAvailable) {
  return {
    changed: [],
    summary: "",
    failed: "Neither bun nor npx is on PATH.",
  };
}
```

The runner turns that into a failed entry, prints it, and carries on with the other setups. Nothing here is an endpoint, so there is no `ResponseType` either — `core/setup/install` is what turns these into one.

---

## You own your output

The logger is the **only** parameter, and the runner is deliberately silent — it prints nothing but a failure line. Everything a setup has to say about its work, it says itself. A runner that also announced each entry would print the run twice.

So print something worth reading:

- `logger.vibe()` for a heading, `logger.info()` for detail lines, `chalk` for colour.
- Show **repo-relative** paths. An absolute Windows path buries the one part that matters.
- `logger.warn()` for anything the user must act on (a PATH that only a new shell will see) — not another tick in a list of successes.
- Don't dump hundreds of files; say how many and put the list behind `logger.debug()`.

There is no `verbose` flag. Nice output is the default; `debug()` is where the noise goes.

## Everything else you resolve yourself

There is no context beyond the logger, on purpose: a setup resolves its own inputs, so there is nothing for a caller to pass wrongly.

**Never anchor on `process.cwd()`.** Use `getSrcDir()` from `@/env/paths` for the project root, and resolve files you own from `import.meta.url` — the way `platforms/mcp/setup.ts` finds `mcp.template.json` beside it. The CLI is a global binary that runs this source in place, so the developer's shell can be standing anywhere.

---

## Rules

- **Self-contained.** A setup is one file plus whatever data sits beside it. Don't spread it over a `config.ts`, a `binary.ts` and a helpers directory — if it needs that much, it is doing too much.
- **`install()` must be idempotent.** It runs on every `postinstall`. Overwrite unconditionally rather than merging: these are generated artifacts, so a stale one is a bug, not a customization worth preserving.
- **Gitignore what you write.** If it embeds an absolute path or a resolved runtime, it is per-machine. Add it to `.gitignore` in the same change.

---

## The three that exist

```
src/vibe/core/generators/setup.ts   - regenerates all generated code
src/vibe/platforms/cli/setup.ts     - the global command shim (+ PATH)
src/vibe/platforms/mcp/setup.ts     - MCP config for Claude Code, Cursor, VS Code
```

They run in registry order, which is file-path order — so `core/…` lands before `platforms/…` and generated code is fresh before anything reads it. That is convenient rather than load-bearing: no setup may depend on another having run.

`platforms/cli/setup.ts` is worth reading for why the split lands where it does: the shim it writes points at `vibe-runtime.ts` **in that same directory** and derives the path from its own module location. That is why the setup _command_ lives in `core/setup` while the CLI's own setup stays in the CLI platform — move that file and the shim silently retargets.

---

## Verifying your work

```bash
vibe gen                  # regenerate the registry — your setup must appear in the count
vibe setup                # run install(); check your output
vibe uninstall            # run uninstall(); confirm the artifacts are gone
```

If `vibe gen` reports a lower count than you expect, your file failed export validation — check the warning it printed.
