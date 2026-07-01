/**
 * Report Generator Service
 * Generates build reports
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { scopedTranslation } from "../i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

import type { BuildProfile, BuildReport, BuildStepResult } from "../definition";
import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Interface
// ============================================================================

export interface IReportGenerator {
  /**
   * Generate a JSON build report
   */
  generate(report: BuildReport, output: string[], t: ModuleT): Promise<string>;

  /**
   * Append build summary to output
   */
  appendBuildSummary(
    output: string[],
    stepResults: BuildStepResult[],
    totalDuration: number,
    filesBuilt: string[],
    filesCopied: string[],
    t: ModuleT,
    profile: BuildProfile,
  ): void;
}

// ============================================================================
// Implementation
// ============================================================================

export class ReportGenerator implements IReportGenerator {
  async generate(
    report: BuildReport,
    output: string[],
    t: ModuleT,
  ): Promise<string> {
    output.push(outputFormatter.formatStep(t("messages.generatingReport")));

    const reportPath = resolve(ROOT_DIR, "dist", "build-report.json");
    const reportDir = dirname(reportPath);

    if (!existsSync(reportDir)) {
      mkdirSync(reportDir, { recursive: true });
    }

    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

    const relativePath = "dist/build-report.json";
    output.push(
      outputFormatter.formatSuccess(
        t("messages.reportGenerated", {
          path: relativePath,
        }),
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
    t: ModuleT,
    profile: BuildProfile,
  ): void {
    output.push(`\n${"─".repeat(60)}`);
    output.push(`📊 ${t("messages.buildSummary")} [${profile.toUpperCase()}]`);
    output.push(`  ⏱  ${t("messages.totalDuration")}: ${totalDuration}ms`);
    output.push(`  📦 ${t("messages.filesBuilt")}: ${filesBuilt.length}`);
    output.push(
      `  📋 ${t("messages.filesCopiedCount")}: ${filesCopied.length}`,
    );

    // Per-step breakdown
    if (stepResults.length > 0) {
      output.push(`  ${t("messages.stepsCompleted")}:`);
      for (const step of stepResults) {
        let stepInfo = `    ${step.success ? "✓" : "✖"} ${step.step}: ${step.duration}ms`;
        if (step.size !== undefined && step.size > 0) {
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
}

// Singleton instance
export const reportGenerator = new ReportGenerator();
