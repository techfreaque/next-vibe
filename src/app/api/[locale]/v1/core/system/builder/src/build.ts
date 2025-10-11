#!/usr/bin/env node

import { Command } from "commander";
import { existsSync, mkdirSync, renameSync, rmSync, unlinkSync } from "fs";
import { copy } from "fs-extra";
import { basename, dirname, join, resolve } from "path";
import type { OutputOptions, RollupOptions } from "rollup";
import type { BuildOptions, InlineConfig, PluginOption } from "vite";
import { build } from "vite";

import type { BuildConfig, FileToCompile, PackageConfig } from "./config.js";

const program = new Command();

export interface CliOptions {
  config: string;
}

program
  .command("build")
  .description("buildType: build")
  .option(
    "-c, --config <path>",
    "specify the config file path",
    "build.config.ts",
  )
  .action(async (options: CliOptions) => {
    await pweBuilder(options);
  });

export async function pweBuilder(options: CliOptions): Promise<void> {
  logger("Building started");
  const buildConfig = await getConfigContent(options);
  cleanDistFolders(buildConfig);
  await compileToJsFilesWithVite(buildConfig);
  await copyFiles(buildConfig);
}

export async function compileToJsFilesWithVite(
  buildConfig: BuildConfig,
): Promise<void> {
  if (buildConfig.filesToCompile) {
    await Promise.all(
      buildConfig.filesToCompile.map(async (fileConfig) => {
        await pweBuild(fileConfig);
      }),
    );
  } else {
    logger("No files to compile in your config");
  }
}

export async function pweBuild(fileConfig: FileToCompile): Promise<void> {
  const inputFilePath = resolve(process.cwd(), fileConfig.options.input);
  if (!existsSync(inputFilePath)) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(`Input file ${inputFilePath} does not exist`);
  }
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
    target: "es6",
    outDir: resolve(fileConfig.options.output, ".."),
    minify: false,
    emptyOutDir: false,
    cssCodeSplit: !fileConfig.options.inlineCss,
    cssMinify: false,
    sourcemap: true,
    ...buildOptionsOverride,
  };
  const rollupOptions: RollupOptions = {};

  const outputOptions: OutputOptions = {};

  if (fileConfig.options?.type === "react-tailwind") {
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    plugins.push(tailwindcss());
    if (fileConfig.options.inlineCss !== false) {
      const cssInjectedByJsPlugin = (
        await import("vite-plugin-css-injected-by-js")
      ).default;
      plugins.push(cssInjectedByJsPlugin());
    }
  }
  if (fileConfig.options?.type?.includes("react")) {
    outputOptions.globals = {
      "react": "React",
      "react-dom": "ReactDOM",
    };
    const react = (await import("@vitejs/plugin-react")).default;
    plugins.push(react());
  }
  const packageConfig = fileConfig.options.packageConfig;
  if (packageConfig?.isPackage) {
    await setPackageBuildConfig({
      plugins,
      buildOptions,
      rollupOptions,
      outputOptions,
      fileConfig,
      inputFilePath,
      packageConfig,
    });
  } else {
    outputOptions.entryFileNames = basename(fileConfig.options.output);
    outputOptions.assetFileNames = "[name][extname]";
    outputOptions.exports = "none";
    outputOptions.format = "iife";
    rollupOptions.input = inputFilePath;
  }

  await build({
    root: "./",
    base: "./",
    plugins: Array.from(new Set(plugins)),
    ...otherOptions,
    build: {
      ...buildOptions,
      rollupOptions: {
        ...rollupOptions,
        ...rollupOptionsOverride,
        output: {
          ...outputOptions,
          ...outputOverride,
        },
      },
    },
  });
}

async function setPackageBuildConfig({
  plugins,
  buildOptions,
  rollupOptions,
  outputOptions,
  fileConfig,
  inputFilePath,
  packageConfig,
}: {
  plugins: PluginOption[];
  buildOptions: BuildOptions;
  rollupOptions: RollupOptions;
  outputOptions: OutputOptions;
  fileConfig: FileToCompile;
  inputFilePath: string;
  packageConfig: PackageConfig;
}): Promise<void> {
  const dts = (await import("vite-plugin-dts")).default;
  plugins.push(
    dts({
      include: packageConfig.dtsInclude,
      entryRoot: packageConfig.dtsEntryRoot,
    }),
  );
  const outPutFilesNameWithoutExtension = basename(
    fileConfig.options.output,
  ).split(".")[0];
  if (!outPutFilesNameWithoutExtension) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error("Output file name is invalid");
  }
  buildOptions.lib = {
    entry: inputFilePath,
    formats: ["es", "cjs"],
    fileName: (format): string =>
      `${outPutFilesNameWithoutExtension}.${format === "es" ? "mjs" : "cjs"}`,
  };
  outputOptions.exports = "auto";
  const modulesToExternalize = Array.from(
    new Set([
      ...(fileConfig.options.modulesToExternalize || []),
      ...(fileConfig.options?.type?.includes("react") &&
      fileConfig.options?.bundleReact !== false
        ? ["react", "react-dom", "react/jsx-runtime"]
        : []),
    ]),
  );

  rollupOptions.external = (id): boolean => {
    return modulesToExternalize.includes(id) || id.startsWith("node:");
  };
}

export async function getConfigContent(
  options: CliOptions,
): Promise<BuildConfig> {
  const configSourcePath = resolve(process.cwd(), options.config);
  // const compiledConfigPath = await getCompiledConfigPath(configSourcePath);
  const buildConfig = (
    (await import(configSourcePath)) as { default: BuildConfig }
  ).default;
  // cleanCompiledConfig(compiledConfigPath);
  return buildConfig;
}

// function cleanCompiledConfig(compiledConfigPath: string): void {
//   unlinkSync(compiledConfigPath);
// }

export async function getCompiledConfigPath(
  configPath: string,
): Promise<string> {
  const outputFileName = `build.config.tmp.${Math.round(Math.random() * 100000)}.cjs`;
  const outputDir = dirname(configPath);
  const outputFilePath = join(outputDir, outputFileName);
  const outputTmpDir = join(outputDir, "tmp");
  const outputFileTmpPath = join(outputTmpDir, outputFileName);
  try {
    await build({
      logLevel: "silent",
      root: outputTmpDir,
      plugins: [],
      build: {
        lib: {
          entry: configPath,
          formats: ["cjs"],
          fileName: () => outputFileName,
        },
        outDir: outputTmpDir,
        emptyOutDir: false,
        sourcemap: false,
      },
    });
    renameSync(outputFileTmpPath, outputFilePath);
    rmSync(outputTmpDir, { force: true, recursive: true });
    return outputFilePath;
  } catch (error) {
    // Clean up in case of an error
    try {
      unlinkSync(outputFileTmpPath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
    try {
      unlinkSync(outputFilePath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
    // eslint-disable-next-line no-restricted-syntax
    throw error;
  }
}

export async function copyFiles(buildConfig: BuildConfig): Promise<void> {
  if (buildConfig.filesOrFoldersToCopy) {
    for (const fileOrFolderData of buildConfig.filesOrFoldersToCopy) {
      const destDir = dirname(fileOrFolderData.output);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      await copy(fileOrFolderData.input, fileOrFolderData.output);
    }
    logger("Files copied successfully");
  } else {
    logger("No files to copy in your config");
  }
}

export function cleanDistFolders(buildConfig: BuildConfig): void {
  if (buildConfig.foldersToClean) {
    buildConfig.foldersToClean.forEach((folder) => {
      try {
        rmSync(folder, { force: true, recursive: true });
        logger(`Done dist folder cleaning (${folder})`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        /* empty */
      }
    });
  } else {
    logger("No folders to clean in your config");
  }
}

function logger(message: string): void {
  // eslint-disable-next-line no-console
  console.log(`[builder] ${message}`);
}

// eslint-disable-next-line node/no-process-env
if (process.env["NODE_ENV"] !== "test") {
  program.parse(process.argv);
}

export {
  BuildConfig,
  BuildOptions,
  FileToCompile,
  InlineConfig,
  OutputOptions,
  PluginOption,
  RollupOptions,
};
