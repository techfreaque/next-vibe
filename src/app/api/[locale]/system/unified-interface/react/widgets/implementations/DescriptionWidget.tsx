"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractDescriptionData } from "../../../shared/widgets/logic/description";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Description Widget - Displays descriptive text with truncation
 *
 * Renders muted, small text typically used for descriptions or supplementary information.
 * Automatically translates text values and truncates to 2 lines with ellipsis.
 *
 * Features:
 * - Automatic text truncation (line-clamp-2)
 * - Muted styling for secondary content
 * - Small text size for compact display
 * - Automatic translation of string values via shared logic
 *
 * Data Format:
 * - string: Direct text value (translated via context.t)
 * - Other types: Converted to string and displayed
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Description text to display
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function DescriptionWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.DESCRIPTION, TKey>): JSX.Element {
  const { textSize, spacing, lineClamp } = field.ui;

  // Get classes from config (no hardcoding!)
  const textSizeClass = getTextSizeClassName(textSize);
  const spacingClass = getSpacingClassName("margin", spacing);

  // Line clamp mapping
  const lineClampClass =
    lineClamp === 1
      ? "line-clamp-1"
      : lineClamp === 2
        ? "line-clamp-2"
        : lineClamp === 3
          ? "line-clamp-3"
          : lineClamp === 4
            ? "line-clamp-4"
            : lineClamp === 5
              ? "line-clamp-5"
              : lineClamp === 6
                ? "line-clamp-6"
                : lineClamp === "none"
                  ? ""
                  : "line-clamp-2";

  // Extract data using shared logic with translation context
  const data = extractDescriptionData(value, context);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  const { text } = data;

  return (
    <Div
      className={cn(
        "text-muted-foreground",
        textSizeClass || "text-xs",
        spacingClass || "mt-1.5",
        lineClampClass,
        className,
      )}
    >
      {text}
    </Div>
  );
}

DescriptionWidget.displayName = "DescriptionWidget";
