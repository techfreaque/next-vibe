/**
 * Bun Compiler Service
 * Compiles executable files using Bun.build
 */

/// <reference types="bun-types" />

import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import type { BuildProfile, FileToCompile } from "../definition";
import { PROFILE_DEFAULTS, ROOT_DIR, SIZE_THRESHOLDS } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Default Externals
// ============================================================================

/** Default modules to externalize for executable builds */
const DEFAULT_EXTERNALS = [
  // React/Next.js - peer dependencies
  "react",
  "react-dom",
  "next",
  // React Native / Expo
  "expo",
  "react-native",
  // Build tools with native binaries or side effects
  "vite",
  "@vitejs/plugin-react",
  "vite-plugin-css-injected-by-js",
  "vite-plugin-dts",
  "@tailwindcss/vite",
  "@tailwindcss/oxide",
  "tailwindcss",
  "rollup",
  "esbuild",
  "lightningcss",
] as const;

// ============================================================================
// Interface
// ============================================================================

export interface IBunCompiler {
  /**
   * Compile a file using Bun.build
   */
  compileFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
    verbose?: boolean,
    profile?: BuildProfile,
    env?: Record<string, string>,
  ): Promise<ResponseType<string[]>>;

  /**
   * Get default external modules
   */
  getDefaultExternals(): readonly string[];
}

// ============================================================================
// Implementation
// ============================================================================

export class BunCompiler implements IBunCompiler {
  async compileFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
    env?: Record<string, string>,
  ): Promise<ResponseType<string[]>> {
    const profileSettings = PROFILE_DEFAULTS[profile];
    const compiledFiles: string[] = [];
    const warnings: string[] = [];

    const { bunOptions = {} } = fileConfig;
    const entrypointPath = resolve(ROOT_DIR, fileConfig.input);
    const outfilePath = resolve(ROOT_DIR, fileConfig.output);
    const outDir = dirname(outfilePath);

    if (!existsSync(entrypointPath)) {
      return fail({
        message: "app.api.system.builder.errors.inputFileNotFound",
        messageParams: {
          filePath: fileConfig.input,
        },
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    output.push(
      outputFormatter.formatItem(
        fileConfig.input,
        `\u2192 ${fileConfig.output} (executable)`,
      ),
    );
    logger.info("Compiling executable with Bun", {
      input: fileConfig.input,
      target: bunOptions?.target || "bun",
      profile,
    });

    if (verbose) {
      output.push(
        outputFormatter.formatVerbose(`Target: ${bunOptions?.target || "bun"}`),
      );
      output.push(outputFormatter.formatVerbose(`Profile: ${profile}`));
      output.push(
        outputFormatter.formatVerbose(
          `Minify: ${bunOptions?.minify ?? profileSettings.minify}`,
        ),
      );
      output.push(
        outputFormatter.formatVerbose(
          `Sourcemap: ${bunOptions?.sourcemap || profileSettings.sourcemap}`,
        ),
      );
    }

    if (dryRun) {
      compiledFiles.push(fileConfig.output);
      filesBuilt.push(fileConfig.output);
      return success(compiledFiles);
    }

    // Ensure output directory exists
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    // Merge default and custom externals
    const externals = [
      ...DEFAULT_EXTERNALS,
      ...(fileConfig.modulesToExternalize || []),
      ...(bunOptions?.external || []),
    ];

    // Build define object for env vars
    const define: Record<string, string> = {
      ...bunOptions?.define,
    };
    if (env) {
      for (const [key, value] of Object.entries(env)) {
        define[`process.env.${key}`] = JSON.stringify(value);
      }
    }

    // Determine sourcemap setting
    const sourcemap =
      bunOptions?.sourcemap ||
      (profileSettings.sourcemap === false
        ? "none"
        : profileSettings.sourcemap === true
          ? "external"
          : (profileSettings.sourcemap as "external" | "inline" | "none"));

    // Build with Bun
    const result = await Bun.build({
      entrypoints: [entrypointPath],
      outdir: outDir,
      target: bunOptions?.target || "bun",
      minify: bunOptions?.minify ?? profileSettings.minify,
      sourcemap,
      external: externals,
      naming: bunOptions?.naming || { entry: basename(fileConfig.output) },
      define: Object.keys(define).length > 0 ? define : undefined,
      splitting: bunOptions?.splitting,
      format: bunOptions?.format,
      publicPath: bunOptions?.publicPath,
      root: bunOptions?.root,
      conditions: bunOptions?.conditions,
      loader: bunOptions?.loader,
      drop: bunOptions?.drop,
      banner: bunOptions?.banner,
      footer: bunOptions?.footer,
      bytecode: bunOptions?.bytecode,
    });

    if (!result.success) {
      const errorMessages = result.logs
        .filter((log): log is BuildMessage => log.level === "error")
        .map((log) => log.message)
        .join("\n");
      return fail({
        message: "app.api.system.builder.messages.bundleFailed",
        messageParams: {
          error: errorMessages || "Unknown error",
        },
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Get file size and check thresholds
    const size = existsSync(outfilePath) ? statSync(outfilePath).size : 0;

    if (size > SIZE_THRESHOLDS.CRITICAL) {
      warnings.push(
        t("app.api.system.builder.analysis.criticalSize", {
          size: outputFormatter.formatBytes(size),
        }),
      );
    } else if (size > SIZE_THRESHOLDS.WARNING) {
      warnings.push(
        t("app.api.system.builder.analysis.largeBundle", {
          size: outputFormatter.formatBytes(size),
        }),
      );
    }

    compiledFiles.push(fileConfig.output);
    filesBuilt.push(fileConfig.output);

    // Format success message with size indicator
    const sizeIndicator = outputFormatter.getSizeIndicator(size);
    output.push(
      outputFormatter.formatSuccess(
        `${sizeIndicator} ${t("app.api.system.builder.messages.bundleSuccess")} (${outputFormatter.formatBytes(size)})`,
      ),
    );
    logger.info("Executable compiled successfully", {
      outfile: fileConfig.output,
      size,
      profile,
    });

    // Log warnings
    for (const warning of warnings) {
      output.push(outputFormatter.formatWarning(warning));
    }

    return success(compiledFiles);
  }

  getDefaultExternals(): readonly string[] {
    return DEFAULT_EXTERNALS;
  }
}

// Singleton instance
export const bunCompiler = new BunCompiler();
