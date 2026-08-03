#!/usr/bin/env node
/* eslint-disable no-console -- Runs before any TS is loadable, so the
   EndpointLogger the rest of the codebase uses does not exist yet. */
/**
 * The way into the CLI from plain Node.
 *
 * Two callers, one file:
 *
 *   …/bootstrap-vibe-runtime.mjs setup       from the root postinstall hook.
 *                                            Lenient: never breaks an install.
 *   …/bootstrap-vibe-runtime.mjs <command>   a human on a fresh clone. Strict,
 *                                            and installs the root first if the
 *                                            tree is empty.
 *
 * Plain Node with zero imports, which is the whole trick: it can run on a tree
 * that has no `node_modules` and create one. The TypeScript runtime it launches
 * cannot — `vibe-runtime.ts` needs tsx or bun PLUS chalk, zod and the Ink/React
 * widget stack, all of which live in the root `node_modules`. So something
 * dependency-free has to go first, and this is it.
 *
 * Lives beside `vibe-runtime.ts` because that is what it starts. The runtime is
 * resolved relative to this file, so the vendoring depth (`src/vibe` upstream,
 * `tools/pcvibe` here) is never written down.
 *
 * The bun/tsx precedence is duplicated from `core/env.ts`, and the
 * lockfile→manager rule from `tools/dependency-manager/install/shared.ts`.
 * Neither can be imported: no TypeScript is loadable at this point. Keep them in
 * step by hand.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const runtimeEntry = join(here, "vibe-runtime.ts");
// <root>/tools/pcvibe/platforms/cli → <root>. Upstream's src/vibe/platforms/cli
// is the same depth, so this holds in both layouts.
const repoRoot = join(here, "..", "..", "..", "..");

// npm/yarn/pnpm set INIT_CWD to the directory the install was started from.
// Fall back to the project root derived from this file's own location —
// generators resolve inputs from process.cwd(), so "somewhere sane" must be the
// root, not this directory.
const cwd = process.env.INIT_CWD || repoRoot;

// Windows needs a shell for the .cmd shims npx and friends ship as.
const shell = process.platform === "win32";

/**
 * Whether the package manager invoked us, read from the lifecycle event rather
 * than from the arguments — the postinstall script passes `setup` explicitly, so
 * "no arguments" no longer identifies it.
 *
 * This decides failure handling and nothing else: a postinstall must never break
 * an install, while a command someone typed must report its exit code or the
 * caller cannot tell it failed.
 */
const argv = process.argv.slice(2);
const isPostinstall = process.env.npm_lifecycle_event === "postinstall";
const vibeCommand = argv.length > 0 ? argv : ["setup"];

function isOnPath(binary) {
  return (
    spawnSync(binary, ["--version"], { shell, stdio: "ignore" }).status === 0
  );
}

function dep(name) {
  return existsSync(join(repoRoot, "node_modules", name));
}

/**
 * True once the runtime can actually start — i.e. this checkout is installed.
 *
 * Two separate things, and conflating them is a trap: bun on PATH is a fact
 * about the MACHINE, not about this checkout. Whichever runtime executes it, the
 * CLI imports chalk, zod and the widget stack from the root `node_modules`.
 *
 * Probing real packages rather than the `node_modules` directory: an interrupted
 * install leaves the directory behind, and "it exists" would then skip the
 * install that would have repaired it.
 */
function rootInstalled() {
  return (
    dep("chalk") && dep("zod") && dep("ink") && (isOnPath("bun") || dep("tsx"))
  );
}

/**
 * Which package manager owns the ROOT, read from its lockfile.
 *
 * Never guessed. A missing lockfile is a hard error rather than a fallback to
 * `npm install`: an unfrozen install rewrites lockfiles, and moving a lockfile
 * is a deliberate bump, never a side effect of setting a machine up.
 */
function detectRootManager() {
  if (
    existsSync(join(repoRoot, "bun.lock")) ||
    existsSync(join(repoRoot, "bun.lockb"))
  ) {
    return { manager: "bun", args: ["install", "--frozen-lockfile"] };
  }
  if (existsSync(join(repoRoot, "yarn.lock"))) {
    // Yarn 2+ renamed the flag; `.yarnrc.yml` is what marks a berry project.
    return existsSync(join(repoRoot, ".yarnrc.yml"))
      ? { manager: "yarn", args: ["install", "--immutable"] }
      : { manager: "yarn", args: ["install", "--frozen-lockfile"] };
  }
  if (existsSync(join(repoRoot, "pnpm-lock.yaml"))) {
    return { manager: "pnpm", args: ["install", "--frozen-lockfile"] };
  }
  if (existsSync(join(repoRoot, "package-lock.json"))) {
    return { manager: "npm", args: ["ci"] };
  }
  return null;
}

/** Installs the root dependencies, frozen. Only called when they are missing. */
function installRoot() {
  const root = detectRootManager();
  if (root === null) {
    console.error(
      `\nNo lockfile at ${repoRoot}. Refusing to install without one — an unfrozen install would rewrite lockfiles.\n`,
    );
    return false;
  }

  console.log(
    `\nInstalling root dependencies (${root.manager} ${root.args.join(" ")})…\n`,
  );

  // This install fires the root postinstall, which re-enters this file and would
  // run setup a second time. The command below does it once, properly.
  const env = { ...process.env, VIBE_SKIP_SETUP: "1" };

  // yarn goes through install-retry, which already retries three times around a
  // Windows AV/EDR race on freshly-extracted esbuild.exe.
  const retry = join(repoRoot, "buildscripts", "install-retry.mjs");
  if (root.manager === "yarn" && existsSync(retry)) {
    return (
      spawnSync(process.execPath, [retry, ...root.args.slice(1)], {
        cwd: repoRoot,
        stdio: "inherit",
        env,
      }).status === 0
    );
  }

  return (
    spawnSync(root.manager, root.args, {
      cwd: repoRoot,
      stdio: "inherit",
      shell,
      env,
    }).status === 0
  );
}

/** Skip where setup is meaningless or unwanted — it writes developer-local files. */
function skipReason() {
  if (!existsSync(runtimeEntry)) {
    return `no CLI runtime at ${runtimeEntry}`;
  }
  // Only the postinstall path skips on CI. An explicit command is exactly what
  // CI should be able to run.
  if (isPostinstall && process.env.CI) {
    return "CI is set";
  }
  if (isPostinstall && process.env.VIBE_SKIP_SETUP) {
    return "VIBE_SKIP_SETUP is set";
  }
  return null;
}

const skip = skipReason();
if (skip) {
  console.log(`Skipping vibe setup (${skip})`);
  process.exit(0);
}

// A postinstall runs AFTER its own install, so the tree is already there; only an
// explicit command can be starting from an empty clone.
if (!isPostinstall && !rootInstalled() && !installRoot()) {
  console.error("\nCould not install root dependencies.\n");
  process.exit(1);
}

const runtime = isOnPath("bun")
  ? { command: "bun", args: [] }
  : { command: "npx", args: ["tsx"] };

// The CLI runtime statically imports the generated registries, so on a tree with
// no generated files it cannot even load — `setup` would fail before running.
// The generators orchestrator has a dedicated entry for exactly this; run it
// first when the registry is missing.
//
// Up to 3 passes in fresh processes: pass 1 cannot validate routes that import
// another generator's not-yet-written output, and a later pass succeeds once
// those files exist.
//
// Two probe locations because vendoring layouts differ: `generated/` may sit
// beside the framework (`src/generated`) or inside it (`<vendor>/generated`).
const generatedProbes = [
  join(here, "..", "..", "generated", "endpoints", "endpoint.ts"),
  join(here, "..", "..", "..", "generated", "endpoints", "endpoint.ts"),
];
if (!generatedProbes.some((probe) => existsSync(probe))) {
  const bootstrapEntry = join(
    here,
    "..",
    "..",
    "core",
    "generators",
    "repository.ts",
  );
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Bootstrapping generated files (pass ${attempt})…`);
    const generated = spawnSync(
      runtime.command,
      [...runtime.args, bootstrapEntry],
      { cwd, stdio: "inherit", shell },
    );
    if (generated.status === 0) {
      break;
    }
  }
}

const result = spawnSync(
  runtime.command,
  [...runtime.args, runtimeEntry, ...vibeCommand],
  { cwd, stdio: "inherit", shell },
);

if (result.status !== 0) {
  console.warn(
    `\nvibe ${vibeCommand.join(" ")} did not complete. Run it manually if you need it:\n  ${runtime.command} ${[...runtime.args, runtimeEntry, ...vibeCommand].join(" ")}\n`,
  );
}

// A failed setup must not break an install; an explicit command must report.
process.exit(isPostinstall ? 0 : (result.status ?? 1));
