"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { FileAttachments } from "../../../_components/message-display/file-attachments";
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
  const character =
    message.role === "user" || message.role === "assistant"
      ? message.character
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
              character={character}
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

          {/* File Attachments */}
          {message.metadata?.attachments &&
            message.metadata.attachments.length > 0 && (
              <FileAttachments attachments={message.metadata.attachments} />
            )}
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
