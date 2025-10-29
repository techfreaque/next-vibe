"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { RenderableValue, WidgetComponentProps } from "../types";

/**
 * Text Widget Component
 * Simple text display with optional formatting
 */
export function TextWidget({
  data,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const value =
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
      ? String(data)
      : "";

  if (!value) {
    return (
      <span
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        —
      </span>
    );
  }

  return (
    <span className={cn("text-foreground", className)} style={style}>
      {value}
    </span>
  );
}

TextWidget.displayName = "TextWidget";
