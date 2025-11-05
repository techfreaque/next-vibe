"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { getPersonaById } from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { formatRelativeTime } from "../../lib/utils/formatting";
import type { ModelId } from "../../types";

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
  /** Persona/tone used for this message */
  tone?: string | null;
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
  tone,
  locale,
  rootFolderId = "private",
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

  // Get persona name if tone is provided
  const personaName = tone ? getPersonaById(tone)?.name : null;

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
              const ModelIcon = modelData.icon;
              return typeof ModelIcon === "string" ? (
                <Span className="text-base leading-none">{ModelIcon}</Span>
              ) : (
                <ModelIcon
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              );
            })()}
          {displayName}
        </Span>

        {/* Show persona for both AI and user messages */}
        {personaName && (
          <Span className="text-xs text-muted-foreground truncate">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${personaName})`}
          </Span>
        )}

        <Span className="text-xs text-muted-foreground flex-shrink-0">
          {formatRelativeTime(timestamp.getTime())}
        </Span>

        {edited && (
          <Span className="text-xs text-muted-foreground italic flex-shrink-0">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${t("app.chat.messages.edited")})`}
          </Span>
        )}
      </Div>
    </Div>
  );
}
