"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Div,
  Span,
} from "next-vibe-ui/ui";
import { ChevronDown, ChevronRight, Lightbulb } from "next-vibe-ui/ui/icons";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "../../types";

interface ReasoningDisplayProps {
  reasoningMessages: ChatMessage[];
  locale: CountryLanguage;
  hasContent?: boolean; // Whether there's content after reasoning
}

export function ReasoningDisplay({
  reasoningMessages,
  locale,
  hasContent = false,
}: ReasoningDisplayProps): JSX.Element | null {
  const { t } = simpleT(locale);
  // Open by default if no content after, collapsed if there is content
  const [isOpen, setIsOpen] = useState(!hasContent);

  if (!reasoningMessages || reasoningMessages.length === 0) {
    return null;
  }

  return (
    <Div className="mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Div
          className={cn(
            "rounded-lg border transition-all",
            isOpen
              ? "bg-purple-500/5 border-purple-500/30"
              : "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40",
          )}
        >
          {/* Header - Always visible */}
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-400",
                "hover:bg-purple-500/5 transition-colors rounded-lg",
              )}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Lightbulb className="h-4 w-4 shrink-0" />
              <Span>
                {reasoningMessages.length === 1
                  ? t("app.chat.reasoning.title")
                  : t("app.chat.reasoning.multiple", {
                      count: reasoningMessages.length,
                    })}
              </Span>
            </button>
          </CollapsibleTrigger>

          {/* Content - Collapsible */}
          <CollapsibleContent>
            <Div className="px-3 pb-2 space-y-2">
              {reasoningMessages.map((message, index) => (
                <Div
                  key={message.id}
                  className="px-3 py-2 rounded-md bg-background/50 border border-border/50 text-sm"
                >
                  {/* Reasoning step number */}
                  <Div className="flex items-start gap-2 mb-2">
                    <Div className="shrink-0 mt-0.5">
                      <Span className="text-purple-400 font-medium text-xs">
                        {t("app.chat.reasoning.step", { number: index + 1 })}
                      </Span>
                    </Div>
                  </Div>

                  {/* Reasoning content */}
                  <Div className="text-foreground/90 prose prose-sm dark:prose-invert max-w-none">
                    <Markdown content={message.content} />
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
