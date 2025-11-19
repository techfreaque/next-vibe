"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  type CodeOutputWidgetData,
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
import { isPlainObject, hasStringProperty } from "../../shared/utils/type-guards";

/**
 * Type guard for CodeOutputWidgetData
 */
function isCodeOutputWidgetData(
  data: RenderableValue,
): data is CodeOutputWidgetData {
  return isPlainObject(data) && hasStringProperty(data, "code");
}

/**
 * Code Output Widget Component
 * Displays code with syntax highlighting
 */
export function CodeOutputWidget({
  data,
  metadata: _metadata,
  context,
  className,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isCodeOutputWidgetData(data)) {
    return (
      <Div
        className={cn("italic p-4 text-muted-foreground", className)}
        
      >
        —
      </Div>
    );
  }

  const {
    code,
    language = "text",
    showLineNumbers = false,
    highlightLines = [],
    theme = context.theme ?? "light",
  } = data;

  if (!code) {
    return (
      <Div
        className={cn("italic p-4 text-muted-foreground", className)}
        
      >
        —
      </Div>
    );
  }

  const lines = code.split("\n");

  return (
    <Div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        theme === "dark" ? "bg-slate-900" : "bg-slate-50",
        className,
      )}
      
    >
      <Div className="flex items-center justify-between border-b border-border bg-accent px-4 py-2">
        <Span className="font-mono text-xs uppercase text-muted-foreground">
          {language}
        </Span>
      </Div>
      <pre
        className={cn(
          "overflow-x-auto p-4 font-mono text-sm",
          theme === "dark" ? "text-slate-100" : "text-slate-900",
        )}
      >
        <code>
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);

            return (
              <Div
                key={index}
                className={cn(
                  "flex",
                  isHighlighted && "bg-yellow-200/20 dark:bg-yellow-500/10",
                )}
              >
                {showLineNumbers && (
                  <Span className="inline-block w-12 select-none pr-4 text-right text-muted-foreground">
                    {lineNumber}
                  </Span>
                )}
                <Span className="flex-1">{line || " "}</Span>
              </Div>
            );
          })}
        </code>
      </pre>
    </Div>
  );
}

CodeOutputWidget.displayName = "CodeOutputWidget";
