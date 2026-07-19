import { join } from "node:path";

/**
 * Project-root-relative directory every generator writes into.
 *
 * A plain literal, composed with template literals at call sites
 * (`` `${GENERATED_DIR}/tasks/index.ts` ``), so path strings stay statically
 * analyzable — `vibe deps` and the gen-cache resolve them without evaluating
 * code. Runtime imports of generated modules must still be written out in full
 * (`@/generated/tasks/index`); the bundler only resolves literal specifiers.
 */
export const GENERATED_DIR = "src/generated";

/**
 * Project-root-relative Next.js App Router directory.
 *
 * Generated output like the rest, but it cannot move under `GENERATED_DIR` —
 * Next.js only looks for the App Router at `app/` or `src/app/`.
 */
export const NEXT_APP_DIR = "src/app";

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

/** Absolute path to the generated-output directory (`src/generated`). */
export function getGeneratedDir(): string {
  return join(process.cwd(), GENERATED_DIR);
}

/** Absolute path to the generated Next.js App Router directory (`src/app`). */
export function getNextAppDir(): string {
  return join(process.cwd(), NEXT_APP_DIR);
}
