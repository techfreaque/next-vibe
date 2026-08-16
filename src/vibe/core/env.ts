/**
 * Core Server Environment
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";

import { z } from "zod";

import { defineEnv } from "../env/define-env";
import { isHermesDev, isPreviewMode } from "../env/detect";
import { Environment, VibeMode, VibeModeValues } from "../env/env-util";

export const PackageManager = {
  BUN: "bun",
  NPM: "npm",
  YARN: "yarn",
  PNPM: "pnpm",
} as const;

export type PackageManagerValue =
  (typeof PackageManager)[keyof typeof PackageManager];

const packageManagerValues = Object.values(PackageManager);

function isPackageManager(value: string): value is PackageManagerValue {
  return (packageManagerValues as readonly string[]).includes(value);
}

/** Lockfile → manager, ordered most to least specific. */
const LOCKFILES: readonly (readonly [string, PackageManagerValue])[] = [
  ["bun.lock", PackageManager.BUN],
  ["bun.lockb", PackageManager.BUN],
  ["pnpm-lock.yaml", PackageManager.PNPM],
  ["yarn.lock", PackageManager.YARN],
  ["package-lock.json", PackageManager.NPM],
];

/** Walk up from `from` to the filesystem root, yielding each directory. */
function* ancestors(from: string): Generator<string> {
  let dir = from;
  for (;;) {
    yield dir;
    const parent = dirname(dir);
    if (parent === dir) {
      return;
    }
    dir = parent;
  }
}

/** `npm_config_user_agent` looks like "yarn/1.22.22 npm/? node/v22.23.1 win32 x64". */
function fromUserAgent(): PackageManagerValue | null {
  const name = process.env["npm_config_user_agent"]?.split("/")[0]?.trim();
  return name && isPackageManager(name) ? name : null;
}

/** The only field of package.json this reads. Validated below, not trusted. */
interface PackageJsonShape {
  packageManager?: string;
}

/** The corepack `packageManager` field, e.g. `"bun@1.3.12"`. */
function fromPackageJson(cwd: string): PackageManagerValue | null {
  for (const dir of ancestors(cwd)) {
    const pkgPath = join(dir, "package.json");
    if (!existsSync(pkgPath)) {
      continue;
    }
    try {
      const parsed: PackageJsonShape = JSON.parse(
        readFileSync(pkgPath, "utf-8"),
      ) as PackageJsonShape;
      const field = parsed.packageManager;
      const name =
        typeof field === "string" ? field.split("@")[0]?.trim() : undefined;
      if (name && isPackageManager(name)) {
        return name;
      }
    } catch {
      // Unreadable/!JSON package.json — keep walking rather than fail detection.
    }
  }
  return null;
}

function fromLockfile(cwd: string): PackageManagerValue | null {
  for (const dir of ancestors(cwd)) {
    for (const [file, manager] of LOCKFILES) {
      if (existsSync(join(dir, file))) {
        return manager;
      }
    }
  }
  return null;
}

/**
 * Whether `bun` resolves on PATH.
 *
 * Scans PATH rather than spawning `bun --version`: this is called while building
 * the env defaults, i.e. on every CLI start, and a subprocess there costs more
 * than the whole check it is deciding for.
 *
 * Cached — PATH does not change within a run.
 */
let bunOnPath: boolean | undefined;
export function isBunOnPath(): boolean {
  if (bunOnPath !== undefined) {
    return bunOnPath;
  }
  if (process.versions["bun"]) {
    // Already running under it; no need to look.
    bunOnPath = true;
    return bunOnPath;
  }
  const names = process.platform === "win32" ? ["bun.exe", "bun"] : ["bun"];
  bunOnPath = (process.env.PATH ?? "")
    .split(delimiter)
    .filter(Boolean)
    .some((dir) => names.some((name) => existsSync(join(dir, name))));
  return bunOnPath;
}

/**
 * Resolve the package manager used to RUN things — oxlint, tsc, vitest, the MCP
 * server's runtime.
 *
 * bun wins whenever it is installed, whatever the lockfile says. That is the
 * point of the ordering: a lockfile records how dependencies were *installed*,
 * which is a different question from what should *execute* them. `bunx` resolves
 * the same `node_modules/.bin` every other manager does, starts faster, and runs
 * TypeScript directly — so on a machine with bun there is no reason for a
 * `yarn.lock` to force `yarn --silent run tsc`. It also keeps this in step with
 * the CLI shim and the generated MCP config, both of which prefer bun on PATH;
 * disagreeing between them is how you get a project that checks under one
 * runtime and serves under another.
 *
 * Only without bun do the project's own signals decide, most specific first:
 * what it declares, then what it has installed, and only then how this process
 * happened to be launched. `npm_config_user_agent` ranks last precisely because
 * launching via `npx` sets it to npm regardless of what the project uses.
 *
 * Set PACKAGE_MANAGER explicitly to override — this only supplies its default,
 * so it must not read that var.
 */
export function detectPackageManager(
  cwd: string = process.cwd(),
): PackageManagerValue {
  if (isBunOnPath()) {
    return PackageManager.BUN;
  }
  return (
    fromPackageJson(cwd) ??
    fromLockfile(cwd) ??
    fromUserAgent() ??
    PackageManager.NPM
  );
}

/** Yarn Berry keeps its config in `.yarnrc.yml`; Yarn Classic never has one. */
function isYarnBerry(cwd: string): boolean {
  return [...ancestors(cwd)].some((dir) =>
    existsSync(join(dir, ".yarnrc.yml")),
  );
}

/**
 * How to invoke a locally installed binary (oxlint, tsc, vitest, …).
 *
 * Callers parse the binary's stdout, so each runner is chosen to forward flags
 * intact and add nothing of its own. Yarn Classic is the awkward one: its
 * `exec` cannot find bin-only packages, and a bare `run` prints a two-line
 * banner to stdout — hence `--silent run`.
 *
 * `shell` is required on Windows because every manager except bun ships a
 * `.cmd` shim, and Node refuses to spawn `.cmd` without a shell.
 */
export function getPackageRunner(
  manager: PackageManagerValue,
  cwd: string = process.cwd(),
): { command: string; args: readonly string[]; shell: boolean } {
  const shell = process.platform === "win32";
  switch (manager) {
    case PackageManager.BUN:
      // bunx is a real executable everywhere, so it never needs a shell.
      return { command: "bunx", args: [], shell: false };
    case PackageManager.PNPM:
      return { command: "pnpm", args: ["exec"], shell };
    case PackageManager.YARN:
      return {
        command: "yarn",
        args: isYarnBerry(cwd) ? ["exec"] : ["--silent", "run"],
        shell,
      };
    case PackageManager.NPM:
      return { command: "npx", args: [], shell };
  }
}

/**
 * How to run a package straight from the registry (`@scope/pkg@latest`) rather
 * than a binary already in node_modules.
 *
 * Distinct from {@link getPackageRunner}: local-exec forms like
 * `yarn --silent run` or `pnpm exec` only resolve installed bins and cannot
 * fetch. Yarn Classic has no `dlx` at all, so it borrows npx — which is always
 * present wherever node is.
 */
export function getPackageDlxRunner(
  manager: PackageManagerValue,
  cwd: string = process.cwd(),
): { command: string; args: readonly string[] } {
  switch (manager) {
    case PackageManager.BUN:
      return { command: "bunx", args: [] };
    case PackageManager.PNPM:
      return { command: "pnpm", args: ["dlx"] };
    case PackageManager.YARN:
      return isYarnBerry(cwd)
        ? { command: "yarn", args: ["dlx"] }
        : { command: "npx", args: ["--yes"] };
    case PackageManager.NPM:
      return { command: "npx", args: ["--yes"] };
  }
}

/**
 * How to run a TypeScript entrypoint with a preload module, for config files
 * that must spell out a runtime instead of spawning one (an MCP server's
 * `command`/`args`, for example).
 *
 * Prefers bun whenever it is installed, and only then falls back to the
 * project's package manager driving `tsx` — the same precedence as the CLI shim
 * and as {@link detectPackageManager}, so a machine with bun gets bun from all
 * three. The shim can defer that choice to run time; a generated config is
 * static JSON, so it is resolved here instead.
 *
 * The two runtimes differ in argv shape, not just in name, which is why this
 * returns the whole prefix rather than one executable:
 *
 *   bun   → bun --preload <preload> <entry>
 *   tsx   → npx tsx --import <preload> <entry>
 *
 * bun's `--preload` and node's `--import` both evaluate the module before the
 * entrypoint; that ordering is the point, since the preload seeds process.env
 * before the env singleton freezes. Non-bun managers reach `tsx` through
 * {@link getPackageRunner}, so each one uses its own local-exec form.
 *
 * `preloadNeedsUrl` is not cosmetic: node resolves `--import` as a URL, so a
 * Windows absolute path fails outright with ERR_UNSUPPORTED_ESM_URL_SCHEME ("C:"
 * reads as the scheme). bun's `--preload` wants the plain path instead.
 */
export function getRuntimeInvocation(
  manager: PackageManagerValue,
  cwd: string = process.cwd(),
): {
  command: string;
  argsPrefix: string[];
  preloadFlag: string;
  preloadNeedsUrl: boolean;
} {
  if (manager === PackageManager.BUN || isBunOnPath()) {
    return {
      command: "bun",
      argsPrefix: [],
      preloadFlag: "--preload",
      preloadNeedsUrl: false,
    };
  }
  const runner = getPackageRunner(manager, cwd);
  return {
    command: runner.command,
    argsPrefix: [...runner.args, "tsx"],
    preloadFlag: "--import",
    preloadNeedsUrl: true,
  };
}

/**
 * Quote one argument for a Windows `shell: true` spawn: Node hands cmd.exe a
 * single flat string, so anything with whitespace or a metacharacter needs to
 * carry its own quotes.
 */
function quoteShellArg(arg: string): string {
  if (!/[\s"&()<>^|]/.test(arg)) {
    return arg;
  }
  return `"${arg.replaceAll('"', '\\"')}"`;
}

/**
 * Full argv for running `binary` with `args` under `manager`, already
 * shell-quoted when the platform requires it. Pass straight to `spawn`.
 */
export function buildPackageRunnerCommand(
  manager: PackageManagerValue,
  binary: string,
  args: readonly string[],
  cwd: string = process.cwd(),
): { command: string; args: string[]; shell: boolean } {
  const runner = getPackageRunner(manager, cwd);
  const full = [...runner.args, binary, ...args];
  return {
    command: runner.command,
    args: runner.shell ? full.map(quoteShellArg) : [...full],
    shell: runner.shell,
  };
}

export const {
  env: coreEnv,
  schema: coreEnvSchema,
  examples: coreEnvExamples,
} = defineEnv({
  NODE_ENV: {
    schema: z
      .enum(Environment)
      .default(
        isPreviewMode && !isHermesDev
          ? Environment.PRODUCTION
          : Environment.DEVELOPMENT,
      ),
    example: "development",
    comment:
      "vibe dev always uses dev DB on port 5432. vibe build/start in development: auto-manages preview DB on port 5433. vibe build/start in production: no DB setup, expects externally managed database.",
    fieldType: "select",
    options: ["development", "test", "production"],
  },
  PACKAGE_MANAGER: {
    schema: z.enum(packageManagerValues).default(detectPackageManager()),
    example: "bun",
    commented: true,
    comment:
      "Package manager used to run bundled binaries (oxlint, oxfmt, tsc, vitest). Auto-detected from the packageManager field, then the lockfile, then npm_config_user_agent; set this to override.",
    fieldType: "select",
    options: [...packageManagerValues],
  },
  IS_PREVIEW_MODE: {
    schema: z
      .string()
      .optional()
      .default(isPreviewMode ? "true" : "false")
      .transform((v) => v !== "false"),
    example: false,
    commented: true,
    fieldType: "boolean",
  },
  NEXT_PUBLIC_VIBE_MODE: {
    schema: z
      .enum(VibeModeValues)
      .default(isPreviewMode ? VibeMode.AGENT : VibeMode.DEV),
    example: VibeMode.DEV,
    comment:
      "Instance mode. 'agent' = personal local instance. 'cloud' = SaaS deployment. 'dev' = Atlas coding instance (default). Set automatically by vibe build/start.",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: z.preprocess(
      (v) => {
        // When v is undefined (unset or sentinel-stripped by validateEnv in
        // VIBE_BUILD_PLACEHOLDER_ENV mode), skip the process.env re-read:
        // that would return the sentinel string, failing the .url() check.
        // Let undefined fall through so the .default() below takes over.
        if (v === undefined || v === null) {
          return undefined;
        }
        const raw = typeof v === "string" ? v : "http://localhost:3000";
        if (!isPreviewMode) {
          return raw;
        }
        try {
          const parsed = new URL(raw);
          if (
            parsed.hostname !== "localhost" &&
            parsed.hostname !== "127.0.0.1"
          ) {
            return raw;
          }
          const previewPort =
            process.env["PREVIEW_PORT"] ?? (isHermesDev ? "3002" : "3001");
          parsed.port = previewPort;
          return parsed.toString();
        } catch {
          return raw;
        }
      },
      z
        .string()
        .url()
        .default("http://localhost:3000")
        .transform((s) => s.replace(/\/$/, "")),
    ),
    example: "http://localhost:3000",
    fieldType: "url",
  },
  TEST_SERVER_URL: {
    schema: z.string().url().default("http://localhost:4000"),
    example: "http://localhost:4000",
    comment: "Base URL the E2E test server binds to. Server-side tests only.",
    commented: true,
    fieldType: "url",
  },
  PROJECT_ROOT: {
    schema: z.string().optional(),
    example: "/path/to/your/project",
    comment:
      "Absolute path to the project root. Mainly needed for MCP servers which often run in a different working directory.",
    commented: true,
  },
});
