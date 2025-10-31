"use client";

import { cn } from "next-vibe/shared/utils";
import { Collapsible } from "@/packages/next-vibe-ui/web/ui/collapsible";
import { CollapsibleContent } from "@/packages/next-vibe-ui/web/ui/collapsible";
import { CollapsibleTrigger } from "@/packages/next-vibe-ui/web/ui/collapsible";
import { Div } from "@/packages/next-vibe-ui/web/ui/div";
import { Span } from "@/packages/next-vibe-ui/web/ui/span";
import { ChevronDown } from "@/packages/next-vibe-ui/web/ui/icons/ChevronDown";
import { ChevronRight } from "@/packages/next-vibe-ui/web/ui/icons/ChevronRight";
import { Lightbulb } from "@/packages/next-vibe-ui/web/ui/icons/Lightbulb";
import { Loader2 } from "@/packages/next-vibe-ui/web/ui/icons/Loader2";
import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "../../types";

interface ReasoningDisplayProps {
  reasoningMessages: ChatMessage[];
  locale: CountryLanguage;
  hasContent?: boolean; // Whether there's content after reasoning
  isStreaming?: boolean; // Whether reasoning is currently streaming
}

export function ReasoningDisplay({
  reasoningMessages,
  locale,
  hasContent = false,
  isStreaming = false,
}: ReasoningDisplayProps): JSX.Element | null {
  const { t } = simpleT(locale);
  // Open by default if no content after OR if streaming, collapsed if there is content
  const [isOpen, setIsOpen] = useState(!hasContent || isStreaming);
  // Track if user has manually toggled the state
  const [userToggled, setUserToggled] = useState(false);

  // Auto-collapse when text content appears after thinking tags
  // BUT: respect user's manual toggle - don't auto-collapse if user has interacted
  useEffect(() => {
    // If user has manually toggled, don't auto-collapse
    if (userToggled) {
      return;
    }

    // If there's content after reasoning and we're not streaming, auto-collapse with a slight delay
    // to avoid jarring transitions during streaming
    if (hasContent && !isStreaming && isOpen) {
      // Small delay to ensure smooth transition after streaming completes
      const timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 100);

      return (): void => clearTimeout(timeoutId);
    }
  }, [hasContent, isStreaming, isOpen, userToggled]);

  if (!reasoningMessages || reasoningMessages.length === 0) {
    return null;
  }

  // Handle manual toggle by user
  const handleToggle = (open: boolean): void => {
    setIsOpen(open);
    setUserToggled(true); // Mark that user has manually interacted
  };

  return (
    <Div className="mb-3">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
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
              <Span className="flex-1 text-left">
                {t("app.chat.reasoning.title")}
              </Span>
              {isStreaming && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              )}
            </button>
          </CollapsibleTrigger>

          {/* Content - Collapsible */}
          <CollapsibleContent>
            <Div className="px-3 pb-2">
              {reasoningMessages.map((message) => (
                <Div
                  key={message.id}
                  className="px-3 py-2 rounded-md bg-background/50 border border-border/50 text-sm"
                >
                  {/* Reasoning content - no step number, just thinking content */}
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
