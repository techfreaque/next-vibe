import { join, relative } from "node:path";

/**
 * The directory the user actually invoked from.
 *
 * Captured at module load, which is the only moment it exists: the CLI runtime
 * calls `process.chdir(envProjectRoot)` (run-cli.ts) so every later reader of
 * `process.cwd()` sees the project root instead. That chdir is deliberate - the
 * framework treats relative paths as project-root relative - but it also erases
 * "where the user was standing", which is the sensible default for a command
 * given no path at all.
 *
 * Only for defaults. An explicit path argument stays project-root relative;
 * resolving those against this would be the inconsistency the chdir prevents.
 */
const INVOCATION_DIR = process.cwd();

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

/**
 * Project-root-relative directory holding the framework itself.
 *
 * POSIX-normalized and always without a trailing slash, so it composes both as a
 * prefix test (`` `${VIBE_DIR}/` ``) and as a path segment. Callers that need it
 * absolute use {@link getVibeDir}; callers matching against discovered file
 * paths must POSIX-normalize their side first (`toPosixPath`) — on Windows
 * `node:path` emits backslashes and a prefix test against this silently never
 * matches.
 *
 * A constant rather than a literal because consuming repos vendor the framework
 * elsewhere — pcv_application carries it at `tools/pcvibe` with no root `src/`
 * at all. Every "is this framework code?" decision has to move with it.
 */
export const VIBE_DIR = "src/vibe";

/**
 * Import alias that resolves to {@link VIBE_DIR}, matching the tsconfig `paths`
 * entry (`"next-vibe/*": ["./src/vibe/*"]`). Vendored copies rename both
 * together — pcv_application maps `pcvibe/*` at `tools/pcvibe/*`.
 */
export const VIBE_IMPORT_ALIAS = "next-vibe";

/**
 * Directories no generator may scan. THE ONE LIST — there is no second one.
 *
 * `generated` is the only entry this layout needs. The scan root is `src/`, and
 * `src/generated` sits inside it, so without this a generator would scan its own
 * output and feed itself. `node_modules`, `.git`, `.tmp`, `dist` and the rest
 * cannot occur under `src/` at all — listing them here would be cargo, not
 * defence.
 *
 * Vendored copies override this file and add whatever their layout exposes:
 * pcv_application scans from the project ROOT, so scratch trees are reachable
 * there and it lists them. That is exactly why this lives beside the layout
 * anchors instead of in the generator utilities — the list is a fact about the
 * layout, and the layout is what forks.
 */
export const PROJECT_IGNORE_DIRS: readonly string[] = ["generated"];

/** Absolute path to the project's `src/` directory. */
export function getSrcDir(): string {
  return join(process.cwd(), "src");
}

/**
 * Absolute path to the PROJECT ROOT — the anchor every emitted module specifier
 * is made relative to.
 *
 * Distinct from {@link getSrcDir} and not interchangeable with it. Here the root
 * is cwd (the CLI runtime chdir's to it on startup) while `getSrcDir()` is
 * `<root>/src`; a vendored copy with no root `src/` makes them equal. Generators
 * that relativize against the wrong one silently drop the leading directory that
 * the alias branches below match on, and every specifier falls through to a
 * relative path.
 */
export function getProjectRoot(): string {
  return process.cwd();
}

/**
 * The app-level import alias, and the project-root-relative directory it maps to.
 *
 * Generated files import app code through `@/...` here, which the tsconfig
 * `paths` entry resolves to `src/*`. Emitters read the pair from this constant
 * rather than hardcoding either half, so the branch is written once and a repo
 * that has no such alias switches it off by setting this to `null` — which is
 * exactly what pcv_application does, having no root `src/` and no `@/` mapping.
 */
export interface AppImportRoot {
  /** Project-root-relative directory the alias resolves to, no trailing slash. */
  readonly dir: string;
  /** Alias prefix, no trailing slash. */
  readonly alias: string;
}

export const APP_IMPORT_ROOT: AppImportRoot | null = {
  dir: "src",
  alias: "@",
};

/**
 * Path segment that marks where a route's own segments begin.
 *
 * `extractNestedPath` slices everything between this anchor and the target file.
 * Here that is the Next.js locale directory; a repo whose definitions are not
 * under a locale segment names its own anchor (pcv_application uses `src`). When
 * the anchor is absent from a path, resolution falls back to the last segment of
 * the configured scan root ({@link getApiDir}), which works in both layouts.
 */
export const ROUTE_ANCHOR_SEGMENT = "[locale]";

/**
 * Where the CLI was invoked from, as a project-root-relative path
 * ("src/companies", or "." at the root). Outside the project, returns ".".
 *
 * Lets `vibe check` with no path default to where the user is standing instead
 * of the whole repo - after the runtime's chdir, cwd is always the root, so an
 * omitted path silently meant "everything".
 */
export function getInvocationDir(): string {
  const rel = relative(process.cwd(), INVOCATION_DIR).replaceAll("\\", "/");
  // Empty means it IS the root; a leading ".." means outside it entirely, where
  // the whole project is the only defensible default.
  if (!rel || rel.startsWith("..")) {
    return ".";
  }
  return rel;
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

/**
 * Project-root-relative directory holding the ROOT layout (`layout.tsx`), the
 * shell every route renders inside.
 *
 * Exists so `generated/app-tanstack/routes/__root.tsx` can be identical across
 * trees: the builder maps the `@root-layout` alias onto this directory, and the
 * root route imports `@root-layout/layout` rather than hardcoding a location
 * that only makes sense in one layout.
 */
export const ROOT_LAYOUT_DIR = "src/_pages" as const;

/** Absolute path to the generated-output directory (`src/generated`). */
export function getGeneratedDir(): string {
  return join(process.cwd(), GENERATED_DIR);
}

/** Absolute path to the generated Next.js App Router directory (`src/app`). */
export function getNextAppDir(): string {
  return join(process.cwd(), NEXT_APP_DIR);
}

/** Absolute path to the framework directory (`src/vibe`). */
export function getVibeDir(): string {
  return join(process.cwd(), VIBE_DIR);
}
