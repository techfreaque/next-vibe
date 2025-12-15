/**
 * Vite Compiler Service
 * Compiles files using Vite
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { OutputOptions, RollupOptions } from "rollup";
import type { BuildOptions, InlineConfig, PluginOption } from "vite";
import { build as viteBuild } from "vite";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import type { BuildProfile, FileToCompile } from "../definition";
import { PROFILE_DEFAULTS, ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Interface
// ============================================================================

export interface IViteCompiler {
  /**
   * Compile a single file with Vite
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
  ): Promise<ResponseType<string[]>>;

  /**
   * Build Vite configuration for a file
   */
  buildViteConfig(
    fileConfig: FileToCompile,
    inputFilePath: string,
    outputDir: string,
    verbose?: boolean,
    profile?: BuildProfile,
  ): Promise<InlineConfig>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ViteCompiler implements IViteCompiler {
  async compileFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<ResponseType<string[]>> {
    const inputFilePath = resolve(ROOT_DIR, fileConfig.input);
    const outputDir = resolve(ROOT_DIR, dirname(fileConfig.output));
    const compiledFiles: string[] = [];

    if (!existsSync(inputFilePath)) {
      return fail({
        message: t("app.api.system.builder.errors.inputFileNotFound", {
          filePath: fileConfig.input,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    output.push(
      outputFormatter.formatItem(
        fileConfig.input,
        `→ ${dirname(fileConfig.output)}/ (${fileConfig.type})`,
      ),
    );
    logger.info("Compiling file", {
      input: fileConfig.input,
      type: fileConfig.type,
    });

    if (dryRun) {
      // Simulate output files for dry run
      if (fileConfig.packageConfig?.isPackage) {
        const outputFileName =
          basename(fileConfig.output).split(".")[0] || "index";
        compiledFiles.push(
          `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
          `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
        );
      } else {
        compiledFiles.push(fileConfig.output);
      }
      filesBuilt.push(...compiledFiles);
      return success(compiledFiles);
    }

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Build Vite configuration
    const viteConfig = await this.buildViteConfig(
      fileConfig,
      inputFilePath,
      outputDir,
      verbose,
      profile,
    );

    // Run Vite build
    await viteBuild(viteConfig);

    // Track built files
    if (fileConfig.packageConfig?.isPackage) {
      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";
      compiledFiles.push(
        `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
        `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
      );
    } else {
      compiledFiles.push(fileConfig.output);
    }

    filesBuilt.push(...compiledFiles);

    if (verbose) {
      output.push(outputFormatter.formatVerbose(`Compiled: ${compiledFiles.join(", ")}`));
    }

    logger.info("File compiled", {
      input: fileConfig.input,
      output: compiledFiles,
    });
    return success(compiledFiles);
  }

  async buildViteConfig(
    fileConfig: FileToCompile,
    inputFilePath: string,
    outputDir: string,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<InlineConfig> {
    const profileSettings = PROFILE_DEFAULTS[profile];
    const viteOpts = fileConfig.viteOptions || {};

    // Extract plugins (typed as unknown[] in schema for API compatibility)
    const pluginsOverride = viteOpts.plugins as PluginOption[] | undefined;

    // Extract build options with proper typing
    const buildOpts = (viteOpts.build || {}) as BuildOptions & { rollupOptions?: RollupOptions & { output?: OutputOptions } };
    const { rollupOptions: rollupOpts = {}, ...buildOptionsOverride } = buildOpts;
    const { output: outputOverride, ...rollupOptionsOverride } = rollupOpts;

    // Collect other vite options (excluding plugins and build which we handled separately)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude handled fields
    const { plugins: _, build: __, ...otherOptions } = viteOpts;

    const plugins: PluginOption[] = pluginsOverride || [];
    const buildOptions: BuildOptions = {
      target: "es2020",
      outDir: outputDir,
      minify: profileSettings.minify,
      emptyOutDir: false,
      cssCodeSplit: !fileConfig.inlineCss,
      cssMinify: profileSettings.minify,
      sourcemap: profileSettings.sourcemap !== false,
      ...buildOptionsOverride,
    };

    const rollupOptions: RollupOptions = {};
    const outputOptions: OutputOptions = {};

    // Configure plugins based on build type
    // Use string variables to prevent Turbopack static analysis of CLI-only packages
    if (fileConfig.type === "react-tailwind") {
      const tailwindPkg = "@tailwindcss/vite";
      const tailwindcss = (await import(/* webpackIgnore: true */ tailwindPkg)).default;
      plugins.push(tailwindcss() as PluginOption);

      if (fileConfig.inlineCss !== false) {
        const cssPkg = "vite-plugin-css-injected-by-js";
        const cssInjectedByJsPlugin = (
          await import(/* webpackIgnore: true */ cssPkg)
        ).default;
        plugins.push(cssInjectedByJsPlugin() as PluginOption);
      }
    }

    if (fileConfig.type.includes("react")) {
      outputOptions.globals = { react: "React", "react-dom": "ReactDOM" };
      const react = (await import("@vitejs/plugin-react")).default;
      plugins.push(react());
    }

    // Package mode with TypeScript declarations
    const packageConfig = fileConfig.packageConfig;
    if (packageConfig?.isPackage) {
      const dtsPkg = "vite-plugin-dts";
      const dts = (await import(/* webpackIgnore: true */ dtsPkg)).default;
      plugins.push(
        dts({
          include: packageConfig.dtsInclude,
          entryRoot: packageConfig.dtsEntryRoot,
        }) as PluginOption,
      );

      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";

      buildOptions.lib = {
        entry: inputFilePath,
        formats: ["es", "cjs"],
        fileName: (format): string =>
          `${outputFileName}.${format === "es" ? "mjs" : "cjs"}`,
      };
      outputOptions.exports = "auto";

      // Build externals list
      const modulesToExternalize = [
        ...new Set([
          ...(fileConfig.modulesToExternalize || []),
          ...(fileConfig.type.includes("react") &&
          !fileConfig.bundleReact
            ? ["react", "react-dom", "react/jsx-runtime"]
            : []),
        ]),
      ];

      rollupOptions.external = (id): boolean =>
        modulesToExternalize.includes(id) || id.startsWith("node:");
    } else {
      // IIFE build for browser
      outputOptions.entryFileNames = basename(fileConfig.output);
      outputOptions.assetFileNames = "[name][extname]";
      outputOptions.exports = "none";
      outputOptions.format = "iife";
      rollupOptions.input = inputFilePath;
    }

    return {
      root: "./",
      base: "./",
      plugins: [...new Set(plugins)],
      logLevel: verbose ? "info" : "warn",
      ...otherOptions,
      build: {
        ...buildOptions,
        rollupOptions: {
          ...rollupOptions,
          ...rollupOptionsOverride,
          output: { ...outputOptions, ...outputOverride },
        },
      },
    };
  }

  /**
   * Get compiled file size
   */
  getFileSize(filePath: string): number {
    const fullPath = resolve(ROOT_DIR, filePath);
    if (existsSync(fullPath)) {
      return statSync(fullPath).size;
    }
    return 0;
  }
}

// Singleton instance
export const viteCompiler = new ViteCompiler();
