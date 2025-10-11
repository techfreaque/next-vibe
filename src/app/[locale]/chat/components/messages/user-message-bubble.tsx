"use client";

import type { ChatMessage } from "../../lib/storage/types";
import { UserMessageActions } from "./user-message-actions";
import { MessageAuthorInfo } from "./message-author";
import { cn } from "next-vibe/shared/utils";
import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "../../lib/design-tokens";

interface UserMessageBubbleProps {
  message: ChatMessage;
  onBranch?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
}

export function UserMessageBubble({
  message,
  onBranch,
  onRetry,
  onDelete,
  showAuthor = false,
}: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && message.author && (
          <div className="mb-2 flex justify-end">
            <MessageAuthorInfo
              author={message.author}
              timestamp={message.timestamp}
              edited={message.metadata?.edited}
              tone={message.tone}
              compact
            />
          </div>
        )}

        <div
          className={cn(
            "text-white rounded-2xl px-4 py-3",
            chatColors.primary.gradient,
            chatShadows.lg,
            chatTransitions.default
          )}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <div className="h-8 flex items-center justify-end">
          <UserMessageActions
            messageId={message.id}
            content={message.content}
            onBranch={onBranch}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

