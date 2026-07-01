"use client";

import { Platform } from "next-vibe/core/definition/platform";
import { Div } from "next-vibe/ui/web/ui/div";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetPlatform,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

interface ContentBlock {
  type: string;
  text?: string;
  data?: string;
  mimeType?: string;
}

interface BrowserResponse {
  success?: boolean;
  result?: ContentBlock[];
  error?: string;
  executionId?: string;
}

/**
 * Formats MCPContentBlock[] as readable text
 */
function formatContentBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "text" && block.text) {
        return block.text;
      }
      if (block.type === "image") {
        return `[image: ${block.mimeType ?? "unknown"}]`;
      }
      return `[${block.type}]`;
    })
    .join("\n");
}

export function BrowserToolWidget(): JSX.Element {
  const value = useWidgetValue() as BrowserResponse | null | undefined;
  const platform = useWidgetPlatform();

  const isMcp = platform === Platform.MCP;

  if (!value) {
    return <></>;
  }

  const { success, result, error, executionId } = value;

  // MCP: compact single-line format for AI consumption
  if (isMcp) {
    const lines: string[] = [];
    if (success === false) {
      lines.push(`error: ${error ?? "unknown"}`);
    }
    if (result && result.length > 0) {
      lines.push(formatContentBlocks(result));
    }
    if (executionId) {
      lines.push(`id:${executionId}`);
    }
    return <Span>{lines.join(" | ")}</Span>;
  }

  // CLI and web: structured display with content blocks
  return (
    <Div className="flex-col">
      {success === false && error && (
        <Span className="text-red-500">{`Error: ${error}`}</Span>
      )}
      {result && result.length > 0 && (
        <Span>{formatContentBlocks(result)}</Span>
      )}
      {executionId && (
        <Span className="opacity-50">{`id: ${executionId}`}</Span>
      )}
    </Div>
  );
}

BrowserToolWidget.displayName = "BrowserToolWidget";

export default BrowserToolWidget;
