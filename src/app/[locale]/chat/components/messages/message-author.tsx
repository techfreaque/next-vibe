"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { getPersonaById } from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { formatRelativeTime } from "../../lib/utils/formatting";
import type { ModelId } from "../../types";

interface MessageAuthorProps {
  authorName: string | null;
  isAI: boolean;
  model: ModelId | null;
  timestamp: Date;
  edited?: boolean;
  compact?: boolean;
  className?: string;
  /** Persona/tone used for this message */
  tone?: string | null;
  locale: CountryLanguage;
  rootFolderId?: string;
}

export function MessageAuthorInfo({
  authorName,
  isAI,
  model,
  timestamp,
  edited = false,
  compact = false,
  className,
  tone,
  locale,
  rootFolderId = "general",
}: MessageAuthorProps): JSX.Element {
  const { t } = simpleT(locale);

  const authorColor = isAI ? "text-blue-500" : "text-foreground";

  // For private and incognito folders, show "User" instead of "You"
  const displayName = authorName ??
    (rootFolderId === "general" || rootFolderId === "shared" || rootFolderId === "public"
      ? t("app.chat.messages.you")
      : t("app.chat.messages.user"));

  // Get persona name if tone is provided
  const personaName = tone ? getPersonaById(tone)?.name : null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Author info - horizontally aligned */}
      <div className="flex items-center gap-2 min-w-0">
        <span
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
                <span className="text-base leading-none">{ModelIcon}</span>
              ) : (
                <ModelIcon
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              );
            })()}
          {displayName}
        </span>

        {/* Show persona for both AI and user messages */}
        {personaName && (
          <span className="text-xs text-muted-foreground truncate">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${personaName})`}
          </span>
        )}

        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatRelativeTime(timestamp.getTime())}
        </span>

        {edited && (
          <span className="text-xs text-muted-foreground italic flex-shrink-0">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${t("app.chat.messages.edited")})`}
          </span>
        )}
      </div>
    </div>
  );
}
