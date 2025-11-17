"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";
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
  rootFolderId: DefaultFolderId;
  currentUserId?: string;
}

export function UserMessageBubble({
  message,
  locale,
  logger,
  onBranch,
  onRetry,
  onDelete,
  showAuthor,
  rootFolderId,
  currentUserId,
}: UserMessageBubbleProps): JSX.Element {
  const persona =
    message.role === "user" || message.role === "assistant"
      ? message.persona
      : undefined;

  return (
    <Div className="flex justify-end">
      <Div className="md:max-w-[75%] group/message">
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <Div className="mb-2 flex justify-end">
            <MessageAuthorInfo
              authorName={message.authorName}
              authorId={message.authorId}
              currentUserId={currentUserId}
              isAI={message.isAI}
              model={message.model}
              timestamp={message.createdAt}
              edited={message.edited}
              persona={persona}
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
