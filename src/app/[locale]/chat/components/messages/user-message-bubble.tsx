"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "../../lib/design-tokens";
import type { ChatMessage } from "../../types";
import { MessageAuthorInfo } from "./message-author";
import { UserMessageActions } from "./user-message-actions";

interface UserMessageBubbleProps {
  message: ChatMessage;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onBranch?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
  rootFolderId?: string;
}

export function UserMessageBubble({
  message,
  locale,
  logger,
  onBranch,
  onRetry,
  onDelete,
  showAuthor = false,
  rootFolderId = "general",
}: UserMessageBubbleProps): JSX.Element {
  const tone =
    message.role === "user" || message.role === "assistant"
      ? message.persona
      : undefined;

  return (
    <Div className="flex justify-end">
      <Div className="max-w-[90%] sm:max-w-[85%] group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <Div className="mb-2 flex justify-end">
            <MessageAuthorInfo
              authorName={message.authorName}
              isAI={message.isAI}
              model={message.model}
              timestamp={message.createdAt}
              edited={message.edited}
              tone={tone}
              locale={locale}
              compact
              rootFolderId={rootFolderId}
            />
          </Div>
        )}

        <Div
          className={cn(
            "text-foreground rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
            chatColors.message.user,
            chatShadows.sm,
            chatTransitions.default,
          )}
        >
          <Div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </Div>
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <Div className="h-10 sm:h-8 flex items-center justify-end">
          <UserMessageActions
            messageId={message.id}
            content={message.content}
            locale={locale}
            logger={logger}
            onBranch={onBranch}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        </Div>
      </Div>
    </Div>
  );
}
