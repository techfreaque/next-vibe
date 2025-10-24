"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Div,
  Pre,
  Span,
} from "next-vibe-ui/ui";
import { ChevronDown, ChevronRight, Search } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ToolCall } from "../../types";

interface ToolCallDisplayProps {
  toolCalls: ToolCall[];
  locale?: CountryLanguage;
  hasContent?: boolean; // Whether the message has content after tool calls
}

export function ToolCallDisplay({
  toolCalls,
  locale = "en-GLOBAL",
  hasContent = false,
}: ToolCallDisplayProps): JSX.Element | null {
  const { t } = simpleT(locale);
  // Open by default if no content after, collapsed if there is content
  const [isOpen, setIsOpen] = useState(!hasContent);

  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <Div className="mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Div
          className={cn(
            "rounded-lg border transition-all",
            isOpen
              ? "bg-blue-500/5 border-blue-500/30"
              : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
          )}
        >
          {/* Header - Always visible */}
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-400",
                "hover:bg-blue-500/5 transition-colors rounded-lg",
              )}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              <Search className="h-4 w-4 flex-shrink-0" />
              <Span>
                {toolCalls.length === 1
                  ? t("app.chat.toolCall.search.title")
                  : t("app.chat.toolCall.multiple", {
                      count: toolCalls.length,
                    })}
              </Span>
              {!isOpen &&
                toolCalls.length === 1 &&
                toolCalls[0]?.args.query &&
                typeof toolCalls[0].args.query === "string" && (
                  <Span className="text-muted-foreground text-xs truncate">
                    - {toolCalls[0].args.query}
                  </Span>
                )}
            </button>
          </CollapsibleTrigger>

          {/* Content - Collapsible */}
          <CollapsibleContent>
            <Div className="px-3 pb-2 space-y-2">
              {toolCalls.map((toolCall, index) => (
                <Div
                  key={index}
                  className="flex items-start gap-2 px-3 py-2 rounded-md bg-background/50 border border-border/50 text-sm"
                >
                  {/* Tool icon */}
                  <Div className="flex-shrink-0 mt-0.5">
                    {toolCall.toolName === "search" ? (
                      <Search className="h-4 w-4 text-blue-400" />
                    ) : (
                      // eslint-disable-next-line i18next/no-literal-string
                      <Span className="text-blue-400">🔧</Span>
                    )}
                  </Div>

                  {/* Tool info */}
                  <Div className="flex-1 min-w-0">
                    <Div className="font-medium text-blue-400">
                      {toolCall.toolName === "search"
                        ? t("app.chat.toolCall.search.title")
                        : toolCall.toolName}
                    </Div>
                    <Div className="text-muted-foreground text-xs mt-1">
                      {toolCall.toolName === "search" &&
                      toolCall.args.query &&
                      typeof toolCall.args.query === "string" ? (
                        <Span>
                          {t("app.chat.toolCall.search.query")}:{" "}
                          <Span className="text-foreground/80">
                            {toolCall.args.query}
                          </Span>
                        </Span>
                      ) : (
                        <Pre className="text-xs overflow-x-auto">
                          {JSON.stringify(toolCall.args, null, 2)}
                        </Pre>
                      )}
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
          </CollapsibleContent>
        </Div>
      </Collapsible>
    </Div>
  );
}
