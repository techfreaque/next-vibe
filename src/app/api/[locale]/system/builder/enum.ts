/**
 * Builder Enums
 *
 * Single source of truth for all builder-related enumerations.
 * These enums define the allowed values for various build configurations.
 */

import { createEnumOptions } from "../unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

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
  MODULE = "module",
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

export const { options: BuildProfileOptions } = createEnumOptions(
  scopedTranslation,
  {
    DEVELOPMENT: "enums.profile.development",
    PRODUCTION: "enums.profile.production",
  },
);

export const { options: BuildTypeOptions } = createEnumOptions(
  scopedTranslation,
  {
    REACT_TAILWIND: "enums.buildType.reactTailwind",
    REACT: "enums.buildType.react",
    VANILLA: "enums.buildType.vanilla",
    EXECUTABLE: "enums.buildType.executable",
  },
);

export const { options: BunTargetOptions } = createEnumOptions(
  scopedTranslation,
  {
    BUN: "enums.bunTarget.bun",
    NODE: "enums.bunTarget.node",
    BROWSER: "enums.bunTarget.browser",
  },
);

export const { options: SourcemapModeOptions } = createEnumOptions(
  scopedTranslation,
  {
    EXTERNAL: "enums.sourcemap.external",
    INLINE: "enums.sourcemap.inline",
    NONE: "enums.sourcemap.none",
  },
);

export const { options: OutputFormatOptions } = createEnumOptions(
  scopedTranslation,
  {
    ESM: "enums.format.esm",
    CJS: "enums.format.cjs",
    IIFE: "enums.format.iife",
  },
);

export const { options: ViteMinifyOptions } = createEnumOptions(
  scopedTranslation,
  {
    ESBUILD: "enums.viteMinify.esbuild",
    TERSER: "enums.viteMinify.terser",
    FALSE: "enums.viteMinify.false",
  },
);

export const { options: ViteLibFormatOptions } = createEnumOptions(
  scopedTranslation,
  {
    ES: "enums.viteLibFormat.es",
    CJS: "enums.viteLibFormat.cjs",
    UMD: "enums.viteLibFormat.umd",
    IIFE: "enums.viteLibFormat.iife",
  },
);
