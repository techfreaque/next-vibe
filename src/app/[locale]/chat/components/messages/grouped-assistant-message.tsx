"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";

import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { ToolCallRenderer } from "@/app/api/[locale]/v1/core/system/unified-interface/ai/tool-call-renderer";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { chatProse } from "../../lib/design-tokens";
import type { ChatMessage } from "../../types";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";
import type { MessageGroup } from "./message-grouping";
import { ReasoningDisplay } from "./reasoning-display";

interface GroupedAssistantMessageProps {
  group: MessageGroup;
  ttsAutoplay: boolean;
  locale: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
  logger: EndpointLogger;
}

/**
 * Grouped Assistant Message Component
 * Displays a sequence of AI messages as a single grouped message
 * Shows one header/avatar for the entire sequence
 */
export function GroupedAssistantMessage({
  group,
  ttsAutoplay,
  locale,
  onAnswerAsModel,
  onDelete,
  showAuthor = false,
  logger,
}: GroupedAssistantMessageProps): JSX.Element {
  const { t } = simpleT(locale);
  const { primary, continuations } = group;

  // Get persona for assistant messages
  const tone =
    primary.role === "assistant" || primary.role === "user"
      ? primary.persona
      : null;

  // Get display name for assistant
  const displayName = primary.model
    ? getModelById(primary.model).name
    : t("app.chat.messages.assistant");

  // Separate TOOL messages from ASSISTANT messages
  const toolMessages: ChatMessage[] = [];
  const assistantMessages: ChatMessage[] = [];

  // Check primary message
  if (primary.role === "tool") {
    toolMessages.push(primary);
  } else {
    assistantMessages.push(primary);
  }

  // Check continuation messages
  continuations.forEach((msg) => {
    if (msg.role === "tool") {
      toolMessages.push(msg);
    } else {
      assistantMessages.push(msg);
    }
  });

  // Get all tool calls from TOOL messages AND from ASSISTANT messages
  // Tool calls can be stored in either:
  // 1. Separate TOOL messages (legacy)
  // 2. ASSISTANT message's toolCalls property (new implementation)
  const allToolCalls = [
    ...toolMessages.flatMap((msg) => msg.toolCalls || []),
    ...assistantMessages.flatMap((msg) => msg.toolCalls || []),
  ];

  // Parse content into ordered segments: reasoning, text, tool calls
  // We need to preserve the order: <think>...</think> text toolcall <think>...</think> text
  const allContent = assistantMessages
    .map((m) => m.content)
    .filter((c) => c.trim().length > 0)
    .join("\n\n");

  // Split content into segments while preserving order
  type ContentSegment =
    | { type: "reasoning"; content: string; isStreaming?: boolean }
    | { type: "text"; content: string }
    | { type: "toolCalls" };

  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  // Find all <think> tags and split content around them
  const thinkTagRegex = /<think>([\s\S]*?)<\/think>/gi;
  let match: RegExpExecArray | null;
  let hasOpenThinkTag = false;

  // Check if there's an unclosed <think> tag (streaming reasoning)
  const openThinkMatch = allContent.match(/<think>(?![\s\S]*<\/think>)/);
  if (openThinkMatch) {
    hasOpenThinkTag = true;
  }

  while ((match = thinkTagRegex.exec(allContent)) !== null) {
    // Add text before this <think> tag
    if (match.index > lastIndex) {
      const textBefore = allContent.substring(lastIndex, match.index).trim();
      if (textBefore) {
        segments.push({ type: "text", content: textBefore });
      }
    }

    // Add reasoning content
    const reasoningContent = match[1].trim();
    if (reasoningContent) {
      segments.push({ type: "reasoning", content: reasoningContent });
    }

    lastIndex = match.index + match[0].length;
  }

  // Handle unclosed <think> tag (streaming reasoning)
  if (hasOpenThinkTag && openThinkMatch) {
    const streamingReasoningStart = allContent.indexOf("<think>", lastIndex);
    if (streamingReasoningStart !== -1) {
      // Add text before streaming reasoning
      if (streamingReasoningStart > lastIndex) {
        const textBefore = allContent
          .substring(lastIndex, streamingReasoningStart)
          .trim();
        if (textBefore) {
          segments.push({ type: "text", content: textBefore });
        }
      }

      // Add streaming reasoning
      const streamingContent = allContent
        .substring(streamingReasoningStart + 7)
        .trim(); // +7 for "<think>"
      if (streamingContent) {
        segments.push({
          type: "reasoning",
          content: streamingContent,
          isStreaming: true,
        });
      }

      lastIndex = allContent.length;
    }
  }

  // Add remaining text after last <think> tag
  if (lastIndex < allContent.length) {
    const textAfter = allContent.substring(lastIndex).trim();
    if (textAfter) {
      segments.push({ type: "text", content: textAfter });
    }
  }

  // Insert tool calls at the right position:
  // - After all reasoning blocks (both complete and streaming)
  // - Before any text content that comes after reasoning
  if (allToolCalls.length > 0) {
    const lastReasoningIndex = segments.findLastIndex(
      (s) => s.type === "reasoning",
    );
    if (lastReasoningIndex !== -1) {
      // Insert tool calls after last reasoning
      segments.splice(lastReasoningIndex + 1, 0, { type: "toolCalls" });
    } else {
      // No reasoning, insert at the beginning
      segments.unshift({ type: "toolCalls" });
    }
  }

  // Check if there's any content
  const hasContent = segments.length > 0;

  // Show streaming placeholder when no content yet
  const isStreaming = segments.length === 0;

  return (
    <Div className="flex items-start gap-3">
      <Div className="flex-1 max-w-[90%] sm:max-w-[85%] group/message">
        {/* Author info - shown once for the entire sequence */}
        {showAuthor && (
          <Div className="mb-2">
            <MessageAuthorInfo
              authorName={displayName}
              isAI={primary.isAI}
              model={primary.model}
              timestamp={primary.createdAt}
              edited={primary.edited}
              tone={tone}
              locale={locale}
              compact
            />
          </Div>
        )}

        <Div className={cn(chatProse.all, "px-3 py-2.5 sm:px-4 sm:py-3")}>
          {/* Render content in order: reasoning, tool calls, text */}
          {segments.map((segment, index) => {
            if (segment.type === "reasoning") {
              // Check if there's any text content after this reasoning block
              const hasContentAfterReasoning = segments
                .slice(index + 1)
                .some((s) => s.type === "text" && s.content.trim().length > 0);

              return (
                <ReasoningDisplay
                  key={`reasoning-${index}`}
                  reasoningMessages={[
                    {
                      ...primary,
                      content: segment.content,
                    },
                  ]}
                  locale={locale}
                  hasContent={hasContentAfterReasoning}
                  isStreaming={segment.isStreaming}
                />
              );
            } else if (segment.type === "toolCalls") {
              return (
                <ToolCallRenderer
                  key={`toolcalls-${index}`}
                  toolCalls={allToolCalls}
                  locale={locale}
                  hasContent={hasContent}
                />
              );
            } else {
              // Text segment
              return (
                <Div key={`text-${index}`} className="mb-3 last:mb-0">
                  <Markdown content={segment.content} />
                </Div>
              );
            }
          })}

          {/* Show streaming placeholder when no content yet */}
          {isStreaming && (
            <Div className="flex items-center gap-2 text-muted-foreground">
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full" />
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full animation-delay-150" />
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full animation-delay-300" />
            </Div>
          )}
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        {/* Actions apply to the primary message */}
        <Div className="h-10 sm:h-8 flex items-center">
          <AssistantMessageActions
            messageId={primary.id}
            content={allContent}
            ttsAutoplay={ttsAutoplay}
            locale={locale}
            onAnswerAsModel={onAnswerAsModel}
            onDelete={onDelete}
            logger={logger}
          />
        </Div>
      </Div>
    </Div>
  );
}
