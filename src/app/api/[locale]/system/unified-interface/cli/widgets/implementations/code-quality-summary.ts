/**
 * Code Quality Summary Widget Renderer
 * Renders summary statistics for code quality checks
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class CodeQualitySummaryWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_SUMMARY
> {
  readonly widgetType = WidgetType.CODE_QUALITY_SUMMARY;

  render(
    props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_SUMMARY, string>,
  ): string {
    const { value, context } = props;

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return "";
    }

    const result: string[] = [];

    // Header
    const headerIcon = context.options.useEmojis ? "📊 " : "";
    const headerText = this.styleText(`${headerIcon}Summary`, "bold", context);
    result.push(headerText);

    // Separator
    const separator = "─".repeat(50);
    result.push(this.styleText(separator, "dim", context));

    // Extract values
    const totalFiles =
      "totalFiles" in value && typeof value.totalFiles === "number"
        ? value.totalFiles
        : 0;
    const displayedFiles =
      "displayedFiles" in value && typeof value.displayedFiles === "number"
        ? value.displayedFiles
        : 0;
    const totalIssues =
      "totalIssues" in value && typeof value.totalIssues === "number"
        ? value.totalIssues
        : 0;
    const displayedIssues =
      "displayedIssues" in value && typeof value.displayedIssues === "number"
        ? value.displayedIssues
        : 0;
    const totalErrors =
      "totalErrors" in value && typeof value.totalErrors === "number"
        ? value.totalErrors
        : 0;

    const isTruncated =
      displayedIssues < totalIssues || displayedFiles < totalFiles;

    // Files stat
    if (isTruncated) {
      result.push(
        `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${displayedFiles} of ${totalFiles}`,
      );
    } else {
      result.push(
        `   ${this.styleText("Files:", "dim", context).padEnd(12)} ${totalFiles}`,
      );
    }

    // Issues stat
    if (isTruncated) {
      result.push(
        `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${displayedIssues} of ${totalIssues}`,
      );
    } else {
      result.push(
        `   ${this.styleText("Issues:", "dim", context).padEnd(12)} ${totalIssues}`,
      );
    }

    // Errors
    if (totalErrors > 0) {
      const errorIcon = context.options.useEmojis ? "❌ " : "";
      const errorText = this.styleText(
        `${totalErrors} error${totalErrors !== 1 ? "s" : ""}`,
        "red",
        context,
      );
      result.push(`   ${errorIcon}${errorText}`);
    }

    return result.join("\n");
  }
}
