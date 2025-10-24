"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { ChatMessage } from "../../types";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
}

export function ErrorMessageBubble({
  message,
}: ErrorMessageBubbleProps): JSX.Element {
  return (
    <Div className="flex items-start gap-3">
      <Div className="flex-1">
        <Div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
          )}
        >
          <Div className="text-sm text-red-900 dark:text-red-100">
            {message.content}
          </Div>
        </Div>

        {/* Fixed height container to maintain consistent spacing */}
        <Div className="h-8" />
      </Div>
    </Div>
  );
}
