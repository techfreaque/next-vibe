"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { formatRelativeTime } from "@/app/[locale]/chat/lib/utils/formatting";
import { getCharacterById } from "@/app/api/[locale]/agent/chat/characters/config";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface MessageAuthorProps {
  authorName: string | null;
  authorId: string | null;
  currentUserId: string | undefined;
  isAI: boolean;
  model: ModelId | null;
  timestamp: Date;
  edited?: boolean;
  compact?: boolean;
  className?: string;
  /** Character used for this message */
  character?: string | null;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
}

export function MessageAuthorInfo({
  authorName,
  authorId,
  currentUserId,
  isAI,
  model,
  timestamp,
  edited = false,
  compact = false,
  className,
  character,
  locale,
  rootFolderId = DefaultFolderId.PRIVATE,
}: MessageAuthorProps): JSX.Element {
  const { t } = simpleT(locale);

  const authorColor = isAI ? "text-blue-500" : "text-foreground";

  // Determine display name based on author
  let displayName: string;
  if (isAI) {
    // AI messages show model name or "Assistant"
    displayName = authorName ?? t("app.chat.messages.assistant");
  } else if (currentUserId && authorId === currentUserId) {
    // Current user's messages show "You"
    displayName = t("app.chat.messages.you");
  } else if (authorName) {
    // Other users show their name
    displayName = authorName;
  } else {
    // No author info - show "Anonymous" for public/shared, "User" for private/incognito
    displayName =
      rootFolderId === "private" ||
      rootFolderId === "shared" ||
      rootFolderId === "public"
        ? t("app.chat.messages.anonymous")
        : t("app.chat.messages.user");
  }

  // Get character name if character is provided
  const characterData = character ? getCharacterById(character) : null;
  const characterName = characterData?.name ? t(characterData.name) : null;

  return (
    <Div className={cn("flex items-center gap-2", className)}>
      {/* Author info - horizontally aligned */}
      <Div className="flex items-center gap-2 min-w-0">
        <Span
          className={cn(
            "font-medium truncate flex items-center gap-1.5",
            compact ? "text-xs" : "text-sm",
            authorColor,
          )}
        >
          {/* Show model icon for AI messages */}
          {isAI &&
            model &&
            ((): JSX.Element | null => {
              const modelData = getModelById(model);
              const ModelIcon = getIconComponent(modelData.icon);
              return (
                <ModelIcon
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              );
            })()}
          {displayName}
        </Span>

        {/* Show character for both AI and user messages */}
        {characterName && (
          <Span className="text-xs text-muted-foreground truncate">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${characterName})`}
          </Span>
        )}

        <Span className="text-xs text-muted-foreground shrink-0">
          {formatRelativeTime(timestamp.getTime())}
        </Span>

        {edited && (
          <Span className="text-xs text-muted-foreground italic shrink-0">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${t("app.chat.messages.edited")})`}
          </Span>
        )}
      </Div>
    </Div>
  );
}
