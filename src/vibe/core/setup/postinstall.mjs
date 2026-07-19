#!/usr/bin/env node
/* eslint-disable no-console -- The package manager's stdout is the only place
   this can report to. It runs before any TS is loadable, so the EndpointLogger
   the rest of the codebase uses does not exist yet. */
/**
 * postinstall entry: runs the setup command once dependencies are in place.
 *
 * Lives in the setup domain because running the `setup.ts` files is the whole
 * point of it — the CLI runtime is just the way in. It is the same `install()`
 * set that `vibe setup` runs, only triggered by the package manager.
 *
 * The runtime is resolved from this module's own location rather than from a
 * path the caller supplies. `<vibe>/core/setup/` → `<vibe>/platforms/cli/` is
 * fixed inside the framework; what differs between repos is only the depth the
 * framework is vendored at. So this file drops into either layout unchanged,
 * while a literal path in package.json would be wrong in one of them. Same
 * reason `binary.ts` derives the shim target that way.
 *
 * Plain Node on purpose: postinstall fires before anything has chosen a TS
 * runtime, so this cannot be the TypeScript it is about to launch — which is
 * also why the bun/tsx precedence is duplicated from `core/env.ts` rather than
 * imported.
 *
 * That precedence matches the CLI shim: bun if it is on PATH, else `npx tsx`.
 * Deciding here rather than hardcoding a manager is the point — a literal
 * `"postinstall": "bun ..."` fails for every npm, yarn and pnpm user.
 *
 * NEVER fails the install. A developer who cannot run setup should still end up
 * with working node_modules; the message tells them what to run by hand.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const runtimeEntry = join(
  here,
  "..",
  "..",
  "platforms",
  "cli",
  "vibe-runtime.ts",
);

// npm/yarn/pnpm set INIT_CWD to the directory the install was started from.
// The CLI resolves the project root from its own source location, so this only
// needs to be somewhere sane.
const cwd = process.env.INIT_CWD || here;

// Windows needs a shell for the .cmd shims npx and friends ship as.
const shell = process.platform === "win32";

function isOnPath(command) {
  return (
    spawnSync(command, ["--version"], { shell, stdio: "ignore" }).status === 0
  );
}

/** Skip where setup is meaningless or unwanted — it writes developer-local files. */
function skipReason() {
  if (!existsSync(runtimeEntry)) {
    return `no CLI runtime at ${runtimeEntry}`;
  }
  if (process.env.CI) {
    return "CI is set";
  }
  if (process.env.VIBE_SKIP_SETUP) {
    return "VIBE_SKIP_SETUP is set";
  }
  return null;
}

const skip = skipReason();
if (skip) {
  console.log(`Skipping vibe setup (${skip})`);
  process.exit(0);
}

const runtime = isOnPath("bun")
  ? { command: "bun", args: [] }
  : { command: "npx", args: ["tsx"] };

const result = spawnSync(
  runtime.command,
  [...runtime.args, runtimeEntry, "setup"],
  { cwd, stdio: "inherit", shell },
);

if (result.status !== 0) {
  console.warn(
    `\nVibe setup did not complete. Run it manually if you need it:\n  ${runtime.command} ${[...runtime.args, runtimeEntry, "setup"].join(" ")}\n`,
  );
}

// Always succeed: a failed setup must not break the install.
process.exit(0);
