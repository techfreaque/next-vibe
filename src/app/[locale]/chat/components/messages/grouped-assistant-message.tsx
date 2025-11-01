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
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";
import type { MessageGroup } from "./message-grouping";

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

  // NEW ARCHITECTURE: Sort all messages by sequenceIndex
  // Each message is already a separate entity (reasoning, text, tool, error)
  const allMessages = [primary, ...continuations].toSorted(
    (a, b) => (a.sequenceIndex ?? 0) - (b.sequenceIndex ?? 0),
  );

  // Check if there's any content
  const hasContent = allMessages.some((msg) => msg.content.trim().length > 0);

  // Show streaming placeholder when no content yet
  const isStreaming = !hasContent;

  // Get all content for actions (ASSISTANT messages only, strip <think> tags)
  const allContent = allMessages
    .filter((msg) => msg.role === "assistant")
    .map((m) => m.content.replace(/<think>[\s\S]*?<\/think>/g, "").trim())
    .filter((content) => content.length > 0)
    .join("\n\n");

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
          {/* NEW ARCHITECTURE: Render messages in sequence order */}
          {allMessages.map((message, index) => {
            // Check if there's content after this message
            const hasContentAfter = allMessages
              .slice(index + 1)
              .some((m) => m.content.trim().length > 0);

            // TOOL message
            if (message.role === "tool" && message.toolCalls) {
              return (
                <ToolCallRenderer
                  key={message.id}
                  toolCalls={message.toolCalls}
                  locale={locale}
                  hasContent={hasContentAfter}
                />
              );
            }

            // ERROR message
            if (message.role === "error") {
              return (
                <Div
                  key={message.id}
                  className="mb-3 last:mb-0 p-3 border border-red-500/60 bg-red-500/10 rounded-md"
                >
                  <Div className="text-red-400 font-medium mb-1">
                    {t("app.chat.messages.error")}
                  </Div>
                  <Div className="text-foreground/90">{message.content}</Div>
                </Div>
              );
            }

            // ASSISTANT message (with inline <think> tags for reasoning)
            if (message.role === "assistant" && message.content.trim()) {
              // NEW ARCHITECTURE: Markdown component handles <think> tags
              return (
                <Div key={message.id} className="mb-3 last:mb-0">
                  <Markdown content={message.content} />
                </Div>
              );
            }

            // Skip empty messages
            return null;
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
