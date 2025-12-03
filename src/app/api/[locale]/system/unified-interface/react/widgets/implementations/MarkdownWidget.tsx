"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
import { extractMarkdownData } from "../../../shared/widgets/logic/markdown";

/**
 * Markdown Widget Component
 * Renders markdown content with optional sanitization
 */
export function MarkdownWidget({
  value,
  field: _field,
  context,
  className,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Extract data using shared logic
  const data = extractMarkdownData(value);

  // Handle null case
  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t("app.api.system.unifiedInterface.react.widgets.markdown.noContent")}
      </Div>
    );
  }

  const { content } = data;

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
    >
      <Markdown content={content} />
    </Div>
  );
}

MarkdownWidget.displayName = "MarkdownWidget";
