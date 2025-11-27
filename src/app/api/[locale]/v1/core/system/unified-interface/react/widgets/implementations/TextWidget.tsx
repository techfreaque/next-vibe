"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
import {
  extractTextData,
  formatText,
} from "../../../shared/widgets/logic/text";
import { getTextFormatClassName } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Text Widget Component
 * Displays text data
 */
export function TextWidget({
  value,
  field: _field,
  context: _context,
  className,
}: WidgetComponentProps): JSX.Element {
  // Extract data using shared logic
  const data = extractTextData(value);

  // Handle null case
  if (!data) {
    return (
      <Span className={cn("text-muted-foreground italic", className)}>—</Span>
    );
  }

  const { text, truncate, format } = data;
  const displayText = formatText(text, truncate);

  // Get format class using shared logic - handle "plain" as "normal"
  const normalizedFormat = format === "plain" ? "normal" : format;
  const formatClassName = getTextFormatClassName(normalizedFormat);

  return <Span className={cn(formatClassName, className)}>{displayText}</Span>;
}

TextWidget.displayName = "TextWidget";
