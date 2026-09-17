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
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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

/**
 * Installs the root dependencies, frozen. Only called when they are missing.
 *
 * `--ignore-scripts`: this call exists purely to get chalk/zod/ink/tsx on disk
 * so the real runtime below can even start — it is not "setup". Without this
 * flag the install fires the root `postinstall` hook, which re-enters this
 * file as `bootstrap-vibe-runtime.mjs setup` while THIS install is still
 * running, before the command the user actually asked for ever launches.
 * Whatever real command runs next does its own install with scripts enabled,
 * so postinstall still fires — exactly once, for real, there — instead of
 * here, redundantly, for a bootstrap step that doesn't need it.
 */
function installRoot() {
  const root = detectRootManager();
  if (root === null) {
    console.error(
      `\nNo lockfile at ${repoRoot}. Refusing to install without one — an unfrozen install would rewrite lockfiles.\n`,
    );
    return false;
  }
  const args = [...root.args, "--ignore-scripts"];

  console.log(
    `\nInstalling root dependencies (${root.manager} ${args.join(" ")})…\n`,
  );

  // yarn goes through install-retry, which already retries three times around a
  // Windows AV/EDR race on freshly-extracted esbuild.exe.
  const retry = join(repoRoot, "buildscripts", "install-retry.mjs");
  if (root.manager === "yarn" && existsSync(retry)) {
    return (
      spawnSync(process.execPath, [retry, ...args.slice(1)], {
        cwd: repoRoot,
        stdio: "inherit",
      }).status === 0
    );
  }

  return (
    spawnSync(root.manager, args, {
      cwd: repoRoot,
      stdio: "inherit",
      shell,
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

/**
 * tsx applies tsconfig `paths` (what makes `next-vibe/*` imports resolve) only
 * when it auto-discovers a tsconfig.json by walking up from CWD, and that
 * discovery can come up empty for reasons outside this script's control —
 * silently, with path-alias resolution just disabled and no warning. Pointing
 * tsx at the known-correct root tsconfig directly via TSX_TSCONFIG_PATH skips
 * auto-discovery entirely. Bun ignores this var and uses its own built-in
 * tsconfig support, so it's harmless to set unconditionally.
 */
const env = {
  ...process.env,
  TSX_TSCONFIG_PATH: join(repoRoot, "tsconfig.json"),
};

/**
 * Ordered runtime candidates, most-preferred first. Bun's tsconfig-paths
 * support is separate from tsx's and can fail independently of it —
 * TSX_TSCONFIG_PATH above only hardens the tsx candidate. Rather than trust
 * either blindly, `resolvesAlias` below actively probes each in order and uses
 * the first one that actually resolves `next-vibe/*`, instead of committing to
 * a preference and only discovering it's broken deep inside the real
 * command's stack trace.
 *
 * `npx tsx` rather than resolving node_modules/.bin ourselves: npx already
 * checks the local install before ever touching the registry, so this is the
 * same binary in the common case, with npx's own node_modules tree-walk doing
 * the resolution. No version pin needed: `rootInstalled()`/`installRoot()`
 * above already guarantee a frozen-lockfile install ran before this point
 * whenever node_modules was missing, so the lockfile-resolved tsx is already
 * there for npx to find.
 */
const runtimeCandidates = [
  ...(isOnPath("bun")
    ? [{ command: "bun", args: [], label: "bun on PATH" }]
    : []),
  { command: "npx", args: ["tsx"], label: "npx tsx" },
];

/**
 * A real file on disk, not a `-e`/`--eval` string: `shell: true` on Windows
 * hands the whole command line to cmd.exe, which parses an unquoted `=>` as
 * the redirection operator `>` followed by a filename — an eval string
 * containing arrow functions can silently write its own tail as a junk file
 * instead of ever running. A file path has no shell metacharacters left to
 * misparse, which is the same reason runtimeEntry/bootstrapEntry are passed
 * as paths below, not inline code.
 *
 * Under repoRoot/.tmp, not the OS temp directory: a candidate whose tsconfig
 * discovery walks up from the FILE being run rather than from CWD (bun does
 * this) would never reach the repo's tsconfig from a system temp dir, making
 * every such candidate fail this probe regardless of whether it can actually
 * resolve `next-vibe/*` for real files inside the repo.
 */
const tmpRoot = join(repoRoot, ".tmp");
mkdirSync(tmpRoot, { recursive: true });
const probeDir = mkdtempSync(join(tmpRoot, "vibe-resolve-probe-"));
const probeFile = join(probeDir, "probe.mjs");
writeFileSync(
  probeFile,
  "import('next-vibe/core/env').then(() => process.exit(0), () => process.exit(1));\n",
);

/** Does this candidate actually resolve a known `next-vibe/*` alias right now? */
function resolvesAlias(candidate) {
  const probe = spawnSync(candidate.command, [...candidate.args, probeFile], {
    cwd: repoRoot,
    shell,
    env,
  });
  return probe.status === 0;
}

const workingCandidate = runtimeCandidates.find(resolvesAlias);
if (!workingCandidate && runtimeCandidates.length > 1) {
  console.warn(
    `\nNone of the available runtimes (${runtimeCandidates.map((c) => c.label).join("; ")}) resolved 'next-vibe/*' imports in a quick smoke test. Proceeding with the first anyway — see diagnostics below.\n`,
  );
} else if (workingCandidate && workingCandidate !== runtimeCandidates[0]) {
  console.warn(
    `\n${runtimeCandidates[0].label} failed to resolve 'next-vibe/*' imports; falling back to ${workingCandidate.label}.\n`,
  );
}
const runtime = workingCandidate ?? runtimeCandidates[0];
rmSync(probeDir, { recursive: true, force: true });

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
      { cwd, stdio: "inherit", shell, env },
    );
    if (generated.status === 0) {
      break;
    }
  }
}

const result = spawnSync(
  runtime.command,
  [...runtime.args, runtimeEntry, ...vibeCommand],
  { cwd, stdio: "inherit", shell, env },
);

/** Diagnostics for "why didn't this run", printed once, only on failure. */
function printDiagnostics() {
  const runtimeVersion = (() => {
    const r = spawnSync(runtime.command, [...runtime.args, "--version"], {
      shell,
    });
    return r.status === 0
      ? r.stdout.toString().trim()
      : `unresolved (exit ${r.status ?? r.error})`;
  })();

  const gitHead = (() => {
    const r = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: repoRoot,
      shell,
    });
    return r.status === 0
      ? r.stdout.toString().trim()
      : "unresolved (not a git repo or git not on PATH)";
  })();

  // src/vibe/core is what tsconfig's `next-vibe/*` paths entry actually points
  // at. `runtimeEntry` (vibe-runtime.ts) living deeper under platforms/cli can be
  // present while this is missing — a stale or partial checkout, not a tsx/tsconfig
  // problem — and that's indistinguishable from a real paths-resolution bug unless
  // checked directly.
  const coreDirPresent = existsSync(join(here, "..", "..", "core"));

  console.warn(
    [
      "",
      "--- vibe setup diagnostics ---",
      `node:              ${process.version} (${process.platform})`,
      `repoRoot:          ${repoRoot}`,
      `git HEAD:          ${gitHead}`,
      `tsconfig:          ${existsSync(join(repoRoot, "tsconfig.json")) ? "found" : "MISSING at repo root"}`,
      `src/vibe/core:     ${coreDirPresent ? "present" : "MISSING — checkout is stale or partial; pull latest and reinstall"}`,
      `runtime:           ${runtime.command} (${runtime.label ?? ""})`,
      `runtime version:   ${runtimeVersion}`,
      `TSX_TSCONFIG_PATH: ${env.TSX_TSCONFIG_PATH}`,
      "",
      "If imports like `next-vibe/...` still fail to resolve (ERR_MODULE_NOT_FOUND)",
      "despite TSX_TSCONFIG_PATH pointing at a real file above, the tsx package",
      "itself is likely broken. Usual fix: delete node_modules at the repo root and",
      "reinstall with the package manager matching the root lockfile.",
      "",
      "Note for manual re-runs: paste the command below into PowerShell or cmd, not",
      "Git Bash/WSL — those shells strip backslashes from Windows paths and mangle it.",
      "---",
    ].join("\n"),
  );
}

if (result.status !== 0) {
  printDiagnostics();
  console.warn(
    [
      "",
      `vibe ${vibeCommand.join(" ")} did not complete.`,
      "Fix whatever the diagnostics above point to (usually a reinstall of",
      "node_modules at the repo root), then re-run manually. In PowerShell:",
      `  $env:TSX_TSCONFIG_PATH = "${env.TSX_TSCONFIG_PATH}"`,
      `  ${runtime.command} ${[...runtime.args, runtimeEntry, ...vibeCommand].join(" ")}`,
      "",
    ].join("\n"),
  );
}

// A failed setup must not break an install; an explicit command must report.
process.exit(isPostinstall ? 0 : (result.status ?? 1));
