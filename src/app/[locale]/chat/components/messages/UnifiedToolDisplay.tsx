/**
 * Unified Tool Display
 * Data-driven tool result display using widget system
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Div,
  Span,
} from "next-vibe-ui/ui";
import { ChevronDown, ChevronRight, Search } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import { useState } from "react";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ToolCallItem } from "./ToolCallItem";

interface UnifiedToolDisplayProps {
  toolCalls: ToolCall[];
  locale?: CountryLanguage;
  hasContent?: boolean; // Whether the message has content after tool calls
}

/**
 * Unified Tool Display Component
 * Renders tool calls with their results using the widget system
 */
export function UnifiedToolDisplay({
  toolCalls,
  locale = "en-GLOBAL",
  hasContent = false,
}: UnifiedToolDisplayProps): JSX.Element | null {
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
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Search className="h-4 w-4 shrink-0" />
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
            <Div className="px-3 pb-2 space-y-4">
              {toolCalls.map((toolCall, index) => (
                <ToolCallItem key={index} toolCall={toolCall} locale={locale} />
              ))}
            </Div>
          </CollapsibleContent>
        </Div>
      </Collapsible>
    </Div>
  );
}
