"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";

import { getModelById } from "../../lib/config/models";
import { chatProse } from "../../lib/design-tokens";
import type { ChatMessage } from "../../lib/storage/types";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";

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

  // Create author object from model and tone if not already present
  const modelId = message.role === "assistant" ? message.model : undefined;
  const tone =
    message.role === "assistant" || message.role === "user"
      ? message.tone
      : undefined;

  const author = message.author || {
    id: modelId || "assistant",
    name: modelId
      ? getModelById(modelId).name
      : t("app.chat.messages.assistant"),
    isAI: true,
    modelId,
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 max-w-[90%] sm:max-w-[85%] group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <div className="mb-2">
            <MessageAuthorInfo
              author={author}
              timestamp={message.timestamp}
              edited={message.metadata?.edited}
              tone={tone}
              locale={locale}
              compact
            />
          </div>
        )}

        <div className={cn(chatProse.all, "px-3 py-2.5 sm:px-4 sm:py-3")}>
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
