/**
 * Report Generator Service
 * Generates build reports
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";
import type {
  BuildProfile,
  BuildReport,
  BuildStepResult,
  CacheStats,
  TranslateFunction,
} from "./types";

// ============================================================================
// Interface
// ============================================================================

export interface IReportGenerator {
  /**
   * Generate a JSON build report
   */
  generate(
    report: BuildReport,
    output: string[],
    t: TranslateFunction,
  ): Promise<string>;

  /**
   * Append build summary to output
   */
  appendBuildSummary(
    output: string[],
    stepResults: BuildStepResult[],
    totalDuration: number,
    filesBuilt: string[],
    filesCopied: string[],
    t: TranslateFunction,
    profile: BuildProfile,
  ): void;

  /**
   * Format cache statistics
   */
  formatCacheStats(stats: CacheStats, t: TranslateFunction): string;
}

// ============================================================================
// Implementation
// ============================================================================

export class ReportGenerator implements IReportGenerator {
  async generate(
    report: BuildReport,
    output: string[],
    t: TranslateFunction,
  ): Promise<string> {
    output.push(
      outputFormatter.formatStep(t("app.api.system.builder.messages.generatingReport")),
    );

    const reportPath = resolve(ROOT_DIR, "dist", "build-report.json");
    const reportDir = dirname(reportPath);

    if (!existsSync(reportDir)) {
      mkdirSync(reportDir, { recursive: true });
    }

    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

    const relativePath = "dist/build-report.json";
    output.push(
      outputFormatter.formatSuccess(
        t("app.api.system.builder.messages.reportGenerated", { path: relativePath }),
      ),
    );

    return relativePath;
  }

  appendBuildSummary(
    output: string[],
    stepResults: BuildStepResult[],
    totalDuration: number,
    filesBuilt: string[],
    filesCopied: string[],
    t: TranslateFunction,
    profile: BuildProfile,
  ): void {
    output.push(`\n${"─".repeat(60)}`);
    output.push(
      `📊 ${t("app.api.system.builder.messages.buildSummary")} [${profile.toUpperCase()}]`,
    );
    output.push(
      `  ⏱  ${t("app.api.system.builder.messages.totalDuration")}: ${totalDuration}ms`,
    );
    output.push(
      `  📦 ${t("app.api.system.builder.messages.filesBuilt")}: ${filesBuilt.length}`,
    );
    output.push(
      `  📋 ${t("app.api.system.builder.messages.filesCopiedCount")}: ${filesCopied.length}`,
    );

    // Per-step breakdown
    if (stepResults.length > 0) {
      output.push(`  ${t("app.api.system.builder.messages.stepsCompleted")}:`);
      for (const step of stepResults) {
        let stepInfo = `    ${step.success ? "✓" : "✖"} ${step.step}: ${step.duration}ms`;
        if (step.size) {
          stepInfo += ` (${outputFormatter.formatBytes(step.size)})`;
        }
        output.push(stepInfo);

        // Show step warnings
        if (step.warnings?.length) {
          for (const warning of step.warnings) {
            output.push(`      ⚠ ${warning}`);
          }
        }
      }
    }
  }

  formatCacheStats(stats: CacheStats, t: TranslateFunction): string {
    const hitRate =
      stats.hits + stats.misses > 0
        ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)
        : "0";

    return t("app.api.system.builder.messages.cacheStats", {
      hits: stats.hits,
      misses: stats.misses,
      hitRate,
    });
  }
}

// Singleton instance
export const reportGenerator = new ReportGenerator();
