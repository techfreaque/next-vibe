/**
 * Markdown Widget Logic
 * Shared data extraction and processing for MARKDOWN widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed markdown data structure
 */
export interface ProcessedMarkdown {
  content: string;
  sanitize: boolean;
  allowHtml: boolean;
}

/**
 * Markdown element types
 */
export interface MarkdownElement {
  type:
    | "heading"
    | "paragraph"
    | "bold"
    | "italic"
    | "code"
    | "list"
    | "link"
    | "text";
  content: string;
  level?: number; // for headings (1-6)
  ordered?: boolean; // for lists
  url?: string; // for links
}

/**
 * Parse markdown into structured elements (data-only, no ANSI codes)
 * Returns structured data that can be rendered by both CLI and React
 */
export function parseMarkdownElements(content: string): MarkdownElement[] {
  const elements: MarkdownElement[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    // Headings: # Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      elements.push({
        type: "heading",
        content: headingMatch[2],
        level: headingMatch[1].length,
      });
      continue;
    }

    // Unordered lists: - Item or * Item
    const unorderedListMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedListMatch) {
      elements.push({
        type: "list",
        content: unorderedListMatch[1],
        ordered: false,
      });
      continue;
    }

    // Ordered lists: 1. Item
    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      elements.push({
        type: "list",
        content: orderedListMatch[1],
        ordered: true,
      });
      continue;
    }

    // Code blocks (inline): `code`
    const codeMatch = line.match(/`([^`]+)`/);
    if (codeMatch) {
      elements.push({
        type: "code",
        content: codeMatch[1],
      });
      continue;
    }

    // Links: [text](url)
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      elements.push({
        type: "link",
        content: linkMatch[1],
        url: linkMatch[2],
      });
      continue;
    }

    // Bold: **text** or __text__
    const boldMatch = line.match(/\*\*([^*]+)\*\*|__([^_]+)__/);
    if (boldMatch) {
      elements.push({
        type: "bold",
        content: boldMatch[1] || boldMatch[2],
      });
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = line.match(/\*([^*]+)\*|_([^_]+)_/);
    if (italicMatch) {
      elements.push({
        type: "italic",
        content: italicMatch[1] || italicMatch[2],
      });
      continue;
    }

    // Default: paragraph text
    elements.push({
      type: "paragraph",
      content: line,
    });
  }

  return elements;
}

/**
 * Extract and validate markdown data from WidgetData
 */
export function extractMarkdownData(
  value: WidgetData,
): ProcessedMarkdown | null {
  // Handle string value directly
  if (typeof value === "string") {
    return {
      content: value,
      sanitize: true,
      allowHtml: false,
    };
  }

  // Handle object value with markdown properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const content =
      "content" in value && typeof value.content === "string"
        ? value.content
        : "";
    const sanitize =
      "sanitize" in value && typeof value.sanitize === "boolean"
        ? value.sanitize
        : true;
    const allowHtml =
      "allowHtml" in value && typeof value.allowHtml === "boolean"
        ? value.allowHtml
        : false;

    if (!content) {
      return null;
    }

    return {
      content,
      sanitize,
      allowHtml,
    };
  }

  return null;
}
