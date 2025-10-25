"use client";

import { cn } from "next-vibe/shared/utils";
import { Markdown } from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { MarkdownWidgetData, WidgetComponentProps } from "../types";

/**
 * Markdown Widget Component
 * Renders markdown content with optional sanitization
 */
export function MarkdownWidget({
  data,
  className,
  style,
}: WidgetComponentProps<MarkdownWidgetData>): JSX.Element {
  const { content } = data;

  if (!content) {
    return (
      <div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        {/* eslint-disable-next-line i18next/no-literal-string */}
        {"No content"}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        className,
      )}
      style={style}
    >
      <Markdown content={content} />
    </div>
  );
}

MarkdownWidget.displayName = "MarkdownWidget";
