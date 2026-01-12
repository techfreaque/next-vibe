/**
 * Code Quality Files Widget Renderer
 *
 * Handles CODE_QUALITY_FILES widget type for CLI display.
 * Displays a list of files affected by code quality issues with error and warning counts.
 * Shows total issues per file with color-coded severity indicators.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  isWidgetDataArray,
  isWidgetDataNumber,
  isWidgetDataObject,
  isWidgetDataString,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";
import { formatFilePath } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class CodeQualityFilesWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_FILES
> {
  readonly widgetType = WidgetType.CODE_QUALITY_FILES;

  /**
   * Render list of files with code quality issues.
   * Each file displays its path and counts of errors, warnings, or total issues.
   * Uses file path formatting for better readability in CLI.
   */
  render(
    props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_FILES, string>,
  ): string {
    const { value, context } = props;

    if (!isWidgetDataArray(value) || value.length === 0) {
      return "";
    }

    const result: string[] = [];

    // Header
    const headerIcon = context.options.useEmojis ? "📂 " : "";
    const headerTitle = context.t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.codeQualityFiles.affectedFiles",
    );
    const headerText = this.styleText(
      `${headerIcon}${headerTitle}`,
      "bold",
      context,
    );
    result.push(headerText);

    // Separator
    result.push(this.createSeparator(50));

    // Render each file
    for (const fileData of value) {
      if (!isWidgetDataObject(fileData)) {
        continue;
      }

      const file = isWidgetDataString(fileData.file, context);
      if (!file) {
        continue;
      }

      const errors = isWidgetDataNumber(fileData.errors) ? fileData.errors : 0;
      const warnings = isWidgetDataNumber(fileData.warnings)
        ? fileData.warnings
        : 0;
      const total = isWidgetDataNumber(fileData.total) ? fileData.total : 0;

      const displayPath = formatFilePath(file);

      // Build count text
      const parts: string[] = [];
      if (errors > 0) {
        const errorWord =
          errors === 1
            ? context.t(
                "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.error",
              )
            : context.t(
                "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.errors",
              );
        parts.push(`${errors} ${errorWord}`);
      }
      if (warnings > 0) {
        const warningWord =
          warnings === 1
            ? context.t(
                "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.warning",
              )
            : context.t(
                "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.warnings",
              );
        parts.push(`${warnings} ${warningWord}`);
      }

      const countText =
        parts.length > 0
          ? parts.join(", ")
          : `${total} ${
              total === 1
                ? context.t(
                    "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.issue",
                  )
                : context.t(
                    "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.issues",
                  )
            }`;

      result.push(`   ${displayPath} (${countText})`);
    }

    return result.join("\n");
  }
}
