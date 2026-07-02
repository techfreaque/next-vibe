/**
 * Generator Input File Discovery
 *
 * Centralises the mapping from generator key → input files.
 * Each generator already knows what files it scans; this module
 * mirrors that mapping so the hash-cache layer can fingerprint inputs
 * without duplicating discovery logic inside every repository.
 *
 * When a LiveIndex is provided (dev-watcher mode), the pre-built Sets
 * are used directly—no disk scan needed.
 */

import "server-only";

import { join } from "node:path";

import type { LiveIndex } from "./live-index";
import { findFilesRecursively } from "./utils";

// ---------------------------------------------------------------------------
// Generator key type
// ---------------------------------------------------------------------------

export type GeneratorKey =
  | "endpoints"
  | "client-routes"
  | "seeds"
  | "task-index"
  | "skills-index"
  | "skill-embeddings"
  | "email-templates"
  | "prompt-fragments"
  | "category-index"
  | "graph-seeds-index"
  | "env"
  | "agent-docs"
  | "remote-capabilities"
  | "cortex-templates"
  // Platform surface generators — emit re-export shells from page.tsx + route.ts.
  // Their inputs are page/route source ONLY; they never depend on src/generated,
  // so an unrelated generated change does not dirty them.
  | "tanstack-routes"
  | "native-indexes"
  | "next-app";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the sorted list of input file paths for a generator.
 *
 * Uses the LiveIndex when available (instant, no disk I/O).
 * Falls back to findFilesRecursively for generators whose files
 * are not yet tracked in the LiveIndex (category-index, graph-seeds-index,
 * env, agent-docs, cortex-templates).
 */
export function findGeneratorInputs(
  key: GeneratorKey,
  liveIndex?: LiveIndex,
): string[] {
  const cwd = process.cwd();
  const apiDir = join(cwd, "src", "app", "api", "[locale]");
  const apiRoot = join(cwd, "src", "app", "api");
  const configDir = join(cwd, "src", "config");

  switch (key) {
    case "endpoints":
      if (liveIndex) {
        return [
          ...liveIndex.definitionFiles,
          ...liveIndex.routeFiles,
        ].toSorted();
      }
      return [
        ...findFilesRecursively(apiDir, "definition.ts"),
        ...findFilesRecursively(apiDir, "route.ts"),
      ].toSorted();

    case "client-routes":
      if (liveIndex) {
        return [...liveIndex.clientRouteFiles].toSorted();
      }
      return findFilesRecursively(apiDir, "route-client.ts");

    case "seeds":
      if (liveIndex) {
        return [...liveIndex.seedFiles].toSorted();
      }
      return findFilesRecursively(apiDir, "seeds.ts");

    case "task-index":
      if (liveIndex) {
        return [
          ...liveIndex.taskFiles,
          ...liveIndex.taskRunnerFiles,
        ].toSorted();
      }
      return [
        ...findFilesRecursively(apiRoot, "task.ts"),
        ...findFilesRecursively(apiRoot, "task-runner.ts"),
      ].toSorted();

    case "skills-index":
    case "skill-embeddings":
      if (liveIndex) {
        return [...liveIndex.defaultSkillFiles].toSorted();
      }
      return findFilesRecursively(apiDir, "skill.ts");

    case "email-templates":
      if (liveIndex) {
        return [...liveIndex.emailFiles].toSorted();
      }
      // *.email.tsx — no wildcard support in findFilesRecursively; the
      // generators handle this by scanning all .tsx and filtering by name.
      // We include the base email.tsx scan which covers the primary input.
      return findFilesRecursively(apiDir, "email.tsx").toSorted();

    case "prompt-fragments":
      if (liveIndex) {
        return [...liveIndex.promptFragmentFiles].toSorted();
      }
      return findFilesRecursively(apiDir, "prompt.ts").filter((f) =>
        f.includes("/system-prompt/"),
      );

    // --- Generators not yet in LiveIndex (always scan disk) ---

    case "category-index":
      return findFilesRecursively(apiDir, "category.ts");

    case "graph-seeds-index":
      if (liveIndex) {
        return [...liveIndex.graphSeedFiles].toSorted();
      }
      return findFilesRecursively(apiDir, "graph-seeds.ts");

    case "env":
      return [
        ...findFilesRecursively(apiDir, "env.ts"),
        ...findFilesRecursively(configDir, "env.ts"),
        ...findFilesRecursively(apiDir, "env-client.ts"),
        ...findFilesRecursively(configDir, "env-client.ts"),
      ].toSorted();

    case "agent-docs":
      // Single source file; fingerprint it directly. Must match the runtime
      // import in vibe-coder/generator.ts — if this path is wrong, the file
      // never appears changed, so the gen-cache skips agent-docs forever and
      // CLAUDE.md/AGENTS.md only regenerate under --force.
      return [
        join(
          apiDir,
          "agent",
          "skills",
          "default-skills",
          "vibe-coder",
          "skill.ts",
        ),
      ];

    case "cortex-templates":
    case "remote-capabilities":
      // cortex-templates imports from a fixed module (no file scan).
      // remote-capabilities uses definition+route files — same as endpoints.
      if (liveIndex) {
        return [
          ...liveIndex.definitionFiles,
          ...liveIndex.routeFiles,
        ].toSorted();
      }
      return [
        ...findFilesRecursively(apiDir, "definition.ts"),
        ...findFilesRecursively(apiDir, "route.ts"),
      ].toSorted();

    // --- Platform surface generators: page.tsx + route.ts only ---
    // Deliberately NOT including src/generated/** — generated output is not an
    // input to these, so regenerating (e.g.) seeds must not dirty the route trees.
    case "tanstack-routes":
    case "native-indexes":
    case "next-app": {
      const uiDir = join(cwd, "src", "app", "[locale]");
      if (liveIndex) {
        return [
          ...liveIndex.routeFiles,
          ...findFilesRecursively(uiDir, "page.tsx"),
          ...findFilesRecursively(uiDir, "layout.tsx"),
        ].toSorted();
      }
      return [
        ...findFilesRecursively(apiDir, "route.ts"),
        ...findFilesRecursively(uiDir, "page.tsx"),
        ...findFilesRecursively(uiDir, "layout.tsx"),
      ].toSorted();
    }
  }
}
