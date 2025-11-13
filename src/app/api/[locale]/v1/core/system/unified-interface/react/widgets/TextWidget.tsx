"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
/**
 * Text Widget Component
 * Simple text display with optional formatting
 */
export function TextWidget({
  data,
  metadata: _metadata,
  context: _context,
  className,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const value =
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
      ? String(data)
      : "";

  if (!value) {
    return (
      <Span className={cn("text-muted-foreground italic", className)}>—</Span>
    );
  }

  return <Span className={cn("text-foreground", className)}>{value}</Span>;
}

TextWidget.displayName = "TextWidget";
