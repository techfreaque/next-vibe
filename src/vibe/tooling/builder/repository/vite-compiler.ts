/**
 * Vite Compiler Service
 * Compiles files using Vite
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  watch,
  writeFileSync,
} from "node:fs";
import type { Server as NodeHttpServer } from "node:http";
import { networkInterfaces } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Subprocess, SyncSubprocess } from "bun";
import type { OutputBundle, OutputOptions, RolldownOptions } from "rolldown";
import {
  type BuildOptions,
  type EnvironmentModuleGraph,
  type InlineConfig,
  isRunnableDevEnvironment,
  type ModuleNode,
  type Plugin,
  type PluginOption,
} from "vite";
import type { EvaluatedModules } from "vite/module-runner";

import { getSrcDir, ROOT_LAYOUT_DIR } from "@/env/paths";

import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import { maybeColorize, semantic } from "../../../logger/colors";
import { serverFileLog } from "../../../logger/file";
import { createNextjsFormatter } from "../../../logger/formatters";
import type { EndpointLogger } from "../../../logger/types";
import type { BuildProfile, FileToCompile } from "../definition";
import type { scopedTranslation } from "../i18n";
import { PROFILE_DEFAULTS, ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

/** Build Vite `define` entries for all NEXT_PUBLIC_AGENT_* flags.
 *  Reads from process.env (set by loadEnvironment() before Vite starts). */
function publicEnvs(): Record<string, string> {
  const keys = Object.keys(process.env).filter((k) =>
    k.startsWith("NEXT_PUBLIC_AGENT_"),
  );
  const defines: Record<string, string> = {};
  for (const key of keys) {
    defines[`process.env.${key}`] = JSON.stringify(process.env[key]);
  }
  return defines;
}

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

declare const Bun:
  | {
      spawn: (options: { cmd: string[] }) => Subprocess;
      spawnSync: (options: { cmd: string[] }) => SyncSubprocess;
    }
  | undefined;

const isBrokenBunArg0 = (arg0: string | undefined): boolean =>
  arg0 === "bun" || (arg0?.toLowerCase().endsWith("/bun") ?? false);
const fixCmd = (cmd: string[]): string[] =>
  isBrokenBunArg0(cmd[0]) ? [process.execPath, ...cmd.slice(1)] : cmd;

/**
 * Windows-only: `NITRO_DEV_RUNNER=bun-process` below (needed for the
 * Bun.serve idle-timeout fix) routes through Nitro's `env-runner`
 * dependency, whose `resolveBunPath()` cannot find a real bun executable on
 * Windows/Git Bash — it looks for an extensionless `~/.bun/bin/bun` (bun's
 * installer only ever creates `bun.exe`), then falls back to
 * `execSync("which bun")`, which under Git Bash prints a POSIX-style path
 * (e.g. `/c/Users/x/.bun/bin/bun`) that `Bun.spawn` cannot open — the dev
 * server's Nitro child process dies immediately with `ENOENT ... uv_spawn`.
 *
 * Fixed at the actual point of failure, `Bun.spawn`/`Bun.spawnSync`
 * themselves — a plain, reassignable property on the global `Bun` object:
 * any bogus "bun" argv[0] — bare, or a mis-resolved POSIX-style path — is
 * corrected to `process.execPath`, the real, absolute path to the running
 * bun.exe.
 */
function patchBunSpawnForWindowsRunnerBug(): void {
  if (typeof Bun === "undefined") {
    return;
  }
  const originalSpawn = Bun.spawn.bind(Bun);
  Bun.spawn = (options): Subprocess =>
    originalSpawn({ ...options, cmd: fixCmd(options.cmd) });

  const originalSpawnSync = Bun.spawnSync.bind(Bun);
  Bun.spawnSync = (options): SyncSubprocess =>
    originalSpawnSync({ ...options, cmd: fixCmd(options.cmd) });

  // Same bug, one step earlier: before `resolveBunPath()` produces the argv[0]
  // fixed above, it probes `execSync("which bun")`. Outside Git Bash (a cmd
  // console, the desktop shortcut) Windows has no `which`, so the child shell
  // prints an error onto the dev server's output before the caught exception
  // falls back to "bun". Runtime interception cannot stop that probe:
  // env-runner binds `execSync` via an ESM named import, which under Bun does
  // not see mutations of the `node:child_process` exports object. So the probe
  // is removed at the source instead: resolveBunPath() runs inside a Bun
  // process, where the answer is simply `process.execPath` — insert that
  // short-circuit into the installed file, idempotently, before the imports
  // evaluate it. If upstream reshapes the function, the marker line is
  // absent and the file is left untouched (the argv[0] fix above still
  // covers the fallback path).
  try {
    const runnerPath = fileURLToPath(
      import.meta.resolve("env-runner/runners/bun-process"),
    );
    const source = readFileSync(runnerPath, "utf8");
    const shortCircuit = "if (_isBun) return _bunPath = process.execPath;";
    const marker = "if (_bunPath) return _bunPath;";
    if (!source.includes(shortCircuit) && source.includes(marker)) {
      writeFileSync(
        runnerPath,
        source.replace(marker, `${marker}\n\t${shortCircuit}`),
      );
    }
  } catch {
    // env-runner not installed or not resolvable — nothing to patch.
  }
}

/**
 * Nitro's dev worker treats a `full-reload` hot message as "re-import the
 * entry" — but its message handler RETURNS before the payload ever reaches
 * the ModuleRunner's own listeners, and `ViteEnvRunner.reload()` never
 * clears `runner.evaluatedModules`. The re-import therefore comes straight
 * out of the stale cache: the worker keeps SSR-ing the pre-edit page for
 * the rest of the session (hydration mismatch on every fresh load after a
 * save; stale HTML on reload). Fixed at the source, idempotently, before
 * the worker file is ever loaded: clear the runner cache at the top of
 * `reload()`. If upstream reshapes the function, the marker is absent and
 * the file is left untouched.
 */
function patchNitroWorkerStaleReload(): void {
  try {
    const workerPath = join(
      dirname(fileURLToPath(import.meta.resolve("nitro/package.json"))),
      "dist/runtime/internal/vite/dev-worker.mjs",
    );
    const source = readFileSync(workerPath, "utf8");
    const clearLine = "this.runner.evaluatedModules.clear();";
    const marker = "async reload() {";
    if (!source.includes(clearLine) && source.includes(marker)) {
      writeFileSync(
        workerPath,
        source.replace(marker, `${marker}\n    ${clearLine}`),
      );
    }
  } catch {
    // nitro not installed or not resolvable — nothing to patch.
  }
}

/**
 * On a cold cache the nitro dev worker's entry import can take well over the
 * ~3s its fetch() is willing to wait, after which it THROWS
 * `Vite environment "nitro" is unavailable` — Bun renders that as a crash
 * dump with source context in the dev console, and the boot-time SSR primer
 * (which handles the 503 fine and retries) looks like it broke the server.
 * Two changes, applied idempotently before the worker file loads: wait
 * through three more backoff rounds (~25s total, covering a cold entry
 * import), and if the entry still is not there answer with a plain 503
 * Response instead of throwing — same status the caller saw before, none of
 * the noise. If upstream reshapes either line, its marker is absent and that
 * part is left untouched.
 */
function patchNitroWorkerQuiet503(): void {
  try {
    const workerPath = join(
      dirname(fileURLToPath(import.meta.resolve("nitro/package.json"))),
      "dist/runtime/internal/vite/dev-worker.mjs",
    );
    let source = readFileSync(workerPath, "utf8");
    const waitMarker =
      "for (let i = 0; i < 5 && !(this.entry || this.entryError); i++) {";
    const waitPatched =
      "for (let i = 0; i < 8 && !(this.entry || this.entryError); i++) {";
    if (source.includes(waitMarker)) {
      source = source.replace(waitMarker, waitPatched);
    }
    // The placeholder is nitro's own source text, matched verbatim, and lands
    // inside the patched file's template literal - not one of ours.
    const nameExpr = ["$", "{this.name}"].join("");
    const throwMarker = `throw httpError(503, \`Vite environment "${nameExpr}" is unavailable\`);`;
    const quietReturn = `return new Response(\`Vite environment "${nameExpr}" is unavailable\`, { status: 503, headers: { "content-type": "text/plain" } });`;
    if (source.includes(throwMarker)) {
      source = source.replace(throwMarker, quietReturn);
    }
    writeFileSync(workerPath, source);
  } catch {
    // nitro not installed or not resolvable — nothing to patch.
  }
}

/**
 * The tsconfig `vite-tsconfig-paths` should read - named, never discovered.
 *
 * Left unset, that plugin CRAWLS the Vite root for tsconfig.json files and
 * expands each one's `include` globs; on a repo this size that walk is pure
 * I/O before the dev server can bind. A build config may still name one
 * explicitly, and that wins.
 */
function resolveTsconfigProjects(fileConfig: FileToCompile): string[] {
  const configured = fileConfig.viteOptions?.tsconfigPath;
  if (configured !== undefined) {
    return [resolve(ROOT_DIR, String(configured))];
  }
  const rootConfig = resolve(ROOT_DIR, "tsconfig.json");
  return existsSync(rootConfig) ? [rootConfig] : [];
}

/**
 * A browser-safe `node:async_hooks`, for the CLIENT graph only.
 *
 * `@tanstack/start-client-core`'s server-function fetcher imports
 * `@tanstack/start-storage-context`, which constructs an `AsyncLocalStorage`
 * at module scope. In the browser Vite externalises `node:async_hooks` to an
 * object that throws on property access, so that top-level `new` aborts the
 * client entry — every page then serves its SSR HTML and hydrates into
 * nothing, with no error but `AsyncLocalStorage is not a constructor` in the
 * console.
 *
 * A no-op store is the correct value there, not merely a silencer: every
 * reader of that context goes through `createIsomorphicFn().client(…)`, so
 * the client never calls `getStore()`. SSR keeps the real module — this only
 * ever applies to the client environment.
 */
function nodeAsyncHooksClientShimPlugin(): Plugin {
  const VIRTUAL = "\0next-vibe:async-hooks-browser";
  return {
    name: "node-async-hooks-browser-shim",
    enforce: "pre",
    resolveId(source): string | null {
      if (source !== "node:async_hooks" && source !== "async_hooks") {
        return null;
      }
      if (this.environment?.name === "ssr") {
        return null;
      }
      return VIRTUAL;
    },
    load(id): string | null {
      if (id !== VIRTUAL) {
        return null;
      }
      return [
        "export class AsyncLocalStorage {",
        "  getStore() { return undefined; }",
        "  run(_store, callback, ...args) { return callback(...args); }",
        "  exit(callback, ...args) { return callback(...args); }",
        "  enterWith() {}",
        "  disable() {}",
        "}",
        "export class AsyncResource {}",
        "export default { AsyncLocalStorage, AsyncResource };",
      ].join("\n");
    },
  };
}

/**
 * Vite plugin that resolves `import "server-only"` with full importer tracing.
 *
 * - **SSR**: resolves to the shim file (no-op in SSR, throws otherwise).
 * - **Client**: resolves to a virtual module that throws with the importer
 *   file path baked into the error message, so the developer immediately
 *   knows which file leaked server-only code into the client bundle.
 *
 * Must be placed BEFORE the SSR resolver so it intercepts `"server-only"`
 * before anything else resolves it.
 */
/**
 * Vite plugin that intercepts the resolved `server-only` shim on the client
 * and replaces it with a virtual module whose error message includes the
 * importing file path.
 *
 * - **SSR**: the shim resolves normally via `resolve.alias` + the SSR resolver
 *   plugin - no-op in SSR, throws otherwise.
 * - **Client**: this plugin's `load` hook detects the shim path, looks up
 *   which file imported it, and returns a throw with the source file baked in.
 *
 * Uses `load` (not `resolveId`) so it works even when `resolve.alias`
 * pre-resolves the bare `"server-only"` specifier before plugins run.
 */
/**
 * Blank out comments and string literals so an identifier search can tell a
 * real reference from one that only appears inside prose.
 *
 * Used by the "*-layout-client-strip" plugins to decide whether an import is
 * still referenced after the server-only exports have been removed. The
 * asymmetry that dictates the whole design: a FALSE POSITIVE only keeps an
 * import that could have been dropped, while a FALSE NEGATIVE deletes an
 * import the module still uses and the page throws `X is not defined` in the
 * browser. So when this cannot tell, it keeps the code.
 *
 * It replaced four independent `replaceAll` regexes that each swept the whole
 * file on their own. That is unsound on any file mixing code with prose: the
 * apostrophe in a comment like `// the original's <h5>` was read as an opening
 * quote and paired with the next real single-quoted string hundreds of lines
 * later, blanking every reference in between. Every import used only inside
 * that span was then dropped as unused. One left-to-right pass cannot make
 * that mistake, because by the time it reaches the apostrophe it already knows
 * it is inside a comment.
 *
 * `'` additionally only opens a string when the previous non-space character
 * is not a word character — `geht's` in JSX text is an apostrophe, `('a')` is
 * a string — and when a closing quote follows on the same line. JS string
 * literals do not span raw newlines, so that costs nothing and stops prose
 * from swallowing code.
 */
function blankStringsAndComments(code: string): string {
  const out = [...code];
  let index = 0;
  let lastMeaningful = "";

  const blankTo = (end: number): void => {
    for (let i = index + 1; i < end && i < out.length; i++) {
      if (out[i] !== "\n") {
        out[i] = " ";
      }
    }
  };

  while (index < code.length) {
    const char = code[index] ?? "";
    const next = code[index + 1] ?? "";

    if (char === "/" && next === "/") {
      const end = code.indexOf("\n", index);
      const stop = end === -1 ? code.length : end;
      for (let i = index; i < stop; i++) {
        out[i] = " ";
      }
      index = stop;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = code.indexOf("*/", index + 2);
      const stop = end === -1 ? code.length : end + 2;
      for (let i = index; i < stop; i++) {
        if (out[i] !== "\n") {
          out[i] = " ";
        }
      }
      index = stop;
      continue;
    }

    if (char === "`") {
      // Template literal: blank the literal text but leave `${...}`
      // interpolations untouched (braces tracked with a naive depth
      // counter) — an import used only inside an interpolation, e.g.
      // `${utmQuery(...)}`, must still count as referenced.
      let cursor = index + 1;
      let closed = -1;
      let blankFrom = index + 1;
      while (cursor < code.length) {
        const c = code[cursor];
        if (c === "\\") {
          cursor += 2;
          continue;
        }
        if (c === "`") {
          closed = cursor;
          break;
        }
        if (c === "$" && code[cursor + 1] === "{") {
          for (let i = blankFrom; i < cursor; i++) {
            if (out[i] !== "\n") {
              out[i] = " ";
            }
          }
          let depth = 1;
          cursor += 2;
          while (cursor < code.length && depth > 0) {
            if (code[cursor] === "{") {
              depth++;
            } else if (code[cursor] === "}") {
              depth--;
            }
            cursor++;
          }
          blankFrom = cursor;
          continue;
        }
        cursor++;
      }
      if (closed === -1) {
        index++;
        continue;
      }
      for (let i = blankFrom; i < closed; i++) {
        if (out[i] !== "\n") {
          out[i] = " ";
        }
      }
      lastMeaningful = char;
      index = closed + 1;
      continue;
    }

    if (char === '"' || char === "'") {
      if (char === "'") {
        // Prose apostrophe, not a delimiter: `original's`, `geht's`.
        if (/\w/.test(lastMeaningful)) {
          index++;
          continue;
        }
      }
      // Find the unescaped closing quote of the same kind.
      let cursor = index + 1;
      let closed = -1;
      while (cursor < code.length) {
        const c = code[cursor];
        if (c === "\\") {
          cursor += 2;
          continue;
        }
        if (c === char) {
          closed = cursor;
          break;
        }
        // Single- and double-quoted literals cannot contain a raw newline;
        // hitting one means this quote was never a delimiter.
        if (c === "\n") {
          break;
        }
        cursor++;
      }
      if (closed === -1) {
        // Unterminated: leave the rest of the file untouched rather than
        // blanking code that is still there.
        index++;
        continue;
      }
      blankTo(closed);
      lastMeaningful = char;
      index = closed + 1;
      continue;
    }

    if (!/\s/.test(char)) {
      lastMeaningful = char;
    }
    index++;
  }

  return out.join("");
}

function serverOnlyTracePlugin(
  moduleAliases: Record<string, string>,
  rootDir: string,
): Plugin {
  const shimRel = moduleAliases["server-only"];
  const shimAbsolute = shimRel
    ? resolve(rootDir, shimRel).replaceAll("\\", "/")
    : null;

  // Collect importer→resolved edges so we know who imported the shim.
  const importersByResolved = new Map<string, Set<string>>();

  return {
    name: "server-only-trace",
    enforce: "pre",

    resolveId(source, importer, options): undefined {
      // Only record edges for the client environment - SSR imports are fine.
      const envName = (this.environment as { name?: string } | undefined)?.name;
      if (envName === "ssr") {
        return undefined;
      }
      // The dependency optimizer's scan walks every route file, server handlers
      // included, before TanStack Start strips them from the client graph. Those
      // edges are not client imports; recording them made the first real hit list
      // every route.ts / repository.ts in the project as a "client import".
      if ("scan" in options && options.scan === true) {
        return undefined;
      }
      // Record which client-env files import server-only.
      if (
        importer &&
        shimAbsolute &&
        (source === "server-only" ||
          source.replaceAll("\\", "/").endsWith("server-only.ts"))
      ) {
        let set = importersByResolved.get(shimAbsolute);
        if (!set) {
          set = new Set();
          importersByResolved.set(shimAbsolute, set);
        }
        set.add(importer);
      }
      return undefined;
    },

    load(id: string): string | null {
      if (!shimAbsolute) {
        return null;
      }

      const normalized = id.replaceAll("\\", "/").replace(/\?.*$/, "");
      if (normalized !== shimAbsolute) {
        return null;
      }

      // SSR: let the real shim file load (no-op on server)
      const envName = (this.environment as { name?: string } | undefined)?.name;
      if (envName === "ssr") {
        return null;
      }

      // Client: find who imported this shim
      const importers = importersByResolved.get(shimAbsolute);
      const importerList = importers ? [...importers] : [];
      // Normalise separators before stripping the root: on Windows rootDir is
      // backslash-separated while rolldown hands back mixed forms, so a raw
      // `replace` leaves an absolute `C:\...` path in the message.
      const rootPosix = rootDir.replaceAll("\\", "/");
      const relImporters = importerList.map((p) =>
        p
          .replaceAll("\\", "/")
          .replace(`${rootPosix}/`, "")
          .replace(/\?.*$/, ""),
      );

      const sourceInfo =
        relImporters.length > 0
          ? relImporters.join("\n  ")
          : "unknown (check the import chain)";

      // Log server-side so it appears in the dev log
      if (relImporters.length > 0) {
        for (const rel of relImporters) {
          // eslint-disable-next-line no-console -- intentional diagnostic for server-only violations
          console.error(`[server-only] client import detected in: ${rel}`);
        }
      }

      // JSON.stringify, not hand-rolled escaping: importer paths are absolute
      // on Windows, so a raw interpolation puts `\u`/`\t` sequences into the
      // emitted string literal and the client build dies on a bad escape.
      const message = [
        "[server-only] imported in client bundle",
        "",
        `  Source: ${sourceInfo}`,
        "",
        '  This file imports "server-only" and must not be included in the client bundle.',
        "  Move server-only code into a .server.ts file or use createServerFn().",
        "",
      ].join("\n");

      return [
        `// server-only shim - this module should never run in the client bundle`,
        `if (!import.meta.env.SSR) {`,
        `  throw new Error(${JSON.stringify(message)});`,
        `}`,
      ].join("\n");
    },
  };
}

// Maximum number of modules to invalidate before giving up on surgical eviction.
// Above this we fall back to a full evaluatedModules.clear(). The limit exists
// only to bound truly project-wide closures (an edit to response.schema or
// i18n core invalidates nearly everything — at that point a clear is
// equivalent and cheaper than walking the graph). It must NOT be tight:
// scoped eviction re-evaluates only the closure on the next request, while a
// full clear re-evaluates the ENTIRE SSR graph (~2s) — every edit whose
// closure exceeds the limit turns the next request back into a cold start.
// Typical definition/repository edits have closures in the hundreds.
const SSR_EVICT_LIMIT = 2000;

// Walk the importer graph recursively and collect every module that transitively
// depends on the changed file. Returns false if the visited set exceeds SSR_EVICT_LIMIT
// (caller should fall back to full clear).
function invalidateWithImporters(
  graph: EnvironmentModuleGraph,
  startId: string,
  visited: Set<string>,
): boolean {
  if (visited.has(startId)) {
    return true;
  }
  if (visited.size >= SSR_EVICT_LIMIT) {
    return false;
  }
  visited.add(startId);
  const mod = graph.getModuleById(startId);
  if (!mod) {
    return true;
  }
  graph.invalidateModule(mod);
  for (const importer of mod.importers) {
    if (importer.id) {
      if (!invalidateWithImporters(graph, importer.id, visited)) {
        return false;
      }
    }
  }
  return true;
}

// Surgically invalidate only the modules in `ids` from the SSR runner cache.
// Uses invalidateModule() per node so unrelated modules stay warm.
function evictSsrModules(
  evaluatedModules: EvaluatedModules,
  ids: Set<string>,
): void {
  for (const id of ids) {
    const node = evaluatedModules.getModuleById(id);
    if (node) {
      evaluatedModules.invalidateModule(node);
    }
  }
}

// Mirror Vite's client-side HMR propagation to predict full reloads: walk the
// importer graph from a changed module until an accept boundary stops the
// update, or a graph root is reached without one. Returns the escaping import
// chain (changed file first, root last) or null when every path is accepted.
// Approximation only — partial accepts (acceptedHmrExports) and circular-import
// detection are not modeled — so callers should label output as "likely".
function findFullReloadPath(
  mod: ModuleNode,
  visited: Set<string>,
): string[] | null {
  const key = mod.id ?? mod.url;
  if (visited.has(key)) {
    return null;
  }
  visited.add(key);
  const shortName = key.replace(/^.*\/src\//, "src/");
  if (mod.isSelfAccepting) {
    return null;
  }
  if (mod.importers.size === 0) {
    return [shortName];
  }
  for (const importer of mod.importers) {
    if (importer.acceptedHmrDeps.has(mod)) {
      continue;
    }
    const rest = findFullReloadPath(importer, visited);
    if (rest) {
      return [shortName, ...rest];
    }
  }
  return null;
}

class ViteCompiler {
  async compileFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: ModuleT,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<ResponseType<string[]>> {
    const inputFilePath = resolve(ROOT_DIR, fileConfig.input);
    const outputDir = resolve(ROOT_DIR, dirname(fileConfig.output));
    const compiledFiles: string[] = [];

    if (!existsSync(inputFilePath)) {
      return fail({
        message: t("errors.inputFileNotFound", {
          filePath: fileConfig.input,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    output.push(
      outputFormatter.formatItem(
        fileConfig.input,
        `→ ${dirname(fileConfig.output)}/ (${fileConfig.type})`,
      ),
    );
    logger.vibe(
      `  ⚙  ${fileConfig.input}  →  ${dirname(fileConfig.output)}/  [${fileConfig.type}]`,
    );

    if (dryRun) {
      // Simulate output files for dry run
      if (fileConfig.packageConfig?.isPackage) {
        const outputFileName =
          basename(fileConfig.output).split(".")[0] || "index";
        compiledFiles.push(
          `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
          `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
        );
      } else {
        compiledFiles.push(fileConfig.output);
      }
      filesBuilt.push(...compiledFiles);
      return success(compiledFiles);
    }

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Build Vite configuration
    const viteConfig = await this.buildViteConfig(
      fileConfig,
      inputFilePath,
      outputDir,
      verbose,
      profile,
    );

    // Run Vite build - dynamic import prevents Turbopack from tracing vite's
    // entire dependency graph (caniuse-lite, postcss, browserslist, etc.) into
    // every route that touches the builder.
    if (fileConfig.type === "tanstack-start") {
      // TanStack Start uses the multi-environment builder API so that Nitro's
      // `buildApp` hook runs - this triggers the server (Nitro) build in
      // addition to the client build.  The simple `build()` only builds the
      // first environment and never fires `buildApp`.
      const { createBuilder } = await import("vite");
      const builder = await createBuilder(viteConfig);
      await builder.buildApp();
    } else {
      const { build: viteBuild } = await import("vite");
      await viteBuild(viteConfig);
    }

    // Track built files
    if (fileConfig.packageConfig?.isPackage) {
      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";
      compiledFiles.push(
        `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
        `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
      );
    } else {
      compiledFiles.push(fileConfig.output);
    }

    filesBuilt.push(...compiledFiles);

    if (verbose) {
      output.push(
        outputFormatter.formatVerbose(`Compiled: ${compiledFiles.join(", ")}`),
      );
    }

    logger.vibe(`  ✓  ${fileConfig.output}`);
    return success(compiledFiles);
  }

  async buildViteConfig(
    fileConfig: FileToCompile,
    inputFilePath: string,
    outputDir: string,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<InlineConfig> {
    const profileSettings = PROFILE_DEFAULTS[profile];
    const viteOpts = fileConfig.viteOptions || {};

    // Extract plugins (typed as unknown[] in schema for API compatibility)
    const pluginsOverride = viteOpts.plugins as PluginOption[] | undefined;

    // Extract build options with proper typing
    const buildOpts = (viteOpts.build || {}) as BuildOptions & {
      rollupOptions?: RolldownOptions;
    };
    const { rollupOptions: rollupOpts = {}, ...buildOptionsOverride } =
      buildOpts;
    const { output: outputOverride, ...rollupOptionsOverride } = rollupOpts;

    // Collect other vite options (excluding plugins and build which we handled separately)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude handled fields
    const { plugins: _, build: __, ...otherOptions } = viteOpts;

    const plugins: PluginOption[] = pluginsOverride || [];
    const buildOptions: BuildOptions = {
      target: "es2020",
      outDir: outputDir,
      minify: profileSettings.minify,
      emptyOutDir: false,
      cssCodeSplit: !fileConfig.inlineCss,
      cssMinify: profileSettings.minify,
      sourcemap: profileSettings.sourcemap !== false,
      ...buildOptionsOverride,
    };

    const rollupOptions: RolldownOptions = {};
    const outputOptions: OutputOptions = {};

    // Configure plugins based on build type
    // Use string variables to prevent Turbopack static analysis of CLI-only packages
    if (fileConfig.type === "react-tailwind") {
      const tailwindPkg = "@tailwindcss/vite";
      const tailwindcss = (
        await import(/* webpackIgnore: true */ /* @vite-ignore */ tailwindPkg)
      ).default;
      plugins.push(tailwindcss() as PluginOption);

      if (fileConfig.inlineCss !== false) {
        const cssPkg = "vite-plugin-css-injected-by-js";
        const cssInjectedByJsPlugin = (
          await import(/* webpackIgnore: true */ /* @vite-ignore */ cssPkg)
        ).default;
        plugins.push(cssInjectedByJsPlugin() as PluginOption);
      }
    }

    if (fileConfig.type.includes("react") || fileConfig.type === "spa") {
      outputOptions.globals = { react: "React", "react-dom": "ReactDOM" };
      const react = (await import("@vitejs/plugin-react")).default;
      plugins.push(react());
    }

    // SPA mode: full Vite app build (index.html entry, no lib/IIFE)
    // input is the directory containing index.html; output is the dist dir
    if (fileConfig.type === "spa") {
      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      // For SPA, output is the dist directory itself (not a file path)
      const spaOutDir = resolve(ROOT_DIR, fileConfig.output);
      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(
          /* webpackIgnore: true */ /* @vite-ignore */ tsconfigPathsPkg
        )
      ).default;
      const tsconfigProjects = resolveTsconfigProjects(fileConfig);
      plugins.push(
        tsconfigPaths({
          ...(tsconfigProjects.length > 0
            ? { projects: tsconfigProjects }
            : {}),
          loose: true,
        }) as PluginOption,
      );

      // Explicit alias fallbacks for multi-path tsconfig aliases that
      // vite-tsconfig-paths resolves only to the first match.
      // next-vibe/ui/* → tanstack/ first (TanStack-specific overrides),
      // then falls back to web/ (shared UI components).
      const tanstackUiDir = join(getSrcDir(), "vibe/ui/tanstack");
      const webUiDir = join(getSrcDir(), "vibe/ui/web");
      plugins.push({
        name: "next-vibe-ui-resolver",
        resolveId(id: string): string | null {
          if (!id.startsWith("next-vibe/ui/")) {
            return null;
          }
          const sub = id.slice("next-vibe/ui/".length);
          // Try tanstack override first, then fall back to web
          for (const base of [tanstackUiDir, webUiDir]) {
            for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
              const candidate = resolve(base, sub + ext);
              if (existsSync(candidate)) {
                // POSIX-normalized: a raw Windows path here becomes a
                // browser-facing module id, and Firefox parses a bare
                // `C:\...` specifier as `file:///C:/...`.
                return candidate.replaceAll("\\", "/");
              }
            }
          }
          return null;
        },
      } as PluginOption);

      return {
        root: spaRoot,
        base: "/",
        resolve: {
          alias: [
            // Explicit @/ alias so Rollup can resolve it without relying solely on vite-tsconfig-paths
            {
              find: /^@\//,
              replacement: `${getSrcDir().replaceAll("\\", "/")}/`,
            },
            // next-vibe/* → src/vibe/*
            {
              find: /^next-vibe\//,
              replacement: `${getSrcDir().replaceAll("\\", "/")}/vibe/`,
            },
          ],
        },
        plugins: [...new Set(plugins)],
        logLevel: verbose ? "info" : "warn",
        ...otherOptions,
        build: {
          ...buildOptions,
          outDir: spaOutDir,
          emptyOutDir: true,
          rollupOptions: {
            ...rollupOptionsOverride,
            // Externalize Node.js built-ins and server-only packages that
            // cannot run in the browser. Pages importing these will fail at
            // runtime if actually used, but the build will succeed.
            external: (id: string): boolean =>
              id.startsWith("node:") ||
              id === "server-only" ||
              id === "client-only",
            output: { ...outputOverride },
          },
        },
      };
    }

    // TanStack Start SSR build: uses @tanstack/react-start plugin + nitro
    if (fileConfig.type === "tanstack-start") {
      return this.buildTanstackStartConfig(fileConfig, verbose, profile);
    }

    // Package mode with TypeScript declarations
    const packageConfig = fileConfig.packageConfig;
    if (packageConfig?.isPackage) {
      const dtsPkg = "vite-plugin-dts";
      const dts = (
        await import(/* webpackIgnore: true */ /* @vite-ignore */ dtsPkg)
      ).default;
      plugins.push(
        dts({
          include: packageConfig.dtsInclude,
          entryRoot: packageConfig.dtsEntryRoot,
        }) as PluginOption,
      );

      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";

      buildOptions.lib = {
        entry: inputFilePath,
        formats: ["es", "cjs"],
        fileName: (format): string =>
          `${outputFileName}.${format === "es" ? "mjs" : "cjs"}`,
      };
      outputOptions.exports = "auto";

      // Build externals list
      const modulesToExternalize = [
        ...new Set([
          ...(fileConfig.modulesToExternalize || []),
          ...(fileConfig.type.includes("react") && !fileConfig.bundleReact
            ? ["react", "react-dom", "react/jsx-runtime"]
            : []),
        ]),
      ];

      rollupOptions.external = (id: string): boolean =>
        modulesToExternalize.includes(id) || id.startsWith("node:");
    } else {
      // IIFE build for browser
      outputOptions.entryFileNames = basename(fileConfig.output);
      outputOptions.assetFileNames = "[name][extname]";
      outputOptions.exports = "none";
      outputOptions.format = "iife";
      rollupOptions.input = inputFilePath;
    }

    return {
      root: "./",
      base: "./",
      plugins: [...new Set(plugins)],
      logLevel: verbose ? "info" : "warn",
      ...otherOptions,
      build: {
        ...buildOptions,
        rollupOptions: {
          ...rollupOptions,
          ...rollupOptionsOverride,
          output: {
            ...outputOptions,
            ...(Array.isArray(outputOverride) ? {} : outputOverride),
          } satisfies OutputOptions,
        },
      },
    };
  }

  /**
   * Start a Vite dev server for an SPA entry (type === "spa").
   * Returns a ViteDevServer instance; the caller is responsible for keeping
   * the process alive and calling server.close() on shutdown.
   */
  async startDevServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const { createServer } = await import("vite");
      const react = (await import("@vitejs/plugin-react")).default;

      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      const plugins = [react()];

      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(
          /* webpackIgnore: true */ /* @vite-ignore */ tsconfigPathsPkg
        )
      ).default;
      const tsconfigProjects = resolveTsconfigProjects(fileConfig);
      plugins.push(
        tsconfigPaths(
          tsconfigProjects.length > 0 ? { projects: tsconfigProjects } : {},
        ),
      );

      const server = await createServer({
        root: spaRoot,
        base: "/",
        plugins,
        server: { port },
        logLevel: "info",
      });

      await server.listen();
      const resolvedPort = server.config.server.port ?? port ?? 5173;
      const url = `http://localhost:${resolvedPort}`;
      logger.info(`TanStack/Vite dev server ready at ${url}`);

      // Keep server open - wire shutdown to process signals
      const stop = (): void => {
        void server.close();
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);

      return { success: true, url };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Start a Vite preview server for a built SPA (type === "spa").
   * Serves the production build from outDir.
   */
  async startPreviewServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const { preview } = await import("vite");
      const react = (await import("@vitejs/plugin-react")).default;

      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      const outputDir = resolve(ROOT_DIR, fileConfig.output);
      const plugins = [react()];

      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(
          /* webpackIgnore: true */ /* @vite-ignore */ tsconfigPathsPkg
        )
      ).default;
      const tsconfigProjects = resolveTsconfigProjects(fileConfig);
      plugins.push(
        tsconfigPaths(
          tsconfigProjects.length > 0 ? { projects: tsconfigProjects } : {},
        ),
      );

      const server = await preview({
        root: spaRoot,
        base: "/",
        plugins,
        preview: { port },
        build: { outDir: outputDir },
        logLevel: "info",
      });

      server.printUrls();
      const resolvedPort = server.config.preview.port ?? port ?? 4173;
      const url = `http://localhost:${resolvedPort}`;
      logger.info(`TanStack/Vite preview server ready at ${url}`);

      const stop = (): void => {
        void server.close();
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);

      return { success: true, url };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Build Vite InlineConfig for a TanStack Start SSR project.
   * Uses @tanstack/react-start/plugin/vite + nitro.
   */
  private async buildTanstackStartConfig(
    fileConfig: FileToCompile,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<InlineConfig> {
    const profileSettings = PROFILE_DEFAULTS[profile];

    const tanstackStartPkg = "@tanstack/react-start/plugin/vite";
    const { tanstackStart } = (await import(
      /* webpackIgnore: true */ /* @vite-ignore */ tanstackStartPkg
    )) as {
      tanstackStart: (opts: {
        srcDirectory: string;
        importProtection?: {
          behavior?:
            | "error"
            | "mock"
            | { dev?: "error" | "mock"; build?: "error" | "mock" };
          client?: { specifiers?: string[] };
        };
      }) => PluginOption;
    };

    const nitroPkg = "nitro/vite";
    const { nitro } = (await import(
      /* webpackIgnore: true */ /* @vite-ignore */ nitroPkg
    )) as {
      nitro: (opts?: {
        output?: { dir?: string; publicDir?: string; serverDir?: string };
        rollupConfig?: { external?: (id: string) => boolean };
      }) => PluginOption;
    };

    const tailwindVite = (await import("@tailwindcss/vite")).default;
    const react = (await import("@vitejs/plugin-react")).default;

    const srcDirectory = fileConfig.input;

    const srcDir = getSrcDir();
    const nextVibeDir = join(getSrcDir(), "vibe");
    const nextVibeSystemDir = join(getSrcDir(), "vibe");
    const tanstackUiDir = join(getSrcDir(), "vibe/ui/tanstack");
    const webUiDir = join(getSrcDir(), "vibe/ui/web");
    const moduleAliases = fileConfig.viteOptions?.moduleAliases ?? {};

    const exts = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      "/index.ts",
      "/index.tsx",
      "/index.js",
    ];
    const tryResolve = (bases: string[], sub: string): string | null => {
      for (const base of bases) {
        for (const ext of exts) {
          const candidate = resolve(base, sub + ext);
          if (existsSync(candidate) && statSync(candidate).isFile()) {
            return candidate;
          }
        }
      }
      return null;
    };

    return {
      root: ROOT_DIR,
      plugins: [
        tailwindVite(),
        tanstackStart({
          srcDirectory,
          // server-only is handled by our server-only-trace plugin (not TanStack's importProtection)
          // so we get importer info in the error message instead of a generic proxy mock.
        }),
        react(),
        nitro({
          output: {
            dir: resolve(ROOT_DIR, fileConfig.output),
            publicDir: resolve(ROOT_DIR, fileConfig.output, "public"),
            serverDir: resolve(ROOT_DIR, fileConfig.output, "server"),
          },
          // Externalize build-time-only packages so Nitro's server bundle
          // doesn't try to bundle native binaries (lightningcss, oxide, etc.)
          rollupConfig: {
            external: (id: string) =>
              id.startsWith("@tailwindcss/") ||
              id.startsWith("lightningcss") ||
              id === "vite" ||
              id === "@vitejs/plugin-react" ||
              id === "vite-plugin-css-injected-by-js" ||
              id === "vite-plugin-dts" ||
              // The compiler itself can land in the server graph (tool
              // routes reach it through the build executor); it loads its
              // plugins by variable-named dynamic import at run time.
              id === "vite-tsconfig-paths" ||
              id === "nitro/vite" ||
              id.startsWith("@tanstack/react-start/plugin/"),
          },
        }),
        {
          name: "next-vibe-ui-ssr-resolver",
          enforce: "pre",
          resolveId(id: string): string | null {
            if (id.startsWith("next-vibe/ui/")) {
              const sub = id.slice("next-vibe/ui/".length);
              return tryResolve([tanstackUiDir, webUiDir], sub);
            }
            if (id in moduleAliases) {
              const rel = moduleAliases[id];
              if (rel) {
                return resolve(ROOT_DIR, rel);
              }
            }
            // General `next-vibe/*` → vibe/* FIRST, then the domain root
            // (mirrors tsconfig `"next-vibe/*": ["./src/vibe/*", "./src/*"]`). The
            // single-string `resolve.alias` below can only map to ONE base, so
            // framework files that were moved under system/ (e.g.
            // next-vibe/logger/file → system/logger/file) fail there; this
            // two-candidate resolver runs `enforce:"pre"` and fixes them.
            if (id.startsWith("next-vibe/")) {
              const sub = id.slice("next-vibe/".length);
              return tryResolve([nextVibeSystemDir, nextVibeDir], sub);
            }
            return null;
          },
        } satisfies PluginOption,
        nodeAsyncHooksClientShimPlugin(),
        // Resolve `server-only` with importer tracing: SSR gets the shim,
        // client gets a virtual module whose error message names the source file.
        serverOnlyTracePlugin(moduleAliases, ROOT_DIR),
        // Strip server-only exports from layout/page files for the client bundle.
        // Same as the dev server plugin - required for production builds too.
        {
          name: "tanstack-layout-client-strip",
          enforce: "pre",
          async transform(
            code: string,
            id: string,
            opts,
          ): Promise<{ code: string; map: null } | undefined> {
            if (opts?.ssr || this.environment?.name === "ssr") {
              return undefined;
            }
            if (
              !id.replace(/\?.*$/, "").includes("/src/_pages/") ||
              (!id.replace(/\?.*$/, "").endsWith("/layout.tsx") &&
                !id.replace(/\?.*$/, "").endsWith("/page.tsx"))
            ) {
              return undefined;
            }
            if (!code.includes("tanstackLoader")) {
              return undefined;
            }
            let result = code;
            // Remove default export (Next.js server component)
            result = result.replace(
              /\nexport default async function\s+\w+[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
              "\n",
            );
            // Remove tanstackLoader (server-side data loader)
            result = result.replace(
              /\nexport async function tanstackLoader[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
              "\n",
            );
            // Remove Next.js-only server exports that may pull in server-only imports:
            // generateMetadata (both `export async function` and `export const = async` forms), viewport
            result = result.replace(
              /\nexport async function generateMetadata[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
              "\n",
            );
            result = result.replace(
              /\nexport const generateMetadata\s*=\s*async[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
              "\n",
            );
            result = result.replace(/\nexport const viewport[\s\S]*?;\n/, "\n");
            // Remove imports whose bindings are no longer referenced.
            const lines = result.split("\n");
            const nonImportCode = lines
              .filter((l) => !l.trimStart().startsWith("import "))
              .join("\n");
            // Comments and string literals are blanked in ONE left-to-right pass
            // (see blankStringsAndComments): sweeping them with independent
            // regexes let an apostrophe in prose open a string and blank the code
            // up to the next real quote, dropping imports that were still used.
            const nonImportCodeNoStrings =
              blankStringsAndComments(nonImportCode);
            const filteredLines = lines.filter((line) => {
              const trimmed = line.trimStart();
              if (
                !trimmed.startsWith("import ") ||
                trimmed.startsWith("import type ")
              ) {
                return true;
              }
              const namedMatch = /import\s*\{([^}]+)\}/.exec(trimmed);
              const defaultMatch = /import\s+(\w+)\s+from/.exec(trimmed);
              const bindings: string[] = [];
              if (namedMatch?.[1]) {
                for (const part of namedMatch[1].split(",")) {
                  const alias = part
                    .trim()
                    .split(/\s+as\s+/)
                    .pop()
                    ?.trim();
                  if (alias) {
                    bindings.push(alias);
                  }
                }
              } else if (defaultMatch?.[1]) {
                bindings.push(defaultMatch[1]);
              }
              if (bindings.length === 0) {
                return true;
              }
              return bindings.some((b) => {
                const re = new RegExp(`\\b${b}\\b`);
                return re.test(nonImportCodeNoStrings);
              });
            });
            return { code: filteredLines.join("\n"), map: null };
          },
        } as Plugin,
        {
          name: "native-node-externals",
          enforce: "pre",
          resolveId(id: string) {
            if (id.endsWith(".node")) {
              return { id, external: true };
            }
            return null;
          },
        } as Plugin,
        {
          name: "exclude-generator-seeds",
          enforce: "pre",
          load(id: string) {
            const clean = id.replace(/\?.*$/, "");
            if (
              clean.endsWith("/generator.ts") ||
              clean.endsWith("/seeds.ts")
            ) {
              return "export default {};";
            }
            return null;
          },
        } as Plugin,
        // In the client environment, mark node:* built-ins as external so
        // server-only modules that import them don't cause Rollup to fail.
        // Also covers bare built-in names (util, net, fs, etc.) used by pg/nodemailer.
        {
          name: "client-node-externals",
          enforce: "pre",
          applyToEnvironment(env: { name: string }) {
            return env.name === "client";
          },
          resolveId(id: string) {
            const NODE_BUILTINS = new Set([
              "assert",
              "buffer",
              "child_process",
              "cluster",
              "crypto",
              "dgram",
              "dns",
              "domain",
              "events",
              "fs",
              "http",
              "https",
              "module",
              "net",
              "os",
              "path",
              "perf_hooks",
              "process",
              "punycode",
              "querystring",
              "readline",
              "repl",
              "stream",
              "string_decoder",
              "timers",
              "tls",
              "tty",
              "url",
              "util",
              "v8",
              "vm",
              "zlib",
            ]);
            // Build-time-only packages pulled in via vite-compiler dynamic
            // imports - they are never used in the browser.
            const BUILD_TOOLS = new Set([
              "vite",
              "@vitejs/plugin-react",
              "@tailwindcss/vite",
              "vite-plugin-css-injected-by-js",
              "vite-plugin-dts",
              "nitro/vite",
              "rolldown",
              "esbuild",
              "lightningcss",
            ]);
            if (
              id.startsWith("node:") ||
              id === "node-gyp-build" ||
              NODE_BUILTINS.has(id) ||
              BUILD_TOOLS.has(id)
            ) {
              return { id, external: true };
            }
            return null;
          },
        } as Plugin,
        // Externalize build-tool packages in every environment (client, SSR,
        // Nitro) so vite-compiler.ts dynamic imports don't cause UNRESOLVED_IMPORT.
        {
          name: "build-tools-externals",
          enforce: "pre",
          resolveId(id: string) {
            const BUILD_TOOLS = new Set([
              "vite-plugin-css-injected-by-js",
              "vite-plugin-dts",
              "@tailwindcss/postcss",
              "nitro/vite",
            ]);
            if (BUILD_TOOLS.has(id)) {
              return { id, external: true };
            }
            return null;
          },
        } as Plugin,
        // Log bundle size summary after client build so large chunks are visible.
        {
          name: "bundle-size-reporter",
          enforce: "post",
          applyToEnvironment(env: { name: string }) {
            return env.name === "client";
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required positional param
          generateBundle(_opts: OutputOptions, bundle: OutputBundle) {
            const chunks: Array<{ name: string; size: number }> = [];
            for (const [name, chunk] of Object.entries(bundle)) {
              const size =
                chunk.type === "chunk"
                  ? (chunk.code?.length ?? 0)
                  : typeof chunk.source === "string"
                    ? chunk.source.length
                    : (chunk.source?.byteLength ?? 0);
              chunks.push({ name, size });
            }
            chunks.sort((a, b) => b.size - a.size);
            const top = chunks.slice(0, 15);
            const totalSize = chunks.reduce((s, c) => s + c.size, 0);
            // eslint-disable-next-line no-console -- intentional build log
            console.log(
              `\n  Bundle top ${String(top.length)} chunks (total ${ViteCompiler.fmtKb(totalSize)}):`,
            );
            for (const { name, size } of top) {
              const indicator =
                size > 500 * 1024 ? "⚠" : size > 200 * 1024 ? "⚡" : " ";
              // eslint-disable-next-line no-console -- intentional build log
              console.log(
                `    ${indicator} ${ViteCompiler.fmtKb(size).padStart(9)}  ${name}`,
              );
            }
          },
        } as Plugin,
      ],
      resolve: {
        tsconfigPaths: true,
        alias: [
          { find: /^@\//, replacement: `${srcDir}/` },
          // next-vibe/ui/* and next-vibe/* handled by the ui resolver plugin (tanstack-first).
          { find: /^next-vibe\/(?!ui\/)/, replacement: `${nextVibeDir}/` },
          ...Object.entries(moduleAliases).map(([specifier, relativePath]) => ({
            find: specifier,
            replacement: resolve(ROOT_DIR, relativePath),
          })),
        ],
      },
      // Inline env vars at build time so the compiled bundle has the correct
      // values without any runtime patching.  NEXT_PUBLIC_APP_URL defaults to
      // http://localhost:3000 if not set - set it in your build environment to
      // produce a build that targets a different origin.
      define: {
        "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
          process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
        ),
        "process.env.NODE_ENV": JSON.stringify("production"),
        ...publicEnvs(),
      },
      build: {
        minify: profileSettings.minify,
        sourcemap: profileSettings.sourcemap !== false,
        // `exclude-generator-seeds` stubs every generator.ts / seeds.ts to
        // `export default {}`. The stubbed modules are only ever reached by
        // CLI-side code (tool repositories that run a generator), which the
        // app never calls at runtime; without shimming, the bundler rejects
        // their named imports (`generator`, `generate`) as MISSING_EXPORT.
        rollupOptions: { shimMissingExports: true },
      },
      logLevel: verbose ? "info" : "warn",
    };
  }

  /**
   * Start a Vite dev server for TanStack Start (SSR mode).
   * Uses @tanstack/react-start/plugin/vite + nitro plugins.
   */
  async startTanstackDevServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    /** Public-facing proxy port (e.g. 5000). When set, configures Vite HMR to use this port
     *  so the browser connects to the proxy instead of the internal Vite port directly. */
    publicPort?: number,
    /** Mutable ref updated on every restart so the caller always holds the current close fn. */
    closeRef?: { fn: (() => Promise<void>) | undefined },
  ): Promise<{
    success: boolean;
    url?: string;
    message?: string;
    close?: () => Promise<void>;
  }> {
    try {
      // Vite listens for process.stdin "end" to detect parent death and calls
      // process.exit() when CI !== "true". When vibe dev is backgrounded (no
      // controlling tty, stdin redirected to /dev/null), stdin emits "end"
      // immediately, killing the server. Setting CI=true disables that stdin
      // listener and also disables bindCLIShortcuts (readline on stdin).
      // We only set it if not already set so that real CI environments keep
      // whatever value they had.
      if (!process.env.CI) {
        Object.assign(process.env, { CI: "true" });
      }

      // NOTE on the internal port's 10s timeout: nitro/srvx serves it via
      // Bun.serve (Bun's 10s idleTimeout default), and srvx provably does
      // NOT call through the `Bun.serve` property (a property patch here
      // never fired), so it cannot be fixed at this layer. The fix lives in
      // src/generated/app-tanstack/start.ts: the request middleware calls
      // `request.runtime.bun.server.timeout(request, 255)` per request —
      // verified with a 15s zero-byte SSR render surviving on both ports.

      // BEFORE the nitro/tanstack imports below: env-runner (nitro's worker
      // spawner) is evaluated during those imports, so its on-disk patch must
      // land first — once the module is loaded, the unpatched code is cached
      // and the `which bun` probe shells out after all (see the patch comment).
      if (process.platform === "win32") {
        patchBunSpawnForWindowsRunnerBug();
      }
      patchNitroWorkerStaleReload();
      patchNitroWorkerQuiet503();

      const { createServer } = await import("vite");
      const tanstackStartPkg = "@tanstack/react-start/plugin/vite";
      const { tanstackStart } = (await import(
        /* webpackIgnore: true */ /* @vite-ignore */ tanstackStartPkg
      )) as {
        tanstackStart: (opts: {
          srcDirectory: string;
          importProtection?: {
            client?: { specifiers?: string[] };
          };
        }) => PluginOption;
      };

      const nitroPkg = "nitro/vite";
      const { nitro } = (await import(
        /* webpackIgnore: true */ /* @vite-ignore */ nitroPkg
      )) as {
        nitro: () => PluginOption;
      };

      const tailwindVite = (await import("@tailwindcss/vite")).default;
      const react = (await import("@vitejs/plugin-react")).default;

      const srcDirectory = fileConfig.input;

      const srcDir = getSrcDir();
      const nextVibeDir = join(getSrcDir(), "vibe");
      const tanstackUiDir = join(getSrcDir(), "vibe/ui/tanstack");
      const webUiDir = join(getSrcDir(), "vibe/ui/web");
      // Module aliases from build.config.ts viteOptions.moduleAliases
      // Keys are import specifiers, values are paths relative to ROOT_DIR.
      const moduleAliases = fileConfig.viteOptions?.moduleAliases ?? {};

      // Custom Vite logger: pipe all Vite/Nitro output through the same
      // timestamp+color formatter used for Next.js output.
      const fmtVite = createNextjsFormatter(
        port ?? 3001,
        publicPort ?? port ?? 3001,
      );
      const viteLogger = {
        hasWarned: false,
        info(msg: string): void {
          const line = `${fmtVite(msg)}\n`;
          process.stdout.write(line);
          serverFileLog(line.trimEnd());
        },
        warn(msg: string): void {
          // drizzle-zod ships sourcemaps pointing outside its package (packaging bug).
          if (
            msg.includes("drizzle-zod") &&
            msg.includes("source file outside its package")
          ) {
            return;
          }
          this.hasWarned = true;
          const line = `${fmtVite(msg)}\n`;
          process.stdout.write(line);
          serverFileLog(line.trimEnd());
        },
        warnOnce(msg: string): void {
          if (
            msg.includes("drizzle-zod") &&
            msg.includes("source file outside its package")
          ) {
            return;
          }
          this.hasWarned = true;
          const line = `${fmtVite(msg)}\n`;
          process.stdout.write(line);
          serverFileLog(line.trimEnd());
        },
        error(msg: string): void {
          const line = `${fmtVite(msg)}\n`;
          process.stderr.write(line);
          serverFileLog(line.trimEnd());
        },
        clearScreen(): void {
          /* no-op */
        },
        hasErrorLogged(): boolean {
          return false;
        },
      };

      // Coalesces bursts of edits into ONE nitro reload instead of one per
      // edit. Nitro's dev worker reload() clears its ENTIRE module cache and
      // re-imports the server entry fresh over HTTP from this Vite server; a
      // second edit landing while that re-import is still in flight
      // invalidates the very modules the in-flight import is mid-fetching,
      // so the fetch gets a genuine 404 that nitro renders as the app's
      // not-found page. See `ssr-clear-on-hmr`'s handleHotUpdate below.
      let nitroFullReloadTimer: ReturnType<typeof setTimeout> | undefined;

      // The nitro dev worker is a separate Bun child process whose srvx
      // listener is a raw `Bun.serve` without an idleTimeout — Bun aborts any
      // response that streams no bytes for 10s, which the first cold-cache
      // SSR render regularly does. No request-level extension can run before
      // the module graph is transformed, so the fix rides into the child
      // process via BUN_OPTIONS: a preload that defaults Bun.serve's
      // idleTimeout to 255s (Bun's max). BUN_OPTIONS cannot quote paths, so a
      // checkout path with spaces skips the preload (the retry priming below
      // remains the fallback there).
      const idlePreload = resolve(
        getSrcDir(),
        "vibe/tooling/builder/repository/bun-serve-idle-timeout.preload.ts",
      ).replaceAll("\\", "/");
      if (
        !idlePreload.includes(" ") &&
        !(process.env.BUN_OPTIONS ?? "").includes("bun-serve-idle-timeout")
      ) {
        process.env.BUN_OPTIONS = [
          process.env.BUN_OPTIONS,
          `--preload=${idlePreload}`,
        ]
          .filter(Boolean)
          .join(" ");
      }
      // The preload only reaches a real child PROCESS. Nitro's default dev
      // runner is "node-worker" — a Worker THREAD whose fresh realm keeps
      // Bun.serve's stock 10s idle timeout regardless of any process-level
      // patch. Default to the process runner; an explicit NITRO_DEV_RUNNER
      // still wins. (The matching Windows runner patch runs before the nitro
      // import above.)
      process.env["NITRO_DEV_RUNNER"] ??= "bun-process";

      const server = await createServer({
        root: ROOT_DIR,
        customLogger: viteLogger,
        plugins: [
          tailwindVite(),
          tanstackStart({
            srcDirectory,
            // server-only is handled by our server-only-trace plugin (not TanStack's importProtection)
            // so we get importer info in the error message instead of a generic proxy mock.
          }),
          react(),
          nitro(),
          // Shim for TanStack Start virtual modules that aren't provided in dev mode.
          // "tanstack-start-injected-head-scripts:v" is imported by the server env at runtime
          // (router-manifest.js). TanStack's own dev plugin provides it only when its
          // configureServer hook runs - but that requires the full TanStack dev server setup.
          // We provide a no-op shim so the import resolves without error.
          // The actual preamble is now injected directly in the <Head> component.
          {
            name: "tanstack-start-virtual-shims",
            enforce: "pre",
            resolveId(id: string) {
              if (id === "tanstack-start-injected-head-scripts:v") {
                return `\0${id}`;
              }
              return null;
            },
            load(id: string) {
              if (id === "\0tanstack-start-injected-head-scripts:v") {
                return `export const injectedHeadScripts = undefined;`;
              }
              return null;
            },
          } as Plugin,
          // Vite's HTTP server can't serve files with `[...]` in the URL path
          // because the client-side dynamic import URL contains literal brackets
          // (e.g. /src/_pages/page.tsx) and connect returns 404.
          // Fix: intercept HTTP requests with brackets in the URL and serve them
          // directly via vite.transformRequest so Vite's pipeline handles them.
          {
            name: "bracket-path-rewrite",
            enforce: "pre",
            configureServer(srv) {
              // widget.tsx files under src/ domains are served on-demand via
              // bracket-path-rewrite and are never in Vite's module graph, so
              // Vite's own watcher never sees them until first served (see
              // srv.watcher.add below). Watch the whole tree directly with
              // fs.watch's recursive mode - proven to work under Bun on this
              // OS by dev-watcher/task-runner.ts's generator watcher - so this
              // has no dependency on a system `node` binary being installed.
              const localeDir = getSrcDir();
              const watcher = existsSync(localeDir)
                ? watch(
                    localeDir,
                    { recursive: true },
                    // oxlint-disable-next-line no-unused-vars -- eventType unused, filename is the second positional arg
                    (_eventType, filename) => {
                      if (!filename) {
                        return;
                      }
                      // recursive fs.watch reports paths relative to localeDir,
                      // using the OS separator - normalize to match the "/"-joined
                      // absolute paths the rest of this handler expects.
                      const file = `${localeDir}/${filename.replaceAll("\\", "/")}`;
                      if (!file.endsWith("/widget.tsx")) {
                        return;
                      }
                      // Invalidate the changed widget in the SSR module graph, then
                      // full-clear evaluatedModules (surgical per-module eviction
                      // causes TDZ errors — see ssr-clear-on-hmr comment).
                      const ssrEnv = srv.environments?.["ssr"];
                      if (ssrEnv && isRunnableDevEnvironment(ssrEnv)) {
                        const ssrVisited = new Set<string>();
                        const scoped = invalidateWithImporters(
                          ssrEnv.moduleGraph,
                          file,
                          ssrVisited,
                        );
                        if (scoped) {
                          evictSsrModules(
                            ssrEnv.runner.evaluatedModules,
                            ssrVisited,
                          );
                        } else {
                          ssrEnv.runner.evaluatedModules.clear();
                        }
                      }
                      // Derive the browser-relative URL (strip absolute prefix up to /src/)
                      const srcIdx = file.indexOf("/src/");
                      const browserPath =
                        srcIdx !== -1 ? file.slice(srcIdx) : null;

                      if (browserPath) {
                        // Send a standard Vite js-update so the browser re-fetches the
                        // widget module and triggers its injected hot.accept handler,
                        // which calls window.__vibeWidgetHmr to swap the component.
                        const timestamp = Date.now();
                        srv.ws.send({
                          type: "update",
                          updates: [
                            {
                              type: "js-update",
                              path: browserPath,
                              acceptedPath: browserPath,
                              timestamp,
                              explicitImportRequired: false,
                              isWithinCircularImport: false,
                            },
                          ],
                        });
                        serverFileLog(
                          `[widget-hmr] sent js-update for ${browserPath}`,
                        );
                      }
                    },
                  )
                : null;
              if (!watcher) {
                serverFileLog(
                  `[widget-hmr] locale dir not found at ${localeDir} - widget hot-reload-on-save disabled (hard refresh still works)`,
                );
              }
              srv.httpServer?.on("close", () => {
                watcher?.close();
              });
              type ConnectHandle = (
                req: { url?: string },
                res: {
                  headersSent: boolean;
                  end: (s: string) => void;
                  setHeader: (k: string, v: string) => void;
                  statusCode: number;
                },
                next: () => void,
              ) => void;

              const handle: ConnectHandle = (req, res, next) => {
                const url = req.url ?? "";
                if (!url.includes("[")) {
                  next();
                  return;
                }
                // Serve the file via Vite's transform pipeline
                void (async (): Promise<void> => {
                  try {
                    const result = await srv.transformRequest(url);
                    if (!result) {
                      next();
                      return;
                    }
                    // Watch the file so Vite's HMR detects changes to dynamic widget paths.
                    // The bracket-path-rewrite serves files that were never statically
                    // imported, so chokidar doesn't watch them by default. Explicitly
                    // add to the watcher after first serve so subsequent saves trigger HMR.
                    const cleanUrl = url.replace(/\?.*$/, "");
                    const absPath = resolve(
                      ROOT_DIR,
                      cleanUrl.replace(/^\//, ""),
                    );
                    srv.watcher.add(absPath);
                    // Also register in the client environment's module graph (Vite 6
                    // environments API) so handleHotUpdate receives the module and
                    // can send an HMR update to the browser.
                    const clientEnv = srv.environments?.["client"];
                    if (clientEnv) {
                      void clientEnv.transformRequest(url).catch(() => {
                        /* ignore */
                      });
                    }
                    res.setHeader(
                      "Content-Type",
                      "application/javascript; charset=utf-8",
                    );
                    res.setHeader("Cache-Control", "no-store");
                    res.statusCode = 200;
                    res.end(result.code);
                  } catch {
                    next();
                  }
                })();
              };

              // Use unshift to ensure this runs BEFORE sirv / other middlewares
              srv.middlewares.stack.unshift({
                route: "",
                handle,
              } as never);
            },
          } as Plugin,

          // Resolve `server-only` with importer tracing: SSR gets the shim,
          // client gets a virtual module whose error message names the source file.
          serverOnlyTracePlugin(moduleAliases, ROOT_DIR),
          // Strip server-only exports (tanstackLoader, default) and their exclusive
          // imports from layout.tsx / page.tsx files when serving to the client.
          // This allows lazy(() => import("layout.tsx").then(m => m.TanstackPage))
          // to work in the browser without pulling in pg, drizzle, etc.
          // The plugin is the client-side mirror of TanStack's createServerFn stripping.
          {
            name: "tanstack-layout-client-strip",
            enforce: "pre",
            async transform(
              code: string,
              id: string,
              opts,
            ): Promise<{ code: string; map: null } | undefined> {
              // Only run for client (not SSR). Check both opts.ssr (Vite classic)
              // and this.environment.name (Vite 6 environments API).
              if (opts?.ssr || this.environment?.name === "ssr") {
                return undefined;
              }
              // Only target layout.tsx and page.tsx in src/_pages
              if (
                !id.replace(/\?.*$/, "").includes("/src/_pages/") ||
                (!id.replace(/\?.*$/, "").endsWith("/layout.tsx") &&
                  !id.replace(/\?.*$/, "").endsWith("/page.tsx"))
              ) {
                return undefined;
              }
              // Only process files that export tanstackLoader
              if (!code.includes("tanstackLoader")) {
                return undefined;
              }
              // Strip server-only exports and their exclusive imports.
              // Remove: export async function tanstackLoader(...) { ... }
              // Remove: export default async function ...(...) { ... }
              // Remove: imports whose bindings are no longer referenced after stripping
              // Keep: TanstackPage, interfaces, type exports, client imports
              let result = code;
              // Remove export default async function (Next.js server component)
              result = result.replace(
                /\nexport default async function\s+\w+[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
                "\n",
              );
              // Remove export async function tanstackLoader
              result = result.replace(
                /\nexport async function tanstackLoader[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
                "\n",
              );
              // Remove Next.js-only server exports that may pull in server-only imports:
              // generateMetadata (both `export async function` and `export const = async` forms), viewport
              result = result.replace(
                /\nexport async function generateMetadata[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
                "\n",
              );
              result = result.replace(
                /\nexport const generateMetadata\s*=\s*async[\s\S]*?(?=\nexport |\nfunction |\nconst |\nclass |\ninterface |\ntype |\n\/\/|$)/,
                "\n",
              );
              result = result.replace(
                /\nexport const viewport[\s\S]*?;\n/,
                "\n",
              );
              // Remove import lines whose bindings are no longer referenced.
              // Parse each `import { ... } from "..."` line, check if any of the
              // imported names appear in the remaining non-import code, and drop
              // the whole import line if none do.
              const lines = result.split("\n");
              const nonImportCode = lines
                .filter((l) => !l.trimStart().startsWith("import "))
                .join("\n");
              // Comments and string literals are blanked in ONE left-to-right pass
              // (see blankStringsAndComments): sweeping them with independent
              // regexes let an apostrophe in prose open a string and blank the code
              // up to the next real quote, dropping imports that were still used.
              const nonImportCodeNoStrings =
                blankStringsAndComments(nonImportCode);
              const filteredLines = lines.filter((line) => {
                const trimmed = line.trimStart();
                // Only process value imports (not `import type`)
                if (
                  !trimmed.startsWith("import ") ||
                  trimmed.startsWith("import type ")
                ) {
                  return true;
                }
                // Extract named bindings: import { Foo, Bar as Baz } from "..."
                const namedMatch = /import\s*\{([^}]+)\}/.exec(trimmed);
                // Default import: import Foo from "..."
                const defaultMatch = /import\s+(\w+)\s+from/.exec(trimmed);
                const bindings: string[] = [];
                if (namedMatch?.[1]) {
                  for (const part of namedMatch[1].split(",")) {
                    const alias = part
                      .trim()
                      .split(/\s+as\s+/)
                      .pop()
                      ?.trim();
                    if (alias) {
                      bindings.push(alias);
                    }
                  }
                } else if (defaultMatch?.[1]) {
                  bindings.push(defaultMatch[1]);
                }
                // Keep the import if any binding is still used in non-import code
                if (bindings.length === 0) {
                  return true;
                }
                return bindings.some((b) => {
                  // Use word-boundary check, excluding string literals
                  const re = new RegExp(`\\b${b}\\b`);
                  return re.test(nonImportCodeNoStrings);
                });
              });
              return { code: filteredLines.join("\n"), map: null };
            },
          } as Plugin,
          // React Refresh adds `_c = TanstackPage` assignments without `var _c`
          // declarations for our stripped layout/page files. In lazy-loaded ESM
          // modules (strict mode) this throws ReferenceError. Fix: patch bare
          // `_c = ` assignments into `var _c = ` after React Refresh runs.
          {
            name: "tanstack-layout-refresh-fix",
            enforce: "post",
            transform(
              code: string,
              id: string,
              opts,
            ): { code: string; map: null } | undefined {
              if (opts?.ssr || this.environment?.name === "ssr") {
                return undefined;
              }
              if (
                !id.replace(/\?.*$/, "").includes("/src/_pages/") ||
                (!id.replace(/\?.*$/, "").endsWith("/layout.tsx") &&
                  !id.replace(/\?.*$/, "").endsWith("/page.tsx"))
              ) {
                return undefined;
              }
              // Only patch files that went through our strip plugin (have _c = but no var _c)
              if (!code.includes("_c = ") || code.includes("var _c")) {
                return undefined;
              }
              // Replace bare `_c = Foo` with `var _c = Foo`
              const patched = code.replaceAll(/\n(_c\d*) = /g, "\nvar $1 = ");
              return { code: patched, map: null };
            },
          } as Plugin,
          // Polyfill CommonJS `require()` for the i18n lazy-loader pattern:
          // `() => require("next-vibe/ui/components/icons/...").translations` - SSR gets node:module createRequire,
          // client gets require() calls rewritten to static import references.
          // apply:"serve" prevents this from running during esbuild dep pre-bundling.
          {
            name: "cjs-require-polyfill",
            apply: "serve",
            transform(code, id, opts) {
              if (!id.includes("/src/")) {
                return undefined;
              }
              if (!code.includes("require(")) {
                return undefined;
              }
              if (opts?.ssr) {
                const shim = `import { createRequire as __createRequire } from "node:module";\nconst require = __createRequire(${JSON.stringify(id)});\n`;
                return { code: shim + code, map: null };
              }
              // Client: rewrite `require("next-vibe/ui/web/components/icons/X")` → `__cjsImport_X` and add static imports.
              // Matches both relative (./de) and bare package-style (next-vibe/ui/i18n/de)
              // specifiers - the lazy i18n loader pattern uses both forms.
              const imports: string[] = [];
              let counter = 0;
              const rewritten = code.replaceAll(
                /\brequire\((['"`])([^'"`)]+)\1\)/g,
                (...[, , specifier]) => {
                  const varName = `__cjsImport_${counter++}`;
                  imports.push(
                    `import * as ${varName} from ${JSON.stringify(specifier)};`,
                  );
                  return varName;
                },
              );
              if (imports.length === 0) {
                return undefined;
              }
              return { code: `${imports.join("\n")}\n${rewritten}`, map: null };
            },
          } as Plugin,
          // Resolve next-vibe/ui/web/* multi-path alias: tanstack/ first, then web/ fallback.
          // Also resolves next/* imports to tanstack equivalents for SSR.
          // vite-tsconfig-paths only resolves the first match for multi-path aliases,
          // so this plugin handles fallback for the SSR module runner.
          {
            name: "next-vibe-ui-ssr-resolver",
            enforce: "pre",
            resolveId(id: string): string | null {
              const exts = [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                "/index.ts",
                "/index.tsx",
                "/index.js",
              ];
              const tryResolve = (
                bases: string[],
                sub: string,
              ): string | null => {
                for (const base of bases) {
                  for (const ext of exts) {
                    const candidate = resolve(base, sub + ext);
                    if (existsSync(candidate) && statSync(candidate).isFile()) {
                      // POSIX-normalized: this resolver runs for the CLIENT
                      // environment too (it is not scoped to SSR despite the
                      // name), so every ID it returns becomes a browser-facing
                      // module/sourcemap reference. A raw Windows backslash path
                      // makes Firefox parse the bare `C:\...` specifier as
                      // `file:///C:/...` and refuse to load it cross-origin.
                      return candidate.replaceAll("\\", "/");
                    }
                  }
                }
                return null;
              };

              // next-vibe/ui/* → tanstack/ first, then web/ fallback.
              if (id.startsWith("next-vibe/ui/")) {
                const sub = id.slice("next-vibe/ui/".length);
                return tryResolve([tanstackUiDir, webUiDir], sub);
              }

              // Force-resolve moduleAliases via plugin so SSR module runner
              // always gets our shims - resolve.alias alone can be bypassed by
              // pre-bundled deps or the CJS require polyfill.
              // server-only handled by server-only-trace plugin
              if (id !== "server-only" && id in moduleAliases) {
                const rel = moduleAliases[id];
                if (rel) {
                  return resolve(ROOT_DIR, rel).replaceAll("\\", "/");
                }
              }

              // General `next-vibe/*` → vibe/* FIRST, then the domain root
              // (mirrors tsconfig `"next-vibe/*": ["./src/vibe/*", "./src/*"]`). The
              // single-string `resolve.alias` maps `next-vibe/` to the locale root
              // only, so framework files moved under system/ (e.g.
              // next-vibe/logger/file → system/logger/file) fail to resolve in the
              // SSR module runner. This two-candidate resolver fixes them.
              if (id !== "server-only" && id.startsWith("next-vibe/")) {
                const sub = id.slice("next-vibe/".length);
                return tryResolve(
                  [join(getSrcDir(), "vibe"), getSrcDir()],
                  sub,
                );
              }

              return null;
            },
          } satisfies PluginOption,
          // Treat native .node addons as external - esbuild can't process them
          {
            name: "native-node-externals",
            enforce: "pre",
            resolveId(id: string) {
              if (id.endsWith(".node")) {
                return { id, external: true };
              }
              return null;
            },
          } as Plugin,
          // generator.ts and seeds.ts files are CLI-only - they scan the filesystem
          // with dynamic import(variable) at build time and must never be processed
          // by Vite's import-analysis plugin (it can't statically analyze them).
          {
            name: "exclude-generator-seeds",
            enforce: "pre",
            load(id: string) {
              const clean = id.replace(/\?.*$/, "");
              if (
                clean.endsWith("/generator.ts") ||
                clean.endsWith("/seeds.ts")
              ) {
                return "export default {};";
              }
              return null;
            },
          } as Plugin,
          // After HMR invalidates any src/ module, surgically evict only the
          // changed modules (and their transitive importers) from the SSR runner
          // cache. Full .clear() is avoided — it causes all unrelated modules to
          // re-evaluate on the next request, which reads as a page reload.
          //
          // CSS changes skip SSR eviction entirely: Tailwind rescans can fire
          // globals.css HMR without any real source change and CSS never affects
          // SSR module bindings.
          {
            name: "ssr-clear-on-hmr",
            configureServer(srv) {
              // Intercept /@tanstack-start/styles.css before TanStack's handler.
              // CSS is declared via head() ?url link - this bundle is redundant.
              // unshift so we run before all other middleware.
              srv.middlewares.stack.unshift({
                route: "",
                handle: (
                  req: { url?: string },
                  res: {
                    setHeader: (k: string, v: string) => void;
                    statusCode: number;
                    end: () => void;
                  },
                  next: () => void,
                ) => {
                  if (
                    (req.url ?? "").startsWith("/@tanstack-start/styles.css")
                  ) {
                    res.setHeader("content-type", "text/css");
                    res.setHeader("cache-control", "no-store");
                    res.statusCode = 200;
                    res.end();
                    return;
                  }
                  next();
                },
              } as never);
            },
            handleHotUpdate({ modules, server: viteServer }) {
              const srcModules = modules.filter((m) => m.id?.includes("/src/"));
              if (srcModules.length === 0) {
                return;
              }
              // Skip SSR work for CSS-only changes.
              const nonCssModules = srcModules.filter(
                (m) => m.id && !m.id.endsWith(".css"),
              );
              if (nonCssModules.length === 0) {
                return;
              }

              const changedFiles = nonCssModules
                .map((m) => m.id?.replace(/^.*\/src\//, "src/") ?? m.id)
                .join(", ");
              const hmrMsg = fmtVite(`HMR update: ${changedFiles}`);
              process.stdout.write(`${hmrMsg}\n`);
              serverFileLog(hmrMsg);

              // Predict client full reloads: if any importer path from a
              // changed module escapes to a graph root without an accept
              // boundary, Vite broadcasts full-reload to EVERY open tab —
              // regardless of what page they show. Log the escaping chain so
              // "why did my page reload" is answerable from the dev log.
              for (const mod of nonCssModules) {
                const escapePath = findFullReloadPath(mod, new Set());
                if (escapePath) {
                  const reloadMsg = fmtVite(
                    `full-reload likely — unaccepted chain: ${escapePath.join(" → ")}`,
                  );
                  process.stdout.write(`${reloadMsg}\n`);
                  serverFileLog(reloadMsg);
                  break;
                }
              }

              // SSR: invalidate the changed modules in the module graph (marks
              // them stale for Vite's dependency tracking), then always do a
              // full evaluatedModules.clear().
              //
              // Surgical per-module eviction from evaluatedModules causes TDZ
              // errors: an importer that was NOT evicted still holds a reference
              // to the old namespace object of the evicted module. When the
              // evicted module re-executes, its top-level bindings (the Vite
              // __vite_ssr_import_N__ consts) are in TDZ until the module
              // completes — but the still-alive importer tries to call into
              // them before that. Full clear avoids this by forcing all SSR
              // modules to re-evaluate together on the next request.
              //
              // Client invalidation is intentionally NOT done here — Vite's own
              // HMR propagation handles it automatically from the `modules` list.
              const ssrEnv = viteServer.environments?.["ssr"];
              if (ssrEnv) {
                const ssrVisited = new Set<string>();
                let scoped = true;
                for (const mod of nonCssModules) {
                  if (mod.id) {
                    if (
                      !invalidateWithImporters(
                        ssrEnv.moduleGraph,
                        mod.id,
                        ssrVisited,
                      )
                    ) {
                      scoped = false;
                      break;
                    }
                  }
                }
                if (isRunnableDevEnvironment(ssrEnv)) {
                  if (scoped) {
                    evictSsrModules(ssrEnv.runner.evaluatedModules, ssrVisited);
                  } else {
                    ssrEnv.runner.evaluatedModules.clear();
                  }
                }
              }
              // The nitro dev worker — the process that actually SSRs the
              // site — keeps its own module cache in ANOTHER PROCESS. Without
              // eviction it serves the pre-edit HTML for every page loaded
              // after a save: the client hydrates new-against-old (hydration
              // mismatch in the console) and a reload shortly after an edit
              // shows stale content. Invalidate the graph and tell the WORKER
              // (its hot channel does not reach any browser tab) to drop its
              // runner cache — it re-imports fresh on the next request.
              for (const [envName, env] of Object.entries(
                viteServer.environments ?? {},
              )) {
                if (envName === "client" || envName === "ssr" || !env) {
                  continue;
                }
                if (isRunnableDevEnvironment(env)) {
                  env.runner.evaluatedModules.clear();
                  continue;
                }
                // Debounced: see nitroFullReloadTimer's declaration above.
                // invalidateAll() itself stays immediate (each edit's modules
                // must be marked stale right away); only the actual reload
                // signal to the worker is coalesced, so a worker mid-reimport
                // is never yanked out from under itself by the next edit.
                env.moduleGraph.invalidateAll();
                if (nitroFullReloadTimer) {
                  clearTimeout(nitroFullReloadTimer);
                }
                nitroFullReloadTimer = setTimeout(() => {
                  nitroFullReloadTimer = undefined;
                  env.hot.send({ type: "full-reload" });
                  serverFileLog(
                    `[ssr-evict] ${envName}: fetchable, sent full-reload`,
                  );
                }, 150);
              }
            },
          } as Plugin,
          // Nitro's ctx._initialized guard prevents re-initialization when Vite
          // does its built-in server.restart() (triggered by .env changes).
          // The config() hook sees ctx._initialized=true and skips setupNitroContext,
          // leaving Nitro with a stale/closed _envRunner - port 3100 never recovers.
          //
          // Fix: intercept server.restart() and do a full clean restart instead —
          // close the current server and spin up a fresh one with new plugin instances
          // (including a fresh nitro() call with a clean ctx).
          {
            name: "nitro-restart-fix",
            configureServer(srv) {
              const originalRestart = srv.restart.bind(srv);
              srv.restart = async (forceOptimize?: boolean): Promise<void> => {
                // If nitro's env runner is still alive, use Vite's built-in restart.
                // Only intercept when nitro is already broken (no environments.nitro).
                // We always intercept here because Vite's restart will always break
                // Nitro - nitro:init's ctx._initialized guard is unconditional.
                void forceOptimize; // unused - fresh start always re-optimizes
                void originalRestart; // kept for reference
                try {
                  // Use closeRef.fn (which calls closeAllConnections first) so the
                  // TCP socket on port 3100 is released before we try to re-bind it.
                  // Plain srv.close() leaves keep-alive proxy connections open, causing
                  // EADDRINUSE on the fresh startTanstackDevServer call.
                  if (closeRef?.fn) {
                    await closeRef.fn();
                  } else {
                    await srv.close();
                  }
                } catch {
                  /* ignore close errors */
                }
                // Spawn a fresh server: new nitro() call = new ctx = clean _initialized.
                const result = await viteCompiler.startTanstackDevServer(
                  fileConfig,
                  port,
                  publicPort,
                  closeRef,
                );
                if (!result.success) {
                  process.stderr.write(
                    `\n❌ TanStack restart failed: ${result.message ?? "unknown error"}\n`,
                  );
                }
              };
            },
          } as Plugin,
          // Widget HMR self-accept: widget.tsx files are loaded via React.lazy()
          // inside lazyWidget(). React.lazy() is an async boundary - Vite can't
          // propagate HMR updates through it automatically because the lazy module
          // isn't in the initial synchronous module graph. Without an accept()
          // handler the update bubbles to a full-page reload (or gets lost).
          //
          // Fix: inject `if (import.meta.hot) import.meta.hot.accept()` at the
          // bottom of every widget.tsx. This makes each widget module self-accepting:
          // Vite re-evaluates the module in-place on change, the React.lazy promise
          // is resolved afresh, and the Suspense boundary re-renders with the new
          // component without a full page reload.
          // Widget HMR: widget.tsx files are loaded via React.lazy() inside
          // lazyWidget(). React.lazy caches its resolved promise - even when
          // the module hot-accepts, React reuses the stale cached component.
          //
          // Fix: inject a hot.accept handler into each widget.tsx that calls
          // window.__vibeWidgetHmr(id, newModule) on update. lazyWidget()
          // registers a subscriber per factory; on update it swaps the stored
          // component ref and forces a re-render via a state counter.
          {
            name: "widget-hmr",
            enforce: "post",
            transform(
              code: string,
              id: string,
            ): { code: string; map: null } | undefined {
              // Target widget.tsx files in all environments (SSR + client).
              // The bracket-path-rewrite middleware serves widget files from the
              // SSR-cached transform result. By injecting the HMR snippet in both
              // environments, the browser receives the accept handler regardless
              // of which environment processed the file first.
              const cleanId = id.replace(/\?.*$/, "");
              if (!cleanId.endsWith("/widget.tsx")) {
                return undefined;
              }
              // Already has our HMR handler - don't double-inject
              if (code.includes("__vibeWidgetModuleId")) {
                return undefined;
              }
              // Extract exported function names so we can tag them with moduleId.
              // lazyWidget's factory does `.then(m => ({default: m.FooComponent}))`,
              // stripping the module to {default} only. By attaching __vibeWidgetModuleId
              // to each exported function, the component survives the strip and
              // lazy-widget.ts can read it from the resolved {default} value.
              const exportedNames: string[] = [];
              for (const match of code.matchAll(
                /export\s+(?:async\s+)?function\s+(\w+)/g,
              )) {
                if (match[1]) {
                  exportedNames.push(match[1]);
                }
              }
              const tagLines = exportedNames
                .map(
                  (n) =>
                    `try { ${n}.__vibeWidgetModuleId = ${JSON.stringify(cleanId)}; } catch(_e){}`,
                )
                .join("\n");
              const hmrSnippet = `
export const __vibeWidgetModuleId = ${JSON.stringify(cleanId)};
${tagLines}
if (typeof import.meta.hot !== 'undefined' && import.meta.hot) {
  import.meta.hot.accept((newMod) => {
    if (newMod && typeof window !== 'undefined' && window.__vibeWidgetHmr) {
      window.__vibeWidgetHmr(${JSON.stringify(cleanId)}, newMod);
    }
  });
}
`;
              return { code: `${code}${hmrSnippet}`, map: null };
            },
          } as Plugin,
          // TanStack route self-accept: route files (layout.tsx, page.tsx,
          // __root.tsx) are loaded via React.lazy() or TanStack's router and
          // have no HMR boundary — changes bubble all the way up to a full
          // page reload. Injecting import.meta.hot.accept() makes each route
          // module self-accepting so Vite re-evaluates it in place. TanStack's
          // router re-renders the affected route subtree without reloading.
          // Client-only: SSR does not use import.meta.hot.
          {
            name: "route-hmr-self-accept",
            enforce: "post",
            transform(
              code: string,
              id: string,
              opts,
            ): { code: string; map: null } | undefined {
              if (opts?.ssr || this.environment?.name === "ssr") {
                return undefined;
              }
              const cleanId = id.replace(/\?.*$/, "");
              // Generated hub files (routeTree, endpoint/route registries) are
              // pure lookup tables that import huge subtrees — without an
              // accept boundary here, edits to any definition/repository/i18n
              // file bubble through them to the entry and full-reload every
              // open tab. Re-evaluating them in place is safe: consumers
              // resolve entries lazily per lookup.
              const isRoute =
                cleanId.includes("/app-tanstack/routes/") ||
                cleanId.includes("/app-tanstack/routeTree.gen") ||
                cleanId.includes("/src/generated/endpoints/") ||
                cleanId.includes("/src/generated/routes/") ||
                cleanId.endsWith("/__root.tsx") ||
                (cleanId.includes("/src/_pages/") &&
                  (cleanId.endsWith("/layout.tsx") ||
                    cleanId.endsWith("/page.tsx")));
              if (!isRoute) {
                return undefined;
              }
              // Already has an accept handler
              if (code.includes("import.meta.hot.accept")) {
                return undefined;
              }
              return {
                code: `${code}\nif (import.meta.hot) { import.meta.hot.accept(); }\n`,
                map: null,
              };
            },
          } as Plugin,
        ] as PluginOption[],
        resolve: {
          tsconfigPaths: true,
          alias: [
            { find: /^@\//, replacement: `${srcDir.replaceAll("\\", "/")}/` },
            // The root layout's location is a constant (ROOT_LAYOUT_DIR), so
            // generated/app-tanstack/routes/__root.tsx is identical across trees.
            {
              find: "@root-layout",
              // POSIX-normalized: a raw Windows backslash path here leaks into
              // client-facing module/sourcemap references for every page (this
              // alias sits on the root layout, imported everywhere); Firefox
              // parses a bare `C:\...` specifier as `file:///C:/...` and the
              // page renders unstyled.
              replacement: resolve(ROOT_DIR, ROOT_LAYOUT_DIR).replaceAll(
                "\\",
                "/",
              ),
            },
            // next-vibe/ui/* is handled by the next-vibe-ui-ssr-resolver plugin
            // (tanstack-first, web fallback). The negative lookahead excludes it
            // from the general alias so the plugin wins.
            {
              find: /^next-vibe\/(?!ui\/)/,
              replacement: `${nextVibeDir.replaceAll("\\", "/")}/`,
            },
            // moduleAliases from build.config.ts viteOptions.moduleAliases.
            ...Object.entries(moduleAliases).map(
              ([specifier, relativePath]) => ({
                find: specifier,
                replacement: resolve(ROOT_DIR, relativePath).replaceAll(
                  "\\",
                  "/",
                ),
              }),
            ),
          ],
        } as InlineConfig["resolve"],
        // Inject runtime env constants so client bundles get the correct values.
        // process.env has already been patched by patchPublicUrlPort() before createServer().
        define: {
          "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
            process.env["NEXT_PUBLIC_APP_URL"] ??
              `http://localhost:${String(publicPort ?? port ?? 3001)}`,
          ),
          ...publicEnvs(),
        },
        server: {
          port: port ?? 3001,
          strictPort: true,
          host: "127.0.0.1",
          watch: {
            // Ignore .tmp dir - build artifacts, not user source.
            // Ignore routeTree.gen.ts - regenerated by TanStack Start plugin, not user source.
            // Ignore app-tanstack/routes - auto-generated, touching them shouldn't trigger CSS HMR.
            // Ignore generated/ dirs - written by task runner generators, contain no Tailwind classes.
            // Without this, every generator run triggers a globals.css HMR cycle via Tailwind's
            // @source scanner re-evaluating all watched files.
            // Use a function for ignored so it works with disableGlobbing:true.
            // Glob strings in ignored are treated as literals when disableGlobbing
            // is set, so they would never match. A function always works.
            ignored: (rawFilePath: string) => {
              // POSIX-normalised first. Chokidar reports native paths, so on
              // Windows every test below - each written with "/" separators -
              // matched NOTHING, and the watcher walked node_modules in full.
              const filePath = rawFilePath.replaceAll("\\", "/");
              return (
                filePath.includes("/.tmp/") ||
                filePath.includes("/.next/") ||
                filePath.includes("/.next-prod/") ||
                filePath.includes("/.next-rebuild/") ||
                filePath.includes("/node_modules/") ||
                filePath.includes("/.claude/") ||
                filePath.endsWith("/routeTree.gen.ts") ||
                filePath.includes("/app-tanstack/routes/") ||
                filePath.includes("/generated/") ||
                filePath.endsWith("/generated/email/index.ts") ||
                filePath.includes("/app-native/") ||
                filePath.includes("/test-files/") ||
                filePath.includes("/testing/") ||
                filePath.includes("/fixtures/") ||
                filePath.endsWith(".test.ts") ||
                filePath.endsWith(".test.tsx") ||
                filePath.endsWith(".spec.ts") ||
                filePath.endsWith(".spec.tsx") ||
                // PGlite socket directory — changes here are runtime DB events, not source
                filePath.includes(".db.pg") ||
                filePath.includes(".db.pg.lock")
              );
            },
            // disableGlobbing tells chokidar to treat bracket paths as literal paths,
            // not a glob pattern. This allows native inotify (Linux) / FSEvents (macOS)
            // instead of polling - faster detection, less CPU, no false mtime positives.
            // ignored must be a function (not glob strings) for this to work correctly.
            disableGlobbing: true,
          },
          // When running behind a proxy (e.g. Bun WS proxy on publicPort), tell Vite's
          // injected HMR client to connect to the proxy port instead of the internal port.
          // The Bun proxy already forwards non-/ws WebSocket upgrades to nextPort, so HMR
          // traffic flows: browser → proxy:5000 → Vite HMR:5100.
          // We use server.hmr as an object so we can set clientPort (what the browser uses)
          // while leaving Vite's own HMR listener on the internal port.
          hmr:
            publicPort !== null && publicPort !== undefined
              ? { clientPort: publicPort }
              : true,
          // Allow sourcemaps from packages that reference source files outside
          // their own package directory (e.g. drizzle-zod → node_modules/src/).
          // false = never ignore any sourcemap, serve them all.
          sourcemapIgnoreList: false,
          // Pre-transform only the SSR entry + generated route tree so the
          // first real request doesn't pay the full cold-evaluation cost.
          // Warming all definition.ts files pulls in DB/drizzle/pg on the
          // SSR side and noticeably delays startup — skip them. Shared deps
          // (react, router, i18n) warm naturally as route files load; any
          // subsequent endpoint that shares those deps benefits for free.
          warmup: {
            ssrFiles: [
              `${srcDirectory}/router.tsx`,
              `${srcDirectory}/routes/__root.tsx`,
            ],
            clientFiles: [`${srcDirectory}/router.tsx`],
          },
        } as InlineConfig["server"],
        // Use a TanStack-specific cache dir so it doesn't conflict with
        // the Next.js Vite cache in node_modules/.vite/deps/
        cacheDir: resolve(ROOT_DIR, "node_modules/.vite-tanstack"),
        logLevel: "info",
        build: {
          // drizzle-zod sourcemaps reference paths outside their package (packaging bug).
          // Exclude from build output only — dev sourcemaps are still served via
          // server.sourcemapIgnoreList: false above.
          sourcemapIgnoreList: (relativeSourcePath: string) =>
            relativeSourcePath.includes("drizzle-zod"),
        } as InlineConfig["build"],
        // Disable auto-discovery: scanning src/_pages/** pulls in server-only deps
        // (ssh2, react-native, lightningcss, .node binaries) into the client
        // optimizeDeps scan and causes esbuild errors. Instead, list only the
        // CJS packages that are actually needed client-side.
        //
        // CRITICAL: holdUntilCrawlEnd: false prevents SSR from hanging.
        // When holdUntilCrawlEnd is true (Vite default), SSR transformRequest
        // waits on the client depOptimizationProcessing promise which only
        // resolves after the client crawl + esbuild run completes. On cold
        // start this blocks the first SSR request for several seconds.
        // Setting holdUntilCrawlEnd: false allows deps to be served on-demand
        // while pre-bundling runs in the background - no SSR blocking.
        optimizeDeps: {
          noDiscovery: true,
          holdUntilCrawlEnd: false,
          include: [
            // Mirrored from .vite/deps/_metadata.json (Next.js pre-bundle list),
            // minus server-only packages (pg, ssh2, argon2, drizzle, etc.)
            "react",
            "react-dom",
            "react/jsx-dev-runtime",
            "react/jsx-runtime",
            "react-dom/client",
            "@ai-sdk/openai/internal",
            "@anthropic-ai/claude-agent-sdk",
            "@dnd-kit/core",
            "@dnd-kit/sortable",
            "@hookform/resolvers/zod",
            "@icons-pack/react-simple-icons",
            "@openrouter/ai-sdk-provider",
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
            "@react-email/components",
            "@react-email/render",
            "@tanstack/react-query",
            "@tanstack/react-table",
            "@xyflow/react",
            "ai",
            "class-variance-authority",
            "clsx",
            "cmdk",
            "date-fns",
            "date-fns/locale",
            "embla-carousel-react",
            "framer-motion",
            "input-otp",
            "lightweight-charts",
            "lucide-react",
            "nanoid",
            "next-themes",
            "react-day-picker",
            "react-hook-form",
            "react-intersection-observer",
            "react-joyride",
            "react-markdown",
            "react-syntax-highlighter",
            "react-syntax-highlighter/dist/esm/styles/hljs",
            "remark-breaks",
            "remark-gfm",
            "sonner",
            "tailwind-merge",
            "turndown",
            "uuid",
            "vaul",
            "victory",
            "zod",
            "zod/v4",
            "zustand",
            "zustand/middleware",
            "cron-parser",
            // Additional CJS packages not in Next.js list
            "style-to-js",
            "debug",
            "extend",
            "@tiptap/react",
            "tiptap-markdown",
            "markdown-it-task-lists",
            "fast-equals",
            "use-sync-external-store",
            "use-sync-external-store/shim",
            "use-sync-external-store/shim/with-selector",
            "lowlight",
            "highlight.js",
            "@babel/runtime/regenerator",
          ],
        },
      });

      await server.listen();
      // Tune Node.js HTTP server timeouts on Vite's internal server (port 3100).
      //
      // headersTimeout (default 60s): time allowed to receive the full request headers.
      // The Bun proxy sometimes takes a moment to forward headers on first connect.
      //
      // timeout / requestTimeout: time allowed for a complete request-response cycle.
      // SSR renders can take >10s on cold start; we want no practical deadline here.
      //
      // CRITICAL: do NOT use 0 to "disable" any of these. Under Bun, node:http
      // runs on Bun.serve, and Bun 1.3.x ignores zero timeouts (the same bug
      // as idleTimeout: 0 in realtime/server.ts) — it silently falls back to
      // the 10s uWS default. That killed cold-start SSR renders that stream
      // no bytes for 10s: "[Bun.serve]: request timed out after 10 seconds"
      // here, surfacing as ECONNRESET at the proxy. Use 255s, the uWS max.
      //
      // keepAliveTimeout (default 5s): idle time before the server closes a keep-alive
      // connection. Do NOT set to 0. keepAliveTimeout=0 causes the server to close
      // idle connections immediately; when the Bun proxy reuses a keep-alive socket
      // for the next request, the server has already closed it, producing ECONNRESET
      // on the first request after any brief idle period. Leave at a generous value
      // so keep-alive connections outlive typical SSR render gaps.
      if (server.httpServer) {
        const httpServer = server.httpServer as NodeHttpServer;
        httpServer.keepAliveTimeout = 65_000; // longer than proxy idle gaps
        httpServer.headersTimeout = 255_000;
        httpServer.timeout = 255_000;
        (
          httpServer as NodeHttpServer & { requestTimeout?: number }
        ).requestTimeout = 255_000;
      }
      const resolvedPort = server.config.server.port ?? port ?? 3001;
      const url = `http://localhost:${resolvedPort}`;
      const publicUrl = publicPort ? `http://localhost:${publicPort}` : url;

      // Pretty startup banner matching Next.js style
      const networkUrl = ((): string | undefined => {
        try {
          for (const ifaces of Object.values(networkInterfaces())) {
            for (const iface of ifaces ?? []) {
              if (iface.family === "IPv4" && !iface.internal) {
                return `http://${iface.address}:${publicPort ?? resolvedPort}`;
              }
            }
          }
        } catch {
          /* ignore */
        }
        return undefined;
      })();
      const uptime = process.uptime().toFixed(3);
      const lines = [
        `⚡ TanStack Start (Vite + Nitro)`,
        `   - Local:    ${publicUrl}`,
        networkUrl ? `   - Network:  ${networkUrl}` : undefined,
        `   ✓ Ready`,
      ].filter(Boolean) as string[];
      const indent = " ".repeat(`[${uptime}s] `.length);
      const formatted = lines
        .map((line, i) =>
          i === 0
            ? `[${uptime}s] ${maybeColorize(line, semantic.nextjs)}`
            : `${indent}${maybeColorize(line, semantic.nextjs)}`,
        )
        .join("\n");
      process.stdout.write(`${formatted}\n`);
      serverFileLog(formatted);

      // Prime the SSR module graph in the background. server.warmup only
      // pre-TRANSFORMS files — module EVALUATION still happens lazily, so the
      // first real page request pays ~2s evaluating the shared graph
      // (providers, layout chain, i18n) that every page needs. One
      // self-request right after listen absorbs that cost during boot; the
      // user's first page load then only evaluates its own page chain.
      void (async (): Promise<void> => {
        // Wait for Vite's own dependency crawl/optimization to settle before
        // firing the self-request at all. On a slow machine or a genuinely
        // cold esbuild cache, "[optimizer] scanning/bundling dependencies"
        // alone can run 30s+ AFTER "Ready" is printed — firing immediately
        // guaranteed every attempt below raced that window and lost.
        // Best-effort (never blocks priming forever).
        try {
          await server.waitForRequestsIdle();
        } catch {
          /* proceed anyway — the retry loop below is still a safety net */
        }
        // Sequential: concurrent cold SSR renders race the module runner.
        // /en-US warms the shared graph (providers, layout, i18n); the
        // threads page additionally warms the chat/ai-stream widget chain —
        // the page users open first, whose first render otherwise holds its
        // SSR stream open for many seconds.
        for (const path of ["/en-US", "/en-US/threads/incognito/new"]) {
          // Up to 8 attempts: on a genuinely cold cache / slow machine EITHER
          // the first SSR transform of the whole route graph can itself exceed
          // Bun's fixed 10s idle-socket timeout (nothing request-level runs
          // until that transform finishes), OR nitro's dev-worker environment
          // is simply not registered yet (a "Vite environment \"nitro\" is
          // unavailable" 503). Each attempt leaves the graph MORE
          // compiled/cached than the last, so persisting (with a short
          // backoff so we don't hammer a worker that's still booting)
          // converges.
          let primed = false;
          for (let attempt = 1; attempt <= 8 && !primed; attempt++) {
            try {
              // oxlint-disable-next-line restricted/no-raw-fetch -- dev-server self-request to prime SSR page rendering, not an endpoint call
              const res = await fetch(`${url}${path}`, {
                headers: { "user-agent": "vibe-ssr-prime" },
              });
              // Drain the stream so the full page (not just the shell) evaluates.
              await res.text();
              if (res.ok) {
                primed = true;
                const primeMsg = fmtVite(
                  attempt === 1
                    ? `SSR graph primed (${path})`
                    : `SSR graph primed (${path}) — succeeded on retry ${String(attempt)} after a cold-cache timeout`,
                );
                process.stdout.write(`${primeMsg}
`);
                serverFileLog(primeMsg);
              } else if (attempt === 8) {
                const primeMsg = fmtVite(
                  `SSR prime got HTTP ${res.status} (${path}) after ${String(attempt)} attempts — first cold render failed, check the request log above`,
                );
                process.stdout.write(`${primeMsg}
`);
                serverFileLog(primeMsg);
              } else {
                await new Promise<void>((_resolve) => {
                  setTimeout(_resolve, 1000);
                });
              }
            } catch {
              /* priming is best-effort — a connection reset mid-transform is
               * expected on early attempts of a cold cache; retry the loop. */
            }
          }
        }
      })();

      const closeFn = (): Promise<void> => {
        // Force-terminate all keep-alive connections before closing so the TCP
        // socket is released immediately. Without this, server.close() waits
        // for keep-alive connections (e.g. from the Bun proxy) to drain, the
        // 2-second timeout in the shutdown handler fires, and process.exit()
        // leaves the socket open — which Docker/WSL2 HNS then inherits as a
        // zombie (PID 7256 on Windows).
        if (server.httpServer) {
          const h = server.httpServer as NodeHttpServer & {
            closeAllConnections?: () => void;
            closeIdleConnections?: () => void;
          };
          h.closeAllConnections?.();
          h.closeIdleConnections?.();
        }
        return server.close();
      };
      if (closeRef) {
        closeRef.fn = closeFn;
      }
      return {
        success: true,
        url,
        close: closeFn,
      };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Get compiled file size
   */
  getFileSize(filePath: string): number {
    const fullPath = resolve(ROOT_DIR, filePath);
    if (existsSync(fullPath)) {
      return statSync(fullPath).size;
    }
    return 0;
  }

  /** Format bytes as kilobytes string, e.g. "123.4 kB". */
  private static fmtKb(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} kB`;
  }
}

// Singleton instance
export const viteCompiler = new ViteCompiler();
