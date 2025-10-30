"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui";
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

  // Extract reasoning content from <think> tags and regular content from ASSISTANT messages
  let reasoningContent = "";
  let regularContent = "";

  // Combine all content from assistant messages
  const allContent = assistantMessages
    .map((m) => m.content)
    .filter((c) => c.trim().length > 0)
    .join("\n\n");

  // Parse <think> tags from content
  const thinkTagRegex = /<think>([\s\S]*?)<\/think>/gi;
  const thinkMatches = allContent.match(thinkTagRegex);

  if (thinkMatches) {
    // Extract reasoning content from <think> tags
    reasoningContent = thinkMatches
      .map((match) => {
        const content = match.replace(/<\/?think>/gi, "").trim();
        return content;
      })
      .join("\n\n");

    // Remove <think> tags from regular content
    regularContent = allContent.replace(thinkTagRegex, "").trim();
  } else {
    regularContent = allContent;
  }

  // Check if there's content after tool calls and reasoning
  const hasContent = regularContent.length > 0 || allToolCalls.length > 0;

  // Show streaming placeholder when no regular content yet (even if tool calls or reasoning exist)
  const isStreaming = regularContent.length === 0;

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
          {/* Reasoning display - shows thinking content from <think> tags */}
          {reasoningContent.length > 0 && (
            <ReasoningDisplay
              reasoningMessages={[
                {
                  ...primary,
                  content: reasoningContent,
                },
              ]}
              locale={locale}
              hasContent={hasContent}
            />
          )}

          {/* Tool calls display - shows all tool calls from sequence */}
          {allToolCalls.length > 0 && (
            <ToolCallRenderer
              toolCalls={allToolCalls}
              locale={locale}
              hasContent={hasContent}
            />
          )}

          {/* Regular content (without <think> tags) */}
          {regularContent.length > 0 ? (
            <Div>
              <Markdown content={regularContent} />
            </Div>
          ) : isStreaming ? (
            // Show streaming placeholder when no content yet
            <Div className="flex items-center gap-2 text-muted-foreground">
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full" />
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full animation-delay-150" />
              <Div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full animation-delay-300" />
            </Div>
          ) : null}
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        {/* Actions apply to the primary message */}
        <Div className="h-10 sm:h-8 flex items-center">
          <AssistantMessageActions
            messageId={primary.id}
            content={regularContent}
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
