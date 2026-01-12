/**
 * Code Quality Files Widget Renderer
 * Renders list of affected files with error counts
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { formatFilePath } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class CodeQualityFilesWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CODE_QUALITY_FILES
> {
  readonly widgetType = WidgetType.CODE_QUALITY_FILES;

  render(
    props: CLIWidgetProps<typeof WidgetType.CODE_QUALITY_FILES, string>,
  ): string {
    const { value, context } = props;

    if (!Array.isArray(value) || value.length === 0) {
      return "";
    }

    const result: string[] = [];

    // Header
    const headerIcon = context.options.useEmojis ? "📂 " : "";
    const headerText = this.styleText(
      `${headerIcon}Affected Files`,
      "bold",
      context,
    );
    result.push(headerText);

    // Separator
    const separator = "─".repeat(50);
    result.push(this.styleText(separator, "dim", context));

    // Render each file
    for (const fileData of value) {
      if (typeof fileData !== "object" || fileData === null) {
        continue;
      }

      const file =
        "file" in fileData && typeof fileData.file === "string"
          ? fileData.file
          : "";
      const errors =
        "errors" in fileData && typeof fileData.errors === "number"
          ? fileData.errors
          : 0;
      const warnings =
        "warnings" in fileData && typeof fileData.warnings === "number"
          ? fileData.warnings
          : 0;
      const total =
        "total" in fileData && typeof fileData.total === "number"
          ? fileData.total
          : 0;

      if (!file) {
        continue;
      }

      const displayPath = formatFilePath(file);

      // Build count text
      const parts: string[] = [];
      if (errors > 0) {
        parts.push(`${errors} error${errors !== 1 ? "s" : ""}`);
      }
      if (warnings > 0) {
        parts.push(`${warnings} warning${warnings !== 1 ? "s" : ""}`);
      }

      const countText =
        parts.length > 0
          ? parts.join(", ")
          : `${total} issue${total !== 1 ? "s" : ""}`;

      result.push(`   ${displayPath} (${countText})`);
    }

    return result.join("\n");
  }
}
