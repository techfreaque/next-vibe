/**
 * Generators endpoint repository — the `vibe gen` surface.
 *
 * Contains the GeneratorRunner orchestrator and the endpoint handler.
 * The registry lives in src/generated/generators/index.ts — edit it directly
 * to add/remove generators, no meta-generator needed.
 *
 * BOOTSTRAP FALLBACK: `bun src/vibe/core/generators/repository.ts`
 * runs the full generation from scratch — even with zero generated files or a
 * broken CLI.
 */

import "server-only";

import {
  type GenState,
  isUnchanged,
  markDone,
  readGenState,
  writeGenState,
} from "next-vibe/core/generators/shared/gen-cache";
import type { LiveIndex } from "next-vibe/core/generators/shared/live-index";
import type { GeneratorContext } from "next-vibe/core/generators/shared/shared-inputs";
import { buildGeneratorContext } from "next-vibe/core/generators/shared/shared-inputs";
import { findFilesRecursively } from "next-vibe/core/generators/shared/utils";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType as BaseResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";

import { GENERATED_DIR, getApiDir } from "@/env/paths";
import type { GeneratorEntry } from "@/generated/generators/index";
import { GENERATORS_REGISTRY } from "@/generated/generators/index";

import type {
  GenerateAllRequestOutput,
  GenerateAllResponseOutput,
} from "./definition";
import { generate as generateGeneratorsIndex } from "./generator";
import { scopedTranslation } from "./i18n";

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

interface RunGeneratorsOptions {
  logger: EndpointLogger;
  force?: boolean;
  live?: LiveIndex;
  only?: ReadonlySet<string>;
  noCache?: boolean;
}

interface RunGeneratorsResult {
  ran: string[];
  skipped: string[];
  failed: { key: string; error: string }[];
  output: string[];
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
  static get REGISTRY(): readonly GeneratorEntry[] {
    return GENERATORS_REGISTRY;
  }

  private static resolve(opts: RunGeneratorsOptions): GeneratorEntry[] {
    return GENERATORS_REGISTRY.filter((g) => {
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
      if (isUnchanged(gen.cacheKey, inputs, genState)) {
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
    const generators = GeneratorRunner.resolve(opts);

    const ctx = await buildGeneratorContext({
      logger,
      force: opts.force ?? false,
      live: opts.live,
      need: {
        definitionModules: generators.some((g) => g.needs.definitionModules),
      },
    });

    const genState: GenState = opts.noCache || opts.force ? {} : readGenState();

    // Pre-step: generators index (not in registry — circular import).
    const generatorsIndexKey = "generators-index";
    const generatorsIndexInputs = findFilesRecursively(
      getApiDir(),
      "generator.ts",
    );
    const skipGeneratorsIndex =
      !opts.noCache &&
      !opts.force &&
      isUnchanged(generatorsIndexKey, generatorsIndexInputs, genState);

    const result: RunGeneratorsResult = {
      ran: [],
      skipped: [],
      failed: [],
      output: [],
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
        const indexResult = await generateGeneratorsIndex(ctx);
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
    locale: CountryLanguage,
  ): Promise<BaseResponseType<GenerateAllResponseOutput>> {
    try {
      const result = await GeneratorRunner.runGenerators({
        logger,
        force: data.force,
      });

      if (result.failed.length > 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: result.failed.map((f) => `${f.key}: ${f.error}`).join("; "),
          },
        });
      }

      return success({
        success: true,
        generationCompleted: true,
        output: result.output.join("\n"),
        generationStats: {
          totalGenerators: GeneratorRunner.REGISTRY.length,
          generatorsRun: result.ran.length,
          generatorsSkipped: result.skipped.length,
          outputDirectory: GENERATED_DIR,
          functionalGeneratorsCompleted: result.ran.length > 0,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage.message },
      });
    }
  }
}

/**
 * Bootstrap CLI entry: `bun repository.ts` regenerates everything from scratch.
 * Calls the orchestrator directly (no endpoint definition / no generated-file
 * imports beyond the generators index) so it works even when the CLI is broken.
 */
if (import.meta.main) {
  const logger = createEndpointLogger(false, "en-US");
  void GeneratorRunner.runGenerators({ logger }).then((r) => {
    logger.info(r.output.join("\n"));
    if (r.failed.length > 0) {
      logger.error(
        `Generation failed: ${r.failed.map((f) => f.key).join(", ")}`,
      );
    }
    return undefined;
  });
}
