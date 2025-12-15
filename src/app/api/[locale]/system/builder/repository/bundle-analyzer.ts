/**
 * Bundle Analyzer Service
 * Analyzes bundle sizes and provides optimization suggestions
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

import type { TFunction } from "@/i18n/core/static-types";

import type { BundleAnalysis } from "../definition";
import { ROOT_DIR, SIZE_THRESHOLDS } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Interface
// ============================================================================

export interface IBundleAnalyzer {
  /**
   * Analyze bundle sizes and generate optimization suggestions
   */
  analyze(
    outputDir: string,
    output: string[],
    t: TFunction,
  ): Promise<BundleAnalysis>;

  /**
   * Get all files recursively from a directory
   */
  getAllFiles(dir: string): Array<{ path: string; size: number }>;

  /**
   * Check if size exceeds warning threshold
   */
  isWarningSize(size: number): boolean;

  /**
   * Check if size exceeds critical threshold
   */
  isCriticalSize(size: number): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class BundleAnalyzer implements IBundleAnalyzer {
  async analyze(
    outputDir: string,
    output: string[],
    t: TFunction,
  ): Promise<BundleAnalysis> {
    const dirPath = resolve(ROOT_DIR, outputDir);
    const analysis: BundleAnalysis = {
      totalSize: 0,
      files: [],
      suggestions: [],
      warnings: [],
    };

    if (!existsSync(dirPath)) {
      return analysis;
    }

    const allFiles = this.getAllFiles(dirPath);
    analysis.totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);

    // Get top 5 largest files
    analysis.files = allFiles
      .toSorted((a, b) => b.size - a.size)
      .slice(0, 5)
      .map((f) => ({
        name: f.path,
        size: f.size,
        percentage: analysis.totalSize > 0 ? (f.size / analysis.totalSize) * 100 : 0,
      }));

    // Generate suggestions based on analysis
    if (analysis.totalSize > SIZE_THRESHOLDS.CRITICAL) {
      analysis.warnings.push(
        t("app.api.system.builder.analysis.criticalSize", {
          size: outputFormatter.formatBytes(analysis.totalSize),
        }),
      );
      analysis.suggestions.push(t("app.api.system.builder.analysis.considerTreeShaking"));
      analysis.suggestions.push(t("app.api.system.builder.analysis.checkLargeDeps"));
    } else if (analysis.totalSize > SIZE_THRESHOLDS.WARNING) {
      analysis.warnings.push(
        t("app.api.system.builder.analysis.largeBundle", {
          size: outputFormatter.formatBytes(analysis.totalSize),
        }),
      );
    }

    // Check for common issues
    const jsFiles = allFiles.filter(
      (f) => f.path.endsWith(".js") || f.path.endsWith(".mjs"),
    );
    const mapFiles = allFiles.filter((f) => f.path.endsWith(".map"));

    if (mapFiles.length > 0) {
      const mapSize = mapFiles.reduce((sum, f) => sum + f.size, 0);
      if (mapSize > analysis.totalSize * 0.5) {
        analysis.suggestions.push(t("app.api.system.builder.analysis.largeSourcemaps"));
      }
    }

    // Check for duplicate-looking files
    const baseNames = jsFiles.map((f) => basename(f.path, extname(f.path)));
    const duplicates = baseNames.filter(
      (name, idx) => baseNames.indexOf(name) !== idx,
    );
    if (duplicates.length > 0) {
      analysis.suggestions.push(t("app.api.system.builder.analysis.possibleDuplicates"));
    }

    // Output analysis
    if (analysis.files.length > 0) {
      output.push(
        outputFormatter.formatSection(t("app.api.system.builder.messages.bundleAnalysis")),
      );
      output.push(
        outputFormatter.formatItem(
          t("app.api.system.builder.analysis.totalSize"),
          outputFormatter.formatBytes(analysis.totalSize),
        ),
      );
      output.push(
        outputFormatter.formatStep(t("app.api.system.builder.analysis.largestFiles")),
      );
      for (const file of analysis.files) {
        output.push(
          outputFormatter.formatItem(
            `  ${file.name}`,
            `${outputFormatter.formatBytes(file.size)} (${file.percentage.toFixed(1)}%)`,
          ),
        );
      }
    }

    return analysis;
  }

  getAllFiles(dir: string): Array<{ path: string; size: number }> {
    const files: Array<{ path: string; size: number }> = [];
    const basePath = dir;

    const processDir = (currentDir: string): void => {
      try {
        const entries = readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = resolve(currentDir, entry.name);
          if (entry.isDirectory()) {
            processDir(fullPath);
          } else {
            const stats = statSync(fullPath);
            files.push({
              path: fullPath.replace(basePath, ""),
              size: stats.size,
            });
          }
        }
      } catch {
        // Ignore errors reading directory
      }
    };

    processDir(dir);
    return files;
  }

  isWarningSize(size: number): boolean {
    return size > SIZE_THRESHOLDS.WARNING;
  }

  isCriticalSize(size: number): boolean {
    return size > SIZE_THRESHOLDS.CRITICAL;
  }
}

// Singleton instance
export const bundleAnalyzer = new BundleAnalyzer();
