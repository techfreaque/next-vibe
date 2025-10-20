"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { ChatMessage } from "../../types";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
}

export function ErrorMessageBubble({
  message,
}: ErrorMessageBubbleProps): JSX.Element {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
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
