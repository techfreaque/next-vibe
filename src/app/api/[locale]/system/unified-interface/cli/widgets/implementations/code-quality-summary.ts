/**
 * Code Quality Summary Widget Renderer
 *
 * Handles CODE_QUALITY_SUMMARY widget type for CLI display.
 * Displays summary statistics for code quality checks including file counts,
 * issue counts, and error totals. Shows truncation indicators when results
 * are limited.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  isWidgetDataNumber,
  isWidgetDataObject,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class CodeQualitySummaryWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_SUMMARY
> {
  readonly widgetType = WidgetType.CODE_QUALITY_SUMMARY;

  /**
   * Render code quality summary with file and issue statistics.
   * Displays total files, total issues, and error counts.
   * Shows "X of Y" format when results are truncated.
   */
  render(
    props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_SUMMARY, string>,
  ): string {
    const { value, context } = props;

    if (!isWidgetDataObject(value)) {
      return "";
    }

    const result: string[] = [];

    // Header
    const headerIcon = context.options.useEmojis ? "📊 " : "";
    const headerTitle = context.t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.codeQualitySummary.summary",
    );
    const headerText = this.styleText(
      `${headerIcon}${headerTitle}`,
      "bold",
      context,
    );
    result.push(headerText);

    // Separator
    result.push(this.createSeparator(50));

    // Extract values
    const totalFiles = isWidgetDataNumber(value.totalFiles)
      ? value.totalFiles
      : 0;
    const displayedFiles = isWidgetDataNumber(value.displayedFiles)
      ? value.displayedFiles
      : 0;
    const totalIssues = isWidgetDataNumber(value.totalIssues)
      ? value.totalIssues
      : 0;
    const displayedIssues = isWidgetDataNumber(value.displayedIssues)
      ? value.displayedIssues
      : 0;
    const totalErrors = isWidgetDataNumber(value.totalErrors)
      ? value.totalErrors
      : 0;

    const isTruncated =
      displayedIssues < totalIssues || displayedFiles < totalFiles;

    // Files stat
    const filesLabel = context.t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.codeQualitySummary.files",
    );
    if (isTruncated) {
      const ofText = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.of",
      );
      result.push(
        `   ${this.styleText(`${filesLabel}:`, "dim", context).padEnd(12)} ${displayedFiles} ${ofText} ${totalFiles}`,
      );
    } else {
      result.push(
        `   ${this.styleText(`${filesLabel}:`, "dim", context).padEnd(12)} ${totalFiles}`,
      );
    }

    // Issues stat
    const issuesLabel = context.t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.issues",
    );
    if (isTruncated) {
      const ofText = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.of",
      );
      result.push(
        `   ${this.styleText(`${issuesLabel}:`, "dim", context).padEnd(12)} ${displayedIssues} ${ofText} ${totalIssues}`,
      );
    } else {
      result.push(
        `   ${this.styleText(`${issuesLabel}:`, "dim", context).padEnd(12)} ${totalIssues}`,
      );
    }

    // Errors
    if (totalErrors > 0) {
      const errorIcon = context.options.useEmojis ? "❌ " : "";
      const errorWord =
        totalErrors === 1
          ? context.t(
              "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.error",
            )
          : context.t(
              "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.errors",
            );
      const errorText = this.styleText(
        `${totalErrors} ${errorWord}`,
        "red",
        context,
      );
      result.push(`   ${errorIcon}${errorText}`);
    }

    return result.join("\n");
  }
}
