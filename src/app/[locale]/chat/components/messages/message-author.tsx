"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { getModelById } from "../../lib/config/models";
import { getPersonaName } from "../../lib/config/personas";
import type { MessageAuthor } from "../../lib/storage/types";
import { formatRelativeTime } from "../../lib/utils/formatting";

interface MessageAuthorProps {
  author?: MessageAuthor;
  timestamp: number;
  edited?: boolean;
  compact?: boolean;
  className?: string;
  /** Persona/tone used for this message */
  tone?: string;
  locale: CountryLanguage;
}

export function MessageAuthorInfo({
  author,
  timestamp,
  edited = false,
  compact = false,
  className,
  tone,
  locale,
}: MessageAuthorProps): JSX.Element {
  const { t } = simpleT(locale);
  const getAuthorColor = (author?: MessageAuthor): string => {
    if (!author) {
      return "text-foreground";
    }
    if (author.color) {
      return author.color;
    }
    if (author.isAI) {
      return "text-blue-500";
    }
    return "text-foreground";
  };

  const getAuthorName = (author?: MessageAuthor): string => {
    if (!author) {
      return t("app.chat.messages.you");
    }
    return author.name;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Author info - horizontally aligned */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "font-medium truncate flex items-center gap-1.5",
            compact ? "text-xs" : "text-sm",
            getAuthorColor(author),
          )}
        >
          {/* Show model icon for AI messages */}
          {author?.isAI &&
            author.modelId &&
            ((): JSX.Element | null => {
              const model = getModelById(author.modelId);
              const ModelIcon = model.icon;
              return typeof ModelIcon === "string" ? (
                <span className="text-base leading-none">{ModelIcon}</span>
              ) : (
                <ModelIcon
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              );
            })()}
          {getAuthorName(author)}
        </span>

        {/* Show persona for both AI and user messages */}
        {tone && (
          <span className="text-xs text-muted-foreground truncate">
            {/* eslint-disable-next-line i18next/no-literal-string -- Formatting characters */}
            {`(${getPersonaName(tone)})`}
          </span>
        )}

        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatRelativeTime(timestamp)}
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
