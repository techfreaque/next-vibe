import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ReleaseConfig } from "../types/index.js";
import { logger, loggerError } from "./logger.js";

export const DEFAULT_CONFIG_PATH = "release.config.ts";

/**
 * Type guard to validate if an imported module has the expected ReleaseConfig structure
 */
function isReleaseConfigModule(
  module: unknown,
): module is { default: ReleaseConfig } {
  if (typeof module !== "object" || module === null) {
    return false;
  }
  if (!("default" in module)) {
    return false;
  }
  const defaultExport = (module as { default: unknown }).default;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  if (!("packages" in defaultExport)) {
    return false;
  }
  const packages = (defaultExport as { packages: unknown }).packages;
  return Array.isArray(packages);
}

// async function getCompiledConfigPath(configPath: string): Promise<string> {
//   const outputFileName = `release.config.tmp.${Math.round(Math.random() * 100000)}.cjs`;
//   const outputDir = dirname(configPath);
//   const outputFilePath = join(outputDir, outputFileName);
//   const outputTmpDir = join(outputDir, "tmp");
//   const outputFileTmpPath = join(outputTmpDir, outputFileName);

//   try {
//     // Ensure tmp dir exists
//     if (!existsSync(outputTmpDir)) {
//       logger(`creating tmp dir ${outputTmpDir}`);
//       process.umask(0);
//       mkdirSync(outputTmpDir, { recursive: true });
//     }

//     await build({
//       logLevel: "silent",
//       plugins: [],
//       build: {
//         lib: {
//           entry: configPath,
//           formats: ["cjs"],
//           fileName: () => outputFileName,
//         },
//         outDir: outputTmpDir,
//         emptyOutDir: false,
//         sourcemap: false,
//       },
//     });
//     renameSync(join(outputTmpDir, outputFileName), outputFilePath);
//     rmSync(outputTmpDir, { force: true, recursive: true });
//     return outputFilePath;
//   } catch (error) {
//     // // Clean up in case of an error
//     try {
//       unlinkSync(outputFileTmpPath);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (_) {
//       /* empty */
//     }
//     try {
//       unlinkSync(outputFilePath);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (_) {
//       /* empty */
//     }
//     // eslint-disable-next-line no-restricted-syntax
//     throw error;
//   }
// }

// function cleanCompiledConfig(compiledConfigPath: string): void {
//   unlinkSync(compiledConfigPath);
// }

/**
 * Loads and returns the release configuration.
 */
export async function loadConfig(configPath: string): Promise<ReleaseConfig> {
  logger(`Using config file: ${configPath}`);
  const resolvedConfigPath = resolve(process.cwd(), configPath);

  if (!existsSync(resolvedConfigPath)) {
    throw new Error(`Config file not found: ${resolvedConfigPath}`);
  }

  try {
    // const compiledConfigPath = await getCompiledConfigPath(resolvedConfigPath);
    const importedModule = await import(`file://${resolvedConfigPath}`);

    if (!isReleaseConfigModule(importedModule)) {
      throw new Error(
        "Invalid config format. Ensure the config exports a default object with a 'packages' array. Check the docs for more info.",
      );
    }

    const config = importedModule.default;
    // cleanCompiledConfig(compiledConfigPath);

    return config;
  } catch (error) {
    loggerError("Error loading config:", error);
    throw error;
  }
}
