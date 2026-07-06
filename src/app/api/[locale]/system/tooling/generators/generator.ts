/**
 * Generators domain generator — the orchestrator (registry + run).
 *
 * ONE entry per domain generator, with per-generator enable/opt-out. Builds the
 * shared context once, runs the def-scan group sequentially (Bun TDZ), everything
 * else in parallel, with gen-cache skipping. Imported by this domain's repository.ts
 * (the `vibe gen` endpoint) and by the dev-watcher.
 *
 * Bootstrap-safe: this module and everything it imports depend ONLY on source (never
 * on `src/generated/*`), so `bun repository.ts` regenerates from scratch even when no
 * generated files exist yet.
 */

import "server-only";

import { generate as generateEndpointFramework } from "next-vibe/core/definition/generator/generator";
import { parseError } from "next-vibe/core/utils/parse-error";
import { generate as generateSeeds } from "next-vibe/database/seed/generator";
import { generate as generateDataflow } from "next-vibe/dataflow/generator";
import { generate as generateEnv } from "next-vibe/env/generator/generator";
import type { EndpointLogger } from "next-vibe/logger/types";
import { generate as generateNextApp } from "next-vibe/platforms/next-app/generator";
import { generate as generateNativeIndexes } from "next-vibe/platforms/react-native/generator";
import { generate as generateTanstackRoutes } from "next-vibe/platforms/tanstack-start/generator";
import { generate as generateTasks } from "next-vibe/tasks/generator";
import {
  findGeneratorInputs,
  type GeneratorKey,
} from "next-vibe/tooling/generators/shared/find-generator-inputs";
import {
  type GenState,
  isUnchanged,
  markDone,
  readGenState,
  writeGenState,
} from "next-vibe/tooling/generators/shared/gen-cache";
import type { LiveIndex } from "next-vibe/tooling/generators/shared/live-index";
import {
  buildGeneratorContext,
  type GeneratorContext,
  type GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";

import { generate as generateAiStreamEnums } from "@/app/api/[locale]/agent/ai-stream/model-enums-generator/generator";
import { generate as generatePromptFragments } from "@/app/api/[locale]/agent/ai-stream/system-prompt/generator";
import { generate as generateCortex } from "@/app/api/[locale]/agent/cortex/seeds/generator";
import { generate as generateAgentDocs } from "@/app/api/[locale]/agent/skills/default-skills/vibe-coder/generator";
import { generate as generateSkills } from "@/app/api/[locale]/agent/skills/generator";
import { generate as generateEmail } from "@/app/api/[locale]/messenger/registry/generator";
import { generate as generateRemoteCapabilities } from "@/app/api/[locale]/remote-connection/generator";

// ───────────────────────────────────────────────────────────────────────────
// Registry: one entry per domain generator (enable/opt-out here)
// ───────────────────────────────────────────────────────────────────────────

type GeneratorPhase = "def-scan" | "default";

interface GeneratorEntry {
  key: string;
  run: (ctx: GeneratorContext) => Promise<GeneratorResult>;
  phase: GeneratorPhase;
  needs: { definitionModules?: boolean };
  /** gen-cache fingerprint key, or null to never cache. */
  cacheKey: GeneratorKey | null;
  /** Primary output (relative to cwd) — used for gen-cache staleness. */
  output: string;
  enabled: boolean;
}

interface RunGeneratorsOptions {
  logger: EndpointLogger;
  force?: boolean;
  live?: LiveIndex;
  only?: ReadonlySet<string>;
  overrides?: Partial<Record<string, boolean>>;
  noCache?: boolean;
}

interface RunGeneratorsResult {
  ran: string[];
  skipped: string[];
  failed: { key: string; error: string }[];
  output: string[];
}

type RunOutcome =
  | { status: "ran"; summary: string; cacheKey: GeneratorKey | null }
  | { status: "skipped" }
  | { status: "failed"; error: string };

/**
 * The generators orchestrator — a single static class owning the registry and the
 * run logic. `runGenerators` / `REGISTRY` are exposed as static members.
 */
export class GeneratorRunner {
  static readonly REGISTRY: readonly GeneratorEntry[] = [
    // def-scan (sequential): everything derived from endpoint definitions.
    {
      key: "endpoint-framework",
      run: generateEndpointFramework,
      phase: "def-scan",
      needs: { definitionModules: true },
      cacheKey: "endpoints",
      output: "src/generated/endpoints/endpoint.ts",
      enabled: true,
    },
    // default (parallel).
    {
      key: "remote-capabilities",
      run: generateRemoteCapabilities,
      phase: "default",
      needs: {},
      cacheKey: "endpoints",
      output: "src/generated/remote-capabilities/en/public.json",
      enabled: true,
    },
    {
      key: "seeds",
      run: generateSeeds,
      phase: "default",
      needs: {},
      cacheKey: "seeds",
      output: "src/generated/seeds/index.ts",
      enabled: true,
    },
    {
      key: "tasks",
      run: generateTasks,
      phase: "default",
      needs: {},
      cacheKey: "task-index",
      output: "src/generated/tasks/index.ts",
      enabled: true,
    },
    {
      key: "skills",
      run: generateSkills,
      phase: "default",
      needs: {},
      cacheKey: "skills-index",
      output: "src/generated/skills/index.ts",
      enabled: true,
    },
    {
      key: "prompt-fragments",
      run: generatePromptFragments,
      phase: "default",
      needs: {},
      cacheKey: "prompt-fragments",
      output: "src/generated/prompt-fragments/index.ts",
      enabled: true,
    },
    {
      key: "email",
      run: generateEmail,
      phase: "default",
      needs: {},
      cacheKey: "email-templates",
      output: "src/generated/email/index.ts",
      enabled: true,
    },
    {
      key: "env",
      run: generateEnv,
      phase: "default",
      needs: {},
      cacheKey: "env",
      output: "src/generated/env/index.ts",
      enabled: true,
    },
    {
      key: "agent-docs",
      run: generateAgentDocs,
      phase: "default",
      needs: {},
      cacheKey: "agent-docs",
      output: "CLAUDE.md",
      enabled: true,
    },
    {
      key: "dataflow",
      run: generateDataflow,
      phase: "default",
      needs: {},
      cacheKey: "graph-seeds-index",
      output: "src/generated/dataflow/graph-seeds-index.ts",
      enabled: true,
    },
    {
      key: "cortex",
      run: generateCortex,
      phase: "default",
      needs: {},
      cacheKey: null,
      output: "src/generated/skills/index.ts",
      enabled: true,
    },
    {
      key: "ai-stream-enums",
      run: generateAiStreamEnums,
      phase: "default",
      needs: {},
      cacheKey: null,
      output: "src/app/api/[locale]/agent/ai-stream/vision-models.generated.ts",
      enabled: true,
    },
    {
      key: "tanstack-routes",
      run: generateTanstackRoutes,
      phase: "default",
      needs: {},
      cacheKey: "tanstack-routes",
      output: "src/generated/app-tanstack/routes",
      enabled: true,
    },
    {
      key: "next-app",
      run: generateNextApp,
      phase: "default",
      needs: {},
      cacheKey: "next-app",
      output: "src/generated/app",
      enabled: true,
    },
    {
      key: "native-indexes",
      run: generateNativeIndexes,
      phase: "default",
      needs: {},
      cacheKey: "native-indexes",
      output: "src/generated/app-native",
      enabled: true,
    },
  ] as const;

  /** Resolve which generators to run given the options (opt-out + only-set). */
  private static resolve(opts: RunGeneratorsOptions): GeneratorEntry[] {
    return GeneratorRunner.REGISTRY.filter((g) => {
      if (opts.only && !opts.only.has(g.key)) {
        return false;
      }
      return opts.overrides?.[g.key] ?? g.enabled;
    });
  }

  /** Run one generator, applying gen-cache skip. */
  private static async runOne(
    gen: GeneratorEntry,
    ctx: GeneratorContext,
    genState: GenState,
    opts: RunGeneratorsOptions,
  ): Promise<RunOutcome> {
    if (!opts.noCache && !opts.force && gen.cacheKey) {
      const inputs = findGeneratorInputs(gen.cacheKey, opts.live);
      if (isUnchanged(gen.cacheKey, inputs, gen.output, genState)) {
        return { status: "skipped" };
      }
    }

    try {
      const result = await gen.run(ctx);
      if (result.failed) {
        return { status: "failed", error: result.failed };
      }
      return { status: "ran", summary: result.summary, cacheKey: gen.cacheKey };
    } catch (error) {
      return { status: "failed", error: parseError(error).message };
    }
  }

  /**
   * Orchestrate a generation run. def-scan sequential, default parallel. Called by
   * the endpoint (repository.ts) and the dev-watcher.
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
    const result: RunGeneratorsResult = {
      ran: [],
      skipped: [],
      failed: [],
      output: [],
    };
    const recordedCacheKeys = new Set<GeneratorKey>();

    const record = (key: string, outcome: RunOutcome): void => {
      if (outcome.status === "ran") {
        result.ran.push(key);
        result.output.push(`✅ ${key}: ${outcome.summary}`);
        if (outcome.cacheKey) {
          recordedCacheKeys.add(outcome.cacheKey);
        }
      } else if (outcome.status === "skipped") {
        result.skipped.push(key);
        result.output.push(`⏭️  ${key}: unchanged`);
      } else {
        result.failed.push({ key, error: outcome.error });
        result.output.push(`❌ ${key}: ${outcome.error}`);
        logger.error(`Generator ${key} failed: ${outcome.error}`);
      }
    };

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
    parallelGens.forEach((gen, i) => record(gen.key, outcomes[i]));

    if (!opts.noCache && !opts.force) {
      for (const cacheKey of recordedCacheKeys) {
        markDone(cacheKey, findGeneratorInputs(cacheKey, opts.live), genState);
      }
      writeGenState(genState);
    }

    return result;
  }
}
