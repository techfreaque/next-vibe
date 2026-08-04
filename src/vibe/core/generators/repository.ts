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

import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import {
  ErrorResponseTypes,
  failInline,
  type ResponseType as BaseResponseType,
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
}

interface RunGeneratorsResult {
  ran: string[];
  skipped: string[];
  failed: { key: string; error: string }[];
  output: string[];
  /**
   * Size of the generated registry. Reported from the run rather than read off a
   * static `REGISTRY` getter, because the registry is now loaded inside the run.
   */
  totalGenerators: number;
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

    const genState: GenState = opts.noCache || opts.force ? {} : readGenState();

    // Pre-step: generators index (not in registry — circular import). Runs
    // FIRST, before the registry is imported, so a tree with no generated files
    // still bootstraps.
    const generatorsIndexKey = "generators-index";
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

    const result: RunGeneratorsResult = {
      ran: [],
      skipped: [],
      failed: [],
      output: [],
      totalGenerators: 0,
    };
    const recordedCacheKeys = new Set<string>();

    const record = (key: string, outcome: RunOutcome): void => {
      if (outcome.status === "ran") {
        result.ran.push(key);
        result.output.push(`✅ ${key}: ${outcome.summary}`);
        if (outcome.cacheKey) {
          recordedCacheKeys.add(outcome.cacheKey);
        }
      } else if (outcome.status === "skipped") {
        result.skipped.push(key);
        result.output.push(`✅ ${key}: cached`);
      } else {
        result.failed.push({ key, error: outcome.error });
        result.output.push(`❌ ${key}: ${outcome.error}`);
        logger.error(`Generator ${key} failed: ${outcome.error}`);
      }
    };

    if (skipGeneratorsIndex) {
      result.skipped.push("generators-index");
      result.output.push(`✅ generators-index: cached`);
    } else {
      try {
        const indexResult = await generateGeneratorsIndex({ logger });
        result.ran.push("generators-index");
        result.output.push(`✅ generators-index: ${indexResult.summary}`);
        if (!opts.noCache && !opts.force) {
          markDone(generatorsIndexKey, generatorsIndexInputs, genState);
        }
      } catch (error) {
        const msg = parseError(error).message;
        result.failed.push({ key: "generators-index", error: msg });
        result.output.push(`❌ generators-index: ${msg}`);
        logger.error(`Generator generators-index failed: ${msg}`);
      }
    }

    // Registry is imported only now — the pre-step above just wrote it.
    const registry = await GeneratorRunner.loadRegistry();
    const generators = GeneratorRunner.resolve(registry, opts);
    result.totalGenerators = registry.length;

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
      record(gen.key, await GeneratorRunner.runOne(gen, ctx, genState, opts));
    }

    // default: parallel.
    const parallelGens = generators.filter((g) => g.phase === "default");
    const outcomes = await Promise.all(
      parallelGens.map((gen) =>
        GeneratorRunner.runOne(gen, ctx, genState, opts),
      ),
    );
    parallelGens.forEach((gen, i) => record(gen.key, outcomes[i]!));

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
  ): Promise<BaseResponseType<GenerateAllResponseOutput>> {
    try {
      const result = await GeneratorRunner.runGenerators({
        logger,
        force: data.force,
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
