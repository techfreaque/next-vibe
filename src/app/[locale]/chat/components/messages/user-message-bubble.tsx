"use client";

import { cn } from "next-vibe/shared/utils";

import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "../../lib/design-tokens";
import type { ChatMessage } from "../../lib/storage/types";
import { MessageAuthorInfo } from "./message-author";
import { UserMessageActions } from "./user-message-actions";

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
      <div className="max-w-[90%] sm:max-w-[85%] group/message">
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
            "text-white rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
            chatColors.primary.gradient,
            chatShadows.lg,
            chatTransitions.default,
          )}
        >
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <div className="h-10 sm:h-8 flex items-center justify-end">
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
