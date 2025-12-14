/**
 * Builder Constants
 * Shared constants for the builder system
 */

import { resolve } from "node:path";

import type { BuildProfile, ProfileSettings } from "./types";

// ============================================================================
// Path Constants
// ============================================================================

/** Root directory for all path resolutions */
export const ROOT_DIR = resolve(process.cwd());

/** Cache file location */
export const CACHE_FILE = resolve(ROOT_DIR, ".build-cache.json");

/** Current cache version */
export const CACHE_VERSION = "1.0";

// ============================================================================
// Size Thresholds
// ============================================================================

/** Bundle size thresholds for warnings (in bytes) */
export const SIZE_THRESHOLDS = {
  /** 5MB - show warning */
  WARNING: 5 * 1024 * 1024,
  /** 15MB - show critical warning */
  CRITICAL: 15 * 1024 * 1024,
} as const;

// ============================================================================
// Default Externals
// ============================================================================

/** Default external modules that cannot be bundled (native/binary dependencies) */
export const DEFAULT_CLI_EXTERNALS = [
  // Native crypto
  "argon2",
  // Database drivers
  "pg-native",
  "better-sqlite3",
  // Graphics
  "canvas",
  // CSS processing
  "lightningcss",
  // OXC native bindings (all platforms)
  "@oxc-project/oxc-darwin-arm64",
  "@oxc-project/oxc-darwin-x64",
  "@oxc-project/oxc-linux-arm64-gnu",
  "@oxc-project/oxc-linux-arm64-musl",
  "@oxc-project/oxc-linux-x64-gnu",
  "@oxc-project/oxc-linux-x64-musl",
  "@oxc-project/oxc-win32-arm64-msvc",
  "@oxc-project/oxc-win32-x64-msvc",
  "@oxc-parser/napi",
  "@oxc-parser/napi-darwin-arm64",
  "@oxc-parser/napi-darwin-x64",
  "@oxc-parser/napi-linux-arm64-gnu",
  "@oxc-parser/napi-linux-arm64-musl",
  "@oxc-parser/napi-linux-x64-gnu",
  "@oxc-parser/napi-linux-x64-musl",
  "@oxc-parser/napi-win32-arm64-msvc",
  "@oxc-parser/napi-win32-x64-msvc",
] as const;

// ============================================================================
// Profile Defaults
// ============================================================================

/** Default settings per profile */
export const PROFILE_DEFAULTS: Record<BuildProfile, ProfileSettings> = {
  development: {
    minify: false,
    sourcemap: "external",
    treeShaking: false,
    analyze: false,
  },
  production: {
    minify: true,
    sourcemap: false,
    treeShaking: true,
    analyze: true,
  },
};

// ============================================================================
// Messages
// ============================================================================

/** Builder messages */
export const MESSAGES = {
  BUILD_START: "Starting build...",
  BUILD_COMPLETE: "Build completed successfully",
  BUILD_FAILED: "Build failed",
  DRY_RUN_MODE: "Running in dry-run mode (no files will be modified)",
  LOADING_CONFIG: "Loading configuration",
  USING_INLINE_CONFIG: "Using inline configuration",
  CLEANING_FOLDERS: "Cleaning output folders",
  COMPILING_FILES: "Compiling files",
  BUNDLING_CLI: "Bundling CLI",
  COPYING_FILES: "Copying additional files",
  CREATING_PACKAGE_JSON: "Creating package.json",
  GENERATING_REPORT: "Generating build report",
  BUNDLE_ANALYSIS: "Bundle Analysis",
  OPTIMIZATION_TIPS: "Optimization Tips",
  BUILD_SUMMARY: "Build Summary",
  RUNNING_PRE_BUILD: "Running pre-build hook",
  RUNNING_POST_BUILD: "Running post-build hook",
  PARALLEL_COMPILING: "Parallel compilation",
  PARALLEL_COMPLETE: "Parallel compilation complete",
  BUNDLE_SUCCESS: "Bundle created successfully",
  BUNDLE_FAILED: "Bundle creation failed",
  CACHE_STATS: "Cache statistics",
  REPORT_GENERATED: "Build report generated",
  SUGGESTIONS: "Suggestions",
  TOTAL_DURATION: "Total duration",
  FILES_BUILT: "Files built",
  FILES_COPIED: "Files copied",
  STEPS_COMPLETED: "Steps completed",
} as const;
