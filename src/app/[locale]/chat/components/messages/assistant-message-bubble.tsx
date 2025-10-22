"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";

import { chatProse } from "../../lib/design-tokens";
import type { ChatMessage } from "../../types";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";
import { ToolCallDisplay } from "./tool-call-display";

interface AssistantMessageBubbleProps {
  message: ChatMessage;
  ttsAutoplay: boolean;
  locale?: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
  logger: EndpointLogger;
}

export function AssistantMessageBubble({
  message,
  ttsAutoplay,
  locale = "en-GLOBAL",
  onAnswerAsModel,
  onDelete,
  showAuthor = false,
  logger,
}: AssistantMessageBubbleProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get persona for assistant/user messages
  const tone =
    message.role === "assistant" || message.role === "user"
      ? message.persona
      : null;

  // Get display name for assistant
  const displayName = message.model
    ? getModelById(message.model).name
    : t("app.chat.messages.assistant");

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 max-w-[90%] sm:max-w-[85%] group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <div className="mb-2">
            <MessageAuthorInfo
              authorName={displayName}
              isAI={message.isAI}
              model={message.model}
              timestamp={message.createdAt}
              edited={message.edited}
              tone={tone}
              locale={locale}
              compact
            />
          </div>
        )}

        <div className={cn(chatProse.all, "px-3 py-2.5 sm:px-4 sm:py-3")}>
          {/* Tool calls display */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <ToolCallDisplay toolCalls={message.toolCalls} locale={locale} />
          )}

          <Markdown content={message.content} />
        </div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <div className="h-10 sm:h-8 flex items-center">
          <AssistantMessageActions
            messageId={message.id}
            content={message.content}
            ttsAutoplay={ttsAutoplay}
            locale={locale}
            onAnswerAsModel={onAnswerAsModel}
            onDelete={onDelete}
            logger={logger}
          />
        </div>
      </div>
    </div>
  );
}
