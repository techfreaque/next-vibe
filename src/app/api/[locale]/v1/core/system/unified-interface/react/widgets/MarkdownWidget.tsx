"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type {
  MarkdownWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";

/**
 * Type guard for MarkdownWidgetData
 */
function isMarkdownWidgetData(
  data: RenderableValue,
): data is MarkdownWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "content" in data &&
    typeof data.content === "string"
  );
}

/**
 * Markdown Widget Component
 * Renders markdown content with optional sanitization
 */
export function MarkdownWidget({
  data,
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!isMarkdownWidgetData(data)) {
    return (
      <Div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        —
      </Div>
    );
  }

  const { content } = data;

  if (!content) {
    return (
      <Div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        {t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.markdown.noContent",
        )}
      </Div>
    );
  }

  return (
    <Div
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
    </Div>
  );
}

MarkdownWidget.displayName = "MarkdownWidget";
