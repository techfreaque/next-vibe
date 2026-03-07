/**
 * Package Manifest Types
 *
 * Defines the shape of package.ts files — the source-of-truth for standalone
 * distributable packages built from the next-vibe monorepo.
 *
 * Each package.ts lives colocated with its feature folder and declares:
 *  - Which endpoints are in the public surface (CLI + MCP)
 *  - Which repository modules become library exports
 *  - Which platforms the package supports
 *  - npm publishing metadata
 */

/** Platforms a package can expose */
export type PackagePlatform = "cli" | "mcp";

/** Library export map: subpath → source file (relative to project root) */
export type PackageExports = Record<string, string>;

/**
 * PackageManifest — the typed config format for distributable packages.
 *
 * Colocate a `package.ts` file in the feature folder to declare a package.
 * The builder reads this to generate scoped endpoint registries and produce
 * a standalone npm-publishable artifact.
 */
export interface PackageManifest {
  /**
   * npm package name, e.g. "@next-vibe/checker"
   */
  name: string;

  /**
   * Package description for package.json
   */
  description: string;

  /**
   * Version strategy.
   * - "source" — inherit version from root package.json at build time
   * - Any semver string — pin this package to that version independently
   */
  version: "source" | string;

  /**
   * Endpoints included in the package's public surface (CLI + MCP).
   * Use the alias constant from the endpoint's constants.ts (e.g. TOOL_HELP_ALIAS).
   * Fall back to the canonical tool name (e.g. "system_check_vibe-check_POST")
   * only when no alias exists.
   *
   * The help endpoint is auto-injected via TOOL_HELP_ALIAS and does not need
   * to be listed here.
   *
   * Example:
   *   import { VIBE_CHECK_ALIAS } from ".../check/vibe-check/constants";
   *   import { CHECK_CONFIG_CREATE_ALIAS } from ".../check/config/create/constants";
   *
   *   endpoints: [VIBE_CHECK_ALIAS, CHECK_CONFIG_CREATE_ALIAS]
   */
  endpoints: string[];

  /**
   * Default endpoint invoked when the binary is called with no command.
   * Must be one of the entries in `endpoints` (alias or tool name).
   * If omitted, bare invocation shows the scoped help/command list.
   *
   * Example: VIBE_CHECK_ALIAS
   */
  defaultEndpoint?: string;

  /**
   * Library exports — repository modules that become importable from the package.
   * Keys are npm subpath exports (e.g. "." or "./lint").
   * Values are source file paths relative to project root.
   *
   * Example:
   *   exports: {
   *     ".":       "src/app/api/[locale]/system/check/vibe-check/repository.ts",
   *     "./lint":  "src/app/api/[locale]/system/check/lint/repository.ts",
   *   }
   */
  exports?: PackageExports;

  /**
   * Platforms this package supports when distributed standalone.
   * Defaults to ["cli", "mcp"] if omitted.
   */
  platforms?: PackagePlatform[];

  /**
   * CLI binary name installed by npm.
   * Defaults to the last segment of `name` with @ scope stripped.
   *
   * Example: "vibe-check" → installed as `vibe-check` command
   */
  bin?: string;

  /**
   * npm publishing configuration
   */
  publish?: {
    registry?: string;
    access?: "public" | "restricted";
    keywords?: string[];
    repository?: string | { type: string; url: string };
    license?: string;
  };

  /**
   * Additional npm peer dependencies (beyond what builder infers)
   */
  peerDependencies?: Record<string, string>;

  /**
   * Additional npm dependencies to include in the published package.json
   */
  dependencies?: Record<string, string>;
}
