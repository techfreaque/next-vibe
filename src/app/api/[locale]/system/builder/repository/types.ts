/**
 * Builder Type Definitions
 * All types used by the builder system
 */

import type { OutputOptions, RollupOptions } from "rollup";
import type { BuildOptions, InlineConfig, PluginOption } from "vite";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

// ============================================================================
// Build Profile Types
// ============================================================================

/** Build profile for different environments */
export type BuildProfile = "development" | "production";

/** Profile-specific settings */
export interface ProfileSettings {
  /** Enable minification */
  minify: boolean;
  /** Generate sourcemaps */
  sourcemap: boolean | "external" | "inline" | "none";
  /** Enable tree shaking optimizations */
  treeShaking: boolean;
  /** Enable bundle analysis */
  analyze: boolean;
}

// ============================================================================
// Hook Types
// ============================================================================

/** Hook function signature */
export type BuildHook = (context: BuildHookContext) => Promise<void> | void;

/** Context passed to build hooks */
export interface BuildHookContext {
  /** Build configuration */
  config: BuildConfig;
  /** Current build profile */
  profile: BuildProfile;
  /** Output directory */
  outputDir: string;
  /** Logger instance */
  logger: EndpointLogger;
  /** Add output message */
  addOutput: (message: string) => void;
}

// ============================================================================
// Configuration Types
// ============================================================================

/** Main build configuration interface */
export interface BuildConfig {
  /** Folders to clean/delete before building */
  foldersToClean?: string[];
  /** Files to compile with Vite */
  filesToCompile?: FileToCompile[];
  /** Files or folders to copy after compilation */
  filesOrFoldersToCopy?: CopyConfig[];
  /** CLI bundle configuration (uses Bun) */
  cliBundle?: CliBundleConfig;
  /** NPM package.json generation config */
  npmPackage?: NpmPackageConfig;
  /** Build hooks */
  hooks?: {
    /** Run before build starts */
    preBuild?: BuildHook;
    /** Run after build completes */
    postBuild?: BuildHook;
    /** Run after each file is compiled */
    onFileCompiled?: (filePath: string, size: number) => void;
  };
  /** Environment variables to inject */
  env?: Record<string, string>;
  /** Profile-specific overrides */
  profiles?: Partial<Record<BuildProfile, Partial<BuildConfig>>>;
}

/** Configuration for copying files/folders */
export interface CopyConfig {
  /** Source path (relative to project root) */
  input: string;
  /** Destination path (relative to project root) */
  output: string;
  /** Optional glob pattern for filtering (when copying folders) */
  pattern?: string;
}

/** Configuration for CLI bundling with Bun */
export interface CliBundleConfig {
  /** Entry point file path */
  entrypoint: string;
  /** Output file path */
  outfile: string;
  /** Build target runtime */
  target?: "bun" | "node";
  /** Enable minification */
  minify?: boolean;
  /** Sourcemap generation mode */
  sourcemap?: "external" | "inline" | "none";
  /** Additional modules to externalize (added to defaults) */
  external?: string[];
  /** Define compile-time constants */
  define?: Record<string, string>;
  /** Bundle splitting configuration */
  splitting?: boolean;
}

/** Configuration for NPM package.json generation */
export interface NpmPackageConfig {
  /** Package name */
  name: string;
  /** Package version (defaults to root package.json version) */
  version?: string;
  /** Package description */
  description?: string;
  /** Binary entry points */
  bin?: Record<string, string>;
  /** Main entry point */
  main?: string;
  /** ES module entry point */
  module?: string;
  /** TypeScript types entry point */
  types?: string;
  /** Package exports map */
  exports?: Record<string, unknown>;
  /** Runtime dependencies */
  dependencies?: Record<string, string>;
  /** Peer dependencies */
  peerDependencies?: Record<string, string>;
  /** Files to include in package */
  files?: string[];
  /** Package keywords */
  keywords?: string[];
  /** Package license */
  license?: string;
  /** Repository URL */
  repository?: string | { type: string; url: string };
}

/** Configuration for TypeScript declaration generation */
export interface PackageConfig {
  /** Enable package mode */
  isPackage: true;
  /** Directories to include in declaration generation */
  dtsInclude: string[];
  /** Root directory for entry point resolution */
  dtsEntryRoot: string;
}

/** Configuration for a single file compilation */
export interface FileToCompile {
  options: {
    /** Input file path */
    input: string;
    /** Output file path */
    output: string;
    /** Build type determining plugins and configuration */
    type: "react-tailwind" | "react" | "vanilla";
    /** Inject CSS into JS bundle (default: true for react-tailwind) */
    inlineCss?: boolean;
    /** Package/library build configuration */
    packageConfig?: PackageConfig;
    /** Include React in bundle instead of external */
    bundleReact?: boolean;
    /** Modules to exclude from bundle */
    modulesToExternalize?: string[];
  };
  /** Override Vite configuration options */
  viteOptions?: InlineConfig;
}

// ============================================================================
// Result Types
// ============================================================================

/** Build step result for tracking */
export interface BuildStepResult {
  step: string;
  success: boolean;
  duration: number;
  filesAffected?: string[];
  size?: number;
  warnings?: string[];
}

/** Bundle analysis result */
export interface BundleAnalysis {
  totalSize: number;
  files: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  suggestions: string[];
  warnings: string[];
}

/** Configuration validation result */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** Cache entry */
export interface CacheEntry {
  hash: string;
  outputFiles: string[];
  timestamp: number;
}

/** Build cache storage */
export interface BuildCacheStorage {
  version: string;
  entries: Record<string, CacheEntry>;
}

/** Cache statistics */
export interface CacheStats {
  hits: number;
  misses: number;
  timeSaved: number;
}

/** Build report */
export interface BuildReport {
  timestamp: string;
  duration: number;
  profile: BuildProfile;
  success: boolean;
  steps: BuildStepResult[];
  files: {
    built: string[];
    copied: string[];
  };
  cache?: CacheStats;
  bundleAnalysis?: BundleAnalysis;
  environment: {
    nodeVersion: string;
    platform: string;
    cwd: string;
  };
}

/** CLI bundle result */
export interface CliBundleResult {
  size: number;
  warnings: string[];
}

/** Translate function type - compatible with i18n TFunction */
export type TranslateFunction = (key: string, params?: Record<string, string | number>) => string;

// ============================================================================
// Logger Type (for services that need logging)
// ============================================================================

export type Logger = EndpointLogger;

// ============================================================================
// Re-export Vite types for convenience
// ============================================================================

export type { BuildOptions, InlineConfig, OutputOptions, PluginOption, RollupOptions };
