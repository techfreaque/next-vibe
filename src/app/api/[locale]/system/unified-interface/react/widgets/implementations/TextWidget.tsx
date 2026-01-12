"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import {
  extractTextData,
  formatIfDate,
  formatText,
  type TextEmphasis,
  type TextVariant,
} from "../../../shared/widgets/logic/text";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getSpacingClassName,
  getTextFormatClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Get CSS class for text variant styling
 */
function getTextVariantClassName(variant: TextVariant): string {
  switch (variant) {
    case "error":
      return "text-destructive";
    case "success":
      return "text-green-600 dark:text-green-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
    case "muted":
      return "text-muted-foreground";
    default:
      return "";
  }
}

/**
 * Get CSS class for text emphasis styling
 */
function getTextEmphasisClassName(emphasis: TextEmphasis): string {
  switch (emphasis) {
    case "bold":
      return "font-bold";
    case "italic":
      return "italic";
    case "underline":
      return "underline";
    default:
      return "";
  }
}

/**
 * Text Widget - Displays text data with comprehensive formatting options
 *
 * Renders text values with support for labels, links, dates, variants, emphasis, and alignment.
 * All rendering logic uses shared functions for consistency across platforms.
 *
 * UI Config Options:
 * - content: Static translation key for fixed text
 * - fieldType: Special formatting (DATE, DATETIME)
 * - label: Optional label displayed above text (TKey)
 * - variant: Color styling (error, success, warning, info, default)
 * - multiline: Multi-line text display (preserves newlines)
 * - emphasis: Text styling (bold, italic, underline)
 * - maxLength: Text truncation limit
 * - format: Display format (link, plain)
 * - href: Link destination when format="link"
 * - textAlign: Text alignment (left, center, right)
 *
 * Data Sources (priority order):
 * 1. Static content from field.ui.content
 * 2. Date formatting if fieldType is DATE or DATETIME
 * 3. Link formatting if format="link"
 * 4. Text data from value
 *
 * Data Formats Supported:
 * - string: Direct text (translated if translation key exists)
 * - number/boolean: Converted to string
 * - { text: string, truncate?: number, format?: TextFormat }: Full text object
 * - Date: Locale-aware formatting
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Text value to display
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function TextWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.TEXT, TKey>): JSX.Element {
  const {
    content,
    fieldType,
    label: labelKey,
    variant,
    multiline,
    emphasis,
    maxLength,
    format,
    href,
    textAlign,
    size = "base",
    gap,
    padding,
  } = field.ui;
  const label = labelKey ? context.t(labelKey) : undefined;

  // Text alignment classes
  const alignmentClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
        ? "text-right"
        : "";

  // Size class from config (no hardcoding!)
  const sizeClass = getTextSizeClassName(size);

  // Spacing classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const paddingClass = getSpacingClassName("padding", padding);

  // Variant and emphasis styling classes
  const variantClass = variant ? getTextVariantClassName(variant) : "";
  const emphasisClass = emphasis ? getTextEmphasisClassName(emphasis) : "";
  const styleClasses = cn(sizeClass, variantClass, emphasisClass);

  // Handle static content from UI config
  if (content) {
    const translatedContent = context.t(content);
    const displayText = formatText(translatedContent, maxLength);

    const textElement = multiline ? (
      <Span className={cn("whitespace-pre-wrap", styleClasses)}>
        {displayText}
      </Span>
    ) : (
      <Span className={styleClasses}>{displayText}</Span>
    );

    if (label) {
      return (
        <Div
          className={cn(
            "flex flex-col",
            gapClass || "gap-1.5",
            alignmentClass,
            className,
          )}
        >
          <Label className=" font-medium">{label}</Label>
          {textElement}
        </Div>
      );
    }

    return <Div className={cn(alignmentClass, className)}>{textElement}</Div>;
  }

  // Handle date formatting if fieldType is DATE or DATETIME
  const dateFormatted = formatIfDate(value, fieldType, context.locale);
  if (dateFormatted) {
    const displayText = formatText(dateFormatted, maxLength);
    return (
      <Div className={cn(alignmentClass, className)}>
        {label && <Label className=" font-medium">{label}</Label>}
        <Span className={cn("font-mono ", styleClasses)}>{displayText}</Span>
      </Div>
    );
  }

  // Handle format="link" with href from field.ui config
  if (format === "link" && href && content) {
    const linkText = context.t(content);
    const displayText = formatText(linkText, maxLength);
    // Prepend locale to href if it doesn't start with http
    const localizedHref = href.startsWith("http")
      ? href
      : `/${context.locale}${href.startsWith("/") ? "" : "/"}${href}`;

    return (
      <Div className={cn(paddingClass || "py-2", alignmentClass, className)}>
        <Link
          href={localizedHref as Route}
          className=" text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
        >
          {displayText}
        </Link>
      </Div>
    );
  }

  // Extract data using shared logic with translation context
  const data = extractTextData(value, context);

  // No data - show empty placeholder
  if (!data) {
    const emptyElement = <Span className="text-muted-foreground">—</Span>;

    if (label) {
      return (
        <Div
          className={cn(
            "flex flex-col",
            gapClass || "gap-1.5",
            alignmentClass,
            className,
          )}
        >
          <Label className=" font-medium">{label}</Label>
          {emptyElement}
        </Div>
      );
    }

    return <Div className={cn(alignmentClass, className)}>{emptyElement}</Div>;
  }

  const { text, truncate, format: dataFormat } = data;
  const displayText = formatText(text, maxLength || truncate);
  const normalizedFormat =
    dataFormat === "plain" || dataFormat === "link" ? "normal" : dataFormat;
  const formatClassName = getTextFormatClassName(normalizedFormat);

  const textElement = multiline ? (
    <Span className={cn(formatClassName, styleClasses, "whitespace-pre-wrap")}>
      {displayText}
    </Span>
  ) : (
    <Span className={cn(formatClassName, styleClasses)}>{displayText}</Span>
  );

  if (label) {
    return (
      <Div
        className={cn(
          "flex flex-col",
          gapClass || "gap-1.5",
          alignmentClass,
          className,
        )}
      >
        <Label className=" font-medium">{label}</Label>
        {textElement}
      </Div>
    );
  }

  return <Div className={cn(alignmentClass, className)}>{textElement}</Div>;
}

TextWidget.displayName = "TextWidget";
