"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextFormatClassName,
  getTextSizeClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { FieldUsageConfig } from "../../_shared/types";
import { extractTextData, formatIfDate, formatText } from "./shared";
import type { TextEmphasis, TextVariant, TextWidgetSchema } from "./types";
import type { TextWidgetConfig } from "./types";

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
 * 1. Static content from field.content
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
 * @param value - Text value to display (properly typed from schema)
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale and translator
 */
export function TextWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactStaticWidgetProps<
        TEndpoint,
        TUsage,
        TextWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        TextWidgetConfig<TKey, TextWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const {
    content,
    contentParams,
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
    className: fieldClassName,
  } = field;
  const usage = "usage" in field ? field.usage : undefined;
  const label = labelKey ? t(labelKey) : undefined;

  // Get value from form for request fields, otherwise from value
  let value;
  if (usage?.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value && "value" in field) {
      value = field.value;
    }
  } else if ("value" in field) {
    value = field.value;
  }

  // Text alignment classes
  const alignmentClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
        ? "text-right"
        : "";

  // Size class from config
  const sizeClass = getTextSizeClassName(size);

  // Spacing classes from config
  const gapClass = getSpacingClassName("gap", gap);
  const paddingClass = getSpacingClassName("padding", padding);

  // Variant and emphasis styling classes
  const variantClass = variant ? getTextVariantClassName(variant) : "";
  const emphasisClass = emphasis ? getTextEmphasisClassName(emphasis) : "";

  // Apply dynamic className callback if present
  const dynamicClassName = field.getClassName
    ? field.getClassName(value, field.parentValue)
    : "";

  // Merge all className sources: field className, dynamic className, and external className
  const styleClasses = cn(
    sizeClass,
    variantClass,
    emphasisClass,
    fieldClassName,
    dynamicClassName,
  );

  // Handle date formatting if fieldType is DATE or DATETIME
  const dateFormatted = formatIfDate(value, fieldType, locale);
  if (dateFormatted) {
    const displayText = formatText(dateFormatted, maxLength);
    return (
      <Div className={alignmentClass}>
        {label && <Label className=" font-medium">{label}</Label>}
        <Span className={cn("font-mono ", styleClasses)}>{displayText}</Span>
      </Div>
    );
  }

  // Handle format="link" with href from field.ui config
  if (format === "link" && href && content) {
    const linkText = t(content, contentParams);
    const displayText = formatText(linkText, maxLength);
    // Prepend locale to href if it doesn't start with http
    const localizedHref = href.startsWith("http")
      ? href
      : `/${locale}${href.startsWith("/") ? "" : "/"}${href}`;

    return (
      <Div className={cn("flex", paddingClass || "py-2", alignmentClass)}>
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
  // value is properly typed from schema - no assertions needed
  const data = extractTextData(value, t);

  // No data - show empty placeholder
  if (!data) {
    // Handle static content from UI config
    if (content) {
      const translatedContent = t(content, contentParams);
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
            )}
          >
            <Label className=" font-medium">{label}</Label>
            {textElement}
          </Div>
        );
      }

      return <Div className={cn("flex", alignmentClass)}>{textElement}</Div>;
    }

    const emptyElement = <Span className="text-muted-foreground">—</Span>;

    if (label) {
      return (
        <Div
          className={cn("flex flex-col", gapClass || "gap-1.5", alignmentClass)}
        >
          <Label className=" font-medium">{label}</Label>
          {emptyElement}
        </Div>
      );
    }

    return <></>;
  }

  const { text, truncate, format: dataFormat } = data;
  const displayText = formatText(text, maxLength || truncate);
  const normalizedFormat =
    dataFormat === "plain" || dataFormat === "link" ? "normal" : dataFormat;
  const formatClassName = getTextFormatClassName(normalizedFormat);

  const textElement = multiline ? (
    <Span
      className={cn(
        "flex",
        formatClassName,
        styleClasses,
        "whitespace-pre-wrap",
      )}
    >
      {displayText}
    </Span>
  ) : (
    <Span
      className={cn(
        "flex",

        formatClassName,
        styleClasses,
      )}
    >
      {displayText}
    </Span>
  );

  if (label) {
    return (
      <Div
        className={cn("flex flex-col", gapClass || "gap-1.5", alignmentClass)}
      >
        <Label className=" font-medium">{label}</Label>
        {textElement}
      </Div>
    );
  }

  return <Div className={alignmentClass}>{textElement}</Div>;
}

TextWidget.displayName = "TextWidget";

export default TextWidget;
