import { join } from "node:path";

/** Absolute path to the project's `src/` directory. */
export function getSrcDir(): string {
  return join(process.cwd(), "src");
}

/**
 * Base directory for all API routes and domain modules.
 * Domain-driven flat structure: src/<domain>/route.ts
 */
export function getApiDir(): string {
  return getSrcDir();
}

/**
 * Base directory for UI pages/layouts.
 * Used by tanstack-start, next-app, and native generators.
 */
export function getUiDir(): string {
  return join(process.cwd(), "src", "_pages");
}
