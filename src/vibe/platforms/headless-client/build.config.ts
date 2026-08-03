/**
 * Build Configuration for @next-vibe/headless-client
 *
 * Produces a self-contained native binary `vibe-headless-client` via
 * `bun build --compile`. No Bun runtime required on the target machine.
 *
 * Usage:
 *   vibe builder --configPath="src/vibe/platforms/headless-client/build.config.ts"
 */

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import type { BuildConfig } from "../../tooling/builder/definition";
import {
  BunBuildTypeEnum,
  BunTargetEnum,
  SourcemapModeEnum,
} from "../../tooling/builder/enum";

import { createCliWidgetPlugin } from "@/vibe/platforms/cli/runtime/cli-widget-plugin-factory";

import manifest from "./package";

const DIST_DIR = ".dist/headless-client";
const JS_BUNDLE = `${DIST_DIR}/bin/vibe-headless-client.js`;
const NATIVE_BINARY = `${DIST_DIR}/bin/vibe-headless-client`;

const config: BuildConfig = {
  manifest,

  foldersToClean: [DIST_DIR],

  filesToCompile: [
    {
      input: "src/vibe/platforms/cli/package-runtime.ts",
      output: JS_BUNDLE,
      type: BunBuildTypeEnum.EXECUTABLE,
      bunOptions: {
        target: BunTargetEnum.BUN,
        sourcemap: SourcemapModeEnum.NONE,
        plugins: [
          createCliWidgetPlugin(resolve(import.meta.dir, "../../../../../")),
        ],
      },
    },
  ],

  hooks: {
    postBuild: ({ logger, addOutput }) => {
      logger.info("Compiling native binary with bun build --compile...");

      const result = spawnSync(
        process.execPath,
        [
          "build",
          "--compile",
          "--target=bun",
          JS_BUNDLE,
          `--outfile=${NATIVE_BINARY}`,
        ],
        { encoding: "utf8", cwd: process.cwd() },
      );

      if (result.error) {
        logger.error(`bun build --compile failed: ${result.error.message}`);
        return;
      }
      if (result.status !== 0) {
        const out = [result.stdout, result.stderr].filter(Boolean).join("\n");
        logger.error(
          `bun build --compile exited ${String(result.status)}: ${out}`,
        );
        return;
      }

      addOutput(`✓ Native binary: ${NATIVE_BINARY}`);
      logger.info(`Native binary compiled: ${NATIVE_BINARY}`);
    },
  },

  npmPackage: {
    outputDir: DIST_DIR,
    name: manifest.name,
    description: manifest.description,
    bin: {
      [manifest.bin ?? "vibe-headless-client"]:
        `./bin/${manifest.bin ?? "vibe-headless-client"}`,
    },
    files: ["bin/", "generated/"],
    keywords: manifest.publish?.keywords,
    license: manifest.publish?.license,
    repository: manifest.publish?.repository,
    dependencies: {
      "@electric-sql/pglite": "^0.5.3",
    },
  },
};

export default config;
