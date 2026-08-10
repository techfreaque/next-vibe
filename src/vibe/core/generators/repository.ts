/**
 * Generators endpoint repository — the `vibe gen` surface.
 *
 * Contains the GeneratorRunner orchestrator and the endpoint handler.
 * The registry lives in <GENERATED_DIR>/generators/index.ts, emitted by
 * ./generator.ts from the `generator` const each domain generator exports.
 *
 * BOOTSTRAP FALLBACK: running this file directly performs the full generation
 * from scratch — even with zero generated files or a broken CLI. The
 * generators-index pre-step below writes the registry before it is imported, so
 * an empty generated tree still bootstraps.
 */

import "server-only";

import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { GENERATED_DIR, getApiDir } from "@/env/paths";
import type { GeneratorEntry } from "@/generated/generators/index";

import type { JwtPayloadType } from "../../identity/auth/types";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import {
  type ResponseType as BaseResponseType,
  ErrorResponseTypes,
  failInline,
  success,
} from "../route/response.schema";
import { parseError } from "../utils/parse-error";
import type {
  GenerateAllRequestOutput,
  GenerateAllResponseOutput,
} from "./definition";
import { generate as generateGeneratorsIndex, OUTPUT_FILE } from "./generator";
import {
  type GenState,
  isUnchanged,
  markDone,
  readGenState,
  writeGenState,
} from "./shared/gen-cache";
import type {
  GeneratorContext,
  GeneratorInputIndex,
} from "./shared/shared-inputs";
import { buildGeneratorContext } from "./shared/shared-inputs";
import { findFilesRecursively } from "./shared/utils";

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

interface RunGeneratorsOptions {
  logger: EndpointLogger;
  force?: boolean;
  live?: GeneratorInputIndex;
  only?: ReadonlySet<string>;
  noCache?: boolean;
  /**
   * Live progress tap. Called with a fresh snapshot of every phase row each
   * time one changes state (queued → running → done/skipped/failed). The
   * endpoint handler forwards these as "gen-progress" events; the bootstrap
   * CLI entry passes nothing and stays silent.
   */
  onProgress?: (phases: GenPhase[]) => void;
}

/** One generator's progress row. `id` keys the cache-merger's array merge. */
export interface GenPhase {
  id: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  summary?: string;
  durationMs?: number;
}

interface RunGeneratorsResult {
  ran: string[];
  skipped: string[];
  failed: { key: string; error: string }[];
  output: string[];
  /** Final phase rows — the same data the progress events carried. */
  phases: GenPhase[];
  /**
   * Size of the generated registry. Reported from the run rather than read off a
   * static `REGISTRY` getter, because the registry is now loaded inside the run.
   */
  totalGenerators: number;
}

/** Cache key AND phase-row id of the generators-index pre-step. */
const GENERATORS_INDEX_KEY = "generators-index";

/**
 * Yield to the event loop's timer phase. `setTimeout(0)`, not `setImmediate`
 * or `queueMicrotask`: the live-frame's repaint is itself a `setTimeout`, so
 * only a real timer-phase yield gives an already-due repaint a turn to run
 * before more synchronous generator work resumes.
 */
function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Cap on how many "default"-phase generators run at once. JS is single-
 * threaded — firing all of them via one unbounded `Promise.all` doesn't give
 * real parallelism for the CPU-bound parts of a generator (hashing, JSON
 * building, embedding lookups), only more interleaving/context-switch
 * overhead, and it multiplies I/O contention (every generator hitting disk at
 * once). Measured 2026-08-05: the same `--force` run that took ~28s on one
 * machine took 130s+ on another, entirely inside this batch — a bounded pool
 * removes that unbounded-contention blowup instead of just tolerating it with
 * a longer timeout.
 */
const MAX_PARALLEL_GENERATORS = 4;

/** Run `tasks` with at most `limit` in flight at once, in original order. */
async function runWithConcurrencyLimit<T>(
  tasks: readonly (() => Promise<T>)[],
  limit: number,
): Promise<void> {
  let nextIndex = 0;
  const worker = async (): Promise<void> => {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      await tasks[index]?.();
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, () => worker()),
  );
}

type RunOutcome =
  | { status: "ran"; summary: string; cacheKey: string | null }
  | { status: "skipped" }
  | { status: "failed"; error: string };

/**
 * The generators orchestrator. Reads the registry from the generated index,
 * runs def-scan generators sequentially and everything else in parallel, with
 * gen-cache skipping.
 */
export class GeneratorRunner {
  /**
   * Load the generated registry.
   *
   * Deliberately a dynamic import inside the run, NOT a module-level static one:
   * the registry is generated output, and the pre-step below is what writes it.
   * A static import is resolved when this module loads, which made the documented
   * bootstrap fallback (`bun repository.ts` on a tree with no src/generated/*)
   * die with "Cannot find module @/generated/generators/index" before a single
   * generator could run — the one situation the fallback exists for. Importing
   * after the pre-step means the file is always on disk by the time we need it.
   */
  private static async loadRegistry(): Promise<readonly GeneratorEntry[]> {
    const mod = (await import("@/generated/generators/index")) as {
      GENERATORS_REGISTRY: readonly GeneratorEntry[];
    };
    return mod.GENERATORS_REGISTRY;
  }

  private static resolve(
    registry: readonly GeneratorEntry[],
    opts: RunGeneratorsOptions,
  ): GeneratorEntry[] {
    return registry.filter((g) => {
      if (opts.only && !opts.only.has(g.key)) {
        return false;
      }
      return g.enabled;
    });
  }

  private static async runOne(
    gen: GeneratorEntry,
    ctx: GeneratorContext,
    genState: GenState,
    opts: RunGeneratorsOptions,
  ): Promise<RunOutcome> {
    if (!opts.noCache && !opts.force && gen.cacheKey) {
      const inputs = gen.findInputs(opts.live);
      if (isUnchanged(gen.cacheKey, inputs, gen.output, genState)) {
        return { status: "skipped" };
      }
    }

    try {
      const result = await gen.run(ctx);
      if (result.failed) {
        return { status: "failed", error: result.failed };
      }
      return {
        status: "ran",
        summary: result.summary,
        cacheKey: gen.cacheKey,
      };
    } catch (error) {
      return { status: "failed", error: parseError(error).message };
    }
  }

  /**
   * Orchestrate a generation run. def-scan sequential, default parallel.
   *
   * Pre-step: regenerate the generators index (cached). It is excluded from
   * the main GENERATORS_REGISTRY to avoid a circular import.
   */
  static async runGenerators(
    opts: RunGeneratorsOptions,
  ): Promise<RunGeneratorsResult> {
    const { logger } = opts;

    const result: RunGeneratorsResult = {
      ran: [],
      skipped: [],
      failed: [],
      output: [],
      phases: [],
      totalGenerators: 0,
    };
    const recordedCacheKeys = new Set<string>();

    // ── Progress reporting ──────────────────────────────────────────────
    // Each generator gets a phase row; every state change hands a snapshot to
    // opts.onProgress. Progress is DATA, not output — the endpoint handler
    // turns snapshots into "gen-progress" events, the CLI repaints its frame.
    //
    // Declared BEFORE any work, and the first row is published before the
    // cache probe below: that probe walks the whole api dir for generator.ts
    // and hashes every hit, which is seconds of dead time on a cold tree. With
    // the publish after it, the terminal stayed empty for that whole stretch
    // and the run looked hung rather than started.
    const phases = result.phases;
    const publishProgress = (): void => {
      opts.onProgress?.(phases.map((row) => ({ ...row })));
    };
    const phaseRow = (id: string): GenPhase => {
      let row = phases.find((entry) => entry.id === id);
      if (!row) {
        row = { id, status: "pending" };
        phases.push(row);
      }
      return row;
    };

    const record = (
      key: string,
      outcome: RunOutcome,
      durationMs?: number,
    ): void => {
      const row = phaseRow(key);
      // No duration on cached rows: a cache probe finishes in microseconds but
      // measures as tens of seconds when it queues behind the real generators'
      // IO in the parallel batch — printing that reads as slow cache checks.
      if (outcome.status !== "skipped") {
        row.durationMs = durationMs;
      }
      if (outcome.status === "ran") {
        result.ran.push(key);
        result.output.push(`✅ ${key}: ${outcome.summary}`);
        row.status = "done";
        row.summary = outcome.summary;
        if (outcome.cacheKey) {
          recordedCacheKeys.add(outcome.cacheKey);
        }
      } else if (outcome.status === "skipped") {
        result.skipped.push(key);
        result.output.push(`✅ ${key}: cached`);
        row.status = "skipped";
        row.summary = "cached";
      } else {
        result.failed.push({ key, error: outcome.error });
        result.output.push(`❌ ${key}: ${outcome.error}`);
        row.status = "failed";
        row.summary = outcome.error;
        logger.error(`Generator ${key} failed: ${outcome.error}`);
      }
      publishProgress();
    };

    // First frame, before any disk work: the run has started and the index step
    // is what it is doing. Everything below this line can take seconds.
    phaseRow(GENERATORS_INDEX_KEY).status = "running";
    publishProgress();

    const genState: GenState = opts.noCache || opts.force ? {} : readGenState();

    // Pre-step: generators index (not in registry — circular import). Runs
    // FIRST, before the registry is imported, so a tree with no generated files
    // still bootstraps.
    const generatorsIndexKey = GENERATORS_INDEX_KEY;
    const generatorsIndexInputs = findFilesRecursively(
      getApiDir(),
      "generator.ts",
    );
    const skipGeneratorsIndex =
      !opts.noCache &&
      !opts.force &&
      isUnchanged(
        generatorsIndexKey,
        generatorsIndexInputs,
        OUTPUT_FILE,
        genState,
      );

    if (skipGeneratorsIndex) {
      result.skipped.push("generators-index");
      result.output.push(`✅ generators-index: cached`);
      const row = phaseRow(generatorsIndexKey);
      row.status = "skipped";
      row.summary = "cached";
      publishProgress();
    } else {
      const row = phaseRow(generatorsIndexKey);
      const startedAt = Date.now();
      try {
        const indexResult = await generateGeneratorsIndex({ logger });
        result.ran.push("generators-index");
        result.output.push(`✅ generators-index: ${indexResult.summary}`);
        row.status = "done";
        row.summary = indexResult.summary;
        if (!opts.noCache && !opts.force) {
          markDone(generatorsIndexKey, generatorsIndexInputs, genState);
        }
      } catch (error) {
        const msg = parseError(error).message;
        result.failed.push({ key: "generators-index", error: msg });
        result.output.push(`❌ generators-index: ${msg}`);
        row.status = "failed";
        row.summary = msg;
        logger.error(`Generator generators-index failed: ${msg}`);
      }
      row.durationMs = Date.now() - startedAt;
      publishProgress();
    }

    // Registry is imported only now — the pre-step above just wrote it.
    const registry = await GeneratorRunner.loadRegistry();
    const generators = GeneratorRunner.resolve(registry, opts);
    // +1 for the generators-index pre-step: it is deliberately excluded from
    // the registry itself (running it IS what builds the registry — including
    // it would be circular), but it gets its own phase row and counts toward
    // result.ran/result.skipped like every other generator, so the displayed
    // total must count it too or "Unchanged" outnumbers "Total" whenever it's
    // cached (found 2026-08-05: "Total: 6 ... Unchanged: 7").
    result.totalGenerators = registry.length + 1;

    // Every resolved generator appears as a queued row before any of them run,
    // so the live frame shows the full plan up front, not rows popping in.
    for (const gen of generators) {
      phaseRow(gen.key);
    }
    publishProgress();

    const ctx = await buildGeneratorContext({
      logger,
      force: opts.force ?? false,
      live: opts.live,
      need: {
        definitionModules: generators.some((g) => g.needs.definitionModules),
      },
    });

    // def-scan: sequential (Bun TDZ).
    for (const gen of generators.filter((g) => g.phase === "def-scan")) {
      phaseRow(gen.key).status = "running";
      publishProgress();
      const startedAt = Date.now();
      record(
        gen.key,
        await GeneratorRunner.runOne(gen, ctx, genState, opts),
        Date.now() - startedAt,
      );
      // A cache hit resolves runOne without ever awaiting real I/O, so this
      // loop can otherwise run several iterations back to back on the same
      // microtask chain. The live frame's repaint is a setTimeout, a
      // macrotask — it cannot fire until something yields to the event loop's
      // timer phase, so a burst of cached generators printed nothing until
      // the whole run finished. setTimeout(0) yields there explicitly.
      await yieldToEventLoop();
    }

    // default: bounded-concurrency pool, not one unbounded Promise.all. Each
    // generator records (and publishes) as IT finishes, not when the whole
    // batch does — that per-completion repaint is the live UI. A generator
    // stays "pending" until a free worker actually picks it up, matching
    // reality — marking all of them "running" upfront lied about the ones
    // still queued behind the concurrency cap.
    const parallelGens = generators.filter((g) => g.phase === "default");
    publishProgress();
    await runWithConcurrencyLimit(
      parallelGens.map((gen) => async () => {
        phaseRow(gen.key).status = "running";
        publishProgress();
        const startedAt = Date.now();
        const outcome = await GeneratorRunner.runOne(gen, ctx, genState, opts);
        record(gen.key, outcome, Date.now() - startedAt);
        // Same reasoning as the def-scan loop above: on a mostly-cached run,
        // every one of these resolves in the same microtask burst with no
        // real I/O between them, starving the repaint timer for the entire
        // batch.
        await yieldToEventLoop();
      }),
      MAX_PARALLEL_GENERATORS,
    );

    if (!opts.noCache && !opts.force) {
      for (const gen of generators) {
        if (gen.cacheKey && recordedCacheKeys.has(gen.cacheKey)) {
          markDone(gen.cacheKey, gen.findInputs(opts.live), genState);
        }
      }
      writeGenState(genState);
    }

    return result;
  }
}

// ---------------------------------------------------------------------------
// Endpoint handler
// ---------------------------------------------------------------------------

export class GenerateAllRepository {
  /** Run all (enabled) generators. Called by the `gen` endpoint route. */
  static async generateAll(
    data: GenerateAllRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<BaseResponseType<GenerateAllResponseOutput>> {
    try {
      // Emitter + definition are loaded lazily: the bootstrap CLI entry below
      // must stay runnable on a tree with no generated files, and this handler
      // path only ever runs behind the endpoint route.
      const [{ createEndpointEmitter }, { default: generateAllEndpoints }] =
        await Promise.all([
          import("../../realtime/core/emitter"),
          import("./definition"),
        ]);
      const emitProgress = createEndpointEmitter(
        generateAllEndpoints.POST,
        logger,
        user,
      );

      const result = await GeneratorRunner.runGenerators({
        logger,
        force: data.force,
        // Progress is DATA, not output: the CLI taps these events in-process
        // and repaints its frame; the web client merges them into the cache.
        onProgress: (phases): void => {
          emitProgress("gen-progress", {
            responseData: { phases, isComplete: false },
          });
        },
      });

      if (result.failed.length > 0) {
        return failInline({
          message: `Generators failed: ${result.failed.map((f) => `${f.key}: ${f.error}`).join("; ")}`,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        success: true,
        generationCompleted: true,
        isComplete: true,
        phases: result.phases,
        output: result.output.join("\n"),
        generationStats: {
          totalGenerators: result.totalGenerators,
          generatorsRun: result.ran.length,
          generatorsSkipped: result.skipped.length,
          outputDirectory: GENERATED_DIR,
          functionalGeneratorsCompleted: result.ran.length > 0,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error);
      return failInline({
        message: `Generator run failed: ${errorMessage.message}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * True when this module is the process entry point. `import.meta.main` would
 * say the same thing in one word, but it does not exist on node — comparing the
 * resolved argv[1] to this module's URL works on both runtimes. realpath so a
 * symlinked bin (node_modules/.bin) still matches.
 */
function isEntryPoint(): boolean {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return pathToFileURL(realpathSync(entry)).href === import.meta.url;
  } catch {
    return false;
  }
}

/**
 * Bootstrap CLI entry: running this file directly regenerates everything from scratch.
 * Calls the orchestrator directly (no endpoint definition / no generated-file
 * imports beyond the generators index) so it works even when the CLI is broken.
 */
if (isEntryPoint()) {
  const logger = createEndpointLogger(false, "en-US");
  // force: the gen-cache answers "did the INPUTS change" — meaningless on a
  // wiped tree, where a stale .tmp/gen-state.json would skip generators whose
  // output no longer exists. From-scratch means regenerate everything.
  void GeneratorRunner.runGenerators({ logger, force: true }).then((r) => {
    logger.info(r.output.join("\n"));
    if (r.failed.length > 0) {
      logger.error(
        `Generation failed: ${r.failed.map((f) => f.key).join(", ")}`,
      );
      // Non-zero exit so callers (postinstall bootstrap loop) can retry.
      process.exitCode = 1;
    }
    return undefined;
  });
}
