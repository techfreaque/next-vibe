/**
 * Builder Constants
 * Shared constants for the builder system
 */

import { resolve } from "node:path";

import type { BuildProfile, SourcemapMode } from "../definition";

// ============================================================================
// Path Constants
// ============================================================================

/** Root directory for all path resolutions */
export const ROOT_DIR = resolve(process.cwd());

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
// Profile Defaults
// ============================================================================

/** Default settings per profile (type inlined - no separate types.ts needed) */
export const PROFILE_DEFAULTS: Record<
  BuildProfile,
  {
    minify: boolean;
    sourcemap: boolean | SourcemapMode;
    treeShaking: boolean;
    analyze: boolean;
  }
> = {
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
  REPORT_GENERATED: "Build report generated",
  SUGGESTIONS: "Suggestions",
  TOTAL_DURATION: "Total duration",
  FILES_BUILT: "Files built",
  FILES_COPIED: "Files copied",
  STEPS_COMPLETED: "Steps completed",
} as const;
