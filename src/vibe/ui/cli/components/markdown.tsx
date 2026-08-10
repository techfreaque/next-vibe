// CLI/MCP: render markdown content as plain text - no syntax highlighting,
// no copy buttons, no modals. Strip formatting and pass content through.

import { Text } from "ink";
import type { JSX } from "react";

import type { MarkdownProps } from "../../web/ui/markdown";

export type { MarkdownProps } from "../../web/ui/markdown";

function stripMarkdown(content: string): string {
  return (
    content
      // Remove think blocks (tags + content)
      .replaceAll(/<think>[\s\S]*?<\/think>/gi, "")
      // Remove Chat tags but keep content
      .replaceAll(/<Chat>([\s\S]*?)<\/Chat>/gi, "$1")
      // Remove headings markers
      .replaceAll(/^#{1,6}\s+/gm, "")
      // Remove bold/italic
      .replaceAll(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replaceAll(/_{1,3}([^_]+)_{1,3}/g, "$1")
      // Remove inline code backticks
      .replaceAll(/`([^`]+)`/g, "$1")
      // Remove code fences
      .replaceAll(/^```[\s\S]*?```/gm, "")
      // Remove blockquote markers
      .replaceAll(/^>\s+/gm, "")
      // Remove horizontal rules
      .replaceAll(/^[-*_]{3,}\s*$/gm, "")
      // Remove image syntax
      .replaceAll(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove link syntax but keep text
      .replaceAll(/\[([^\]]+)\]\([^)]*\)/g, "$1")
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
