/**
 * Builder Enums
 *
 * Single source of truth for all builder-related enumerations.
 * These enums define the allowed values for various build configurations.
 */

// ============================================================================
// Build Configuration Enums
// ============================================================================

/** Build profile for different environments */
export enum BuildProfileEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

/** Vite build types */
export enum ViteBuildTypeEnum {
  REACT_TAILWIND = "react-tailwind",
  REACT = "react",
  VANILLA = "vanilla",
}

/** Bun build types */
export enum BunBuildTypeEnum {
  EXECUTABLE = "executable",
}

/** All build types combined */
export const BuildTypeEnum = {
  ...ViteBuildTypeEnum,
  ...BunBuildTypeEnum,
} as const;

/** Bun target runtime */
export enum BunTargetEnum {
  BUN = "bun",
  NODE = "node",
  BROWSER = "browser",
}

/** Sourcemap modes */
export enum SourcemapModeEnum {
  EXTERNAL = "external",
  INLINE = "inline",
  NONE = "none",
}

/** Output format */
export enum OutputFormatEnum {
  ESM = "esm",
  CJS = "cjs",
  IIFE = "iife",
}

/** Step status */
export enum StepStatusEnum {
  SUCCESS = "success",
  CACHED = "cached",
  SKIPPED = "skipped",
  FAILED = "failed",
}

/** Vite minify options */
export enum ViteMinifyEnum {
  ESBUILD = "esbuild",
  TERSER = "terser",
  FALSE = "false",
}

/** Vite library format */
export enum ViteLibFormatEnum {
  ES = "es",
  CJS = "cjs",
  UMD = "umd",
  IIFE = "iife",
}
