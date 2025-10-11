"use client";

import type { ChatMessage } from "../../lib/storage/types";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";
import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";
import { cn } from "next-vibe/shared/utils";
import { chatProse } from "../../lib/design-tokens";

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
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <div className="mb-2">
            <MessageAuthorInfo
              author={message.author}
              timestamp={message.timestamp}
              edited={message.metadata?.edited}
              tone={message.tone}
              compact
            />
          </div>
        )}

        <div className={chatProse.all}>
          <Markdown content={message.content} />
        </div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <div className="h-8 flex items-center">
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

