/**
 * Vite Compiler Service
 * Compiles files using Vite
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

import type { OutputOptions, RollupOptions } from "rollup";
import type { BuildOptions, InlineConfig, PluginOption } from "vite";
import { build as viteBuild } from "vite";

import { PROFILE_DEFAULTS, ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";
import type {
  BuildProfile,
  FileToCompile,
  Logger,
  TranslateFunction,
} from "./types";

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
    logger: Logger,
    t: TranslateFunction,
    dryRun?: boolean,
    verbose?: boolean,
    profile?: BuildProfile,
  ): Promise<string[]>;

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
    logger: Logger,
    t: TranslateFunction,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<string[]> {
    const inputFilePath = resolve(ROOT_DIR, fileConfig.options.input);
    const outputDir = resolve(ROOT_DIR, dirname(fileConfig.options.output));
    const compiledFiles: string[] = [];

    if (!existsSync(inputFilePath)) {
      throw new Error(
        t("app.api.system.builder.errors.inputFileNotFound", {
          filePath: fileConfig.options.input,
        }),
      );
    }

    output.push(
      outputFormatter.formatItem(
        fileConfig.options.input,
        `→ ${dirname(fileConfig.options.output)}/ (${fileConfig.options.type})`,
      ),
    );
    logger.info("Compiling file", {
      input: fileConfig.options.input,
      type: fileConfig.options.type,
    });

    if (dryRun) {
      // Simulate output files for dry run
      if (fileConfig.options.packageConfig?.isPackage) {
        const outputFileName =
          basename(fileConfig.options.output).split(".")[0] || "index";
        compiledFiles.push(
          `${dirname(fileConfig.options.output)}/${outputFileName}.mjs`,
          `${dirname(fileConfig.options.output)}/${outputFileName}.cjs`,
        );
      } else {
        compiledFiles.push(fileConfig.options.output);
      }
      filesBuilt.push(...compiledFiles);
      return compiledFiles;
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
    if (fileConfig.options.packageConfig?.isPackage) {
      const outputFileName =
        basename(fileConfig.options.output).split(".")[0] || "index";
      compiledFiles.push(
        `${dirname(fileConfig.options.output)}/${outputFileName}.mjs`,
        `${dirname(fileConfig.options.output)}/${outputFileName}.cjs`,
      );
    } else {
      compiledFiles.push(fileConfig.options.output);
    }

    filesBuilt.push(...compiledFiles);

    if (verbose) {
      output.push(outputFormatter.formatVerbose(`Compiled: ${compiledFiles.join(", ")}`));
    }

    logger.info("File compiled", {
      input: fileConfig.options.input,
      output: compiledFiles,
    });
    return compiledFiles;
  }

  async buildViteConfig(
    fileConfig: FileToCompile,
    inputFilePath: string,
    outputDir: string,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<InlineConfig> {
    const profileSettings = PROFILE_DEFAULTS[profile];
    const {
      plugins: pluginsOverride,
      build: {
        rollupOptions: { output: outputOverride, ...rollupOptionsOverride } = {},
        ...buildOptionsOverride
      } = {},
      ...otherOptions
    } = fileConfig.viteOptions || {};

    const plugins: PluginOption[] = pluginsOverride || [];
    const buildOptions: BuildOptions = {
      target: "es2020",
      outDir: outputDir,
      minify: profileSettings.minify,
      emptyOutDir: false,
      cssCodeSplit: !fileConfig.options.inlineCss,
      cssMinify: profileSettings.minify,
      sourcemap: profileSettings.sourcemap !== false,
      ...buildOptionsOverride,
    };

    const rollupOptions: RollupOptions = {};
    const outputOptions: OutputOptions = {};

    // Configure plugins based on build type
    if (fileConfig.options.type === "react-tailwind") {
      const tailwindcss = (await import("@tailwindcss/vite")).default;
      plugins.push(tailwindcss() as PluginOption);

      if (fileConfig.options.inlineCss !== false) {
        const cssInjectedByJsPlugin = (
          await import("vite-plugin-css-injected-by-js")
        ).default;
        plugins.push(cssInjectedByJsPlugin() as PluginOption);
      }
    }

    if (fileConfig.options.type.includes("react")) {
      outputOptions.globals = { react: "React", "react-dom": "ReactDOM" };
      const react = (await import("@vitejs/plugin-react")).default;
      plugins.push(react());
    }

    // Package mode with TypeScript declarations
    const packageConfig = fileConfig.options.packageConfig;
    if (packageConfig?.isPackage) {
      const dts = (await import("vite-plugin-dts")).default;
      plugins.push(
        dts({
          include: packageConfig.dtsInclude,
          entryRoot: packageConfig.dtsEntryRoot,
        }) as PluginOption,
      );

      const outputFileName =
        basename(fileConfig.options.output).split(".")[0] || "index";

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
          ...(fileConfig.options.modulesToExternalize || []),
          ...(fileConfig.options.type.includes("react") &&
          !fileConfig.options.bundleReact
            ? ["react", "react-dom", "react/jsx-runtime"]
            : []),
        ]),
      ];

      rollupOptions.external = (id): boolean =>
        modulesToExternalize.includes(id) || id.startsWith("node:");
    } else {
      // IIFE build for browser
      outputOptions.entryFileNames = basename(fileConfig.options.output);
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
