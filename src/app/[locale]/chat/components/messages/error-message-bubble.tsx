"use client";

import type { ChatMessage } from "../../lib/storage/types";
import { cn } from "next-vibe/shared/utils";
import { chatColors } from "../../lib/design-tokens";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
}

export function ErrorMessageBubble({ message }: ErrorMessageBubbleProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            chatColors.message.error
          )}
        >
          <div className="text-sm text-red-900 dark:text-red-100">
            {message.content}
          </div>
        </div>

        {/* Fixed height container to maintain consistent spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

