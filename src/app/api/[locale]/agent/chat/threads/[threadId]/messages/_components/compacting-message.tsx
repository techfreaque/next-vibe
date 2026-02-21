/**
 * Compacting Message Component
 * Displays history compacting operation with custom UI
 * Starts collapsed with animation, user can toggle to see full summary
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "next-vibe-ui/ui/icons";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CompactingMessageProps {
  content: string;
  isStreaming: boolean;
  isFailed?: boolean;
  compactedMessageCount?: number;
  locale: CountryLanguage;
}

export function CompactingMessage({
  content,
  isStreaming,
  isFailed,
  compactedMessageCount,
  locale,
}: CompactingMessageProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isExpanded, setIsExpanded] = useState(false);

  const contentTokens = Math.ceil(content.length / 4);

  if (isFailed) {
    return (
      <Div className="relative border border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-lg my-2 overflow-hidden shadow-sm">
        <Div className="flex items-center gap-2 p-3">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <Span className="text-sm font-medium text-red-700 dark:text-red-400">
            {t(
              "app.api.agent.chat.threads.threadId.messages.compacting.failed",
            )}
          </Span>
          {compactedMessageCount !== undefined && compactedMessageCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs bg-red-500/10 border-red-500/30 flex-shrink-0"
            >
              {compactedMessageCount}{" "}
              {compactedMessageCount === 1 ? "msg" : "msgs"}
            </Badge>
          )}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="relative border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-lg my-2 overflow-hidden shadow-sm">
      {/* Header - Always visible, fixed height to prevent layout shift */}
      <Button
        variant="ghost"
        className="w-full p-3 hover:bg-purple-500/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Div className="flex items-center justify-between w-full gap-3">
          <Div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles
              className={`h-4 w-4 text-purple-500 flex-shrink-0 ${isStreaming ? "animate-pulse" : ""}`}
            />
            <Span className="text-sm font-medium text-purple-700 dark:text-purple-300 truncate">
              {isStreaming
                ? t(
                    "app.api.agent.chat.threads.threadId.messages.compacting.loading",
                  )
                : t(
                    "app.api.agent.chat.threads.threadId.messages.compacting.title",
                  )}
            </Span>
            {compactedMessageCount !== undefined &&
              compactedMessageCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-500/10 border-purple-500/30 flex-shrink-0"
                >
                  {compactedMessageCount}{" "}
                  {compactedMessageCount === 1 ? "msg" : "msgs"}
                </Badge>
              )}
          </Div>

          <Div className="flex items-center gap-2 flex-shrink-0">
            {isStreaming ? (
              <Div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                {contentTokens > 0 && (
                  <Span className="font-medium">{contentTokens} tokens</Span>
                )}
              </Div>
            ) : (
              <Span className="text-xs text-muted-foreground font-medium">
                {contentTokens} tokens
              </Span>
            )}

            {/* Expand/collapse only when done */}
            {!isStreaming &&
              (isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ))}
          </Div>
        </Div>
      </Button>

      {/* Expandable content */}
      {!isStreaming && (
        <Div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Div className="px-4 pb-4 pt-0 border-t border-purple-500/10">
            <Div className="mt-3 text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
              {content ? (
                <Markdown content={content} messageId="compacting" />
              ) : null}
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}
