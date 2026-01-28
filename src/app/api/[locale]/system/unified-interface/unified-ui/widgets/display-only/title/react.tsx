/**
 * Title Widget - Platform-agnostic React implementation
 * Displays semantic HTML headings (H1-H6) with optional subtitle
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Title } from "next-vibe-ui/ui/title";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";

import type { FieldUsageConfig } from "../../_shared/types";
import { formatIfDate } from "../text/shared";
import { extractTitleData } from "./shared";
import type { TitleWidgetConfig, TitleWidgetSchema } from "./types";

/**
 * Helper to get alignment class from config value
 */
function getAlignmentClass(
  align: "left" | "center" | "right" | undefined,
): string {
  if (!align) {
    return "text-left";
  }
  return {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];
}

/**
 * Title Widget - Renders semantic HTML headings (H1-H6) with styling
 *
 * Displays hierarchical headings with optional subtitle and text alignment.
 *
 * UI Config Options:
 * - content: Static translation key for fixed title text
 * - level: Heading level 1-6 (overrides value level)
 * - fieldType: Special formatting (DATE, DATETIME)
 * - textAlign: Text alignment (left, center, right)
 * - size: Text size
 * - gap: Gap between title and subtitle
 * - subtitleGap: Subtitle margin top
 *
 * Data Sources (priority order):
 * 1. Static content from field.content
 * 2. Date formatting if fieldType is DATE or DATETIME
 * 3. Title data from value
 *
 * Data Formats Supported:
 * - string: Direct text (translated if translation key exists)
 * - { text: string, subtitle?: string }
 * - null/undefined: Shows "—" placeholder
 */
export function TitleWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactWidgetProps<
        TEndpoint,
        TitleWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactWidgetProps<
        TEndpoint,
        TitleWidgetConfig<TKey, TitleWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field, context } = props;
  const {
    content,
    level: configLevel,
    fieldType,
    textAlign,
    size,
    gap,
    subtitleGap,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const sizeClass = getTextSizeClassName(size);
  const gapClass = getSpacingClassName("gap", gap);
  const subtitleGapClass = getSpacingClassName("margin", subtitleGap) || "mt-2";

  // Handle static content from UI config
  if (content) {
    const translatedContent = context.t(content);
    const level = configLevel ?? 2;
    const alignmentClass = getAlignmentClass(textAlign);

    // For card titles (simple display)
    if (level >= 4) {
      return (
        <Div
          className={cn("font-medium", sizeClass, alignmentClass, className)}
        >
          {translatedContent}
        </Div>
      );
    }

    return (
      <Div className={cn("flex flex-col", gapClass, alignmentClass, className)}>
        <Title level={level} className="leading-tight">
          {translatedContent}
        </Title>
      </Div>
    );
  }

  // Handle date formatting if fieldType is DATE or DATETIME
  const dateFormatted = formatIfDate(field.value, fieldType, context.locale);
  if (dateFormatted) {
    const level = configLevel ?? 2;
    const alignmentClass = getAlignmentClass(textAlign);

    return (
      <Div className={cn("flex flex-col", gapClass, alignmentClass, className)}>
        <Title level={level} className="leading-tight font-mono">
          {dateFormatted}
        </Title>
      </Div>
    );
  }

  // value is properly typed from schema - no assertions needed
  // Extract data using shared logic with translation context
  const data = extractTitleData(field.value, context);

  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        <Span>—</Span>
      </Div>
    );
  }

  // Apply config from field.ui (level and align come from config, not data)
  const finalLevel = configLevel ?? 2;
  const finalAlign = textAlign ?? "left";
  const { text, subtitle } = data;

  const alignmentClass = getAlignmentClass(finalAlign);

  // For card titles (no subtitle, simple display), render as font-medium text
  if (!subtitle && finalLevel >= 4) {
    return (
      <Div className={cn("font-medium", sizeClass, alignmentClass, className)}>
        {text}
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-col", gapClass, alignmentClass, className)}>
      <Title level={finalLevel} className="leading-tight">
        {text}
      </Title>

      {subtitle && (
        <Span
          className={cn(subtitleGapClass, sizeClass, "text-muted-foreground")}
        >
          {subtitle}
        </Span>
      )}
    </Div>
  );
}

TitleWidget.displayName = "TitleWidget";

export default TitleWidget;
