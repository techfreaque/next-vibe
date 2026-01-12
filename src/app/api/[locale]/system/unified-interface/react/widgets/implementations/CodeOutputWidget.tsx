"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { Code } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import {
  extractCodeOutputData,
  isLineHighlighted,
  splitCodeIntoLines,
} from "../../../shared/widgets/logic/code-output";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Displays code with syntax highlighting and optional line numbers.
 */
export function CodeOutputWidget<const TKey extends string>({
  value,
  field,
  className,
}: ReactWidgetProps<typeof WidgetType.CODE_OUTPUT, TKey>): JSX.Element {
  const {
    emptyPadding,
    headerPadding,
    languageLabelSize,
    codePadding,
    codeTextSize,
    lineNumberWidth,
    lineNumberSpacing,
    borderRadius,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const emptyPaddingClass = getSpacingClassName("padding", emptyPadding);
  const headerPaddingClass = getSpacingClassName("padding", headerPadding);
  const languageLabelSizeClass = getTextSizeClassName(languageLabelSize);
  const codePaddingClass = getSpacingClassName("padding", codePadding);
  const codeTextSizeClass = getTextSizeClassName(codeTextSize);
  const lineNumberSpacingClass = getSpacingClassName("padding", lineNumberSpacing);

  // Line number width mapping
  const lineNumberWidthClass =
    lineNumberWidth === "sm" ? "w-8" : lineNumberWidth === "lg" ? "w-16" : "w-12";

  // Border radius mapping
  const borderRadiusClass =
    borderRadius === "none"
      ? "rounded-none"
      : borderRadius === "sm"
        ? "rounded-sm"
        : borderRadius === "base"
          ? "rounded"
          : borderRadius === "xl"
            ? "rounded-xl"
            : "rounded-lg";

  const data = extractCodeOutputData(value);

  if (!data) {
    return (
      <Div className={cn("italic text-muted-foreground", emptyPaddingClass || "p-4", className)}>
        —
      </Div>
    );
  }

  const { code, language, showLineNumbers, highlightLines } = data;
  const lines = splitCodeIntoLines(code);

  return (
    <Div
      className={cn(
        "overflow-hidden border border-border",
        borderRadiusClass,
        "dark:bg-slate-900 light:bg-slate-50",
        className,
      )}
    >
      <Div
        className={cn(
          "flex items-center justify-between border-b border-border bg-accent",
          headerPaddingClass || "px-4 py-2",
        )}
      >
        <Span
          className={cn(
            "font-mono uppercase text-muted-foreground",
            languageLabelSizeClass || "text-xs",
          )}
        >
          {language}
        </Span>
      </Div>
      <Pre
        className={cn(
          "overflow-x-auto font-mono",
          codePaddingClass || "p-4",
          codeTextSizeClass || "text-sm",
          "dark:text-slate-100 light:text-slate-900",
        )}
      >
        <Code>
          {lines.map((line: string, index: number) => {
            const lineNumber = index + 1;
            const highlighted = isLineHighlighted(lineNumber, highlightLines);

            return (
              <Div
                key={index}
                className={cn("flex", highlighted && "bg-yellow-200/20 dark:bg-yellow-500/10")}
              >
                {showLineNumbers && (
                  <Span
                    className={cn(
                      "inline-block select-none text-right text-muted-foreground",
                      lineNumberWidthClass,
                      lineNumberSpacingClass || "pr-4",
                    )}
                  >
                    {lineNumber}
                  </Span>
                )}
                <Span className="flex-1">{line || " "}</Span>
              </Div>
            );
          })}
        </Code>
      </Pre>
    </Div>
  );
}

CodeOutputWidget.displayName = "CodeOutputWidget";
