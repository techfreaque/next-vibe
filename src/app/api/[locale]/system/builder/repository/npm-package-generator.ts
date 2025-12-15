/**
 * NPM Package Generator Service
 * Generates package.json for npm distribution
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import type { NpmPackageConfig, PackageExportCondition } from "../definition";
import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Generated Package.json Type
// ============================================================================

/** Generated package.json structure - type-safe */
interface GeneratedPackageJson {
  name: string;
  version: string;
  description: string;
  type: "module" | "commonjs";
  license?: string;
  keywords?: string[];
  repository?: string | { type: string; url: string };
  bin?: Record<string, string>;
  main?: string;
  module?: string;
  types?: string;
  exports?: Record<string, PackageExportCondition>;
  files?: string[];
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

// ============================================================================
// Interface
// ============================================================================

export interface INpmPackageGenerator {
  /**
   * Generate package.json for npm distribution
   */
  generate(
    config: NpmPackageConfig,
    output: string[],
    filesCopied: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<string>;

  /**
   * Get version from main package.json
   */
  getMainPackageVersion(): Promise<string>;
}

// ============================================================================
// Implementation
// ============================================================================

export class NpmPackageGenerator implements INpmPackageGenerator {
  async generate(
    config: NpmPackageConfig,
    output: string[],
    filesCopied: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<string> {
    output.push(
      outputFormatter.formatSection(
        t("app.api.system.builder.messages.creatingPackageJson"),
      ),
    );
    logger.info("Generating npm package.json", { name: config.name });

    // Read version from main package.json if not provided
    let version = config.version;
    if (!version) {
      version = await this.getMainPackageVersion();
    }

    const packageJson: GeneratedPackageJson = {
      name: config.name,
      version,
      description: config.description ?? "",
      type: "module",
      ...(config.license && { license: config.license }),
      ...(config.keywords &&
        config.keywords.length > 0 && { keywords: config.keywords }),
      ...(config.repository && { repository: config.repository }),
      ...(config.bin && { bin: config.bin }),
      ...(config.main && { main: config.main }),
      ...(config.module && { module: config.module }),
      ...(config.types && { types: config.types }),
      ...(config.exports && { exports: config.exports }),
      ...(config.files && config.files.length > 0 && { files: config.files }),
      ...(config.dependencies &&
        Object.keys(config.dependencies).length > 0 && {
          dependencies: config.dependencies,
        }),
      ...(config.peerDependencies &&
        Object.keys(config.peerDependencies).length > 0 && {
          peerDependencies: config.peerDependencies,
        }),
    };

    const packageJsonContent = JSON.stringify(packageJson, null, 2);
    const outputPath = "dist/package.json";
    const fullOutputPath = resolve(ROOT_DIR, outputPath);

    output.push(outputFormatter.formatItem("package.json", `→ ${outputPath}`));

    if (!dryRun) {
      const outputDir = dirname(fullOutputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      writeFileSync(fullOutputPath, packageJsonContent, "utf-8");
    }

    filesCopied.push(outputPath);
    logger.info("Package.json generated", { path: outputPath });

    return packageJsonContent;
  }

  async getMainPackageVersion(): Promise<string> {
    try {
      const packageJsonPath = resolve(ROOT_DIR, "package.json");
      const content = readFileSync(packageJsonPath, "utf-8");
      const mainPackageJson = JSON.parse(content) as { version?: string };
      return mainPackageJson.version || "0.0.0";
    } catch {
      return "0.0.0";
    }
  }
}

// Singleton instance
export const npmPackageGenerator = new NpmPackageGenerator();
