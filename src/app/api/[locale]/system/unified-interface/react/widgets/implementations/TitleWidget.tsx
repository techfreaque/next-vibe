"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Title } from "next-vibe-ui/ui/title";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { formatIfDate } from "../../../shared/widgets/logic/text";
import { extractTitleData } from "../../../shared/widgets/logic/title";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Helper to get alignment class from config value
 */
function getAlignmentClass(align: "left" | "center" | "right" | undefined): string {
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
 * All rendering logic uses shared functions for consistency across platforms.
 *
 * UI Config Options:
 * - content: Static translation key for fixed title text
 * - level: Heading level 1-6 (overrides value level)
 * - fieldType: Special formatting (DATE, DATETIME)
 *
 * Data Sources (priority order):
 * 1. Static content from field.ui.content
 * 2. Date formatting if fieldType is DATE or DATETIME
 * 3. Title data from value
 *
 * Heading Levels:
 * - 1-3: Large display headings with prominent styling
 * - 4-6: Smaller headings, level 4+ without subtitle renders as simple font-medium text
 *
 * Data Formats Supported:
 * - string: Direct text (translated if translation key exists)
 * - { text: string, level?: 1-6, subtitle?: string, align?: "left"|"center"|"right" }
 * - Date: Locale-aware formatting
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Title value to display
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function TitleWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.TITLE, TKey>): JSX.Element {
  const { content, level: configLevel, fieldType, textAlign, size, gap, subtitleGap } = field.ui;

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
        <Div className={cn("font-medium", sizeClass, alignmentClass, className)}>
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
  const dateFormatted = formatIfDate(value, fieldType, context.locale);
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

  // Extract data using shared logic with translation context
  const data = extractTitleData(value, context);

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
    return <Div className={cn("font-medium", sizeClass, alignmentClass, className)}>{text}</Div>;
  }

  return (
    <Div className={cn("flex flex-col", gapClass, alignmentClass, className)}>
      <Title level={finalLevel} className="leading-tight">
        {text}
      </Title>

      {subtitle && (
        <Span className={cn(subtitleGapClass, sizeClass, "text-muted-foreground")}>{subtitle}</Span>
      )}
    </Div>
  );
}

TitleWidget.displayName = "TitleWidget";
