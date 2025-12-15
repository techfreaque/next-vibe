/**
 * Report Generator Service
 * Generates build reports
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { TFunction } from "@/i18n/core/static-types";

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
  generate(
    report: BuildReport,
    output: string[],
    t: TFunction,
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
    t: TFunction,
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
    t: TFunction,
  ): Promise<string> {
    output.push(
      outputFormatter.formatStep(
        t("app.api.system.builder.messages.generatingReport"),
      ),
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
        t("app.api.system.builder.messages.reportGenerated", {
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
    t: TFunction,
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
