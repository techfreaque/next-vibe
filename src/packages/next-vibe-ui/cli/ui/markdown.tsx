// CLI/MCP: render markdown content as plain text - no syntax highlighting,
// no copy buttons, no modals. Strip formatting and pass content through.

import { Text } from "ink";
import type { JSX } from "react";

import type { MarkdownProps } from "../../web/ui/markdown";

export type { MarkdownProps } from "../../web/ui/markdown";

function stripMarkdown(content: string): string {
  return (
    content
      // Remove think tags
      .replace(/<\/?think>/gi, "")
      // Remove Chat tags but keep content
      .replace(/<Chat>([\s\S]*?)<\/Chat>/gi, "$1")
      // Remove headings markers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
      // Remove inline code backticks
      .replace(/`([^`]+)`/g, "$1")
      // Remove code fences
      .replace(/^```[\s\S]*?```/gm, "")
      // Remove blockquote markers
      .replace(/^>\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Remove image syntax
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove link syntax but keep text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim()
  );
}

export function Markdown({ content }: MarkdownProps): JSX.Element {
  const plain = stripMarkdown(content);
  return <Text>{plain}</Text>;
}

// Re-export CodeBlock and CodeSnippet as text-only versions
export function CodeBlock({
  code,
}: {
  code: string;
  language: string;
  minimal?: boolean;
}): JSX.Element {
  return <Text>{code}</Text>;
}

export function CodeSnippet({
  code,
}: {
  code: string;
  language: string;
  filename?: string;
  variant?: "bare" | "card" | "file";
  size?: "sm" | "md";
  noCopy?: boolean;
}): JSX.Element {
  return <Text>{code}</Text>;
}
