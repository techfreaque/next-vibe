"use client";

import { cn } from "next-vibe/shared/utils";

import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";

import { getModelById } from "../../lib/config/models";
import { chatProse } from "../../lib/design-tokens";
import type { ChatMessage } from "../../lib/storage/types";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";

interface AssistantMessageBubbleProps {
  message: ChatMessage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
}

export function AssistantMessageBubble({
  message,
  onAnswerAsModel,
  onDelete,
  showAuthor = false,
}: AssistantMessageBubbleProps) {
  // Create author object from model and tone if not already present
  const author = message.author || {
    id: message.model || "assistant",
    name: message.model ? getModelById(message.model).name : "Assistant",
    isAI: true,
    modelId: message.model,
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
              tone={message.tone}
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
            onAnswerAsModel={onAnswerAsModel}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
