"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { TranslationKey } from "@/i18n/core/static-types";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
}

export function ErrorMessageBubble({
  message,
}: ErrorMessageBubbleProps): JSX.Element {
  const { t } = useTranslation();

  // Translate error message if it's a translation key
  const displayContent = t(message.content as TranslationKey);

  return (
    <Div className="flex items-start gap-3">
      <Div className="max-w-full">
        <Div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
          )}
        >
          <Div className="text-sm text-red-900 dark:text-red-100">
            {displayContent}
          </Div>
        </Div>

        {/* Fixed height container to maintain consistent spacing */}
        <Div className="h-8" />
      </Div>
    </Div>
  );
}
