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

import type { ApiSection } from "../../definition/endpoint-base";
import { findFilesRecursively, toImportUrl } from "./utils";
import type { EndpointLogger } from "../../../logger/types";

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

/**
 * The warm file index `findInputs` MAY consume — the optional fast path.
 *
 * A dev watcher can maintain this index so generators resolve their inputs from
 * memory instead of re-walking the tree. It is optional by construction: a build
 * that ships no watcher simply never passes one, and every `findInputs` falls
 * back to a disk scan.
 *
 * Declared structurally here rather than imported from the watcher module on
 * purpose — that keeps `GeneratorDefinition` a SINGLE shape across trees. A fork
 * with no watcher can drop live-index.ts entirely and this module still
 * compiles, because nothing in the generator contract depends on it.
 *
 * The watcher's own `LiveIndex` satisfies this by construction; it carries extra
 * state (dirty flags, method cache) that input resolution has no business
 * reading, which is exactly why this narrower shape exists.
 */
export interface GeneratorInputIndex {
  definitionFiles: ReadonlySet<string>;
  routeFiles: ReadonlySet<string>;
  clientRouteFiles: ReadonlySet<string>;
  taskFiles: ReadonlySet<string>;
  taskRunnerFiles: ReadonlySet<string>;
  seedFiles: ReadonlySet<string>;
  emailFiles: ReadonlySet<string>;
  graphSeedFiles: ReadonlySet<string>;
  promptFragmentFiles: ReadonlySet<string>;
  defaultSkillFiles: ReadonlySet<string>;
  categoryFiles: ReadonlySet<string>;
}

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

/** The contract every domain generator.ts exports as a single `generator` const. */
export interface GeneratorDefinition {
  key: string;
  phase: "def-scan" | "default";
  needs: { definitionModules?: boolean };
  cacheKey: string | null;
  /**
   * Return the input files whose changes should invalidate the gen-cache.
   *
   * The {@link GeneratorInputIndex} argument is an OPTIONAL fast path: when a
   * watcher supplies a warm index, read the pre-built sets; otherwise scan disk.
   * An implementation that ignores it entirely — `findInputs()` with no
   * parameter — satisfies this signature, so a build with no watcher needs no
   * change to this contract.
   */
  findInputs: (live?: GeneratorInputIndex) => string[];
  /**
   * Output artefact(s), project-root relative — the gen-cache existence check.
   * Deleting any listed file forces a re-run even when the input fingerprint is
   * unchanged; without it a deleted output stays gone until someone runs --force.
   *
   * Optional because a generator that writes a whole directory tree (route
   * shells, native indexes) has no single file whose absence proves the work is
   * undone. Those omit it and keep the inputs-only behaviour.
   */
  output?: string | readonly string[];
  generate: (ctx: GeneratorContext) => Promise<GeneratorResult>;
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
    (await import(toImportUrl(absPath))) as DefinitionModuleShape;

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
  live?: GeneratorInputIndex,
): GeneratorFileLists {
  const fromLive = (
    set: ReadonlySet<string> | undefined,
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
  live?: GeneratorInputIndex;
  /**
   * Which computed artifacts to eagerly build. `definitionModules` is parsed only
   * when requested (the endpoint generators need it; a task-only dirty run does not).
   */
  need?: { definitionModules?: boolean };
  /** Override the API directory; defaults to `getApiDir()`. */
  apiDir?: string;
}

/**
 * Build the shared context. Scans file lists always; parses definition modules once
 * when needed. `definitionSource` starts empty and is filled on demand via
 * `readDefinitionSource`.
 */
export async function buildGeneratorContext(
  opts: BuildContextOptions,
): Promise<GeneratorContext> {
  const apiDir = opts.apiDir ?? getApiDir();

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
