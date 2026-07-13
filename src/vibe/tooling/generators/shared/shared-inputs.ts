/**
 * Shared generator context — the single object every domain-co-located generator
 * receives from the root orchestrator (repository.ts).
 *
 * The point of this file is the SHARED COMPUTATION contract: file lists are scanned
 * once and definition modules are parsed once (`computed.definitionModules`), then
 * handed to every generator. Generators never scan or import() definitions themselves
 * — that is what makes the parallel fan-out cheap (no N× re-read / re-parse).
 *
 * This lives at the generators/ endpoint root as a plain sibling module. Old
 * per-folder generators are untouched until cutover; new generators import from here.
 */

import "server-only";

import type { ApiSection } from "next-vibe/core/definition/endpoint-base";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { LiveIndex } from "next-vibe/tooling/generators/shared/live-index";
import { findFilesRecursively } from "next-vibe/tooling/generators/shared/utils";

import { getApiDir } from "@/env/paths";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A parsed definition's default export. Intentionally wide — consumers narrow to
 * the method sub-objects / aliases / scopedTranslation / fields they need. Null when
 * the import failed (logged, skipped downstream).
 */
type DefinitionDefault = ApiSection | null;

/** File lists, scanned once. Empty arrays when a category has no files. */
interface GeneratorFileLists {
  definition: string[];
  route: string[];
  routeClient: string[];
  task: string[];
  taskRunner: string[];
  seed: string[];
  skill: string[];
  email: string[];
  promptFragment: string[];
  category: string[];
  graphSeed: string[];
}

/** Computed-once artifacts. The heart of the shared-computation contract. */
interface GeneratorComputed {
  /** Each definition.ts imported once: absolute POSIX path → parsed `.default`. */
  definitionModules: Map<string, DefinitionDefault>;
}

/** The context passed to every generator function. */
export interface GeneratorContext {
  logger: EndpointLogger;
  files: GeneratorFileLists;
  computed: GeneratorComputed;
  /** When true, ignore gen-cache and regenerate unconditionally. */
  force: boolean;
}

/** Minimal result a generator reports back to the orchestrator. */
export interface GeneratorResult {
  /** One-liner for the aggregated `vibe gen` output, e.g. "task index (42 tasks)". */
  summary: string;
  /** Optional structured counts. */
  counts?: Record<string, number>;
  /**
   * Set to a message when the generator hard-failed (e.g. a fail-closed security
   * gate). The orchestrator surfaces this as a failed generator without needing the
   * generator to `throw`.
   */
  failed?: string;
}

// ---------------------------------------------------------------------------
// TDZ-guarded shared parse
// ---------------------------------------------------------------------------

/**
 * Import a module once, retrying past Bun's TDZ race
 * ("Cannot access 'X' before initialization"). Because the shared parse imports each
 * definition exactly once, guarding this single import removes the concurrent-import
 * race that previously forced the endpoint generators to run sequentially.
 */
interface DefinitionModuleShape {
  default?: ApiSection;
}

const yieldMacrotask = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 10);
  });

const readDefault = (mod: DefinitionModuleShape): DefinitionDefault =>
  mod.default ?? null;

async function importDefaultWithRetry(
  absPath: string,
): Promise<DefinitionDefault> {
  const load = async (): Promise<DefinitionModuleShape> =>
    (await import(absPath)) as DefinitionModuleShape;

  try {
    const mod = await load();
    try {
      return readDefault(mod);
    } catch {
      await yieldMacrotask();
      return readDefault(mod);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("before initialization")) {
      return null;
    }
    await yieldMacrotask();
    try {
      return readDefault(await load());
    } catch {
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// File-list scanning (LiveIndex fast-path, disk fallback)
// ---------------------------------------------------------------------------

function scanFileLists(
  apiDir: string,
  apiRoot: string,
  live?: LiveIndex,
): GeneratorFileLists {
  const fromLive = (
    set: Set<string> | undefined,
    dir: string,
    name: string,
  ): string[] => (set ? [...set] : findFilesRecursively(dir, name));

  return {
    definition: fromLive(live?.definitionFiles, apiDir, "definition.ts"),
    route: fromLive(live?.routeFiles, apiDir, "route.ts"),
    routeClient: fromLive(live?.clientRouteFiles, apiDir, "route-client.ts"),
    task: fromLive(live?.taskFiles, apiRoot, "task.ts"),
    taskRunner: fromLive(live?.taskRunnerFiles, apiRoot, "task-runner.ts"),
    seed: fromLive(live?.seedFiles, apiDir, "seeds.ts"),
    skill: fromLive(live?.defaultSkillFiles, apiDir, "skill.ts"),
    email: live?.emailFiles
      ? [...live.emailFiles]
      : // Match LiveIndex composition: email.tsx + *.email.tsx (excluding /email.tsx dup).
        [
          ...findFilesRecursively(apiDir, "email.tsx"),
          ...findFilesRecursively(apiDir, ".email.tsx").filter(
            (f) => !f.endsWith("/email.tsx"),
          ),
        ],
    promptFragment: live?.promptFragmentFiles
      ? [...live.promptFragmentFiles]
      : findFilesRecursively(apiDir, "system-prompt.ts"),
    category: fromLive(live?.categoryFiles, apiDir, "category.ts"),
    graphSeed: fromLive(live?.graphSeedFiles, apiRoot, "graph-seeds.ts"),
  };
}

// ---------------------------------------------------------------------------
// Context builder — called ONCE by the orchestrator
// ---------------------------------------------------------------------------

interface BuildContextOptions {
  logger: EndpointLogger;
  force: boolean;
  /** Warm index from the dev watcher; disk scan when absent. */
  live?: LiveIndex;
  /**
   * Which computed artifacts to eagerly build. `definitionModules` is parsed only
   * when requested (the endpoint generators need it; a task-only dirty run does not).
   */
  need?: { definitionModules?: boolean };
}

/**
 * Build the shared context. Scans file lists always; parses definition modules once
 * when needed. `definitionSource` starts empty and is filled on demand via
 * `readDefinitionSource`.
 */
export async function buildGeneratorContext(
  opts: BuildContextOptions,
): Promise<GeneratorContext> {
  const apiDir = getApiDir();

  const files = scanFileLists(apiDir, apiDir, opts.live);

  const definitionModules = new Map<string, DefinitionDefault>();
  if (opts.need?.definitionModules) {
    const entries = await Promise.all(
      files.definition.map(
        async (path): Promise<[string, DefinitionDefault]> => [
          path,
          await importDefaultWithRetry(path),
        ],
      ),
    );
    for (const [path, def] of entries) {
      definitionModules.set(path, def);
    }
  }

  return {
    logger: opts.logger,
    files,
    computed: {
      definitionModules,
    },
    force: opts.force,
  };
}
