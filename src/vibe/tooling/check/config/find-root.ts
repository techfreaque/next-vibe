/**
 * Locate the directory that owns check.config.ts.
 *
 * Dependency-free on purpose: the oxlint JS plugins bundle this file.
 */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * A directory holding any of these is a standalone project root. The upward
 * search stops there, so a project nested inside another repository (e.g. the
 * checker's own test-project) never picks up, or overwrites, the outer repo's
 * check.config.ts. Monorepo apps have no lockfile of their own, so they still
 * resolve to the workspace root's config.
 */
const PROJECT_BOUNDARY_MARKERS = [
  "bun.lock",
  "bun.lockb",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".git",
] as const;

/**
 * Walk upward from `startDir` looking for a check config file. Returns the
 * directory containing it, or undefined when none exists within the current
 * project boundary.
 */
export function findCheckConfigRoot(
  startDir: string,
  configFileNames: readonly string[] = ["check.config.ts"],
): string | undefined {
  let dir = resolve(startDir);
  for (let i = 0; i < 10; i++) {
    if (configFileNames.some((name) => existsSync(resolve(dir, name)))) {
      return dir;
    }
    if (
      PROJECT_BOUNDARY_MARKERS.some((marker) =>
        existsSync(resolve(dir, marker)),
      )
    ) {
      return undefined;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
  return undefined;
}
