/**
 * Build Configuration for @next-vibe/checker
 *
 * Produces a standalone `vibe-check` binary + npm package.
 *
 * How it works:
 *  1. preBuild hook: generates scoped endpoint.ts + alias-map.ts into
 *     .dist/checker/generated/ (only check + config/create + help endpoints).
 *  2. Bun EXECUTABLE build: bundles package-runtime.ts with `define` injecting
 *     the generated dir path and package metadata.
 *  3. npmPackage config: synthesizes .dist/checker/package.json for publishing.
 *
 * Usage:
 *   vibe builder --configPath="src/app/api/[locale]/system/check/build.config.ts"
 */

import { resolve } from "node:path";

import type { BunPlugin } from "bun";

import {
  BunBuildTypeEnum,
  BunTargetEnum,
  SourcemapModeEnum,
} from "@/app/api/[locale]/system/builder/enum";
import type { BuildConfig } from "@/app/api/[locale]/system/builder/repository";
import { PackageEndpointGeneratorRepository } from "@/app/api/[locale]/system/generators/package-endpoints/repository";

import manifest from "./package";

// Absolute path where scoped generated files are written during preBuild
const GENERATED_DIR = resolve(process.cwd(), ".dist/checker/generated");

// Bun resolver plugin - redirects the global generated imports to the scoped ones
// baked into .dist/checker/generated/ at preBuild time.
const scopedGeneratedPlugin: BunPlugin = {
  name: "scoped-generated-redirect",
  setup(build) {
    // Redirect @/app/api/[locale]/system/generated/* to the scoped generated dir
    build.onResolve(
      { filter: /\/system\/generated\/(endpoint|alias-map)$/ },
      (args) => {
        const file = args.path.endsWith("alias-map")
          ? "alias-map.ts"
          : "endpoint.ts";
        return { path: resolve(GENERATED_DIR, file) };
      },
    );
  },
};

const config: BuildConfig = {
  // Clean bin/ and copied assets but NOT generated/ - preBuild writes there before clean runs
  foldersToClean: [".dist/checker/bin", ".dist/checker/oxlint-plugins"],

  hooks: {
    preBuild: async ({ logger }) => {
      logger.info("Generating scoped endpoint registry for @next-vibe/checker");
      const result = await PackageEndpointGeneratorRepository.generate({
        manifest,
        outputDir: GENERATED_DIR,
      });
      logger.info(
        `Generated ${result.endpointCount} endpoints → ${result.endpointFile}`,
      );
    },
  },

  filesToCompile: [
    {
      input:
        "src/app/api/[locale]/system/unified-interface/cli/package-runtime.ts",
      output: ".dist/checker/bin/vibe-check.js",
      type: BunBuildTypeEnum.EXECUTABLE,
      modulesToExternalize: [
        "react",
        "react-dom",
        "next",
        "expo",
        "react-native",
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
      ],
      bunOptions: {
        target: BunTargetEnum.BUN,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        // Replace compile-time constants in package-runtime.ts
        define: {
          VIBE_PACKAGE_NAME: JSON.stringify(manifest.bin ?? "vibe-check"),
          VIBE_PACKAGE_DEFAULT_ENDPOINT: JSON.stringify(
            manifest.defaultEndpoint ?? "",
          ),
        },
        plugins: [scopedGeneratedPlugin],
      },
    },
  ],

  filesOrFoldersToCopy: [
    {
      input: "src/app/api/[locale]/system/check/README.md",
      output: ".dist/checker/README.md",
    },
    {
      input: "src/app/api/[locale]/LICENSE",
      output: ".dist/checker/LICENSE",
    },
    // Bootstrap template - copied to user's project by `vibe-check config`
    {
      input: "check.config.ts",
      output: ".dist/checker/check.config.ts",
    },
    // Custom oxlint JS plugins - referenced in check.config.ts jsPlugins paths
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/restricted-syntax/src/index.ts",
      output: ".dist/checker/oxlint-plugins/restricted-syntax.ts",
    },
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/jsx-capitalization/src/index.ts",
      output: ".dist/checker/oxlint-plugins/jsx-capitalization.ts",
    },
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/i18n/src/index.ts",
      output: ".dist/checker/oxlint-plugins/i18n.ts",
    },
  ],

  npmPackage: {
    outputDir: ".dist/checker",
    name: manifest.name,
    description: manifest.description,
    bin: {
      [manifest.bin ?? "vibe-check"]: "./bin/vibe-check.js",
    },
    files: [
      "bin/",
      "generated/",
      "oxlint-plugins/",
      "check.config.ts",
      "README.md",
      "LICENSE",
    ],
    keywords: manifest.publish?.keywords,
    license: manifest.publish?.license,
    repository: manifest.publish?.repository,
    peerDependencies: {
      // Tools invoked via bunx from the user's project
      oxlint: ">=1.0.0",
      eslint: ">=9.0.0",
      typescript: ">=5.0.0",
      // ESLint plugins loaded by the generated eslint.config.mjs
      "eslint-plugin-react-compiler": ">=19.0.0",
      "eslint-plugin-react-hooks": ">=5.0.0",
      "eslint-plugin-simple-import-sort": ">=12.0.0",
      "typescript-eslint": ">=8.0.0",
    },
  },
};

export default config;
