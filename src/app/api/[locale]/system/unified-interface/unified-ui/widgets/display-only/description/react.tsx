"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { DescriptionWidgetConfig } from "./types";

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
export function DescriptionWidget<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  DescriptionWidgetConfig<TSchema, TUsage, "primitive">
>): JSX.Element {
  const t = useWidgetTranslation();
  const { textSize, spacing, lineClamp, className } = field;

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

  if (!field.value) {
    return <Div className={className}>—</Div>;
  }

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
      {t(field.value)}
    </Div>
  );
}

DescriptionWidget.displayName = "DescriptionWidget";

export default DescriptionWidget;
