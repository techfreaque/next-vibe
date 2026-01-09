"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import { extractMarkdownData } from "../../../shared/widgets/logic/markdown";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Markdown Widget - Renders markdown content with GitHub-flavored styling
 *
 * Displays markdown-formatted text with syntax highlighting, proper typography,
 * and sanitization. Uses prose styling for consistent readable formatting.
 *
 * Features:
 * - GitHub-flavored markdown rendering
 * - Syntax highlighting for code blocks
 * - Responsive typography with prose classes
 * - Dark mode support
 * - Automatic link styling with hover effects
 * - Code snippet highlighting with background
 * - Border and background for code blocks
 *
 * Styling:
 * - Prose typography (headings, paragraphs, lists)
 * - Semibold headings with tight tracking
 * - Primary color links with hover underline
 * - Muted background for inline code and code blocks
 * - Responsive font sizes and spacing
 *
 * Data Format:
 * - string: Raw markdown content to render
 * - object: { content: string, sanitize?: boolean }
 *   - content: Markdown text (NOT translated - raw content)
 *   - sanitize: Optional HTML sanitization flag
 * - null/undefined: Shows translated "no content" message
 *
 * Note: Markdown content is raw user/documentation content and is NOT translated.
 * Only the "no content" fallback message uses translation.
 *
 * @param value - Markdown content (string or markdown object)
 * @param context - Rendering context with locale for hardcoded messages
 * @param className - Optional CSS classes
 */
export function MarkdownWidget<const TKey extends string>({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.MARKDOWN, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
  const data = extractMarkdownData(value);

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
